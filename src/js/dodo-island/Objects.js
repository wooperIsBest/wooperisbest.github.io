class entityTemplate {
	constructor(x, y, tileID = null, width = 26, height = 26, tags = []) {
		// Positional things
		this.x = x;
		this.y = y;
		
		this.tags = tags;
		this.active = true;
		
		// Drawing Atributes
		this.tileID = tileID;
		
		this.width = width;
		this.height = height;
		
		objects.push(this);
	}
	
	gameTick(){
		this.drawObject();
	}

	drawObject() {
		if(this.tileID != null){
			drawImage(this.tileID, this.x, this.y, this.width, this.height);
		}
	}
}

class player extends entityTemplate {
	constructor(x, y, tileID, keys, speed = 2, tags) {
		super(x, y, tileID, tags);
		this.keys = keys;
		this.speed = speed;
		this.width = 24;
		this.height = 24;
		this.originalTileID = this.tileID;
		this.tags.push("player");
		this.holding = null;
		this.direction = 1;
	}
	
	gameTick() {
		if(keysPressed.includes(this.keys[4])){
			if(this.holding){
				this.holding.pickedUpBy = null;
				this.holding = null;
			}
		}
		objects.forEach((obj) => {
			var collisionTags = this.detectCollision(obj);
			if(collisionTags.includes("carryable") && keysPressed.includes(this.keys[4])) {
				if(obj.pickedUpBy){
					obj.pickedUpBy.holding = null;
				}
				obj.pickedUpBy = this; this.holding = obj;
			};
		});
		if(!game.inMenu){
			this.movement();
		}
		this.drawObject();
	}
	
	movement(){
		if (game.inMenu) this.speed = 0;
		else this.speed = 2;
		
		var speed = this.speed;
		if(this.holding){
			speed = this.speed / 2;
		}
		
		var tryY = 0;
		if (keysDown[this.keys[0]]) { tryY -= speed; this.direction = 3; }
		if (keysDown[this.keys[2]]) { tryY += speed; this.direction = 1; }
		objects.forEach((obj) => {
			var collisionTags = this.detectCollision(obj, 0, tryY);
			if(collisionTags.includes("hitbox") && obj != this){ 
				tryY = 0;
			}
		});
		this.y += tryY;
		
		var tryX = 0;
		if (keysDown[this.keys[3]]) { tryX += speed; this.direction = 0; }
		if (keysDown[this.keys[1]]) { tryX -= speed; this.direction = 2; }
		objects.forEach((obj) => {
			var collisionTags = this.detectCollision(obj, tryX, 0);
			if(collisionTags.includes("hitbox")  && obj != this){
				tryX = 0;
			}
		});
		this.x += tryX;
		
		if(this.tileID != null){
			if(tryX != 0 || tryY != 0){
				this.tileID = this.originalTileID + 2 * this.direction + 1;
			}else{
				this.tileID = this.originalTileID + 2 * this.direction;
			}
		}
	}
	
	detectCollision(obj, xMod = 0, yMod = 0) { // Collision detection
		if(
			this.x + xMod < obj.x + obj.width &&
			this.x + this.width + xMod > obj.x &&
			this.y + yMod < obj.y + obj.height &&
			this.y + this.height + yMod > obj.y
		){
			return obj.tags;
		}else{
			return [];
		}
	}
	
	drawObject(){
		if(this.tileID != null){
			drawImage(this.tileID, this.x - 4, this.y - 8, this.width + 8, this.height + 8);
		}
	}
}

class raft extends entityTemplate {
	constructor(x, y, tileID, keys, speed = 2, tags) {
		super(x, y, tileID, tags);
		this.keys = keys;
		this.speed = speed;
		if(game.currentLevel == 5){
			this.width = 100;
			this.height = 100;
		}else{
			this.width = 50;
			this.height = 50;
		}
		this.tags.push("raft");
		this.direction = 1;
		this.cooldown = true;
		this.health = 3;
	}
	
	gameTick() {
		objects.forEach((obj) => {
			var collisionTags = this.detectCollision(obj);
			if(collisionTags.includes("cannonball")){
				this.health--;
				this.shake = true;
				var index = objects.indexOf(obj);
				delete objects[index];
				objects.splice(index, 1);
				var smoke = new entityTemplate(this.x - 80, this.y - 30, 38, 200, 200);
				setTimeout(() => {
					var index = objects.indexOf(smoke);
					delete objects[index];
					objects.splice(index, 1);
				}, 200);
			}
		});
		if(!game.inMenu){
			this.movement();
		}
		this.drawObject();
		this.shake = false;
		
		if(this.health==0){
			game.gameOver = true;
		}
	}
	
