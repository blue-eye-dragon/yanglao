define({
	title : "健康服务工作台",
	dependencies : ["searchMemberByRoomNameCardNO","building","finishStatus","time"],
	top : [{
		id:"healthDailyRecord",
		color:"green",
		icon:"icon-th-list",
		text:"健康日志",
		url:"eling/elcms/health/healthDailyRecord/healthDailyRecord"
	},{
		id:"healthdata",
		color:"purple",
		icon:"icon-user-md",
		text:"健康状态",
		url:"eling/elcms/health/status/status"
	}],
	bottom : [{
		icon:"icon-plus-sign",
		title:"健康",
		columnClass:"col-sm-12 col-md-6",
		columns:[{
			columnClass:"col-sm-6",
			items:[{
				id : "HealthRoutIns",
				path : "eling/elcms/schedule/healthRoutSchedule/healthRoutInsActionWidget"
			},{
				id : "NextExam",
				path : "eling/elcms/health/examrecord/nextExamActionWidget"
			},{
				id : "LeaveHospital",
				path : "eling/elcms/health/patientregistration/leaveHospitalActionWidget"
			}]
		},{
			columnClass:"col-sm-6",
			items:[{
				id : "HealthCheckIn",
				path : "eling/elcms/checkin/healthCheckInActionWidget"
			},{
				id : "EmergencyRescue",
				path : "eling/elcms/ward/emergencyrescue/emergencyRescueWidget"
			},{
				id : "HealthOther",
				path : "eling/elcms/health/healthOtherActionWidget"
			}]
		}]
	}]
});