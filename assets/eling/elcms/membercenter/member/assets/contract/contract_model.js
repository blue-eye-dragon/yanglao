define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var ContractModel=Backbone.Model.extend({
		idAttribute:"pkEmergencyContactPerson"
	});
	
	module.exports=ContractModel;
});