	movement(){
		
		if (game.inMenu) this.speed = 0;
		else this.speed = 2;
		
		var speed = this.speed;

		sharks1.forEach((obj) => {
			this.detectSharks(obj);
		});

		
		sharks2.forEach((obj) => {
			this.detectSharks(obj);
		});
		
		var tryY = 0;
		if (keysDown[this.keys[0][0]] || keysDown[this.keys[0][1]]) { tryY -= speed; this.direction = 3; }
		if (keysDown[this.keys[2][0]] || keysDown[this.keys[2][1]]) { tryY += speed; this.direction = 1; }
		objects.forEach((obj) => {
			var collisionTags = this.detectCollision(obj, 0, tryY);
			if(collisionTags.includes("hitbox") && obj != this){ 
				tryY = 0;
			}
		});
		this.y += tryY;
		
		if(game.currentLevel!=5) { 
			var tryX = 0;
			if (keysDown[this.keys[3][0]] || keysDown[this.keys[3][1]]) { tryX += speed; this.direction = 0; }
			if (keysDown[this.keys[1][0]] || keysDown[this.keys[1][1]]) { tryX -= speed; this.direction = 2; }
			objects.forEach((obj) => {
				var collisionTags = this.detectCollision(obj, tryX, 0);
				if(collisionTags.includes("hitbox")  && obj != this){
					tryX = 0;
				}
			});
			this.x += tryX;	
		}		

		if(game.currentLevel == 5) {
			if ((keysDown[this.keys[4][0]] || keysDown[this.keys[4][1]]) && this.cooldown) {
				new cannonball(this.x+this.width+15, this.y+this.height/2, "raft");
				this.cooldown = false;
				setTimeout(() => {this.cooldown = true}, 1000);
			}
		}

		if(this.x > 728){
			game.currentLevel++;
			loadLevel(game.currentLevel);
		}
	}
	
	detectCollision(obj, xMod = 0, yMod = 0) { // Collision detection
		if(
			this.x + xMod < obj.x + obj.width &&
			this.x + this.width + xMod > obj.x &&
			this.y + yMod < obj.y + obj.height &&
			this.y + this.height + yMod > obj.y
		){
			return obj.tags;
		}else{
			return [];
		}
	}

	detectSharks(obj){
		if(this.x + this.width > obj.x && 
			this.x < obj.x+70 && 
			this.y + this.height > obj.y && 
			this.y < obj.y+70
		){
			obj.x = 999;
			this.shake = true;
			game.damage++;
		}
	}
	
	drawObject(){
		if(this.tileID != null){
			if(this.shake){
				drawImage(this.tileID, this.x + 3, this.y - 1, this.width + 8, this.height + 8);
			}else{
				drawImage(this.tileID, this.x - 4, this.y - 8, this.width + 8, this.height + 8);
			}
		}
	}
}


class cannonball extends entityTemplate {
	constructor(x, y, type, tags, width = 30, height = 30) {
		super(x, y, tags);
		this.width = width;
		this.height = height;
		this.tags.push("cannonball");
		this.type = type;
	}

	drawObject(){
		drawImage(54, this.x, this.y, this.width, this.height);
		if(this.type=="raft"){
			this.x+=2.5;
		} else{
			this.x-=2.5;
		}
	}
}

class pirateShip extends entityTemplate {
	constructor(x, y, tileID = 55, speed = 1, tags) {
		super(x, y, tileID, tags);
		this.speed = speed;
		this.width = 100;
		this.height = 100;
		this.tags.push("pirateShip");
		this.direction = 1;
		this.cooldown = true;
		this.health = 10;
	}

	gameTick() {
		objects.forEach((obj) => {
			var collisionTags = this.detectCollision(obj);
			if(collisionTags.includes("cannonball")){
				this.health--;
				this.shake = true;
				var index = objects.indexOf(obj);
				delete objects[index];
				objects.splice(index, 1);
				var smoke = new entityTemplate(this.x - 80, this.y - 30, 38, 200, 200);
				setTimeout(() => {
					var index = objects.indexOf(smoke);
					delete objects[index];
					objects.splice(index, 1);
				}, 200);
			}
		});
		this.drawObject();
		if (this.cooldown) {
			new cannonball(this.x-30, this.y+this.height/2, "pirate");
			this.cooldown = false;
			setTimeout(() => {this.cooldown = true}, 2000);
		}
		if(this.direction==1) {
			this.y-=this.speed;
		} else if(this.direction==2){
			this.y+=this.speed;
		}
		if(this.health == 0){
			var index = objects.indexOf(this);
			delete objects[index];
			objects.splice(index, 1);
			var smoke = new entityTemplate(this.x - 80, this.y - 30, 38, 200, 200);
			setTimeout(() => {
				var index = objects.indexOf(smoke);
				delete objects[index];
				objects.splice(index, 1);
			}, 200);
			setTimeout(() =>{
				game.gameState = "win";
			}, 2000);
			
		}
	}

