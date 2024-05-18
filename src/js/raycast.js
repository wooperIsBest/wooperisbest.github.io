const c = document.getElementById("game");
const ctx = c.getContext("2d");
window.onload = draw;

var resDiv = 5;
var offset = 800;

var FOV = 0.5;
var screenRes = 0.92;
var rayAccuracy = 0.8;
var rayFinishing = 0.1;

var level = "RM_TEST";

const levelData = {
	"RM_TEST" : {
		"hitboxes" : [
			{"x" : 0, "y" : 0, "sizeX" : 1000, "sizeY" : 10},
			{"x" : 0, "y" : 0, "sizeX" : 10, "sizeY" : 1000},
			{"x" : 990, "y" : 0, "sizeX" : 10, "sizeY" : 1000},
			{"x" : 0, "y" : 990, "sizeX" : 1000, "sizeY" : 10},
			{"x" : 100, "y" : 100, "sizeX" : 200, "sizeY" : 10},
			{"x" : 800, "y" : 200, "sizeX" : 10, "sizeY" : 200},
			{"x" : 400, "y" : 750, "sizeX" : 300, "sizeY" : 40},
			{"x" : 460, "y" : 650, "sizeX" : 40, "sizeY" : 200},
			{"x" : 50, "y" : 970, "sizeX" : 50, "sizeY" : 30, "changeLevel" : "RM_EMPTY", "nextX" : 900, "nextY" : 50, "nextRot" : 0},
		]
	},
	"RM_EMPTY" : {
		"hitboxes" : [
			{"x" : 0, "y" : 0, "sizeX" : 1000, "sizeY" : 10},
			{"x" : 0, "y" : 0, "sizeX" : 10, "sizeY" : 1000},
			{"x" : 990, "y" : 0, "sizeX" : 10, "sizeY" : 1000},
			{"x" : 0, "y" : 990, "sizeX" : 1000, "sizeY" : 10}
		]
	}
}

const player = {
	"x" : 500,
	"y" : 500,
	"rotation" : 0,
	"zRot" : 0
}

var hitboxes = levelData[level].hitboxes;

function draw(){
	ctx.clearRect(0, 0, 1000, 1000);
	var grd1 = ctx.createLinearGradient(500, 0, 500, 400);
	grd1.addColorStop(0, "#f9f8fb");
	grd1.addColorStop(1, "#828282");
	ctx.fillStyle = grd1;
	ctx.fillRect(0, 0, 1000, 400);
	var grd2 = ctx.createLinearGradient(500, 400, 500, 800);
	grd2.addColorStop(0, "#828282");
	grd2.addColorStop(1, "#f9f8fb");
	ctx.fillStyle = grd2;
	ctx.fillRect(0, 400, 1000, 800);
	
	offset = 1000 - 1000 / resDiv;
	
	//2D Map
	var changeX = 0;
	var changeY = 0;
	if(window.ArrowUpPressed){
		changeX += Math.sin(player.rotation) * 5;
	}
	if(window.ArrowDownPressed){
		changeX -= Math.sin(player.rotation) * 5;
	}
	if(window.aPressed && !window.ArrowUpPressed && !window.ArrowDownPressed){
		changeX -= 5;
	}
	if(window.dPressed && !window.ArrowUpPressed && !window.ArrowDownPressed){
		changeX += 5;
	}
	
	var x = 0;
	var rays = [];
	for(var i = -FOV; i <= FOV; i += 0.005 * screenRes){
		x += 1000 / (2 * FOV / (0.005 * screenRes));
		rays.push(drawRay(player.rotation + i, x));
	}
	
	ctx.fillStyle = "black";
	ctx.fillRect(offset, 0, 1000 / resDiv, 1000 / resDiv);

	for(const item of rays){
		ctx.beginPath();
		ctx.strokeStyle = "#42e3f5";
		ctx.moveTo(item.x1, item.y1);
		ctx.lineTo(item.x2, item.y2);
		ctx.stroke();
		ctx.closePath();
	}
	
	ctx.fillStyle = "white";
	for(const item of hitboxes){
		ctx.fillRect(offset + item.x / resDiv, item.y / resDiv, item.sizeX / resDiv, item.sizeY / resDiv);
		if(item.x <= player.x + changeX + 5 &&
		item.x + item.sizeX >= player.x + changeX - 5 &&
		item.y <= player.y + changeY + 5 &&
		item.y + item.sizeY >= player.y + changeY - 5){
			changeX = 0;
			if(item.changeLevel){
				level = item.changeLevel;
				hitboxes = levelData[level].hitboxes;
				player.x = item.nextX;
				player.y = item.nextY;
				player.rotation = item.nextRot;
			}
		}
	}
	
	var tempChangeX = changeX;
	changeX = 0;
	if(window.ArrowUpPressed){
		changeY += Math.cos(player.rotation) * 5;
	}
	if(window.ArrowDownPressed){
		changeY -= Math.cos(player.rotation) * 5;
	}
	if(window.wPressed && !window.ArrowUpPressed && !window.ArrowDownPressed){
		changeY += 5;//player.zRot += 25;
	}
	if(window.sPressed && !window.ArrowUpPressed && !window.ArrowDownPressed){
		changeY -= 5;//player.zRot -= 25;
	}
	for(const item of hitboxes){
		ctx.fillRect(offset + item.x / resDiv, item.y / resDiv, item.sizeX / resDiv, item.sizeY / resDiv);
		if(item.x <= player.x + changeX + 5 &&
		item.x + item.sizeX >= player.x + changeX - 5 &&
		item.y <= player.y + changeY + 5 &&
		item.y + item.sizeY >= player.y + changeY - 5){
			changeY = 0;
			if(item.changeLevel){
				level = item.changeLevel;
				hitboxes = levelData[level].hitboxes;
				player.x = item.nextX;
				player.y = item.nextY;
				player.rotation = item.nextRot;
			}
		}
	}
	changeX = tempChangeX;
	
	ctx.beginPath();
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 5;
	ctx.arc(offset + player.x / resDiv, player.y / resDiv, 10 / resDiv, 0, Math.PI * 2);
	ctx.moveTo(offset + player.x / resDiv, player.y / resDiv);
	ctx.lineTo(offset + (player.x + Math.sin(player.rotation) * 20) / resDiv, (player.y + Math.cos(player.rotation) * 20) / resDiv);
	ctx.stroke();
	ctx.closePath();
	
	player.x += changeX;
	player.y += changeY;
	
	if(window.ArrowLeftPressed){
		player.rotation -= 0.05;
	}
	if(window.ArrowRightPressed){
		player.rotation += 0.05;
	}
	
	window.requestAnimationFrame(draw);
}

