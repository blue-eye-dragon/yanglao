/**
 *	来访意向统计
 * 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var CustomerStatistics = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"意向客户统计",
					time:{
        				tip:"最新来访时间筛选",
						click:function(time){
							widget.get("grid").refresh();
						}
					}
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				url:"api/report/customerstatistics",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						start: subnav.getValue("time").start,
				    	end:  subnav.getValue("time").end,
				    	fetchProperties:"*,data.cardType.pkMemberShipCardType,data.cardType.name,data.count"
					};
				},
				model:{
					colHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.value;
							}
						}
					},
					rowHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					datas : {
						id:"count",
						cols : [{
							format : "defaultZero"
						}],
						click : function(data){
							//点击单元格事件，data就是你查回来的本单元格对应的数据
							console.dir(data);
							widget.openView({
								url:"eling/elcms/sale/customertrace/customertrace",
								params:{
									intention:data.intention,
									cardType:data.cardType,
									start: subnav.getValue("time").start,
							    	end:  subnav.getValue("time").end
								},
								isAllowBack:true
							});
						}
					}
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = CustomerStatistics;
});