define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var GuarantorModel=Backbone.Model.extend({
		idAttribute:"pkGuarantor",
		url:"api/guarantor/query",
		parse:function(model){
			if(model.length==0){
				this.clear();
			}
			return model;
		}
	});
	
	module.exports=GuarantorModel;
});