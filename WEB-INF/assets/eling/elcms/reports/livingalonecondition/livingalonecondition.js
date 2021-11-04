/**
 * 独居会员沟通完成情况表
 */
define(function(require,exports,module){
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var AdvanceAgeCondition=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"独居"+i18ns.get("sale_ship_owner","会员")+"沟通完成情况表",
					time:{
						click:function(time){
							widget.get("list").refresh();
						}
					},
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/advancealoneactioncondition",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						type:"LivingAlone",
						start:time.start,
						end:time.end
					};
				}
			};
		}
	});
	
	module.exports=AdvanceAgeCondition;
});