const c = document.getElementById("game");
const ctx = c.getContext("2d");
const cic = new CanvasInteractionClient(c);

ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled  = false;

const settings = {
	cellSize : 64,
	fadeTime : 30,
	debug : {
		hitboxes : false,
		fast : true,
		hideUI : false,
		interactionHitboxes : false,
	}
}
const tilesets = {};
const images = {
	overworldTiles : img("Overworld_Tileset.png"),
	userInterfaceTiles : img("UI_Tileset.png"),
	enemyTiles : img("Enemy_Tileset.png"),
	spellTiles : img("Spell_Tileset.png")
}
const sounds = {
	textBeep : snd("Text.wav", 0.2),
	kachunk : snd("Kachunk.wav"),
	staffEffect : snd("StaffEffect.wav"),
	castSpell : snd("CastSpell.wav"),
	hurt : snd("Hurt.wav"),
	pickup : snd("Pickup.wav"),
	castleMusic : snd("CastleMusic.mp3"),
	overworldMusic : snd("OverworldMusic.mp3"),
}

const saveData = {
	"checkpoint" : undefined,
	"currentRoom" : "castle_01",
	"completeRooms" : []
}

class Tileset {
	constructor(image, cellSize, animatedTiles = {}, collisions = {}){
		this.image = images[image];
		this.cellSize = cellSize;
		this.cols = this.image.width / 16;
		this.animatedTiles = animatedTiles;
		this.collisions = collisions;
	}
	draw(cellId, x, y, sizeX, sizeY, animationFrame = room.frame){
		if(this.animatedTiles[cellId]){
			cellId += Math.floor(animationFrame / this.animatedTiles[cellId].frames) % this.animatedTiles[cellId].images;
		}
		ctx.drawImage(
			this.image,
			(cellId % this.cols) * this.cellSize,
			Math.floor(cellId / this.cols) * this.cellSize,
			this.cellSize,
			this.cellSize,
			x, y, sizeX, sizeY
		);
	}
	
	static boxCollision(wFactor = 1, hFactor = 1, offX = 0, offY = 0){
		return(tileX, tileY, x1, y1) => {
			let leftBound = (tileX + offX) * settings.cellSize;
			let topBound = (tileY + offY) * settings.cellSize;
			let rightBound = (tileX + offX + 1 * wFactor) * settings.cellSize;
			let lowBound = (tileY + offY + 1 * hFactor) * settings.cellSize;
			
			if(settings.debug.hitboxes){
				ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
				ctx.fillRect(leftBound - Camera.x, topBound - Camera.y, rightBound - leftBound, lowBound - topBound);
			}
			
			if(
				x1 < rightBound &&
				x1 + settings.cellSize > leftBound && 
				y1 + 32 < lowBound &&
				y1 + settings.cellSize > topBound
			){
				return [leftBound, topBound, rightBound, lowBound - 32];
			}
		}
	}
}

function img(path){
	var image = new Image();
	image.src = "../resources/images/dodo-quest/" + path;
	return image;
}

function snd(path, volume = 1){
	var audio = new Audio("../resources/sounds/dodo-quest/" + path);
	audio.volume = volume;
	return audio;
}

function playSound(sound){
	if(sound && navigator.userActivation.isActive) sound.play();
}
function playOnce(sound){
	sound.currentTime = 0;
	sound.play();
}

function loadRoom(id, playerX, playerY){
	settings.loading = true;
	var playerCache = player;
	saveData.currentRoom = id;
	room = rooms[id]();
	settings.inMenu = false;
	
	for(var sound in sounds){
		if(sounds[sound] != room.music) sounds[sound].pause();
	}
	if(playerCache){
		room.objects.unshift(playerCache);
	}else{
		room.objects.unshift(new Entity(400, 400, Entity.MoveWithKeys(), Entity.playerSetup));
	}
	player = room.objects[0];
	Camera.target = player;
	player.x = playerX;
	player.y = playerY;
	room.complete = false;
	if(!(settings.debug.hideUI || saveData.currentRoom == "castle_01" || saveData.currentRoom == "ending")){
		room.UI.push(new UI(20, 20, UI.statusBar(3, "#bd515a", "health", player.maxHealth)));
		room.UI.push(new UI(20, 90, UI.statusBar(21, "#51a7e1", "mana", 30)));
		room.UI.push(new UI(282, 20, UI.spellSlot(0, "1")));
		room.UI.push(new UI(352, 20, UI.spellSlot(1, "2")));
		room.UI.push(new UI(422, 20, UI.spellSlot(2, "3")));
		room.UI.push(new UI(492, 20, UI.spellSlot(3, "4")));
		room.UI.push(new UI(916, 20, UI.button(64, 64, 10, 11, () => { if(settings.inMenu == false || settings.inMenu == "openSpellBook"){ settings.inMenu = "spells" } else if(settings.inMenu == "spells"){ settings.inMenu = false;}})));
		room.UI.push(new UI(45, 130, UI.menu()));
	}
	if(room.savePoint !== undefined){
		var saveX = room.savePoint[0] * 64;
		var saveY = room.savePoint[1] * 64;
		saveData.checkpoint = () => { loadRoom(id, saveX, saveY)};
	}
}

