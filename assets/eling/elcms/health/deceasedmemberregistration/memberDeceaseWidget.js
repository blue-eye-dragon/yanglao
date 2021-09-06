define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	return {
		id:"MemberDecease",
		icon:"icon-plus",
		text:"过世"+i18ns.get("sale_ship_owner","会员")+"(当年)",
		color:"text-primary",
		count:{
			url:"api/memberDeceases/queryCount",
			params:function(subnavParams){
				return {
					flowStatus:"Confirm",
					deceasedDate : moment(subnavParams.time.start).startOf('year').valueOf(),
					deceasedDateEnd : moment(subnavParams.time.end).endOf('year').valueOf()
				};
			}
		},
		handler:{
			url:"eling/elcms/schedule/memberDeceaseSchedule/memberDeceaseSchedule",
//			params:function(subnavParams){
//				return {
//					typeIn : "MemberDecease",
//					targetType : "Building",
//					pkTarget : "",
//					building : "",
//					unfinished : subnavParams.status,
//					date : subnavParams.time.start,
//					dateEnd : subnavParams.time.end
//				};
//			}
		}		
	};
});