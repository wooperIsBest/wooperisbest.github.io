var c = document.getElementById("game");
var ctx = c.getContext("2d");

window.addEventListener("load", setupBoard);
window.addEventListener("load", draw);

c.addEventListener("mousemove", updateMouseValues);
c.addEventListener("click", onClick);

var board = [];
var correct = [];

var size = "";
while(!(size > 1 && size <= 20)){
	size = parseInt(prompt("How large should the grid be? (2 - 20)"));
}

var sizeX = size;
var sizeY = size;

var firstClick = [];
var secondClick = [];

var mouseX;
var mouseY;

var clicks = 0;

function setupBoard(){
	var numbers = [];
	
	for(var i = 0; i < Math.floor(sizeX * sizeY / 2); i++){
		numbers.push(i);
		numbers.push(i);
	}
	while(numbers.length < sizeX * sizeY){
		numbers.push("free");
	}
	numbers = numbers
	  .map(value => ({ value, sort: Math.random() }))
	  .sort((a, b) => a.sort - b.sort)
	  .map(({ value }) => value)
	
	
	for(let x = 0; x < sizeX; x++){
		let arr = [];
		let correctArr = []
		for(let y = 0; y < sizeY; y++){
			if(numbers[x * sizeX + y] == "free"){
				correctArr.push(true);
			}else{
				correctArr.push(false);
			}
			arr.push(numbers[x * sizeX + y]);
		}
		board.push(arr);
		correct.push(correctArr);
	}
}

function draw(){
	ctx.clearRect(0, 0, 1000, 1000);
	ctx.fillStyle = "#888888";
	ctx.fillRect(0, 0, 1000, 1000);
	
	for(var y = 0; y < sizeY; y++){
		for(var x = 0; x < sizeX; x++){
			let xPos = 5 + 1000 / sizeX * x;
			let width = 1000 / sizeX - 10;
			let yPos = 5 + 1000 / sizeY * y;
			let height = 1000 / sizeY - 10;
			if(correct[y][x]){
				ctx.fillStyle = "#00FF00";
			}else if(xPos < mouseX && xPos + width > mouseX && yPos < mouseY && yPos + height > mouseY){
				ctx.fillStyle = "#777777";
			}else{
				ctx.fillStyle = "#555555";
			}
			ctx.fillRect(xPos, yPos, width, height);
			ctx.fillStyle = "white";
			
			if((firstClick[0] == x && firstClick[1] == y) || (secondClick[0] == x && secondClick[1] == y) || correct[y][x]){
				ctx.fillStyle = "white";
				ctx.font = (1000 / sizeX) * 0.2 + "pt Consolas";
				ctx.textAlign = "center";
				ctx.fillText(board[y][x], 1000 / sizeX / 2 + 1000 / sizeX * x, 1000 / sizeY / 2 + 100 / sizeY + 1000 / sizeY * y);
			}
		}
	}
	
	var win = true;
	for(const array of correct){
		if(array.includes(false)){
			win = false;
			break;
		}
	}
	if(win){
		ctx.fillStyle = "#00FF00";
		ctx.fillRect(0, 0, 1000, 1000);
		ctx.fillStyle = "#000000";
		ctx.font = "75 pt Consolas";
		ctx.fillText("You win!", 500, 500);
		ctx.font = "40pt Consolas";
		ctx.fillText("Attempts: " + clicks, 500, 575);
	}
	window.requestAnimationFrame(draw);
}

function onClick(e){
	updateMouseValues(e);
	
	ctx.clearRect(0, 0, 1000, 1000);
	ctx.fillStyle = "#888888";
	ctx.fillRect(0, 0, 1000, 1000);
	
	for(var y = 0; y < sizeY; y++){
		for(var x = 0; x < sizeX; x++){
			let xPos = 5 + 1000 / sizeX * x;
			let width = 1000 / sizeX - 10;
			let yPos = 5 + 1000 / sizeY * y;
			let height = 1000 / sizeY - 10;
			
			if(xPos < mouseX && xPos + width > mouseX && yPos < mouseY && yPos + height > mouseY && !correct[y][x]){
				if(firstClick.length == 0 && secondClick.length == 0){
					firstClick = [x, y];
				}else if(firstClick.length > 0 && secondClick.length == 0){
					clicks++;
					if(!(firstClick[0] == x && firstClick[1] == y)){
						secondClick = [x, y];
						if(board[firstClick[1]][firstClick[0]] === board[secondClick[1]][secondClick[0]]){
							correct[firstClick[1]][firstClick[0]] = true;
							correct[secondClick[1]][secondClick[0]] = true;
							firstClick = [];
							secondClick = [];
						}
					}
				}else if(firstClick.length > 0 && secondClick.length > 0){
					firstClick = [];
					secondClick = [];
				}
				break;
			}
		}
	}
}

function updateMouseValues(e){
	let cbounds = c.getBoundingClientRect();
	mouseX = Math.round(e.offsetX * (c.width / (cbounds.right - cbounds.left)));
	mouseY = Math.round(e.offsetY * (c.height / (cbounds.bottom - cbounds.top)));
}
