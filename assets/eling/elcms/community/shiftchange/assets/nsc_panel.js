define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
			className:".el-shiftchange.nsc_panel.width_building",
			key:"building.name",
				name:"楼号"
			},{
			key:"countHouse",
			name:"入住户数",
			format:function(row,value){
				if(!value.countHouse){
					return "0";
				}else{
					return value.countHouse;
				}
			}
		},{
			key:"countMan",
			name:"男会员",
			format:function(row,value){
				if(!value.countMan){
					return "0";
				}else{
					return value.countMan;
				}
			}
		},{
			key:"countWoman",
			name:"女会员",
			format:function(row,value){
				if(!value.countWoman){
					return "0";
				}else{
					return value.countWoman;
				}
			}
		},{
			key:"countAllMem",
			name:"会员总数",
			format:function(row,value){
				return value.countWoman+value.countMan;
			}
		},{
			key:"countNewHouse",
			name:"新会员户数",
			format:function(row,value){
				if(!value.countNewHouse){
					return "0";
				}else{
					return value.countNewHouse;
				}
			}
		},{
			key:"countNewMember",
			name:"新会员数",
			format:function(row,value){
				if(!value.countNewMember){
					return "0";
				}else{
					return value.countNewMember;
				}
			}
		},{
			key:"countOut",
			name:"外出",
			format:function(row,value){
				if(!value.countOut){
					return "0";
				}else{
					return value.countOut;
				}
			}
		},{
			key:"countInHospital",
			name:"住院",
			format:function(row,value){
				if(!value.countInHospital){
					return "0";
				}else{
					return value.countInHospital;
				}
			}
		},{
			key:"countPartner",
			name:"陪住人数",
			format:function(row,value){
				if(!value.countPartner){
					return "0";
				}else{
					return value.countPartner;
				}
			}
		},{
			key:"countDied",
			name:"过世",
			format:function(row,value){
				if(!value.countDied){
					return "0";
				}else{
					return value.countDied;
				}
			}
		},{
			key:"countinNursingHome",
			name:"颐养",
			format:function(row,value){
				if(!value.countinNursingHome){
					return "0";
				}else{
					return value.countinNursingHome;
				}
			}
		},{
			key:"countRealNum",
			name:"实际",
			format:function(row,value){
				return (value.countWoman+value.countMan)-(value.countOut+value.countInHospital+value.countDied+value.countinNursingHome);
			}
		}];
	
	var NSC_panel={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-member-npanel",
				url:"api/shiftchange/queryForSummy",
				params:function(){
					var timeStart,timeEnd;
					if(moment().isSame(params.startdate,"days")){
							timeStart=params.startdate+12*60*60*1000;
							timeEnd=params.enddate;
					}else{
						timeStart=params.startdate-12*60*60*1000;
						timeEnd=params.startdate;
					}	
					return {
						FinishWorkDate:timeStart,
						FinishWorkDateEnd:timeEnd,
					};
				},
				fetchProperties:"*,building.name",
				model:{
					head:{
						title:"公寓入住情况汇总"
					},
					columns:columns
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				parentNode:".J-member-npanel-print",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:"公寓入住情况汇总"
					},
					columns:columns
				}
			});
		}
		
	};
	
	
	module.exports=NSC_panel;
});