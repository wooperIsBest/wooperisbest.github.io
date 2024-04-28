class mouseDetectable {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        render.push(this);
    }
    onclick(){}
}

var render = [];

window.onload = draw;

var c = document.getElementById("game");
var ctx = c.getContext("2d");

var realMouseX = 0;
var realMouseY = 0;

var relativeMouseX = 0;
var relativeMouseY = 0;

var pxWidth = c.width;
var pxHeight = c.height;

var cReg = c.getBoundingClientRect();
var physWidth = Math.round(cReg.right - cReg.left);
var physHeight = Math.round(cReg.bottom - cReg.top);


var button1 = new mouseDetectable(500, 500, 100, 50);
button1.onclick = function(){
    alert("Yay!");
};

function draw(){
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#000000";
    ctx.font = "30pt Arial";
    ctx.fillText("Abs: (" + realMouseX + ", " + realMouseY + ")", 10, 500);
    ctx.fillText("Relative: (" + relativeMouseX + ", " + relativeMouseY + ")", 10, 550);

    ctx.fillText("pxWidth: " + pxWidth + ", pxHeight: " + pxHeight, 10, 30);
    ctx.fillText("physWidth: " + physWidth + ", physHeight: " + physHeight, 10, 70);
    ctx.fillRect(300, 300, 20, 20); // (310, 310)

    ctx.fillRect(relativeMouseX - 100, relativeMouseY - 100, 20, 20);

    for(var i = 0; i < render.length; i++){
        var obj = render[i];
        if(relativeMouseX >= obj.x && relativeMouseX <= obj.x + obj.width && relativeMouseY >= obj.y && relativeMouseY <= obj.y + obj.height){
            ctx.fillStyle = "#555555";
        }else{
            ctx.fillStyle = "#000000";
        }
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Click", 510, 540);

    window.requestAnimationFrame(draw);
}

c.addEventListener("mousemove", function(e){
    updateMouseValues(e);
});

c.addEventListener("mousedown", function(e){
    updateMouseValues(e);

    for(var i = 0; i < render.length; i++){
        var obj = render[i];
        if(relativeMouseX > obj.x && relativeMouseX < obj.x + obj.width && relativeMouseY > obj.y && relativeMouseY < obj.y + obj.height){
            obj.onclick();
        }
    }
});

function updateMouseValues(e){
    var pxWidth = c.width;
    var pxHeight = c.height;

    var rect = c.getBoundingClientRect();
    var physWidth = Math.round(rect.right - rect.left);
    var physHeight = Math.round(rect.bottom - rect.top);

    realMouseX = Math.round(e.clientX - rect.left);
    realMouseY = Math.round(e.clientY - rect.top);

    relativeMouseX = Math.round(realMouseX * (pxWidth / physWidth));
    relativeMouseY = Math.round(realMouseY * (pxHeight / physHeight));
}
