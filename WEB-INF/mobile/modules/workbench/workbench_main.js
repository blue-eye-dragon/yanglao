require(["../../requirejs/config"],function(){
	require(["eling","hbars!./modules/workbench/workbench"],function(eling,tpl){
		var configs = {
			secretary:{
				life:{
					id:"life",
					title:"生活待办",
					colspan:6,
					items:[{id:"Repair",text:"维修确认",icon:"icon-wrench",color:"#00acec",value:0,show:true},
					       {id:"GoOutReturn",text:"外出返回确认",icon:"icon-lock",color:"#49bf67",value:0,show:true},
					       {id:"DailyRoutine",text:"例行工作",icon:"icon-align-left",color:"#49bf67",value:0,show:true},
					       {id:"ShackFinished",text:"暂住结束确认",icon:"icon-group",color:"#9564e2",value:0,show:true},
					       {id:"AdvancedAge",text:"高龄会员关怀",icon:"icon-h-sign",color:"#f34541",value:0,show:true},
					       {id:"RemindVisa",text:"外籍签证提醒",icon:"icon-money",color:"#f8a326",value:0,show:true},
					       {id:"RemindVisa",parent:"RegisterVisa"},
					       {id:"LivingAlone",text:"独居会员关怀",icon:"icon-heart",color:"#f34541",value:0,show:true},
					       {id:"LifeCheckIn",text:"生活入住代办",icon:"icon-time",color:"#f8a326",value:0,show:true},
					       {id:"RepairUnfinish",text:"超期维修",icon:"icon-wrench",color:"#00acec",value:0,show:true},
					       {id:"MemberConcern",text:"会员关注",icon:"icon-star",color:"#9564e2",value:0,show:true},
					       {id:"CheckInImplement",text:"入住准备",icon:"icon-gift",color:"#00acec",value:0,show:true},
					       {id:"MemberSigning",parent:"CheckInImplement"},
					       {id:"CheckInConfirm",parent:"CheckInImplement"},
					       {id:"CheckInTime",parent:"CheckInImplement"},
					       {id:"CheckInSendCar",parent:"CheckInImplement"},
					       {id:"CheckInTelecom",parent:"CheckInImplement"},
					       {id:"CheckInConfig",parent:"CheckInImplement"},
					       {id:"CheckInNaturalGas",parent:"CheckInImplement"},
					       {id:"MembershipCard",parent:"CheckInImplement"},
					       {id:"FixedAssets",parent:"CheckInImplement"},
					       {id:"CheckInNaturalGasInspected",parent:"CheckInImplement"},
					       {id:"FixedAssetsToInspected",parent:"CheckInImplement"},
					       {id:"MembershipCardRegister",parent:"CheckInImplement"},
					       {id:"CheckInTelecomInspected",parent:"CheckInImplement"},
					       {id:"CheckInConfigInspected",parent:"CheckInImplement"},
					       {id:"MembershipCardInspected",parent:"CheckInImplement"},
					       {id:"LifeOther",text:"其它代办",icon:"icon-time",color:"#49bf67",value:0,show:true}]
				},
				health:{
					id:"health",
					title:"健康待办",
					items:[{id:"HealthRoutIns",text:"健康巡检",icon:"icon-ambulance",color:"#f34541",value:0,show:true},
					       {id:"NextExam",text:"复诊提醒",icon:"icon-stethoscope",color:"#f8a326",value:0,show:true},
					       {id:"LeaveHospital",text:"住院确认",icon:"icon-rocket",color:"#49bf67",value:0,show:true},
					       {id:"HealthCheckIn",text:"健康入住待办",icon:"icon-hospital",color:"#00acec",value:0,show:true},
					       {id:"EmergencyRescue",text:"紧急求助处理",icon:"icon-group",color:"#f34541",value:0,show:true},
					       {id:"HealthOther",text:"其它待办",icon:"icon-user-md",color:"#9564e2",value:0,show:true}]
				},
				happiness:{
					id:"happiness",
					title:"快乐待办",
					items:[{id:"Birthday",text:"生日",icon:"icon-gift",color:"#f34541",value:0,show:true},
					       {id:"ActivityNotify",text:"活动发布通知",icon:"icon-stethoscope",color:"#f8a326",value:0,show:true},
					       {id:"ActivitySignup",text:"活动报名提醒",icon:"icon-ok",color:"#f8a326",value:0,show:true},
					       {id:"ActivityHealthStatus",text:"活动健康状态确认",icon:"icon-plus-sign-alt",color:"#49bf67",value:0,show:true},
					       {id:"HappyOther",text:"其它待办",icon:"icon-time",color:"#9564e2",value:0,show:true}]
				}
			}
		};
		var role = eling.getParameter("role") || "secretary";
		var type = eling.getParameter("type");
		var config = configs[role][type];
		$("body").html(tpl(config));
		
		//组织查询参数
		var items = config.items,typeIn = "",typeMap = {}, i;
		for(i=0;i<items.length;i++){
			typeIn += items[i].id+",";
			typeMap[items[i].id] = items[i];
		}
		
		//发送请求查询数据
		$.ajax({
			url:"api/action/queryCount",
			data:{
				building:"1",
				unfinished:true,
				date:moment().startOf("days").valueOf(),
				dateEnd:moment().endOf("days").valueOf(),
				targetType:"Building",
				pkTarget:"1",
				typeIn:typeIn.substring(0,typeIn.length-1)
			},
			success:function(data){
				for(i=0;i<data.length;i++){
					var id = data[i].type.key;
					var item = typeMap[id];
					if(item.parent){
						//有父亲，则说明这是一个需要累加的字段
						var oldCount = parseInt($(".J-"+item.parent+" h3.title").text());
						var newCount = oldCount+data[i].count;
						$(".J-"+item.parent+" h3.title").text(newCount);
					}else{
						$(".J-"+id+" h3.title").text(data[i].count);
					}
				}
			}
		});
	});
});