var room = {};

const Camera = {
	x : 0,
	y : 0,
	target : undefined
}
var player;

window.onload = function(){
	let box = Tileset.boxCollision;
	tilesets.overworld = new Tileset("overworldTiles", 16, {
		234 : {images : 8, frames : 10},
		242 : {images : 8, frames : 10},
		301 : {images : 5, frames : 10},
		486 : {images : 8, frames : 10},
		494 : {images : 5, frames : 8},
	},
	{0 : [box(1, 0.3, 0, 0), box(0.3, 1, 0, 0)], 1 : [box(1, 0.3, 0, 0)], 3 : [box(1, 0.3, 0, 0), box(0.3, 1, 0.7, 0)], 4 : [box(1, 0.3, 0, 0), box(0.5, 1, 0, 0)], 5 : [box(1, 0.3, 0, 0)], 7 : [box(1, 0.3, 0, 0), box(0.5, 1, 0.5, 0)], 18 : [box(0.3, 1, 0, 0)], 21 : [box(0.3, 1, 0.7, 0)], 36 : [box(0.3, 1, 0, 0), box(1, 0.7, 0, 0.3)], 37 : [box(1, 0.7, 0, 0.3)], 39 : [box(1, 0.7, 0, 0.3), box(0.3, 1, 0.7, 0)], 48 : [box(1, 1, 0, 0)], 49 : [box(1, 1, 0, 0)], 50 : [box(1, 1, 0, 0)], 51 : [box(1, 1, 0, 0)], 52 : [box(1, 1, 0, 0)], 53 : [], 58 : [box(1, 1, 0, 0)], 59 : [box(1, 1, 0, 0)], 61 : [box(1, 1, 0, 0)], 66 : [box(0.6, 1, 0.4, 0)], 67 : [box(1, 1, 0, 0)], 68 : [box(1, 1, 0, 0)], 69 : [box(1, 1, 0, 0)], 70 : [box(1, 1, 0, 0)], 71 : [box(0.5, 1, 0, 0)], 75 : [box(0.6, 0.8, 0.2, 0.1)], 76 : [box(0.8, 0.7, 0.1, 0.2)], 78 : [box(1, 0.7, 0, 0)], 79 : [box(0.6, 0.7, 0.2, 0.1)], 84 : [box(0.6, 1, 0.4, 0)], 85 : [box(1, 1, 0, 0)], 86 : [box(1, 1, 0, 0)], 87 : [box(1, 1, 0, 0)], 88 : [box(0.5, 1, 0, 0), box(1, 0.5, 0, 0)], 89 : [box(0.5, 0.5, 0, 0)], 95 : [box(0.5, 1, 0.5, 0)], 96 : [box(1, 0.3, 0, 0.7)], 97 : [box(0.4, 1, 0.1, 0)], 114 : [box(1, 1, 0, 0)], 116 : [box(1, 1, 0, 0)], 132 : [box(1, 1, 0, 0)], 134 : [box(1, 1, 0, 0)], 135 : [box(0.6, 1, 0.4, 0)], 136 : [box(1, 1, 0, 0)], 137 : [box(1, 1, 0, 0)], 138 : [box(1, 1, 0, 0)], 139 : [box(0.6, 1, 0, 0)], 150 : [box(1, 1, 0, 0)], 151 : [box(1, 1, 0, 0)], 152 : [box(1, 1, 0, 0)], 153 : [box(0.6, 1, 0.4, 0)], 154 : [box(1, 1, 0, 0)], 155 : [box(1, 1, 0, 0)], 156 : [box(1, 1, 0, 0)], 157 : [box(0.6, 1, 0, 0)], 180 : [box(0.5, 1, 0, 0)], 187 : [box(0.9, 1, 0, 0)], 189 : [box(0.9, 1, 0.1, 0)], 201 : [box(0.4, 0.5, 0.6, 0)], 202 : [box(0.4, 0.5, 0, 0)], 217 : [box(0.5, 1, 0.5, 0)], 225 : [box(0.6, 0.8, 0.2, 0)], 234 : [box(1, 1, 0, 0)], 242 : [box(1, 1, 0, 0)], 276 : [box(0.9, 1, 0, 0)], 278 : [box(0.9, 1, 0.1, 0)], 279 : [box(0.3, 1, 0.7, 0)], 280 : [box(0.3, 1, 0, 0)], 288 : [box(1, 0.7, 0, 0), box(0.3, 1, 0, 0)], 289 : [box(1, 0.7, 0, 0)], 290 : [box(1, 0.7, 0, 0)], 291 : [box(1, 0.7, 0, 0)], 292 : [box(1, 0.7, 0, 0)], 293 : [box(0.3, 1, 0.7, 0), box(1, 0.7, 0, 0)], 297 : [box(0.3, 1, 0.7, 0)], 298 : [box(0.3, 1, 0, 0)], 312 : [box(1, 0.7, 0, 0), box(0.6, 0.9, 0.4, 0)], 313 : [box(1, 0.9, 0, 0)], 314 : [box(1, 0.7, 0, 0), box(0.6, 0.9, 0, 0)], 315 : [box(0.3, 1, 0.7, 0)], 316 : [box(0.3, 1, 0, 0)], 333 : [box(0.1, 1, 0, 0)], 335 : [box(0.1, 1, 0.9, 0)], 342 : [box(0.8, 0.7, 0, 0), box(0.3, 1, 0, 0)], 343 : [box(0.3, 1, 0.7, 0), box(0.8, 0.7, 0.2, 0)], 344 : [box(0.3, 1, 0, 0), box(0.8, 0.7, 0, 0)], 347 : [box(0.8, 0.7, 0.2, 0), box(0.3, 1, 0.7, 0)], 350 : [], 351 : [box(0.1, 1, 0, 0)], 353 : [box(0.1, 1, 0.9, 0)], 354 : [box(0.8, 0.7, 0.2, 0)], 355 : [box(0.8, 0.7, 0, 0)], 364 : [box(1, 0.7, 0, 0)], 379 : [box(0.7, 0.7, 0.3, 0)], 380 : [box(0.7, 0.7, 0, 0)], 381 : [box(1, 0.7, 0, 0)], 382 : [box(1, 0.7, 0, 0)], 384 : [box(1, 1, 0, 0)], 385 : [box(1, 1, 0, 0)], 386 : [box(1, 0.7, 0, 0)], 396 : [box(0.3, 1, 0, 0)], 397 : [box(1, 0.7, 0, 0)], 398 : [box(1, 0.7, 0, 0)], 401 : [box(0.3, 1, 0.7, 0)], 402 : [box(1, 1, 0, 0)], 403 : [box(1, 1, 0, 0)], 404 : [box(1, 1, 0, 0)], 405 : [box(1, 1, 0, 0)], 414 : [box(0.3, 1, 0, 0)], 419 : [box(0.3, 1, 0.7, 0)], 420 : [box(1, 1, 0, 0)], 421 : [box(1, 1, 0, 0)], 422 : [box(1, 1, 0, 0)], 423 : [box(1, 1, 0, 0)], 433 : [box(1, 0.6, 0, 0.4)], 434 : [box(1, 0.6, 0, 0.4)], 438 : [box(1, 1, 0, 0)], 439 : [box(1, 1, 0, 0)], 440 : [box(1, 1, 0, 0)], 441 : [box(1, 1, 0, 0)], 450 : [box(0.1, 1, 0, 0), box(1, 0.1, 0, 0)], 451 : [box(1, 0.1, 0, 0), box(0.1, 1, 0.9, 0)], 452 : [box(1, 0.1, 0, 0)], 453 : [box(0.1, 1, 0.9, 0)], 468 : [box(0.1, 1, 0, 0), box(1, 0.1, 0, 0.9)], 469 : [box(1, 0.1, 0, 0.9), box(0.1, 1, 0.9, 0)], 470 : [box(0.1, 1, 0, 0)], 471 : [box(1, 0.1, 0, 0.9)], 478 : [box(0.6, 0.8, 0.2, 0)], 486 : [box(0.8, 0.8, 0.1, 0.1)], 499 : [box(0.8, 0.8, 0.1, 0.1)], });
	tilesets.UI = new Tileset("userInterfaceTiles", 16);
	tilesets.enemy = new Tileset("enemyTiles", 16, {
		//BomberPlant
		0 : {images : 10, frames : 5},
		15 : {images : 4, frames : 13},
		72 : {images : 2, frames : 20},
		11 : {images : 4, frames : 7},
		30 : {images : 7, frames : 5},
		45 : {images : 4, frames : 1},
		//Pinkbat
		75 : {images : 7, frames : 5},
		84 : {images : 4, frames : 1},
		99 : {images : 4, frames : 1},
		105 : {images : 5, frames : 6},
		110 : {images : 5, frames : 6},
		//Dodo
		124 : {images : 2, frames : 8},
		126 : {images : 2, frames : 8},
		128 : {images : 2, frames : 8},
		130 : {images : 2, frames : 8},
		270 : {images : 4, frames : 1},
		274 : {images : 4, frames : 1},
		285 : {images : 4, frames : 1},
		289 : {images : 4, frames : 1},
		//Phantom
		135 : {images : 6, frames : 8},
		142 : {images : 7, frames : 5},
		150 : {images : 6, frames : 8},
		169 : {images : 4, frames : 1},
		184 : {images : 4, frames : 1},
		//Skill Beans
		173 : {images : 6, frames : 10},
		188 : {images : 5, frames : 6},
		//Key
		278 : {images : 6, frames : 12},
		293 : {images : 6, frames : 6},
		//Human
		195 : {images : 6, frames : 10},
		201 : {images : 6, frames : 10},
		210 : {images : 6, frames : 10},
		216 : {images : 6, frames : 10},
		225 : {images : 6, frames : 6},
		231 : {images : 6, frames : 6},
		240 : {images : 6, frames : 6},
		246 : {images : 6, frames : 6},
		//Spinner
		255 : {images : 3, frames : 5},
		258 : {images : 4, frames : 1}
	});
	tilesets.spell = new Tileset("spellTiles", 16, {
		0 : {images : 3, frames : 5},
		3 : {images : 8, frames : 4},
		11 : {images : 3, frames : 2},
	});
	loadRoom(saveData.currentRoom, 64 * 6, 64 * 4);
	draw();
}