	detectCollision(obj, xMod = 0, yMod = 0) { // Collision detection
		if(
			this.x + xMod < obj.x + obj.width &&
			this.x + this.width + xMod > obj.x &&
			this.y + yMod < obj.y + obj.height &&
			this.y + this.height + yMod > obj.y
		){
			return obj.tags;
		}else{
			return [];
		}
	}

	drawObject(){
		drawImage(this.tileID, this.x, this.y, this.width, this.height);
		if(this.y<50){
			this.direction = 2;
		}
		if(this.y>450){
			this.direction = 1;
		}
	}
}

class waterMinigame extends entityTemplate {
	constructor(x = 200, y = 0, tileID = 41) {
		super(x, y, tileID)
		this.width = 70
		this.height = 70
		this.time = 0
		sharks1 = [{x:200, y:-26}, {x:200, y:124}, {x:200, y:274}, {x:200, y:424}, {x:200, y:574}, {x:200, y:724}];
		sharks2 = [{x:500, y:49}, {x:500, y:199}, {x:500, y:349}, {x:500, y:499}, {x:500, y:649}];
		game.damage = 0;
	}

	gameTick(){
		this.minigame();
	}

	minigame(){
		this.time++;
		for(var i = 0; i<sharks1.length; i++){
			drawImage(this.tileID, sharks1[i].x, sharks1[i].y, this.width, this.height);
			sharks1[i].y++;
		}

		if(this.time%170 == 0){
			sharks1.push({x:200, y:-46});
		}

		for(var i = 0; i<sharks2.length; i++){
			drawImage(this.tileID, sharks2[i].x, sharks2[i].y, this.width, this.height);
			sharks2[i].y--;
		}

		if((this.time+85)%170 == 0){
			sharks2.push({x:500, y:728});
		}
	}
}

class dodo extends entityTemplate {
	constructor(x, y, tileID = 6, targets, speed = .3) {
		super(x, y, tileID)
		this.speed = speed;
		this.targets = targets;
		this.target = targets[Math.floor(Math.random() * targets.length)];
		this.tags.push("dodo");
		this.tags.push("carryable");
		this.pickedUpBy = null;
		this.width = 26;
		this.height = 26
		this.isInQuicksand = false;
		this.deathFrames = 300;
	}

	gameTick(){
		this.movement();
		this.drawObject();
	}

	movement(){
		if(!game.inMenu){
			if (Math.floor(this.x) == this.target[0] && Math.floor(this.y) == this.target[1]) {
				game.dodoState = "sink";
			}else{
				game.dodoState = "free";
			}
			if(!this.pickedUpBy){
				if(Math.floor(this.x)<this.target[0]) {this.x+=this.speed}
				if(Math.floor(this.x)>this.target[0]) {this.x-=this.speed}
				if(Math.floor(this.y)<this.target[1]) {this.y+=this.speed}
				if(Math.floor(this.y)>this.target[1]) {this.y-=this.speed}
			}else{
				game.dodoState = "free";
				this.x = this.pickedUpBy.x - 4;
				this.y = this.pickedUpBy.y - 34;
				this.target = this.targets[Math.floor(Math.random() * this.targets.length)];
			}
			if(game.dodoState == "sink" && game.currentLevel != 0){
				ctx.fillStyle = "grey";
				ctx.arc(this.x + this.width / 2, this.y - 40, 20, 0, 2 * Math.PI);
				ctx.fill();
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.fillText(Math.ceil(this.deathFrames / 60), this.x + this.width / 2, this.y - 30);
				this.deathFrames--;
				if(this.deathFrames == 0){
					game.gameOver = true;
				}
			}else{
				this.deathFrames = 300;
			}
		}
		if(Math.random() < 0.005 && game.currentLevel == 0){
		 	this.target = this.targets[Math.floor(Math.random() * this.targets.length)];
		}
	}
	drawObject() {
		if (this.tileID != null) {
			if( game.dodoState == "free"){
				drawImage(this.tileID, this.x, this.y, this.width, this.height);
			} else {
				drawDodoSpecial(42, this.x, this.y, this.width, this.height, game.dodoState)
			}
		}
	}
}

