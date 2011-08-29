
(function(){
    //note: replace your template here, but do not change the html structure, you can modify the basic style, and the image path
    //if you want to use flash, put falsh into BDM_content.
	var template = '<div id="BDM_content" style="position:absolute;left:52px;top:0px;width:448px;height:420px;display:none;">\
			<img src="images/mockup_02.png">\
		</div>\
		<div id="BDM_handler" style="position:absolute;left:0px;top:15px;width:52px;height:390px;background-image:url(images/mockup_03.gif)"></div>';
	var Effect = {
		easeOutExpo : function(t,b,c,d){
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		maxWidth : 500,
		minWidth: 52,
		currentTime:0,
		duration:50,
		interval : null,
		slideOpen : function(){
			//console.log('slideOpen');
			var me = this;
			var originWidth = parseFloat(BDM_toolbar_container.style.width);
			var currentTime = 0;
			var dx = me.maxWidth - parseInt(BDM_toolbar_container.style.width);
			var easeFunction = me.easeOutExpo;
			BDM_content.style.display = 'block';
			clearInterval(me.interval);
			var go = function(){
				var w = parseInt(BDM_toolbar_container.style.width);
				//console.log(w);
				if(w < me.maxWidth){
					BDM_toolbar_container.style.width = Math.ceil(easeFunction(currentTime, originWidth, dx, me.duration)) + "px";
					currentTime+=2;
				}else{
					clearInterval(me.interval);
				}
			};
			
			me.interval = setInterval(go, 30);
		},
		slideClose : function(){
			var me = this;
			var originWidth = parseFloat(BDM_toolbar_container.style.width);
			var currentTime = 0;
			var dx = parseInt(BDM_toolbar_container.style.width)-me.minWidth;
			var easeFunction = me.easeOutExpo;
			BDM_content.style.display = 'block';
			clearInterval(me.interval);
			var go = function(){
				var w = parseInt(BDM_toolbar_container.style.width);
				//console.log(w);
				if(w > me.minWidth){
					BDM_toolbar_container.style.width = Math.ceil(easeFunction(currentTime, originWidth, dx, me.duration)) + "px";
					currentTime-=1;
				}else{	
					BDM_content.style.display = 'none';
					clearInterval(me.interval);
				}
			};
			me.interval = setInterval(go, 30);
		}
	};
	var Event = {
		addEvent : function(obj, type, fn) {
		    if(!obj)
		        return;
		    if(obj.addEventListener)
		        obj.addEventListener(type, fn, false);
		    else if(obj.attachEvent)
		        obj.attachEvent('on'+type, fn);
		    else {
		        obj['on'+type] = fn;
		    }
		    //this.listEvents.push(arguments);
		},
		contains : function( container, maybe ) {
			return container.contains ? container.contains(maybe) :
        	!!(container.compareDocumentPosition(maybe) & 16);
		},
		mouseEnterLeave : function(elem, type, method) {
			var me = this;
			var mouseEnter = type === 'mouseenter',
				ie = mouseEnter ? 'fromElement' : 'toElement',
				method2 = function (e) {
				    e = e || window.event;
				    var related = e.relatedTarget || e[ie];
					if (e.target === elem || !me.contains(elem, related)) {
				        method();
				    }
				};
			type = mouseEnter ? 'mouseover' : 'mouseout';
			me.addEvent(elem, type, method2);
			return method2;
		}
	}
	
	var BDM_toolbar_container = document.createElement("div");
	BDM_toolbar_container.id = 'BDM_toolbar_container';
	BDM_toolbar_container.style.cssText = 'position:absolute;right:0px;top:100px;width:52px;height:420px;z-index:999999;';
	BDM_toolbar_container.innerHTML = template;
	document.body.appendChild(BDM_toolbar_container);
	
	var BDM_handler = document.getElementById('BDM_handler');
	var BDM_content = document.getElementById('BDM_content');
	Event.mouseEnterLeave(BDM_handler, 'mouseenter', function(){
		var originWidth = parseFloat(BDM_toolbar_container.style.width);
			Effect.slideOpen();
	});
	Event.mouseEnterLeave(BDM_toolbar_container, 'mouseleave', function(){
			Effect.slideClose();
	});
	
})()
