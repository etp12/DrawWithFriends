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
  $("#controlBox").append(item);
}

var save = $("#save");
save.click(function() {
  var c = $("#mainCanvas").get(0);
  var img = new Image;

  var a = $("#save");
  a.attr("href", c.toDataURL());
  var filename = "DWF-"+(Math.random().toString(36)+'00000000000000000').slice(2, 12)+".png";
  a.attr("download", filename);
});

$("#nickname").on('keypress', function(e) {
  if(e.keyCode === 13)
    play();
});

var socket = io();
socket.on('currentGames', function(data) {
//list current server to user
console.log(data);
  var len = data.currentGames.length;
  $("#serverList").empty();
  data.currentGames.forEach(function(server, i, arr) {
    var option = "<option>";
    $("#serverList").append(option.concat(server));
  });
  $("#serverList")[0].selectedIndex=(len-1);
});

function createServer() {
  console.log('creating');
  var serverName = $("#createServer")[0].value;
  if(serverName === '')
    $("#errorServerName").css({visibility:"visible"});
  else if(serverName.includes(' '))
    $("#errorServerName").css({visibility:"visible"});
  else
    socket.emit('createServer', {serverName});

}
//displays game and connects to specified server
function play() {
  var serverName = $("#serverList :selected").text();
  var nickname = $("#nickname")[0].value;
  if(nickname === '') {
    $("#errorNickname").css({visibility:"visible"});
  }
  else {
    $("#errorNickname").css({visibility:"hidden"});
    displayGame(nickname, serverName);
  }
}
