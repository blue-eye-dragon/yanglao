/**
 * 退卡年报
 */
define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
	var ReportGrid=require("reportgrid");
	var checkoutcardannualsummary={
			init:function(widget,params){
			return new ReportGrid({
				parentNode:params.parentNode,
				isInitPageBar:false,
				autoRender : false,
				url:"api/bowoutmembershipcontractapply/checkoutcardannualsummary",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						year:subnav.getValue("year"),
						checkInType:widget.get("subnav").getValue("checkInType"),
						pkCardType:widget.get("subnav").getValue("cardType"),
					};
				},
				model:{
					datas : {
						id : "data",
						cols : [{},{},{
							format : "thousands",
							className : "text-right"
						},{
							format : "thousands",
							className : "text-right"
						}],
						click : function(data){
								if(data.data == "0" || data.data == "0.00" || data.data == "0.0"){
									return false;
								}
								var year = widget.get("subnav").getValue("year");
								var month = data.colName;
								var start;
								var end;
								var flowStatus;
								if(data.rowNameSon == "审批中"){
									flowStatus = "Approvaling";
								}else{
									flowStatus = "Approved";
								}
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
								widget.openView({
									url:"eling/elcms/sale/bowoutmembershipcontract/bowoutmembershipcontractapproval/bowoutmembershipcontractapproval",
									params:{
										start : start,
										end : end,
										cardType:widget.get("subnav").getValue("cardType"),
										flowStatus:flowStatus,
										checkInType:widget.get("subnav").getValue("checkInType"),
										father:"checkoutcardannualsummary"
									},
									isAllowBack:true
								});
						}
					}
				},
			});
		}
	}
	module.exports = checkoutcardannualsummary;
});