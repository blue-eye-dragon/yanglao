define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var ChangeRoomAppointment = Backbone.Model.extend({
		idAttribute : "pkChangeRoomAppointment"
	});
	
	var ChangeRoomAppointments = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : ChangeRoomAppointment,
		
		url : "api/changeroomappointment/query"
	});
	
	return ChangeRoomAppointments;
	
});