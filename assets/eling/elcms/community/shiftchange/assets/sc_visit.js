define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
			key:"member.memberSigning.room.number",
				name:"房间号"
			},{
			key:"member.personalInfo.name",
			name:"会员姓名"
		},{
			key:"visitorTime",
			name:"来访时间",
			format:"date"
		},{
			key:"numberOfPeople",
			name:"人数"
		},{
			key:"relationship",
			name:"与会员关系",
		},{
			key:"creator.name",
			name:"记录人"
		}];
	var SC_handover={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-member-visit",
				url:"api/visitorrecord/query",
				params:function(){
					return {
						"member.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
						visitorTime:params.startdate,
						visitorTimeEnd:params.enddate,
						fetchProperties:"visitorTime,numberOfPeople,relationship,member.memberSigning.room.number,member.personalInfo.name,creator.name"
					};
				},
				model:{
					head:{
						title:"来访记录"
					},
					columns:columns
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				autoRender:false,
				isInitPageBar:false,
				parentNode:".J-member-visit-print",
				model:{
					head:{
						title:"来访记录"
					},
					columns:columns
				}
			});
		}
	
	};
	
	
	module.exports=SC_handover;
});