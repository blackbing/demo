/*
* Description: 那些年，回到過去特效文字
* Author: blackbing@gmail.com
* Example: $('#year').scrollEffectNumbers({
                initNumber: 2011,
                targetNumber: 1980,
                duration: 3000});
*/
(function($) {
    var CanvasNumber = function(options) {
            var _SELF = this;
            var opts = $.extend({}, {
                //path: './0-9.png',
                path:'./0-9Nova-Mono-cursive.png',
                initNumber: 0,
                targetNumber: 9,
                ease: function(t, b, c, d) {
                    //linearTween
                    return c * t / d + b;
                    //return c*((t=t/d-1)*t*t + 1) + b;
                },
                currentPos: {
                    x: 0,
                    y: 0
                },
                duration: 1000,
                timespan: 30,
                updatedCallback: null
            }, options);
            var getNumberPos = function(num) {
                    num = +num;
                    var w = opts.width;
                    var h = opts.height;
                    var x = 0;
                    return h * (num);
                };
            var drawNumber = function(num) {
                    var MaxNumberDigital = getMaxNumberDigital();
                    var numString = padLeft(num.toString(), '0', MaxNumberDigital);
                    var pos = [];
                    for (var i = 0; i < numString.length; i++) {
                        //console.log(numString.substring(i, 1));
                        var drawY = getNumberPos(numString.substring(i, i + 1));
                        var drawX = opts.width * i;
                        pos.push({x:drawX, y:drawY});
                    }
                    drawNumberByPositions(pos);
                };
            var drawNumberByPositions = function(pos) {
                    ctx.clearRect(0, 0, opts.canvas.width, opts.canvas.height);
                    
                    ctx.save();
                    if(opts.transform){
                        opts.transform(ctx);
                    }
                    var MaxNumberDigital = getMaxNumberDigital();
                    var drawX, drawY;
                    for (var i = 0; i < pos.length; i++) {
                        drawY = pos[i].y;
                        var th = (opts.image.height - opts.height);
                        drawY %= th;
                        drawY = (drawY+th)%th;
                        drawX = opts.width * i;
                        //cut the image and draw on canvas
                        ctx.drawImage(opts.image,  0,drawY,opts.width, opts.height, drawX, 0, opts.width, opts.height);
                    }
                    ctx.restore();
                };
            var getMaxNumberDigital = function() {
                    var MaxNumber = Math.max(opts.initNumber, opts.targetNumber);
                    var MaxNumberDigital = MaxNumber.toString().length;
                    return MaxNumberDigital;
                };
            var $elm = opts.$elm;
            var plineCanvas = document.createElement('canvas');
            var ctx;
            if (!plineCanvas.getContext && typeof G_vmlCanvasManager != 'undefined') {
                plineCanvas = G_vmlCanvasManager.initElement(plineCanvas);
                plineCanvas.width = 0;
                plineCanvas.height = 0;
                plineCanvas.style.display = 'none';
            }
            if (plineCanvas.getContext) {
                ctx = plineCanvas.getContext('2d');
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
            $elm.appendChild(plineCanvas);
            var img09 = new Image();
            var imgLoaded = false;
            img09.onload = function() {
                var MaxNumberDigital = getMaxNumberDigital();
                opts.width = img09.width;
                opts.height = Math.round(img09.height / 11);
                plineCanvas.width = opts.width * MaxNumberDigital;
                plineCanvas.height = opts.height;
                opts.canvas = plineCanvas;
                opts.image = img09;
                //initial to draw the number
                drawNumber(opts.initNumber);
                plineCanvas.style.display = '';
                imgLoaded = true;
                $(opts.$elm).show();
            };
            img09.src = opts.path;
            this.getOption = function() {
                return opts;
            };
            this.updateOption = function(myoptions) {
                opts = $.extend(opts, myoptions);
            };
            this.add = function(num) {
                var targetNumber = opts.initNumber + num;
                this.go({
                    targetNumber: targetNumber
                });
            };
            this.go = function(args) {
                if (!imgLoaded) {
                    var _args = arguments;
                    var _callee = arguments.callee;
                    var _me = this;
                    return setTimeout(function() {
                        _callee.apply(_me, _args);
                    }, 10);
                }
                if (args) {
                    if (args.targetNumber) {
                        opts.targetNumber = args.targetNumber;
                    }
                }
                var canvasNumberStack = [];
                var MaxNumber = Math.max(opts.initNumber, opts.targetNumber);
                var MaxNumberDigital = MaxNumber.toString().length;
                var initNumberString = padLeft(opts.initNumber.toString(), '0', MaxNumberDigital);
                var targetNumberString = padLeft(opts.targetNumber.toString(), '0', MaxNumberDigital);
                for (var i = 0; i < MaxNumberDigital; i++) {
                    var myoptions = {};
                    myoptions.initNumber = parseInt(opts.initNumber.toString().substring(0, i + 1), 10);
                    myoptions.targetNumber = parseInt(opts.targetNumber.toString().substring(0, i + 1), 10);
                    myoptions.initPos = getNumberPos(myoptions.initNumber);
                    myoptions.targetPos = getNumberPos(myoptions.targetNumber);
                    myoptions.delta = myoptions.targetPos - myoptions.initPos;
                    canvasNumberStack.push(myoptions);
                }
                var currentTime = 0;
                var duration = opts.duration;
                var t = +new Date();
                var timespan = opts.timespan;
                //計算個位數的current position
                var finalcurrentNumberPos = canvasNumberStack[canvasNumberStack.length - 1].initPos;
                var finaltargetNumberPos = canvasNumberStack[canvasNumberStack.length - 1].targetPos;
                opts.interval = setInterval(function() {
                    //(function(){
                    var pos = [];
                    //先計算每個位數的位置
                    for (var i = 0; i < canvasNumberStack.length; i++) {
                        var canvasNumberStacki = canvasNumberStack[i];
                        //time, b, c, d
                        var changeY = opts.ease(currentTime, canvasNumberStacki.initPos, canvasNumberStacki.delta, duration);
                        pos.push({
                            x: opts.width * i,
                            y: changeY
                        });
                    }
                    //console.log(finalcurrentNumberPos +'->'+ finaltargetNumberPos);
                    //利用正負取得相交會，判斷是否停止
                    if ((finalcurrentNumberPos - finaltargetNumberPos) * (pos[pos.length - 1].y - finaltargetNumberPos) <= 0) {
                        clearInterval(opts.interval);
                        opts.initNumber = opts.targetNumber;
                        var ct = +new Date();
                    }
                    drawNumberByPositions(pos);
                    currentTime += timespan;
                    finalcurrentNumberPos = pos[pos.length - 1].y;
                    //})()
                }, timespan);
            };
        };

    function padLeft(str, pad, count) {
        while (str.length < count) {
            str = pad + str;
        }
        return str;
    }
    //
    $.fn.scrollEffectNumbers = function(options) {
        this.empty().hide();
        options.$elm = this.get(0);
        var bnumber = new CanvasNumber(options);
        bnumber.go();
    };
})(jQuery);