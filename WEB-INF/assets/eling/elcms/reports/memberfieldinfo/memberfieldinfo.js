/**
 * 会员信息完成度分析
 */
define(function(require,exports,module){
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var MemberFieldInfo=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					//title:"会员信息完成度分析",
					title:i18ns.get("sale_ship_owner","会员")+"信息完成度分析",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/memberfieldinformation",
				params:function(){
					return {
						pkBuilding:widget.get("subnav").getValue("building")
					};
				}
			};
		}
	});
	
	module.exports=MemberFieldInfo;
});