const c = document.getElementById("game");
const ctx = c.getContext("2d");
window.onload = draw;

var cic = new CanvasInteractionClient(c);

class Point {
    constructor(x, y, render = true){
        this.x = x;
        this.y = y;
        this.render = render;
        objects.push(this);
    }
    onUpdate(){
        if(this.render){
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
}

class LineSegment {
    constructor(point1, point2, render = true){
        this.point1 = point1;
        this.point2 = point2;
        this.render = render;
        objects.push(this);
    }
    onUpdate(){
        if(this.render){
            ctx.beginPath();
            ctx.moveTo(this.point1.x, this.point1.y);
            ctx.lineTo(this.point2.x, this.point2.y);
            ctx.stroke();
            ctx.closePath();
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
            ((x >= line2.point1.x && x <= line2.point2.x) ||
            (x <= line2.point1.x && x >= line2.point2.x)) &&
            ((y >= line1.point1.y && y <= line1.point2.y) ||
            (y <= line1.point1.y && y >= line1.point2.y)) && 
            ((y >= line2.point1.y && y <= line2.point2.y) ||
            (y <= line2.point1.y && y >= line2.point2.y))
        ){
            return {"x" : x, "y" : y}
        }
    }
}

class Ball extends Point {
    constructor(x, y, dir, vel){
        super(x, y);
        this.dir = dir;
        this.vel = vel;
        this.vector = new LineSegment(new Point(x, y, false), new Point(x, y, false), false);
    }
    onUpdate(){
        super.onUpdate();

        this.vector.point1.x = this.x;
        this.vector.point1.y = this.y;
        this.vector.point2.x = this.x + Math.cos(this.dir) * this.vel * 2;
        this.vector.point2.y = this.y + Math.sin(this.dir) * this.vel * 2;

        for(const obj of objects){
            if(obj.constructor == LineSegment){
                var intersect = this.vector.intersect(obj);
                if(intersect){
                    this.dir += (2 * Math.PI - 2 * this.dir) + 2 * (Math.atan((obj.point2.y - obj.point1.y) / (obj.point2.x - obj.point1.x)));
                }
            }
        }

        this.x += Math.cos(this.dir) * this.vel;
        this.y += Math.sin(this.dir) * this.vel;
    }
}

var objects = [];
var selectedPoint = null;			
ctx.lineWidth = 3;

//Borders
new LineSegment(new Point(-7, -7), new Point(1007, -7));
new LineSegment(new Point(1007, -7), new Point(1007, 1007));
new LineSegment(new Point(1007, 1007), new Point(-7, 1007));
new LineSegment(new Point(-7, 1007), new Point(-7, -7));

new LineSegment(new Point(200, 200), new Point(700, 700));
new LineSegment(new Point(700, 700), new Point(700, 100));
new LineSegment(new Point(700, 100), new Point(200, 200));
var ball = new Ball(400, 200, Math.PI / 2, 4);

function draw(){
    ctx.clearRect(0, 0, 1000, 1000);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1000, 1000);

    ctx.fillStyle = "black";
    ctx.font = "25pt Consolas";
    ctx.fillText("Drag points with your mouse", 20, 40);
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
