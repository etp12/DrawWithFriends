//client-sided draw logic

var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var player_cursors = [];
var num_players = 0;
var client_name = "YOU";
var client_id;
//temporary
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
  socket.on('discon', function(data) {
    //TODO
    player_cursors = [];
    num_players = 0;

  });
  socket.on('new_player', function(data) {

      var n = $("<p id='"+data.nickname+"'>" + data.nickname + " </p>");
      console.log(n);
      $("#canvas_wrapper").append(n);


  });
  socket.on('update_mouse', function(data) {
    var left_pos = data.left_pos;
    var top_pos = data.top_pos;
    var d = data.name;
    var query = "#"+d;
    $(query).css({left:left_pos, top:top_pos, position:'absolute'});
  });

  socket.on('update_screen', function(data) {
    var offsetTop = $("#canvas_wrapper")[0].offsetTop;
    var offsetLeft = $("#canvas_wrapper")[0].offsetLeft;
    console.log(data);
    var x = data.data.x;
    var y  = data.data.y;
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    //context.moveTo(x, y);
  });

  $("#canvas_wrapper").css({visibility:'visible'});
  $("#main_wrapper").css({visibility:'hidden'});


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



$(document).mousemove(function(e) {
  var left_pos = e.clientX, top_pos = e.clientY-50;
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
    socket.emit('isDrawing', {x: e.clientX, y: e.clientY});
  }
}

$("#main_canvas").on('mousedown', function(e){isDragging=true; e.preventDefault();});
$("#main_canvas").on('mouseup', function(){isDragging=false; context.beginPath();});
$("#main_canvas").on('mousemove', draw);

}
