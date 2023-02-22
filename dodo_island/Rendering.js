var tileIDs = [
    {"images" : ["Water Tile 0.png", "Water Tile 1.png"], "framesBetween" : 40}, //0
    "Sand Tile.png", //1
    "Grass Tile.png", //2
    {"images" : ["Lava Tile 0.png", "Lava Tile 1.png"], "framesBetween" : 40}, //3
    "Stone Tile.png", //4
    "lime", //5
    {"images" : ["Dodo1.png", "Dodo2.png"], "framesBetween" : 20}, //6
    {"images" : ["Broken Raft1.png", "Broken Raft2.png"], "framesBetween" : 40}, //7
    "white", //8
    "rgb(200, 200, 200, 0.7)", //9
    "Grass Sprite.png", //10
    "Cut Grass Sprite.png", //11
    "WoodLeft1.png", //12
    "WoodLeft2.png", //13
    "WoodLeft3.png", //14
    "WoodRight1.png", //15
    "WoodRight2.png", //16
    "WoodRight3.png", //17
    "Wood Sprite.png", //18
    "Tree1.png", //19
    "Tree2.png", //20
    "Text Arrow.png", //21
    {"images" : ["Raft.png"], "framesBetween" : 40, "bob" : 3}, //22
	"PlayerIdle0.png", //23
	{"images" : ["PlayerMove0.0.png", "PlayerMove0.1.png"], "framesBetween" : 20}, //24
	"PlayerIdle1.png", //25
	{"images" : ["PlayerMove1.0.png", "PlayerMove1.1.png"], "framesBetween" : 20}, //26
	"PlayerIdle2.png", //27
	{"images" : ["PlayerMove2.0.png", "PlayerMove2.1.png"], "framesBetween" : 20}, //28
	"PlayerIdle3.png", //29
	{"images" : ["PlayerMove3.0.png", "PlayerMove3.1.png"], "framesBetween" : 20}, //30
    {"images" : ["EKeyUp.png", "EKeyDown.png"], "framesBetween" : 30}, //31
    {"images" : ["SlashKeyUp.png", "SlashKeyDown.png"], "framesBetween" : 30}, //32
    "IronSprite.png", //33
    {"images" : ["SmallBoat0.png", "SmallBoat1.png"], "framesBetween" : 40}, //34
    {"images" : ["Lava Tile 0.png", "Lava Tile 1.png"], "framesBetween" : 40}, //35
    "Stone Tile.png", //36
    "Sheep.png", // 37
	{"images" : ["Smoke0.png", "Smoke1.png", "Smoke2.png"], "framesBetween" : 10}, //38
	"Wool.png", //39
    {"images" : ["Scissor0.png", "Scissor1.png"], "framesBetween" : 30}, //40
	{"images" : ["Shark0.png", "Shark1.png"], "framesBetween" : 20}, //41
	"DodoSink.png", // 42
	"2PlayerIdle0.png", //43
	{"images" : ["2PlayerMove0.0.png", "2PlayerMove0.1.png"], "framesBetween" : 20}, //44
	"2PlayerIdle1.png", //45
	{"images" : ["2PlayerMove1.0.png", "2PlayerMove1.1.png"], "framesBetween" : 20}, //46
	"2PlayerIdle2.png", //47
	{"images" : ["2PlayerMove2.0.png", "2PlayerMove2.1.png"], "framesBetween" : 20}, //48
	"2PlayerIdle3.png", //49
	{"images" : ["2PlayerMove3.0.png", "2PlayerMove3.1.png"], "framesBetween" : 20}, //50
	{"images" : ["Ship0.png", "Ship1.png"], "framesBetween" : 40}, //51
    "Win.png", //52
    "Lose.png", //53
    "Cannonball.png", // 54
    {"images" : ["PirateShip0.png", "PirateShip1.png"], "framesBetween" : 40}, //55
]

var images = {}

for(const item of tileIDs){
    if(typeof item == "string"){
        if(item.includes(".png")){
            images[item] = new Image();
        }
    }else{
        for(const image of item.images){
            images[image] = new Image();
        }
    }
}

for(const key of Object.keys(images)){
    images[key].src = "./Resources/" + key;
}

function outlineText(txt, x, y){
    ctx.lineWidth = 4;
    ctx.strokeText(txt, x, y);
    ctx.lineWidth = 1;
    ctx.fillText(txt, x, y);
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    objects.forEach((obj) => {obj.gameTick()});

	//Rat Timer
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 255, 0.65)";
    ctx.fillRect(0, 524, 728, 100);
    ctx.arc(0, 624, 150, 0, Math.PI * 2);
    ctx.fillStyle = "#aaaaaa";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    
    if(game.maxTime != Infinity){
        ctx.beginPath();
        ctx.moveTo(0, 624);
        ctx.arc(0, 624, 150, (360 - 90 * game.timeLeft / game.maxTime) * Math.PI / 180, 0);
        if(game.timeLeft / game.maxTime > 0.25){
            ctx.fillStyle = "rgb(0, 255, 0, 0.5)";
        }else if(game.timeLeft / game.maxTime > 0.1){
            ctx.fillStyle = "rgb(255, 255, 0, 0.5)";
        }else{
            ctx.fillStyle = "rgb(255, 0, 0, 0.5)";
        }
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        
        ctx.fillStyle = "white";
        ctx.font = "30pt Consolas";
        ctx.textAlign = "center";
        var minutes = 0;
        var seconds = game.timeLeft;
        while(seconds > 60){
            minutes++;
            seconds -= 60;
        }
        if(seconds < 10){
            seconds = "0" + seconds;
        }
        ctx.fillText(minutes + ":" + seconds, 60, 584);
        
        if(game.frame % 60 == 0 && game.timeLeft > 0){
            game.timeLeft--;
        }
    }

    //Resource Bar
    ctx.fillStyle = "gray";
    ctx.fillRect(200, 534, 290, 80);
    var x = 210;
    for(var i = 0; i<4; i++){
        ctx.fillStyle = "lightgray";
        ctx.fillRect(x, 544, 60, 60);
        x += 70;
    }

    drawImage(18, 220, 554, 40, 40);
    drawImage(10, 290, 554, 40, 40);
    drawImage(39, 360, 554, 40, 40);
    drawImage(33, 430, 554, 40, 40);
    ctx.fillStyle = "white";
    ctx.font = "20pt Consolas";
    outlineText(resources.wood, 255, 599);
    outlineText(resources.grass, 325, 599);
    outlineText(resources.wool, 395, 599);
    outlineText(resources.iron, 465, 599);
}

function drawImage(imageNum, x, y, width, height){
	try{
	if(typeof tileIDs[imageNum] == "object"){
		if(tileIDs[imageNum].bob && Math.floor(game.frame / tileIDs[imageNum].framesBetween) % 2 == 0){
			y += tileIDs[imageNum].bob;
		}
		ctx.drawImage(images[tileIDs[imageNum].images[Math.floor(game.frame / tileIDs[imageNum].framesBetween) % (tileIDs[imageNum].images.length)]], x, y, width, height);
	}else if(tileIDs[imageNum].includes(".png")){
		ctx.drawImage(images[tileIDs[imageNum]], x, y, width, height);
	}else{
		ctx.fillStyle = tileIDs[imageNum];
		ctx.fillRect(x, y, width, height);
	}
	}catch(e){}
}

function drawDodoSpecial(imageNum, x, y, width, height, DodoState){
	try{
        switch (DodoState) {
            case "sink":
                ctx.drawImage(images[tileIDs[imageNum]],0, 0, 160, 80, x, y, width, height-13);
                break;
        }
		


	}catch(e){}
}