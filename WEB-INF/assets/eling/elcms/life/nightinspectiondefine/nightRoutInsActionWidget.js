define(function(require,exports,module){
	return {
		//图标
		icon:"icon-truck",
		text:"夜间巡检",
		color:"text-primary",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "NightRoutIns",
					targetType : "Building",
					pkTarget : "",
					building : subnavParams.building,
					unfinished : subnavParams.status,
					date : subnavParams.time.start,
					dateEnd : subnavParams.time.end
				};
			}
		}, 
		//
		handler:{
			url:"eling/elcms/schedule/workTaskToDoList/workTaskToDoList",
			params:function(subnavParams){
				return {
					id:"NightRoutIns",
					typeIn : "NightRoutIns",
					targetType : "Building",
					pkTarget : "",
					building : "",
					unfinished : subnavParams.status,
					date : subnavParams.time.start,
					dateEnd : subnavParams.time.end
				};
			}
		}		
	};
});