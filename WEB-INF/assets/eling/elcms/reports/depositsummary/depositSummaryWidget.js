define(function(require,exports,module){
	return {
		//图标
		icon:"icon-bar-chart",
		text:"预约金年度汇总",
		color:"text-primary",
		count:{
			url:"api/report/depositSummaryCount",
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
			url:"eling/elcms/reports/depositsummary/depositsummary",
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