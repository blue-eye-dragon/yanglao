define(function(require,exports,module){
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var MemberAverageAge=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"婚姻状态统计",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/membermaritalstatus"
			};
		}
	});
	
	module.exports=MemberAverageAge;
});