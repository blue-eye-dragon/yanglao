define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var ImportTaskExecutionNoView = Backbone.Model.extend({
		//模型的主键
		idAttribute : "num",
		
		url : "api/wechatreport/weekstart",
	});

	
	return {
		Model : ImportTaskExecutionNoView,
	};
});