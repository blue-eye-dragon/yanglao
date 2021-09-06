define({
	title : "服务商工作台",
	dependencies : ["finishStatus","time"],
	top : [{
		id:"repair",
		color:"blue",
		icon:"icon-legal",
		text:"维修派工",
		url:"eling/elcms/property/repairdispatch/repairdispatch"
	},{
		id:"apartment",
		color:"purple",
		icon:"icon-thumbs-up-alt",
		text:"维修完成",
		url:"eling/elcms/property/repairend/repairend"
	},{
		id:"apartment",
		color:"red",
		icon:"icon-search",
		text:"维修查询",
		url:"eling/elcms/property/repairprogressquery/repairprogressquery"
	},{
		id:"repairtime",
		color:"pink",
		icon:"icon-list-alt",
		text:"维修绩效",
		url:"eling/elcms/reports/repair/repairtime/repairtime"
	}],
	bottom : [{
		icon:"icon-coffee",
		title:"工作任务",
		columnClass:"col-sm-12 col-md-6",
		columns:[{
			columnClass:"col-sm-6",
			items:[{
				id : "RepairUnarrangeService",
				path : "eling/elcms/property/repairdispatch/repairUnarrangeActionWidget"
			},{
				id : "RepairUnrepaireService",
				path : "eling/elcms/property/repairend/repairUnrepaireActionWidget"
			},{
				id : "RepairUnfinishService",
				path : "eling/elcms/property/repair/repairUnfinishActionWidget"
			}]
		}]
	}]
});