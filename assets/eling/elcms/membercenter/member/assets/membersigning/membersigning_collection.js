define(function(require,exports,module){
	var Backbone=require("backbone");
	var MemberSigningModel=require("./membersigning_model");
	
	var MemberSigningCollection=Backbone.Collection.extend({
		model: MemberSigningModel,
		url:"api/membersign/querymember"
	});
	
	module.exports=MemberSigningCollection;
});