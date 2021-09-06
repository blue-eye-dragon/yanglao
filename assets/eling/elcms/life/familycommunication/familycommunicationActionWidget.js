define(function(require,exports,module){
	return {
		//图标
		icon:"icon-remove",
		text:"未沟通",
		color:"text-red",
		count:{
			url:"api/familycommunication/queryUncommunictionMember",
			params:function(subnavParams){
				return {
					"memberSigning.room.building.pkBuilding" : subnavParams.building,
					"member.memberSigning.room.building.pkBuilding" : subnavParams.building,
					statusIn: "Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
					recordDate : moment(subnavParams.time.start).startOf("month").valueOf(),
					recordDateEnd : moment(subnavParams.time.end).endOf("month").valueOf(),
				};
			}
		},
		handler:{
			url:"eling/elcms/schedule/familycommunicationActionToDoList/familycommunicationActionToDoList",
			params:function(subnavParams){
				return {
					pkBuilding : subnavParams.building,
					statusIn: "Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
					recordDate : moment(subnavParams.time.start).startOf("month").valueOf(),
					recordDateEnd : moment(subnavParams.time.end).endOf("month").valueOf(),
				};
			}
		}		
	};
});