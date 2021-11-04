define(function(require,exports,module){
	return {
		//图标
		icon:"icon-wrench",
		text:"待派工",
		color:"text-primary",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "RepairUnarrange",
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
					id:"RepairUnarrange",
					typeIn : "RepairUnarrange",
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