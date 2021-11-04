/**
 * 服务费月报
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var AnnualFeeMonthStatistics = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var min=moment().format("YYYY年MM月服务费月报");
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
							   widget.get("grid").refresh();
							   var year = widget.get("subnav").getValue("year");
							   var month = widget.get("subnav").getValue("month");
							   var monthFirstDay= year + "-" +month;
							   var title=moment(monthFirstDay).format("YYYY年MM月服务费月报");
							   widget.get("subnav").setTitle(title);
						   }
					   },{
						   id:"month",
						   items:months,	
						   handler:function(key,element){
							   widget.get("grid").refresh();
							   var year = widget.get("subnav").getValue("year");
							   var month = widget.get("subnav").getValue("month");
							   var monthFirstDay= year + "-" +month;
							   var title=moment(monthFirstDay).format("YYYY年MM月服务费月报");
							   widget.get("subnav").setTitle(title);
						   }
					   }]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				autoRender : false,
				url:"api/report/annualFeeMonthStatistics",
				params:function(){
					//把年份和月份拼起来
					var year = widget.get("subnav").getValue("year");
					var month = widget.get("subnav").getValue("month");
					var monthFirstDay= year + "-" +month;
					var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
					var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
					return {
						start:moment(monthFirstDay).startOf("month").valueOf(),
						end:moment(monthLastDay).endOf("month").valueOf(),
						//fetchProperties : "*,rowHeaders.name.*"
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
						id : "des",
						cols : [{
							format : function(params,value,data){
								if(value === null){
									return 0;
								}else{
									return value;
								}
							}
						},{
							className : "text-right",
							format : "thousands"
						}],
						click : function(data){
							var chargeStatus = data.chargeStatus.key == "ToCharge"?null:data.chargeStatus.key;
							//点击单元格事件，data就是你查回来的本单元格对应的数据
							if(data.des == "0" || data.des == "0.00" || data.chargeStatus.key == "Percent"){
								return ;
							}else{
								if(data.building.pkBuilding == "9999"){
									data.building.pkBuilding = "";
								}
								widget.openView({
									url:"eling/elcms/reports/annualfeemonthreport/annualfeemonthreport",
									params:{
										chargeStatus:chargeStatus,
										pkBuilding:data.building.pkBuilding,
										year : widget.get("subnav").getValue("year"),
										month : widget.get("subnav").getValue("month")
									},
									isAllowBack:true
								});
							}
						}
					}
				}
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			var year,month;
			//当页面回调时
			if(params){
				year = params.year;
				month = params.month;
				widget.get("subnav").setValue("year",year);
				widget.get("subnav").setValue("month",month);
				var title=moment(year+"-"+month).format("YYYY年MM月服务费月报");
				widget.get("subnav").setTitle(title);
			}else{
				widget.get("subnav").setValue("year",moment().year());
				widget.get("subnav").setValue("month",moment().month()+1);
				var title=moment().format("YYYY年MM月服务费月报");
				widget.get("subnav").setTitle(title);
			}
			widget.get("grid").refresh();
		},
		//openview时设置缓存,保存当时所选时间
		setEpitaph : function(){
			return {
				month:this.get("subnav").getValue("month"),
				year:this.get("subnav").getValue("year")
			};
		}
	  
	});
	module.exports = AnnualFeeMonthStatistics;
});