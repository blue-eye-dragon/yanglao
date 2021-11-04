 define({
	title : "总裁工作台",
	dependencies : ["searchMemberByRoomNameCardNO","time"],
	top : [{
		id:"apartmentstatus",
		color:"purple",
		icon:"icon-building",
		text:"入住全景",
		url:"eling/elcms/community/apartment/status/status"
	},{
		id:"livingstatus",
		color:"blue",
		icon:"icon-pencil",
		text:"入住状态",
		url:"eling/elcms/community/livingstatus/livingstatus"
	},{
		id:"salestatus",
		color:"green",
		icon:"icon-qrcode",
		text:"销售全景",
		url:"eling/elcms/sale/salestatus/salestatus"
	},{
		id:"salemonthreport",
		color:"orange",
		icon:"icon-signal",
		text:"销售月报",
		url:"eling/elcms/sale/salemonthreport/saleMonthReport"
	},{
		id:"annualfeesmonthreport",
		color:"blue",
		icon:"icon-bar-chart",
		text:"服务费月报",
		url:"eling/elcms/reports/annualfeemonthstatistics/annualfeemonthstatistics"
	},{
		id:"energyfees",
//		color:"muted",
		color:"purple",
		icon:"icon-sun",
		text:"能源月报", 
		url:"eling/elcms/reports/energysourcereport/energysourcereport"
	},{
		id:"changeroomannualsummary",
		color:"green",
		icon:"icon-th-list",
		text:"换房年报",
		url:"eling/elcms/checkout/changeroomannualsummary/changeroomannualsummary"			
	},{
		id:"servicemonthreport",
		color:"blue",
		icon:"icon-list-alt",
		text:"服务月报",
		url:"eling/elcms/reports/servicemonthreport/servicemonthreport"
	},{
		id:"memberrelational",
		color:"green",
		icon:" icon-heart",
		text:"会员友好关系",
		url:"eling/elcms/happiness/memberrelational/memberrelational"
	},{
		id:"dutySchedulingList",
		color:"pink",
		icon:"icon-sitemap",
		text:"每日值班报表",
		url:"eling/elcms/schedule/dutySchedulingList/dutyScheduleWithBuilding",
		params:{
			"editable":false
		}
		
	},{
		id:"capitaldaily",
		color:"orange",
		icon:"icon-money",
		text:"资金日报",
		url:"eling/elcms/capitaldaily/capitaldaily"
	},{
        id:"lifemodelmember",
        color:"green",
        icon:"icon-building",
        text:"生活模型",
        url:"eling/elcms/lifemodelmember/lifemodelmember/lifemodelmember"
    }],
	bottom : [{
		icon:"icon-coffee",
		title:"社区关注",
		columnClass:"col-sm-12 col-md-6",
		columns:[{
			columnClass:"col-sm-6",
			items:[{
				id : "ImportantRepair",
				path : "eling/elcms/property/repair/importantRepairWidget"
			},{
				id : "EmergencyRescueComminity",
				path : "eling/elcms/ward/emergencyrescue/emergencyRescueWidget"
			},{
				id : "MemberDecease",
				path : "eling/elcms/health/deceasedmemberregistration/memberDeceaseWidget"
			},
			{
				id : "activityStatistics",
				path : "eling/elcms/reports/activitystatistics/activityStatisticsWidget"
			},{
				id : "checkInMemberCount",
				path : "eling/elcms/membercenter/checkinmemberdetail/checkInMemberWidget"
			}]
		},{
			columnClass:"col-sm-6",
			items:[
			  {
				id : "diseasestatiscsButtonWidget",
				path : "eling/elcms/reports/diseasestatiscs/widget/diseasestatiscsbuttonWidget"
			},
			{
				id : "memberConcern",
				path : "eling/elcms/reports/memberconcernreport/memberConcernReportWidget"
			},
			{
				id : "countPatient",
				path : "eling/elcms/reports/directorremind/widget/countPatientWidget"
			},{
				id : "countBirth",
				path : "eling/elcms/reports/directorremind/widget/countBirthWidget"
			},{
				id : "countGoOut",
				path : "eling/elcms/reports/directorremind/widget/countGoOutWidget"
			},
			{
				id : "memberbehospitalizedsituation",
				path : "eling/elcms/health/memberbehospitalizedsituation/memberBeHospitalizedSituationWidget"
			}]
		}]
	}]
});