define(function(require,exports,module){
	var Backbone=require("backbone");
	var ContractModel=require("./contract_model");
	
	var ContractCollection=Backbone.Collection.extend({
		url:"api/emergencycontactperson/query",
		model:ContractModel
	});
	
	module.exports=ContractCollection;
});