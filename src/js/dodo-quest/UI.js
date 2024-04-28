class UI {
	constructor(x, y, behavior){
		this.x = x;
		this.y = y;
		this.behavior = behavior;
	}
	
	draw(){
		this.behavior(this);
	}
	
	static textBox(message, deleteObj = true, subText = true, customComplete = null){
		if(subText) settings.inMenu = "text";
		
		return (obj) => {
			if(!obj.frame){
				obj.currentText = [""];
				obj.frame = 0;
			}
			
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			ctx.fillRect(obj.x, obj.y, 958, 250);
			ctx.fillStyle = "black";
			ctx.font = "30pt Consolas";
			ctx.textBaseline = "top";
			
			var totalLength = 0;
			for(var i = 0; i < obj.currentText.length; i++){
				ctx.fillText(obj.currentText[i], obj.x + 40, obj.y + 40 + 45 * i);
				totalLength += obj.currentText[i].length;
			}
			
			tilesets.UI.draw(0, obj.x - 6, obj.y - 6, 97, 97);
			for(var i = 1; i < 9; i++){
				tilesets.UI.draw(1, obj.x - 6 + 97 * i, obj.y - 6, 97, 97);
				tilesets.UI.draw(37, obj.x - 6 + 97 * i, obj.y + 159, 97, 97);
			}
			tilesets.UI.draw(2, obj.x - 6 + 873, obj.y - 6, 97, 97);
			tilesets.UI.draw(18, obj.x - 6, obj.y - 6 + 97, 97, 97);
			tilesets.UI.draw(20, obj.x - 6 + 873, obj.y - 6 + 97, 97, 97);
			tilesets.UI.draw(36, obj.x - 6, obj.y + 159, 97, 97);
			
			tilesets.UI.draw(38, obj.x - 6 + 873, obj.y + 159, 97, 97);
			if(customComplete && customComplete()){
				if(deleteObj) room.UI.splice(room.UI.indexOf(obj), 1);
				if(subText) settings.inMenu = false;
				return true;
			}
			if(totalLength >= message.length){
				if(Math.floor(room.frame / 30) % 2 == 0){
					if(!customComplete) tilesets.UI.draw(19, obj.x - 45 + 873, obj.y + 192, 80, 80);
				}
				if(cic.getKeyDown("e") && customComplete == null){
					if(deleteObj) room.UI.splice(room.UI.indexOf(obj), 1);
					if(subText) settings.inMenu = false;
					return true;
				}
				return;
			}else{
				sounds.textBeep.play();
				if(cic.getKeyDown("e") && obj.frame > 0){ //Skip
					var words = message.substr(totalLength).split(" ");
					for(var i = 0; i < words.length; i++){
						if(obj.currentText[obj.currentText.length - 1].length + words[i].length >= 40){
							obj.currentText.push("");
						}
						obj.currentText[obj.currentText.length - 1] += words[i] + " ";
						totalLength += 1 + words[i].length;
					}
					return;
				}
			}
			
			if(obj.currentText[obj.currentText.length - 1].length >= 40){
				obj.currentText.push("");
			}
			if(message[totalLength]){
				obj.currentText[obj.currentText.length - 1] += message[totalLength];
			}
			if(message.substr(totalLength).split(" ")[0] == "" && message.substr(totalLength).split(" ")[1].length + obj.currentText[obj.currentText.length - 1].length >= 40){
				obj.currentText.push("");
			}
			
			obj.frame++;
		}
	}
	
	static statusBar(img, color, variable, max){
		return (obj) => {
			ctx.fillStyle = color;
			if(player[variable]){
				ctx.fillRect(obj.x + 68, obj.y, (156 * player[variable]) / max, 64);
				if(variable == "mana"){
					if(Spell[player.spells[player.selectedSpell] + "Info"]){
						if(player.mana < Spell[player.spells[player.selectedSpell] + "Info"].mana){
							ctx.fillStyle = "rgba(255, 0, 0, " + (Math.sin(room.frame / 15) + 0.7) +  ")";
						}else{
							ctx.fillStyle = "rgba(255, 255, 255, " + (Math.sin(room.frame / 15) + 0.7) +  ")";
						}
						var cost = getSpellProperty(player.spells[player.selectedSpell], Spell[player.spells[player.selectedSpell] + "Info"].mana, "mana");
						ctx.fillRect(
							obj.x + 68 + 156 * (player.mana - cost) / max, obj.y,
							156 * cost / max, 64
						);
					}
				}
			}
			for(var i = img; i < img + 4; i++){
				tilesets.UI.draw(i, obj.x + (i - img) * 64, obj.y, 64, 64);
			}
		}
	}
	
	static spellSlot(index, key){
		return (obj) => {
			if(!obj.cooldown) obj.cooldown = 0;
			
			var spell = Spell[player.spells[index]];
			if(cic.getKeyDown(key)){
				if(player.selectedSpell == index){
					player.selectedSpell = -1;
				}else{
					player.selectedSpell = index;
				}
			}
			if(player.selectedSpell == index){
				tilesets.UI.draw(25, obj.x, obj.y, 64, 64);
			}else{
				tilesets.UI.draw(7, obj.x, obj.y, 64, 64);
			}
			if(obj.cooldown > 0){
				obj.cooldown--;
			}
			if(!spell) return;
			
			tilesets.UI.draw(Spell[spell.name + "Info"].icon, obj.x + 8, obj.y + 8, 48, 48);
			ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
			ctx.fillRect(obj.x + 8, obj.y + 56, 48, -48 * obj.cooldown / getSpellProperty(spell.name, Spell[spell.name + "Info"].cooldown, "cooldown"));
			
			if(settings.inMenu && settings.inMenu != "castable" || player.selectedSpell != index) return;
			
			var arg = 400;
			if(Spell[spell.name + "Info"].radius){
				arg = getSpellProperty(spell.name, Spell[spell.name + "Info"].radius, "range");
			}
			if(spell && Spell[spell.name + "Info"].range(arg) && cic.getMouseButtonDown(1) && player.mana >= Spell[spell.name + "Info"].mana && obj.cooldown == 0){
				playOnce(sounds.castSpell);
				switch(Spell[spell.name + "Info"].range.name){
					case "CircleTarget":
						room.objects.push(
							new Spell(spell(
								player.x,
								player.y,
								cic.mouseX + Camera.x - settings.cellSize / 2,
								cic.mouseY + Camera.y  - settings.cellSize / 2,
								true
							))
						);
						break;
					case "TeleportTarget":
						room.objects.push(
							new Spell(spell(
								player.x,
								player.y,
								cic.mouseX + Camera.x,
								cic.mouseY + Camera.y,
							))
						);

						break;
					case "Self":
						room.objects.push(new Spell(spell(player)));
						break;
				}
				player.mana -= getSpellProperty(spell.name, Spell[spell.name + "Info"].mana, "mana");
				obj.cooldown = getSpellProperty(spell.name, Spell[spell.name + "Info"].cooldown, "cooldown");
			}
		}

	}
	
	static button(w, h, main, hover, onClick){
		return (obj) => {
			if(cic.mouseX > obj.x && cic.mouseY > obj.y && cic.mouseX < obj.x + w && cic.mouseY < obj.y + h){
				tilesets.UI.draw(hover, obj.x, obj.y, w, h);
				if(cic.getMouseButtonDown(1)){
					onClick();
				}
			}else{
				tilesets.UI.draw(main, obj.x, obj.y, w, h);
			}
		}
	}
	
	static menu(){
		return (obj) => {
			if(settings.inMenu != "spells") return;
			if(obj.selectedSpell === undefined) obj.selectedSpell = null;
			
			var spells = Spell.upgradeTree;
			
			tilesets.UI.draw(14, obj.x, obj.y, 475, 475);
			tilesets.UI.draw(15, obj.x + 475, obj.y, 475, 475);
			tilesets.UI.draw(32, obj.x, obj.y + 475, 475, 475);
			tilesets.UI.draw(33, obj.x + 475, obj.y + 475, 475, 475);
			
			ctx.font = "30pt Consolas";
			ctx.textBaseline = "top";
			
			var i = 0;
			for(var spell in spells){
				if(spells[spell].unlocked){
					if((cic.mouseX > obj.x + 114 && cic.mouseX < obj.x + 114 + 312 && cic.mouseY > obj.y + 74 + i * 40 && cic.mouseY < obj.y + 74 + 42 + i * 40) || spell == obj.selectedSpell){
						ctx.fillStyle = "#c5b988";
						ctx.fillRect(obj.x + 120 - 6, obj.y + 74 + i * 40, 312, 42);
						if(cic.getMouseButtonDown(1)){
							obj.selectedSpell = spell;
						}
					}
					ctx.fillStyle = "black";
					ctx.fillText(spell, obj.x + 120, obj.y + 80 + i * 40);
					i++;
				}
			}
			
			if(obj.selectedSpell){
				ctx.lineWidth = 9;
				for(var i = 0; i < 3; i++){
					for(var tier = 0; tier < 3; tier++){
						if(spells[obj.selectedSpell].path[i][tier]){
							ctx.beginPath();
							if(tier == 0){
								ctx.moveTo(obj.x + 682, obj.y + 432);
							}else{
								ctx.moveTo(576 + i * 125 + 25, 430 - (tier - 1) * 100 + 25);
							}
							ctx.lineTo(576 + i * 125 + 25, 430 - tier * 100 + 25);
							if(spells[obj.selectedSpell].path[i][tier].unlocked){
								ctx.strokeStyle = "#51a7e1";
							}else{
								ctx.strokeStyle = "#333333";
							}
							ctx.stroke();
							ctx.closePath();
						}
					}
				}
				
				tilesets.UI.draw(31, 670, 170, 64, 64);
				ctx.fillStyle = "#51a7e1";
				ctx.fillText(player.skillBeans, 730, 182);
				
				hoverClickey(obj.x + 650, obj.y + 400, 64, obj.selectedSpell, Spell[obj.selectedSpell + "Info"].description)
				
				if(player.selectedSpell > -1){
					if(cic.mouseX > 545 && cic.mouseX < 545 + 128 && cic.mouseY > obj.y + 394 && cic.mouseY < obj.y + 394 + 60){
						ctx.fillStyle = "#c5b988";
						ctx.fillRect(545, obj.y + 394, 128, 60);
						if(cic.getMouseButtonDown(1)) player.spells[player.selectedSpell] = obj.selectedSpell;
					}
					ctx.fillStyle = "black";
					ctx.font = "20pt Consolas";
					ctx.fillText("Equip to", 550, obj.y + 400);
					ctx.fillText("Slot " + (player.selectedSpell + 1), 565, obj.y + 425);
				}else{
					ctx.fillStyle = "black";
					ctx.font = "20pt Consolas";
					ctx.fillText("Select a", 550, obj.y + 400);
					ctx.fillText("Slot (1-4)", 534, obj.y + 425);
				}
				ctx.font = "30pt Consolas";
				tilesets.UI.draw(Spell[obj.selectedSpell + "Info"].icon, obj.x + 658, obj.y + 410, 50, 50);
				for(var i = 0; i < 3; i++){
					for(var tier = 0; tier < 3; tier++){
						var path = spells[obj.selectedSpell].path[i];
						if(path[tier]){
							if(hoverClickey(576 + i * 125, 430 - tier * 100, 50, path[tier].name, path[tier].description)){
								if(!path[tier-1] || (path[tier-1] && path[tier-1].unlocked)){
									if(player.skillBeans >= path[tier].cost && path[tier].unlocked == false){
										path[tier].unlocked = true;
										player.skillBeans -= path[tier].cost;
									}
								}
							}
							if(path[tier].unlocked){
								tilesets.UI.draw(31, 578 + i * 125, 432 - tier * 100, 50, 50);
							}else{
								tilesets.UI.draw(30, 581 + i * 125, 435 - tier * 100, 40, 40);
							}
						}
					}
				}
			}
		}
		
		function hoverClickey(x, y, size, title, message){ //Yes I was going slightly insane while naming this
			if(Math.hypot(x + size / 2 - cic.mouseX, y + size / 2 - cic.mouseY) < size / 2 + 3){
				tilesets.UI.draw(27, x, y, size, size);
				description(title, message);
				if(cic.getMouseButtonDown(1)){
					return true;
				}
			}else{
				tilesets.UI.draw(26, x, y, size, size);
			}
		}
		
		function description(title, message){
			var x = 20;
			var y = 760;
			
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			ctx.fillRect(x, y, 950, 200);
			tilesets.UI.draw(0, x - 6, y - 6, 97, 97);
			for(var i = 1; i < 9; i++){
				tilesets.UI.draw(1, x - 6 + 97 * i, y - 6, 97, 97);
				tilesets.UI.draw(37, x - 6 + 97 * i, y + 139, 97, 97);
			}
			tilesets.UI.draw(2, x - 6 + 873, y - 6, 97, 97);
			tilesets.UI.draw(18, x - 6, y - 6 + 97, 97, 97);
			tilesets.UI.draw(20, x - 6 + 873, y - 6 + 97, 97, 97);
			tilesets.UI.draw(36, x - 6, y + 139, 97, 97);
			tilesets.UI.draw(38, x - 6 + 873, y + 139, 97, 97);

			message = [message];
			while(message[message.length - 1].length > 40){
				message.push(message[message.length - 1].substring(40));
				message[message.length - 2] = message[message.length - 2].substring(0, 40);
			}
			ctx.fillStyle = "black";
			ctx.font = "bold 30pt Consolas";
			ctx.fillText(title, x + 40, y + 40);
			ctx.font = "30pt Consolas";
			var i = 0;
			for(var line of message){
				ctx.fillText(line, x + 40, y + 80 + 40 * i);
				i++;
			}
		}
	}

	static panCamera(targetX, targetY, speed){
		Camera.target = undefined;
		settings.inMenu = "pan";
		var dist = Math.hypot(Camera.x - targetX, Camera.y - targetY);
		this.velX = (Camera.x - targetX) * speed / dist;
		this.velY = (Camera.y - targetY) * speed / dist;
		
		return (obj) => {
			if(Math.abs(Camera.x - targetX) < 5 && Math.abs(Camera.y - targetY) < 5){
				return true;
			}else{
				Camera.x -= this.velX;
				Camera.y -= this.velY;
				return false;
			}
		}
	}
	
	static wait(frames){
		this.frames = 0;
		
		return (obj) => {
			this.frames++;
			return this.frames >= frames;
		}
	}

	static brightFlash(frames, onFlash, standalone = false){
		playOnce(sounds.staffEffect);
		return (obj) => {
			if(obj.frame === undefined) obj.frame = 0;
			ctx.fillStyle = "rgba(196, 231, 255, " + (-4 * (Math.pow(obj.frame/frames, 2) - obj.frame/frames)) + ")";
			ctx.fillRect(0, 0, 1000, 1000);
			if(obj.frame == Math.floor(frames / 2) && onFlash) onFlash();
			
			obj.frame++;
			if(standalone && obj.frame >= frames) room.UI.splice(room.UI.indexOf(obj), 1);
			return obj.frame == frames;
		}
	}
	
	static moveNPC(NPC, image, targetX, targetY){
		return (obj) => {
			NPC.image = image;
			if(NPC.x < targetX){
				NPC.x += 3;
			}
			if(NPC.x > targetX){
				NPC.x -= 3;
			}
			if(NPC.y < targetY){
				NPC.y += 3;
			}
			if(NPC.y > targetY){
				NPC.y -= 3;
			}
			
			return (Math.abs(NPC.x - targetX) < 3 && Math.abs(NPC.y - targetY) < 3)
		}
	}
	
	static runImmediate(funct){
		return () => {
			funct();
			return true;
		}
	}
	
	static pointyArrow(x, y, rot, complete){
		return (obj) => {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(rot);
			tilesets.UI.draw(19, -32, -32 - Math.abs(20 * Math.sin(room.frame / 20)), settings.cellSize, settings.cellSize);
			ctx.restore();
			return complete();
		}
	}

	static cutscene(args){
		this.x = 20;
		this.y = 740;
		return (obj) => {
			if(obj.frame === undefined){
				settings.inMenu = "cutscene";
				obj.index = 0;
				obj.frame = 0;
				obj.funct = eval(args[0]);
				if(args[args.length - 1] === true){
					args.splice(args.length - 1, 1);
				}else{
					args.push(`UI.panCamera(${Camera.x}, ${Camera.y}, 7)`);
				}
			}
			
			if(obj.funct(obj)){
				obj.index++;
				obj.frame = 0;
				if(!settings.inMenu) settings.inMenu = "cutscene";
				obj.funct = eval(args[obj.index]);
			}
			
			if(!args[obj.index]){
				settings.inMenu = false;
				room.UI.splice(room.UI.indexOf(obj), 1);
				Camera.target = player;
			}
		}
	}

	static damageIndicator(dmg, color = "189, 81, 90"){
		return (obj) => {
			if(!obj.frame){
				obj.frame = 0;
				obj.velX = Math.random() * 5 + 5;
				if(Math.random() < 0.5){
					obj.velX *= -1;
				}
				obj.velY = Math.random() * 5 + 5;
			}

			ctx.fillStyle = "rgba(" + color + ", " + (1 - obj.frame / 30) + ")";
			ctx.font = "bold 30pt Consolas";
			ctx.fillText(dmg, obj.x - Camera.x + Math.log(obj.frame) * obj.velX, obj.y - Camera.y + Math.log(obj.frame) *  - obj.velY);
			obj.frame++;
			if(obj.frame > 30){
				room.UI.splice(room.UI.indexOf(obj), 1);
			}
		}
	}
	
	static titleScreen(){
		return (obj) => {
			settings.inMenu = "title";
			tilesets.UI.draw(14, obj.x, obj.y, 475, 475);
			tilesets.UI.draw(15, obj.x + 475, obj.y, 475, 475);
			tilesets.UI.draw(32, obj.x, obj.y + 475, 475, 475);
			tilesets.UI.draw(33, obj.x + 475, obj.y + 475, 475, 475);
			
			ctx.font = "100pt Algerian";
			ctx.textBaseline = "top";
			ctx.fillStyle = "#51a7e1";
			ctx.fillText("DODO", 140, 200);
			ctx.font = "90pt Algerian";
			ctx.fillText("QUEST", 120, 300);
			ctx.fillStyle = "black";
			ctx.font = "30pt Consolas";
			ctx.fillText("- THE STAFF OF -", 125, 410);
			ctx.font = "70pt Consolas";
			ctx.fillText("ARCANIA", 120, 450);
			
			ctx.font = "30pt Consolas";
			ctx.fillText("WASD to move", 550, 220);
			ctx.fillText("E to interact", 550, 255);
			ctx.fillText("Mouse in menus", 550, 290);
			
			ctx.lineWidth = 5;
			ctx.strokeRect(620, 350, 200, 100);
			if(cic.mouseX > 620 && cic.mouseX < 820 && cic.mouseY > 350 && cic.mouseY < 450){
				ctx.fillStyle = "#c5b988";
				ctx.fillRect(620, 350, 200, 100);
				if(cic.getMouseButtonDown(1)){
					room.UI.splice(room.UI.indexOf(obj), 1);
					settings.inMenu = false;
				}
			}
			ctx.fillStyle = "black";
			ctx.font = "40pt Consolas";
			ctx.fillText("BEGIN", 645, 375);
		}
	}

	static MyrakiHealthBar(){
		return (obj) => {
			if(!room.objects[1]){
				room.UI.splice(room.UI.indexOf(obj), 1);
				return;
			}
			var health = room.objects[1].health;
			ctx.fillStyle = "#bd515a";
			ctx.fillRect(50, 900, 900 * (health / room.objects[1].maxHealth), 50);
			ctx.fillStyle = "grey";
			for(var i = 1; i < 3; i++){
				ctx.fillRect(50 + i * 900 / 3, 900, 20, 50);
			}
		}
	}
	
	static ending(){
		return () => {
			ctx.fillStyle = "rgba(81, 167, 225, " + room.frame / 100 + ")";
			ctx.fillRect(0, 0, 1000, 1000);
			
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			offsetText(120, "With that, Myraki was defeated.", 30, 50);
			offsetText(280, "You collected the Delphinodes and returned", 30, 150);
			offsetText(290, "them to the kingdom's treasury, to be", 30, 200);
			offsetText(300, "protected against those who would use them.", 30, 250);
			offsetText(450, "Peace was restored to the kingdom.", 30, 350);
			
			ctx.textAlign = "center";
			offsetText(600, "THE END", 500, 500, "150pt Algerian");
		}
		
		function offsetText(offset, text, x, y, font = "30pt Consolas", fadeTime){
			if(room.frame >= offset){
				ctx.fillStyle = "rgba(0, 0, 0, " + (room.frame - offset) / 100 + ")";
				if(room.frame - offset < 100){
					y -= (room.frame - offset - 100);
				}
				ctx.font = font;
				ctx.fillText(text, x, y); 
			}
		}
	}
}

function getSpellProperty(spell, defaultValue, property){
		let tree = Spell.upgradeTree[spell].path;
		let total = defaultValue;
		for(var path of tree){
			for(var tier of path){
				if(!tier.unlocked) break;
				for(var effect in tier.effects){
					if(effect == property) total += tier.effects[effect];
				}
			}
		}
		return total;
	}