class sheep extends entityTemplate {
	constructor(x, y, tileID = 37, speed = .3) {
		super(x, y, tileID)
		this.speed = speed
		this.target = game.dodoCoordinates[Math.floor(Math.random() * (game.dodoCoordinates.length - 1))];
		this.tags.push("sheep");
		this.tags.push("carryable");
		this.pickedUpBy = null;
		this.width = 26;
		this.height = 26;
	}

	gameTick(){

		this.movement();
		this.drawObject();
	}

	movement(){
		if(!game.inMenu){
			if(!this.pickedUpBy){
				if(this.x<this.target[0]) {this.x+=this.speed}
				if(this.x>this.target[0]) {this.x-=this.speed}
				if(this.y<this.target[1]) {this.y+=this.speed}
				if(this.y>this.target[1]) {this.y-=this.speed}
			}else{
				this.x = this.pickedUpBy.x - 4;
				this.y = this.pickedUpBy.y - 34;
			}
		}
	}
}

class tilemap extends entityTemplate {
	constructor(x,y, width, height, data) {
		super(x, y, width, height)
		this.width = 26;
		this.height = 26;
		this.data = data;
		this.tags.push("tilemap");
		for(var y = 0; y < data.length; y++){
			for(var x = 0; x < this.data[y].length; x++){
				if(this.data[y][x] == 0){
					var nearbyTiles = 0;
					for(const item of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
						if(this.data[y + item[0]]){
							if(this.data[y + item[0]][x + item[1]] > 0){
								nearbyTiles++;
								break;
							}
						}
					}
					if(nearbyTiles > 0){
						new entityTemplate(x * this.width + this.x, y * this.height + this.y, null, this.width, this.height, ["hitbox"]);
					}
				}
				if(this.data[y][x] == 3){
					new entityTemplate(x * this.width + this.x, y * this.height + this.y, null, this.width, this.height, ["hitbox"]);
				}
			}
		}
	}
	gameTick() {
		this.drawObject();
	}
	
	drawObject(){
		for(var y = 0; y < this.data.length; y++){
			for(var x = 0; x < this.data[y].length; x++){
				drawImage(this.data[y][x], x * this.width + this.x, y * this.height + this.y, this.width, this.height);
			}
		}
	}
}

class minigameObject extends entityTemplate {
	constructor(x, y, tileID = 0, inactiveTileID = 0, width = 25, height = 25, tags = [], minigame, resource) {
		super(x, y, tileID, width, height, tags);
		this.inactiveTileID = inactiveTileID;
		this.minigame = minigame;
		this.resource = resource;
		tags.push("minigame");
		setTimeout(() => {
			new interactionBox(this);
		}, 1);
	}
	
	gameTick(){
		this.drawObject();
	}

	drawObject() {
		if(this.tileID != null){
			drawImage(this.tileID, this.x, this.y, this.width, this.height);
		}
	}
	deactivate() { 
		this.active = false;
		this.tileID = this.inactiveTileID;
	}
	onInteract(){
		if(!game.inMenu){
			new minigameWindow(this);
			this.active = false;
		}
	}
}

