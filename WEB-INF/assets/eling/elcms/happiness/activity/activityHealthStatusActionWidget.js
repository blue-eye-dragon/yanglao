define(function(require,exports,module){
	return {
		//图标
		icon:"icon-plus-sign-alt",
		text:"活动健康状态确认",
		color:"text-success",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "ActivityHealthStatus",
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
					id:"ActivityHealthStatus",
					typeIn : "ActivityHealthStatus",
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