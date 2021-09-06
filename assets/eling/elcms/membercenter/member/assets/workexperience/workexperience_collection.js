define(function(require,exports,module){
	var Backbone=require("backbone");
	var MemWorkModel=require("./workexperience_model");
	
	var MemWorkCollection=Backbone.Collection.extend({
		url:"api/workexperience/query",
		model:MemWorkModel
	});
	
	module.exports=MemWorkCollection;
});