class minigameWindow extends entityTemplate {
	constructor(minigameObject, x = 100, y = 100, tileID, width = 500, height = 300){
		super(x, y, tileID, width, height)
		game.inMenu = true;
		this.minigameObject = minigameObject;
		this.complete = false;
		if(this[this.minigameObject.minigame + "Initialize"]){
			this[minigameObject.minigame + "Initialize"]();
		}
	}
	gameTick(){
		this.drawObject();
		if(this[this.minigameObject.minigame]){
			this[this.minigameObject.minigame]();
		}
	}
	drawObject(){
		ctx.fillStyle = "rgb(255, 255, 255, 0.8)";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	close(){
		if(game.inMenu){
			game.inMenu = false;
			var index = objects.indexOf(this);
			resources[this.minigameObject.resource]++;
			this.minigameObject.deactivate();
			delete objects[index];
			objects.splice(index, 1);
		}
	}

	//Minigame Code
	woodInitialize(){
		this.woodObj = [];
		this.woodTime = 0;
		this.woodScore = 0;
		this.woodImg = 15;
	}

	wood(){
		ctx.textAlign = "center";
		ctx.fillStyle = "gray";
		ctx.fillRect(200, 100, 200, 300);
		ctx.fillStyle = "lightGray";
		ctx.strokeStyle = "lightGray";
		ctx.beginPath();
		ctx.arc(250, 350, 25, 0, Math.PI*2);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.beginPath()
		ctx.arc(350, 350, 25, 0, Math.PI*2);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(300, 100);
		ctx.lineTo(300, 400);
		ctx.closePath();
		ctx.stroke();	
		
		if(!this.complete){
			for(var i = 0; i<this.woodObj.length; i++){
				ctx.fillStyle = this.woodObj[i].color;
				ctx.font = "30pt Consolas";
				drawImage(this.woodObj[i].img, this.woodObj[i].x, this.woodObj[i].y, 30, 36)
				this.woodObj[i].y+=4;
				if(this.woodObj[i].y>366){
					this.woodObj.splice(i, 1);
					i--;
				}
			}
		
			if(this.woodTime % 10 == 0 && Math.random() < 0.2){
				this.woodObj.push({img:31, color:"black", x:237, y:100});
			}

			if(this.woodTime % 10 == 0 && Math.random() < 0.2){
				this.woodObj.push({img:32, color:"red", x:337, y:100});
			}
		}
		
		if(keysPressed.includes("e")) {
			for(var j = 0; j<this.woodObj.length; j++){
				if(this.woodObj[j].y > 315 && this.woodObj[j].y < 375){
					if(this.woodObj[j].img == 31) {
						this.woodObj.splice(j, 1);
						this.woodScore++;
						if(this.woodScore<6) {
							this.woodImg = 12;
						}
						else if(this.woodScore>=6 && this.woodScore<12) {
							this.woodImg = 13;
						}
						else if(this.woodScore>=12) {
							this.woodImg = 14;
						}
					}							
				}
			}					
		}
		if(keysPressed.includes("/")) {
			for(var k = 0; k<this.woodObj.length; k++){
				if(this.woodObj[k].y > 315 && this.woodObj[k].y < 375){
					if(this.woodObj[k].img == 32) {
						this.woodObj.splice(k, 1);
						k--;
						this.woodScore++;
						if(this.woodScore<6) {
							this.woodImg = 15;
						}
						else if(this.woodScore>=6 && this.woodScore<12) {
							this.woodImg = 16;
						}
						else if(this.woodScore>=12) {
							this.woodImg = 17;
						}
					}
				}
			}
		}
		
		drawImage(this.woodImg, 450, 250, 150, 150);
		this.woodTime++;

		if(this.woodScore > 18) {
			ctx.fillStyle = "green";
			ctx.font = "20pt Consolas";
			ctx.fillText("Good Job!", 500, 175)
			ctx.fillStyle = "black";
			if(!this.complete){
				setTimeout(() => {
					this.close();
				}, 1000);
			}
			this.complete = true;
		}
	}

	grassInitialize(){
		this.grassPositions = [];
		for(var i = 0; i < 40; i++){
			this.grassPositions.push({
				"x" : Math.random() * (this.width - 175) + this.x,
				"y" : Math.random() * (this.height - 175) + this.y
			});
		}
		this.key = "e";
	}
	
	grass(){
		if(this.grassPositions.length == 0){
			ctx.fillStyle = "green";
			ctx.font = "40pt Consolas";
			ctx.fillText("Good Job!", this.x + this.width / 2 , 175)
			drawImage(11, this.x + this.width / 2 - 75, this.y + this.height / 2 - 75, 150, 150)
			if(!this.complete){
				setTimeout(() => {
					this.close();
				}, 1000);
			}
			this.complete = true;
		}else{
			for(var i = 0; i < this.grassPositions.length; i++){
				drawImage(10, this.grassPositions[i].x, this.grassPositions[i].y, 150, 150);
			}

			if(this.key == "e"){
				drawImage(31, this.x + 15, this.y + 15, 66, 80);
			}else{
				drawImage(32, this.x + this.width - 81, this.y + 15, 66, 80);
			}
		}

		if(keysPressed.includes(this.key)){
			this.key = (this.key == "e" ? "/" : "e");
			this.grassPositions.pop();
		}
	}

	woolInitialize(){
		this.woolPositions = [];
		for(var row = 0; row < 6; row++){
			for(var col = 0; col < 10; col++){
				this.woolPositions.push({"x" : col * 50 + Math.random() * 20 - 10, "y" : row * 50 + Math.random() * 20 - 10, "falling" : false, "velY" : 0});
			}
		}
		this.p1Pos = {"x" : 0, "y" : 0};
		this.p2Pos = {"x" : 250, "y" : 0};
	}

	wool(){
		for(var i = 0; i < this.woolPositions.length; i++){
			var wool = this.woolPositions[i];
			
			wool.y += wool.velY;
			if(wool.falling){
				wool.velY++;
				if(wool.y > 800){
					this.woolPositions.splice(i, 1);
					i--;
				}
			}
			
			drawImage(39, this.x + wool.x, this.y + wool.y - 20, 80, 80);
			
			if(
				((this.p2Pos.x + 30 > wool.x &&
				this.p2Pos.x < wool.x + 60 &&
				this.p2Pos.y + 30 > wool.y &&
				this.p2Pos.y < wool.y + 60) ||
				(this.p1Pos.x + 30 > wool.x &&
				this.p1Pos.x < wool.x + 60 &&
				this.p1Pos.y + 30 > wool.y &&
				this.p1Pos.y < wool.y + 60)) &&
				!wool.falling
			){
				wool.velY = -10;
				wool.falling = true;
			}
		}
		
		ctx.fillStyle = "grey";
		drawImage(40, this.x + this.p1Pos.x, this.y + this.p1Pos.y, 60, 60);
		drawImage(40, this.x + this.p2Pos.x, this.y + this.p2Pos.y, 60, 60);
		if(keysDown["w"] && this.p1Pos.y > 0){ this.p1Pos.y -= 10; }
		if(keysDown["a"] && this.p1Pos.x > 0){ this.p1Pos.x -= 10; }
		if(keysDown["s"] && this.p1Pos.y < 240){ this.p1Pos.y += 10; }
		if(keysDown["d"] && this.p1Pos.x < 440){ this.p1Pos.x += 10; }

		if(keysDown["ArrowUp"] && this.p2Pos.y > 0){ this.p2Pos.y -= 10; }
		if(keysDown["ArrowLeft"] && this.p2Pos.x > 0){ this.p2Pos.x -= 10; }
		if(keysDown["ArrowDown"] && this.p2Pos.y < 240){ this.p2Pos.y += 10; }
		if(keysDown["ArrowRight"] && this.p2Pos.x < 440){ this.p2Pos.x += 10; }
		
		if(this.woolPositions.length == 0){
			ctx.fillStyle = "green";
			ctx.font = "40pt Consolas";
			ctx.fillText("Good Job!", this.x + this.width / 2 , 175)
			
			if(!this.complete){
				setTimeout(() => {
					this.close();
				}, 1000);
			}
			this.complete = true;
		}
	}
	
	ironInitialize(){
		this.p1 = {"x" : 5, "dir" : 1};
		this.p2 = {"x" : this.width - 40, "dir" : -1};
		this.lines = [100, 200, 300, 400];
		this.linesComplete = [false, false, false, false];
	}

	iron(){
		ctx.lineWidth = 5;
		ctx.fillStyle = "rgb(0, 0, 0, 0.5";
		ctx.fillRect(this.x + 10, this.y + this.height - 100, this.width - 20, 90);
		
		for(var line = 0; line < this.lines.length; line++){
			if(this.linesComplete[line]){
				ctx.strokeStyle = "grey";
			}else{
				ctx.strokeStyle = "yellow";
			}
			ctx.strokeRect(this.x + this.lines[line], this.y + this.height - 100, 20, 90);
		}

		ctx.strokeStyle = "white";
		ctx.strokeRect(this.x + 10 + this.p1.x, this.y + this.height - 100, 10, 90);
		ctx.strokeRect(this.x + 10 + this.p2.x, this.y + this.height - 100, 10, 90);

		ctx.strokeStyle = "black";
		ctx.strokeRect(this.x + 10, this.y + this.height - 100, this.width - 20, 90);
		
		var hit = false;

		drawImage(31, this.x + this.p1.x - 8, 400, 40, 48);
		this.p1.x += 3 * this.p1.dir;
		if(this.p1.x >= this.width - 30 || this.p1.x <= 0){
			this.p1.dir *= -1;
		}

		if(keysPressed.includes("e")){
			for(var line = 0; line < this.lines.length; line++){
				if(this.p1.x > this.lines[line] && this.p1.x + 5 < this.lines[line] + 20){
					this.linesComplete[line] = true;
					hit = true;
				}
			}
		}

		drawImage(32, this.x + this.p2.x - 8, 400, 40, 48);
		this.p2.x += 3 * this.p2.dir;
		if(this.p2.x >= this.width - 30 || this.p2.x <= 0){
			this.p2.dir *= -1;
		}

		if(keysPressed.includes("/")){
			for(var line = 0; line < this.lines.length; line++){
				if(this.p2.x > this.lines[line] && this.p2.x + 5 < this.lines[line] + 20){
					this.linesComplete[line] = true;
					hit = true;
				}
			}
		}

		if(this.linesComplete.indexOf(false) == -1){
			ctx.fillStyle = "green";
			ctx.font = "40pt Consolas";
			ctx.fillText("Good Job!", this.x + this.width / 2 , 175)
			if(!this.complete){
				setTimeout(() => {
					this.close();
				}, 1000);
			}
			this.complete = true;
		}else{
			if(hit){
				drawImage(33, this.x + this.width / 2 - 71, this.y + 24, 150, 150)
			}else{
				drawImage(33, this.x + this.width / 2 - 75, this.y + 20, 150, 150)
			}
		}
	}
}

class levelExit extends entityTemplate {
	constructor(x, y, tileID = 0, width = 50, height = 50, tags = [], resourceRequirements, upgradeTileID = 0) {
		super(x, y, tileID, width, height, tags);
		this.x = 708;
		this.restingX = x;
		this.resourceRequirements = resourceRequirements;
		this.upgradeTileID = upgradeTileID;
		this.action = "enter";
		setTimeout(() => {
			new interactionBox(this);
		}, 1);
	}
	
