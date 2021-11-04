define(function(require,exports,module){
	var Backbone = require("backbone");
	
	var MemberShipContractFeesRefund = Backbone.Model.extend({
		idAttribute : "pkChangeRoomApply"
	});
	
	var MemberShipContractFeesRefunds = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : MemberShipContractFeesRefund,
		
		url : "api/membershipcontractfeesrefund/query"
	});
	return MemberShipContractFeesRefunds;
});