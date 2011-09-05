//Author: Bingo 
//email: blackbing@gmail.com
//date: 2010/04/28

//$(function(){

	var tetris = new Tetris({
		xblocks: 50,
		yblocks: 25,
		stage: $('#mainCanvas')
	});
	tetris.addEventListener('bottom', function(){
//		console.log('boom');	
		if(mySoundObject)
			mySoundObject.play();
	});
	
	$(document).keydown(function(e){
//		console.log(e.keyCode);
		if(e.keyCode == 40){
			tetris.down();
		}else if(e.keyCode == 37){
			tetris.left();
		}else if(e.keyCode == 39){
			tetris.right();
		}else if(e.keyCode == 38){
			tetris.top();
		}else if(e.keyCode == 27){
			tetris.stop();
		}else if(e.keyCode == 13){
			tetris.play();
		}
//		tetris.left();
	});
	
	tetris.touch = function(mx, my){
		var me = this;
		var status = tetris.getStatus();
		var chkSide = function(sts){
			var shapeX = status.shapeX;
			var shapeY = status.shapeY;
			
		};
	};
	var mySoundObject;
	soundManager.debugMode = false;  
	soundManager.flashVersion = 9;
	soundManager.useHighPerformance = true; // keep flash on screen, boost performance
	soundManager.wmode = 'transparent'; // transparent SWF, if possible
	soundManager.useFastPolling = true; // increased JS callback frequency
	soundManager.url = '';
	soundManager.onready(function(){
		if (soundManager.supported()) {
			// OK, play sound etc.
			mySoundObject = soundManager.createSound({
			 id: 'boom',
			 autoLoad: true,
			 url: 'audio/awp1.mp3',
			 onload: function(){
				//console.log('onload');
				tetris.play();
			 }
			});
			
			
			
		} else {
			// SM2 could not start; message user?
			//console.log('no');
		}
	});
//});
