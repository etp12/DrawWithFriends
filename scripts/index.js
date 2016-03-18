//socket io and nickname selection
var socket = io();
socket.on('current_games', function(data) {
//list current server to user
  data.current_games.forEach(function(server, i, arr) {
    var option = "<option>";
    $("#server_list").append(option.concat(server.name));
  });
});

function createServer() {
//creates a new server creation request
  var server_name = $("#server_name")[0].value;
  socket.emit('create_server', {server_name});

}

//Source: https://www.firebase.com/tutorial/#session/n3a80mpvpg9
var colors = ["fff","000","f00","0f0","00f","88f","f8d","f88","f05","f80","0f8","cf0","08f","408","ff8","8ff"];
for (c in colors) {
  var item = $("<div/>", {style: "float: top; width: 50px; height: 50px; display: table-cell; border:1px solid black; background-color: #"+colors[c]});
  item.click((function() {
    var col = colors[c];
    return function() {
      currentColor = col;
    };
  })());
  $("#control_box").append(item);
}

//displays game and connects to specified server
function play() {
  var server = $("#server_list")[0].value;
  var nickname = $("#nickname")[0].value;
  if(nickname === '') {
    $("#error_nickname").css({visibility:"visible"});
  }
  else {
    $("#error_nickname").css({visibility:"hidden"});
    display_game(nickname);
  }
}
