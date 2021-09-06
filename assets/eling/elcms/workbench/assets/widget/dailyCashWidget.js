define(function(require,exports,module){
	return {
		id:"DailyCash",
		icon:"icon-bar-chart",
		text:"资金日报",
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
			url:"",
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