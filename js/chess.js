window.onload = draw;
			
var pieces = {
  "A8" : "BlackCastle", "B8" : "BlackHorse", "C8" : "BlackBishop", "D8" : "BlackKing", "E8" : "BlackQueen", "F8" : "BlackBishop", "G8" : "BlackHorse", "H8" : "BlackCastle",
  "A7" : "BlackPawn", "B7" : "BlackPawn", "C7" : "BlackPawn", "D7" : "BlackPawn", "E7" : "BlackPawn", "F7" : "BlackPawn", "G7" : "BlackPawn", "H7" : "BlackPawn",
  "A6" : null, "B6" : null, "C6" : null, "D6" : null, "E6" : null, "F6" : null, "G6" : null, "H6" : null,
  "A5" : null, "B5" : null, "C5" : null, "D5" : null, "E5" : null, "F5" : null, "G5" : null, "H5" : null,
  "A4" : null, "B4" : null, "C4" : null, "D4" : null, "E4" : null, "F4" : null, "G4" : null, "H4" : null,
  "A3" : null, "B3" : null, "C3" : null, "D3" : null, "E3" : null, "F3" : null, "G3" : null, "H3" : null,
  "A2" : "WhitePawn", "B2" : "WhitePawn", "C2" : "WhitePawn", "D2" : "WhitePawn", "E2" : "WhitePawn", "F2" : "WhitePawn", "G2" : "WhitePawn", "H2" : "WhitePawn",
  "A1" : "WhiteCastle", "B1" : "WhiteHorse", "C1" : "WhiteBishop", "D1" : "WhiteKing", "E1" : "WhiteQueen", "F1" : "WhiteBishop", "G1" : "WhiteHorse", "H1" : "WhiteCastle",
  "turn" : "White"
}

const cols = ["A", "B", "C", "D", "E", "F", "G", "H"];

var redHighlights = [];
var orangeHighlights = [];

var c = document.getElementById("game");
var ctx = c.getContext("2d");

function draw(){
  ctx.clearRect(0, 0, c.width, c.height);
  var x = 0, y = 0, repetition = 0, pieceRep = 0;
  for(var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
      ctx.beginPath();
      ctx.moveTo(x, y);
      y += 125;
      ctx.lineTo(x, y);
      x += 125;
      ctx.lineTo(x, y);
      y -= 125;
      ctx.lineTo(x, y);
      x -= 125;
      ctx.lineTo(x, y);
      ctx.stroke();
      if(redHighlights.indexOf(Object.keys(pieces)[pieceRep]) != -1){ //redHighlights the spot if it needs to be highlighted
        ctx.fillStyle = "#FF0000";
      }else if(orangeHighlights.indexOf(Object.keys(pieces)[pieceRep]) != -1){
        ctx.fillStyle = "#FFA500";
      }else if(repetition % 2 == 0){
        ctx.fillStyle = "#303030";
      }else{
        ctx.fillStyle = "#FFFFFF";
      }
      ctx.fill();

      var currentPiece = pieces[Object.keys(pieces)[pieceRep]]; //add image if there is a piece on this spot
      if(currentPiece != null){
        var img = document.getElementById(currentPiece);
        ctx.drawImage(img, x, y - 5, 125, 125);
      }
      ctx.closePath();
      repetition++;
      pieceRep++;
      x += 125;
    }
    x = 0;
    y += 125;
    repetition++;
  }
}

document.addEventListener("keydown", function(e){
  if(document.activeElement.tagName == "INPUT"){
    var value = document.activeElement.value.toUpperCase();
    if(value.length == 0){
      if(e.key.match(/[A-H]/i) == null){ //prevents unwanted characters: position 1
        e.preventDefault();
      }
    }else{
      if(e.key.match(/[1-8]/) == null && e.key.length == 1){ //prevents unwanted characters: position 2
        e.preventDefault();
      }
    }

    window.setTimeout(function(){
      if(document.activeElement.id == "input-1"){
        redHighlights = [];
      }else{
        orangeHighlights = [];
      }
      value = document.activeElement.value.toUpperCase();
      if(value.length == 2){
        if(document.activeElement.id == "input-1"){
          redHighlights.push(value);
        }else{
          orangeHighlights.push(value);
        }
      }else if(value.length == 1){
        for(var i = 1; i < 9; i++){
          if(document.activeElement.id == "input-1"){
            redHighlights.push(value.toString() + i.toString());
          }else{
            orangeHighlights.push(value.toString() + i.toString());
          }
        }
      }
      draw();
    }, 0);

    if(e.key == "Enter"){
      validateInput();
    }
  }
});

