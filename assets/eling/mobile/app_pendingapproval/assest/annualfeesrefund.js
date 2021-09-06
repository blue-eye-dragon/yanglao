define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var AnnualFeesRefund = Backbone.Model.extend({
		idAttribute : "pkAnnualFeesRefund"
	});
	
	var AnnualFeesRefunds = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : AnnualFeesRefund,
		
		url : "api/annualfeesrefund/query"
	});
	
	return AnnualFeesRefunds;
	
});