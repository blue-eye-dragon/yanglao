define(function(require,exports,module){
	return {		
		icon:"icon-signout",
		text:"楼栋理事提醒（外出）",
		color:"text-green",
		count:{
			url:"api/directorremind/countgoout",
		},
		handler:{
			url:"eling/elcms/reports/directorremind/directorremind",
			params:{
				"remindType":"goout"
			}
		}		
	};
});