function validateInput(){
  var from = document.getElementById("input-1").value.toUpperCase();
  var to = document.getElementById("input-2").value.toUpperCase();

  //checking to make sure the piece can move there
  if(pieces[from] == null){
    alert("There is no piece there!");
    return;
  }

  var color = pieces[from].slice(0, 5);

  if(color != pieces.turn){
    alert("It is not " + color + "'s turn yet!");
    return;
  }

  var pieceType = pieces[from].slice(5, pieces[from].length);

  var rowFrom = from.slice(1, 2);
  var colFrom = from.slice(0, 1);
  var rowTo = to.slice(1, 2);
  var colTo = to.slice(0, 1);

  var xChange = (cols.indexOf(colTo) - cols.indexOf(colFrom));
  var yChange = (rowTo - rowFrom);

  if(xChange == 0 && yChange == 0){
    alert("That move is invalid!");
    return;
  }

  //alert(xChange + ", " + yChange);

  if(pieceType == "Pawn"){
    if(color == "White"){ //White Pawn's Move
      if(Math.abs(xChange) == 1 && yChange == 1){ //if White Pawn diagonal
        if(pieces[to] != null){ //if there is a piece on that spot
          if(!(pieces[to].slice(0, 5) == "Black")){ //if that piece is not black
            alert("That move is invalid!");
            return;
          }
        }else{ //if there is not a piece on that spot
          alert("That move is invalid!");
          return;
        }
      }else if(xChange == 0){ //if White Pawn moving forward normally
        if(pieces[to] == null){ //if there is no piece on that spot
          if(rowFrom == "2"){ //if it is White Pawn's First Move
            if(yChange < 3 && yChange > 0){ //if it is 1 or 2 forward
              if(isCrossing(rowFrom, colFrom, rowTo, colTo, "vertical")){ //if crossing paths of another piece
                alert("That move is invalid!");
                return;
              }
            }else{
              alert("That move is invalid!");
              return;
            }
          }else{ //if it is not White Pawn's First move
            if(yChange != 1){ //if it is not 1 forward
              alert("That move is invalid!");
              return;
            }
          }
        }else{ //if there is a piece on that spot
          alert("That move is invalid!");
          return;
        }
      }else{ //if the pawn is not attacking or moving forward, it is incorrect
        alert("That move is invalid!");
        return;
      }
    }else{ //Black Pawn's Move
      if(Math.abs(xChange) == 1 && yChange == -1){ //if Black Pawn diagonal
        if(pieces[to] != null){ //if there is a piece on that spot
          if(!(pieces[to].slice(0, 5) == "White")){ //if that piece is not white
            alert("That move is invalid!");
            return;
          }
        }else{
          alert("That move is invalid!");
          return;
        }
      }else if(xChange == 0){ //if Black Pawn moving forward normally
        if(pieces[to] == null){ //if there is no piece on that spot
          if(rowFrom == "7"){ //if it is Black Pawn's First Move
            if(yChange > -3 && yChange < 0){ //if it is 1 or 2 forward
              if(isCrossing(rowFrom, colFrom, rowTo, colTo, "vertical")){ //if crossing paths of another piece
                alert("That move is invalid!");
                return;
              }
            }else{
              alert("That move is invalid!");
              return;
            }
          }else{ //if it is not Black Pawn's First move
            if(yChange != -1){ //if it is not 1 forward
              alert("That move is invalid!");
              return;
            }
          }
        }else{ //if there is a piece on that spot
          alert("That move is invalid!");
          return;
        }
      }else{ //if the pawn is not attacking or moving forward, it is incorrect
        alert("That move is invalid!");
        return;
      }
    }
  }else if(pieceType == "Castle"){
    if(xChange == 0 && yChange != 0){ //if the movement is in a vertical straight line
      if(isCrossing(rowFrom, colFrom, rowTo, colTo, "vertical")){ //if crossing another piece
        alert("That move is invalid!");
        return;
      }else{ //if not crossing another piece
        if(pieces[to] != null){ //if there is a piece there
          if(pieces[to].slice(0, 5) == color){
            alert("That move is invalid!");
            return;
          }
        }
      }
    }else if(xChange !== 0 && yChange == 0){ //if the movement is in a horizontal straight line
      if(isCrossing(rowFrom, colFrom, rowTo, colTo, "horizontal")){ //if crossing another piece
        alert("That move is invalid!");
        return;
      }else{ //if not crossing another piece
        if(pieces[to] != null){ //if there is a piece there
          if(pieces[to].slice(0, 5) == color){
            alert("That move is invalid!");
            return;
          }
        }
      }
    }else{ //if movement is not in a straight line
      alert("That move is invalid!");
      return;
    }
  }else if(pieceType == "Horse"){
    if((Math.abs(xChange) == 1 && Math.abs(yChange) == 2) || (Math.abs(xChange) == 2 && Math.abs(yChange) == 1)){ // 1 and 2
      if(pieces[to] != null){ //if there is a piece there
        if(pieces[to].slice(0, 5) == color){
          alert("That move is invalid!");
          return;
        }
      }
    }else{
      alert("That move is invalid!");
      return;
    }
  }else if(pieceType == "Bishop"){ //If the piece is a bishop
    if(Math.abs(xChange) == Math.abs(yChange)){ //if it is diagonal
      if(Math.abs(xChange) > 1){
        if(isCrossing(rowFrom, colFrom, rowTo, colTo, "diagonal")){ //if crossing another piece
          alert("That move is invalid!");
          return;
        }else{ //if not crossing another piece
          if(pieces[to] != null){ //if there is a piece there
            if(pieces[to].slice(0, 5) == color){
              alert("That move is invalid!");
              return;
            }
          }
        }
      }
    }else{
      alert("That move is invalid!");
      return;
    }
  }else if(pieceType == "King"){
    if(Math.abs(xChange) > 1 || Math.abs(yChange) > 1){
      alert("That move is invalid!")
      return;
    }
  }else if(pieceType == "Queen"){
    if(xChange == 0 && yChange != 0){ //if the movement is in a vertical straight line
      if(isCrossing(rowFrom, colFrom, rowTo, colTo, "vertical")){ //if crossing another piece
        alert("That move is invalid!");
        return;
      }else{ //if not crossing another piece
        if(pieces[to] != null){ //if there is a piece there
          if(pieces[to].slice(0, 5) == color){
            alert("That move is invalid!");
            return;
          }
        }
      }
    }else if(xChange !== 0 && yChange == 0){ //if the movement is in a horizontal straight line
      if(isCrossing(rowFrom, colFrom, rowTo, colTo, "horizontal")){ //if crossing another piece
        alert("That move is invalid!");
        return;
      }else{ //if not crossing another piece
        if(pieces[to] != null){ //if there is a piece there
          if(pieces[to].slice(0, 5) == color){
            alert("That move is invalid!");
            return;
          }
        }
      }
    }else if(Math.abs(xChange) == Math.abs(yChange)){ //if it is diagonal
      if(Math.abs(xChange) > 1){
        if(isCrossing(rowFrom, colFrom, rowTo, colTo, "diagonal")){ //if crossing another piece
          alert("That move is invalid!");
          return;
        }else{ //if not crossing another piece
          if(pieces[to] != null){ //if there is a piece there
            if(pieces[to].slice(0, 5) == color){
              alert("That move is invalid!");
              return;
            }
          }
        }
      }
    }else{
      alert("That move is invalid!");
      return;
    }
  }


  //Actually move the piece				
  document.getElementById("input-1").value = "";
  document.getElementById("input-2").value = "";

  redHighlights = [];
  orangeHighlights = [];

  var img = pieces[from];

  pieces[to] = pieces[from];
  pieces[from] = null;
  draw();

  if(pieces.turn == "White"){
    pieces.turn = "Black";
  }else{
    pieces.turn = "White";
  }

  if(Object.values(pieces).indexOf("BlackKing") == -1){
    alert("White wins!");
  }
  if(Object.values(pieces).indexOf("WhiteKing") == -1){
    alert("Black wins!");
  }

  var tbody = document.getElementById("history").firstElementChild.firstElementChild;
  tbody.innerHTML += "<tr id=\"" + (+tbody.lastElementChild.id + 1) + "\"" +
    "data-history='" + JSON.stringify(pieces) + "' onclick=\"restore(this);\"><td><img src=\"../Resources/Images/" + img + ".png\"/>" + from + " to " + to + "</td></tr>";

  document.getElementById("input-1").focus();

  var history = document.getElementById("history");
  history.scrollTop = history.scrollHeight;
}

