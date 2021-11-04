/**
 * 会员籍贯详情统计表
 * 
 */
define(function(require, exports, module) { 
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var MemberBirthplaceReport = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员籍贯统计"
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				url:"api/report/memberbirthplacereport",
				model:{
					datas : {
						id:"count"
					}
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = MemberBirthplaceReport;
});