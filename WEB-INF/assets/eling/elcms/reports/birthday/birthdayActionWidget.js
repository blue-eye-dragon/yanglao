define(function(require,exports,module){
	return {
		//图标
		icon:"icon-gift",
		text:"生日",
		color:"text-error",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "Birthday",
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
					id:"Birthday",
					typeIn : "Birthday",
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