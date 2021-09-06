/**
 * 体验意向明细
 * 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var TryLiveIntention = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"体验意向明细",
					time:{
						ranges:{
//							"昨天": [moment().subtract("days", 1).startOf("days"),moment().subtract("days", 1).endOf("days")],
							"今天": [moment().startOf("days"),moment().endOf("days")],
							"上月":[moment().subtract(1,"months").startOf("month"), moment().subtract(1,"months").endOf("month")],
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
				url:"api/report/tryliveintention",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						start:time.start, 
						end:time.end
					};
				},
				model:{
					datas : {
						id:"count"
					}
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = TryLiveIntention;
});