	gameTick(){
		this.drawObject();

		switch(this.action){
			case "enter":
				this.x--;
				if(this.tileID != 51){
					drawImage(27, this.x + 10, this.y + 18 + (Math.floor(game.frame / tileIDs[this.tileID].framesBetween) % 2 == 0 ? (tileIDs[this.tileID].bob || 5) : 0), 32, 32);
				}
				if(this.x <= this.restingX){
					if(game.currentLevel == 0){
						this.tileID = 7;
					}
					this.action = "rest";
					game.inMenu = false;
					new player (this.x - 40, this.y + 30, 23, ["w", "a", "s", "d", "e"]);
					new player (this.x - 40, this.y + 45, 43, ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "/"]);
					var smoke = new entityTemplate(this.x - 80, this.y - 30, 38, 200, 200);
					setTimeout(() => {
						var index = objects.indexOf(smoke);
						delete objects[index];
						objects.splice(index, 1);
					}, 200);
					
					var displayText = [];
					switch(game.currentLevel){
						case 0:
							displayText.push(["Disaster has struck!", "You were caught in a storm,", "and now you are shipwrecked on", "the Dodo Islands!", "(press \"e\" to continue)"]);
							displayText.push(["You must collect the resources", "scattered around the island to", "rebuild your ship."]);
							displayText.push(["Also, there is a dodo who often", "wanders into danger. This", "island's quicksand can't kill it,", "but keep it safe on the other", "islands by carrying it with", "your interact button!"]),
							displayText.push(["CONTROLS", "Blue Sailor:", "• Move - WASD", "• Interact: \"e\""]);
							displayText.push(["CONTROLS", "Red Sailor:", "• Move - Arrow Keys", "• Interact: \"/\""]);
							break;
						case 1:
							break;
						case 2:
							displayText.push(["The dodo will now wander into", "the dangerous parts of this", "island."]);
							displayText.push(["Additionally, this island is", "infested by rats who will", "devour the dodo if given the", "chance. The timer in the corner", "tells when that will happen."]);
							break;
					}
					
					if(game.damage > 0){
						this.resourceRequirements.wood += game.damage;
						var trees = 0;
						objects.forEach((obj) => {
							if(obj.resource == "wood"){
								trees++;
							}
						});
						displayText.push(["Your ship was damaged by the", "sharks! You will need ", game.damage + " additional " + (game.damage == 1 ? "log" : "logs") + " to repair it."]);
						if(trees + resources.wood < this.resourceRequirements.wood){
							displayText.push(["What's this?"]);
							displayText.push(["You notice that there aren't", "enough trees on this island to", "complete repairs..."]);
							displayText.push(["You are stranded!"]);
						}
						game.damage = 0;
					}
					if(displayText.length > 0){
						if(trees + resources.wood < this.resourceRequirements.wood){
							new textBox(displayText, "e", () => game.gameOver = true);
						}else{
							new textBox(displayText, "e", () => {
								if(game.currentLevel != 0){
									game.maxTime = 101;
									game.timeLeft = 100;
								}
							});
						}
					}else{
						game.maxTime = 101;
						game.timeLeft = 100;
					}
				}
		}
		if(!this.active){
			this.x++;
			if(this.tileID != 51){
				drawImage(23, this.x + 10, this.y + 18 + (Math.floor(game.frame / tileIDs[this.tileID].framesBetween) % 2 == 0 ? (tileIDs[this.tileID].bob || 5) : 0), 32, 32);
			}
			if(this.x > 728){
				game.currentLevel++;
				loadLevel(game.currentLevel);
				game.inMenu = false;
			}
		}
	}
	
