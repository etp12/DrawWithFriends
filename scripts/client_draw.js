//client-sided draw logic

var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var player_cursors = [];
var client_name = "YOU";
//temporary
function display_game(nickname) {
  client_name = nickname;
  $("#canvas_wrapper").css({visibility:'visible'});
  $("#main_wrapper").css({visibility:'hidden'});


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//TODO: On Connect..
player_cursors[0] = $("<p id='client'>" + client_name + " </p>");


$("#canvas_wrapper").append(player_cursors[0]);
$(document).mousemove(function(e) {
  var left_pos = e.clientX, top_pos = e.clientY-50;
  $('#client').css({left:left_pos, top:top_pos, position:'absolute'});
});

//draw logic, will change when server set up
var offsetTop = $("#canvas_wrapper")[0].offsetTop;
var offsetLeft = $("#canvas_wrapper")[0].offsetLeft;
var radius = 10;
var isDragging = false;
context.lineWidth = radius*2;
function draw(e) {
  if(isDragging) {
    context.lineTo(e.clientX-offsetLeft, e.clientY-offsetTop);
    context.stroke();
    context.beginPath();
    context.arc(e.clientX-offsetLeft, e.clientY-offsetTop, radius, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.moveTo(e.clientX-offsetLeft, e.clientY-offsetTop);
  }
}

$("#main_canvas").on('mousedown', function(e){isDragging=true; e.preventDefault();});
$("#main_canvas").on('mouseup', function(){isDragging=false; context.beginPath();});
$("#main_canvas").on('mousemove', draw);
}
