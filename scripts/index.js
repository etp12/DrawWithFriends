//socket io and nickname selection
var socket = io.connect('http://localhost:3000');
socket.on('current_games', function(data) {
//list current server to user
  data.forEach(function(d) {
    //add to a drop down
  });
});

function createServer() {
//creates a new server creation request
socket.emit('create_server', {$("#server_name")[0].value});

}

//displays game and connects to specified server
function play(server) {
  var nickname = $("#nickname")[0].value;
  if(nickname === '') {
    $("#error_nickname").css({visibility:"visible"});
  }
  else {
    $("#error_nickname").css({visibility:"hidden"});
    display_game(nickname);
  }
}
