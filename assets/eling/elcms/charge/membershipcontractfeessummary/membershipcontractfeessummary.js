/**
 * 卡费年度汇总
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	//多语
	var i18ns = require("i18n");
	var MemberShipContractFeesSummary = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			
			var years=[];
			for(var i=0;i<=10;i++){
				var obj={};
				obj.key=(parseInt(moment().format("YYYY"))-5)+i;
				obj.value=(parseInt(moment().format("YYYY"))-5)+i;
				years.push(obj);
			}
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title: i18ns.get("charge_shipfees_summarytitle","卡费年度汇总"),
					buttonGroup:[{
						   id:"year",
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
						}],
						click : function(data){
							if(data.des == "0" || data.des == "0.00"){
								return false;
							}
							var viewName = data.status;
							var year = widget.get("subnav").getValue("year");
							var month = data.month;
							var start;
							var end;
							month = month.substr(0,month.length-1);
							var monthFirstDay= year + "-" +month;
							var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
							var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
							if(!isNaN(month)){
								start = moment(monthFirstDay).valueOf();
								end = moment(monthLastDay).valueOf();
								}else{
									start = moment(year).startOf("year").valueOf()
									end = moment(year).endOf("year").valueOf();
								}
							var url = "";
							var params = {
									start : start,
									end : end,
									father:"membershipcontractfeessummary"
							}
							if(viewName == "应收总额"){
								url = "eling/elcms/sale/membershipcontract/membershipcontract";
							}else if(viewName == "收款总额"){
								url = "eling/elcms/charge/membershipcontractfeespayment/membershipcontractfeespayment";
							}else if(viewName == "到账总额"){
								url = "eling/elcms/charge/membershipcontractfeesaccountconfirm/membershipcontractfeesaccountconfirm";
							}else if(viewName == "开票总额"){
								url = "eling/elcms/charge/membershipcontractfeesinvoice/membershipcontractfeesinvoice";
							}else if(viewName == "退款总额"){
								url = "eling/elcms/charge/membershipcontractfeesrefundcheckconfirm/membershipcontractfeesrefundcheckconfirm";
							}
							widget.openView({
								url:url,
								params:params,
								isAllowBack:true
								});
						}
					}
				},
				parentNode:".J-list",
				url:"api/report/cardfeemonthstatistics",
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
	module.exports = MemberShipContractFeesSummary;
});