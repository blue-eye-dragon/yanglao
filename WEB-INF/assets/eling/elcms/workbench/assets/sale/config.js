define({
	title : "销售工作台",
	dependencies : ["finishStatus","time"],
	top : [{
		id:"salestatus",
		color:"green",
		icon:"icon-building",
		text:"销售全景",
		url:"eling/elcms/sale/salestatus/salestatus"
	},{ 
		id:"customertrace",
		color:"blue",
		icon:"icon-pencil",
		text:"客户追踪",
		url:"eling/elcms/sale/customertrace/customertrace"
	},{
		id:"customerstatistics",
		color:"purple",
		icon:"icon-comment-alt",
		text:"客户统计",
		url:"eling/elcms/reports/customerstatistics/customerstatistics"
	},{
		id:"returncounttrace",
		color:"red",
		icon:"icon-comment-alt",
		text:"回访次数",
		url:"eling/elcms/sale/returncounttrace/returncounttrace"
	},{
	    id:"assessmentapply",
	    color:"green",
	    icon:"icon-smile",
	    text:"入住评估",
	    url:"eling/elcms/membercenter/assessmentapply/assessmentapply"
	},{
	    id:"memberShipCard",
	    color:"orange",
	    icon:"icon-credit-card",
	    text:"会籍卡",
	    url:"eling/elcms/sale/card/card"
	},{
	    id:"memberSigning",
	    color:"blue",
	    icon:"icon-edit",
	    text:"会籍签约",
	    url:"eling/elcms/sale/membershipcontract/membershipcontract"
	},{
	    id:"personalInfo",
	    color:"red",
	    icon:"icon-user",
	    text:"个人权益人",
	    url:"eling/elcms/sale/people/people"
	},{
	    id:"memberShipCardStatus",
//	    color:"purple",
	    color:"muted",
	    icon:"icon-magic",
	    text:"会籍卡状态",
	    url:""
	}],
	bottom : [{
		icon:"icon-tasks",
		title:"工作任务",
		columnClass:"col-sm-12 col-md-6",
		columns:[{
			columnClass:"col-sm-6",
			items:[{
				id : "Callback",
				path : "eling/elcms/sale/customertrace/callbackActionWidget"
			}]
		}]
	}]
});