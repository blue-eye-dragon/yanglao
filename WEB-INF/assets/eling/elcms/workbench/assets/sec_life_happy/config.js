define({
	title : "生活快乐工作台",
	dependencies : ["searchMemberByRoomNameCardNO","building","finishStatus","time"],
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
		id:"lifeDailyRecord",
		color:"orange",
		icon:"icon-bell-alt",
		text:"生活日志",
		url:"eling/elcms/life/lifeDailyRecord/lifeDailyRecord"
	},{
		id:"happinessDailyRecord",
		color:"pink",
		icon:"icon-magic",
		text:"快乐日志",
		url:"eling/elcms/happiness/happinessDailyRecord/happinessDailyRecord"
	},{
		id:"activitysignup",
		color:"red",
		icon:"icon-refresh",
		text:"活动报名",
		url:"eling/elcms/happiness/activitysignup/activitysignup"
	},{
		id:"repair",
//		color:"muted",
		color:"green",
		icon:"icon-wrench",
		text:"报修",
		url:"eling/elcms/property/repair/repair",
		forward:"workbench"
	},{
		id:"comment",
		color:"blue",
		icon:"icon-comments",
		text:"家属沟通",
		url:"eling/elcms/life/familycommunication/familycommunication",
		forward:"workbench"
	},{
		id:"location",
		color:"purple",
		icon:"icon-map-marker",
		text:"会员定位",
		url:"eling/elcms/location/location",
		forward:"workbench"
	},{
		id:"shiftchange",
		color:"orange",
		icon:"icon-group",
		text:"交接班",
		url:"eling/elcms/community/shiftchange/shiftchange",
		params:{type:"daytime"}
	},{
		id:"emergencyrescue",
		color:"pink",
		icon:"icon-magic",
		text:"紧急求助",
		url:"eling/elcms/ward/emergencyrescue/emergencyrescue"
	},{
        id:"lifemodelmember",
        color:"green",
        icon:"icon-building",
        text:"生活模型",
        url:"eling/elcms/lifemodelmember/lifemodelmember/lifemodelmember"
    }],
	bottom : [{
		icon:"icon-coffee",
		title:"生活",
		columnClass:"col-sm-12 col-md-6",
		columns:[{
			columnClass:"col-sm-6",
			items:[{
				id : "repairAction",
				path : "eling/elcms/property/repairconfirm/repairConfirmActionWidget"
			},{
				id : "dailyRoutineAction",
				path : "eling/elcms/life/routineworkdefine/dailyRoutineActionWidget"
			},{
				id : "advancedAgeAction",
				path : "eling/elcms/life/memberconcern/advancedAgeActionWidget"
			},{
				id : "livingAloneAction",
				path : "eling/elcms/life/memberconcern/livingAloneActionWidget"
			},{
				id : "RepairUnfinish",
				path : "eling/elcms/property/repair/repairUnfinishActionWidget"
			},{
				id : "checkInImplementAction",
				path : "eling/elcms/checkin/ciimplement/checkInImplementActionWidget"
			},{
				id : "familycommunicationAction",
				path : "eling/elcms/life/familycommunication/familycommunicationActionWidget"
			}]
		},{
			columnClass:"col-sm-6",
			items:[{
				id : "goOutReturnAction",
				path : "eling/elcms/life/gooutrecord/goOutReturnActionWidget"
			},{
				id : "shackFinishedAction",
				path : "eling/elcms/life/shack/shackstatusmanage/shackFinishedActionWidget"
			},{
				id : "remindVisaAction",
				path : "eling/elcms/life/visa/remindVisaActionWidget"
			},{
				id : "lifeCheckInAction",
				path : "eling/elcms/checkin/lifeCheckInActionWidget"
			},{
				id : "memberConcernAction",
				path : "eling/elcms/life/memberconcern/memberConcernActionWidget"
			},{
				id : "lifeOtherAction",
				path : "eling/elcms/life/lifeOtherActionWidget"
			}]
		}]
	},{
		icon:"icon-magic",
		title:"快乐",
		columnClass:"col-sm-6 col-md-3",
		columns:[{
			columnClass:"col-sm-12",
			items:[{
				id : "birthdayAction",
				path : "eling/elcms/reports/birthday/birthdayActionWidget"
			},{
				id : "activityNotifyAction",
				path : "eling/elcms/happiness/activity/activityNotifyActionWidget"
			},{
				id : "activitySignupAction",
				path : "eling/elcms/happiness/activitysignup/activitySignupActionWidget"
			},{
				id : "activityHealthStatusAction",
				path : "eling/elcms/happiness/activity/activityHealthStatusActionWidget"
			},{
				id : "happyOtherAction",
				path : "eling/elcms/happiness/happyOtherActionWidget"
			}]
		}]
	}]
});