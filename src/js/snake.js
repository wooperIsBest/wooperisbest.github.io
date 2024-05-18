var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var start = 0;
window.requestAnimationFrame(drawCanvas);
var timerStart = Date.now();
var appleX = 0;
var appleY = 0;
charX = Math.round(Math.random() * 21) * 25;
charY = Math.round(Math.random() * 21) * 25;
var prevX = [];
var prevY = [];
var direction = "";
var length = 1;
var score = 0;
newApple();

function drawCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var x = 0;
	var y = 0;
	var repetition = 1;

	for(var j = 0; j < 23; j++){
		for(var i = 0; i < 23; i++){
			ctx.beginPath();
			ctx.moveTo(x, y);
			y += 25;
			ctx.lineTo(x, y);
			x += 25;
			ctx.lineTo(x, y);
			y -= 25;
			ctx.lineTo(x, y);
			x -= 25;
			ctx.lineTo(x, y);
			ctx.stroke();
			y += 25;
			if(repetition == 1){
				ctx.fillStyle = "#4ca832";
				ctx.fill();
			}else{
				ctx.fillStyle = "#17e666";
				ctx.fill();
			}
			repetition *= -1;
			ctx.closePath();
		}
		x += 25;
		y = 0;
	}
	
	ctx.beginPath();
	ctx.moveTo(appleX, appleY);
	appleY += 25;
	ctx.lineTo(appleX, appleY);
	appleX += 25;
	ctx.lineTo(appleX, appleY);
	appleY -= 25;
	ctx.lineTo(appleX, appleY);
	appleX -= 25;
	ctx.lineTo(appleX, appleY);
	ctx.stroke();
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();

	document.getElementById("board").innerHTML = "<br/><b>Score: " + score + "<br/>Time: " + Math.floor((Date.now()-timerStart) / 1000) + "</b><br/><br/>" + 
	"<b>Directions:</b><br/>WASD or Arrow Keys to move, Enter to pause. Collect the apples and avoid hitting the wall or yourself.";

	drawSnake();

	setTimeout(function(){
		if(start == 1){
			window.requestAnimationFrame(drawCanvas);
		}
	}, 100);
}

function newApple(){
	appleX = Math.round(Math.random() * 21) * 25;
	appleY = Math.round(Math.random() * 21) * 25;
}

function drawSnake(){	
	prevX.push(charX);
	prevY.push(charY);

	if(direction == "left"){
		charX -= 25;
	}else if(direction == "right"){
		charX += 25;
	}else if(direction == "up"){
		charY -= 25;
	}else if(direction == "down"){
		charY += 25;
	}

	ctx.beginPath();
	ctx.moveTo(charX, charY);
	charY += 25;
	ctx.lineTo(charX, charY);
	charX += 25;
	ctx.lineTo(charX, charY);
	charY -= 25;
	ctx.lineTo(charX, charY);
	charX -= 25;
	ctx.lineTo(charX, charY);
	ctx.stroke();
	ctx.fillStyle = "#e0e0e0";
	ctx.fill();
	ctx.closePath();

	if(appleX == charX && appleY == charY){
		length++;
		score += 10;
		newApple();
	}

	for(var i = 1; i < length; i++){
		//alert((prevX.length - i) + ": " + prevX[prevX.length - i] + "," +  (prevY.length - i) + ": " + prevY[prevY.length - i]);
		if(charX == prevX[prevX.length - i] && charY == prevY[prevY.length - i]){
			lose("<b>You ran into yourself!</b><br/>");
		}
		ctx.beginPath();
		ctx.moveTo(prevX[prevX.length - i], prevY[prevY.length - i]);
		prevY[prevY.length - i] += 25;
		ctx.lineTo(prevX[prevX.length - i], prevY[prevY.length - i]);
		prevX[prevX.length - i] += 25;
		ctx.lineTo(prevX[prevX.length - i], prevY[prevY.length - i]);
		prevY[prevY.length - i] -= 25;
		ctx.lineTo(prevX[prevX.length - i], prevY[prevY.length - i]);
		prevX[prevX.length - i] -= 25;
		ctx.lineTo(prevX[prevX.length - i], prevY[prevY.length - i]);
		ctx.stroke();
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
	if(charX > 550 || charX < 0 || charY > 550 || charY < 0){
		lose("<b>You hit the edge!</b><br/>");
	}
}

function lose(condition){
	start = 2;
	document.getElementById("board").innerHTML = "<br/>" + condition + "<b><br/>Score: " + score + "<br/>Time: " + Math.floor((Date.now()-timerStart) / 1000) + 
	"</b><br/><br/>" + "<b>Directions:</b><br/>WASD or Arrow Keys to move, Enter to pause. Collect the apples and avoid hitting the wall or yourself." + 
	'<br/><br/><input id=restart type=button value="Restart" onClick="restart();"></input>';
}

function restart(){
	start = 0;
	window.requestAnimationFrame(drawCanvas);
	timerStart = Date.now();
	appleX = 0;
	appleY = 0;
	charX = Math.round(Math.random() * 21) * 25;
	charY = Math.round(Math.random() * 21) * 25;
	prevX = [];
	prevY = [];
	direction = "";
	length = 1;
	score = 0;
	newApple();
}

document.addEventListener("keydown", function(event) {
	if(event.key == "w" || event.key == "ArrowUp" && direction != "down"){
		direction = "up";
	}else if((event.key == "a" || event.key == "ArrowLeft") && direction != "right"){
		direction = "left";
	}else if(event.key == "s" || event.key == "ArrowDown" && direction != "up"){
		direction = "down";
	}else if(event.key == "d" || event.key == "ArrowRight" && direction != "left"){
		direction = "right";
	}else if(event.key == "Enter"){
		alert("Paused...");
	}

	if(start == 0){
		start = 1;
		window.requestAnimationFrame(drawCanvas);
	}
});