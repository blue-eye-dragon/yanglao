/**
 *	会员疾病信息统计
 * 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var DiseaseInformationStatistics = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员疾病信息统计",
					buttons:[{
 						id:"toexcel",
 						text:"导出",
 						handler:function(){ 
 							window.open("api/report/diseaseInformationStatisticstoExcel");
 							return false;
 	 					}				
 					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				url:"api/report/diseaseInformationStatistics",
				model:{
					datas : {
						id:"count"
					}
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = DiseaseInformationStatistics;
});