class Entity {
	constructor(x, y, behavior, setup, lootTable, tags = []){
		this.x = x;
		this.y = y;
		this.health = 10;
		this.maxHealth = 10;
		this.behavior = behavior;
		this.animFrame = 0;
		this.damageFrames = 0;
		this.tags = tags;
		this.lootTable = lootTable;
		if(typeof setup == "function") setup(this);
	}
	
	draw(){
		if(room.frame == 1 && this.tags.includes("enemy") && saveData.completeRooms.indexOf(saveData.currentRoom) > -1){
			room.objects.splice(room.objects.indexOf(this), 1);
		}
		if(Camera.target == this){
			var x = 500 - settings.cellSize / 2;
			var y = 500 - settings.cellSize / 2;
			
			if(this.x < x){
				x = this.x;
			}
			if(this.x > room.rightBound - 500 - settings.cellSize / 2){
				x = 1000 + this.x - room.rightBound;
			}
			
			if(this.y < y){
				y = this.y;
			}
			if(this.y > room.bottomBound - 500 - settings.cellSize / 2){
				y = 1000 + this.y - room.bottomBound;
			}
		}else{
			var x = this.x - Camera.x;
			var y = this.y - Camera.y;
		}
		this.behavior(this, x, y);
		this.animFrame++;
	}
	
	damage(val){
		if(this.damageFrames == 0){
			playOnce(sounds.hurt);
			this.health -= val;
			this.damageFrames = 20;
			room.UI.push(new UI(this.x, this.y, UI.damageIndicator(val)));
		}
	}
	
	heal(val){
		this.health += val;
		
		if(this.health > this.maxHealth) this.health = this.maxHealth;
		room.UI.push(new UI(this.x, this.y, UI.damageIndicator(val, "52, 235, 58")));
	}

	gainMana(val){
		this.mana += val;
		
		if(this.mana > 30) this.mana = 30;
	}
	
	checkCollisions(xBound1, xBound2, yBound1, yBound2){
		var hits = [];
		for(var y = yBound1; y <= yBound2; y++){
			for(var x = xBound1; x <= xBound2; x++){
				if(room.data[1][y] && room.data[1][y][x] !== undefined)
				var collFunctions = tilesets.overworld.collisions[room.data[1][y][x]];
				if(collFunctions){
					for(var collFunction of collFunctions){
						var hit = collFunction(x, y, this.x, this.y);
						if(hit){
							hits.push(hit);
						}
					}
				}
			}
		}
		return hits;
	}
	
	dropLoot(x, y, table){
		var table = this.lootTable;
		for(var i of table){
			if(Math.random() < i.chance){
				for(var spawn of i.spawn){
					room.objects.push(new Entity(this.x + Math.random() * 30 - 15, this.y + Math.random() * 30 - 15, spawn()));
				}
			}
		}
	}
	
	static dropSkillBeanTable = [
		{chance : 1, spawn : [Entity.skillBean]},
	]

	static enemyLootTable = [
		{chance : 0.5, spawn : [Entity.skillBean]},
		{chance : 0.25, spawn : [Entity.skillBean]},
		{chance : 0.1, spawn : [Entity.healthPotion]},
		{chance : 0.1, spawn : [Entity.manaPotion]},
	];

	static bossEnemyLootTable = [
		{chance : 0.1, spawn : [Entity.healthPotion]},
		{chance : 0.3, spawn : [Entity.manaPotion]},
	]
	
