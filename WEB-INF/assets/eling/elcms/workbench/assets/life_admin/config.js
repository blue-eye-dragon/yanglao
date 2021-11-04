define({
	title : "生活管理工作台",
	dependencies : ["searchMemberByRoomNameCardNO"],
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
		id:"servicemonthreport",
		color:"green",
		icon:"icon-list-alt",
		text:"服务月报",
		url:"eling/elcms/reports/servicemonthreport/servicemonthreport"
	},{
		id:"livingstatus",
		color:"orange",
		icon:"icon-pencil",
		text:"报修汇总",
		url:"eling/elcms/reports/repairscompleted/repairscompleted"
	},{
		id:"servicemonthreport",
		color:"pink",
		icon:"icon-list-alt",
		text:"维修绩效",
		url:"eling/elcms/reports/repair/repairtime/repairtime"
	},{
		id:"apartmentstatus",
		color:"purple",
		icon:"icon-building",
		text:"暂住审批",
		url:"eling/elcms/life/shack/shackaudit/shackaudit"
	},{
		id:"activitysignup",
		color:"red",
		icon:"icon-refresh",
		text:"活动发布",
		url:"eling/elcms/happiness/activity/activity",
		params:'{"activityType":"life"}'
	},{
		id:"activiescount",
		color:"green",
		icon:"icon-smile",
		text:"活动统计",
		url:"eling/elcms/reports/activitystatistics/activitystatistics"
	},{
        id:"lifemodelmember",
        color:"green",
        icon:"icon-building",
        text:"生活模型",
        url:"eling/elcms/lifemodelmember/lifemodelmember/lifemodelmember"
    }]
});