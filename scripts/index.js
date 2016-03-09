//socket io and nickname selection
var socket = io.connect('http://localhost');
socket.on('current_games', function(data) {
//list current server to user
  data.current_games.forEach(function(server, i, arr) {
    var option = "<option>";
    $("#server_list").append(option.concat(server.name));
  });
});


socket.on('update_mouse', function(data) {

});
function createServer() {
//creates a new server creation request
  var server_name = $("#server_name")[0].value;
  socket.emit('create_server', {server_name});

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
