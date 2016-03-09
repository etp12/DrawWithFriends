var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

var current_games = ['first'];

io.on('connection', function(socket) {
  socket.emit('current_games', {current_games});
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/style/index.css', function(req, res) {
  res.sendfile(__dirname + '/style/index.css');
});

app.get('/scripts/client_draw.js', function(req, res) {
  res.sendfile(__dirname + '/scripts/client_draw.js');
});

app.get('/scripts/index.js', function(req, res) {
  res.sendfile(__dirname + '/scripts/index.js');
});
