var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

var current_games = ['first'];

io.on('connection', function(socket) {
  socket.emit('current_games', {current_games});
  socket.on('create_server', function(name) {
    //create server with the name
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
