define(function(require,exports,module){
	var i18ns = require("i18n");
	module.exports = {
			title : "财务工作台",
			top : [{
				id:"annualfeeaccountconfirm",
				color:"green",
				icon:"icon-xing-sign",
				text:"服务费确认",
				url:"eling/elcms/charge/annualfeeaccountconfirm/annualfeeaccountconfirm"
			},{
				id:"annualfeeinvoice",
				color:"purple",
				icon:"icon-ticket",
				text:"服务费开票",
				url:"eling/elcms/charge/annualfeeinvoice/annualfeeinvoice"
			},{
				id:"annualfeerefundconfirm",
//				color:"red",
				color:"muted",
				icon:"icon-xing-sign",
				text:"服务费退款确认",
				url:"" 
			},{
				id:"membershipcontractfeesaccountconfirm",
				color:"blue",
				icon:"icon-thumbs-up",
				text: i18ns.get("sale_shipfees_contract","卡")+"费确认",
				url:"eling/elcms/charge/membershipcontractfeesaccountconfirm/membershipcontractfeesaccountconfirm"
			},{
				id:"membershipcontractfeesinvoice",
				color:"orange",
				icon:"icon-ticket",
				text:i18ns.get("sale_shipfees_contract","卡")+"费开票",
				url:"eling/elcms/charge/membershipcontractfeesinvoice/membershipcontractfeesinvoice"
			},{
				id:"membershipcontractfeesrefundcheckconfirm",
				color:"red",
				icon:"icon-thumbs-up",
				text:i18ns.get("sale_shipfees_contract","卡")+"退款确认",
				url:"eling/elcms/charge/membershipcontractfeesrefundcheckconfirm/membershipcontractfeesrefundcheckconfirm"
			},{
				id:"depositarrivalconfirm",
				color:"green",
				icon:"icon-check-sign",
				text:"预约金确认",
				url:"eling/elcms/charge/depositarrivalconfirm/depositarrivalconfirm"
			},{
				id:"depositrefundconfirm",
				color:"purple",
				icon:"icon-check-sign",
				text:"预约金退款确认",
				url:"eling/elcms/charge/depositrefundconfirm/depositrefundconfirm"
			}],
			bottom : [{
				icon:"icon-star",
				title:"社区关注",
				columnClass:"col-sm-12 col-md-6",
				columns:[{
					columnClass:"col-sm-6",
					items:[{
						id : "Annualfeemonthstatistics",
						path : "eling/elcms/reports/annualfeemonthstatistics/annualFeeMonthStatisticsWidget"
					},{
						id : "Membershipcontractfeessummary",
						path : "eling/elcms/charge/membershipcontractfeessummary/membershipContractFeesSummaryWidget"
					},{
						id : "Depositsummary",
						path : "eling/elcms/reports/depositsummary/depositSummaryWidget"
					}]
				}]
			}]		
	}
});