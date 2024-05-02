const c = document.getElementById("game");
const cbounds = c.getBoundingClientRect();
const ctx = c.getContext("2d");

c.oncontextmenu = function() {return false;}

window.onload = () => {
    newBoard([]);
    draw();
}

var mouseX;
var mouseY;
var mouseDown = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = Math.round(e.offsetX * (c.width / (cbounds.right - cbounds.left)));
    mouseY = Math.round(e.offsetY * (c.height / (cbounds.bottom - cbounds.top)));
});

document.addEventListener("mousedown", (e) => {
    mouseX = Math.round(e.offsetX * (c.width / (cbounds.right - cbounds.left)));
    mouseY = Math.round(e.offsetY * (c.height / (cbounds.bottom - cbounds.top)));
    mouseDown = e.which;
});

const game = {
    "sizeX" : 10,
    "sizeY" : 10,
    "numBombs" : 10,
	"firstClick" : true,
    "bombs" : [],
    "board" : []
}

const UI_HEIGHT = 150;
const CELL_WIDTH = c.width / game.sizeX;
const CELL_HEIGHT = (c.height - UI_HEIGHT) / game.sizeY;

function newBoard(safeSpaces){
    game.bombs = [];
	for(var y = 0; y < game.sizeY; y++){
		game.bombs.push([]);
		for(var x = 0; x < game.sizeX; x++){
			game.bombs[y].push(false);
		}
	}
	
    for(var i = 0; i < game.numBombs; i++){
        var randX = Math.floor(Math.random() * game.sizeX);
        var randY = Math.floor(Math.random() * game.sizeY);
        
		var isSafeSpace = false;
		for(const space of safeSpaces){
			if(space[0] == randX && space[1] == randY){
				isSafeSpace = true;
				break;
			}
		}
		if(game.bombs[randY][randX] || isSafeSpace){
			i--;
		}else{
			game.bombs[randY][randX] = true;
		}
    }
    game.board = [];
	for(var y = 0; y < game.sizeY; y++){
		game.board.push([]);
		for(var x = 0; x < game.sizeX; x++){
			game.board[y].push(-1);
		}
	}
}

function draw(){
    ctx.clearRect(0, 0, 1000, 1000);

    //Top UI
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, 1000, UI_HEIGHT);
	
	ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(0, UI_HEIGHT);
    ctx.lineTo(1000, UI_HEIGHT);
    ctx.lineWidth = 10;
    ctx.stroke();
	ctx.closePath();

    for(var y = 0; y < game.sizeY; y++){
        for(var x = 0; x < game.sizeX; x++){
			var topLeftX = x * CELL_WIDTH;
			var topLeftY = y * CELL_HEIGHT + UI_HEIGHT;
		
            if(game.board[y][x] < 0){
                if((x + y) % 2 == 0){
                    ctx.fillStyle = "#aad751";
                }else{
                    ctx.fillStyle = "#a2d149";
                }
			}else{
                if((x + y) % 2 == 0){
                    ctx.fillStyle = "#e5c29f";
                }else{
                    ctx.fillStyle = "#d7b899";
                }
            }
            ctx.fillRect(topLeftX, topLeftY, CELL_WIDTH, CELL_HEIGHT);
			
			if(game.board[y][x] == -2){
				ctx.beginPath();
				ctx.strokeStyle = "red";
				ctx.moveTo(topLeftX + CELL_WIDTH / 3, topLeftY + CELL_HEIGHT * 5 / 6);
				ctx.lineTo(topLeftX + CELL_WIDTH / 3, topLeftY + CELL_HEIGHT / 6);
				ctx.lineTo(topLeftX + CELL_WIDTH * 2 / 3, topLeftY + CELL_HEIGHT  * 2 / 6);
				ctx.lineTo(topLeftX + CELL_WIDTH / 3, topLeftY + CELL_HEIGHT * 3 / 6);
				ctx.stroke();
				ctx.closePath();
			}
			
            if(game.board[y][x] > 0){
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "100px Consolas";
                ctx.fillStyle = "black";
                ctx.fillText(game.board[y][x], (x + 0.5) * CELL_WIDTH, (y + 0.5) * CELL_HEIGHT + 10 + UI_HEIGHT);
            }

            if(mouseX > topLeftX && mouseX < (x + 1) * CELL_WIDTH &&
                mouseY > topLeftY && mouseY < (y + 1) * CELL_HEIGHT + UI_HEIGHT
            ){
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fillRect(topLeftX, topLeftY, CELL_WIDTH, CELL_HEIGHT);
                if(mouseDown == 1){
					if(game.board[y][x] != -2){
						if(game.firstClick){
							var safeSpaces = [];
							for(var offY = clamp(y - 1, 0, game.sizeY - 1); offY <= clamp(y + 1, 0, game.sizeY - 1); offY++){
								for(var offX = clamp(x - 1, 0, game.sizeX - 1); offX <= clamp(x + 1, 0, game.sizeX - 1); offX++){
									safeSpaces.push([offX, offY]);
								}
							}
							newBoard(safeSpaces);
							game.firstClick = false;
						}
						
						if(game.bombs[y][x]){
							
						}else{
							clearSurroundings(x, y);
						}
					}
                }else if(mouseDown == 3){
					if(game.board[y][x] == -2){
						game.board[y][x] = -1;
					}else if(game.board[y][x] == -1){
						game.board[y][x] = -2;
					}
                }
            }
        }
    }
	
	function clearSurroundings(startX, startY){
		game.board[startY][startX] = checkSurroundings(startX, startY);
		if(game.board[startY][startX] == 0){
			for(var y = clamp(startY - 1, 0, game.sizeY - 1); y <= clamp(startY + 1, 0, game.sizeY - 1); y++){
				for(var x = clamp(startX - 1, 0, game.sizeX - 1); x <= clamp(startX + 1, 0, game.sizeX - 1); x++){
					if(game.board[y][x] == -1){
						game.board[y][x] = checkSurroundings(x, y);
						if(game.board[y][x] === 0){
							clearSurroundings(x, y);
						}
					}
				}
			}
		}
	}

    function checkSurroundings(startX, startY){
        var numSurrounding = 0;
        for(var y = clamp(startY - 1, 0, game.sizeY - 1); y <= clamp(startY + 1, 0, game.sizeY - 1); y++){
            for(var x = clamp(startX - 1, 0, game.sizeX - 1); x <= clamp(startX + 1, 0, game.sizeX - 1); x++){
                if(game.bombs[y][x]){
                    numSurrounding++;
                }
            }
        }
        return numSurrounding;
    }

    function clamp(num, min, max){
        return num > max ? max : num < min ? min : num;
    }

    mouseDown = 0;
    window.requestAnimationFrame(draw);
}