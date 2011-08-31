
/**
* @author peter
* @requires olemap.util
* @requires olemap.util.event
*/

(function( window, undefined ){

/**
* @memberOf olemap.util
* @abstract
* @class
* @name RemainTime
* @property {number} days
* @property {number} hours
* @property {number} minutes
* @property {number} seconds
* @see olemap.util.Timer#getRemainDate
*/



/**
* @exports Timer as olemap.util.Timer
* @class
* @example
	var timer = olemap.util.Timer({
		time:{ ms:5000 },    //total remaining time
		listener:{ms:500}    //every millisecond to trigger "time_changed" event.
	});
*/
var Timer = 
	/**
	* @constructor
	* @param {Object} opts
	* @example
	  {
		time:{
			ms:1500
		},
		listener:{
			ms:1000
		},
		clientTime:false (default:true)
	 }
	*/
	olemap.util.Timer = function( opts ){
	var _this = this;

	if(opts && opts.time && opts.time.ms){
		this._ms = opts.time.ms;
	}

	if(opts && opts.listener && opts.listener.ms){
		this._listenerMs = opts.listener.ms;
	}

	if(opts && typeof opts.clientTime !== "undefined" ){
		this._clientTime = opts.clientTime;
	}

	/**
	* @private
	*/
	var _init = function(){
		olemap.util.event.bindProcessor(_this,"start",function(){
			return null;
		});
		olemap.util.event.bindProcessor(_this,"time_changed",function(){
			return {
				remain_ms:_this.getRemainTime(),
				remain_date:_this.getRemainDate()
			};
		});
		olemap.util.event.bindProcessor(_this,"time_stopped",function(){
			return null;
		});
		_this._setStatus(_this.STOP);
	}
	_init();
}

/**
* @private
*/
Timer.prototype._initTime = function(){
	this._startTime = (new Date()).getTime();

	if(this._clientTime)	
		this._endTime = this._ms + this._startTime;
	else
		this._endTime = this._ms;
};


/**
* @private
* @param {String} status
*/
Timer.prototype._setStatus = function( status ){
	this._status = status;
};

/**
* @type String
*/
Timer.prototype.getStatus = function(){
	return this._status;
};

/**
* @const
* @private
*/
Timer.prototype.START = "start";

/**
* @const
* @private
*/
Timer.prototype.STOP = "stop";

/**
* @description Start to count time.
*/
Timer.prototype.start = function(){
		this._setStatus(this.START);
		this._initTime();
		this._process();
};

/**
* @description Stop to count time.
*/
Timer.prototype.stop = function(){
	clearInterval(this._timeId);
	this._setStatus(this.STOP);
	olemap.util.event.trigger(this,"time_stopped");
};

/**
* @private
*/
Timer.prototype._process = function(){
	var _this = this;
	olemap.util.event.trigger(_this,"start");

	this._timeId = setInterval(function(){
		if( _this.getRemainTime() == 0 ){
			_this.stop();
		}else{
			olemap.util.event.trigger(_this,"time_changed");
		}
	},this._listenerMs);
};

/**
* @description Get total stack time.(ms)
* @type Number
*
*/
Timer.prototype.getRemainTime = function(){

	if( this.getStatus() == this.STOP )
		return this._ms;

	var ms;
	if(this._clientTime)
		ms = this._endTime - (new Date()).getTime();
	else
		ms = this._endTime - ((new Date()).getTime() - this._startTime);

	var result;
	if( ms > 0 ){
		result = ms
	}else
		result = 0;

	return result;
};

/**
* @type olemap.util.RemainTime
*/
Timer.prototype.getRemainDate = function(){
	var time = parseInt(this.getRemainTime()/1000);
	var days = parseInt(time/(3600*24));
	var remainTime = time%(3600*24);
	var hours = parseInt( remainTime /3600 );
		remainTime = remainTime % 3600;
	var minutes = parseInt(remainTime /60);
	var seconds = remainTime = remainTime %60;
	return {
		days:days,
		hours:hours,
		minutes:minutes,
		seconds:seconds
	};
};

})( window, undefined );

