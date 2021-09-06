define(function(require,exports,module){
	return {
		icon:"icon-wrench",
		text:"待完成",
		color:"text-primary",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "RepairUnrepaire",
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
					id:"RepairUnrepaire",
					typeIn : "RepairUnrepaire",
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