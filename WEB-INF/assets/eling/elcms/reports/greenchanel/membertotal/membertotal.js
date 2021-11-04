define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var BaseView=require("baseview");
	var GreenChanelMemberTotal = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					buttons:[],
					title:"绿色通道服务统计",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"date",
						items:[{
		                    key:"0",
		                    value:"本月"
						},{
		                    key:"1",
		                    value:"本季度"
						},{
		                    key:"2",
		                    value:"本年"
						},{
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}]					
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/greenchanelmembertotal/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						date:subnav.getValue("date"),
						pkBuilding:subnav.getValue("building")
					};
				},
				model:{
					columns:[{
						key:"name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"number",
						name:"房间号"
					},{
						key:"count",
						name:"服务次数"
					}]
				}
			};
		}
	});
	module.exports = GreenChanelMemberTotal;
});