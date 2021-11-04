define(function(require,exports,module){
	var Backbone = require("backbone");
	
	
	var ImportTaskExecutionView = Backbone.Model.extend({
		idAttribute : "pkWorkTaskPlan"
	});
	
	var ImportTaskExecutionViews = Backbone.Collection.extend({
		model : ImportTaskExecutionView,
		url : "api/wechatreport/taskexecutionimport",
	});
	
	return {
		Model : ImportTaskExecutionView,
		Collection : ImportTaskExecutionViews
	};
});