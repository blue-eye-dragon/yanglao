define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var ChangeRoomApply = BaseView.extend({
		events:{
			"change .J-member":function(e){
				var card=this.get("card");
				var pk=card.getValue("member");
				if(pk){
					aw.ajax({
						url : "api/member/query",
						type : "POST",
						data : {
							pkMember:pk,
							fetchProperties:"*,memberSigning.room.number"
						},
						success:function(data){
							card.setValue("roomnumber",data[0].memberSigning.room.number);
						}
					});
				}
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"换房申请",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					
					},{
						id:"datetime",
						items:[{
		                    key:"0",
		                    value:"本月"
						},{
		                    key:"1",
		                    value:"三月内"
						},{
							key:"2",
		                    value:"半年内"
						},{
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
		   			 id:"flowStatusIn",
						items:[{
							key:"Submit",
							value:"提交"
						},{
							key:"Approval",
							value:"通过"
						},{
							key:"Reject",
							value:"驳回"
						}],
						handler:function(key,element){								
							widget.get("list").refresh();
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/changeroomapply/query",
				fetchProperties:"*,member.personalInfo.name,member.personalInfo.pkPersonalInfo,member.memberSigning.room.number,newRoom.pkRoom,newRoom.number,creator.name",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						datetime:subnav.getValue("datetime"),
						"member.memberSigning.room.building":subnav.getValue("building"),
						flowStatusIn:subnav.getValue("flowStatusIn")
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
								widget.edit("detail",data);
							}
 						}]
 					},{
						key:"member.memberSigning.room.number",
						name:"原房间号"
					},{
						key:"newRoom.number",
						name:"新房间号 "
					},{
						key:"changeRoomDate",
						name:"换房日期 ",
						format:"date"
					},{
						key:"createTime",
						name:"申请日期 ",
						format:"date"					  
					},{
						key:"creator.name",
						name:"创建人"
					},{
 						key:"flowStatus.value",
 						name:"状态"
 					},{

 						key:"operate",
						name:"操作",
						format:function(value,row){
							if(row.flowStatus.key=="Submit"){
								return "button";
							}else{
								return "";
							}   
 						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/changeroomapply/" + data.pkChangeRoomApply + "/delete");
							}
						}]
					
 					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					var data=$("#changeroomapply").serializeArray();						
					var changeRoomDate = moment(data[5].value).valueOf();				
					var createtime = moment().valueOf() - 86400000;
					if(changeRoomDate < createtime){
           			 	Dialog.tip({
							title:"换房日期不能在申请日期之前！"
						});
           		 	}else {
           		 		widget.save("api/changeroomapply/save",$("#changeroomapply").serialize());
           		 	}
				},
				model:{
					id:"changeroomapply",
					items:[{
						name:"pkChangeRoomApply",
						type:"hidden"
					},{
						name:"flowStatus",
						type:"hidden",
						defaultValue:"Submit"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						type:"select",
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						validate:["required"]
					},{
						name:"roomnumber",
						label:"原房间",
						readonly:true
					},{
						name:"newRoom",
						label:"新房间",
						type:"select",
						key:"pkRoom",
						url:"api/room/query",
						params:{
							status:'Empty',
							useType:'Apartment' 
						},
						key:"pkRoom",
						value:"number",
						validate:["required"]
					},{
						name:"changeRoomDate",
						label:"换房日期",
						type:"date",
						mode:"Y-m-d",				
						validate:["required"]
					},{
						name:"description",
						label:"备注",
					}]
				}
			};
		},
	});
	module.exports = ChangeRoomApply;
});