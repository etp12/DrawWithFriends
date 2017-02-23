//Author: Ethan Pavolik  etp12@pitt.edu

//client-sided draw logic
var canvas = document.getElementById('mainCanvas');
var context = canvas.getContext('2d');
var smoothLines = false;
var playerCursors = [];
var numPlayers = 0;
var clientName = "YOU";
var clientId;
var currentColor = "000000";
var resizeTimeout; //used for Firefox resize event
var offsetTop = $("#canvasWrapper")[0].offsetTop;
var offsetLeft = $("#canvasWrapper")[0].offsetLeft;
var isDragging = false;
var lastX, lastY;
function displayGame(nickname, serverName) {

  //store nickname and tell it to server
  clientName = nickname;
  socket.emit('playerJoin', {nickname, serverName});

  //register SocketIO listeners
  socketListen();

  //register Event listeners
  eventListen();

  //set the draw screen
  $("#canvasWrapper").css({visibility:'visible'});
  $("#serverSelection").css({visibility:'hidden'});
  $("#serverSelection").remove();
  $("body").css({background:'white'});
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

//called when mousebutton is down is down
function draw(e) {
  if(isDragging) {
    var rect = canvas.getBoundingClientRect();
    var x1 = e.clientX-rect.left, y1 = e.clientY-rect.top;
    if(smoothLines) {
      var x0 = (lastX == null) ? x1 : lastX;
      var y0 = (lastY == null) ? y1 : lastY;
      //bresenham? hopefully  http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
      var dx = Math.abs(x1-x0);
      var dy = Math.abs(y1-y0);
      var sx = (x0 < x1) ? 1 : -1;
      var sy = (y0 < y1) ? 1 : -1;
      var err = dx-dy;

      while(true){

        socket.emit('isDrawing', {x: x0, y: y0, color: currentColor});

        if ((x0==x1) && (y0==y1)) break;
        var e2 = 2*err;
        if (e2 >-dy){ err -= dy; x0  += sx; }
        if (e2 < dx){ err += dx; y0  += sy; }
      }
    }
    else {
      socket.emit('isDrawing', {x: x1, y: y1, color: currentColor});
    }
  }
  lastX = x1;
  lastY = y1;
}

//called 500ms after window is resized
function doneResizing(tempImg) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.drawImage(tempImg, 0, 0);
}

//changes draw style
function changeDrawStyle() {
  smoothLines = $("#smooth").is(":checked");
}

//wipes the draw area
function blankScreen(callback) {
  context.fillStyle = "#FFF";
  context.clearRect(0, 0, $("#mainCanvas").width(), $("#mainCanvas").height());
  context.fillRect(0, 0, $("#mainCanvas").width(), $("#mainCanvas").width());
  setTimeout(callback, 500);
}
