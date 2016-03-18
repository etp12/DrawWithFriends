//contains the listeners for our Socket connection
var socketListen = function() {
  //our id given by the server
  socket.on('id', function(data) {
    clientId = data.numPlayers;
  });

  //list of other players so we can generate tags for them
  socket.on('otherPlayers', function(data) {
    data.players.forEach(function(p) {
      var n = $("<p id='"+p+"'>" + p + " </p>");
      $("#canvasWrapper").append(n);
    });
  });

  //get the current canvas on connect if there is one
  socket.on('currentCanvas', function(data) {
    var img = new Image;
    img.src = data;
    blankScreen(function() {
    context.drawImage(img, 0, 0);
    });
  });

  //the server wants the host to send the current canvas
  socket.on('getCanvas', function(data) {
    var dataUrl = canvas.toDataURL();
    socket.emit("Canvas", {dataUrl, data});
  });

  //someone wants to clear the screen
  socket.on('clrScrn', function() {
    blankScreen();
  });

  //register a new player
  socket.on('newPlayer', function(data) {
      var n = $("<p id='"+data.nickname+"'>" + data.nickname + " </p>");
      $("#canvasWrapper").append(n);
  });

  //someone moved their mouse
  socket.on('updateMouse', function(data) {
    var leftPos = data.leftPos;
    var topPos = data.topPos + $("#canvasWrapper")[0].offsetTop;
    var d = data.name;
    var query = "#"+d;
    $(query).css({left:leftPos, top:topPos, position:'absolute'});
  });

  //someone has drawn
  socket.on('updateScreen', function(data) {
    var x = data.data.x;
    var y  = data.data.y;
    context.fillStyle = "#"+data.data.color;
    context.fillRect(x,y,10,10);
  });
};
