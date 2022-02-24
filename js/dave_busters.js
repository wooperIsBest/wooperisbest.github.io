const c = document.getElementById("game");
const ctx = c.getContext("2d");
const images = {
	"YellowBullet" : document.getElementById("YellowBullet"),
	"RedBullet" : document.getElementById("RedBullet"),
	"GreenBullet" : document.getElementById("GreenBullet"),
	"BlueBullet" : document.getElementById("BlueBullet"),
	"Spaceship1" : document.getElementById("Spaceship1"),
	"Spaceship2" : document.getElementById("Spaceship2"),
	"Dave" : document.getElementById("Dave"),
	"Asteroid" : document.getElementById("Asteroid"),
	"Dodo Dave" : document.getElementById("Dodo Dave"),
	"Planet" : document.getElementById("Planet"),
	"Continent0" : document.getElementById("Continent_0"),
	"Continent1" : document.getElementById("Continent_1"),
	"Continent2" : document.getElementById("Continent_2"),
	"Continent3" : document.getElementById("Continent_3"),
	"Continent4" : document.getElementById("Continent_4")
}
const sounds = {
	"Pew" : document.getElementById("Pew"),
	"Boom" : document.getElementById("Boom"),
	"Dastardly Dave" : document.getElementById("Dastardly Dave"),
	"Dave Hey that Hurt" : document.getElementById("Dave Hey that Hurt"),
	"Dave Ow" : document.getElementById("Dave Ow"),
	"Dodo Dave Noise" : document.getElementById("Dodo Dave Noise"),
	"Gun Noise" : document.getElementById("Gun Noise"),
	"Multiple Pews" : document.getElementById("Multiple Pews"),
	"Oh look its playing" : document.getElementById("Oh look its playing"),
	"Retry" : document.getElementById("Retry"),
	"Music" : document.getElementById("Music")
}
const bulletData = {
	"YellowBullet" : {
		"image" : images.YellowBullet,
		"moveSpeed" : 20,
		"startingAmount" : Infinity,
		"amount" : Infinity,
		"damage" : 1,
		"reloadTime" : 12,
		"currentReload" : 0
	},
	"RedBullet" : {
		"image" : images.RedBullet,
		"startingAmount" : 50,
		"amount" : 50,
		"moveSpeed" : 15,
		"damage" : 2,
		"reloadTime" : 24,
		"currentReload" : 0
	},
	"BlueBullet" : {
		"image" : images.BlueBullet,
		"startingAmount" : 75,
		"amount" : 75,
		"moveSpeed" : 20,
		"damage" : 0.5,
		"reloadTime" : 6,
		"currentReload" : 0
	},
	"GreenBullet" : {
		"image" : images.GreenBullet,
		"startingAmount" : 10,
		"amount" : 10,
		"moveSpeed" : 5,
		"damage" : 5,
		"reloadTime" : 120,
		"currentReload" : 0
	},
	"currentBulletReloadAnimY" : 850
}
const enemyData = {
	"levels" : {
		"1" : {
			"enemies" : [
				"Dave"
			],
			"spawnRange" : 75
		},
		"2" : {
			"enemies" : [
				"Dave",
				"Dave",
				"Asteroid"
			],
			"spawnRange" : 140
		},
		"3" : {
			"enemies" : [
				"Dave",
				"Dave",
				"Asteroid",
				"Asteroid",
				"Dodo Dave"
			],
			"spawnRange" : 160
		}
	},
	"Dave" : {
		"health" : 1,
		"speed" : 5,
		"sounds" : [
			"Dave Hey that Hurt",
			"Dave Ow"
		]
	},
	"Asteroid" : {
		"health" : 3,
		"speed" : 3,
		"sounds" : [
			"Dave Ow"
		]
	},
	"Dodo Dave" : {
		"health" : 0.5,
		"speed" : 8,
		"sounds" : [
			"Dodo Dave Noise"
		]
	}
}

window.onload = draw;

var player = {
	"x" : 500,
	"y" : 825,
	"velX" : 1,
	"dir" : 1,
	"frame" : 0,
	"currentBullet" : "YellowBullet",
	"health" : 30,
	"levelEndAnim" : false
};
var bullets = [];
var enemies = [];
var stars = [];
var effects = [];
var background = [];

var time = -1;
var level = 1;
var score = 0;

