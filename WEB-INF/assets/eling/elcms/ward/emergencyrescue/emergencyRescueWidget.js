define(function(require,exports,module){
	return {		
		icon:"icon-ambulance",
		text:"紧急求助（需要就医）",
		color:"text-red",
		count:{
			url:"api/sos/queryCount",
			params:function(subnavParams){
				return {
					hospitalize:"true",
				    "orderString":"sosTime",
				    flowStatusIn : "Processing",
				};
			}
		},
		handler:{
			url:"eling/elcms/ward/emergencyrescue/emergencytreatment",
			params:function(subnavParams){
				return {
					hospitalize:"true",
				    "orderString":"sosTime",
				    flowStatusIn : "Processing",
				};
			}
		}		
	};
});