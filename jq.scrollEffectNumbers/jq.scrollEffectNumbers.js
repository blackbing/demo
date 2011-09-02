/*
* 那些年，回到過去特效文字
* author: blackbing@gmail.com
*/

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
            timespan:30,
            updatedCallback:null
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
        var ctx;// = canvas[0].getContext('2d');
        if(!plineCanvas.getContext && typeof G_vmlCanvasManager!='undefined'){
            plineCanvas = G_vmlCanvasManager.initElement(plineCanvas);
			plineCanvas.width = 0;
			plineCanvas.height = 0;
            plineCanvas.style.display = 'none';
        }
		if(plineCanvas.getContext) {
		  ctx = plineCanvas.getContext('2d');
		  ctx.lineCap = 'round';
		  ctx.lineJoin = 'round';
		}
		$elm.appendChild(plineCanvas);
        var img09 = new Image();
        var imgLoaded = false;
        img09.onload = function(){

            opts.width = img09.width;
            opts.height = Math.round(img09.height/11);
			plineCanvas.width = opts.width;
			plineCanvas.height = opts.height;
            opts.canvas = plineCanvas;
            //ctx = plineCanvas.getContext('2d');
			//console.log(ctx);
            var y = getNumberPos(opts, opts.initNumber);
            opts.image = img09;
            draw(ctx, 
                0,
                y
            );
            plineCanvas.style.display = '';
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
			//console.log('go');
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

                var changeY = opts.ease(currentTime, y, change, duration);
				//利用正負取得相交會
                if( (opts.currentPos.y -targetNumberPos)*(changeY - targetNumberPos) <= 0 ){
                    draw(ctx, 
                        0,
                        targetNumberPos 
                    );
                    clearInterval(opts.interval);
                    opts.initNumber = opts.targetNumber;
                    var ct = +new Date();
                }else{
                    draw(ctx, 
                        0,
                        changeY
                    );
                    currentTime+=timespan;

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
        var me = this;
        var initNumber = options.initNumber;
        var targetNumber = options.targetNumber;
        var canvasNumberStack = [];
		//console.log(targetNumber);
        this.initNumber = initNumber;
        this.targetNumber = targetNumber;
        this.go = function(){
            var me = this;
            var MaxNumber = Math.max(initNumber, targetNumber);
            var MaxNumberDigital = MaxNumber.toString().length;
		    initNumber = padLeft(initNumber.toString(), '0', MaxNumberDigital);
		    targetNumber = padLeft(targetNumber.toString(), '0', MaxNumberDigital);
            for(var i=0; i<MaxNumberDigital; i++){
                //deep clone
                var myoptions = jQuery.extend(true, {}, options);
                myoptions.initNumber = parseInt(me.initNumber.toString().substring(0, i+1), 10);
                myoptions.targetNumber = parseInt(me.targetNumber.toString().substring(0, i+1), 10);
                canvasNumberStack[i].updateOption(myoptions);
                canvasNumberStack[i].go();
            }
            me.initNumber = me.targetNumber;
        };
        this.add = function(value){
            this.targetNumber = this.initNumber+value;
            this.go();
        };
        (function(){
            var MaxNumber = Math.max(me.initNumber, me.targetNumber);
            var MaxNumberDigital = MaxNumber.toString().length;
		    var initNumber = padLeft(me.initNumber.toString(), '0', MaxNumberDigital);
		    var targetNumber = padLeft(me.targetNumber.toString(), '0', MaxNumberDigital);
            for(var i=0; i<MaxNumberDigital; i++){
                //deep clone
                var myoptions = jQuery.extend(true, {}, options);
                myoptions.initNumber = parseInt(initNumber.toString().substring(0, i+1), 10);
                myoptions.targetNumber = parseInt(targetNumber.toString().substring(0, i+1), 10);
                var bnumber = new CanvasNumber(myoptions);
                canvasNumberStack.push(bnumber);
                bnumber.go();
            }
            //$(options.$elm).show();
            this.initNumber = this.targetNumber;
         
//            this.go();
        })();
    }






    //
    $.fn.scrollEffectNumbers = function(options) {
		this.empty();//.hide();
        options.$elm = this.get(0);
        new CanvasNumbers(options);
        
    };
} )( jQuery );

