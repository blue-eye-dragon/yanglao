define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");

	var CheckInNursingHomeRegistered = BaseView.extend({
		events:{
			"change .J-form-checkinnursingHomeregistered-select-member":function(e){
				var widget = this;
				var card = widget.get("card");
				var pkMember = card.getValue("member");
				if(pkMember){
					var member = card.getData("member",{
						pk:pkMember
					});
					if(member.status.key !="Normal"){
							Dialog.alert({
								content:"当前"+i18ns.get("sale_ship_owner","会员")+"不是在住园区状态，不能增加颐养记录！"
							})
							card.setValue("member",{});
							return;
						}
				}
				
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"入住颐养院登记",
					buttonGroup:[{
						id:"building",
						showAll:true,
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				autoRender:false,
				url : "api/checkinnursinghomeregistered/query",
				fetchProperties:"*," +
						"member.personalInfo.name," +
						"member.memberSigning.room.number," +
						"member.memberSigning.room.pkRoom",
				params:function(){
					return {
						pkBuilding:widget.get("subnav").getValue("building")
					};
				},
				model:{
					columns:[{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								data.room=data.member.memberSigning.room.number;
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"checkInDate",
						name:"入住日期",
						format:"date"
					},{
						key:"checkOutDate",
						name:"返回日期",
						format:"date"
					},{
						key:"roomNumber",
						name:"颐养院房间号"
					},{
						key:"causes",
						name:"入住原因"
					},{
						key:"checkinType.value",
						name:"入住类型"
					},{
						key:"status.value",
						name:"住院状态"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								data.room=data.member.memberSigning.room.number;
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/checkinnursinghomeregistered/" + data.pkCheckInNursingHomeRegistered + "/delete");
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/checkinnursinghomeregistered/save",$("#checkinnursingHomeregistered").serialize(),function(data){
						if(data.msg == "该"+i18ns.get("sale_ship_owner","会员")+"已在颐养院中"){
							Dialog.alert({
								content:"该"+i18ns.get("sale_ship_owner","会员")+"已在颐养院中"
							});
							return {
								forward:false
							};
						}
						else{
							widget.get("list").refresh();
						}
					});
				},
				model:{
					id:"checkinnursingHomeregistered",
					items:[{
						name:"pkCheckInNursingHomeRegistered",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
								"memberSigning.status":"Normal",
								"memberSigning.houseingNotIn" : false,
								"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number,status"
							};
						},
						type:"select",
						validate:["required"]
					},{
						name:"checkInDate",
						label:"入住日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"checkOutDate",	
						label:"返回日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"roomNumber",
						label:"颐养院房间号",
						validate:["required"]
					},{
						name:"causes",
						label:"入住原因",
						type:"textarea"
					},{
						name:"checkinType",
						label:"入住类型",
						type:"select",
						options:[{key:"CHECROUT",value:"退房入住"},{key:"BUYINGDIRECT",value:"买卡直接入住"},{key:"ROOMRESERVATION",value:"房间保留入住"}],
						validate:["required"]
					},{
						name:"status",
						label:"住院状态",
						type:"select",
						validate:["required"],
						options:[{
							key:"BeInHospital",
							value:"已入住"
						},{
							key:"LeaveHospital",
							value:"已出院"
						}]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		},
		afterInitComponent:function(params){
			this.get("list").refresh(params);
		}
	});
	module.exports = CheckInNursingHomeRegistered;
});