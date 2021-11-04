/**
 * 会员信息完善度查询-社区
 */
define(function(require,exports,module){
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var MemberInfoDegree=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					//title:"会员信息完善度查询-社区",
					title:i18ns.get("sale_ship_owner","会员")+"信息完善度查询-社区",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/memberinfocommunity"
			};
		}
	});
	
	module.exports=MemberInfoDegree;
});