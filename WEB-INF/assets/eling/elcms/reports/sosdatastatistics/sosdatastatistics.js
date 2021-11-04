/**
 * 紧急求助数据统计
 * 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var ReportGrid=require("reportgrid");
	var SosDataStatisticsReport = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"紧急求助数据统计",
					time:{
						ranges:{
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
				url:"api/report/sosdatastatistics",
				params:function(){
					var time=widget.get("subnav").getValue("time");
					return {
						start:time.start,
						end:time.end
					};
				},
				model:{
					datas: {
						id : "count",
						click : function(data){
							var flowStatusdata="";
							var name="";
							var pkBuilding=null;
							if(data!=null){
								flowStatusdata=data.flowStatus;
								name=data.name;
							}
							var flowStatus="";
							if(flowStatusdata=="处理中"){
								flowStatus="Processing";
							}else if(flowStatusdata=="已处理"){
								flowStatus="Processed";
							}else if(flowStatusdata=="结束"){
								flowStatus="Finish";
							}
							if(flowStatus!=""&&name!=""){
								aw.ajax({
									url : "api/building/query",
									type : "POST",
									data : {
										name:name,
										fetchProperties:"pkBuilding"
									},
									success:function(result){	
										pkBuilding=result[0].pkBuilding;
										if(pkBuilding&&flowStatus){
											widget.openView({
												url:"eling/elcms/ward/emergencyrescue/emergencyrescue",
												params:{
													pkBuilding:pkBuilding,
													flowStatus:flowStatus
												}
											});
										}
									}
								});
							}
							return false;
						}
					}
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = SosDataStatisticsReport;
});