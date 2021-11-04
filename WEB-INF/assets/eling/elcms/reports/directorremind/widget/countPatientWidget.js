define(function(require,exports,module){
	return {		
		icon:"icon-heart",
		text:"楼栋理事提醒（住院）",
		color:"text-blue",
		count:{
			url:"api/directorremind/countpatient",
		},
		handler:{
			url:"eling/elcms/reports/directorremind/directorremind",
			params:{
				"remindType":"patient"
			}
		}		
	};
});