	onInteract(who){
		var reqsMet = true;
		for(var req in this.resourceRequirements){
			if(resources[req] < this.resourceRequirements[req]){
				reqsMet = false;
				break;
			}
		}
		if(reqsMet){
			for(var req in this.resourceRequirements){
				resources[req] -= this.resourceRequirements[req];
			}
			game.maxTime = Infinity;
			new textBox([["Nice work!", "You upgraded your boat!"]], who.keys[4], () => {
				this.moveToNextlevel();
			});
		}else{
			var message = [["You need more resources to", "upgrade your boat!"], ["Required resources:"]];
			for(var req in this.resourceRequirements){
				message[1].push("• " + this.resourceRequirements[req] + " " + req);
			}
			new textBox(message, who.keys[4]);
		}
	}

	moveToNextlevel(){
		this.tileID = this.upgradeTileID;
		this.active = false;
		for(var obj of objects){
			if(obj.tags.includes("player") || obj.tags.includes("dodo")){
				obj.tileID = null;
				game.inMenu = true;
			}
		}
		var smoke = new entityTemplate(this.x - 80, this.y - 30, 38, 200, 200);
		setTimeout(() => {
			var index = objects.indexOf(smoke);
			delete objects[index];
			objects.splice(index, 1);
		}, 200);
	}
}

