define([
  'javascript/filter.js'
],function(Filter){
  var video = {
    videoId : 'video',
    previewSize:{
      width: 197*0.3,
      height: 351*0.3
    },

    capture: function() {
      var $video = $(this.videoId);
      var video = $video[0];
      var $device = $('#device');
      var scaleFactor =  video.videoWidth/$video.width()

      var canvas = document.createElement('canvas');
      canvas.width  = this.previewSize.width;
      canvas.height = this.previewSize.height;
      var ctx = canvas.getContext('2d');
//      var sX = (($video.width()-$device.width())/2 + 22)*scaleFactor;
      var sX = ($('#device').position().left+ 22)*scaleFactor;
      var sY = 29*scaleFactor;
      var sWidth = 197*scaleFactor;
      var sHeight = 351*scaleFactor;

      ctx.drawImage(video, sX, sY, sWidth, sHeight,
          0,0, this.previewSize.width,this.previewSize.height);
      //ctx.drawImage(video, sX, sY, $device.width(), $device.height());
      return canvas;
    },


    /**
     * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
     */
    shoot: function(){
        scaleFactor = this.scaleFactor;
        var video  = $(this.videoId)[0];
        var output = $('#output');
        var canvas = this.capture(video, scaleFactor);
        $filter = $('input[name="filter"]:checked');
        if($filter.val()){
          Filter[$filter.val()](canvas);
        }
        //console.log(canvas.toDataURL());

        output.prepend(canvas);
    }
  }
  return video;

})
