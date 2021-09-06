define(function(require,exports,module){
	return {
		//图标
		icon:"icon-key",
		text:"入住准备",
		color:"text-primary",
		count:{
			url:"api/action/queryCountByType",
			params:function(subnavParams){
				return {
					typeIn : "CheckInImplement, MemberSigning, CheckInTime, CheckInTelecom, CheckInConfig, CheckInSendCar, " +
					"CheckinOrderFlowers, CheckinSendFlowers, MembershipCard, FixedAssets, CheckInNaturalGas, " +
					"CheckInConfirm, CheckInNaturalGasInspected, FixedAssetsToInspected, CheckInConfigInspected, " +
					"CheckInTelecomInspected, MembershipCardRegister, MembershipCardInspected",
					targetType : "Building",
					pkTarget : subnavParams.building,
					building : subnavParams.building,
					unfinished : subnavParams.status,
					date : subnavParams.time.start,
					dateEnd : subnavParams.time.end
				};
			}
		},
		handler:{
			url:"eling/elcms/schedule/workTaskToDoList/workTaskToDoList",
			params:function(subnavParams){
				return {
					id:"CheckInImplement",
					typeIn : "CheckInImplement, MemberSigning, CheckInTime, CheckInTelecom, CheckInConfig, CheckInSendCar, " +
					"CheckinOrderFlowers, CheckinSendFlowers, MembershipCard, FixedAssets, CheckInNaturalGas, " +
					"CheckInConfirm, CheckInNaturalGasInspected, FixedAssetsToInspected, CheckInConfigInspected, " +
					"CheckInTelecomInspected, MembershipCardRegister, MembershipCardInspected",
					targetType : "Building",
					pkTarget : subnavParams.building,
					building : subnavParams.building,
					unfinished : subnavParams.status,
					date : subnavParams.time.start,
					dateEnd : subnavParams.time.end
				};
			}
		}		
	};
});