class interactionBox extends entityTemplate {
	constructor(object) {
		super();
		this.object = object;
	}
	
	gameTick(){
		this.drawn = false;
		if(!game.inMenu && this.object.active){
			for(const obj of objects){
				if(obj){
					if(obj.tags.includes("player")){
						if(Math.hypot(this.object.x - obj.x, this.object.y - obj.y) < 60){
							if(!this.drawn){
								this.drawObject();
								this.drawn = true;
							}
							if(keysPressed.includes(obj.keys[4])){
								this.object.onInteract(obj);
							}
						}
					}
				}
			}
		}
	}
	
	drawObject(){
		ctx.textAlign = "center";
		ctx.fillStyle = "rgb(0,0,255,0.7)";
		ctx.fillRect(this.object.x + this.object.width / 2 - 15, this.object.y - 20, 30, 30);
		ctx.fillStyle = "white";
		ctx.fillText("!", this.object.x + this.object.width / 2, this.object.y + 5);
	}
}

class textBox extends entityTemplate {
	constructor(messages, key, callback){
		super();
		this.currentText = [];
		for(var i = 0; i < messages[0].length; i++){
			this.currentText.push("");
		}
		this.messageNum = 0;
		this.messages = messages;
		this.key = key;
		this.callback = callback;
		game.inMenu = true;
	}
	
	gameTick(){
		this.drawObject();
		
		for(var line = 0; line < this.messages[this.messageNum].length; line++){
			if(this.currentText[line].length < this.messages[this.messageNum][line].length){
				this.currentText[line] += this.messages[this.messageNum][line].charAt(this.currentText[line].length);
				return;
			}				
		}
		drawImage(21, 550, 440, 40, 40);

		if(keysPressed.includes(this.key)){
			this.messageNum++;
			if(this.messageNum >= this.messages.length){
				this.close();
				return;
			}
			this.currentText = [];
			for(var i = 0; i < this.messages[this.messageNum].length; i++){
				this.currentText.push("");
			}
		}
	}
	
	close(){
		if(game.inMenu){
			var index = objects.indexOf(this);
			delete objects[index];
			objects.splice(index, 1);
			setTimeout(() => {
				game.inMenu = false;
				if(this.callback){
					this.callback();
				}
			}, 1);
		}
	}
	
	drawObject(){
		ctx.fillStyle = "rgb(255, 255, 255, 0.8)";
		ctx.fillRect(114, 325, 500, 160);
		ctx.fillStyle = "black";
		ctx.textAlign = "left";
		
		for(var line = 0; line < this.currentText.length; line++){
			ctx.fillText(this.currentText[line], 121, 350 + 25 * line);
		}
		
	}
}