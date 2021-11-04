define({
	title : "健康管理工作台",
	dependencies : ["searchMemberByRoomNameCardNO"],
	top : [{
		id:"apartmentstatus",
		color:"purple",
		icon:"icon-building",
		text:"入住全景",
		url:"eling/elcms/community/apartment/status/status"
	},{
		id:"healthDailyRecord",
		color:"green",
		icon:"icon-th-list",
		text:"健康日志",
		url:"eling/elcms/health/healthDailyRecord/healthDailyRecord"
	},{
		id:"healthdata",
		color:"blue",
		icon:"icon-user-md",
		text:"健康状态",
		url:"eling/elcms/health/status/status"
	},{
		id:"healthDailyRecord",
		color:"orange",
		icon:"icon-th-list",
		text:"药品档案",
		url:"eling/elcms/health/medicine/medicine"
	},{
		id:"healthDailyRecord",
		color:"red",
		icon:"icon-th-list",
		text:"疾病库",
		url:"eling/elcms/health/diseasedetail/diseasedetail"
	},{
		id:"servicemonthreport",
		color:"purple",
		icon:"icon-list-alt",
		text:"服务月报",
		url:"eling/elcms/reports/servicemonthreport/servicemonthreport"
	},{
		id:"activitysignup",
		color:"green",
		icon:"icon-refresh",
		text:"活动发布",
		url:"eling/elcms/happiness/activity/activity",
		params:'{"activityType":"health"}'
	},{
		id:"activiescount",
		color:"blue",
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