var pause = false;
var frame = 0;
var mode = "StartMenu";
var selected = 0;

var enemyCooldown = 5000;
var timeUntilEnemy = Math.random() * 4000 + 1000;
var canShoot = true;

function draw(){
	ctx.clearRect(0, 0, 1000, 1000);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 1000, 1000);
	
	switch(mode){
		case "StartMenu":
			//Title
			ctx.textAlign = "center";
			ctx.font = "90pt Consolas";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("Dave Busters", 500, 120);
			ctx.font = "30pt Consolas";
			ctx.fillText("Press Space to Select", 500, 170);
			
			//Play Button
			ctx.beginPath();
			if(selected == 0){
				ctx.strokeStyle = "#00FF00";
			}else{
				ctx.strokeStyle = "#FFFFFF";
			}
			ctx.lineWidth = 5;
			ctx.rect(350, 350, 300, 100);
			ctx.font = "50pt Consolas";
			ctx.fillText("Play", 500, 420);
			ctx.stroke();
			ctx.closePath();
			
			//Info Button
			ctx.beginPath();
			if(selected == 1){
				ctx.strokeStyle = "#00FF00";
			}else{
				ctx.strokeStyle = "#FFFFFF";
			}
			ctx.lineWidth = 5;
			ctx.rect(350, 550, 300, 100);
			ctx.font = "50pt Consolas";
			ctx.fillText("Info", 500, 620);
			ctx.stroke();
			ctx.closePath();
			break;
		case "Info":
			ctx.fillStyle = "#FFFFFF";
			ctx.font = "60pt Consolas";
			ctx.fillText("Info", 500, 70);
			
			ctx.font = "30pt Consolas";
			ctx.textAlign = "center";
			ctx.fillText("DAVE BUSTERS is a game about a spaceship who", 500, 150);
			ctx.fillText("is on a mission to destroy all the Daves, a", 500, 200);
			ctx.fillText("peace-loving species of aliens.", 500, 250);
			ctx.font = "40pt Consolas";
			ctx.fillText("CONTROLS", 500, 350);
			ctx.font = "30pt Consolas";
			ctx.fillText("Left and Right / A and D to flip gravity", 500, 400);
			ctx.fillText("Space to shoot", 500, 450);
			ctx.fillText("Q and E to switch bullets", 500, 500);
			ctx.fillText("F11 to enter and exit fullscreen", 500, 550);
			break;
		case "Play":
			//Stars
			switch(level){
				case 1:
					stars.push({"x" : Math.random() * 1000, "y" : 0, "vel" : Math.random() * 9 + 10});
					for(var i = 0; i < stars.length; i++){
						ctx.fillStyle = "white";
						ctx.fillRect(stars[i].x, stars[i].y, 10, 10);
						stars[i].y += stars[i].vel;
						if(stars[i].y > 1000){
							stars.splice(i, 1);
						}
					}
					break;
				case 2:
					ctx.drawImage(images.Planet, 0, 50, 320 + score / 25, 320 + score / 25);
					break;
				case 3:
					ctx.fillStyle = "#304fff";
					ctx.fillRect(0, 0, 1000, 1000);
					if(Math.random() < 0.05){
						background.push({"x" : Math.random() * 1250 - 250, "y" : -500, "num" : Math.round(Math.random() * 4)});
					}
					for(var i = 0;i < background.length; i++){
						ctx.drawImage(images["Continent" + background[i].num], background[i].x, background[i].y, 500, 500);
						background[i].y += 5;
						if(background[i].y > 1500){
							background.splice(i, 1);
						}
					}
					break;
			}
			
			if(level > 3){
				ctx.font = "150pt Consolas";
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.fillText("You Win!", 500, 500); 
			}else{
			
			//Player
			if(frame % 7 == 0){
				if(player.frame == 2){
					player.frame = 1;
				}else{
					player.frame = 2;
				}
			}
			ctx.drawImage(images["Spaceship" + player.frame], player.x - 78, player.y - 25);
			
			if(score >= 10000){
				player.levelEndAnim = true;
				for(var i = 0; i < enemies.length; i++){
					effects.push({"x" : enemies[i].x, "y" : enemies[i].y + 60, "type" : "explode", "size" : 100});
					enemies.splice(i, 1);
				}
			}
			
			if(player.health <= 0 && !player.deathAnim){
				effects.push({"x" : player.x, "y" : player.y + 60, "type" : "explode", "size" : 100});
				player.deathAnim = true;
			}
			
			if(player.levelEndAnim){
				if(Math.abs(500 - player.x) < 10){
					player.x = 500;
				}
				if(player.x < 500){
					player.x += 10;
				}else if(player.x > 500){
					player.x -= 10;
				}
				if(player.x == 500){
					player.y -= 10;
				}
				if(player.y < -250){
					level++;
					score = 0;
					player.x = 500;
					player.y = 825;
					player.levelEndAnim = false;
					player.health = 30;
					enemies = [];
					effects = [];
					stars = [];
					for(const item in bulletData){
						bulletData[item].amount = bulletData[item].startingAmount;
					}
					mode = "Play";
					window.requestAnimationFrame(draw);
					return;
				}
			}else if(player.deathAnim){
				player.y += 6;
				if(player.y > 1100){
					playSound("Retry");
					player.deathAnim = false;
					level = 1;
					score = 0;
					player.x = 500;
					player.y = 825;
					player.health = 30;
					enemies = [];
					for(const item in bulletData){
						bulletData[item].amount = bulletData[item].startingAmount;
					}
					mode = "StartMenu";
				}
			}else{
				player.x += player.velX;
				player.velX += 0.75 * player.dir;
				if(player.x > 950){
					player.velX = 0;
					player.x = 950;
				}
				if(player.x < 50){
					player.velX = 0;
					player.x = 50;
				}
			}
			
			//Bullets
			for(var i = 0; i < bullets.length; i++){
				ctx.drawImage(bulletData[bullets[i].type].image, bullets[i].x - 30, bullets[i].y, 60, 75);
				bullets[i].y -= bulletData[bullets[i].type].moveSpeed;
				if(bullets[i].type == "BlueBullet"){
					bullets[i].x += bullets[i].number * 5;
				}
				if(bullets[i].y < -50){
					bullets.splice(i, 1);
				}
			}
			
			for(const item in bulletData){
				bulletData[item].currentReload--;
			}
			
			//Enemies
			if(enemyCooldown > timeUntilEnemy && score < 10000){
				var enemyType = enemyData.levels[level.toString()].enemies[  Math.round(Math.random() * (enemyData.levels[level.toString()].enemies.length - 1))  ];
				enemies.push({"x" : Math.random() * 900 + 50, "y" : 0, "type" : enemyType, "health" : enemyData[enemyType].health});
				enemyCooldown = 0;
				timeUntilEnemy = Math.random() * enemyData.levels[level.toString()].spawnRange + 25;
			}
			for(var i = 0; i < enemies.length; i++){
				ctx.drawImage(images[enemies[i].type], enemies[i].x - 52.4, enemies[i].y, 104.8, 140);
				enemies[i].y += enemyData[enemies[i].type].speed;
				if(enemies[i].y > 1000){
					player.health--;
					if(enemies[i].type == "Dodo Dave"){
						score -= 1000;
					}
					enemies.splice(i, 1);
				}else if(
					player.x + 78 >= enemies[i].x - 52.4 &&
					player.x - 78 <= enemies[i].x + 52.4 && 
					player.y - 25 <= enemies[i].y + 70 &&
					player.y + 25 >= enemies[i].y - 70
					){
					enemies.splice(i, 1);
					player.health -= 5;
				}else{
					for(var j = 0; j < bullets.length; j++){
						if(enemies[i] && bullets[j]){
							if(
								bullets[j].x + 30 >= enemies[i].x - 52.4 && //Bullet Right greater than enemy left
								bullets[j].x - 30 <= enemies[i].x + 52.4 && //Bullet Left less than enemy right
								bullets[j].y - 37.5 <= enemies[i].y + 70 && //Bullet Top less than enemy bottom
								bullets[j].y + 37.5 >= enemies[i].y - 70 	//Bullet Bottom greater than enemy top
								){
								enemies[i].health -= bulletData[bullets[j].type].damage;
								if(bullets[j].type == "GreenBullet"){
									effects.push({"x" : enemies[i].x, "y" : enemies[i].y + 60, "type" : "greenExplosion", "size" : 52});
									playSound("Boom");
								}
								if(enemies[i].health <= 0){
									effects.push({"x" : enemies[i].x, "y" : enemies[i].y + 60, "type" : "explode", "size" : 100});
									if(bullets[j].type != "GreenBullet"){
										if(enemies[i].type == "Dave" && Math.random() < 0.3){
											playSound(enemyData[enemies[i].type].sounds[1]);
										}else{
											playSound(enemyData[enemies[i].type].sounds[0]);
										}
									}
									enemies.splice(i, 1);
								}else{
									effects.push({"x" : enemies[i].x, "y" : enemies[i].y + 60, "type" : "hit", "color" : bullets[j].type, "size" : 100});
								}
								bullets.splice(j, 1);
								score += 100;
							}
						}
					}
				}
			}
			
			//Effects
			for(var i = 0; i < effects.length; i++){
				switch(effects[i].type){
					case "explode":
						ctx.beginPath();
						ctx.fillStyle = "blue";
						ctx.arc(effects[i].x, effects[i].y, effects[i].size, 0, 2 * Math.PI);
						ctx.fill();
						ctx.beginPath();
						ctx.closePath();
						ctx.fillStyle = "#00b7ff";
						ctx.arc(effects[i].x, effects[i].y, effects[i].size * 0.75, 0, 2 * Math.PI);
						ctx.fill();
						ctx.closePath();
						effects[i].size -= 10;
						if(effects[i].size < 10){
							effects.splice(i, 1);
						}
						ctx.closePath();
						break;
					case "hit":
						ctx.beginPath();
						ctx.fillStyle = effects[i].color.slice(0, effects[i].color.indexOf("Bullet")).toLowerCase();
						ctx.arc(effects[i].x, effects[i].y, effects[i].size, 0, 2 * Math.PI);
						ctx.fill();
						ctx.closePath();
						effects[i].size -= 10;
						if(effects[i].size < 10){
							effects.splice(i, 1);
						}
						break;
					case "greenExplosion":
						ctx.beginPath();
						ctx.fillStyle = "#00bf20";
						ctx.arc(effects[i].x, effects[i].y, effects[i].size, 0, 2 * Math.PI);
						ctx.fill();
						ctx.closePath();
						ctx.beginPath();
						ctx.fillStyle = "#00ed28";
						ctx.arc(effects[i].x, effects[i].y, effects[i].size * 0.75, 0, 2 * Math.PI);
						ctx.fill();
						ctx.closePath();
						ctx.beginPath();
						ctx.fillStyle = "#1fff44";
						ctx.arc(effects[i].x, effects[i].y, effects[i].size * 0.5, 0, 2 * Math.PI);
						ctx.fill();
						ctx.closePath();
						if(effects[i].size % 4 == 0){
							effects[i].size += 4;
						}else{
							effects[i].size -= 52;
						}
						if(effects[i].size > 400){
							effects[i].size -= 1;
						}
						if(effects[i].size < 10){
							effects.splice(i, 1);
						}
						for(var j = 0; j < enemies.length; j++){
							if(enemies[j] && effects[i]){
								let distance = Math.sqrt((Math.abs(effects[i].x - enemies[j].x) * Math.abs(effects[i].x - enemies[j].x)) + (Math.abs(effects[i].y - enemies[j].y) * Math.abs(effects[i].y - enemies[j].y)))
								if(distance <= effects[i].size){
									enemies.splice(j, 1);
								}
							}
						}
						break;
				}
			}
			
			//UI
			ctx.fillStyle = "white";
			ctx.font = "50pt Consolas";
			ctx.textAlign = "right";
			ctx.fillText(score, 950, 125);
			ctx.textAlign = "left";
			if(frame % 60 == 0){
				time++;
			}
			ctx.fillText(time, 50, 125);
			ctx.textAlign = "center";
			ctx.fillText("LVL " + level, 500, 125);
			ctx.drawImage(images[player.currentBullet], 10, bulletData.currentBulletReloadAnimY);
			if(bulletData.currentBulletReloadAnimY > 850){
				bulletData.currentBulletReloadAnimY -= 150 / bulletData[player.currentBullet].reloadTime;
			}
			ctx.textAlign = "left";
			if(bulletData[player.currentBullet].amount != Infinity){
				ctx.fillText(bulletData[player.currentBullet].amount, 150, 950);
			}
			ctx.fillStyle = "red";
			ctx.fillRect(0, 0, 1000, 50);
			ctx.fillStyle = "green";
			ctx.fillRect(0, 0, player.health / 30 * 1000, 50);
			
			score++;
			enemyCooldown++;
			frame++;
			if(pause){
				ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
				ctx.fillRect(0, 0, 1000, 1000);
				ctx.fillStyle = "white";
				ctx.font = "100pt Consolas";
				ctx.textAlign = "center";
				ctx.fillText("PAUSED", 500, 500);
			} else {
				window.requestAnimationFrame(draw);
			}
			break;
		}
	}
}

