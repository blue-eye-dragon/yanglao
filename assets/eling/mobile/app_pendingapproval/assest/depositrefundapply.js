define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var DepositRefundApply = Backbone.Model.extend({
		idAttribute : "pkDepositRefundApply"
	});
	
	var DepositRefundApplys = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : DepositRefundApply,
		
		url : "api/depositrefundapply/query"
	});
	
	return DepositRefundApplys;
	
});