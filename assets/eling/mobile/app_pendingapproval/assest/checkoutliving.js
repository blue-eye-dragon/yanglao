define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var CheckOutLiving = Backbone.Model.extend({
		idAttribute : "pkCheckOutLiving"
	});
	
	var CheckOutLivings = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : CheckOutLiving,
		
		url : "api/checkoutlivingapply/query"
	});
	
	return CheckOutLivings;
	
});