define(function(require,exports,module){
	var enums = {};
	
	var Enum = {
		init : function(data){
			for(var i=0;i<data.length;i++){
				var key = data[i].type;
				enums[key] = data[i].values;
			}
			Enum = $.extend(true,Enum,enums);
		}
	};
	
	module.exports = Enum;
});