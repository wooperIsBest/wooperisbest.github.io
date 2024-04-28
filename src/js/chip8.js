/*
	main.js
*/
const c = document.getElementById("game");
const ctx = c.getContext("2d");

const screenWidth = 64;
const screenHeight = 32;
const screenSize = 15;

c.width = screenWidth * screenSize;
c.height = screenHeight * screenSize;

const fontAddress = "https://raw.githubusercontent.com/wooperIsBest/wooperisbest.github.io/main/resources/other/chip8-font.txt";
const resources = {
	"font" : [],
	"instructions" : []
};

function loadResource(name, data){
	resources[name] = data;
	var allResourcesLoaded = true;
	for(var resource in resources){
		if(resources[resource].length == 0){
			allResourcesLoaded = false;
		}
	}
	if(allResourcesLoaded){
		CPU.start();
	}
}

function request(url, handler){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			handler(xmlHttp.responseText);
		}
	}
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}
request(fontAddress, (text) => { //Loads the font set
	text = text.split(" ");
	for(var i = 0 ; i < text.length; i++){
		CPU.memory[i] = parseInt("0x" + text[i]);
	}
	loadResource("font", text);
});
async function loadRom(address) { //Loads the instruction set from a binary file
	const response = await fetch(address);
	const arrayBuffer = await response.arrayBuffer();
	const romData = new Uint8Array(arrayBuffer);
	
	for (var i = 0; i < romData.length; i++) {
		CPU.memory[0x200 + i] = romData[i];
    }
	
	loadResource("instructions", romData);
}

/*
	CPU.js
*/
const CPU = {
	"reset" : () => {
		CPU.memory = new Uint8Array(4096); 	//0x200 (512) Start of most programs
		CPU.registers = new Uint8Array(16); //General purpose registers
		CPU.I = 0; 							//Stores memory addresses
		CPU.PC = 0x200; 					//Program counter, start of most programs
		CPU.SP = -1; 						//Stack pointer
		CPU.stack = new Uint16Array(16);	//Return address from subroutines
		CPU.timer = 0;						//Multipurpose timer
		CPU.sound = 0;						//Sound timer
		CPU.keyboard = [];					//Keys pressed [0-F]
		CPU.running = false;				//Halts operations while false
		
		for(var i = 0 ; i < resources.font.length; i++){
			CPU.memory[i] = parseInt("0x" + resources.font[i]);
		}
		
		for(var i = 0; i < 16; i++){
			CPU.keyboard.push(false);
		}
		
		for(var i = 0; i < screenWidth * screenHeight; i++){
			screen[i] = 0;
		}
	},
	"start" : () => {
		CPU.running = true;
		screen = [];
		CPU.cycle();
		CPU.timers();
	},
	"runInstruction" : (inst) => {
		for(const instruction of instructions){
			if((instruction.mask & inst) === instruction.key){ //if matching instruction
				var arguments = [];
				for(const arg of instruction.args){
					arguments.push((inst & arg.mask) >> arg.shift);
				}
				
				instruction.run(arguments);
				return;
			}
		}
		console.log("Invalid instruction", CPU.PC, inst);
	},
	"cycle" : () => {
		if(CPU.running){
			var inst = (CPU.memory[CPU.PC] << 8) + CPU.memory[CPU.PC + 1]; //Puts together the instruction from two memory addresses
			
			CPU.runInstruction(inst);
			CPU.PC += 2;
			
			if(CPU.PC >= CPU.memory.length){
				console.log("Memory out of bounds!");
				CPU.running = false;
			}
		
			for(var key = 0; key < hexKeys.length; key++){
				CPU.keyboard[key] = cic.getKey(hexKeys[key]);
			}
			
			window.setTimeout(CPU.cycle, 3);
		}
	},
	"timers" : () => {
		if(CPU.running){
			if(CPU.timer > 0) CPU.timer--;
			if(CPU.sound > 0) CPU.sound--;
			window.setTimeout(CPU.timers, 1000 / 60);
		}
	}
}

CPU.reset();

