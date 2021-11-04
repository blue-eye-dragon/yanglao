define(function(require,exports,module){
	var Backbone = require("backbone");
	
	var BowOutMembershipContract = Backbone.Model.extend({
		idAttribute : "pkChangeRoomApply"
	});
	
	var BowOutMembershipContracts = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : BowOutMembershipContract,
		
		url : "api/bowoutmembershipcontractapply/query"
	});
	return BowOutMembershipContracts;
});