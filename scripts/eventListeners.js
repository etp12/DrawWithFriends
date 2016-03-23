var eventListen = function() {
  //onresize save the canvas and redraw after resize is finished
  $(window).resize(function() {
    var saveImg = canvas.toDataURL();
    var tempImg = new Image;
    tempImg.src = saveImg;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      doneResizing(tempImg);
    }, 500);
  });

  //press H to clear screen
  $(document).keypress(function(e){ if(e.charCode === 104) socket.emit('clearScreen');});

  //press G to switch draw styles
  $(document).keypress(function(e){ if(e.charCode === 103) smoothLines = !smoothLines; $("#smooth").attr('checked', smoothLines);});

  //tell the server we're moving our mouse
  $(document).mousemove(function(e) {
    var rect = canvas.getBoundingClientRect();
    var leftPos = e.clientX-rect.left, topPos = e.clientY-rect.top;
    socket.emit('mousemove', {clientName, leftPos, topPos});
  });

  //if our mouse is down we can draw
  $("#mainCanvas").on('mousedown', function(e){isDragging=true; e.preventDefault();});

  //when our mouse comes up we aren't drawing anymore
  $("#mainCanvas").on('mouseup', function(){isDragging=false; context.beginPath();});

  //check if we're moving the mouse
  $("#mainCanvas").on('mousemove', draw);
};
