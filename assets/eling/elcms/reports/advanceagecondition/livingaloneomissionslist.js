/**
 * 独居会员沟通遗漏明细表
 */
define(function(require,exports,module){
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var LivingAloneOmissionsList=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"独居"+i18ns.get("sale_ship_owner","会员")+"沟通遗漏明细",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					time:{
						click:function(time){
						    widget.get("list").refresh();
						}
					},
					buttons :[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/livingaloneomissionslist",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						start:time.start,
						end:time.end,
						pkBuilding:subnav.getValue("building")
					};
				}
			};
		}
	});
	
	module.exports=LivingAloneOmissionsList;
});