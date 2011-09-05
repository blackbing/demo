//Author: Bingo 
//email: blackbing@gmail.com
//date: 2010/04/28

function Tetris(opts){
	var _self = this;
	var blockWidth = 16;
	var blockXCount = opts.xblocks || 16;
	var blockYCount = opts.yblocks || 40;
	var stageWidth = blockWidth * blockXCount;
	var stageHeight = blockWidth * blockYCount;
	var stageElm = opts.stage;
	var metrix = [];
	var createBlock = _self.createBlock;
	var status = {
		shape:null,
		shapeX:0,
		shapeY:0,
		stacked:false
	};
	var getStatus = function(){
		return status;
	};
	
	var blockStructure = function(){
		this.fill = false;
		this.stacked = false;
		this.color = '';		
	};
	var getBolck = function(x, y){
		return metrix[y*x + x];
	};
	this.blockXCount = blockXCount;
	this.blockYCount = blockYCount;
	this.getMetrix = function(){
		return metrix;
	};
	this.stageElm = stageElm;
	this.setTs = null;
    this.playSetTime = 500;
	this.getStatus = getStatus;
	var init = (function(){
		var stageHTML = [];
		for(var i =0; i< blockYCount; i++){
			for(var j =0; j< blockXCount; j++){
				stageHTML.push(createBlock());
				metrix.push(new blockStructure());
			}
			
		}
		stageElm.html(stageHTML.join(''));
		stageElm.width(stageWidth);
		stageElm.height(stageHeight);
		_self.draw();
	})();
}
Tetris.prototype.createBlock = function(color){
	color = color || '';
	return '<div class="grid '+color+'"></div>';
};
Tetris.prototype.getShape = (function(){
	var shape = [
		[[1,1], [1,1]],
		[[0,1,1], [1,1,0]],
		[[0,0,1], [1,1,1]],
		[[1,1,1,1,1]],
		[[1,0], [1,0], [1,1]],
	];
	return function(){
		var rand = Math.floor(Math.random()*shape.length);
		return shape[rand];
	};
})();
Tetris.prototype.setShape = function(shape, x, y){
	var _self = this;
	var metrix = _self.getMetrix();
	var metrixLen = metrix.length;
	var blockXCount = _self.blockXCount;
	var blockYCount = _self.blockYCount;
	//var startX = x
	//var startY = y;
	var status = _self.getStatus();


	
	var collision = _self.chkCollision(x, y);
	var chkStacked = _self.chkStacked(x, y);
	//collision dectection
	if(collision){
		if(chkStacked){
			status.stacked = true;
			return;
		}else{
		
			return;
		}
	}else{
		if(chkStacked){
			//check if it can be down
			var chkStackedDown = _self.chkStacked(status.shapeX, status.shapeY+1);
			if(chkStackedDown){
				status.stacked = true;
				return;
			}else{
				return;
			}
		}
	}
	//save status;
	status.shapeX = x;
	status.shapeY = y;
	status.shape = shape;

};
Tetris.prototype.clear = function(){
	var _self = this;
	var metrix = _self.getMetrix();
	var metrixLen = metrix.length;
	for(var i=0; i< metrixLen; i++){
		if(!metrix[i].stacked){
			metrix[i].fill = false;
			metrix[i].color = '';
		}else{
			metrix[i].fill = true;
			metrix[i].color = 'grey';
		}
	}
};
Tetris.prototype.refresh = function(){
	var _self = this;
	var status = _self.getStatus();
	_self.clear();
	_self.setShape(status.shape, status.shapeX, status.shapeY);
	_self.draw();
};
Tetris.prototype.draw = function(){
	var _self = this;
	var metrix = _self.getMetrix();
	var metrixLen = metrix.length;
	var blockXCount = _self.blockXCount;
	var blockYCount = _self.blockYCount;
	var status = _self.getStatus();
	//if shape is empty, get a shape and set the position
	if(!status.shape){
		var shape = _self.getShape();
		//get the center;
		var startX = Math.floor(blockXCount/2-shape.length/2);
		var startY = 0;
		_self.setShape(shape, startX, startY);
		
	}
	var shape = status.shape;
	for(var i=0; i<shape.length; i++){
		for(var j=0; j<shape[i].length; j++){
			if(shape[i][j]){
				var idx = status.shapeX + j + ((i+status.shapeY)*blockXCount);
				if(status.stacked){
					metrix[idx].color = 'grey';
					metrix[idx].stacked = true;
				}
				if(!metrix[idx].stacked){
					metrix[idx].color = 'blue';
					metrix[idx].fill = true;
				}
			}
		}
	}
	if(status.stacked){
		status.shape = null;
		status.stacked = false;
	}
	var stageHTML = [];
    var stop = false;
	for(var i =0 ; i<metrixLen; i++){
		stageHTML.push(_self.createBlock(metrix[i].color));
        var ycount = Math.floor(i/_self.blockXCount);
        if(ycount === 0 && metrix[i].stacked){
            stop = true;
        }
	}
    if(stop){
        clearInterval(_self.setTs);
    }
	_self.stageElm.html(stageHTML.join(''));
};
Tetris.prototype.chkCollision = function(expectX, expectY){
	var _self = this;
	var status = _self.getStatus();
	if(!status.shape)
		return;
	var collision = false;
	//checking bounding box
	if(expectX<0 || expectX > _self.blockXCount - status.shape[0].length){
		collision =  true;
	}
	if(expectY <0 || expectY > (_self.blockYCount - status.shape.length)){
		collision = true;
	}
	return collision;
};
Tetris.prototype.chkStacked = function(expectX, expectY){
	var _self = this;
	var status = _self.getStatus();
	var blockXCount = _self.blockXCount;
	var metrix = _self.getMetrix();
	if(!status.shape)
		return;
	var stacked = false;
	//checking bounding box
	if(expectY > (_self.blockYCount - status.shape.length)){
		stacked = true;
		return stacked;
	}
	//checking collision with stacked
	var shape = status.shape;
	for(var i=0; i<shape.length; i++){
		for(var j=0; j<shape[i].length; j++){
			if(shape[i][j]){
				var idx = expectX + j + ((i+expectY)*blockXCount);
				if(metrix[idx].stacked){
					stacked = true;
					break;
				}
			}
		}
	}
	return stacked;
};
Tetris.prototype.stop = function(){
	var _self = this;
	if(_self.setTs){
		clearInterval(_self.setTs);
	}

};
Tetris.prototype.play = function(ts){
	var _self = this;
	_self.stop();
    if(!isNaN(ts)){
        _self.playSetTime = ts<10?10:ts;
    }
	_self.setTs = setInterval(function(){
		_self.down();
	}, _self.playSetTime);
};
Tetris.prototype.move = function(deltaX, deltaY){
	var _self = this;
	var status = _self.getStatus();
	var expectX = status.shapeX+deltaX;
	var expectY = status.shapeY+deltaY;
	_self.setShape(status.shape, expectX, expectY);
	_self.refresh();

	
};
Tetris.prototype.change = function(){
	var _self = this;
	var status = _self.getStatus();
	var shape = status.shape;
	if(!shape)
		return;
	var transShape = [];
	for(var i=0; i<shape[0].length; i++){
		transShape.push([]);
		for(var j=0; j<shape.length; j++){
			transShape[i][j] = shape[shape.length-j-1][i];
		}
	}
	status.shape = transShape;
	_self.refresh();
};
Tetris.prototype.top = function(){
	var _self = this;
	_self.change();
};
Tetris.prototype.down = function(){
	var _self = this;
	_self.move(0, 1);
};
Tetris.prototype.left = function(){
	var _self = this;
	_self.move(-1, 0);
};
Tetris.prototype.right = function(){
	var _self = this;
	_self.move(1, 0);
	
};
