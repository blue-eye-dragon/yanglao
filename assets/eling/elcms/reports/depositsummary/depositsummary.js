/**
 * 预约金年度汇总表
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var Properties=require("./properties");
	var DepositSummary = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var years=[];
			for(var i=0;i<=parseInt(moment().format("YYYY"))+5-2010;i++){
				var obj={};
				obj.key=2010+i;
				obj.value=2010+i;
				years.push(obj);
			}
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title : Properties.customize_title(widget),
					buttonGroup:[{
						   id:"year",
						   tip:"年份",
						   items:years,	
						   handler:function(key,element){
							   widget.get("grid").refresh();
						   }
					   }]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				autoRender : false,
				model:{
					datas : {
						id : "des",
						cols : [{
						},{
							format : "thousands",
							className : "text-right"
						}]
					}
				},
				parentNode:".J-list",
				url:"api/report/depositSummary",
				params:function(){
					return {
						year:widget.get("subnav").getValue("year")
					};
				},
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			widget.get("subnav").setValue("year",moment().year());
			widget.get("grid").refresh();
		},
	});
	module.exports = DepositSummary;
});