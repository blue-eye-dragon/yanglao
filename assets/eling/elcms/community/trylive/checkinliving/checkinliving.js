define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var CheckinLiving = BaseView.extend({
		events:{
			"change .J-tryLiveSaleReg" : function(e){

				var card=this.get("card");
				var pkTryLiveSaleReg=$(e.target).find("option:selected").attr("value");
				if(pkTryLiveSaleReg){
					aw.ajax({
						url : "api/trylivesalereg/query",
						type : "POST",
						data : {
							pkTryLiveSaleReg:pkTryLiveSaleReg,
							fetchProperties:"*,customer.*"
						},
						success : function(data){														
							card.setValue("name",data[0].customer.name);
							card.setValue("phoneNumber",data[0].customer.phoneNumber);
							card.setValue("contactInfo",data[0].customer.contactInfo);							
						}	
					
					});
					
				}
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"体验入住",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
							return false;
						}
					}],
					time:{		
						ranges:{
							"今天": [moment().startOf("days"),moment().endOf("days")],
					        "明天": [moment().subtract("days", -1).startOf("days"),moment().subtract("days", -1).endOf("days")],
					        "本月": [moment().startOf("month"), moment().endOf("month")]
						},
						defaultTime:"今天",
						click:function(time){
							widget.get("list").refresh();
						}
					},
					search:function(str) {
		            	   widget.get("list").loading();
							aw.ajax({
								url:"api/checkinliving/search",
								data:{
									s:str,
									properties:"tryLiveBatch.batchcode,peopleQuantity,idCardno,appointPeopleQuantity,appointCheckinDate,appointCheckoutDate,tryLiveSaleReg.pkMembershipCard.name,tryLiveSaleReg.customer.name,roomType.name,appointRoom.number,factRoom.number,livingstatus,tryLiveSaleReg.customer.contactInfo,tryLiveSaleReg.customer.phoneNumber",
								    fetchProperties:"*,tryLiveBatch.batchcode,tryLiveSaleReg.pkMembershipCard.name,tryLiveSaleReg.customer.*,roomType.name,appointRoom.number,factRoom.number,livingstatus"   
								},
								dataType:"json",
								success:function(data){
									widget.get("list").setData(data);
								}
							});
						}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/checkinliving/query",
				params:function(){
					return {
						"appointCheckinDate":widget.get("subnav").getValue("time").start,
						"appointCheckinDateEnd":widget.get("subnav").getValue("time").end,
						livingstatusIn:"Appoint,Checkin",
						fetchProperties:"*,tryLiveBatch.batchcode,roomType.name,tryLiveBatch.*,appointRoom.pkRoom,appointRoom.number,tryLiveSaleReg.pkMembershipCard.name,tryLiveSaleReg.customer.*,tryLiveBatch.tryLiveProduct.pkRoomType,tryLiveBatch.tryLiveProduct.roomType.name,factRoom.number"
					};
				},
				model:{
					columns:[{
						key:"tryLiveBatch.batchcode",
						name:"批次号"
					},{
						key:"tryLiveSaleReg.pkMembershipCard.name",
						name:"体验"+i18ns.get("sale_ship_owner","会员")+i18ns.get("sale_card_name","卡号"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								data.name = data.tryLiveSaleReg.customer.name;
								data.contactInfo = data.tryLiveSaleReg.customer.contactInfo;
								//data.roomType = data.tryLiveBatch.tryLiveProduct.roomType.name;		
								data.phoneNumber = data.tryLiveSaleReg.customer.phoneNumber;
								//data.factRoomName =data.factRoom ? data.factRoom : data.appointRoom;
								data.factRoom = data.factRoom ? data.factRoom : data.appointRoom;
								data.appointRoomName = data.appointRoom.number;	
								//data.checkinDate=data.appointCheckinDate;
								widget.edit("detail",data);
								var roomdata=widget.get("card").getData("factRoom","");
								roomdata.push(data.factRoom);
								widget.get("card").setModel("factRoom",roomdata);
								widget.get("card").setValue("factRoom",data.factRoom);
								return false;
							} 
						}]
					},{
						key:"tryLiveSaleReg.customer.name",
						name:"姓名"
					},{
						key:"tryLiveSaleReg.customer.phoneNumber",
						name:"手机号"
					},{
						key:"tryLiveSaleReg.customer.contactInfo",
						name:"联系方式"
					},{
						key:"idCardno",
						name:"证件号"
					},{
						key:"checkinDate",
						name:"实际入住时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"peopleQuantity",
						name:"实际人数"
					},{
						key:"appointCheckinDate",
						name:"预约入住时间",
						format:"date"
					},{
						key:"appointCheckoutDate",
						name:"预约退房时间",
						format:"date"
					},{
						key:"roomType.name",
						name:"预约房型"
					},{
						key:"factRoom.number",
						name:"实际房间",
					},{
						key:"livingstatus.value",
						name:"状态"
					},{
						key:"livingstatus",
						name:"操作",
						format:"button",
//						format:function(value,row){
//							if(row.livingstatus.key=="Appoint"){
//								return "button";
//							}else{
//								return "";
//							}   
//						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							show:function(data,row){
								if(data.key=="Appoint" || data.key=="Checkin"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								if (!(data.livingstatus.key == "Appoint" || data.livingstatus.key == "Checkin")) {
									Dialog.tip({
										title:data.livingstatus.value + "状态，不能修改!"
									});
									return false;
								}
								data.name = data.tryLiveSaleReg.customer.name;
								data.contactInfo = data.tryLiveSaleReg.customer.contactInfo;
								data.phoneNumber = data.tryLiveSaleReg.customer.phoneNumber;
								//data.roomType = data.tryLiveBatch.tryLiveProduct.roomType.name;	
								//data.factRoomName =data.factRoom ? data.factRoom.number : data.appointRoom.number;
								data.factRoom = data.factRoom ? data.factRoom : data.appointRoom;
								data.appointRoomName = data.appointRoom.number;
								//data.checkinDate=data.appointCheckinDate;
								widget.edit("edit",data);
								var roomdata=widget.get("card").getData("factRoom","");
								roomdata.push(data.appointRoom);
								widget.get("card").setModel("factRoom",roomdata);
								widget.get("card").setValue("factRoom",data.appointRoom);
								widget.get("card").setAttribute("tryLiveBatch","readonly","readonly");
								return false;
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
					widget.save("api/checkinliving/save",$("#tryliving").serialize());
				},
				//取消按钮
  				cancelaction:function(){
  					widget.list2Card(false);
  				},
				model:{
					id:"tryliving",
					items:[{
						name:"pkTryLiving",
						type:"hidden"
					},{
						name:"tryLiveBatch",
						key:"pkTryLiveBatch",
						value:"batchcode,tryLiveProduct.name",
						label:"体验批次",
						url:"api/trylivebatch/query",
						params:{
							fetchProperties:"batchcode,pkTryLiveBatch,tryLiveProduct.name"
						},
						type:"select",
						validate:["required"]
					},{
						name:"tryLiveSaleReg",
						label:"体验"+i18ns.get("sale_ship_owner","会员")+i18ns.get("sale_card_name","卡号"),
						type:"select",
						url:"api/trylivesalereg/query",
						key:"pkTryLiveSaleReg",
						value:"pkMembershipCard.name",
						validate:["required"],
						params:{
							fetchProperties:"*,pkMembershipCard.*",
						}
					},{
						name:"name",
						label:"姓名",
						readonly:true,
						validate:["required"]
					},{
						name:"phoneNumber",
						label:"手机号",
						readonly:true,
						validate:["required"]
					},{
						name:"contactInfo",
						label:"联系方式",
						readonly:true,
					},{
						name:"idCardno",
						label:"证件号",
						validate:["required"]
					},{
						name:"appointPeopleQuantity",
						label:"预约人数",
						readonly:true,
					},{
						name:"peopleQuantity",
						label:"实际人数",
						validate:["required"]
					},{
						name:"deposit",
						label:"押金",
						validate:["required"]
					},{
						name:"roomType",
						label:"房型",
						type:"select",
						value:"name",
						key:"pkRoomType",
						url :"api/roomType/query",
						validate:["required"]
					},{
						name:"appointRoomName",
						label:"预约入住房间",
						validate:["required"],
						readonly:true
					},{
						name:"factRoom",
						label:"实际入住房间",
						type:"select",
						value:"number",
						key:"pkRoom",
						url :"api/room/query",
						params:{
							UseType:"Hotel",
						},
						validate:["required"]					
					},{
						name:"appointCheckinDate",
						label:"预约入住时间",
						type:"date",
						mode:"Y-m-d",
						readonly:true,
					},{
						name:"checkinDate",
						label:"实际入住时间",
						validate:["required"],
						type:"date",
						mode:"Y-m-d H:i"
					},{
						name:"appointCheckoutDate",
						label:"预约退房时间",
						type:"date",
						mode:"Y-m-d",
						readonly:true,
					},{
						name:"pkRoomType",
						type:"hidden"
					},{
						name:"appointRoom",
						value:"pkRoom",
						type:"hidden"
						
					},{
						name:"livingstatus",
						type:"hidden",
						value:"key"
					}]
				}
			};
		}
	});
	module.exports = CheckinLiving;
});