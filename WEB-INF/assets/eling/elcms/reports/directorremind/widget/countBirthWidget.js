define(function(require,exports,module){
	return {		
		icon:"icon-star",
		text:"楼栋理事提醒（生日）",
		color:"text-pink",
		count:{
			url:"api/directorremind/countbirth",
		},
		handler:{
			url:"eling/elcms/reports/directorremind/directorremind",
			params:{
				"remindType":"birth"
			}
		}		
	};
});