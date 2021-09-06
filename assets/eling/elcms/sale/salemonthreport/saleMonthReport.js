/*
 * 销售月报
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var min=moment().format("YYYY年MM月销售月报");
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
	var saleMonthReport = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
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
						    var title=moment(monthFirstDay).format("YYYY年MM月销售月报");
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
						    var title=moment(monthFirstDay).format("YYYY年MM月销售月报");
						    widget.get("subnav").setTitle(title);
					   }
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				autoRender : false,
				parentNode:".J-list",
				url:"api/report/saleMonthReport",
				params:function(){
					var year = widget.get("subnav").getValue("year");
					var month = widget.get("subnav").getValue("month");
					return {
						year:year,
						month:month
					};
				},
				model:{
					datas:{
						id:"des",
						cols:[{
						},{
							format:"thousands",
							className:"text-right"
						}],
						click : function(data){
							if(data.des == "0" || data.des == "0.00"){
								return ;
							}else{
								var year = widget.get("subnav").getValue("year");
								var month = widget.get("subnav").getValue("month");
								widget.openView({
									url:"eling/elcms/sale/membershipcontract/membershipcontract",
									params:{
										"year":year,
										"month":month,
										"cardtype":data.memberCardType,
										"roomtype":data.roomType,
										"check" :"salemonthreport"
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
				var title=moment(year+"-"+month).format("YYYY年MM月年销售月报");
				widget.get("subnav").setTitle(title);
			}else{
				widget.get("subnav").setValue("year",moment().year());
				widget.get("subnav").setValue("month",moment().month()+1);
				var title=moment().format("YYYY年MM月销售月报");
				widget.get("subnav").setTitle(title);
			}
			widget.get("grid").refresh();
		},
		setEpitaph : function(){
			return {
				month:this.get("subnav").getValue("month"),
				year:this.get("subnav").getValue("year")
			};
		}
	});
	module.exports = saleMonthReport;
});







