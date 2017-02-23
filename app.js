//Author: Ethan Pavolik  etp12@pitt.edu
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var favicon = require('serve-favicon');
var hashmap = require('hashmap');
var serverDraw = require('./serverDraw.js')(io, hashmap);

app.use(favicon(__dirname + '/static/favicon.ico'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style/main.css', function(req, res) {
  res.sendFile(__dirname + '/style/main.css');
});

app.get('/style/loginPage.css', function(req, res) {
  res.sendFile(__dirname + '/style/loginPage.css');
});

app.get('/scripts/clientDraw.js', function(req, res) {
  res.sendFile(__dirname + '/scripts/clientDraw.js');
});

app.get('/scripts/index.js', function(req, res) {
  res.sendFile(__dirname + '/scripts/index.js');
});

app.get('/scripts/socketListeners.js', function(req, res) {
  res.sendFile(__dirname + '/scripts/socketListeners.js');
});

app.get('/scripts/eventListeners.js', function(req, res) {
  res.sendFile(__dirname + '/scripts/eventListeners.js');
});

app.get('/static/save.png', function(req, res) {
  res.sendFile(__dirname + '/static/save.png');
});

var port = (process.env.PORT || '3000');
app.set('port', port);

server.listen(port);
