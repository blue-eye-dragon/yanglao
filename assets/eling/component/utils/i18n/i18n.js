define(function(require,exports,module){
	
	var i18ns = {};
	
	module.exports = {
			
		init : function(data){
			for(var i in data){
				var code = data[i].code;
				i18ns[code] = data[i].display;
			}
		},
			
		get : function(code,defaultValue){
			if(defaultValue === undefined || defaultValue === null){
				throw "get方法必须传递两个参数。第一个参数为多语code，第二个参数为默认值。";
			}
			
			var value = i18ns[code];
			
			if(value === undefined || value === null){
				
				return defaultValue;
			}else{
				
				return value;
			}
		}
		
	};
});