window.onload = function(){
  resetBall();
  draw();
}

var ballX = 500;
var ballY = 500;

var velX = 0;
var velY = 0;

var player1Y = 460;
var wPressed = false;
var sPressed = false;

var player2Y = 460;
var upPressed = false;
var downPressed = false;

var pause = true;
var p1score = 0;
var p2score = 0;

var c = document.getElementById("game");
var ctx = c.getContext("2d");

function draw(){
  ctx.clearRect(0, 0, 1000, 1000);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 1000, 1000);

  //Ball
  ctx.beginPath();
  ctx.fillStyle = "#FFFFFF";
  ctx.arc(ballX, ballY, 10, 0, 2 * Math.PI);
  ctx.fill();

  if(ballY + 5 >= 1000 || ballY - 5 <= 0){
    velY *= -1;
  }

  ballX += velX;
  ballY += velY;

  //Player 1
  if(wPressed && player1Y > 0){
    player1Y -= 5;
  }
  if(sPressed && player1Y < 900){
    player1Y += 5;
  }
  ctx.fillRect(30, player1Y, 20, 100);

  //Player 2
  if(upPressed && player2Y > 0){
    player2Y -= 5;
  }
  if(downPressed && player2Y < 900){
    player2Y += 5;
  }

  ctx.fillRect(950, player2Y, 20, 100);

  if((ballX >= 945 && (ballY < player2Y + 100 && ballY > player2Y)) || (ballX <= 55 && (ballY < player1Y + 100 && ballY > player1Y))){
    velX *= -1;
  }
  if(ballX >= 990){
    p1score++;
    resetBall();
  }
  if(ballX <= 10){
    p2score++;
    resetBall();
  }

  //UI
  ctx.fillRect(498, 0, 4, 1000);
  ctx.font = "60pt Consolas";
  ctx.textAlign = "right";
  ctx.fillText(p1score, 480, 70);
  ctx.textAlign = "left";
  ctx.fillText(p2score, 520, 70);

  if(!pause){
    window.requestAnimationFrame(draw);
  }else{
    ctx.fillStyle = "rgb(50, 50, 50, 0.5)";
    ctx.fillRect(0, 0, 1000, 1000);
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.font = "60pt Arial";
    ctx.fillText("Press Enter to resume", 500, 500);
    ctx.font = "20pt Arial";
    ctx.fillText("Controls: Enter to pause/resume", 500, 550);
    ctx.fillText("P1: Up and Down Arrows to move", 500, 585);
    ctx.fillText("P2: W and S to move", 500, 620);
  }
}

function resetBall(){
  ballX = 500;
  ballY = 500;

  if(Math.round(Math.random()) == 1){
    velX = Math.random() * 6 + 2;
  }else{
    velX = Math.random() * -6 - 2;
  }
  if(Math.round(Math.random()) == 1){
    velY = Math.random() * 6 + 2;
  }else{
    velY = Math.random() * -6 - 2;
  }
}

document.addEventListener("keydown", function(e){
  if(e.key == "Enter"){
    if(pause){
      pause = false;
      draw();
    }else{
      pause = true;
    }
  }
  if(e.key == "ArrowUp"){
    e.preventDefault();
    upPressed = true;
  }
  if(e.key == "ArrowDown"){
    e.preventDefault();
    downPressed = true;
  }
  if(e.key == "w"){
    e.preventDefault();
    wPressed = true;
  }
  if(e.key == "s"){
    e.preventDefault();
    sPressed = true;
  }
});

document.addEventListener("keyup", function(e){
  if(e.key == "ArrowUp"){
    upPressed = false;
  }
  if(e.key == "ArrowDown"){
    downPressed = false;
  }
  if(e.key == "w"){
    wPressed = false;
  }
  if(e.key == "s"){
    sPressed = false;
  }
});
