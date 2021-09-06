define(function(require,exports,module){
	var i18ns = require("i18n");
	return {
		//图标
		icon:"icon-heart",
		text:"独居"+i18ns.get("sale_ship_owner","会员")+"关怀",
		color:"text-error",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "LivingAlone",
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
			url:"eling/elcms/schedule/advanceAndAloneToDoList/advanceAndAloneToDoList",
			params:function(subnavParams){
				return {
					id:"LivingAlone",
					typeIn : "LivingAlone",
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