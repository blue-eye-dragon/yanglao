define(function(require,exports,module){
	return {
		//图标
		icon:"icon-time",
		text:"回访提醒",
		color:"text-warning",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "Callback",
					targetType : "Building",
					pkTarget : "",
					building : subnavParams.building,
					unfinished : subnavParams.status,
					date : subnavParams.time.start,
					dateEnd : subnavParams.time.end
				};
			}
		},
		handler:{
			url:"eling/elcms/schedule/workTaskToDoList/workTaskToDoList",
			params:function(subnavParams){
				return {
					id:"Callback",
					typeIn : "Callback",
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