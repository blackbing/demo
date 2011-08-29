(function( $ ){
    var CanvasNumber = function(options){
        var opts = $.extend({}, {
            path:'./0-9.png',
            initNumber:0,
            targetNumber:9,
            ease: function (t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            }
        }, options);

        var getNumberPos = function(opts, num){
            var w = opts.width;
            var h = opts.height;
            var x = 0;
            return -h*(num);
        };
        var draw = function(ctx, x, y){
            console.log(opts);
            ctx.clearRect(0, 0, opts.canvas.width, opts.canvas.height);
            ctx.drawImage(opts.image, x, y);
            opts.currentPos = {x:x, y:y};
        };
        
        var $elm = opts.$elm;//this.get(0);

        var canvas;// = $('<canvas width="'+opts.width+'" height="'+opts.height+'"/>').appendTo($elm);
        var ctx;// = canvas[0].getContext('2d');
        var img09 = new Image();
        img09.onload = function(){
//            init();
//            console.log('init');
//            console.log(y);

            opts.width = img09.width;
            opts.height = Math.round(img09.height/11);
            var canvas = $('<canvas width="'+opts.width+'" height="'+opts.height+'"/>').appendTo($elm);
            opts.canvas = canvas[0];
            var ctx = canvas[0].getContext('2d');
            var y = getNumberPos(opts, opts.initNumber);
            opts.image = img09;
            draw(ctx, 
                0,
                y
            );
//            ctx.drawImage(img09, 0, y);
        };
        img09.src = opts.path;
        this.opts = opts;
        this.go = function(){
            var me = this;
            var opts = me.opts;
            console.log(opts);
            var y = getNumberPos(opts, opts.initNumber);
            var currentTime = 0;
            var targetNumberPos = getNumberPos(opts, opts.targetNumber);
            var change = targetNumberPos - y;
            var duration = 500;
            console.log(opts);
            opts.interval = setInterval(function(){
//            (function(){
            console.log(opts.currentPos);
                if(opts.currentPos.y > targetNumberPos){
                    var changeY = opts.ease(currentTime, y, change, duration);
                    draw(ctx, 
                        0,
                        changeY
                    );
                    
                    currentTime+=5;
                }else{
                    clearInterval(opts.interval);
                }
//            })();
            }, 10);

        };
    };
    










    //
    $.fn.scrollEffectNumbers = function(options) {
        console.log(this.get(0));
        options.$elm = this.get(0);
        var initNumberDigital = options.initNumber;
        var targetNumberDigital = options.targetNumber;
        return new CanvasNumber(options);
    };
} )( jQuery );

