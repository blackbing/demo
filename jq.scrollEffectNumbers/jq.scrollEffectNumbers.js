(function( $ ){
    var CanvasNumber = function(options){
		var _SELF = this;
        var opts = $.extend({}, {
            path:'./0-9.png',
            initNumber:0,
            targetNumber:9,
            ease: function (t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            },
            currentPos:{x:0,y:0},
            duration:3000,
            timespan:30
        }, options);

        var getNumberPos = function(opts, num){
            var w = opts.width;
            var h = opts.height;
            var x = 0;
            return -h*(num);
        };
        var draw = function(ctx, x, y){
            ctx.clearRect(0, 0, opts.canvas.width, opts.canvas.height);
			var drawX = x;
			var drawY = y;

			drawY%=(opts.image.height-opts.height);

            ctx.drawImage(opts.image, drawX, drawY);
            opts.currentPos = {x:x, y:y};
        };
        
        var $elm = opts.$elm;//this.get(0);

        var canvas = $('<canvas/>').appendTo($elm);
        var ctx;// = canvas[0].getContext('2d');
        var img09 = new Image();
        var imgLoaded = false;
        img09.onload = function(){

            opts.width = img09.width;
            opts.height = Math.round(img09.height/11);
            canvas.attr('width', opts.width);
            canvas.attr('height',opts.height);
            opts.canvas = canvas[0];
            ctx = canvas[0].getContext('2d');
            var y = getNumberPos(opts, opts.initNumber);
            opts.image = img09;
            draw(ctx, 
                0,
                y
            );
			imgLoaded = true;
        };
        img09.src = opts.path;
        this.getOption = function(){
            return opts;
        };
        this.updateOption = function(myoptions){

            opts = $.extend(opts, myoptions);
        };
        this.add1 = function(){
            var targetNumber = opts.initNumber+1;
            opts.duration = 500;
            this.go({targetNumber:targetNumber});
        };
        this.go = function(args){
            if(!imgLoaded){
                var _args = arguments;
                var _callee = arguments.callee;
                var _me = this;
                return setTimeout(function(){
                     _callee.apply(_me, _args);   
                        }, 10);
            }
            if(args){
                if(args.targetNumber){
                    opts.targetNumber = args.targetNumber;
                }
            }
            var y = getNumberPos(opts, opts.initNumber);
            var currentTime = 0;
            var targetNumberPos = getNumberPos(opts, opts.targetNumber);
            var change = targetNumberPos - y;
			//console.log(change);
            var duration = opts.duration;
            var t = +new Date();
            var timespan = opts.timespan;
            opts.interval = setInterval(function(){

				//利用絕對值判斷是否可已停止
                if(Math.abs(opts.currentPos.y - targetNumberPos) > 0){
                    //console.log(Math.abs(opts.currentPos.y - targetNumberPos));
					

                    var changeY = opts.ease(currentTime, y, change, duration);
                    draw(ctx, 
                        0,
                        changeY
                    );
                    
                    currentTime+=timespan;
                }else{
                    clearInterval(opts.interval);
                    opts.initNumber = opts.targetNumber;
                    var ct = +new Date();

                }
            }, timespan);

        };
    };
    
	function padLeft(str, pad, count) {
		while(str.length<count){
			str=pad+str;
		}
		return str;
	}








    //
    $.fn.scrollEffectNumbers = function(options) {
        options.$elm = this.get(0);
        var initNumber = options.initNumber;
        var targetNumber = options.targetNumber;
        var MaxNumber = Math.max(initNumber, targetNumber);
        var MaxNumberDigital = MaxNumber.toString().length;
        var canvasNumberStack = [];
		initNumber = padLeft(initNumber.toString(), '0', MaxNumberDigital);
		targetNumber = padLeft(targetNumber.toString(), '0', MaxNumberDigital);
		console.log(targetNumber);
        for(var i=0; i<MaxNumberDigital; i++){
			var myoptions = {};
			myoptions.$elm = this.get(0);
			myoptions.initNumber = parseInt(initNumber.toString().substring(0, i+1), 10);
			myoptions.targetNumber = parseInt(targetNumber.toString().substring(0, i+1), 10);
			//console.log(myoptions.initNumber + '->' + myoptions.targetNumber );
			var bnumber = new CanvasNumber(myoptions);
			canvasNumberStack.push(bnumber);
			bnumber.go();
        }
    };
} )( jQuery );

