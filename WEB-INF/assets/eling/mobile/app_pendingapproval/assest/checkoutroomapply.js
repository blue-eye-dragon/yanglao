define(function(require,exports,module){
	var Backbone = require("backbone");
	
	var CheckOutRoomApply = Backbone.Model.extend({
		idAttribute : "pkCheckOutRoomApply"
	});
	
	var CheckOutRoomApplys = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : CheckOutRoomApply,
		
		url : "api/checkoutroomapply/query"
	});
	return CheckOutRoomApplys;
});