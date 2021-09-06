define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var ActionSize = Backbone.Model.extend({
		//模型的主键
		idAttribute : "count",
		
		url : "api/pendingconfirm/querylength",
	});

	
	return {
		Model : ActionSize,
	};
});