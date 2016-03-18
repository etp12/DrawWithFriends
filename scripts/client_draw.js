//client-sided draw logic

var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var player_cursors = [];
var num_players = 0;
var client_name = "YOU";
var client_id;
var currentColor = "000000";

function display_game(nickname) {
  client_name = nickname;
  socket.emit('player_join', {nickname});

  socket.on('id', function(data) {
    client_id = data.num_players;
  });
  socket.on('other_players', function(data) {
    data.players.forEach(function(p) {
      var n = $("<p id='"+p+"'>" + p + " </p>");
      console.log(n);
      $("#canvas_wrapper").append(n);
    });
  });
  socket.on('currentCanvas', function(data) {
    var img = new Image;
    img.src = data;
    context.drawImage(img, 0, 0);
  });
  socket.on('getCanvas', function(data) {

    var dataUrl = canvas.toDataURL();

    socket.emit("Canvas", {dataUrl, data});
  });

  socket.on('clrScrn', function() {
    console.log($("#main_canvas").height());
    context.clearRect(0, 0, $("#main_canvas").width(), $("#main_canvas").height());

  });
  socket.on('new_player', function(data) {

      var n = $("<p id='"+data.nickname+"'>" + data.nickname + " </p>");
      console.log(n);
      $("#canvas_wrapper").append(n);


  });
  socket.on('update_mouse', function(data) {
    var left_pos = data.left_pos;
    var top_pos = data.top_pos + $("#canvas_wrapper")[0].offsetTop;
    var d = data.name;
    var query = "#"+d;
    $(query).css({left:left_pos, top:top_pos, position:'absolute'});
  });

  socket.on('update_screen', function(data) {
    var offsetTop = $("#canvas_wrapper")[0].offsetTop;
    var offsetLeft = $("#canvas_wrapper")[0].offsetLeft;
//    console.log(data);
    var x = data.data.x;
    var y  = data.data.y;
    context.fillStyle = "#"+data.data.color;
    context.fillRect(x,y,10,10);
  });

  $("#canvas_wrapper").css({visibility:'visible'});
  $("#main_wrapper").css({visibility:'hidden'});
  $("#main_wrapper").remove();
  $("body").css({background:'white'});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



$(document).mousemove(function(e) {
  var rect = canvas.getBoundingClientRect();
  var left_pos = e.clientX-rect.left, top_pos = e.clientY-rect.top;
  //$('#client').css({left:left_pos, top:top_pos, position:'absolute'});
  socket.emit('mousemove', {client_name, left_pos, top_pos});
});

//draw logic, will change when server set up
var offsetTop = $("#canvas_wrapper")[0].offsetTop;
var offsetLeft = $("#canvas_wrapper")[0].offsetLeft;
var radius = 10;
var isDragging = false;
context.lineWidth = radius*2;
function draw(e) {
  if(isDragging) {
    var rect = canvas.getBoundingClientRect();
    var left_pos = e.clientX-rect.left, top_pos = e.clientY-rect.top;
    socket.emit('isDrawing', {x: left_pos, y: top_pos, color: currentColor});
  }
}

$("#main_canvas").on('mousedown', function(e){isDragging=true; e.preventDefault();});
$("#main_canvas").on('mouseup', function(){isDragging=false; context.beginPath();});
$("#main_canvas").on('mousemove', draw);
$(document).keypress(function(e){ if(e.keyCode === 104) socket.emit('clearScreen');});
$(window).resize(function() {
  var saveImg = canvas.toDataURL();
  var tempImg = new Image;
  tempImg.src = saveImg;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.drawImage(tempImg, 0, 0);
});


}
