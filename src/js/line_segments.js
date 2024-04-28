const c = document.getElementById("game");
const ctx = c.getContext("2d");
window.onload = draw;

var cic = new CanvasInteractionClient(c);

class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
        objects.push(this);
    }
    onUpdate(){
        ctx.beginPath();
        if(selectedPoint == this){
            ctx.fillStyle = "yellow";
        }else{
            ctx.fillStyle = "blue";
        }
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if(Math.abs(Math.hypot(this.x - cic.mouseX, this.y - cic.mouseY)) < 15 && cic.getMouseButtonDown(1)){
            selectedPoint = this;
        }
    }
}

class LineSegment {
    constructor(point1, point2){
        this.point1 = point1;
        this.point2 = point2;
        objects.push(this);
    }
    onUpdate(){
        ctx.beginPath();
        ctx.moveTo(this.point1.x, this.point1.y);
        ctx.lineTo(this.point2.x, this.point2.y);
        ctx.stroke();
        ctx.closePath();

        for(const obj of objects){
            if(obj.constructor == LineSegment){
                var intersect = this.intersect(obj);
                if(intersect){
                    ctx.beginPath();
                    ctx.fillStyle = "green";
                    ctx.arc(intersect.x, intersect.y, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
    intersect(line2){
        var line1 = this;
        var slope1 = (line1.point1.y - line1.point2.y) / (line1.point1.x - line1.point2.x);
        var intercept1 = -slope1 * line1.point1.x + line1.point1.y;

        var slope2 = (line2.point1.y - line2.point2.y) / (line2.point1.x - line2.point2.x);
        var intercept2 = -slope2 * line2.point1.x + line2.point1.y;

        //Solving Systems of Equations
        var x = (intercept2 - intercept1) / (slope1 - slope2);
        var y = slope1 * x + intercept1;
        if(Math.abs(slope1) == Infinity){
            x = line1.point1.x;
            y = slope2 * x + intercept2;
        }
        if(Math.abs(slope2) == Infinity){
            x = line2.point1.x;
            y = slope1 * x + intercept1;
        }

        if(
            ((x >= line1.point1.x && x <= line1.point2.x) ||
            (x <= line1.point1.x && x >= line1.point2.x)) && 
            ((x > line2.point1.x && x <= line2.point2.x) ||
            (x <= line2.point1.x && x >= line2.point2.x)) &&
            ((y >= line1.point1.y && y <= line1.point2.y) ||
            (y <= line1.point1.y && y >= line1.point2.y)) && 
            ((y > line2.point1.y && y <= line2.point2.y) ||
            (y <= line2.point1.y && y >= line2.point2.y))
        ){
            return {"x" : x, "y" : y}
        }
    }
}

var objects = [];
var selectedPoint = null;			
ctx.lineWidth = 3;

new LineSegment(new Point(200, 200), new Point(700, 700));
new LineSegment(new Point(200, 400), new Point(600, 200));
new LineSegment(new Point(100, 100), new Point(800, 100));

function draw(){
    ctx.clearRect(0, 0, 1000, 1000);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1000, 1000);

    ctx.fillStyle = "black";
    ctx.font = "25pt Consolas";
    ctx.fillText("Drag points with your mouse to create intersections", 20, 40);
    ctx.fillText("Press enter to create new lines", 20, 75);


    for(const obj of objects){
        obj.onUpdate();
    }

    if(selectedPoint){
        selectedPoint.x = cic.mouseX;
        selectedPoint.y = cic.mouseY;
    }

    if(cic.getMouseButtonUp(1)){
        selectedPoint = null;
    }

    if(cic.getKeyDown("Enter")){
        new LineSegment(new Point(100, 100), new Point(800, 100));
    }

    cic.onFrameUpdate();
    window.requestAnimationFrame(draw);
}
