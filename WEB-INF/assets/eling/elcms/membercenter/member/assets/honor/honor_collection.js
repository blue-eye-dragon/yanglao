define(function(require,exports,module){
	var Backbone=require("backbone");
	var MemHonorModel=require("./honor_model");
	
	var MemEduCollection=Backbone.Collection.extend({
		url:"api/honorarytitle/query",
		model:MemHonorModel
	});
	
	module.exports=MemEduCollection;
});