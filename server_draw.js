module.exports = function(io, hashmap) {
  var current_games = [];

  var sockets = new hashmap();
  var num_players = 0;
  var currentImg = 0;
  var players;
  io.on('connection', function(socket) {
    var socket_server;
    var nickname;

    socket.emit('current_games', {current_games});
    socket.on('player_join', function(data) {
      console.log(num_players);

      nickname = data.nickname;
      sockets.set(nickname, socket);
      socket.emit('id', {num_players});
      players = sockets.keys();


      if(num_players > 0) {
        socket.emit('other_players', {players});
        var s = sockets.values();

        s[0].emit('getCanvas', {nickname});
      }
      io.emit('new_player', {num_players, nickname});

      num_players++;
    });

    socket.on('Canvas', function(data) {

      currentImg = data.dataUrl;

      sockets.get(data.data.nickname).emit('currentCanvas', currentImg);
    });
    socket.on('clearScreen', function() {
      io.emit('clrScrn');
    });

    socket.on('mousemove', function(data) {
      var name = data.client_name;
      var left_pos = data.left_pos;
      var top_pos = data.top_pos;

      io.emit('update_mouse', {name, left_pos, top_pos});
    });

    socket.on('isDrawing', function(data) {
      io.emit('update_screen', {data});
    });

    socket.on('disconnect', function() {
      if(sockets.get(nickname) != null) {
        sockets.remove(nickname);
        if(num_players > 0)
          num_players--;
      }
      io.emit('discon', {nickname});
    });
  });
}
