define(function(require,exports,module){
	var Backbone=require("backbone");
	var MemEduModel=require("./education_model");
	
	var MemEduCollection=Backbone.Collection.extend({
		url:"api/education/query",
		model:MemEduModel
	});
	
	module.exports=MemEduCollection;
});