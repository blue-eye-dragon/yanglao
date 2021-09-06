define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	return {
		id:"checkInMemberCount",
		icon:"icon-smile",
		text:"新入住"+i18ns.get("sale_ship_owner","会员")+"统计",
		color:"text-green",
		count:{
			url:"api/report/checkinmemberdetail/count",
			params:function(subnavParams){
				return {
					"start":moment().subtract(1,"month").add(1, 'day').valueOf(),
					"end":moment().valueOf(),
				};
			}
		},
		handler:{
			url:"eling/elcms/membercenter/checkinmemberdetail/checkinmemberdetail",
			params:function(subnavParams){
				return {
					"start":moment().subtract(1,"month").add(1, 'day').valueOf(),
					"end":moment().valueOf(),
					"flg":"workbench"
				};
			}
		}		
	};
});