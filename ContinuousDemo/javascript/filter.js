define(function(){
  Filters = {};
  Filters.getPixels = function(img) {
    var c = this.getCanvas(img.width, img.height);
    var ctx = c.getContext('2d');
    ctx.drawImage(img);
    return ctx.getImageData(0,0,c.width,c.height);
  };
  Filters.getPixelsFromCanvas = function(c){
    var ctx = c.getContext('2d');
    return ctx.getImageData(0,0,c.width, c.height);
  };
  Filters.getCanvas = function(w,h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  };
  Filters.grayscale = function(canvas, args) {
    pixels = this.getPixelsFromCanvas(canvas);
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
      var r = d[i];
      var g = d[i+1];
      var b = d[i+2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      var v = 0.2126*r + 0.7152*g + 0.0722*b;
      d[i] = d[i+1] = d[i+2] = v
    }
    var ctx = canvas.getContext('2d');
    ctx.putImageData(pixels, 0, 0);
    return canvas;
  };
  Filters.brightness = function(canvas, adjustment) {
    adjustment = adjustment || 30;
    pixels = this.getPixelsFromCanvas(canvas);
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
      d[i] += adjustment;
      d[i+1] += adjustment;
      d[i+2] += adjustment;
    }
    var ctx = canvas.getContext('2d');
    ctx.putImageData(pixels, 0, 0);
    return canvas;
  };
  Filters.threshold = function(canvas, threshold) {
    threshold = threshold || 128;
    pixels = this.getPixelsFromCanvas(canvas);
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
      var r = d[i];
      var g = d[i+1];
      var b = d[i+2];
      var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
      d[i] = d[i+1] = d[i+2] = v
    }
    var ctx = canvas.getContext('2d');
    ctx.putImageData(pixels, 0, 0);
    return canvas;
  };
  Filters.tmpCanvas = document.createElement('canvas');
  Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

  Filters.createImageData = function(w,h) {
    return this.tmpCtx.createImageData(w,h);
  };

  Filters.convolute = function(canvas, weights, opaque) {
    pixels = this.getPixelsFromCanvas(canvas);
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side/2);
    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;
    // pad output by the convolution matrix
    var w = sw;
    var h = sh;
    var output = Filters.createImageData(w, h);
    var dst = output.data;
    // go through the destination image pixels
    var alphaFac = opaque ? 1 : 0;
    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y*w+x)*4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        var r=0, g=0, b=0, a=0;
        for (var cy=0; cy<side; cy++) {
          for (var cx=0; cx<side; cx++) {
            var scy = sy + cy - halfSide;
            var scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              var srcOff = (scy*sw+scx)*4;
              var wt = weights[cy*side+cx];
              r += src[srcOff] * wt;
              g += src[srcOff+1] * wt;
              b += src[srcOff+2] * wt;
              a += src[srcOff+3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff+1] = g;
        dst[dstOff+2] = b;
        dst[dstOff+3] = a + alphaFac*(255-a);
      }
    }
    return output;
  };
  Filters.sharpen = function(canvas){
    return this.convolute(canvas,
        [ 0, -1,  0,
         -1,  5, -1,
          0, -1,  0]);
  };
  Filters.blur = function(canvas){
    return this.convolute(canvas,
        [ 1/9, 1/9, 1/9,
            1/9, 1/9, 1/9,
            1/9, 1/9, 1/9 ]);
  };
  /*
  Filters.filterImage(Filters.convolute, image,
    [ 1/9, 1/9, 1/9,
      1/9, 1/9, 1/9,
      1/9, 1/9, 1/9 ]
  );
  */
  return Filters;




})
