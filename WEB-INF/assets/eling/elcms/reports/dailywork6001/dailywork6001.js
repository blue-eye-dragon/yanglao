/**
 * 6001常规工作数据统计
 * 
 */
define(function(require,exports,module){
	var ELView =require("elview");
	var aw = require("ajaxwrapper");
	var Subnav=require("subnav");
	var ReportGrid=require("reportgrid");
	var enums  = require("enums");
	var template="<div class = 'el-dailywork6001'>"+
	 "<div class = 'J-subnav'></div>"+
	 "<div class = 'J-shoppingtitle' style='font-size:18px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代购物</div>"+
	 "<div class = 'J-shopping'></div>"+
	 "<div class = 'J-doctortitle' style='font-size:18px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;陪同就医</div>"+
	 "<div class = 'J-doctor'></div>"+
	 "<div class = 'J-medicaltitle' style='font-size:18px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代配药</div>"+
	 "<div class = 'J-medical'></div>"+
	 "<div class = 'J-milktitle' style='font-size:18px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;订奶</div>"+
	 "<div class = 'J-milk'></div>"+
	 "</div>";
	var dailywork6001=ELView.extend({
		attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"6001常规工作数据统计",
					items:[{
						id : "date",
						type : "daterange",
						tip : "时间",
						ranges : {
							"本月": [moment().startOf("month"), moment().endOf("month")],
							"上个月": [moment().subtract(1, 'month').startOf('month'),moment().subtract(1, 'month').endOf('month')],
							"两月前": [moment().subtract(2, 'month').startOf('month'),moment().subtract(2, 'month').endOf('month')],
						},
						defaultRange : "本月",
						handler : function(time){
							widget.get("shopping").refresh();
							widget.get("doctor").refresh();
							widget.get("medical").refresh();
							widget.get("milk").refresh();
						},
					},{
						id : "toExcel",
						type : "button",
						text : "导出",
						handler : function(time){
							var subnav=widget.get("subnav");
 							window.open("api/report/6001dailywork/toexcel?start="+subnav.getValue("date").start+
 									"&end="+subnav.getValue("date").end
 							);
 							return false;
						},
					}]
				}
        	});
        	this.set("subnav",subnav);
        	
        	var shopping=new ReportGrid({
				parentNode:".J-shopping",
				url:"api/report/6001dailywork",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						start:subnav.getValue("date").start,
						end:subnav.getValue("date").end,
						type:"shopping",
					}
				},
				model:{
					colHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					rowHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.date;
							}else {
								return data.value;
							}
						}
					},
					datas : {
						id:"detail",
						cols : [{
							className : "text-right"
						}],
					}
				}
			});
			this.set("shopping",shopping);	
			
			// 陪同就医
			var doctor=new ReportGrid({
				parentNode:".J-doctor",
				url:"api/report/6001dailywork",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						start:subnav.getValue("date").start,
						end:subnav.getValue("date").end,
						type:"doctor",
					}
				},
				model:{
					colHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					rowHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.date;
							}else {
								return data.value;
							}
						}
					},
					datas : {
						id:"detail",
						cols : [{
							className : "text-right"
						}],
					}
				}
			});
			this.set("doctor",doctor);
			
			// 代配药
			var medical=new ReportGrid({
				parentNode:".J-medical",
				url:"api/report/6001dailywork",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						start:subnav.getValue("date").start,
						end:subnav.getValue("date").end,
						type:"medical",
					}
				},
				model:{
					colHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					rowHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.date;
							}else {
								return data.value;
							}
						}
					},
					datas : {
						id:"detail",
						cols : [{
							className : "text-right"
						}],
					}
				}
			});
			this.set("medical",medical);	
			
			// 订奶
			var milk=new ReportGrid({
				parentNode:".J-milk",
				url:"api/report/6001dailywork",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						start:subnav.getValue("date").start,
						end:subnav.getValue("date").end,
						type:"milk",
					}
				},
				model:{
					colHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					rowHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.date;
							}else{
								return data.value;
							}
						}
					},
					datas : {
						id:"detail",
						cols : [{
							className : "text-right"
						}],
					}
				}
			});
			this.set("milk",milk);	
        }
	});
	module.exports = dailywork6001;
})