function drawRay(rotation, screenX){
	var x = player.x;
	var y = player.y;
	var rot = rotation;
	
	var colliderFound = false;
	var touchingHitbox;
	while(!colliderFound){
		x += Math.sin(rotation) * rayAccuracy;
		y += Math.cos(rotation) * rayAccuracy;
		for(const item of hitboxes){
			if(
				item.x <= x &&
				item.x + item.sizeX >= x &&
				item.y <= y &&
				item.y + item.sizeY >= y
			){
				touchingHitbox = item;
				colliderFound = true;
				break;
			}
		}
	}
	while(colliderFound){
		x -= Math.sin(rotation) * rayFinishing;
		y -= Math.cos(rotation) * rayFinishing;
		if(!(
			touchingHitbox.x <= x &&
			touchingHitbox.x + touchingHitbox.sizeX >= x &&
			touchingHitbox.y <= y &&
			touchingHitbox.y + touchingHitbox.sizeY >= y
		)){
			colliderFound = false;
			x += Math.sin(rotation) * rayFinishing;
			y += Math.cos(rotation) * rayFinishing;
			break;
		}
		
	}
	
	var color = "#003cff";
	x -= Math.sin(rotation) * rayAccuracy;
	for(const item of hitboxes){
		if(
			item.x <= x &&
			item.x + item.sizeX >= x &&
			item.y <= y &&
			item.y + item.sizeY >= y
		){
			color = "blue";
			break;
		}
	}
	x += Math.sin(rotation) * rayAccuracy;
	
	var a = Math.abs(player.y - y);
	var b = Math.abs(player.x - x);
	var c = Math.hypot(a, b);
	
	var distance = c * Math.cos(player.rotation - rot);
	var height = (1 / distance) * 15000;
	
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(screenX, player.zRot + 500 + height);
	ctx.lineTo(screenX, player.zRot + 500 - height);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle = "rgba(0, 0, 0, " + ((distance / 1000)) + ")";;
	ctx.moveTo(screenX, player.zRot + 500 + height);
	ctx.lineTo(screenX, player.zRot + 500 - height);
	ctx.stroke();
	ctx.closePath();
	
	return {
		"x1" : offset + player.x / resDiv,
		"x2" : offset + x / resDiv,
		"y1" : player.y / resDiv,
		"y2" : y / resDiv
	};
}

document.addEventListener("keydown", function(e){
	window[e.key + "Pressed"] = true;
	if(e.key == "ArrowUp" || e.key == "ArrowDown"){
		e.preventDefault();
	}
});
document.addEventListener("keyup", function(e){
	window[e.key + "Pressed"] = false;
});