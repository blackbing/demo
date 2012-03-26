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
  $('.shot').on('mousedown touchstart', function(){
    captureSt = setInterval(function(){
      video.shoot();
      sound.cameraShot();
    }, 100);
  });

  $(document).on('mouseup touchend', function(){
    clearInterval(captureSt);
  })

  $('#control').on('dblclick', function(event){
    event.preventDefault();

  });

  $('#device').draggable({ axis: "x" , containment: "parent"});


})
