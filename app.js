var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cluster = require('cluster');

var port = (process.env.PORT || '3000');
app.set('port', port);

server.listen(port);

var current_games = [];
var players = [];
var num_players = 0;

io.on('connection', function(socket) {
  var socket_server;
  var nickname;

  socket.emit('current_games', {current_games});
  socket.on('player_join', function(data) {
    nickname = data.nickname;
    players.push(nickname);
    socket.emit('id', {num_players});
    socket.emit('other_players', {players})
    io.emit('new_player', {num_players, nickname});
    num_players++;
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
    io.emit('discon', {nickname});
  });
});


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style/index.css', function(req, res) {
  res.sendFile(__dirname + '/style/index.css');
});

app.get('/scripts/client_draw.js', function(req, res) {
  res.sendFile(__dirname + '/scripts/client_draw.js');
});

app.get('/scripts/index.js', function(req, res) {
  res.sendFile(__dirname + '/scripts/index.js');
});
