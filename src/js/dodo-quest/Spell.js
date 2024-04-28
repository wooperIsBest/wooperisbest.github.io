class Spell {
	constructor(behavior){
		this.behavior = behavior;
	}
	
	draw(){
		this.behavior(this);
	}
	
	static upgradeTree = {
		"Bomb" : {
			"path" : [
				[
					{name : "Bigger Blast", description : "Increases the size and cooldown of the  blast. Cost: 2", effects : {"size" : 1, "cooldown" : 7}, cost : 2, unlocked : false},
					{name : "Shrapnel", description : "Increases the damage and cooldown of theblast. Cost: 5", effects : {"damage" : 3, "cooldown" : 7}, cost : 5, unlocked : false},
					{name : "Little Boy", description : "Further increases the damage and size.  Cost: 9", effects : {"size" : 1, "damage" : 3}, cost : 9, unlocked : false},
				],
				[
					{name : "Far Blast", description : "Increases the range of the bomb. Cost: 1", effects : {"range" : 100}, cost : 1, unlocked : false},
					{name : "Massive Blast", description : "Increases the size of the blast. Cost: 4", effects : {"size" : 1}, cost : 4, unlocked : false},
					{name : "Grenade", description : "Increases the damage of the blast, but  decreases the range. Cost: 7", effects : {"damage" : 4, "range" : -50}, cost : 7, unlocked : false},
				],
				[
					{name : "Quick Blast", description : "Decreases the mana cost of the bomb.    Cost: 3", effects : {"mana" : -3}, cost : 3, unlocked : false},
					{name : "Rapid Fire", description : "Decreases the cooldown of the bomb.     Cost: 6", effects : {"cooldown" : -30}, cost : 6, unlocked : false},
					{name : "Boom", description : "Increases the size, damage, and range ofthe blast. Cost: 14", effects : {"size" : 1, "damage" : 2, "range" : 50}, cost : 14, unlocked : false},
				],
			],
			"unlocked" : false,
		},
		"Fireball" : {
			"path" : [
				[
					{name : "Bigger Blast", description : "Increases the size of the blast.", effects : {"size" : 4}, cost : 4, unlocked : false},
					{name : "Also Blast", description : "Increases the also of the blast.", effects : {"size" : 4}, cost : 4, unlocked : false},
					{name : "Boom Blast", description : "Increases the blasty of the blast.", effects : {"size" : 4}, cost : 4, unlocked : false},
				],
				[
					{name : "Speedy", description : "Increases the speedy of the blast.", effects : {"speed" : 10}, cost : 4, unlocked : false},
					{name : "Speedier", description : "Increases the size of the blast.", effects : {"speed" : 15}, cost : 4, unlocked : false},
					{name : "Bigger Blast", description : "Increases the size of the blast.", effects : {"size" : 4}, cost : 4, unlocked : false},
				],
				[
					{name : "Blasty Blast", description : "Increases the blasty of the blast.", effects : {"size" : 4}, cost : 4, unlocked : false},
					{name : "Bigger Blast", description : "Increases the size of the blast.", effects : {"size" : 4}, cost : 4, unlocked : false},
					{name : "Bigger Blast", description : "Increases the size of the blast.", effects : {"size" : 4}, cost : 4, unlocked : false},
				],
			],
			"unlocked" : false,
		},
		"Telepathy" : {
			"path" : [
				[],
				[],
				[],
			],
			"unlocked" : false,
		},
		"Teleport" : {
			"path" : [
				[
					{name : "Quick Escape", description : "Decreases the cooldown. Cost: 3", effects : {"cooldown" : -60}, cost : 3, unlocked : false},
					{name : "Reactive", description : "Decreases the cooldown. Cost: 4", effects : {"cooldown" : -60}, cost : 4, unlocked : false},
					{name : "Just Plain Fun", description : "Decreases the cooldown. All the way. Cost: 10", effects : {"cooldown" : -100}, cost : 10, unlocked : false},
				],
				[],
				[
					{name : "Teleportation Adept", description : "Decreases the mana cost. Cost: 4", effects : {"mana" : -4}, cost : 4, unlocked : false},
					{name : "Teleportation Master", description : "Decreases the mana cost. Cost: 6", effects : {"mana" : -5}, cost : 6, unlocked : false},
					{name : "Second Thought", description : "Decreases the mana cost. Cost: 7.", effects : {"mana" : -5}, cost : 7, unlocked : false},
				],
			],
			"unlocked" : false,
		},
		"AirCutter" : {
			"path" : [
				[
					{name : "Blast of Fresh Air", description : "Increases the size of the cutter. Cost: 2", effects : {"size" : 0.5}, cost : 2, unlocked : false},
					{name : "Piercing Wind", description : "Increases the damage of the cutter.     Cost: 4", effects : {"damage" : 2}, cost : 4, unlocked : false},
					{name : "Flurry", description : "Further increases the size and damage ofthe cutter. Cost: 7", effects : {"damage" : 3, "size" : 0.5}, cost : 7, unlocked : false},
				],
				[
					{name : "Sharpened Gust", description : "Increases the damage of the cutter.     Cost: 1", effects : {"damage" : 1}, cost : 1, unlocked : false},
					{name : "Focused Gale", description : "Increases the range of the cutter, but  slightly decreases the size. Cost: 5", effects : {"range" : 150, "size" : -0.4}, cost : 5, unlocked : false},
					{name : "Sniper's Gale", description : "Increases the range and damage of the   cutter, but increases the cooldown.     Cost: 8", effects : {"range" : 150, "damage" : 3, "cooldown" : 60}, cost : 8, unlocked : false},
				],
				[
					{name : "Rapid Gust", description : "Decreases the mana cost of the cutter,  but reduces the damage. Cost: 3", effects : {"damage" : -1, "mana" : -1}, cost : 3, unlocked : false},
					{name : "Twin Blades", description : "Decreases the cooldown of the cutter,   but reduces the range. Cost: 6", effects : {"range" : -50, "cooldown" : -5}, cost : 6, unlocked : false},
					{name : "Tornado", description : "The cutter can now draw enemies towards its center. Cost : 10", effects : {pull : 32}, cost : 10, unlocked : false},
				],
			],
			"unlocked" : false,
		}
	}
	
	static BombInfo = {mana : 7, cooldown : 60, icon : 54, range : Spell.CircleTarget, description : "Launches a powerful, area-of-effect bombat your target. Range: 400 (radius),    Mana : 7, Damage: 5 Cooldown: 1", radius : 300};
	static Bomb(originX, originY, targetX, targetY, fromPlayer = false){
		return (obj) => {
			if(obj.frames === undefined){
				obj.x = originX;
				obj.y = originY;
				obj.frames = 0;
				obj.h = 300;
				if(targetY <= originY - 300){
					obj.h = originY - targetY;
				}
				if(originX == targetX){
					targetX += 1;
				}
				//Upgradable stats
				obj.size = 1;
				if(fromPlayer){
					let tree = Spell.upgradeTree.Bomb.path;
					for(var path of tree){
						for(var tier of path){
							if(!tier.unlocked) break;
							for(var effect in tier.effects){
								obj[effect] += tier.effects[effect];
							}
						}
					}
				}
			}
			
			obj.x -= (originX - targetX) / 120;
			obj.y = originY + funct(obj.x - originX, targetX - originX, originY - targetY, obj.h);
			if(obj.frames == 120){
				room.objects.splice(room.objects.indexOf(obj), 1);
				
				for(var object of room.objects){
					if(object.constructor.name == "Entity"){
						if(Math.hypot(object.x - targetX, object.y - targetY) < 3 * settings.cellSize * obj.size){
							object.damage(5);
						}
					}
				}
				room.objects.push(new Entity(targetX, targetY, Entity.explosion(obj.size)));
			}
			
			tilesets.enemy.draw(11, 
				obj.x - Camera.x, obj.y - Camera.y,
				settings.cellSize, settings.cellSize
			);
			
			tilesets.enemy.draw(72, 
				targetX - Camera.x, 
				targetY - Camera.y,
				settings.cellSize, settings.cellSize
			);
			
			obj.frames++;
		}
		function funct(x, tx, ty, h){
			return (-2 * h * x) * (1 + Math.sqrt(1 - ty / h)) * (((-1 - Math.sqrt(1 - ty / h)) * h * x) / (Math.pow(Math.sqrt(2 * h) * tx, 2)) + 1 / tx)
		}
	}
	
	static FireballInfo = {mana : 2, cooldown : 60, icon : 55, description : "go boom", range : Spell.CircleTarget};
	static Fireball(originX, originY, targetX, targetY){
		return (obj) => {
			if(obj.frames === undefined){
				originX += 32;
				originY += 32;
				obj.x = originX;
				obj.y = originY;
				// obj.frames = 0;
				if(originX == targetX){
					targetX += 1;
				}
				//Upgradable stats
				obj.size = 1;
				obj.speed = 6;
				obj.damage = 1;
				obj.dir = Math.atan((originY - targetY)/(originX - targetX));
				if((originX - targetX) > 0) obj.dir += Math.PI;
				let tree = Spell.upgradeTree.Fireball.path;
				for(var path of tree){
					for(var tier of path){
						if(!tier.unlocked) break;
						for(var effect in tier.effects){
							obj[effect] += tier.effects[effect];
						}
					}
				}
			}

			var dist = Math.hypot(originX - targetX - 32, originY - targetY - 32);
			var velX = (originX - targetX - 32) * obj.speed / dist;
			var velY = (originY - targetY - 32) * obj.speed / dist;
			if(velX < Infinity) obj.x -= velX;
			if(velY < Infinity) obj.y -= velY;

			for(var object of room.objects){
				if(object.constructor.name == "Entity" && object != player){
					if(Math.hypot(object.x + settings.cellSize/2 - obj.x, object.y + settings.cellSize/2 - obj.y) < 50 * obj.size){
						object.damage(obj.damage * 2000);
						room.objects.splice(room.objects.indexOf(obj), 1);
					}
				}
			}

			if(Math.abs(obj.x - targetX - 32) <= obj.speed){
				room.objects.splice(room.objects.indexOf(obj), 1);
				ctx.beginPath();
				ctx.arc(targetX - Camera.x, targetY - Camera.y, 75 * obj.size, 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();
				
				for(var object of room.objects){
					if(object.constructor.name == "Entity"){
						if(Math.hypot(object.x - targetX, object.y - targetY) < 75 * obj.size){
							object.damage(obj.damage*2000);
						}
					}
				}
			}
			
			ctx.save();
			ctx.translate(obj.x - Camera.x, obj.y - Camera.y);
			ctx.rotate(obj.dir);
			tilesets.spell.draw(0, -32, -16, settings.cellSize, settings.cellSize);
			ctx.restore();
			
			tilesets.enemy.draw(72, 
				targetX - Camera.x, 
				targetY - Camera.y,
				settings.cellSize, settings.cellSize
			);
			
			obj.frames++;
		}
	}
	
	static TeleportInfo = {mana : 15, cooldown : 240, icon : 56, description : "Oh the places you'll go! Allows you to  teleport to valid spaces. Range: 400    (radius), Mana: 15, Cooldown : 4", range : Spell.TeleportTarget};
	static Teleport(originX, originY, targetX, targetY){
		return (obj) => {
			player.x = Math.floor(targetX / 64) * 64;
			player.y = Math.floor(targetY / 64) * 64;;
			room.objects.splice(room.objects.indexOf(obj), 1);
		}
	}

	static TelepathyInfo = {mana : 5, cooldown : 60, icon : 57, description : "Allows you to communicate without       speaking to others that share your      language. Range: Self, Mana: 5", range : Spell.Self}
	static Telepathy(obj){
		playOnce(sounds.staffEffect);
		return () => {
			obj.hasTelepathy = true;
		}
	}

	static AirCutterInfo = {mana : 2, cooldown : 10, icon : 58, description : "Create a concentrated blast of wind thatcan harm enemies. Range: 200 (Radius),  Mana : 2, Damage: 2, Cooldown: 1/6", range : Spell.CircleTarget, radius: 200};
	static AirCutter(originX, originY, targetX, targetY, fromPlayer = false){
		return (obj) => {
			if(obj.frame === undefined){
				obj.frame = 0;
				obj.damage = 2;
				obj.size = 1;
				obj.pull = 0;
				let tree = Spell.upgradeTree.AirCutter.path;
				if(fromPlayer){
					for(var path of tree){
						for(var tier of path){
							if(!tier.unlocked) break;
							for(var effect in tier.effects){
								obj[effect] += tier.effects[effect];
							}
						}
					}
				}
			}
			ctx.globalAlpha = -1/25 * Math.pow(obj.frame  - 5, 2) + 1;
			tilesets.UI.draw(58, targetX - 32 * obj.size - Camera.x, targetY - 32 * obj.size - Camera.y, settings.cellSize * 2 * obj.size, settings.cellSize * 2 * obj.size);
			ctx.globalAlpha = 1;
			if(obj.frame == 5){
				for(var object of room.objects){
					if(object.constructor.name == "Entity" && Math.hypot(targetX - object.x, targetY - object.y) < 80 * obj.size){
						object.damage(obj.damage);
						if(object != player){
							if(object.x < targetX){
								object.x += obj.pull;
							} else if(object.x > targetX){
								object.x -= obj.pull;
							}
							if(object.y < targetY){
								object.y += obj.pull;
							} else if(object.y > targetY){
								object.y -= obj.pull;
							}
						}
					}
				}
			}
			obj.frame++;
			if(obj.frame > 10){
				room.objects.splice(room.objects.indexOf(obj), 1);
			}
		}
	}

	static CircleTarget(radius){
		ctx.strokeStyle = "#51a7e1";
		ctx.beginPath();
		ctx.arc(player.x + settings.cellSize / 2 - Camera.x, player.y + settings.cellSize / 2 - Camera.y, radius, 0, 2 * Math.PI);
		ctx.lineWidth = 10;
		ctx.closePath();
		ctx.fillStyle = "rgba(81, 167, 225, 0.2)";
		ctx.fill();
		ctx.stroke();
		if(Math.hypot(cic.mouseX - (player.x + settings.cellSize / 2 - Camera.x), cic.mouseY - (player.y + settings.cellSize / 2 - Camera.y)) < radius){
			tilesets.enemy.draw(72, cic.mouseX  - 32, cic.mouseY - 32, 64, 64);
			return true;
		}
	}

	static TeleportTarget(radius){
		ctx.strokeStyle = "#51a7e1";
		ctx.beginPath();
		ctx.arc(player.x + settings.cellSize / 2 - Camera.x, player.y + settings.cellSize / 2 - Camera.y, radius, 0, 2 * Math.PI);
		ctx.lineWidth = 10;
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle = "rgba(81, 167, 225, 0.2)";
		
		var validTarget = false;
		var x1 = Math.floor(player.x / settings.cellSize) - 6;
		var x2 = Math.floor(player.x / settings.cellSize) + 6;
		var y1 = Math.floor(player.y / settings.cellSize) - 6;
		var y2 = Math.floor(player.y / settings.cellSize) + 6;
		
		if(x1 < 0) x1 = 0;
		if(x2 > room.data[1][0].length - 1) x2 = room.data[1][0].length - 1;
		if(y1 < 0) y1 = 0;
		if(y2 > room.data[1].length - 1) y2 = room.data[1].length - 1;
		
		for(var y = y1; y <= y2; y++){
			for(var x = x1; x <= x2; x++){
				if(room.data[1][y][x] == 457){
					ctx.fillRect(x * settings.cellSize - Camera.x, y * settings.cellSize - Camera.y, settings.cellSize, settings.cellSize);
					if (
						cic.mouseX > x * settings.cellSize - Camera.x && 
						cic.mouseX < x * settings.cellSize - Camera.x + settings.cellSize && 
						cic.mouseY > y * settings.cellSize - Camera.y && 
						cic.mouseY < y * settings.cellSize - Camera.y + settings.cellSize && 
						Math.hypot(cic.mouseX - (player.x + settings.cellSize / 2 - Camera.x), cic.mouseY - (player.y + settings.cellSize / 2 - Camera.y)) < radius
					){
						ctx.globalAlpha = 0.5;
						tilesets.spell.draw(3, cic.mouseX  - 32, cic.mouseY - 32, 64, 64);
						ctx.globalAlpha = 1;
						validTarget = true;
					}
				}
			}
		}
		//if(Math.hypot(cic.mouseX - (player.x + settings.cellSize / 2 - Camera.x), cic.mouseY - (player.y + settings.cellSize / 2 - Camera.y)) < radius){
			return validTarget;
		//}
	}
	
	static Self(){
		ctx.strokeStyle = "#51a7e1";
		ctx.beginPath();
		ctx.arc(player.x + settings.cellSize / 2 - Camera.x, player.y + settings.cellSize / 2 - Camera.y, 55, 0, 2 * Math.PI);
		ctx.lineWidth = 10;
		ctx.closePath();
		ctx.fillStyle = "rgba(81, 167, 225, 0.2)";
		ctx.fill();
		ctx.stroke();
		if(Math.hypot(cic.mouseX - (player.x + settings.cellSize / 2 - Camera.x), cic.mouseY - (player.y + settings.cellSize / 2 - Camera.y)) < 55){
			tilesets.enemy.draw(72, player.x + settings.cellSize / 2 - Camera.x - 32, player.y + settings.cellSize / 2 - Camera.y - 32, 64, 64);
			return true;
		}
	}
}