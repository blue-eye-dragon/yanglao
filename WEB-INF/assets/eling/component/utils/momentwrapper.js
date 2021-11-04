define(function(require,exports,module){
	var moment = require("moment");
	var store = require("store");
	
	
	var momentwrapper = function(input, format, locale, strict){
		 input = input ? input : (input === undefined ? moment().valueOf() - (store.get("time-diffrence") || 0) : "");
		 return new moment(input, format, locale, strict);
	}
	
	//扩展所有moment的静态方法（就是可以直接调用moment.xxx的方法）
	for(var i in moment){
		momentwrapper[i] = moment[i];
	}
	
	module.exports = momentwrapper;
});