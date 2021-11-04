/**
 * 服务月报 servicemonthreport
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var ServiceMonthReport = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var min=moment().format("YYYY年MM月服务月报");
			var years=[];
			for(var i=0;i<=moment().year()+5-2010;i++){
				var obj={};
				obj.key=2010+i;
				obj.value=2010+i;
				years.push(obj);
			}
			var months=[{
						key:01,value:"一月"
					},{
						key:02,value:"二月"
					},{
						key:03,value:"三月"
					},{
						key:04,value:"四月"
					},{
						key:05,value:"五月"
					},{
						key:06,value:"六月"
					},{
						key:07,value:"七月"
					},{
						key:08,value:"八月"
					},{
						key:09,value:"九月"
					},{
						key:10,value:"十月"
					},{
						key:11,value:"十一月"
					},{
						key:12,value:"十二月"
					}];
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:min,
					buttonGroup:[{
						   id:"year",
						   items:years,	
						   handler:function(key,element){
							   widget.get("grid").refresh(null,function(){
									$(".J-reportgrid-table thead tr th:first").append("服务类型");
								});
							   var year = widget.get("subnav").getValue("year");
							   var month = widget.get("subnav").getValue("month");
							   var monthFirstDay= year + "-" +month;
							   var title=moment(monthFirstDay).format("YYYY年MM月服务月报");
							   widget.get("subnav").setTitle(title);
						   }
					   },{
						   id:"month",
						   items:months,	
						   handler:function(key,element){
							   widget.get("grid").refresh(null,function(){
									$(".J-reportgrid-table thead tr th:first").append("服务类型");
								});
							   var year = widget.get("subnav").getValue("year");
							   var month = widget.get("subnav").getValue("month");
							   var monthFirstDay= year + "-" +month;
							   var title=moment(monthFirstDay).format("YYYY年MM月服务月报");
							   widget.get("subnav").setTitle(title);
						   }
					   }]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				autoRender : false,
				url:"api/report/servicemonthreport",
				params:function(){
					//把年份和月份拼起来
					var year = widget.get("subnav").getValue("year");
					var month = widget.get("subnav").getValue("month");
					var monthFirstDay= year + "-" +month;
					var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
					var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
					return {
						//该月第一天的0:0:0
						start:moment(monthFirstDay,"YYYY-MM-DD").valueOf(),
						//该月最后一天的23:59:59
						end:moment(monthLastDay,"YYYY-MM-DD").add(86399, 'seconds').valueOf()
					};
				},
				model:{
					datas : {
						id : "value"
					}
				}
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			var year,month;
			widget.get("subnav").setValue("year",moment().year());
			widget.get("subnav").setValue("month",moment().month()+1);
			var title=moment().format("YYYY年MM月服务月报");
			widget.get("subnav").setTitle(title);
			widget.get("grid").refresh(null,function(){
				$(".J-reportgrid-table thead tr th:first").append("服务类型");
			});
		}
	});
	module.exports = ServiceMonthReport;
});