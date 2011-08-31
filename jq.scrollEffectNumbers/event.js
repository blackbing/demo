/**
* @author peter
* @requires olemap.util
*/

(function( window, undefined ){

/**
* @namespace
*/
olemap.util.event = {};

/**
* @exports Event as olemap.util.event
* @class
* @constructor
*/
function Event(){
	this._listeners = [];
}

/**
* @param {Object} instance
* @param {String} eventType
* @param {function} callback
* @param {Object} opts
*/
Event.prototype.addListener = function( instance, eventType, callback, opts ){
	if( !instance.__event__ ){
		instance.__event__ = {};
		this._listeners.push(instance);
	}

	if( !instance.__event__[eventType] )
		instance.__event__[eventType] = [];
	
	var once = opts && typeof opts.once !=="undefined" ? opts.once : false;
	instance.__event__[eventType].push({func:callback,once:once});
};

/**
* @param {Object} instance
* @param {String} eventType
* @param {function} callback
*/
Event.prototype.removeListener = function( instance, eventType, callback ){
	if( instance.__event__ ){
		var objs = instance.__event__[eventType];
		for(var i in objs){
			if( objs[i].func == callback ){
				objs.splice(i,1);
				break;
			}
		}
	}
};

/**
* @param {Object} instance
* @param {String} eventType
* @param {function} callback
*/
Event.prototype.addListenerOnce = function( instance, eventType, callback ){

	this.addListener( instance, eventType, callback, {once:true});
};

/**
* @param {Object} instance
* @param {String} eventType
* @param {*[]} args
*/
Event.prototype.trigger = function( instance, eventType, args ){
//	if( instance.__processor__ && instance.__processor__[eventType] ){
		/**
		* get listnener params.
		*/
		var params;
		if( instance.__processor__ && instance.__processor__[eventType] ){
			/**
			* IE will throw error when args is undefined.
			*/
			if( typeof args !== "undefined" )
				params = instance.__processor__[eventType].apply(instance,args);
			else
				params = instance.__processor__[eventType].apply(instance);
		}else
			params = args;
		/**
		* trigger listnener
		*/
		if( typeof instance.__event__ === "object" )
		for(var i in instance.__event__[eventType]){
			var func = instance.__event__[eventType][i].func;
			func.apply( null, [{type:eventType,instance:instance}].concat(params) );

			/**
			* If function add listener by "addListenerOnce",it will remove.
			*/
			if(instance.__event__[eventType][i].once)
				this.removeListener( instance, eventType, func );
		}
//	}
};

/**
* @param {Object} instance
* @param {String} eventType
* @param {function} func
*/
Event.prototype.bindProcessor = function( instance, eventType, func ){
	if( !instance.__processor__ ){
		instance.__processor__ = {};
	}

	instance.__processor__[eventType] = func;
};

window.olemap.util.event = new Event();

})( window, undefined );