document.addEventListener("keydown", function(e){
	if(e.key == " " || e.key == "ArrowUp" || e.key == "ArrowDown"){
		e.preventDefault();	
	}
	sounds.Music.play();
	if(mode == "StartMenu"){
		if(e.key == " "){
			if(selected == 0){
				mode = "Play";
				playSound("Oh look its playing");
			}else if(selected == 1){
				mode = "Info";
			}
			draw();
		}
		if(e.key == "ArrowRight" || e.key == "ArrowDown"){
			e.preventDefault();
			selected++;
			if(selected > 1){
				selected = 0;
			}
			draw();
		}
		if(e.key == "ArrowLeft" || e.key == "ArrowUp"){
			e.preventDefault();
			selected--;
			if(selected < 0){
				selected = 1;
			}
			draw();
		}
	}else if(mode == "Info"){
		if(e.key == " "){
			e.preventDefault();
			mode = "StartMenu";
			draw();
		}
	}else if(mode == "Play"){
		if(!pause){
			if(e.key == "ArrowRight" || e.key == "d"){
				player.dir = 1;
				if(player.velX == 0){
					player.velX = -1;
				}
			}
			if(e.key == "ArrowLeft" || e.key == "a"){
				player.dir = -1;
				if(player.velX == 0){
					player.velX = 1;
				}
			}
			if(e.key == " " && canShoot && (bulletData[player.currentBullet].amount >= 1  || bulletData[player.currentBullet].amount == undefined) && bulletData[player.currentBullet].currentReload <= 0){
				if(player.currentBullet == "BlueBullet"){
					for(var i = -1; i <= 1; i++){
						bullets.push({"x" : player.x, "y" : player.y - 100, "type" : "BlueBullet", "number" : i});
					}
				}else{
					bullets.push({"x" : player.x, "y" : player.y - 100, "type" : player.currentBullet});
				}
				if(Math.random() < 0.1){
					playSound("Gun Noise");
				}else{
					playSound("Pew");
				}
				bulletData[player.currentBullet].amount--;
				bulletData[player.currentBullet].currentReload = bulletData[player.currentBullet].reloadTime;
				bulletData.currentBulletReloadAnimY = 1000;
				canShoot = false;
			}
			if(e.key == "q"){
				if(player.currentBullet == "YellowBullet"){
					player.currentBullet = "GreenBullet";
				}else{
					player.currentBullet = Object.keys(bulletData)[Object.keys(bulletData).indexOf(player.currentBullet) - 1];
				}
				bulletData[player.currentBullet].currentReload = bulletData[player.currentBullet].reloadTime;
				bulletData.currentBulletReloadAnimY = 1000;
			}
			if(e.key == "e"){
				if(player.currentBullet == "GreenBullet"){
					player.currentBullet = "YellowBullet";
				}else{
					player.currentBullet = Object.keys(bulletData)[Object.keys(bulletData).indexOf(player.currentBullet) + 1];
				}
				bulletData[player.currentBullet].currentReload = bulletData[player.currentBullet].reloadTime;
				bulletData.currentBulletReloadAnimY = 1000;
			}
		}
		if(e.key == "Enter"){
			if(pause){
				pause = false;
				window.requestAnimationFrame(draw);
			}else{
				pause = true;
			}
		}
	}
});

function playSound(sound){
	sounds[sound].currentTime = 0;
	sounds[sound].play();
}

document.addEventListener("keyup", function(e){
	if(mode == "Play"){
		if(e.key == " "){
			canShoot = true;
		}
	}
	if(e.key == "F11"){
		if (c.requestFullscreen) {
			c.requestFullscreen();
		} else if (c.webkitRequestFullscreen) {
			c.webkitRequestFullscreen();
		} else if (c.msRequestFullscreen) {
			c.msRequestFullscreen();
		}
	}
});
