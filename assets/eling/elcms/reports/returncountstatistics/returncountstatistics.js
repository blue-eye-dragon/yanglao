/**
 * 回访次数追踪
 */
define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var ReturnCountStatistics = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"回访次数统计",
					buttonGroup:[{ 
						id:"intention",
						tip:"最终意向筛选",
						showAll:true,
						showAllFirst:true,
						items:[{
							key:"Hopebuy",
							value:"希望购买"
						},{
							key:"General",
							value:"一般"
						},{
							key:"Like",
							value:"感兴趣"
						},{
							key:"Dislike",
							value:"不感兴趣"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"communicatecount",
						tip:"回访次数筛选",
						showAll:true,
						items:[{
							key:"0",
							value:"0次"
						},{
							key:"1",
							value:"小于等于3"
						},{
							key:"2",
							value:"大于3"
						}],
						handler:function(key,element){								
							widget.get("list").refresh();
						}
					}],
					time:{
        				tip:"最新回访时间筛选",
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
				url:"api/report/returncountstatistics",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						communicatecount:subnav.getValue("communicatecount"),
						intention:subnav.getValue("intention"),
						type:"Return",
						start: subnav.getValue("time").start,
				    	end:  subnav.getValue("time").end	
					};
				}
			};
		}
	});
	
	module.exports=ReturnCountStatistics;
});