function draw(){
	ctx.clearRect(0, 0, 1000, 1000);
	settings.loading = false;
	try{
	playSound(room.music);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 1000, 1000);
	for(var z = 0; z < room.data.length; z++){
		if(z == 2){
			//Sort the entities by y position
			var layerOrder = [];
			for(var object of room.objects){
				var currentY = object.y;
				var inserted = false;
				for(var i = 0; i < layerOrder.length; i++){
					if(layerOrder[i].y > currentY){
						layerOrder.splice(i - 1, 0, object);
						inserted = true;
						break;
					}
				}
				if(!inserted){
					layerOrder.push(object);
				}
			}
			for(var object of layerOrder){
				object.draw();	
			}
		}
		for(var y = Math.floor(Camera.y / 64); y < room.data[z].length; y++){
			if(y * settings.cellSize - Camera.y > 1000){ break; } //Save rendering if off screen
			for(var x = Math.floor(Camera.x / 64); x < room.data[z][y].length; x++){
				if(x * settings.cellSize - Camera.x > 1000){ break; } //Save rendering if off screen
				if(room.data[z][y][x] == null || room.data[z][y][x].length == 0){ continue; }
				tilesets.overworld.draw(room.data[z][y][x], x * settings.cellSize - Camera.x, y * settings.cellSize - Camera.y, settings.cellSize, settings.cellSize);
			}
		}
	}
	
		for(var interaction of room.interactions){
			if(!settings.loading){
				interaction.draw();
			}
		}
	for(var UI of room.UI){
		UI.draw();
	}
}catch(e){alert(e)}
	if(Camera.target){
		Camera.x = Camera.target.x - 500 + settings.cellSize / 2;
		Camera.y = Camera.target.y - 500 + settings.cellSize / 2;
	}
	
	if(Camera.x < room.leftBound){
		Camera.x = room.leftBound;
	}
	if(Camera.x > room.rightBound - 1000){
		Camera.x = room.rightBound - 1000;
	}
	if(Camera.y < room.topBound){
		Camera.y = room.topBound;
	}
	if(Camera.y > room.bottomBound - 1000){
		Camera.y = room.bottomBound - 1000;
	}
	
	if(room.frame < settings.fadeTime){
		ctx.fillStyle = "rgba(0, 0, 0, " + (settings.fadeTime - room.frame) / settings.fadeTime + ")";
		ctx.fillRect(0, 0, 1000, 1000);
	}

	room.frame++;
	cic.onFrameUpdate();
	//window.setTimeout(draw, 100);
	window.requestAnimationFrame(draw);
}
