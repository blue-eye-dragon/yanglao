define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog = require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	var store =require("store");
	var activeUser=store.get("user");
	var enums=require("enums");
	var all;
	var chargeStatus;//表示会籍卡费的支付状态
	var isReceiving;//表示会籍卡费是否全部到账
	var fetchProperties="*,memberAssessment.*,operator.name,membershipCard.name,membershipCard.pkMembershipCard,membershipCard.cardType.name,membershipCard.cardType.isBindRoom," +
	"room.pkRoom,room.number,status,deposit.*,deposit.room.number,personalCardowners.personalInfo.name,personalCardowners.pkPersonalCardowner";
	var MemberShipContract = BaseView.extend({
		events:{
			"change .J-form-membershipcontract-select-deposit" : function(e){
				//预约金下拉框
				var form = this.get("card");
				var pkDeposit = form.getValue("deposit");
				if (pkDeposit!=""&&pkDeposit!=null){
					var data = form.getData("deposit",{
						pk:pkDeposit
					});
					var roomdata = form.getData("room");
					roomdata.push(data.room);
					form.setData("room",roomdata);
					form.setValue("room",data.room.pkRoom);
				} else {
					form.setValue("room",null);
					form.load("room",{

					});
				}
			},
			"change .J-form-membershipcontract-select-membershipCard":function(e){
				var card=this.get("card");
				//1.获取第一个下拉框的值
				var pks = card.getValue("membershipCard");
				//2.循环拼接字符串
				var current=card.getData("membershipCard",{
					pk:pks
				});
				//给卡类型赋值
				var cardName = "";
				var contractName="";
				contractName = current.name;
				cardName = current.cardType.name+"卡" ;
				if(current){
					contractName=contractName+moment().format("YYYYMMDD");
					card.setValue("contractNo",contractName);
				}else{
					card.setValue("contractNo","");
				}
				cardName = cardName.substring(0, cardName.length-1);
				card.setValue("cardType",cardName);
				//如果会籍卡绑定的房间了那么入住状态下拉选项只有两个
				if(current){
					this.get("card").load("checkInType",{
						options:current.cardType.isBindRoom ? [{
							key:"CheckIn",
							value:"入住"
						},{
							key:"HouseingNotIn",
							value:"选房不入住"
						}] : [{
							key:"CheckIn",
							value:"入住"
						},{
							key:"NotIn",
							value:"买卡不选房"
						},{
							key:"HouseingNotIn",
							value:"选房不入住"
						}]
					});
				}
				this.get("card").setValue("checkInType","CheckIn");
			},
			"change .J-form-membershipcontract-select-checkInType":function(e){
				var card = this.get("card");
				var temp = card.getValue("checkInType");
				var dataMemberAssessment = card.getData("memberAssessment");
				if(temp=="NotIn" || temp ==""){
					card.setAttribute("room","readonly","readonly");
					card.setValue("room","");
					card.setValue("signType","");
					card.setValue("hisMembershipContract","");
					card.setValue("memberAssessment","");
					card.setValue("flowStatus","");
					card.hide(["memberAssessment","flowStatus","annualfees","signType","hisMembershipContract"]);
				}else{
					card.show(["memberAssessment","flowStatus"]);
					if(temp=="HouseingNotIn"){
						card.show(["annualfees"]).hide(["signType"]);
						card.setValue("signType","");
						card.setValue("hisMembershipContract","");
					}else{
						card.hide(["annualfees"]).show(["signType"]);
					}
					card.setAttribute("room","readonly","");
				}
			},
			"change .J-form-membershipcontract-select-signType":function(e){
				var card = this.get("card");
				var signType = card.getValue("signType");
				if(signType){
					if(signType == "Change"){
						card.show("hisMembershipContract");
						//动态去除评估单，加入历史会籍必输校验
						$("select.J-form-membershipcontract-select-hisMembershipContract").rules( "add", {
	          				  required: true,
	          				  messages: {
	          				    required: "*",
	          				  }
	          				});
						$("select.J-form-membershipcontract-select-memberAssessment").rules("remove");
					}else{
						card.load("memberAssessment");
						card.hide("hisMembershipContract");
						card.setValue("hisMembershipContract","");
						//动态去除评估单，和加入历史会籍必输校验
						$("select.J-form-membershipcontract-select-memberAssessment").rules( "add", {
	          				  required: true,
	          				  messages: {
	          				    required: "*",
	          				  }
	          				});
						$("select.J-form-membershipcontract-select-hisMembershipContract").rules("remove");
					}
				}else{
					card.hide("hisMembershipContract");
					card.setValue("hisMembershipContract","");
				}
			},
			"change .J-form-membershipcontract-select-hisMembershipContract":function(e){
				var card = this.get("card");
				var hisMembershipContract = card.getValue("hisMembershipContract");
				var datas =card.getData("memberAssessment");
				if(hisMembershipContract){
					var data =card.getData("hisMembershipContract",{
						pk:hisMembershipContract
					});
					card.setData("memberAssessment",data.memberAssessment);
					card.setValue("memberAssessment",data.memberAssessment);
					if(data.memberAssessment.length>0){
						card.setValue("flowStatus",data.memberAssessment[0].flowStatus.value);
					}
				}else{
					card.setData("memberAssessment",datas);
					card.setValue("flowStatus","");
				}
			},
			"change .J-form-membershipcontract-select-memberAssessment":function(e){
				var pkType=this.get("card").getValue("memberAssessment");
				var dataType = this.get("card").getData("memberAssessment",{
					pk:pkType
				});
				for(var i=0;i<dataType.length;i++){
					if(dataType[i].room.status.key=="Waitting"||dataType[i].room.status.key=="InUse"||dataType[i].room.status.key=="Occupy"){
						Dialog.alert({
							content:"评估单所选房间不可选！"
						});
						return;
					}
				}
				if(dataType.length>1){
					var num=0;//用于保存相同的个数
					for(var j=0;j<dataType.length-1;j++){
					    if(dataType[j].room.pkRoom==dataType[j+1].room.pkRoom){
					        num+=1;
					    }
					}
					if(dataType.length-1!=num){
						Dialog.alert({
							content:"评估单房间号不一致！"
						});
						this.get("card").setValue("memberAssessment","");
						return false;
					}
				}
				var status="";
				for(var i=0;i<dataType.length;i++){
					status+=dataType[i].flowStatus.value+",";
				}
				status=status.substring(0,status.length-1);
				this.get("card").setValue("flowStatus",status);
				var roomseldata=this.get("card").getData("room");
				if(dataType[0]!=null&&dataType[0].room!=null){
					roomseldata.push(dataType[0].room);
				}
				this.get("card").setData("room",roomseldata);
				if(dataType.length>0){
					this.get("card").setValue("room",dataType[0].room);
				}
			},
			"click .J-personalCardowner" : function(e){
				//个人
				this.openView({
					url:"eling/elcms/sale/people/people",
					params:{
						pkMembershipContract :$(e.target).attr("data-pkMembershipContract") ,
						pkPersonalCardowner:$(e.target).attr("data-pkPersonalCardowner"),
						bussiness:"showDetail"
					},
					isAllowBack:true
				});

			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"权益人签约",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/membershipcontract/search",
							data:{
								s:str,
								searchProperties:"membershipCard.name," +
												"operator.name," +
												"memberShipFees," +
												"checkInType.value," +
												"personalCardowners.personalInfo.name," +
												"status.value",
								fetchProperties:fetchProperties,
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.list2Card(false);
							}
						});
					},
					buttons:[{
						id:"add",
						text:"新增",
						type:"button",
						handler:function(){
							widget.get("subnav").hide(["search","status","checkInType","add","time"]);
							widget.get("card").reset();
							widget.list2Card(true);
							widget.get("card").setValue("checkInType","CheckIn");
							widget.get("card").setAttribute("room","readonly","");
							widget.get("card").show(["memberAssessment","flowStatus"]);
							$(".J-form-membershipcontract-radiolist-cardownerType-ORGANIZATIONAL").attr("disabled","disabled");
							var userSelect  = widget.get("card").getData("operator","");
							var flag = false ;
							for(var i=0;i<userSelect.length;i++){
								if(userSelect[i].pkUser==activeUser.pkUser){
									flag=true;
									break;
								}
							}
							if(flag){
								widget.get("card").setValue("operator",activeUser);
							}
							return false;
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						type:"button",
						handler:function(){
							widget.get("card").reset();
							widget.get("subnav").show(["search","checkInType","time","status"])
							widget.list2Card(false);
							widget.get("subnav").hide(["return"]);
							return false;
						}
					}],
					buttonGroup:[{
						id:"checkInType",
						tip:"入住类型",
						items:[{
							key:"",
							value:"全部"
						},{
							key:"CheckIn",
							value:"入住"
						},{
							key:"NotIn",
							value:"买卡不选房"
						},{
							key:"HouseingNotIn",
							value:"选房不入住"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"status",
						tip:"签约状态",
						items:[{
							key:"",
							value:"全部"
						},{
							key:"Normal",
							value:"正常"
						},{
							key:"Termination",
							value:"终止"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
     			   time:{
     				   tip:"签约日期",
    				   click:function(time){
    					   widget.get("list").refresh();
    				   },
    			   }
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/membershipcontract/queryNormal",
				autoRender : false,
				fetchProperties:fetchProperties,
				params:function(){
					return {
						"status":widget.get("subnav").getValue("status"),
						"signDate":widget.get("subnav").getValue("time").start,
						"signDateEnd":widget.get("subnav").getValue("time").end,
						"checkInType":widget.get("subnav").getValue("checkInType"),
					};
				},
				model:{
					columns:[{
						key:"membershipCard.name",
						name:"会籍卡号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("subnav").show(["return"]).hide(["search","status","checkInType","add","time"]);
								var form=widget.get("card");
								data.cardType=data.membershipCard.cardType.name;
								//重新对房间下拉框赋值
								var roomseldata=widget.get("card").getData("room");
								if(data.room){
									roomseldata.push(data.room);
								}
								//重新对会籍卡下拉框赋值
								var mscseldata=widget.get("card").getData("membershipCard");
								mscseldata.push(data.membershipCard);
								//换房签约的明细
								if(data.signType){
									widget.changeRoomQueryHisCon(form,data);
								}else{
									form.hide("signType");
								}
								//选房不住的明细
								if(data.checkInType.key == "HouseingNotIn"){
									aw.ajax({
										url:"api/membersign/queryroom",
										data:{
											membershipContract:data.pkMembershipContract,
											fetchProperties:"annualFee",
										},
										dataType:"json",
										success:function(mslist){
											form.show("annualfees");
											form.setValue("annualfees",mslist[0].annualFee);
										}
									});
								}else{
									form.hide("annualfees");
								};
								widget.edit("detail",data);
								var form=widget.get("card");
								var memberAssessment=form.getData("memberAssessment","");
								var flag = false;
								if (memberAssessment){
									for(var  i =  0 ; i<memberAssessment.length;i++ ){
										for(var j=0;j<data.memberAssessment.length;j++){
											if(memberAssessment[i].pkMemberAssessment == data.memberAssessment[j].pkMemberAssessment){
												flag= true;
												break;
											}
										}
									}
								}
								if(flag){
									form.setValue("memberAssessment",data.memberAssessment);
								}else{
									var memberAssessment=form.getData("memberAssessment","");
									for(var m=0;m<data.memberAssessment.length;m++){
										memberAssessment.push(data.memberAssessment[m]);
									}
									form.setData("memberAssessment",memberAssessment);
									form.setValue("memberAssessment",data.memberAssessment);
								}
								widget.get("card").setData("membershipCard",mscseldata);
								widget.get("card").setValue("membershipCard",data.membershipCard);
								widget.get("card").setData("room",roomseldata || []);
								if(data.room){
									widget.get("card").setValue("room",data.room || "");
								}
								if(data.membershipCard.cardType.isBindRoom){
									widget.get("card").setValue("BindRoom",1);
								}else{
									widget.get("card").setValue("BindRoom",0);
								}
								var temp = widget.get("card").getValue("checkInType");
								var dataMemberAssessment = widget.get("card").getData("memberAssessment");
								if(temp=="NotIn" || temp ==""){
									widget.get("card").setAttribute("room","readonly","readonly");
									widget.get("card").setValue("room","");
									widget.get("card").hide(["memberAssessment","flowStatus"]);
								}else{
									widget.get("card").setAttribute("room","readonly","");
									widget.get("card").show(["memberAssessment","flowStatus"]);
									var status="";
									for(var i=0;i<data.memberAssessment.length;i++){
										status+=data.memberAssessment[i].flowStatus.value+",";
									}
									status=status.substring(0,status.length-1);
									widget.get("card").setValue("flowStatus",status);
								}
								var deposit=form.getData("deposit","");
								deposit.push(data.deposit);
								form.setData("deposit",deposit);
								form.setValue("deposit",data.deposit);
								return false;
							}
						}]
					},{
						key:"operator.name",
						name:"经手人"
					},{
						key:"memberShipFees",
						name:"会籍卡费"
					},{
						key:"charged",
						name:"是否交费",
						format:function(value,row){
							if(row.charged==true){
								return "是";
							}else if(row.charged==false){
								return "否";
							}else{
								return "无";
							}
						}
					},{
						key:"checkInType.value",
						name:"入住类型",
					},{
						key:"status.value",
						name:"签约状态",
					},{
						key:"signDate",
						name:"签约日期",
						format:"date"
					},{
						key : "personalCardowners",
                        name : "权益人",
                        format : function(value,row){
                        	var names =" ";
                        	if(value.length > 0){
                        		for ( var i in value) {
                        			var personalCardowner =value[i];
                        			names +=   "<a href='javascript:void(0);' class='J-personalCardowner' data-pkMembershipContract='"+row.pkMembershipContract+"'   data-pkPersonalCardowner='"+personalCardowner.pkPersonalCardowner+"' style='color:red;'>"+personalCardowner.personalInfo.name+"</a>"  + ","
                        		}
                        	}
                        	return names.substring(0,names.length -1)
                        }
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								if(data.status.key=="Termination"){
									Dialog.alert({
										title : "提示",
										content : "终止状态的权益人签约不能被修改！",
									});
									return false;
								}
								aw.ajax({
									url:"api/membershipcontractfees/query",
									data:{
										"memberShipContract.pkMembershipContract":data.pkMembershipContract,
										fetchProperties:"chargeStatus,feesdetails.chargeStatus",
									},
									dataType:"json",
									success:function(result){
										if(!result[0]){
											Dialog.alert({
												title : "提示",
												content : "没有对应的会籍卡缴费记录，权益人签约不能被修改！",
											});
											return false;
										}
										chargeStatus = result[0].chargeStatus.key;
										var flag = 0;
										for(var i=0;i<result[0].feesdetails.length;i++){
											if(result[0].feesdetails[i].chargeStatus.key=="Receiving"){
												flag++;
											}
										}
										if(flag==result[0].feesdetails.length){
											//满足此条件，代表会籍卡费收费明细所有都是已到账状态
											isReceiving="Receiving";
										}
										if(chargeStatus=="Payup"&&isReceiving=="Receiving"){
											Dialog.alert({
												title : "提示",
												content : "会籍卡费已缴清并且已到账，权益人签约不能被修改！",
											});
											chargeStatus = "";
											isReceiving = ""
											return false;
										}else{
											widget.get("subnav").show(["return"]);
											widget.get("subnav").hide(["search","status","checkInType","add","time"]);
											data.cardType=data.membershipCard.cardType.name;
											//重新对房间下拉框赋值
											var roomseldata=widget.get("card").getData("room");
											if(data.room){
												roomseldata.push(data.room);
											}
											//重新对会籍卡下拉框赋值
											var mscseldata=widget.get("card").getData("membershipCard");
											mscseldata.push(data.membershipCard);
											widget.edit("edit",data);
											var form=widget.get("card");
											//换房签约的明细
											if(data.signType){
												widget.changeRoomQueryHisCon(form,data);
											}else{
												form.hide("signType");
											}
											//选房不住的明细
											if(data.checkInType.key == "HouseingNotIn"){
												aw.ajax({
													url:"api/membersign/queryroom",
													data:{
														membershipContract:data.pkMembershipContract,
														fetchProperties:"annualFee",
													},
													dataType:"json",
													success:function(mslist){
														form.show("annualfees");
														form.setValue("annualfees",mslist[0].annualFee);
													}
												});
											}else{
												form.hide("annualfees");
											};

											var memberAssessment=form.getData("memberAssessment","");
											var flag = false;
											if (memberAssessment){
												for(var  i =  0 ; i<memberAssessment.length;i++ ){
													for(var j=0;j<data.memberAssessment.length;j++){
														if(memberAssessment[i].pkMemberAssessment == data.memberAssessment[j].pkMemberAssessment){
															flag= true;
															break;
														}
													}
												}
											}
											if(flag){
												form.setValue("memberAssessment",data.memberAssessment);
											}else{
												var memberAssessment=form.getData("memberAssessment","");
												for(var m=0;m<data.memberAssessment.length;m++){
													memberAssessment.push(data.memberAssessment[m]);
												}
												form.setData("memberAssessment",memberAssessment);
												form.setValue("memberAssessment",data.memberAssessment);
											}
											widget.get("card").setData("membershipCard",mscseldata);
											widget.get("card").setValue("membershipCard",data.membershipCard);
											widget.get("card").setData("room",roomseldata || []);
											if(data.room){
												widget.get("card").setValue("room",data.room || "");
											}
											if(data.membershipCard.cardType.isBindRoom){
												widget.get("card").setValue("BindRoom",1);
											}else{
												widget.get("card").setValue("BindRoom",0);
											}
											var temp = widget.get("card").getValue("checkInType");
											var dataMemberAssessment = widget.get("card").getData("memberAssessment");
											if(temp=="NotIn" || temp ==""){
												widget.get("card").setAttribute("room","readonly","readonly");
												widget.get("card").setValue("room","");
												widget.get("card").hide(["memberAssessment","flowStatus"]);
											}else{
												widget.get("card").setAttribute("room","readonly","");
												widget.get("card").show(["memberAssessment","flowStatus"]);
												var status="";
												for(var i=0;i<data.memberAssessment.length;i++){
													status+=data.memberAssessment[i].flowStatus.value+",";
												}
												status=status.substring(0,status.length-1);
												widget.get("card").setValue("flowStatus",status);
											}
											var deposit=form.getData("deposit","");
											deposit.push(data.deposit);
											form.setData("deposit",deposit);
											form.setValue("deposit",data.deposit);
											$(".J-form-membershipcontract-radiolist-cardownerType-ORGANIZATIONAL").attr("disabled","disabled");
										}
									}
								});
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/membershipcontract/" + data.pkMembershipContract + "/delete");
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
					var form=widget.get("card");
					var cards=form.getValue("membershipCard");
					var datas=form.getData("membershipCard",{
						pk:cards
					});
					var isBindRoom=false;
					if(datas){
						isBindRoom=datas.cardType.isBindRoom;
					}else{
						if(form.getValue("BindRoom")==1){
							isBindRoom=true;
						}
					}
					if(isBindRoom && !form.getValue("room")){
						//卡类型上选择绑定房间，则房间必填
						Dialog.close();
						Dialog.alert({
							content:"当前选择的卡绑定了房间，必须选择房间"
						});
						return;
					}
					//检验如果是选房不入住和入住 必须选房间
					var room  = form.getValue("room");
					var type = form.getValue("checkInType");
					if(type=="CheckIn"||type=="HouseingNotIn"){
						if(!room){
							Dialog.alert({
								content:"请选择房间！"
							});
							return;
						}
					}
					widget.save("api/membershipcontract/save",$("#membershipcontract").serialize(),function(data){
						widget.get("list").refresh();
						widget.get("card").load("memberAssessment");
						Dialog.confirm({
							title:"提示",
							content:"跳转到权益人档案节点？",
							confirm:function(){
								if(data.cardownerType=="ORGANIZATIONAL"){
									//机构
									widget.openView({
										url:"eling/elcms/sale/organpeople/organpeople",
										params:{
											pkMembershipContract : data.pkMembershipContract
										}
									});
								}else{
									//个人
									widget.openView({
										url:"eling/elcms/sale/people/people",
										params:{
											pkMembershipContract : data.pkMembershipContract
										}
									});
								}
							}
						});
					});
					widget.get("subnav").show(["search","checkInType","time","status"])
				},
				cancelaction:function(){
					widget.list2Card(false);
					widget.get("subnav").show(["search","checkInType","time","status"])
				},
				model:{
					id:"membershipcontract",
					items:[{
						name:"pkMembershipContract",
						type:"hidden"
					},{
						name:"BindRoom",
						type:"hidden"
					},{
						name:"version",
						type:"hidden"
					},{
						name:"charged",
						defaultValue:false,
						type:"hidden"
					},{
						name:"membershipCard",
						label:"会籍卡",
						type:"select",
						key:"pkMemberShipCard",
						value:"name",
						url:"api/card/notmemsigned/",
						params:{
							fetchProperties:"*,cardType.name,cardType.isBindRoom"
						},
						multi:false,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"contractNo",
						label:"合同号",
						type:"hidden"
					},{
						name:"cardType",
						label:"卡类型",
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"checkInType",
						label:"入住类型",
						type:"select",
						options:[{
							key:"CheckIn",
							value:"入住"
						},{
							key:"NotIn",
							value:"买卡不选房"
						},{
							key:"HouseingNotIn",
							value:"选房不入住"
						}],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"signType",
						label:"签约类型",
						type:"select",
						options:enums["com.eling.elcms.sale.model.MembershipContract.SignType"],
						defaultValue:"New",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"hisMembershipContract",
						label:"历史会籍",
						type:"select",
						key:"pkMembershipContract",
						value:"membershipCard.name",
						url:"api/membershipcontract/queryUnChangeRoomHisCon",
						show :false,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						params:function(){
							return {
								fetchProperties:"pkMembershipContract," +
										"membershipCard.name," +
										"memberAssessment.pkMemberAssessment," +
										"memberAssessment.assessmentNumber," +
										"memberAssessment.room.status," +
										"memberAssessment.flowStatus" ,
							};
						}
					},{
						name:"deposit",
						label:"预约金",
						type:"select",
						key:"pkDeposit",
						value : "chargeTime,name,room.number",
						url:"api/deposit/queryroomnumber",
						valueFormat : function(data){
							var datas = [];
							datas = data.split(" ");
							return moment(parseInt(datas[0])).format('YYYY-MM-DD')+"-"+datas[1]+"-"+datas[2]
						},
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						params:function(){
							return {
								fetchProperties:"pkDeposit,customer.name,name,chargeTime,room.pkRoom,room.number",
								ChargeStatusIn:"Receiving",
							};
						}
					},{
						name:"room",
						label:"房间号",
						type:"select",
						key:"pkRoom",
						value:"number",
						url:"api/room/query",
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						params:function(){
							return {
								fetchProperties:"pkRoom,number",
								status:"Empty",
								useType:"Apartment",
							};
						}
					},{
						name:"memberAssessment",
						label:"评估单号",
						type:"select",
						key:"pkMemberAssessment",
						value:"assessmentNumber",
						url:"api/memberassessment/querynotcontract",
						multi:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						params:function(){
							return {
								fetchProperties:"room.status,pkMemberAssessment,assessmentNumber,room.number,room.pkRoom,flowStatus"
							};
						}
					},{
						name:"flowStatus",
						label:"评估状态",
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"cardownerType",
						label:"权益人类型",
						type:"radiolist",
						list:[{
							key:"ORGANIZATIONAL",
							value:"机构"
						},{
							key:"PERSONAL",
							value:"个人",
							isDefault:true
						}],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"purchaseReason",
						label:"购买原因",
						type:"radiolist",
						list:[{
							key:"INVESTMENT",
							value:"投资"
						},{
							key:"PERSONAL",
							value:"自用",
							isDefault:true
						}],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"signDate",
						label:"签约日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"operator",
						label:"经手人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/user/role?roleIn=3,17",//TODO 用户角色：wulina
						multi:false,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"memberShipFees",
						label:"卡费",
						defaultValue:0,
						validate:["required","money"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"annualfees",
						label:"服务费",
						show:false,
						defaultValue:0,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			widget.get("subnav").setValue("time",{
				start:moment("2007-01-01").valueOf(),
				end:moment().valueOf()
			});
			if(params && params.check == "salemonthreport"){
				if(params.roomtype=="合计"){
					params.roomtype = "";
				}
				if(params.cardtype=="合计"){
					params.cardtype ="";
				}
				var year = params.year;
				var month = params.month;

				widget.get("subnav").setValue("time",{
					start:moment(year+"-"+month).startOf("month").valueOf(),
					end:moment(year+"-"+month).endOf("month").valueOf()
				});
				aw.ajax({
					url : "api/membershipcontract/queryReport",
					type : "POST",
					data : {
						"signDate":widget.get("subnav").getValue("time").start,
						"signDateEnd":widget.get("subnav").getValue("time").end,
						"cardName":params.cardtype,
						"roomName":params.roomtype,
						fetchProperties:"*,memberAssessment.*,operator.name,membershipCard.name," +
										"membershipCard.pkMembershipCard,membershipCard.cardType.name," +
										"membershipCard.cardType.isBindRoom,room.pkRoom,room.number",
					},
					success:function(data){
						widget.get("list").setData(data);
					}
				});
			}else if(params && params.father == "membershipcontractfeessummary"){

				widget.get("list").refresh({
					"signDate":params.start,
					"signDateEnd":params.end,
					fetchProperties:fetchProperties,
				});
			}else if(params&&params.goPeopleBack){
				widget.get("subnav").setValue("status",params.status);
				widget.get("subnav").setValue("checkInType",params.checkInType);
				widget.get("subnav").setValue("time",{
					start:params.start,
					end:params.end,
				});
				widget.get("list").refresh();

			}else{
				widget.get("list").refresh();
			}
			//评估字段加入动态的非空校验
			$("select.J-form-membershipcontract-select-memberAssessment").rules("add",{
				required: true,
				messages: {
 				    required: "*",
				}
				})
		},
		setEpitaph : function(){
			var time = this.get("subnav").getValue("time");
			var status = this.get("subnav").getValue("status");
			var checkInType = this.get("subnav").getValue("checkInType");
			return {
				start:time.start,
				end:time.end,
				status:status,
				checkInType:checkInType,
				goPeopleBack:"goPeopleBack"//标识在权益人界面返回
			};
		},
		changeRoomQueryHisCon:function(form,MembershipContract){
			if(MembershipContract.signType.key == "Change" ){
				form.show("hisMembershipContract")
				//去掉 评估单的校验
				$("select.J-form-membershipcontract-select-memberAssessment").rules("remove");
				var pks = form.getData("hisMembershipContract");
				if(!MembershipContract.hisMembershipContract){
					aw.ajax({
						url:"api/membershiptransfer/query",
						data:{
							newContract:MembershipContract.pkMembershipContract,
							fetchProperties:"previousContract.pkMembershipContract,previousContract.membershipCard.name"
						},
						dataType:"json",
						success:function(mstlist){
							if(mstlist.length>0){
								MembershipContract.hisMembershipContract=mstlist[0].previousContract;
								pks.push(MembershipContract.hisMembershipContract)
								form.setData("hisMembershipContract",pks);
								form.setValue("hisMembershipContract",MembershipContract.hisMembershipContract);
							}
						}
					});
				}else{
					pks.push(MembershipContract.hisMembershipContract)
					form.setData("hisMembershipContract",pks);
					form.setValue("hisMembershipContract",MembershipContract.hisMembershipContract);
				}
			}
		}
	});
	module.exports = MemberShipContract;
});