/*
	instructions.js
*/
const instructions = [
	{ //00E0 - CLS
		"name" : "CLS",
		"mask" : 0xffff,
		"key" : 0x00E0,
		"args" : [],
		"run" : (args) => {
			screen = [];
			for(var i = screen.length; i < screenWidth * screenHeight; i++){
				screen.push(false);
			}
		}
	},
	{ //00EE - RET
		"name" : "RET",
		"mask" : 0xffff,
		"key" : 0x00EE,
		"args" : [],
		"run" : (args) => {
			CPU.PC = CPU.stack[CPU.SP];
			CPU.SP--;
		}
	},
	{ //1nnn - JP addr
		"name" : "JP",
		"mask" : 0xf000,
		"key" : 0x1000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 0}, //n
			{"mask" : 0x00f0, "shift" : 0}, //n
			{"mask" : 0x000f, "shift" : 0}, //n
		],
		"run" : (args) => {
			CPU.PC = args[0] + args[1] + args[2] - 2;
		}
	},
	{ //2nnn - CALL addr
		"name" : "CALL",
		"mask" : 0xf000,
		"key" : 0x2000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 0}, //n
			{"mask" : 0x00f0, "shift" : 0}, //n
			{"mask" : 0x000f, "shift" : 0}, //n
		],
		"run" : (args) => {
			CPU.SP++;
			CPU.stack[CPU.SP] = CPU.PC;
			CPU.PC = args[0] + args[1] + args[2] - 2;
		}
	},
	{ //3xkk - SE Vx, byte
		"name" : "SE",
		"mask" : 0xf000,
		"key" : 0x3000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 0}, //k
			{"mask" : 0x000f, "shift" : 0}, //k
		],
		"run" : (args) => {
			if(CPU.registers[args[0]] === args[1] + args[2]){
				CPU.PC += 2;
			}
		}
	},
	{ //4xkk - SNE Vx, byte
		"name" : "SNE",
		"mask" : 0xf000,
		"key" : 0x4000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 0}, //k
			{"mask" : 0x000f, "shift" : 0}, //k
		],
		"run" : (args) => {
			if(CPU.registers[args[0]] !== args[1] + args[2]){
				CPU.PC += 2;
			}
		}
	},
	{ //5xk0 - SE Vx, Vy
		"name" : "SE",
		"mask" : 0xf00f,
		"key" : 0x5000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			if(CPU.registers[args[0]] === CPU.registers[args[1]]){
				CPU.PC += 2;
			}
		}
	},
	{ //6xkk - LD Vx, byte
		"name" : "LD",
		"mask" : 0xf000,
		"key" : 0x6000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 0}, //k
			{"mask" : 0x000f, "shift" : 0}, //k
		],
		"run" : (args) => {
			CPU.registers[args[0]] = args[1] + args[2];
		}
	},
	{ //7xkk - ADD Vx, byte
		"name" : "ADD",
		"mask" : 0xf000,
		"key" : 0x7000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 0}, //k
			{"mask" : 0x000f, "shift" : 0}, //k
		],
		"run" : (args) => {
			CPU.registers[args[0]] += args[1] + args[2];
		}
	},
	{ //8xy0 - LD Vx, Vy
		"name" : "LD",
		"mask" : 0xf00f,
		"key" : 0x8000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			CPU.registers[args[0]] = CPU.registers[args[1]];
		}
	},
	{ //8xy1 - OR Vx, Vy
		"name" : "OR",
		"mask" : 0xf00f,
		"key" : 0x8001,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			CPU.registers[args[0]] = CPU.registers[args[0]] | CPU.registers[args[1]];
		}
	},
	{ //8xy2 - AND Vx, Vy
		"name" : "AND",
		"mask" : 0xf00f,
		"key" : 0x8002,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			CPU.registers[args[0]] = CPU.registers[args[0]] & CPU.registers[args[1]];
		}
	},
	{ //8xy3 - XOR Vx, Vy
		"name" : "XOR",
		"mask" : 0xf00f,
		"key" : 0x8003,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			CPU.registers[args[0]] = CPU.registers[args[0]] ^ CPU.registers[args[1]];
		}
	},
	{ //8xy4 - ADD Vx, Vy
		"name" : "ADD",
		"mask" : 0xf00f,
		"key" : 0x8004,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			var res = CPU.registers[args[0]] + CPU.registers[args[1]];
			if(res > 255){
				CPU.registers[15] = 1;
			}else{
				CPU.registers[15] = 0;
			}
			CPU.registers[args[0]] = res;
		}
	},
	{ //8xy5 - SUB Vx, Vy
		"name" : "SUB",
		"mask" : 0xf00f,
		"key" : 0x8005,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			var res = CPU.registers[args[0]] - CPU.registers[args[1]];
			if(CPU.registers[args[0]] > CPU.registers[args[1]]){
				CPU.registers[15] = 1;
			}else{
				CPU.registers[15] = 0;
			}
			CPU.registers[args[0]] = res;
		}
	},
	{ //8xy6 - SHR Vx
		"name" : "SHR",
		"mask" : 0xf00f,
		"key" : 0x8006,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			if(CPU.registers[args[0]] % 2 == 0){
				CPU.registers[15] = 0;
			}else{
				CPU.registers[15] = 1;
			}
			CPU.registers[args[0]] = CPU.registers[args[0]] >> 1;
		}
	},
	{ //8xy7 - SUBN Vx, Vy
		"name" : "SUBN",
		"mask" : 0xf00f,
		"key" : 0x8007,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			var res = CPU.registers[args[1]] - CPU.registers[args[0]];
			if(CPU.registers[args[1]] > CPU.registers[args[0]]){
				CPU.registers[15] = 1;
			}else{
				CPU.registers[15] = 0;
			}
			CPU.registers[args[0]] = res;
		}
	},
	{ //8xyE - SHL Vx
		"name" : "SHL",
		"mask" : 0xf00f,
		"key" : 0x800E,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			if(CPU.registers[args[0]] < 128){
				CPU.registers[15] = 0;
			}else{
				CPU.registers[15] = 1;
			}
			CPU.registers[args[0]] = CPU.registers[args[0]] << 1;
		}
	},
	{ //9xk0 - SNE Vx, Vy
		"name" : "SNE",
		"mask" : 0xf00f,
		"key" : 0x9000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
		],
		"run" : (args) => {
			if(CPU.registers[args[0]] !== CPU.registers[args[1]]){
				CPU.PC += 2;
			}
		}
	},
	{ //Annn - LD I, addr
		"name" : "LD",
		"mask" : 0xf000,
		"key" : 0xA000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 0}, //n
			{"mask" : 0x00f0, "shift" : 0}, //n
			{"mask" : 0x000f, "shift" : 0}, //n
		],
		"run" : (args) => {
			CPU.I = args[0] + args[1] + args[2];
		}
	},
	{ //Bnnn - JP V0, addr
		"name" : "JP",
		"mask" : 0xf000,
		"key" : 0xB000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 0}, //n
			{"mask" : 0x00f0, "shift" : 0}, //n
			{"mask" : 0x000f, "shift" : 0}, //n
		],
		"run" : (args) => {
			CPU.PC = args[0] + args[1] + args[2] + CPU.registers[0] - 2;
		}
	},
	{ //Cxkk - RND Vx, byte
		"name" : "RND",
		"mask" : 0xf000,
		"key" : 0xC000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 0}, //k
			{"mask" : 0x000f, "shift" : 0}, //k
		],
		"run" : (args) => {
			var rnd = Math.round(Math.random() * 255);
			CPU.registers[args[0]] = rnd & (args[1] + args[2]);
		}
	},
	{ //Dxyn - DRW Vx, Vy, nibble
		"name" : "DRW",
		"mask" : 0xf000,
		"key" : 0xD000,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
			{"mask" : 0x00f0, "shift" : 4}, //Vy
			{"mask" : 0x000f, "shift" : 0}, //n
		],
		"run" : (args) => {
			var sprite = [];
			for(var i = CPU.I; i < CPU.I + args[2]; i++){
				sprite.push(CPU.memory[i]);
			}
			
			CPU.registers[15] = 0;
			for(var y = 0; y < sprite.length; y++){
				var shift = 7;
				for(var x = 0; x < 8; x++){
					var xOffset = CPU.registers[args[0]] + x;
					var yOffset = (CPU.registers[args[1]] + y);
					if(xOffset >= screenWidth){
						xOffset -= screenWidth;
					}
					if(yOffset >= screenHeight){
						yOffset -= screenHeight;
					}
					var previousValue = screen[xOffset + yOffset * screenWidth];
					var newValue = (sprite[y] >> shift) % 2 == 1;
					screen[xOffset + yOffset * screenWidth] = previousValue ^ newValue;
					if(previousValue == true && newValue == false){
						CPU.registers[15] = 1;
					}
					
					shift--;
				}
			}
			render();
		}
	},
	{ //Ex9E - SKP Vx
		"name" : "SKP",
		"mask" : 0xF0FF,
		"key" : 0xE09E,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			if(CPU.keyboard[CPU.registers[args[0]]]){
				CPU.PC += 2;
			}
		}
	},
	{ //ExA1 - SKNP Vx
		"name" : "SKNP",
		"mask" : 0xF0FF,
		"key" : 0xE0A1,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			if(!CPU.keyboard[CPU.registers[args[0]]]){
				CPU.PC += 2;
			}
		}
	},
	{ //Fx07 - LD Vx, DT
		"name" : "LD",
		"mask" : 0xF0FF,
		"key" : 0xF007,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			CPU.registers[args[0]] = CPU.timer;
		}
	},
	{ //Fx0A - LD Vx, K
		"name" : "LD",
		"mask" : 0xF0FF,
		"key" : 0xF00A,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			var anyKeyPressed = -1;
			for(var i = 0; i < CPU.keyboard.length; i++){
				if(CPU.keyboard[i]){
					anyKeyPressed = i;
					break;
				}
			}
			if(anyKeyPressed !== -1){
				CPU.registers[args[0]] = anyKeyPressed;
			}else{
				CPU.PC -= 2;
			}
		}
	},
	{ //Fx15 - LD DT, Vx
		"name" : "LD",
		"mask" : 0xF0FF,
		"key" : 0xF015,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			CPU.timer = CPU.registers[args[0]];
		}
	},
	{ //Fx18 - LD ST, Vx
		"name" : "LD",
		"mask" : 0xF0FF,
		"key" : 0xF018,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			CPU.sound = CPU.registers[args[0]];
		}
	},
	{ //Fx1E - ADD I, Vx
		"name" : "ADD",
		"mask" : 0xF0FF,
		"key" : 0xF01E,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			CPU.I += CPU.registers[args[0]];
		}
	},
	{ //Fx29 - LD F, Vx
		"name" : "LD",
		"mask" : 0xF0FF,
		"key" : 0xF029,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			CPU.I = CPU.registers[args[0]] * 5;
		}
	},
	{ //Fx33 - LD B, Vx
		"name" : "LD",
		"mask" : 0xF0FF,
		"key" : 0xF033,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			var BCD = CPU.registers[args[0]].toString();
			while(BCD.length < 3){
				BCD = "0" + BCD;
			}
			for(var i = 0; i < 3; i++){
				CPU.memory[CPU.I + i] = parseInt(BCD[0 + i]);
			}
		}
	},
	{ //Fx55 - LD [I], Vx
		"name" : "LD",
		"mask" : 0xF0FF,
		"key" : 0xF055,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			for(var i = 0; i <= args[0]; i++){
				CPU.memory[CPU.I + i] = CPU.registers[i];
			}
		}
	},
	{ //Fx65 - LD Vx, [I]
		"name" : "LD",
		"mask" : 0xF0FF,
		"key" : 0xF065,
		"args" : [
			{"mask" : 0x0f00, "shift" : 8}, //Vx
		],
		"run" : (args) => {
			for(var i = 0; i <= args[0]; i++){
				CPU.registers[i] = CPU.memory[CPU.I + i];
			}
		}
	},
]

/*
	inputOutput.js
*/
const cic = new CanvasInteractionClient(c);
const hexKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

var screen = [];
for(var i = screen.length; i < screenWidth * screenHeight; i++){
	screen.push(0);
}

function render(){
	for(var i = 0; i < screen.length; i++){
		if(screen[i]){
			ctx.fillStyle = "white";
		}else{
			ctx.fillStyle = "black";
		}
		ctx.fillRect(i * screenSize - (Math.floor(i / screenWidth) * screenSize * screenWidth), Math.floor(i / screenWidth) * screenSize, screenSize, screenSize);
	}
}

function resetAndLoad(address){
	CPU.reset();
	render();
	loadRom(address);
}

render();
