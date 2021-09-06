define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
		key:"member.personalInfo.name",
		name:"会员"
	},{
		key:"member.memberSigning.room.number",
		name:"房间号"
	},{
		key:"activity.theme",
		name:"活动主题"
	},{
		key:"activity.activitySite",
		name:"活动地点"
	}
	];
	
	var SC_activity={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-member-activity",
				url:"api/activitysignup/queryToDay",
				params:function(){
					return{
					"activity.activityStartTime":params.enddate,
					"activity.activityEndTime":params.startdate,
					"member.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),	
					fetchProperties:"member.memberSigning.room.number,member.personalInfo.name,activity.theme,activity.activitySite"
					};
				},
				model:{
					head:{
						title:"参加活动记录"
					},
					columns:columns
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				autoRender:false,
				isInitPageBar:false,
				parentNode:".J-member-activity-print",
				model:{
					head:{
						title:"参加活动记录"
					},
					columns:columns
				}
			});
		}
		
	};
	
	module.exports=SC_activity;
});