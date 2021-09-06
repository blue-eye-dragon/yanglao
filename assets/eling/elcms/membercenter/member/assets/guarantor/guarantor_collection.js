define(function(require,exports,module){
	var Backbone=require("backbone");
	var GuarantorModel=require("./guarantor_model");
	
	var GuarantorCollection=Backbone.Collection.extend({
		url:"api/guarantor/query",
		model:GuarantorModel
	});
	
	module.exports=GuarantorCollection;
});