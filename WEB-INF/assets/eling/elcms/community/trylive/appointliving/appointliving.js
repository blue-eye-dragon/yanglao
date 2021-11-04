define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var AppointLiving = BaseView.extend({
		events:{
			"change .J-tryLiveBatch":function(e){
				var card=this.get("card");
				var pk=this.get("card").getValue("tryLiveBatch");
				if(pk){
					aw.ajax({
						url : "api/trylivebatch/query",
						type : "POST",
						data : {
							pkTryLiveBatch:pk,
							fetchProperties:"*,tryLiveProduct.*"
						},
						success:function(data){	
							card.setValue("appointPeopleQuantity",data[0].peoples);
							card.setValue("appointCheckinDate",data[0].tryLiveDate);
							card.setValue("appointCheckoutDate",data[0].tryLiveDate + data[0].days * 86400000);
						}
					});
				}
			},
		
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
							if(data[0].customer!=null){
								card.setValue("name",data[0].customer.name);
								card.setValue("phoneNumber",data[0].customer.phoneNumber);
								card.setValue("contactInfo",data[0].customer.contactInfo);
							}
														
						}	
					
					});
					
				}
			
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"体验预约",
					search:function(str) {
		            	widget.get("list").loading();
						aw.ajax({
							url:"api/appointliving/search",
							data:{
								s:str,
								properties:"airplaneInformation,appointPeopleQuantity,roomType.name,exclusiveSecretary.name,appointRoom.number,livingstatus,tryLiveBatch.batchcode,tryLiveSaleReg.pkMembershipCard.name,tryLiveSaleReg.customer.name,tryLiveSaleReg.customer.phoneNumber,tryLiveSaleReg.customer.contactInfo",
								fetchProperties:"*,roomType.name,exclusiveSecretary.name,appointRoom.number,tryLiveBatch.batchcode,livingstatus,tryLiveSaleReg.pkMembershipCard.name,tryLiveSaleReg.customer.name,tryLiveSaleReg.customer.phoneNumber,tryLiveSaleReg.customer.contactInfo"
							},
							dataType:"json",
							success:function(data){
								widget.get("list").setData(data);
							}
						});
					},
					buttons:[{
						id:"adds",
						text:"新增",
						handler:function(){
							widget.list2Card(true);
							widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-search");
							widget.get("card").reset();
							widget.get("card").load("tryLiveBatch");
							widget.get("card").load("tryLiveSaleReg");
							widget.get("card").load("appointRoom");
							return false;
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
							widget.hide(".J-card,.J-return").show(".J-list,.J-adds,.J-search");
							return false;
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/appointliving/query",
				params:function(){
					return {
						livingstatusIn:"Appoint,Cancel",
						fetchProperties:"*,tryLiveBatch.tryLiveProduct.name,appointRoom.pkRoom,appointRoom.number,tryLiveBatch.pkTryLiveBatch,tryLiveBatch.batchcode,tryLiveSaleReg.pkMembershipCard.*,tryLiveSaleReg.customer.*,exclusiveSecretary.name,tryLiveBatch.tryLiveProduct.pkRoomType,roomType.name"
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
								data.phoneNumber = data.tryLiveSaleReg.customer.phoneNumber;
								data.contactInfo = data.tryLiveSaleReg.customer.contactInfo;
								widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-search");
								widget.edit("detail",data);
								var roomdata=widget.get("card").getData("appointRoom","");
								roomdata.push(data.appointRoom);
								widget.get("card").setModel("appointRoom",roomdata);
								widget.get("card").setValue("appointRoom",data.appointRoom);
								
								var batchdata=widget.get("card").getData("tryLiveBatch","");
								batchdata.push(data.tryLiveBatch);
								widget.get("card").setModel("tryLiveBatch",batchdata);
								widget.get("card").setValue("tryLiveBatch",data.tryLiveBatch);
								
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
						key:"airplaneInformation",
						name:"航班信息"
					},{
						key:"exclusiveSecretary.name",
						name:"专属秘书"
					},{
						key:"appointPeopleQuantity",
						name:"预约人数"
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
						name:"房型"
					},{
						key:"appointRoom.number",
						name:"房间",
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
								if(data.key=="Appoint"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
//								if (!(data.livingstatus.key == "Appoint")) {
//									Dialog.tip({
//										title:data.livingstatus.value + "状态，不能修改!"
//									});
//									return false;
//								}
								data.name = data.tryLiveSaleReg.customer.name;
								data.phoneNumber = data.tryLiveSaleReg.customer.phoneNumber;
								data.contactInfo = data.tryLiveSaleReg.customer.contactInfo;
								widget.edit("edit",data);
								
								var batchdata=widget.get("card").getData("tryLiveBatch","");
								var flag = false;
								for(var  i =  0 ; i<batchdata.length;i++ ){
									if(batchdata[i].pkTryLiveBatch == data.tryLiveBatch.pkTryLiveBatch){
										flag= true;
										break;
									}
								}
								if(!flag){
									batchdata.push(data.tryLiveBatch);
									widget.get("card").setModel("tryLiveBatch",batchdata);
									widget.get("card").setValue("tryLiveBatch",data.tryLiveBatch);
								}
								
								widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-search");
								var roomdata=widget.get("card").getData("appointRoom","");
								roomdata.push(data.appointRoom);
								widget.get("card").setModel("appointRoom",roomdata);
								widget.get("card").setValue("appointRoom",data.appointRoom);
								
								return false;
							}
						},{
							key:"remove",
							text:"取消",
							show:function(data,row){
								if(data.key=="Appoint"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								if (data.livingstatus.key != "Appoint") {
									Dialog.tip({
										title:data.livingstatus.value + "状态，不能取消预约!"
									});
									return false;
								}
		                            aw.ajax({
		                                url : "api/checkinliving/cancel",
		                                type : "POST",
		                                data : {
		                                	pkTryLiving:data.pkTryLiving
		                                },
		                               success : function(data){
		                            	  
		                            	   widget.get("list").refresh();
		                                }
		                            });
							}
						},{
							key:"continue",
							text:"再预约",
							show:function(data,row){
								if(data.key=="Cancel"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								data.name = data.tryLiveSaleReg.customer.name;
								data.phoneNumber = data.tryLiveSaleReg.customer.phoneNumber;
								data.contactInfo = data.tryLiveSaleReg.customer.contactInfo;
								widget.edit("edit",data);
								var batchdata=widget.get("card").getData("tryLiveBatch","");
								var flag = false;
								for(var  i =  0 ; i<batchdata.length;i++ ){
									if(batchdata[i].pkTryLiveBatch == data.tryLiveBatch.pkTryLiveBatch){
										flag= true;
										break;
									}
								}
								if(!flag){
									batchdata.push(data.tryLiveBatch);
									widget.get("card").setModel("tryLiveBatch",batchdata);
									widget.get("card").setValue("tryLiveBatch",data.tryLiveBatch);
								}
								var roomdata=widget.get("card").getData("appointRoom","");
								roomdata.push(data.appointRoom);
								widget.get("card").setModel("appointRoom",roomdata);
								widget.get("card").setValue("appointRoom",data.appointRoom);
								widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-search");
								return false;
							}
						}
						]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					widget.save("api/appointliving/save",$("#tryliving").serialize());
					widget.hide(".J-card,.J-return").show(".J-list,.J-adds,.J-search");
					//widget.get("card").load("tryLiveBatch");
					//widget.get("card").load("tryLiveSaleReg");
				},
				//取消按钮
  				cancelaction:function(){
  					widget.hide(".J-card,.J-return").show(".J-list,.J-adds,.J-search");
  				},
				model:{
					id:"tryliving",
					items:[{
						name:"pkTryLiving",
						type:"hidden"
					},{
						name:"tryLiveBatch",
						key:"pkTryLiveBatch",
						value:"tryLiveProduct.name,batchcode",
						label:"体验批次",
						url:"api/trylivebatch/querylist",
						params:{
							fetchProperties:"batchcode,pkTryLiveBatch,tryLiveProduct.name"
						},
						type:"select",
						validate:["required"]
					},{
						name:"tryLiveSaleReg",
						label:"体验"+i18ns.get("sale_ship_owner","会员")+i18ns.get("sale_card_name","卡号"),
						type:"select",
						url:"api/trylivesalereg/querylist",
						key:"pkTryLiveSaleReg",
						value:"pkMembershipCard.name,customer.name",
						validate:["required"],
						params:{
							fetchProperties:"*,pkMembershipCard.*,customer.name"
						}
					},{
						name:"name",
						label:"姓名",
						readonly:true
					},{
						name:"phoneNumber",
						label:"手机号",
						readonly:true,
						validate:["required"]
					},{
						name:"contactInfo",
						label:"联系方式",
						readonly:true
					},{
						name:"airplaneInformation",
						label:"航班信息",
						type:"textarea",
						validate:["required"]
					},{
						name:"exclusiveSecretary",
						key : "pkUser",
						label : "专属秘书",
						value : "name",
						type : "select",
						url:"api/user/role",//TODO 用户角色：wulina 秘书
        				params:{
        					roleIn:"6,11,12,18,19,20,21",
							fetchProperties:"pkUser,name"
						}, 
						validate:["required"]
					},{
						name:"appointPeopleQuantity",
						label:"预约人数",
						validate:["required"]
					},{
						name:"appointCheckinDate",
						label:"预约入住时间",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"appointCheckoutDate",
						label:"预约退房时间",
						type:"date",
						mode:"Y-m-d",
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
						name:"appointRoom",
						label:"预约入住房间",
						type:"select",
						value:"number",
						key:"pkRoom",
						url :"api/room/query",
						params:{
							useTypeIn:"Hotel,Apartment",
							status:"Empty"
						},
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = AppointLiving;
});