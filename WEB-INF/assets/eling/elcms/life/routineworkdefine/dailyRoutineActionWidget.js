define(function(require,exports,module){
	return {
		//图标
		icon:"icon-align-left",
		text:"例行工作",
		color:"text-success",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "DailyRoutine",
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
			url:"eling/elcms/schedule/workTaskToDoList/workTaskToDoList",
			params:function(subnavParams){
				return {
					id:"DailyRoutine",
					typeIn : "DailyRoutine",
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