/**
 *报修完成情况汇总表
 */
define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var RepairsCompleted=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"报修完成情况汇总表",
					time:{
						tip:"报修日期",
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
				url:"api/report/repairscompleted",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						start:time.start,
						end:time.end
					};
				}
			};
		}
	});
	
	module.exports=RepairsCompleted;
});