define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	var CheckoutLiving = BaseView.extend({
		events:{
			"change .J-tryLiveSaleReg":function(e){
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
//							card.setValue("phoneNumber",data[0].customer.phoneNumber);
							card.setValue("contactInfo",data[0].customer.contactInfo);							
						}	
					
					});
				}
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"体验退房",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
							widget.get("subnav").hide("chooseRoom");
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
								url:"api/checkoutliving/search",
								data:{
									s:str,
									properties:"tryLiveBatch.batchcode,tryLiveSaleReg.pkMembershipCard.name,tryLiveSaleReg.customer.name,tryLiveSaleReg.customer.contactInfo,appointPeopleQuantity,deposit,nnmy,checkinDate,appointRoom.number,livingstatus,appointCheckoutDate,checkoutDate",
								    fetchProperties:"*,tryLiveBatch.batchcode,tryLiveSaleReg.pkMembershipCard.name,tryLiveSaleReg.customer.*,appointRoom.number,factRoom.number,livingstatus,"
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
				url : "api/checkoutliving/query",
				params:function(){
					return {
						"appointCheckoutDate":widget.get("subnav").getValue("time").start,
						"appointCheckoutDateEnd":widget.get("subnav").getValue("time").end,
						livingstatusIn:"Checkout,Checkin",
						fetchProperties:"*,tryLiveBatch.batchcode,tryLiveSaleReg.tryLiveBatch.tryLiveProduct.roomType.name,appointRoom.pkRoom,appointRoom.number,tryLiveBatch.batchcode,tryLiveSaleReg.pkMembershipCard.*,tryLiveSaleReg.customer.*,exclusiveSecretary.name,tryLiveBatch.tryLiveProduct.pkRoomType,tryLiveBatch.tryLiveProduct.roomType.name"
					};
				},
				model:{
					columns:[{
						key:"tryLiveBatch.batchcode",
						name:"批次号"
					},{
						key:"tryLiveSaleReg.pkMembershipCard.name",
						name:"体验卡号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								data.name = data.tryLiveSaleReg.customer.name;
								data.contactInfo = data.tryLiveSaleReg.customer.contactInfo;
								data.factRoomName =data.factRoom ? data.factRoom.number : data.appointRoom.number;
								data.factRoom = data.factRoom ? data.factRoom : data.appointRoom;
								data.appointRoomName = data.appointRoom.number;
//								widget.get("subnav").show("chooseRoom");
								var indate = data.appointCheckinDate;
								if (indate) {
									indate=moment().format("YYYY-MM-DD")
								}
								data.appointCheckinDate = indate;
								widget.get("card").reset();
								widget.edit("detail",data);
								return false;
							} 
						}]
					},{
						key:"tryLiveSaleReg.customer.name",
						name:"姓名"
					},{
						key:"tryLiveSaleReg.customer.contactInfo",
						name:"联系方式"
					},{
						key:"appointPeopleQuantity",
						name:"人数"
					},{
						key:"deposit",
						name:"押金",
					},{
						key:"nnmy",
						name:"金额(元)"
					},{
						key:"checkinDate",
						name:"入住时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"appointCheckoutDate",
						name:"预约退房时间",
						format:"date" 
					},{
						key:"checkoutDate",
						name:"退房时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"appointRoom.number",
						name:"房间"
					},{
						key:"livingstatus.value",
						name:"状态"
					},{
						key:"livingstatus",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							show:function(data,row){
								if(data.key=="Appoint" || data.key=="Cancel"){
									return false;
								}else{
									return true;
								}
							},
							handler:function(index,data,rowEle){
								var d=$(".J-livingstatus.value").val();
								if (!(data.livingstatus.key == "Checkout" || data.livingstatus.key == "Checkin")) {
									Dialog.tip({
										title:data.livingstatus.value + "状态，不能修改!"
									});
									return false;
								}
								data.name = data.tryLiveSaleReg.customer.name;
								data.contactInfo = data.tryLiveSaleReg.customer.contactInfo;
								data.factRoomName =data.factRoom ? data.factRoom.number : data.appointRoom.number;
								data.factRoom = data.factRoom ? data.factRoom : data.appointRoom;
								data.appointRoomName = data.appointRoom.number;
								//data.livingstatus=data.livingstatus.key;
//								widget.get("subnav").show("chooseRoom");
								var indate = data.appointCheckinDate;
								if (indate) {
									indate=moment().format("YYYY-MM-DD")
								}
								data.appointCheckinDate = indate;
								widget.get("card").reset();
								widget.edit("edit",data);
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
					widget.save("api/checkoutliving/save",$("#tryliving").serialize());
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
						label:"体验卡号",
						type:"select",
						url:"api/trylivesalereg/query",
						key:"pkTryLiveSaleReg",
						value:"pkMembershipCard.name",
						validate:["required"],
						params:{
							fetchProperties:"*,pkMembershipCard.*"
						}
					},{
						name:"name",
						label:"姓名",
						readonly:true
					},{
						name:"contactInfo",
						label:"联系方式",
						readonly:true
					},{
						name:"idCardno",
						label:"身份证",
					},{
						name:"peopleQuantity",
						type:"hidden",
					},{
						name:"appointPeopleQuantity",
						type:"hidden",
					},{
						name:"checkinDate",
						label:"入住时间",
						type:"date",
						mode:"Y-m-d H:i"
					},{
						name:"deposit",
						label:"押金",
						readonly:true
					},{
						name:"nnmy",
						label:"金额(元)",
						validate:["required"]
					},{
						name:"checkoutDate",
						label:"退房时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"appointCheckoutDate",
						label:"预约退房时间",
						type:"date",
						mode:"Y-m-d",
						readonly:true,
					},{
						name:"factRoomName",
						label:"房间",
						readonly:true
					},{
						name:"factRoom",
						value:"pkRoom",
						type:"hidden",
					},{
						name:"appointRoom",
						value:"pkRoom",
						type:"hidden"
					},{
						name:"appointCheckinDate",
						type:"hidden",
					},{
						name:"livingstatus",
						type:"hidden"
					}]
				}
			};
		}
	});
	module.exports = CheckoutLiving;
});