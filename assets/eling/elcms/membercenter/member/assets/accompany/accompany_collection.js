define(function(require,exports,module){
	var Backbone=require("backbone");
	var AccompanyModel=require("./accompany_model");
	
	var MemEduCollection=Backbone.Collection.extend({
		url:"api/accompanyperson/query",
		model:AccompanyModel
	});
	
	module.exports=MemEduCollection;
});