	static playerSetup(obj){
		obj.health = 15;
		obj.maxHealth = 15;
		obj.mana = 30;
		obj.selectedSpell = -1;
		obj.skillBeans = 0;
		obj.spells = [
			//"Fireball", "Bomb", "AirCutter", "Teleport",
		];
		obj.keys = 0;
		obj.dir = 1; //-2: down, -1: left, 1: right, 2: up
		if(saveData.currentRoom.includes("castle")){
			obj.type = "human";
		}else{
			obj.type = "dodo";
		}
	}
	static MoveWithKeys(){
		return (obj, x, y) => {
			if(!settings.inMenu){
				var mapX = Math.floor(obj.x / settings.cellSize);
				var mapY = Math.floor(obj.y / settings.cellSize);
				
				var tryX = 0;
				var tryY = 0;
				if(cic.getKey("ArrowRight") || cic.getKey("d")) tryX++;
				if(cic.getKey("ArrowLeft") || cic.getKey("a")) tryX--;
				if(cic.getKey("ArrowDown") || cic.getKey("s")) tryY++;
				if(cic.getKey("ArrowUp") || cic.getKey("w")) tryY--;
				
				if(tryX > 0){
					obj.x += 4 * (settings.debug.fast ? 2 : 1);
					
					var hit = obj.checkCollisions(mapX + 1, mapX + 2, mapY - 1, mapY + 1);
					var min = obj.x + settings.cellSize;
					for(var i = 0; i < hit.length; i++){
						if(hit[i] && hit[i][0] < min) min = hit[i][0];
					}
					obj.x = min - settings.cellSize;
					
					if(obj.x + 64 > room.rightBound) obj.x = room.rightBound - 64;
					
					obj.dir = 1;
				}
				
				if(tryX < 0){
					obj.x -= 4 * (settings.debug.fast ? 2 : 1);

					var hit = obj.checkCollisions(mapX - 1, mapX, mapY - 1, mapY + 1);
					var max = obj.x;
					for(var i = 0; i < hit.length; i++){
						if(hit[i] && hit[i][2] > max) max = hit[i][2];
					}
					obj.x = max;
					if(obj.x < room.leftBound) obj.x = room.leftBound;
					
					obj.dir = -1;
				}

				if(tryY > 0){
					obj.y += 4 * (settings.debug.fast ? 2 : 1);
					
					var hit = obj.checkCollisions(mapX - 1, mapX + 1, mapY, mapY + 2);
					var min = obj.y + settings.cellSize;
					for(var i = 0; i < hit.length; i++){
						if(hit[i] && hit[i][1] < min) min = hit[i][1];
					}
					obj.y = min - settings.cellSize;
					
					if(obj.y + 64 > room.bottomBound) obj.y = room.bottomBound - 64;
					if(obj.type == "human") obj.dir = -2;
				}
				if(tryY < 0){
					obj.y -= 4 * (settings.debug.fast ? 2 : 1);
					
					var hit = obj.checkCollisions(mapX - 1, mapX + 1, mapY - 1, mapY + 1);
					var max = obj.y;
					for(var i = 0; i < hit.length; i++){
						if(hit[i] && hit[i][3] > max) max = hit[i][3];
					}
					obj.y = max;
					
					if(obj.y < room.topBound) obj.y = room.topBound;
					if(obj.type == "human") obj.dir = 2;
				}
			}
			
			switch(obj.type){
				case "human":
					if(obj.dir == 2){
						if(!tryX && !tryY){
							tilesets.enemy.draw(216, x, y, settings.cellSize, settings.cellSize);
						}else{
							tilesets.enemy.draw(246, x, y, settings.cellSize, settings.cellSize);
						}
					}else if(obj.dir == -2){
						if(!tryX && !tryY){
							tilesets.enemy.draw(195, x, y, settings.cellSize, settings.cellSize);
						}else{
							tilesets.enemy.draw(225, x, y, settings.cellSize, settings.cellSize);
						}
					}else if(obj.dir == 1){
						if(!tryX && !tryY){
							tilesets.enemy.draw(210, x, y, settings.cellSize, settings.cellSize);
						}else{
							tilesets.enemy.draw(240, x, y, settings.cellSize, settings.cellSize);
						}
					}else{
						if(!tryX && !tryY){
							tilesets.enemy.draw(201, x, y, settings.cellSize, settings.cellSize);
						}else{
							tilesets.enemy.draw(231, x, y, settings.cellSize, settings.cellSize);
						}
					}
					break;
				case "dodo":
					if(obj.dir == 1){
						if(!tryX && !tryY){
							tilesets.enemy.draw(122, x, y, settings.cellSize, settings.cellSize);
							tilesets.enemy.draw(123, x + settings.cellSize, y, settings.cellSize, settings.cellSize);
						}else{
							tilesets.enemy.draw(128, x, y, settings.cellSize, settings.cellSize);
							tilesets.enemy.draw(130, x + settings.cellSize, y, settings.cellSize, settings.cellSize);
						}
					}else{
						if(!tryX && !tryY){
							tilesets.enemy.draw(121, x, y, settings.cellSize, settings.cellSize);
							tilesets.enemy.draw(120, x - settings.cellSize, y, settings.cellSize, settings.cellSize);
						}else{
							tilesets.enemy.draw(126, x, y, settings.cellSize, settings.cellSize);
							tilesets.enemy.draw(124, x - settings.cellSize, y, settings.cellSize, settings.cellSize);
						}
					}
					break;
			}
			if(obj.mana < 30) obj.mana += 0.01; //Mana regen
			
			if(obj.damageFrames > 0){
				if(obj.dir == 1){
					tilesets.enemy.draw(289, x, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
					tilesets.enemy.draw(285, x + settings.cellSize, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
				}else{
					tilesets.enemy.draw(274, x, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
					tilesets.enemy.draw(270, x - settings.cellSize, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
				}
				obj.damageFrames--;
			}
			
			if(obj.health <= 0){
				obj.health = obj.maxHealth;
				obj.mana = 30;
				saveData.checkpoint();
			}
		}
	}
	
	static Follow(speed){
		return (obj, x, y) => {
			if(settings.inMenu) return;
			
			var mapX = Math.floor(obj.x / settings.cellSize);
			var mapY = Math.floor(obj.y / settings.cellSize);
			if(mapX < 1){ mapX = 1; }
			if(mapY < 1){ mapY = 1; }
			if(mapX > room.data[1][0].length - 3){ mapX = room.data[1][0].length - 3 }
			if(mapY > room.data[1].length - 3){ mapY = room.data[1].length - 3 }
			var compareX = obj.x - room.objects[0].x;
			var compareY = obj.y - room.objects[0].y;
			
			if(Math.abs(compareX) >= Math.abs(compareY) && compareX < 0){
				obj.x += speed;
				
				var hit = obj.checkCollisions(mapX + 1, mapX + 2, mapY - 1, mapY + 1);
				if(hit) obj.x = hit[0] - settings.cellSize;
			}
			if(Math.abs(compareX) >= Math.abs(compareY) && compareX > 0){
				obj.x -= speed;

				var hit = obj.checkCollisions(mapX - 1, mapX, mapY - 1, mapY + 1);
				if(hit) obj.x = hit[2];
			}

			if(Math.abs(compareX) < Math.abs(compareY) && compareY < 0){
				obj.y += speed;
				
				var hit = obj.checkCollisions(mapX - 1, mapX + 1, mapY + 1, mapY + 2);
				if(hit) obj.y = hit[1] - settings.cellSize;
			}
			if(Math.abs(compareX) < Math.abs(compareY) && compareY > 0){
				obj.y -= speed;
				
				var hit = obj.checkCollisions(mapX - 1, mapX + 1, mapY - 1, mapY);
				if(hit) obj.y = hit[3];
			}
			
			tilesets.enemy.draw(15, x, y, settings.cellSize, settings.cellSize);
		}
	}
	
	static BomberPlantSetup(obj){
		obj.tags.push("enemy");
		obj.lootTable = obj.lootTable || Entity.enemyLootTable;
		obj.cooldown = 5;
	}
	static SuperBomberPlantSetup(obj){
		obj.tags.push("enemy");
		obj.lootTable = obj.lootTable || Entity.enemyLootTable;
		obj.cooldown = 1;
	}
	static BomberPlant(delay){
		return (obj, x, y) => {
			if(obj.health <= 0){
				if(obj.mode != 2){
					obj.mode = 2;
					obj.animFrame = 0;
				}
			}else if(Math.hypot(obj.x - room.objects[0].x, obj.y - room.objects[0].y) < 500){				
				obj.mode = 1;
			}else{
				obj.mode = 0;
			}
			
			switch(obj.mode){
				case 0:
					tilesets.enemy.draw(15, x, y, settings.cellSize, settings.cellSize, obj.animFrame);
					break;
				case 1:
					tilesets.enemy.draw(0, x, y, settings.cellSize, settings.cellSize);
					if(((room.frame / obj.cooldown) + delay) % 10 == 8){
						room.objects.push(new Spell(Spell.Bomb(obj.x, obj.y, room.objects[0].x, room.objects[0].y)));
					}
					
					break;
				case 2:
					if(obj.animFrame == 0) obj.dropLoot();
					tilesets.enemy.draw(30, x, y, settings.cellSize, settings.cellSize, obj.animFrame);
					if(Math.floor(obj.animFrame / 5) % 7 == 6){
						room.objects.splice(room.objects.indexOf(obj), 1);
					}
					break;
			}
			if(obj.damageFrames > 0){
				tilesets.enemy.draw(45, x, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
				obj.damageFrames--;
			}
		}
	}

	static PinkbatSetup(obj){
		obj.health = 10;
		obj.tags.push("enemy");
		obj.lootTable = obj.lootTable || Entity.enemyLootTable;
	}
	static Pinkbat(interval, range){
		this.mode = 0;
		return (obj, x, y) => {
			if(obj.health <= 0){
				if(obj.mode != 2){
					obj.mode = 2;
					obj.animFrame = 0;
				}
			}else if(Math.hypot(obj.x - player.x, obj.y - player.y) < range){				
				if(obj.mode == 0){
					obj.velX = 0;
					obj.velY = 0;
				}
				obj.mode = 1;
			}else{
				obj.mode = 0;
			}

			switch(obj.mode){
				case 0:
					tilesets.enemy.draw(105, x, y, settings.cellSize, settings.cellSize, obj.animFrame);
					break;
				case 1:
					if((obj.animFrame / interval) % 3 == 1){
						obj.velX = (obj.x - player.x) / (2 * interval);
						obj.velY = (obj.y - player.y) / (2 * interval);
					}

					if(obj.velX > 0){
						tilesets.enemy.draw(105, x, y, settings.cellSize, settings.cellSize);
					}else{
						tilesets.enemy.draw(110, x, y, settings.cellSize, settings.cellSize);
					}
					if(Math.floor(obj.animFrame / interval) % 3 != 0){
						obj.x -= obj.velX;
						obj.y -= obj.velY;
					}
					break;
				case 2:
					if(obj.animFrame == 0) obj.dropLoot();
					tilesets.enemy.draw(75, x, y, settings.cellSize, settings.cellSize, obj.animFrame);
					if(Math.floor(obj.animFrame / 5) % 7 == 6){
						room.objects.splice(room.objects.indexOf(obj), 1);
					}
					break;
			}
			if(Math.hypot(player.x - obj.x, player.y - obj.y) < 60){
				player.damage(4);
			}
			if(obj.damageFrames > 0){
				if(obj.velX > 0){
					tilesets.enemy.draw(99, x, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
				}else{
					tilesets.enemy.draw(84, x, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
				}
				
				obj.damageFrames--;
			}
		}
	}
	
	static PhantomSetup (obj){
		obj.health = 3;
		obj.tags.push("enemy");
		obj.lootTable = obj.lootTable || Entity.enemyLootTable;
	}
	static BossPhantomSetup (obj){
		obj.health = 10;
		obj.tags.push("enemy");
		obj.lootTable = obj.lootTable || Entity.enemyLootTable;
	}
	static Phantom(speed){
		this.mode = 1;
		return (obj, x, y) => {
			if(obj.health <= 0){
				if(obj.mode != 2){
					obj.mode = 2;
					obj.animFrame = 0;
				}
			}else{
				obj.mode = 1;
			}

			var velX;
			var velY;
			switch(obj.mode){
				case 1:
					var dist = Math.hypot(obj.x - player.x, obj.y - player.y);
					
					velX = (obj.x - player.x) * speed / dist;
					velY = (obj.y - player.y) * speed / dist;
					
					if(velX > 0){
						tilesets.enemy.draw(135, x, y, settings.cellSize, settings.cellSize);
					}else{
						tilesets.enemy.draw(150, x, y, settings.cellSize, settings.cellSize);
					}
					
					if(velX < Infinity) obj.x -= velX;
					if(velY < Infinity) obj.y -= velY;
					break;
				case 2:
					if(obj.animFrame == 0) obj.dropLoot();
					tilesets.enemy.draw(142, x, y, settings.cellSize, settings.cellSize, obj.animFrame);
					if(Math.floor(obj.animFrame / 5) % 7 == 6){
						room.objects.splice(room.objects.indexOf(obj), 1);
					}
					break;
			}
			if(obj.damageFrames > 0){
				if(velX > 0){
					tilesets.enemy.draw(169, x, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
				}else{
					tilesets.enemy.draw(184, x, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
				}
				
				obj.damageFrames--;
			}
			if(Math.hypot(player.x - obj.x, player.y - obj.y) < 60){
				player.damage(2);
			}
		}
	}

	static SpinnerSetup (obj){
		obj.health = 5;
		obj.tags.push("enemy");
		obj.lootTable = obj.lootTable || Entity.enemyLootTable;
	}
	static Spinner(speed, direction, bound1, bound2){
		return (obj, x, y) => {
			if(obj.health <= 0){
				if(obj.mode != 2){
					obj.mode = 2;
					obj.animFrame = 0;
				}
			}else{
				obj.mode = 1;
			}
			switch(obj.mode){
				case 1:
					if(direction == 0){
						obj.x += speed;
						if(obj.x <= bound1){
							speed = 0 - speed;
						}
						if(obj.x >= bound2){
							speed = 0 - speed;
						}
					} else{
						obj.y += speed;
						if(obj.y <= bound1){
							speed = 0 - speed;
						}
						if(obj.y >= bound2){
							speed = 0 - speed;
						}
					}
					tilesets.enemy.draw(255, x, y, settings.cellSize, settings.cellSize);
					break;
				case 2:
					if(obj.animFrame == 0) obj.dropLoot();
					tilesets.enemy.draw(258, x, y, settings.cellSize, settings.cellSize, obj.animFrame);
					if(Math.floor(obj.animFrame / 5) % 7 == 6){
						room.objects.splice(room.objects.indexOf(obj), 1);
					}
					break;
			}
			if(obj.damageFrames > 0){
				tilesets.enemy.draw(258, x, y, settings.cellSize, settings.cellSize, 4 - (obj.damageFrames / 5));
				obj.damageFrames--;
			}
			if(Math.hypot(player.x - obj.x, player.y - obj.y) < 60){
				player.damage(5);
			}
		}
	}

	static NPC(image = 195){
		return (obj, x, y) => {
			if(!obj.image) obj.image = image;
			tilesets.enemy.draw(obj.image, x, y, settings.cellSize, settings.cellSize);
		}
	}

	static fadeIn(img){
		return (obj, x, y) => {
			if(!obj.frame) obj.frame = 0;
			ctx.globalAlpha = obj.frame / 60;
			ctx.save();
			ctx.translate(obj.x + 64 * 0.8 - 20 - Camera.x, obj.y + 64 * 0.8 + Math.sin(obj.frame / 20) * 10 - Camera.y);
			ctx.rotate((Math.sin(obj.frame / 40) + 1) * Math.PI / 4);
			tilesets.enemy.draw(img, -64 * 0.8 - 8, - 64 * 0.8, settings.cellSize, settings.cellSize);
			ctx.restore();
			ctx.globalAlpha = 1;
			obj.frame++;
		}
	}

	static openChestHandler(x, y){
		this.frame = 0;
		room.data[1][y][x] = 17;

		return (obj) => {
			tilesets.overworld.draw(494, x * settings.cellSize - Camera.x, y * settings.cellSize - Camera.y, settings.cellSize, settings.cellSize, this.frame);
			if(this.frame == 39){
				room.data[1][y][x] = 499;
				room.objects.splice(room.objects.indexOf(this), 1);
			}
			this.frame++;
		}
	}

	static skillBean(){
		return (obj, x, y) => {
			if(obj.frame === undefined){
				tilesets.enemy.draw(173, x, y, settings.cellSize, settings.cellSize);
				if(Math.hypot(obj.x - player.x, obj.y - player.y) < 64){
					playOnce(sounds.pickup);
					player.skillBeans++;
					obj.frame = 0;
				}
			}else{
				tilesets.enemy.draw(188, x, y, settings.cellSize, settings.cellSize, obj.frame);
				obj.frame++;
				if(obj.frame >= 30) room.objects.splice(room.objects.indexOf(obj), 1);
			}
		}
	}
	
	static healthPotion(){
		return (obj, x, y) => {
			tilesets.enemy.draw(179, x, y + 5 * Math.sin(room.frame / 20), settings.cellSize, settings.cellSize);
			if(Math.hypot(obj.x - player.x, obj.y - player.y) < 64){
				playOnce(sounds.pickup);
				player.heal(10);
				room.objects.splice(room.objects.indexOf(obj), 1);
			}			
		}
	}

	static manaPotion(){
		return (obj, x, y) => {
			tilesets.enemy.draw(194, x, y + 5 * Math.sin(room.frame / 20), settings.cellSize, settings.cellSize);
			if(Math.hypot(obj.x - player.x, obj.y - player.y) < 64){
				playOnce(sounds.pickup);
				player.gainMana(10);
				room.objects.splice(room.objects.indexOf(obj), 1);
			}			
		}
	}
	
	static key(){
		return (obj, x, y) => {
			if(obj.frame === undefined){
				tilesets.enemy.draw(278, x, y, settings.cellSize, settings.cellSize);
				if(Math.hypot(obj.x - player.x, obj.y - player.y) < 64){
					playOnce(sounds.pickup);
					player.keys++;
					obj.frame = 0;
				}
			}else{
				tilesets.enemy.draw(293, x, y, settings.cellSize, settings.cellSize, obj.frame);
				obj.frame++;
				if(obj.frame >= 30) room.objects.splice(room.objects.indexOf(obj), 1);
			}
		}
	}
	
	static explosion(size){
		return (obj, x, y) => {
			if(obj.frame === undefined){
				obj.frame = 0;
			}
			tilesets.spell.draw(11, 
				x + 32 - 3 * settings.cellSize * size,
				y + 32 - 3 * settings.cellSize * size,
				settings.cellSize * 6 * size,
				settings.cellSize * 6 * size,
				obj.frame
			);
			obj.frame++;
			if(obj.frame >= 6) room.objects.splice(room.objects.indexOf(obj), 1);
		}
	}
	
	static MyrakiSetup(obj){
		obj.state = 0;
		obj.health = 200;
		obj.maxHealth = 200;
		obj.cooldown = 0;
		obj.times = 0;
		obj.phases = 3;
	}
	static Myraki(){
		return (obj, x, y) => {
			tilesets.enemy.draw(195, x, y, settings.cellSize, settings.cellSize);
			switch(obj.state){
				case 0: //Idle
					break;
				case 1: //Evade
					if(obj.cooldown == 0){
						if(Math.hypot(player.x - obj.x, player.y - obj.y) < 300 || obj.damageFrames > 0){
							room.objects.push(new Entity(obj.x, obj.y, Entity.BomberPlant(0), Entity.BomberPlantSetup, Entity.bossEnemyLootTable));
							teleport(obj);
							obj.times++;
							if(obj.times >= 7){
								obj.times = 0;
								obj.state = 2;
							}
						}
					}
					break;
				case 2: //Cutty
					if(obj.cooldown == 0){
						if(Math.floor(obj.times / 3) % 2 == 0){
							for(var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4){
								room.objects.push(new Spell(Spell.AirCutter(0, 0, obj.x + Math.cos(angle) * 150, obj.y + Math.sin(angle) * 150)));
							}
						}else{
							for(var i = 0; i < 5; i++){
								room.objects.push(new Spell(Spell.Bomb(obj.x, obj.y, player.x + Math.random() * 200 - 100, player.y + Math.random() * 200 - 100)));
							}
						}
						obj.times++;
						obj.cooldown = 50;
						if(obj.times >= 12){
							obj.times = 0;
							obj.state = 1;
						}
					}
					break;
				case 3: //Spewy
					room.objects.push(new Entity(obj.x, obj.y, Entity.Phantom(Math.random() * 2 + 1), Entity.BossPhantomSetup, Entity.bossEnemyLootTable));
					obj.times++
					if(obj.times >= 10){
						obj.state = 1;
					}
					break;
			}
			if(obj.damageFrames > 0) obj.damageFrames--;
			if(obj.cooldown > 0) obj.cooldown--;
			if(obj.state > 0 && (obj.health < obj.maxHealth * 2 / 3 && obj.phases == 3) || (obj.health < obj.maxHealth / 3 && obj.phases == 2)){
				obj.phases--;
				obj.times = 0;
				obj.state = 3;
			}
			if(obj.health < 0){
				room.objects.splice(room.objects.indexOf(obj));
				room.objects.push(new Entity(500, 500, Entity.explosion(20)));
				room.UI.push(new UI(0, 0, UI.brightFlash(120, () => loadRoom("ending", -1, 1), true)));
			}
		}
		function teleport(obj){
			do {
				var success = false;
				while(!success){
					var newX = Math.floor(obj.x / settings.cellSize) + Math.floor(Math.random() * 13) - 6;
					var newY = Math.floor(obj.y / settings.cellSize) + Math.floor(Math.random() * 13) - 6;
					
					if(room.data[1][newY]){
						if(room.data[1][newY][newX] == 457){
							obj.x = newX * settings.cellSize;
							obj.y = newY * settings.cellSize;
							success = true;
						}
					}
				}
				obj.cooldown = 60;
			} while(Math.hypot(player.x - obj.x, player.y - obj.y) < 300);
		}
	}
}