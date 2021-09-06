define(function(require,exports,module){
	return {
		id:"icon-coffee",
		icon:"icon-coffee",
		text:"活动统计",
		color:"text-pink",
		count:{
			url:"api/report/activitystatistics/count",
			
		},
		handler:{
			url:"eling/elcms/reports/activitystatistics/activitystatistics",
		}		
	};
});