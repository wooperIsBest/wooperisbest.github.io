class Interaction {
	constructor(x, y, collFunction, onInteract, onTouch = false, singleUse = false, removeIfRoomComplete = false){
		this.x = x * settings.cellSize;
		this.y = y * settings.cellSize;
		this.collFunction = collFunction;
		this.onInteract = onInteract;
		this.onTouch = onTouch;
		this.singleUse = singleUse;
		this.removeIfRoomComplete = removeIfRoomComplete;
	}
	draw(){
		if(room.frame == 0 && this.removeIfRoomComplete && saveData.completeRooms.indexOf(saveData.currentRoom) > -1){
			room.interactions.splice(room.interactions.indexOf(this));
		}

		if(settings.inMenu) return;
		if(this.collFunction(this.x, this.y, player.x, player.y)){
			if(!this.onTouch) tilesets.UI.draw(9, this.x - 30 - Camera.x, this.y - 60 - Camera.y - Math.abs(20 * Math.sin(room.frame / 20)), 60, 60);
			
			if(cic.getKeyDown("e") || this.onTouch){
				var out = this.onInteract();
				if(this.singleUse && out != "cancel") room.interactions.splice(room.interactions.indexOf(this), 1);
			}
		}
	}
	
	//On Interacts
	static textBox(message){
		return () => {
			room.UI.push(new UI(20, 740, UI.textBox(message)));
		}
	}
	static loadRoom(index, nextPlayerX, nextPlayerY){
		return () => {loadRoom(index, nextPlayerX * settings.cellSize, nextPlayerY * settings.cellSize); }
	}
	static openSwitch(switchTileX, switchTileY, newSwitchTile, gateTiles){
		return () => {
			playSound(sounds.kachunk);
			room.data[1][switchTileY][switchTileX] = newSwitchTile;
			for(var i = 0; i < gateTiles.length; i++){
				room.data[1][gateTiles[i][1]][gateTiles[i][0]] = gateTiles[i][2];
				room.data[2][gateTiles[i][1]][gateTiles[i][0]] = null;
			}
		}
	}
	static openGate(gateTiles, iLoveAddingExceptions = false){
		return () => {
			if(room.data[1][gateTiles[0][1]][gateTiles[0][0]] == gateTiles[0][2]) return;
			playSound(sounds.kachunk);
			for(var i = 0; i < gateTiles.length; i++){
				if(iLoveAddingExceptions && i % 2 == 1){
					room.data[2][gateTiles[i][1]][gateTiles[i][0]] = gateTiles[i][2];
				}else{
					room.data[1][gateTiles[i][1]][gateTiles[i][0]] = gateTiles[i][2];
					room.data[2][gateTiles[i][1]][gateTiles[i][0]] = null;
				}
			}
		}
	}
	static cutscene(...args){
		return () => {
			room.UI.push(new UI(20, 740, UI.cutscene(args)));
		}
	}
	static openChest(x, y, item, funct){
		return () => {
			room.UI.push(new UI(20, 740, UI.textBox("You found " + item + "!")));
			funct();
			room.objects.push(new Entity(0, 0, Entity.openChestHandler(x, y)));
		}
	}
	static closedDoor(x, y){
		return () => {
			if(saveData.completeRooms.indexOf(saveData.currentRoom) != -1){
				openDoor();
				room.UI.push(new UI(20, 740, UI.textBox("You reopened the door.")));
				return;
			}
			if(player.keys > 0){
				openDoor();
				room.UI.push(new UI(20, 740, UI.textBox("You unlocked the door.")));
				player.keys--;
				saveData.completeRooms.push(saveData.currentRoom);
			}else{
				room.UI.push(new UI(20, 740, UI.textBox("It's locked.")));
				return "cancel";
			}
		}
		
		function openDoor(){
			room.data[1][y][x] = 258;
			room.data[1][y][x+1] = 259;
			room.data[1][y][x+2] = 260;
			room.data[1][y+1][x] = 276;
			room.data[1][y+1][x+1] = 277;
			room.data[1][y+1][x+2] = 278;
		}
	}

	//Collision Functions
	static hitbox(w, h){
		return (x1, y1, x2, y2) => {
			if(settings.debug.interactionHitboxes){
				ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
				ctx.fillRect(x1 - w / 2 - Camera.x, y1 - h / 2 - Camera.y, w, h);
				ctx.fillStyle = "green";
				ctx.fillRect(x1 - Camera.x, y1 - Camera.y, 5, 5)
			}
			return (
				x2 < x1 + w / 2 &&
				x2 + settings.cellSize > x1 - w / 2 &&
				y2 < y1 + h / 2 &&
				y2 + settings.cellSize > y1 - h / 2
			);
		}
	}

	static hitRadius(radius){
		return (x1, y1, x2, y2) => {
			return (Math.hypot(x1 - x2, y1 - y2) < radius);
		}
	}
	
	static onAllEnemiesKilled(){
		return () => {
			if(saveData.completeRooms.indexOf(saveData.currentRoom) == -1){
				for(var obj of room.objects){
					if(obj.tags && obj.tags.includes("enemy")){
						return false;
					}
				}
				saveData.completeRooms.push(saveData.currentRoom);
			}
			
			return true;
		}
	}
}