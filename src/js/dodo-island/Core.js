const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

// Variables
var keysDown = {}; //Multi frame key holds
var keysPressed = []; //One frame key presses

var objects = [];
document.addEventListener("keyup", (e) => { keysDown[e.key] = false; });
document.addEventListener("keydown", (e) => {
	document.getElementById("Music").play()
	if(e.key == "ArrowUp" || e.key == "ArrowDown"){
		e.preventDefault();
	}
	keysDown[e.key] = true;
	keysPressed.push(e.key);
});

window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}

window.onload = gameTick;

var sharks1 = [];
var sharks2 = [];

var game = {
    "gameState" : "menu",
    "maxTime" : Infinity,
    "timeLeft" : Infinity,
    "frame" : 0,
    "inMenu" : false,
    "currentLevel" : 0,
	"gameOver" : false,
	"damage" : 0,
	"dodoState" : "free",
}

var resources = {
    "wood" : 0,
    "grass" : 0,
    "iron" : 0,
    "wool" : 0
}

function loadLevel(levelNum){
    for(var obj in objects){
        delete objects[obj];
    }
    objects = [];
    if(window["level" + levelNum + "JSON"]){
		var levelData = window["level" + levelNum + "JSON"];
		for(const funct of levelData.functions){
			eval(funct);
		}
	}else{
		game.gameState = "win";
	}
}

function gameTick(){
	game.frame++;
    if(!game.gameOver){
		switch(game.gameState){
			case "play":
				updateCanvas();
				keysPressed = [];

				if(game.timeLeft == 0) {
					game.gameOver = true;
				}
				break;
			case "win":
				drawImage(52, 0, 0, c.width, c.height);
				drawImage(31, c.width - 80, c.height - 92, 60, 72);
				if(keysPressed.includes("e")){
					game.gameState = "menu";
					keysPressed.splice(keysPressed.indexOf("e"), 1);
					game.currentLevel = 0;
				}
				break;
			case "menu":
				for(var x = 0; x < 728; x += 30){
					for(var y = 0; y < 624; y += 30){
						drawImage(0, x, y, 30, 30);
					}
				}
				
				drawImage(34, 100, 400, 120, 120);
				ctx.fillStyle = "white";
				ctx.font = "70pt Consolas";
				ctx.textAlign = "center";
				ctx.fillText("Dodo Island", canvas.width / 2, 100);
				
				for(const y of [200, 250]){
					for(var x = 214; x < 514; x += 50){
						drawImage(1, x, y, 50, 50);
					}
				}
				ctx.strokeStyle = "black";
				ctx.lineWidth = 5;
				ctx.strokeRect(214, 200, 300, 100)
				ctx.font = "45pt Consolas";
				ctx.fillStyle = "black";
				ctx.fillText("Play", 364, 265);
				drawImage(31, 530, 212, 60, 72);
				
				if(keysPressed.includes("e")){
					game.gameState = "play";
					loadLevel(game.currentLevel);
				}
				break;
		}
	} else{
        drawImage(53, 0, 0, c.width, c.height);
		drawImage(31, c.width - 80, c.height - 92, 60, 72);
		if(keysPressed.includes("e")){
			game.gameState = "menu";
			game.gameOver = false;
			keysPressed.splice(keysPressed.indexOf("e"), 1);
			game.currentLevel = 0;
		}
    }
	if(keysPressed.includes("F11")){
		if (c.requestFullscreen) {
			c.requestFullscreen();
		} else if (c.webkitRequestFullscreen) {
			c.webkitRequestFullscreen();
		} else if (c.msRequestFullscreen) {
			c.msRequestFullscreen();
		}
	}
    window.requestAnimationFrame(gameTick);
}

loadLevel(game.currentLevel);