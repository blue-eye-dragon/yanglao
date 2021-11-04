define(function(require,exports,module){
	return {
		id:"ImportantRepair",
		icon:"icon-wrench",
		text:"重大维修（未结束）",
		color:"text-primary",
		count:{
			url:"api/repair/queryCount",
			params:function(subnavParams){
				return {
					ifSignificant:"true",
					"orderString":"repairNo",
					"repairDetails.operateType":"RepairClaiming",
					flowStatusIn:"Unarrange,Unrepaired,Unconfirmed,Init",
				};
			}
		},
		handler:{
			url:"eling/elcms/property/repairprogressquery/repairprogressquery",
			params:function(subnavParams){
				return {
					ifSignificant:"true",
					"orderString":"repairNo",
					"repairDetails.operateType":"RepairClaiming",
					flag:true,
					flowStatusIn:"Unarrange,Unrepaired,Unconfirmed,Init",
				};
			}
		}		
	};
});