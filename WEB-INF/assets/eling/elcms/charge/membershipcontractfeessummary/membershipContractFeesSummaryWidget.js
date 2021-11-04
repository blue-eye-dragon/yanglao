define(function(require,exports,module){
	var i18ns = require("i18n");
	return { 
		//图标
		icon:"icon-bar-chart",
		text:i18ns.get("charge_shipfees_summarytitle","卡费年度汇总"),
		color:"text-primary",
		count:{
			url:"api/report/cardfeemonthstatisticsCount",
//			params:function(subnavParams){
//				return {
//					building : subnavParams.building,
//					unfinished : subnavParams.status,
//					date : subnavParams.time.start,
//					dateEnd : subnavParams.time.end
//				};
//			}
		},
		handler:{
			url:"eling/elcms/charge/membershipcontractfeessummary/membershipcontractfeessummary",
//			params:function(subnavParams){
//				return {
//					building : subnavParams.building,
//					unfinished : subnavParams.status,
//					date : subnavParams.time.start,
//					dateEnd : subnavParams.time.end
//				};
//			}
		}		
	};
});