define(function(require,exports,module){
	var i18ns = require("i18n");
	return {
		id:"diseasestatiscsButtonWidget",
		icon:"icon-user",
		text:i18ns.get("sale_ship_owner","会员")+"重大疾病情况",
		color:"text-blue",
		count:{
			url:"api/diseasehistory/querycount/critical",
		},
		handler:{
			url:"eling/elcms/reports/diseasestatiscs/widget/diseasestatiscsWidget",
		}		
	};
});