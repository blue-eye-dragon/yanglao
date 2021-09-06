define(function(require,exports,module){
	var ELView=require("elview");
	
	var RoomMonitor=ELView.extend({
		attrs:{
			template:'<img src="assets/eling/resources/roommonitor-1366-768.png">'
		}
	});
	module.exports=RoomMonitor;
});