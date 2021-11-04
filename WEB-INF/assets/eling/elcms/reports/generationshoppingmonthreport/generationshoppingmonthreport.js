/**
 * 代购物月统计表
 * 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var GenerationShoppingMonthReport = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"代购物月统计表",
					time:{
						ranges:{
//							"今天": [moment().startOf("days"),moment().endOf("days")],
							"上月":[moment().subtract(1,"months").startOf("month"), moment().subtract(1,"months").endOf("month")],
//							"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
							"本月": [moment().startOf("month"), moment().endOf("month")],
						},
						defaultTime:"本月",
						click:function(time){
							widget.get("grid").refresh();
						}
					}
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				url:"api/report/generationshoppingmonthreport",
				params:function(){
					var time=widget.get("subnav").getValue("time");
					return {
						start:time.start,
						end:time.end
					};
				},
				model:{
					datas:{
						id : "number"
					}
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = GenerationShoppingMonthReport;
});