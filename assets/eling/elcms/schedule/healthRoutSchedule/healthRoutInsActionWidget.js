define(function(require,exports,module){
	return {
		icon:"icon-ambulance",
		text:"健康巡检",
		color:"text-error",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "HealthRoutIns",
					targetType : "Building",
					pkTarget : subnavParams.building,
					building : subnavParams.building,
					unfinished : subnavParams.status,
					date : subnavParams.time.start,
					dateEnd : subnavParams.time.end
				};
			}
		},
		handler:{
			url:"eling/elcms/schedule/healthRoutToDoList/healthRoutToDoList",
			params:function(subnavParams){
				return {
					id:"HealthRoutIns",
					typeIn : "HealthRoutIns",
					targetType : "Building",
					pkTarget : subnavParams.building,
					building : subnavParams.building,
					unfinished : subnavParams.status,
					date : subnavParams.time.start,
					dateEnd : subnavParams.time.end
				};
			}
		}
	};
});