define(function(require,exports,module){
	var Backbone=require("backbone");
	var RelativeModel=require("./relative_model");
	
	var MemEduCollection=Backbone.Collection.extend({
		url:"api/relative/query",
		model:RelativeModel
	});
	
	module.exports=MemEduCollection;
});