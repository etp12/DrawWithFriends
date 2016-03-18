module.exports = function(io, hashmap) {
  var currentGames = [];
  var sockets = new hashmap();
  var numPlayers = 0;
  var currentImg = 0;
  var players;

  io.on('connection', function(socket) {
    var socketServer;
    var nickname;

    //send player current games TODO
    socket.emit('currentGames', {currentGames});

    //on player join save their name and insert into hashmap with their socket
    //then send them the other players, the current canvas, and let everyone know there is a new player
    socket.on('playerJoin', function(data) {
      nickname = data.nickname;
      sockets.set(nickname, socket);
      socket.emit('id', {numPlayers});
      players = sockets.keys();

      if(numPlayers > 0) {
        socket.emit('otherPlayers', {players});
        var s = sockets.values();

        s[0].emit('getCanvas', {nickname});
      }
      io.emit('newPlayer', {numPlayers, nickname});

      numPlayers++;
    });

    //send the canvas to the new player
    socket.on('Canvas', function(data) {
      currentImg = data.dataUrl;
      sockets.get(data.data.nickname).emit('currentCanvas', currentImg);
    });

    //someone wants to clear the screen
    socket.on('clearScreen', function() {
      io.emit('clrScrn');
    });

    //someone moved their mouse, let everyone else know who and where
    socket.on('mousemove', function(data) {
      var name = data.clientName;
      var leftPos = data.leftPos;
      var topPos = data.topPos;
      io.emit('updateMouse', {name, leftPos, topPos});
    });

    //someone is drawing, let everyone else know
    socket.on('isDrawing', function(data) {
      io.emit('updateScreen', {data});
    });

    //someone disconnected, try to remove them from hashmap and let everyone know who d/c'd
    socket.on('disconnect', function() {
      if(sockets.get(nickname) != null) {
        sockets.remove(nickname);
        if(numPlayers > 0)
          numPlayers--;
      }
      io.emit('discon', {nickname});
    });
  });
}
