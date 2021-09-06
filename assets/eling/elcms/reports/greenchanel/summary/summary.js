define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
    
	var GreenChanelSummary = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					buttons:[],
					title:"绿色通道服务汇总表",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"date",
						items:[{
		                    key:"1",
		                    value:"本季度"
						},{
		                    key:"2",
		                    value:"今年"
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
				url : "api/greenchanelsummary/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						date:subnav.getValue("date"),
						pkBuilding:subnav.getValue("building")
					};
				},
				model:{
					columns:[{
						key:"date",
						name:"时间"
					},{
						key:"countnumber",
						name:"服务会员数"
					},{
						key:"count",
						name:"服务总数"
					}]
				}
			};
		}
	});
	module.exports = GreenChanelSummary;
});