//Author: Ethan Pavolik  etp12@pitt.edu

//contains the listeners for our Socket connection
var socketListen = function() {
  //our id given by the server
  socket.on('id', function(data) {
    clientId = data.numPlayers;
  });

  //list of other players so we can generate tags for them
  socket.on('otherPlayers', function(data) {
    data.players.forEach(function(p) {
      playerCursors.push($("<p id='"+p+"'>" + p + " </p>"));
      playerCursors.forEach(function(ele) {
        $("#canvasWrapper").append(ele);
      });
    });
  });

  socket.on('dicon', function(data) {
    console.log('someone d/cd');
    var removeI;
    playerCursors.forEach(function(ele, i) {
      if(ele.attr('id') == data.nickname) {
        removeI = i;
        return;
      }
    });
    if(removeI != null) {
      playerCursors.splice(removeI, 1);
      playerCursors.forEach(function(ele) {
        $("#canvasWrapper").append(ele);
      });
    }
  });
  //get the current canvas on connect if there is one
  socket.on('currentCanvas', function(data) {
    console.log('getting canvas');
    var img = new Image;
    img.src = data;
    blankScreen(function() {
    context.drawImage(img, 0, 0);
    });
  });

  //the server wants the host to send the current canvas
  socket.on('getCanvas', function(data) {
    var dataUrl = canvas.toDataURL();
    console.log('sending my canvas');
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
