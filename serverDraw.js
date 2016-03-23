//Author: Ethan Pavolik  etp12@pitt.edu
module.exports = function(io, hashmap) {
  var currentGames = ['Default'];
  var sockets = new hashmap(); //Nickname : Socket
  var IdMap = new hashmap();
  var servers = new hashmap(); //Server Name : Array of sockets
  servers.set('Default', []);
  var numPlayers = 0;
  var currentImg = 0;
  var players = [];
  var clientObj = function(socket, name) {
    this.socket = socket;
    this.nickname = name;
  };
  io.on('connection', function(socket) {
    socket.on('reset', function(data) {
      currentGames = ['Default'];
      sockets = new hashmap(); //Nickname : Socket
      IdMap = new hashmap();
      servers = new hashmap(); //Server Name : Array of sockets
      servers.set('Default', []);
      numPlayers = 0;
      currentImg = 0;
      players = [];
    });
    var client;
    var nickname;
    var socketServer;
    //send player current games TODO
    socket.emit('currentGames', {currentGames});
    socket.on('createServer', function(data) {
      if(servers.keys().indexOf(data.serverName) != -1) {
        socket.emit('invalidServerName');
      }
      else {
        servers.set(data.serverName, []);
        socket.emit('validServerName');
      }
      currentGames = servers.keys();
      io.emit('currentGames', {currentGames});
    });
    //on player join save their name and insert into hashmap with their socket
    //then send them the other players, the current canvas, and let everyone know there is a new player
    socket.on('playerJoin', function(data) {
      client = new clientObj(socket, data.nickname);
      socketServer = data.serverName;
      nickname = data.nickname;
      var canvasReq;
      sockets.set(nickname, socket);
      servers.get(socketServer).forEach(function(client) {
        players.push(client.nickname);
      });
      var canv, otherPlay = servers.get(socketServer);
      canv = servers.get(socketServer);
      otherPlay.push(client);
      servers.set(socketServer, otherPlay);
      socket.emit('id', servers.get(socketServer).length);
      socket.emit('otherPlayers', {players});
      servers.get(socketServer).forEach(function(client) {
        client.socket.emit('newPlayer', {numPlayers, nickname});
      });
      if(players.length > 0) {
        servers.get(socketServer).forEach(function(client, i) {
          if(client.socket != socket) {
            client.socket.emit('getCanvas', {nickname});
            return;
          }
        });
      }

      numPlayers++;
    });

    //send the canvas to the new player
    socket.on('Canvas', function(data) {
      currentImg = data.dataUrl;
      sockets.get(data.data.nickname).emit('currentCanvas', currentImg);
    });

    //someone wants to clear the screen
    socket.on('clearScreen', function() {
      servers.get(socketServer).forEach(function(client) {
        client.socket.emit('clrScrn');
      });
    });

    //someone moved their mouse, let everyone else know who and where
    socket.on('mousemove', function(data) {
      var name = data.clientName;
      var leftPos = data.leftPos;
      var topPos = data.topPos;
      servers.get(socketServer).forEach(function(client) {
        client.socket.emit('updateMouse', {name, leftPos, topPos});
      });
    });

    //someone is drawing, let everyone else know
    socket.on('isDrawing', function(data) {
      servers.get(socketServer).forEach(function(client) {
        client.socket.emit('updateScreen', {data});
      });
    });

    //someone disconnected, try to remove them from hashmap and let everyone know who d/c'd
    socket.on('disconnect', function(s) {
      if(socketServer != null) {
        sockets.remove(nickname);
        var tArray = [];
        var removeI;
       if(servers.get(socketServer) != null) {
         tArray = servers.get(socketServer);
         tArray.forEach(function(ele, i) {
           if(ele.nickname == nickname) {
             removeI = i;
           }
         });
         if(removeI != null) {
           tArray.splice(removeI, 1);
           servers.set(socketServer, tArray);
         }
          servers.get(socketServer).forEach(function(client) {
            client.socket.emit('dicon', {nickname});
          });
          if(servers.get(socketServer).length === 0 && socketServer != 'Default') {
            servers.remove(socketServer);
            currentGames = servers.keys();
            io.emit('currentGames', {currentGames});
          }
        }
        if(servers.get(socketServer) != null) { //check again after potential delete
        servers.get(socketServer).forEach(function(client) {
          players.push(client.nickname);
        });
        socket.emit('otherPlayers', {players});
        }
      }
    });
  });

}
