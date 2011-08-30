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
            currentDrawPos:{x:0,y:0},
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
//			if(Math.abs(drawY)> opts.canvas.height){
				drawY%=(opts.image.height-opts.height);
//			}
//			console.log('drawY='+drawY);
            ctx.drawImage(opts.image, drawX, drawY);
            if(opts.currentDrawPos){
                var deltaY = Math.abs(Math.abs(opts.currentDrawPos.y) - Math.abs(drawY));
//                console.log('deltay:'+deltaY);
                console.log(drawY + '-' + opts.currentDrawPos.y + '=' + deltaY);
                //如果deltaY > 圖片的一半，代表進位
                if(deltaY > opts.image.height/2){
//                    console.log('進位');
                    if(opts.carryOnCallback){
                        opts.carryOnCallback();
                    }
                }
            }
            opts.currentDrawPos = {x:drawX, y:drawY};
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
//            var canvas = $('<canvas width="'+opts.width+'" height="'+opts.height+'"/>').appendTo($elm);
            canvas.attr('width', opts.width);
            canvas.attr('height',opts.height);
//            alert(0);
            opts.canvas = canvas[0];
            ctx = canvas[0].getContext('2d');
            var y = getNumberPos(opts, opts.initNumber);
            opts.image = img09;
            draw(ctx, 
                0,
                y
            );
//            ctx.drawImage(img09, 0, y);
//			_SELF.go();
			imgLoaded = true;
        };
        img09.src = opts.path;
        this.getOption = function(){
            return opts;
        };
        this.updateOption = function(myoptions){

            opts = $.extend(opts, myoptions);
//            console.log(opts);
        };
        this.add1 = function(){
            console.log('add1');
            var targetNumber = opts.initNumber+1;
            opts.duration = 500;
            console.log('targetNumber' + targetNumber);
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
			//console.log('targetNumberPos = ' + targetNumberPos);
            var change = targetNumberPos - y;
            var duration = opts.duration;
            var t = +new Date();
            var timespan = opts.timespan;
            opts.interval = setInterval(function(){
				//console.log(opts.currentPos.y);
				if(opts.currentPos.y - opts.height < targetNumberPos){
					//opts.currentPos.y = 0;
				}
                if(opts.currentPos.y > targetNumberPos){
                    //var changeY = opts.ease(currentTime, y, change, duration);
                    var changeY = opts.ease(currentTime, y, change, duration);
//                    var deltaY = Math.abs(changeY-opts.currentPos.y);
//                    console.log('deltaY:' + deltaY);
//                    console.log(changeY);
                    draw(ctx, 
                        0,
                        changeY
                    );
                    
                    currentTime+=timespan;
                }else{
                    clearInterval(opts.interval);
                    opts.initNumber = opts.targetNumber;
                    var ct = +new Date();
                    console.log('t=' + (ct-t));
                }
            }, timespan);

        };
    };
    










    //
    $.fn.scrollEffectNumbers = function(options) {
        options.$elm = this.get(0);
        var initNumber = options.initNumber;
        var targetNumber = options.targetNumber;
        var MaxNumber = Math.max(initNumber, targetNumber);
        var MaxNumberDigital = MaxNumber.toString().length;
//        console.log('MaxNumberDigital:' + MaxNumberDigital);
//        console.log(MaxNumber);
        var canvasNumberStack = [];
        for(var i=0; i<MaxNumberDigital; i++){
            //var num = initNumber.toString().charAt(MaxNumberDigital-i-1) || 0;
            var num = parseInt(initNumber.toString().charAt(i),10) || 0;
//            console.log(num);
            if(i==MaxNumberDigital-1){
                var cnumber = new CanvasNumber(options);
                canvasNumberStack.push(cnumber);
            }else{
                var myoptions = {};
                myoptions.$elm = this.get(0);
                myoptions.initNumber = num;
                myoptions.targetNumber = num + 1;
                console.log(myoptions);
                var bnumber = new CanvasNumber(myoptions);
                canvasNumberStack.push(bnumber);
                
            }
        }
        for(var j=canvasNumberStack.length-1; j>=0; j--){
            if(j===canvasNumberStack.length-1){
                var extOptions = {
                    carryOnCallback : function(){
                    console.log('進位');
//                        console.log(canvasNumberStack[j-1]);
//                        var currentOpts = canvasNumberStack[0].getOption();
//                        alert(currentOpts.targetNumber);
//                        canvasNumberStack[0].updateOption({
//                            targetNumber: currentOpts.targetNumber++
//                        });
                        canvasNumberStack[0].add1();
                    }
                };
                canvasNumberStack[j].updateOption(extOptions);
                canvasNumberStack[j].go();
//                canvasNumberStack[j].add1();
            }
        }
//        console.log(canvasNumberStack);

//        canvasNumberStack[].go();


//        while(MaxNumber>1){
//            var number = Math.floor(MaxNumber%10); 
//            var cnumber = new CanvasNumber(options);
//            console.log(number);
//            canvasNumberStack.push(cnumber);
//            MaxNumber/=10;
//        }
    };
} )( jQuery );

