define(function(require,exports,module){
	return {
		//图标
		icon:"icon-bar-chart",
		text:"服务费月报",
		color:"text-primary",
		count:{
			url:"api/report/annualFeeMonthStatisticsCount",
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
			url:"eling/elcms/reports/annualfeemonthstatistics/annualfeemonthstatistics",
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