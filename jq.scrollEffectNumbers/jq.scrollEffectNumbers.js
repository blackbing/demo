(function( $ ){
    var CanvasNumber = function(options){
		var _SELF = this;
        var opts = $.extend({}, {
            //path:'./0-9.png',
            path:'./0-9Nova-Mono-cursive.png',
            initNumber:0,
            targetNumber:9,
            ease: function (t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            },
            currentPos:{x:0,y:0},
            duration:1000,
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

        var plineCanvas = document.createElement('canvas');
        if(!plineCanvas.getContext && typeof G_vmlCanvasManager!='undefined'){
            plineCanvas = G_vmlCanvasManager.initElement(plineCanvas);
        }
		$elm.appendChild(plineCanvas);
        var ctx;// = canvas[0].getContext('2d');
        var img09 = new Image();
        var imgLoaded = false;
        img09.onload = function(){

            opts.width = img09.width;
            opts.height = Math.round(img09.height/11);
			plineCanvas.width = opts.width;
			plineCanvas.height = opts.height;
            opts.canvas = plineCanvas;
            ctx = plineCanvas.getContext('2d');
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
        this.add = function(num){
            var targetNumber = opts.initNumber+num;
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
			//console.log(targetNumberPos);
            var duration = opts.duration;
            var t = +new Date();
            var timespan = opts.timespan;
            opts.interval = setInterval(function(){

				//利用絕對值判斷是否可已停止
                //console.log(Math.abs(opts.currentPos.y - targetNumberPos));
                if(Math.abs(opts.currentPos.y - targetNumberPos) > 1){
                    //console.log(Math.abs(opts.currentPos.y - targetNumberPos));
					

                    var changeY = opts.ease(currentTime, y, change, duration);
                    draw(ctx, 
                        0,
                        changeY
                    );
                    //console.log('changeY=' + changeY); 
                    currentTime+=timespan;
                }else{
                    draw(ctx, 
                        0,
                        targetNumberPos 
                    );
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
    /*
     * desc: 多個數字使用這個方法，擴充原本的CanvasNumber
     * */
    function CanvasNumbers(options){
        
        var initNumber = options.initNumber;
        var targetNumber = options.targetNumber;
        var MaxNumber = Math.max(initNumber, targetNumber);
        var MaxNumberDigital = MaxNumber.toString().length;
        var canvasNumberStack = [];
		initNumber = padLeft(initNumber.toString(), '0', MaxNumberDigital);
		targetNumber = padLeft(targetNumber.toString(), '0', MaxNumberDigital);
		//console.log(targetNumber);
        for(var i=0; i<MaxNumberDigital; i++){
            //deep clone
            var myoptions = jQuery.extend(true, {}, options);
			myoptions.initNumber = parseInt(initNumber.toString().substring(0, i+1), 10);
			myoptions.targetNumber = parseInt(targetNumber.toString().substring(0, i+1), 10);
			console.log(myoptions.initNumber + '->' + myoptions.targetNumber );
			var bnumber = new CanvasNumber(myoptions);
			canvasNumberStack.push(bnumber);
			bnumber.go();
        }
        this.initNumber = initNumber;
        this.targetNumber = targetNumber;
        this.go = function(){
            $.each(canvasNumberStack, function(idx, val){
                   val.go(); 
            });
        };
        this.add = function(value){
            $.each(canvasNumberStack, function(idx, val){
                   val.add(value); 
            });
        };
    }






    //
    $.fn.scrollEffectNumbers = function(options) {
        options.$elm = this.get(0);
        new CanvasNumbers(options);
//        var initNumber = options.initNumber;
//        var targetNumber = options.targetNumber;
//        var MaxNumber = Math.max(initNumber, targetNumber);
//        var MaxNumberDigital = MaxNumber.toString().length;
//        var canvasNumberStack = [];
//		initNumber = padLeft(initNumber.toString(), '0', MaxNumberDigital);
//		targetNumber = padLeft(targetNumber.toString(), '0', MaxNumberDigital);
//		//console.log(targetNumber);
//        for(var i=0; i<MaxNumberDigital; i++){
//			//var myoptions = {};
//            //deep clone
//            var myoptions = jQuery.extend(true, {}, options);
//			myoptions.initNumber = parseInt(initNumber.toString().substring(0, i+1), 10);
//			myoptions.targetNumber = parseInt(targetNumber.toString().substring(0, i+1), 10);
//			console.log(myoptions.initNumber + '->' + myoptions.targetNumber );
//			var bnumber = new CanvasNumber(myoptions);
//			canvasNumberStack.push(bnumber);
//			bnumber.go();
////			bnumber.add(3);
////            setTimeout(function(){
////                bnumber.add(-2);
////                    }, 2000);
//        }
        
    };
    function _update_time(CountdownQueue, _timer, _remain_date){
        console.log(arguments);
//
        var h =  _remain_date.remain_date.hours;
        var m =  _remain_date.remain_date.minutes;
        var s =  _remain_date.remain_date.seconds;
        console.log(h+':' +m+':'+s);
        CountdownQueue.seconds.add(-1);
//        CountdownQueue.minutes.add(-1);
//        CountdownQueue.hours.add(-1);
    }
    $.fn.scrollEffectCountdown = function(options){
        var CountdownQueue = {};
        var remaintime = options.remaintime;
        var timer = new olemap.util.Timer({
            time:{ms:remaintime},
            listener:{ms:1000},
            clientTime:false
        });
        
        olemap.util.event.addListener(timer,"time_changed", function(_timer, _remain_date){
                
                _update_time(CountdownQueue, _timer, _remain_date);
        });

        var remainTime = timer.getRemainDate();
        var h = remainTime.hours;
        var m = remainTime.minutes;
        var s = remainTime.seconds;
        console.log(h+':' +m+':'+s);
        var defaultOptions = {
            $elm: this.get(0),
            duration:300,
            ease: function(t, b, c, d){
                return c*t/d + b;
            }
        };
//        var hCountdown = new CanvasNumber($.extend(defaultOptions, {initNumber: h}));
//        CountdownQueue.hours= hCountdown;
//        var mCountdown = new CanvasNumber($.extend(defaultOptions, {initNumber: m}));
//        CountdownQueue.minutes = mCountdown;
//        alert(s);
          var sCountdown = new CanvasNumbers($.extend(defaultOptions, {initNumber: s, targetNumber:s-1}));
//        var sCountdown = this.($.extend(defaultOptions, {initNumber: s, targetNumber:s-1}));
        CountdownQueue.seconds= sCountdown;
        timer.start();
    };
} )( jQuery );

