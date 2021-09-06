define(function(require,exports,module){
	var Panel=require("panel");
	
	var SC_panel={
		init:function(widget,params){
			return new Panel({
				parentNode:".J-panel",
				url:"api/checkin/status",
				params:function(){
					return {
						pkBuilding:params.type=="daytime" ? widget.get("subnav").getValue("building") :"",
						date:params.startdate
					};
				},
				model:{
					labelWidth:55,
					valueWidth:40,
					items:[{
						id:"countHouse",
						name:"room.checkIn",
						label:"入住户数"
					},{
						id:"countMan",
						name:"member.checkinman",
						label:"男会员"
					},{
						id:"countWoman",
						name:"member.checkinwomen",
						label:"女会员"
					},{
						id:"countAll",
						name:"member.checkintotal",
						label:"会员总数"
					},{
						id:"countNewHouse",
						name:"member.housesMonth",
						label:"新会员户数"
					},{
						id:"countNewMember",
						name:"member.totalMonth",
						label:"新会员人数"
					},{
						id:"countOut",
						name:"member.goOut",
						label:"外出"
					},{
						id:"countInHospital",
						name:"member.inHospital",
						label:"住院"
					},{
						id:"countPartner",
						name:"member.accompany",
						label:"陪住人数"
					},{
						id:"countDied",
						name:"member.passAway",
						label:"过世"
					},{
						id:"countinNursingHome",
						name:"member.inNursingHome",
						label:"颐养"
					},{
						name:"countReal",
						label:"实住",
						format:function(row,value){
							return (value.member.checkinman+value.member.checkinwomen)-(value.member.goOut+value.member.inHospital+value.member.inNursingHome+value.member.passAway);
							
						}
							
					}]
				}
			});
		}
	};
	
	module.exports=SC_panel;
	
});