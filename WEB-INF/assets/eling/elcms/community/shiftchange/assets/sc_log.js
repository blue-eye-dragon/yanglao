define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
		col:1,
		key:"member.memberSigning.room.number",
		name:"房间"
	},{
		col:1,
		key:"member.personalInfo.name",
		name:"姓名"
	},{
		col:6,
		key:"record",
		name:"描述"
	},{
		col:1,
		key:"recorder.name",
		name:"记录人"
	}];
	var SC_member_interview={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-member-log",
				url:"api/memberdailyrecord/query",
				params:function(){
					var param = {
						typeIn:["Health","Life","Happy"],
						"member.memberSigning.room.building.pkBuilding":params.type=="daytime" ? widget.get("subnav").getValue("building") :"",
						date:params.type=="daytime" ?params.startdate:params.startdate+16.5*60*60*1000,
						dateEnd:params.type=="daytime" ?params.enddate:params.enddate+8.5*60*60*1000,
						fetchProperties:"record,member.memberSigning.room.number,member.personalInfo.name,recorder.name"
					};
					if(param.type!="daytime"){
						params["recorder.roles"] = "11";
					}
					return param;
				},
				model:{
					head:{
						title:"会员情况记录"
					},
					columns:columns
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				parentNode:".J-member-log-print",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:"会员情况记录"
					},
					columns:columns
				}
			});
		}
	};
	
	module.exports=SC_member_interview;
});