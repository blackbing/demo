//Author: Bingo 
//email: blackbing@gmail.com
//date: 2010/04/28

//$(function(){

	var tetris = new Tetris({
		xblocks: 16,
		yblocks: 25,
		stage: $('#mainCanvas')
	});
	tetris.play();
	
	$('body').keydown(function(e){
		//console.log(e.keyCode);
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
    $('#speedup').click(function(){
        var ts = tetris.playSetTime;
        ts-=50;
        tetris.play(ts);
    });
	
	tetris.touch = function(mx, my){
		var me = this;
		var status = tetris.getStatus();
		var chkSide = function(sts){
			var shapeX = status.shapeX;
			var shapeY = status.shapeY;
			
		};
	};
//});