function restore(element){
  if(confirm("Are you sure you want to restore this move? All following history will be removed.")){
    for(var i = +element.id + 1; i <= +document.getElementById("history").firstElementChild.firstElementChild.lastElementChild.id; i++){ //remove all the history in HTML
      document.getElementById(i).remove();
    }
    pieces = JSON.parse(element.getAttribute("data-history"));
    draw();
  }
}

function isCrossing(rowFrom, colFrom, rowTo, colTo, mode){
  var path = [];
  if(mode == "vertical"){
    if(rowFrom < rowTo){
      for(var i = (+rowFrom + 1); i < rowTo; i++){
        if(pieces[colFrom + i] !== null){
          return true;
        }
      }
    }else{
      for(var i = (+rowFrom - 1); i > rowTo; i--){
        if(pieces[colFrom + i] !== null){
          return true;
        }
      }
    }
    return false;
  }

  if(mode == "horizontal"){
    var colFromNum = cols.indexOf(colFrom) + 1;
    var colToNum = cols.indexOf(colTo) + 1;
    if(colFromNum < colToNum){
      //alert(colFromNum + ", " + colToNum)
      for(var i = colFromNum; i < colToNum - 1; i++){
        alert(i + ", " + (cols[i] + rowFrom) + ", " + pieces[cols[i] + rowFrom]);
        if(pieces[cols[i] + rowFrom] != null){
          return true;
        }
      }
    }else{
      //alert(colFromNum + ", " + colToNum)
      for(var i = colFromNum; i > colToNum + 1; i--){
        //alert(i + ", " + (cols[i-2] + rowFrom) + ", " + pieces[cols[i-2] + rowFrom]);
        if(pieces[cols[i-2] + rowFrom] != null){
          return true;
        }
      }
    }
  }

  if(mode == "diagonal"){
    var colFromNum = cols.indexOf(colFrom) + 1;
    var colToNum = cols.indexOf(colTo) + 1;

    //alert(colFromNum + ", " + colToNum);
    var colIternate = 0;

    if(rowFrom < rowTo && colFromNum < colToNum){
      //alert("UpRight");
      for(var i = rowFrom; i < rowTo - 1; i++){
        //alert((cols[+colFromNum + colIternate]) + (+i + 1) + ", " + pieces[(cols[+colFromNum + colIternate]) + (+i + 1)]);
        if(pieces[(cols[+colFromNum + colIternate]) + (+i + 1)] != null){
          return true;
        }
        colIternate++;
      }
    }else if(rowFrom > rowTo && colFromNum < colToNum){
      //alert("DownRight");
      for(var i = rowFrom; i > rowTo + 1; i--){
        //alert((cols[+colFromNum + colIternate]) + (+i - 1) + ", " + pieces[(cols[+colFromNum + colIternate]) + (+i - 1)]);
        if(pieces[(cols[+colFromNum + colIternate]) + (+i - 1)] != null){
          return true;
        }
        colIternate++;
      }
    }else if(rowFrom > rowTo && colFromNum > colToNum){
      //alert("DownLeft");
      for(var i = rowFrom; i > rowTo; i--){
        //alert((cols[+colFromNum + colIternate - 2]) + (+i - 1) + ", " + pieces[(cols[+colFromNum + colIternate - 2]) + (+i - 1)]);
        if(pieces[(cols[+colFromNum + colIternate - 2]) + (+i - 1)] != null){
          return true;
        }
        colIternate--;
      }
    }else if(rowFrom < rowTo && colFromNum > colToNum){
      //alert("UpLeft");
      for(var i = rowFrom; i < rowTo - 1; i++){
        //alert((cols[+colFromNum + colIternate - 2]) + (+i + 1) + ", " + pieces[(cols[+colFromNum + colIternate - 2]) + (+i + 1)]);
        if(pieces[(cols[+colFromNum + colIternate - 2]) + (+i + 1)] != null){
          return true;
        }
        colIternate--;
      }
    }
    return false;
  }
}
