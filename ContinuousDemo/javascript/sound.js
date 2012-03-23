define(function(){
  var Sound = {
    cameraShot: function(){
      //soundManager.createSound('camera-click', 'sound/camera-click.mp3').play();
      soundManager.createSound('camera-click', 'sound/camera_click.ogg').play();

    }
  };
  return Sound;
})
