require([
  'module',
  'javascript/capture.js',
  'javascript/sound.js'
], function(module, video, sound){
  $('.play').live('click', function(){
    $('#video')[0].play();
    $(this).removeClass().addClass('shot');
  });
  $('.shot').live('click', function(event){
    video.shoot();
    sound.cameraShot();
    event.stopPropagation();


  });
  var captureSt = null;
  $('.shot').live('mousedown', function(){
    captureSt = setInterval(function(){
      video.shoot();
      sound.cameraShot();
    }, 100);
  });

  $(document).live('mouseup', function(){
    clearInterval(captureSt);
  })

  $('#control').live('dblclick', function(event){
    event.preventDefault();

  });

  $('#device').draggable({ axis: "x" , containment: "parent"});


})
