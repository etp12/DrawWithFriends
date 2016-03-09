var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var player_cursors = [];

//temporary
setTimeout(function() {
  $("#canvas_wrapper").css({visibility:'visible'});
  $("#main_wrapper").css({visibility:'hidden'});
}, 1000);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//TODO: On Connect..
player_cursors[0] = $("<p id='client'> You </p>");
$("#canvas_wrapper").append(player_cursors[0]);
$(document).mousemove(function(e) {
  var left_pos = e.pageX, top_pos = e.pageY-50;
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
    context.lineTo(e.pageX-offsetLeft, e.pageY-offsetTop);
    context.stroke();
    context.beginPath();
    context.arc(e.pageX-offsetLeft, e.pageY-offsetTop, radius, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.moveTo(e.pageX-offsetLeft, e.pageY-offsetTop);
  }
}

$("#main_canvas").on('mousedown', function(e){isDragging=true; e.preventDefault();});
$("#main_canvas").on('mouseup', function(){isDragging=false; context.beginPath();});
$("#main_canvas").on('mousemove', draw);
