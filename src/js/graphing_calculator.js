const P = function(x, y){
    return {"x" : x, "y" : y};
}

var win = {
    "xMin" : -10,
    "xMax" : 10,
    "yMin" : -10,
    "yMax" : 10
}

win.xSpacing = 1000 / Math.abs(win.xMax - win.xMin);
win.ySpacing = 1000 / Math.abs(win.yMax - win.yMin);

const c = document.getElementById("game");
const ctx = c.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, 1000, 1000);

ctx.font = "15pt Consolas";
for(var x = 0; x <= 1000; x += win.xSpacing){
    var number = Math.round(win.xMin + (x / win.xSpacing));
    if(number == 0){
        ctx.lineWidth = 4;
    }else{
        ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1000);
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fillText(number, x, 20);
}

for(var y = 0; y <= 1000; y += win.ySpacing){
    var number = Math.round(win.yMax - (y / win.ySpacing));
    if(number == 0){
        ctx.lineWidth = 4;
    }else{
        ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1000, y);
    ctx.stroke();
    ctx.closePath();
    ctx.fillText(number, 10, y);
}

graph([-1, "*", ["x", "rt", 2]], "red");
graph(["x", "+", 3], "blue");
graph(["rad", "tan", ["x", "rt", 2]], "green");

function graph(lexedEquation, color){
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    for(var x = 0; x <= 1000; x++){
        ctx.lineTo(x, win.ySpacing * 10 - evaluate(lexedEquation, win.xMin + (x / win.xSpacing)) * win.ySpacing);
    }
    ctx.stroke();
    ctx.closePath();
}

function evaluate(exp, x){
    exp = JSON.parse(JSON.stringify(exp));
    for(const item of [0, 2]){
        if(Array.isArray(exp[item])){
            exp[item] = evaluate(exp[item], x);
        }
        if(exp[item] == "x"){
            exp[item] = x;
        }
    }
    switch(exp[1]){
        case "+":
            return exp[0] + exp[2];
        case "*":
            return exp[0] * exp[2];
        case "-":
            return exp[0] - exp[2];
        case "/":
            return exp[0] / exp[2];
        case "^":
            return Math.pow(exp[0], exp[2]);
        case "rt":
            return nthroot(exp[0], exp[2]);
        case "tan":
            return Math.tan(exp[2]);
        case "addFac":
            let sum = 0;
            for(let i = 0; i <= exp[2]; i++){
                sum += i;
            }
            return sum;
    }
}

//https://stackoverflow.com/questions/7308627/javascript-calculate-the-nth-root-of-a-number
function nthroot(x, n) {
    try {
        var negate = n % 2 == 1 && x < 0;
        if(negate)
            x = -x;
        var possible = Math.pow(x, 1 / n);
        n = Math.pow(possible, n);
        if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
            return negate ? -possible : possible;
    } catch(e){
        alert(e);
    }
}