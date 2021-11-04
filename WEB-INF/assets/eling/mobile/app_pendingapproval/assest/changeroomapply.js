define(function(require,exports,module){
	var Backbone = require("backbone");
	
	var ChangeRoomApply = Backbone.Model.extend({
		idAttribute : "pkChangeRoomApply"
	});
	
	var ChangeRoomApplys = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : ChangeRoomApply,
		
		url : "api/changeroomapply/query"
	});
	return ChangeRoomApplys;
});