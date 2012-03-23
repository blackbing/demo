require([
  'module',
  'javascript/capture.js',
  'javascript/sound.js'
], function(module, video, sound){
  $("#videoWrap").webcam({
        width: 708,
        height: 396,
        mode: "callback",
        swffile: "javascript/jQuery-webcam/jscam_canvas_only.swf",
        onTick: function() {
          console.log('tick', arguments);
        },
        onSave: function(data) {
          previewSize = {
            width: 197*0.3,
            height: 351*0.3
          };
          console.log('save', arguments);
          var canvas = document.createElement('canvas');
          canvas.width  = previewSize.width;
          canvas.height = previewSize.width;
          var col = data.split(";");
          var img = null;
          alert(canvas);

          for(var i = 0; i < 320; i++) {
              var tmp = parseInt(col[i]);
              img.data[pos + 0] = (tmp >> 16) & 0xff;
              img.data[pos + 1] = (tmp >> 8) & 0xff;
              img.data[pos + 2] = tmp & 0xff;
              img.data[pos + 3] = 0xff;
              pos+= 4;
          }
          var ctx = canvas.getContext('2d');
          if (pos >= 4 * 320 * 240) {
              ctx.putImageData(img, 0, 0);
              pos = 0;
          }
          var output = $('#output');
          output.prepend(canvas);

        },
        onCapture: function() {
          console.log('capture', arguments);
          webcam.save();

        },
        debug: function() {
          //console.log('debug', arguments);
          if(arguments[0] === 'notify' && arguments[1] === 'Camera started'){
            $('#decviceWrap').show();
            $('#control').removeClass().addClass('shot');

          }
        },
        onLoad: function() {
          console.log('load', arguments);
        }
});





  $('.shot').live('click', function(event){
    webcam.capture();
    sound.cameraShot();
    event.stopPropagation();


  });
/*
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
*/

})
