define(function(require,exports,module){
	var Backbone = require("backbone");
	
	var PendingApproval = Backbone.Model.extend({
		idAttribute : "pkApprovalProcess"
	});
	
	var PendingApprovals = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		model : PendingApproval,
		url : "api/pendingapproval/query"
	});
	
	return PendingApprovals;
	
});