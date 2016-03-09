
function play() {
  var nickname = $("#nickname")[0].value;
  if(nickname === '') {
    $("#error_nickname").css({visibility:"visible"});
  }
  else {
    $("#error_nickname").css({visibility:"hidden"});
    display_game(nickname);
  }
}
