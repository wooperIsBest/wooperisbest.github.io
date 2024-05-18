const c = document.getElementById("game");
const ctx = c.getContext("2d");
var res = 100;
window.onload = draw;

function draw(){
	gradient(0, 0, 300, 300, 255, 0, 0, 0, 0, 255, res);
	gradient(300, 0, 300, 300, 0, 0, 255, 255, 0, 0, res);
	gradient(600, 0, 300, 300, 255, 0, 0, 0, 0, 255, res);
	gradient(0, 400, 1000, 100, 0, 255, 0, 0, 0, 255, res);
	
	//res -= 0.05;
	//window.requestAnimationFrame(draw);
}

function gradient(x, y, sizeX, sizeY, r1, g1, b1, r2, g2, b2, colorAmount = sizeX){
	var color1 = {"r" : r1, "g" : g1, "b" : b1};
	var color2 = {"r" : r2, "g" : g2, "b" : b2};
	var currentColor = {"r" : color1.r, "g" : color1.g, "b" : color1.b};
	
	for(var i = 0; i < colorAmount; i++){
		ctx.fillStyle = "rgb(" + currentColor.r + ", " + currentColor.g + ", " + currentColor.b + ")";
		ctx.fillRect(x + Math.floor(i * sizeX / colorAmount), y, Math.ceil(sizeX / colorAmount), sizeY);
		
		currentColor.r -= ((color1.r - color2.r) / (colorAmount - 1));
		currentColor.g -= ((color1.g - color2.g) / (colorAmount - 1));
		currentColor.b -= ((color1.b - color2.b) / (colorAmount - 1));
	}
}