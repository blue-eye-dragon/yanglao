define(function(require,exports,module){
	//多语 
	var i18ns = require("i18n");
	return {
		id:"checkInMemberCount",
		icon:"icon-plus-sign",
		text:"住院"+i18ns.get("sale_ship_owner","会员")+"（全部）",
		color:"text-red",
		count:{
			url:"api/memberbehospitalizedsituation/count",
		},
		handler:{
			url:"eling/elcms/health/memberbehospitalizedsituation/memberbehospitalizedsituationopenview",
			params:function(subnavParams){
				return {
					flag:"col"
				};
			}
		}		
	};
});