var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cluster = require('cluster');
var hashmap = require('hashmap');
var serverDraw = require('./server_draw.js')(io, hashmap);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style/main.css', function(req, res) {
  res.sendFile(__dirname + '/style/main.css');
});

app.get('/scripts/client_draw.js', function(req, res) {
  res.sendFile(__dirname + '/scripts/client_draw.js');
});

app.get('/scripts/index.js', function(req, res) {
  res.sendFile(__dirname + '/scripts/index.js');
});

var port = (process.env.PORT || '3000');
app.set('port', port);

server.listen(port);
