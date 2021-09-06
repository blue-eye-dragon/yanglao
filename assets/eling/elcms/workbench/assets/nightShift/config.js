define({
	title : "夜班秘书工作台",
	dependencies : ["finishStatus","time"],
	top : [{
		id:"healthDailyRecord",
		color:"green",
		icon:"icon-star",
		text:"健康日志",
		url:"eling/elcms/health/healthDailyRecord/healthDailyRecord"
	},{
		id:"lifeDailyRecord",
		color:"orange",
		icon:"icon-bell-alt",
		text:"生活日志",
		url:"eling/elcms/life/lifeDailyRecord/lifeDailyRecord"
	},{
		id:"repair",
//		color:"muted",
		color:"pink",
		icon:"icon-wrench",
		text:"报修",
		url:"eling/elcms/property/repair/repair",
		forward:"workbench"
	},{
		id:"shiftchange",
		color:"blue",
		icon:"icon-group",
		text:"交接班",
		url:"eling/elcms/community/shiftchange/shiftchange",
		params:{type:"night"}
	},{
		id:"nightsecretarysign",
		color:"purple",
		icon:"icon-pencil",
		text:"夜班考勤",
		url:"eling/elcms/life/nightsecretarysign/nightsecretarysign",
	},{
		id:"emergencycontac",
		color:"red",
		icon:"icon-exclamation-sign",
		text:"紧急查询",
		url:"eling/elcms/membercenter/emergencycontact/emergencycontact",
	}],
	bottom : [{
		icon:"icon-coffee",
		title:"工作任务",
		columnClass:"col-sm-12 col-md-6",
		columns:[{
			columnClass:"col-sm-6",
			items:[{
				id : "NightRoutIns",
				path : "eling/elcms/life/nightinspectiondefine/nightRoutInsActionWidget"
			}]
		}]
	}]
});