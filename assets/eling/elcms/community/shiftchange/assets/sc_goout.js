define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
		key:"member.personalInfo.name",
		name:"会员"
	},{
		key:"member.memberSigning.room.number",
		name:"房间号"
	},{
		key:"outDate",
		name:"出行日期",
		format:"date"
	},{
		key:"backDate",
		name:"返回日期",
		format:"date"
	},{
		key:"status",
		name:"状态",
		format:function(value,row){
			if(value == "Out"){
				return "出行";
			}
			else if(value == "back"){
				return "已返回";
			}
			else{
				return "";
			}
		}
	},{
		key:"accompanyPerson",
		name:"同行人员"
	},{
		key:"recordPerson.name",
		name:"记录人"
	}];
	var SC_goout={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-goout",
				url:"api/gooutrecord/query",
				params:function(){
					return {
						"member.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
						outDate:params.startdate,
				//		outDateEnd:params.enddate,
						fetchProperties:"outDate,backDate,status,member.personalInfo.name,member.memberSigning.room.number,recordPerson.name"
					};
				},
				model:{
					head:{
						title:"外出记录"
					},
					columns:columns
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				autoRender:false,
				isInitPageBar:false,
				parentNode:".J-goout-print",
				model:{
					head:{
						title:"外出记录"
					},
					columns:columns
				}
			});
		}
	};
	
	module.exports=SC_goout;
});