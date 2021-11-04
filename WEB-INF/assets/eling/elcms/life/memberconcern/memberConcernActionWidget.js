define(function(require,exports,module){
	var i18ns = require("i18n");
	return {
		//图标
		icon:"icon-star",
		text:i18ns.get("sale_ship_owner","会员")+"关注",
		color:"text-purple",
		count:{
			url:"api/action/queryCountByType",  
			params:function(subnavParams){
				return {
					typeIn : "MemberConcern",
					targetType : "Building",
					"member.statusIn":"Normal,Nursing,Out,Behospitalized,NursingAndBehospitalized",
					pkTarget : subnavParams.building,
					building : subnavParams.building,
					unfinished : subnavParams.status,
					date : subnavParams.time.start,
					dateEnd : subnavParams.time.end
				};
			}
		},
		handler:{
			url:"eling/elcms/schedule/memberconcernaction/memberconcernaction",
			params:function(subnavParams){
				return {
					id:"MemberConcern",
					typeIn : "MemberConcern",
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