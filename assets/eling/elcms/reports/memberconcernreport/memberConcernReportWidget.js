define(function(require,exports,module){
	var i18ns = require("i18n");
	return {		
		icon:"icon-bell-alt",
		text:"重点"+i18ns.get("sale_ship_owner","会员")+"关注情况",
		color:"text-red",
		count:{
			url:"api/report/memberconcernreport/queryCount",
		},
		handler:{
			url:"eling/elcms/reports/memberconcernreport/memberconcernreport",
		}		
	};
});