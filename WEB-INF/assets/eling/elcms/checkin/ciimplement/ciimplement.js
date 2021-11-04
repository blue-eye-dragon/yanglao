define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Tab = require("tab");
	var Grid=require("grid-1.0.0");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog");
	//多语
	var i18ns = require("i18n");
	var fetchProperties ="pkCIImplement,"
			+ "photoCheck,"
			+ "approve,"
			+ "status,"
			+ "version,"
			//会员签约
			+ "memberSigning.pkMemberSigning,"
			+ "memberSigning.checkInDate,"
			+ "memberSigning.annualFee,"
			//紧急联系人
			+ "memberSigning.ecPersons.name,"
			//会籍卡
			+ "memberSigning.membershipContract.membershipCard.pkMemberShipCard,"
			+ "memberSigning.card.cardType.cardTypeMoney,"
			//房间
			+ "memberSigning.room.pkRoom,"
			+ "memberSigning.room.building.name,"
			+ "memberSigning.room.number,"
			//会员
			+ "memberSigning.members.pkMember,"
			+ "memberSigning.members.status,"
			+ "memberSigning.members.personalInfo.mobilePhone,"
			+ "memberSigning.members.personalInfo.phone,"
			+ "memberSigning.members.personalInfo.name,"
			+ "memberSigning.members.personalInfo.name,"
			//固定资产配置
			+ "checkInFurinshing.pkCIFurnishing,"
			+ "checkInFurinshing.status,"
			//财务入住落实
			+ "checkInMembershipCard.pkCIMembershipCard,"
			+ "checkInMembershipCard.version,"
			+ "checkInMembershipCard.cardCurrency,"
			+ "checkInMembershipCard.cardCurrencyMoney,"
			+ "checkInMembershipCard.status,"
			//入住天然气
			+ "checkInNaturalGas.pkCINaturalGas,"
			+ "checkInNaturalGas.version,"
			+ "checkInNaturalGas.naturalGas,"
			+ "checkInNaturalGas.status,"
			//入住房间配置
			+ "checkInRoomConfing.pkCIRoomConfig,"
			+ "checkInRoomConfing.version,"
			+ "checkInRoomConfing.individuDemand,"
			+ "checkInRoomConfing.bedding,"
			+ "checkInRoomConfing.fitmentPosi,"
			+ "checkInRoomConfing.keyNumber,"
			+ "checkInRoomConfing.status,"
			//入住电信开通
			+ "checkInTelecom.pkCITelecom,"
			+ "checkInTelecom.version,"
			+ "checkInTelecom.telePhoneOpened,"
			+ "checkInTelecom.phoneNumber,"
			+ "checkInTelecom.ipTVOpened,"
			+ "checkInTelecom.broadbandOpened,"
			+ "checkInTelecom.phoneNumber,"
			+ "checkInTelecom.openType,"
			+ "checkInTelecom.status,"
			//入住派车处理
			+ "checkInMoveHouse.pkCIMovehouse,"
			+ "checkInMoveHouse.version,"
			+ "checkInMoveHouse.sendCar,"
			+ "checkInMoveHouse.address,"
			+ "checkInMoveHouse.moveHouseDate,"
			+ "checkInMoveHouse.status,"
			//入住订花处理
			+ "checkInOrderflowers.pkCIOrderFlowers,"
			+ "checkInOrderflowers.version,"
			+ "checkInOrderflowers.orderFlowers,"
			+ "checkInOrderflowers.orderTime,"
			+ "checkInOrderflowers.description,"
			+ "checkInOrderflowers.status,";
	
	//依赖的业务js
	var cii_baseinfo=require("./assets/cii_baseinfo");
	var cii_roomconfig=require("./assets/cii_roomconfig");
	var cii_orderflowers=require("./assets/cii_orderflowers");
	var cii_service=require("./assets/cii_service");
	var cii_member=require("./assets/cii_member");
	var cii_cardwoner=require("./assets/cii_cardowner");
	
	var ciimplement=ELView.extend({
		attrs:{
			template: require("./ciimplement.tpl")
		},
		events:{
			"click .J-form-ciorderflowers-radiolist-checkInOrderflowers-orderFlowers":function(e){
				var form=this.get("orderflowers");
				var value=form.getValue("checkInOrderflowers.orderFlowers");
				if(value){
					form.show(["checkInOrderflowers.orderTime","checkInOrderflowers.description"]);
				}else{
					form.hide(["checkInOrderflowers.orderTime","checkInOrderflowers.description"]);
				}
			},
			"change .J-form-cibaseinfoform-date-checkInDate":function(e){
				var formflowers=this.get("orderflowers");
				var formbase=this.get("baseinfo").getData();
				if(moment(formbase.checkInDate).isAfter(moment().add(3, 'days'), 'day')){
					var day=moment(formbase.checkInDate).subtract(3, 'days').valueOf();
					formflowers.setValue("checkInOrderflowers.orderTime",day);
				}else{
					formflowers.setValue("checkInOrderflowers.orderTime",moment());
				}
			},
			"click .J-form-ciserviceform-radiolist-checkInTelecom-openType" : function(e){
				var form=this.get("service");
				var value=form.getValue("checkInTelecom.openType");
				if(value=="Agency"){
					form.show(["checkInTelecom.telePhoneOpened","checkInTelecom.ipTVOpened","checkInTelecom.broadbandOpened"]);
				}else{
					form.hide(["checkInTelecom.telePhoneOpened","checkInTelecom.ipTVOpened","checkInTelecom.broadbandOpened","checkInTelecom.phoneNumber"]);
					form.setValue("checkInTelecom.telePhoneOpened",false);
					form.setValue("checkInTelecom.ipTVOpened",false);
					form.setValue("checkInTelecom.broadbandOpened",false);
					form.setValue("checkInTelecom.phoneNumber","");
				}
			},
			"click .J-form-ciserviceform-radiolist-checkInTelecom-telePhoneOpened" : function(e){
				var form=this.get("service");
				var value=form.getValue("checkInTelecom.telePhoneOpened");
				if(value){
					form.show(["checkInTelecom.phoneNumber"]);
				}else{
					form.hide(["checkInTelecom.phoneNumber"]);
					form.setValue("checkInTelecom.phoneNumber","");
				}
			},
			"click .J-form-ciserviceform-radiolist-checkInMoveHouse-sendCar" : function(e){
				var form=this.get("service");
				var value=form.getValue("checkInMoveHouse.sendCar");
				if(value){
					form.show(["checkInMoveHouse.address","checkInMoveHouse.moveHouseDate"]);
				}else{
					form.hide(["checkInMoveHouse.address","checkInMoveHouse.moveHouseDate"]);
				}
			},
//			"click .J-form-ciserviceform-date-checkInMoveHouse-moveHouseDate" : function(e){
//				var form=this.get("service");
//				var sform=this.get("baseinfo");
//				var checkinDate=sform.getValue("checkInDate");
//				var sendcartime=form.getValue("checkInMoveHouse.moveHouseDate");
//				if(sendcartime!=""&&moment(sendcartime).isBefore(moment(), 'day')){
//					Dialog.alert({
//						content:"派车时间不能在今天之前"
//		    		});
//					return;
//				}
//				if(sendcartime!=""&&moment(sendcartime).isAfter(moment(checkinDate), 'day')){
//					Dialog.alert({
//						content:"派车时间不能在入住时间之后"
//		    		});
//					return;
//				}
//			}
		},
		coverBaseData:function(oldData,form){
			oldData.checkInDate=form.getValue("checkInDate");
//			oldData.photoCheck=form.getValue("photoCheck");
//			oldData.approve=form.getValue("approve");
			//var pkRoom=oldData.memberSigning.room.pkRoom;
			oldData.memberSigning=oldData.memberSigning.pkMemberSigning || oldData.memberSigning;
			
			oldData.checkInFurinshing = {};
			
			//oldData.checkInFurinshing.status="NoRequiement"
//			if(pkRoom){
//				aw.ajax({
//					url : "api/roomconfig/query",
//					type : "POST",
//					data : {
//						pkRoom:pkRoom,
//						fetchProperties:"*,asset.*,asset.assetclass.*",
//					},
//					success : function(data){														
//						if(data&&data.length>0){
//							//oldData.checkInFurinshing=oldData.checkInFurinshing.pkCIFurnishing || oldData.checkInFurinshing;
//							oldData.checkInFurinshing.status="UnConfirmed"
//						}else{
//							oldData.checkInFurinshing.status="NoRequiement"
//						}					
//					}	
//				
//				});
//			}
			oldData.status="Edited";
			return oldData;
		},
		coverRoomData:function(oldData,form){
			//设置房间配置
			if(oldData.checkInRoomConfing==null){
				oldData.checkInRoomConfing = {};
			}
			oldData.checkInRoomConfing.individuDemand=form.getValue("checkInRoomConfing.individuDemand");
			oldData.checkInRoomConfing.bedding=form.getValue("checkInRoomConfing.bedding");
			oldData.checkInRoomConfing.fitmentPosi=form.getValue("checkInRoomConfing.fitmentPosi");
			oldData.checkInRoomConfing.keyNumber=form.getValue("checkInRoomConfing.keyNumber");
			if(oldData.checkInRoomConfing.individuDemand || oldData.checkInRoomConfing.bedding || oldData.checkInRoomConfing.fitmentPosi || oldData.checkInRoomConfing.keyNumber){
				oldData.checkInRoomConfing.status="Pending";
			}else{
				oldData.checkInRoomConfing.status="NoRequiement";
			}
			return oldData;
		},
		coverOderFlowerData:function(oldData,form){
			if(oldData.checkInOrderflowers==null){
				oldData.checkInOrderflowers={};
			}
			//设置订花
			if(form.getValue("checkInOrderflowers.orderTime")!=null){
				oldData.checkInOrderflowers.orderFlowers=true;
				oldData.checkInOrderflowers.orderTime=form.getValue("checkInOrderflowers.orderTime");
				oldData.checkInOrderflowers.description=form.getValue("checkInOrderflowers.description");
				oldData.checkInOrderflowers.status="Initial";
			}else{
				oldData.checkInOrderflowers.orderFlowers=false;
				oldData.checkInOrderflowers.status="NoRequiement";
			}
			
			return oldData;
		},
		coverSerData:function(oldData,form){
			if(oldData.checkInTelecom==null){
				oldData.checkInTelecom = {};
			}
			//设置电信开通
			oldData.checkInTelecom.openType=form.getValue("checkInTelecom.openType");
			oldData.checkInTelecom.telePhoneOpened=form.getValue("checkInTelecom.telePhoneOpened");
			oldData.checkInTelecom.phoneNumber=form.getValue("checkInTelecom.phoneNumber");
			oldData.checkInTelecom.ipTVOpened=form.getValue("checkInTelecom.ipTVOpened");
			oldData.checkInTelecom.broadbandOpened=form.getValue("checkInTelecom.broadbandOpened");
			//电话、IPTV、宽带三个有一个开通，则状态变为Pending，否则为NoRequiement
			if(oldData.checkInTelecom.telePhoneOpened || oldData.checkInTelecom.ipTVOpened || oldData.checkInTelecom.broadbandOpened){
				oldData.checkInTelecom.status="Pending";
			}else{
				oldData.checkInTelecom.status="NoRequiement";
			}
			//设置天然气
			if(oldData.checkInNaturalGas==null){
				oldData.checkInNaturalGas = {};
			}
			oldData.checkInNaturalGas.naturalGas=form.getValue("checkInNaturalGas.naturalGas");
			oldData.checkInNaturalGas.status=oldData.checkInNaturalGas.naturalGas ? "Pending" : "NoRequiement";
			//设置一卡通
			if(oldData.checkInMembershipCard==null){
				oldData.checkInMembershipCard = {};
			}
			oldData.checkInMembershipCard.cardCurrency=form.getValue("checkInMembershipCard.cardCurrency");
			oldData.checkInMembershipCard.status=oldData.checkInMembershipCard.cardCurrency ? "Pending" : "NoRequiement";
			oldData.checkInMembershipCard.cardCurrencyMoney=form.getValue("checkInMembershipCard.cardCurrencyMoney");
			//设置搬家
			if(oldData.checkInMoveHouse==null){
				oldData.checkInMoveHouse = {};
			}
			oldData.checkInMoveHouse.sendCar=form.getValue("checkInMoveHouse.sendCar");
			oldData.checkInMoveHouse.status=oldData.checkInMoveHouse.sendCar ? "Pending" : "NoRequiement";
			oldData.checkInMoveHouse.address=form.getValue("checkInMoveHouse.address");
			oldData.checkInMoveHouse.moveHouseDate=form.getValue("checkInMoveHouse.moveHouseDate");
			return oldData;
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"入住准备落实单",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
//								orderString:"endDate:decs",
								properties:"*,memberSigning.room.number,memberSigning.checkInDate,checkInFurinshing.status,checkInMembershipCard.status,checkInNaturalGas.status,checkInRoomConfing.status,checkInTelecom.status,checkInMoveHouse.status",
								fetchProperties:fetchProperties
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.show(".J-grid").hide(".J-tab");
							}
						});
					},
					time:{
						click:function(time){
							widget.get("grid").refresh();
						},
						ranges:{ 
							    "本月": [moment().startOf("month"), moment().endOf("month")], 
						        "今年": [moment().startOf("year"), moment().endOf("year")] 
						    }, 
						    defaultTime:"今年",
						    handler:function(){ 
	 						       widget.get("grid").refresh();     
	 						  }
					},
					buttons:[{
						id:"save",
						text:"保存",
						show:false, 
						handler:function(){
							Dialog.mask(true);
							var oldData=$(".el-ciimplement").data();
							
							var baseinfoForm=widget.get("baseinfo");
							var roomconfigForm=widget.get("roomconfig");
							var serviceForm=widget.get("service");
							var orderflowersForm=widget.get("orderflowers");
							oldData=widget.coverBaseData(oldData,baseinfoForm);
							oldData=widget.coverRoomData(oldData,roomconfigForm);
							oldData=widget.coverSerData(oldData,serviceForm);
							oldData=widget.coverOderFlowerData(oldData,orderflowersForm);
							var data=aw.customParam(oldData);
							//房间配置判断
							var bedding=roomconfigForm.getValue("checkInRoomConfing.bedding");
							var keynumber=roomconfigForm.getValue("checkInRoomConfing.keyNumber");
							if(bedding!=""&&isNaN(bedding)){
								Dialog.alert({
									content:"床品数量只能为数字！"
					    		});
								return;
							}
							if(keynumber!=""&&isNaN(keynumber)){
								Dialog.alert({
									content:"钥匙数量只能为数字！"
					    		});
								return;
							}
							//园区服务预充金额判断
							var cardCurrencyMoney=serviceForm.getValue("checkInMembershipCard.cardCurrencyMoney");
							if(cardCurrencyMoney!=""&&isNaN(cardCurrencyMoney)){
								Dialog.alert({
									content:"请输入有效的预充金额！"
					    		});
								return;
							}
							if(cardCurrencyMoney!=""&&cardCurrencyMoney<0){
								Dialog.alert({
									content:"预充金额不能小于零！"
					    		});
								return;
							}
							//派车时间判断
							var issendCar = serviceForm.getValue("checkInMoveHouse.sendCar");
							var sendaddress = serviceForm.getValue("checkInMoveHouse.address");
							var sendcartime = serviceForm.getValue("checkInMoveHouse.moveHouseDate");
							var checkinDate=baseinfoForm.getValue("checkInDate");
							
							if(issendCar==true){
								if((sendaddress==null||sendaddress=="")||(sendcartime==null||sendcartime=="")){
									Dialog.alert({
										content:"派车地址,时间不能为空"
						    		});
									return;
								}
								if(sendcartime!=""&&moment(sendcartime).isBefore(moment(), 'day')){
									Dialog.alert({
										content:"派车时间不能在今天之前"
						    		});
									return;
								}
								if(sendcartime!=""&&moment(sendcartime).isAfter(moment(checkinDate), 'day')){
									Dialog.alert({
										content:"派车时间不能在入住时间之后"
						    		});
									return;
								}
							}
							
							//订花时间判断
							var isorderFlowers = oldData.checkInOrderflowers.orderFlowers;
							var orderTime = orderflowersForm.getValue("checkInOrderflowers.orderTime");
							var checkinDate = baseinfoForm.getValue("checkInDate");						
							if(isorderFlowers){
								if(orderTime!=""&&moment(orderTime).isAfter(moment(checkinDate), 'day')){
									Dialog.alert({
										content:"订花时间不能在入住时间之后"
						    		});
									return;
								}
							}
							aw.saveOrUpdate("api/checkInImplement/save",data,function(){
								Dialog.mask(false);
								var oldData=$(".el-ciimplement").data();
								widget.get("grid").refresh({
									pkCIImplement:oldData.pkCIImplement,
									fetchProperties:fetchProperties		 	
								});  
								$(".J-card,.J-save").addClass("hidden");
								$(".J-grid,.J-list,.J-building,.J-time,.J-statusQuery,.J-search").removeClass("hidden");
								$(".J-tab,.J-card,.J-return").addClass("hidden");
							});
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							$(".J-card,.J-save").addClass("hidden");
							$(".J-grid,.J-list,.J-building,.J-time,.J-statusQuery,.J-search").removeClass("hidden");
							$(".J-tab,.J-card,.J-return").addClass("hidden");
							return false;
						}
					}],
					buttonGroup:[{
						 id:"statusQuery", 
						  type:"buttongroup",
							items:[{
								key:"Initial",
								value:"初始" 	
							},{
								key:"Edited",
								value:"已设置"
							},{
								key:"Doing",
								value:"准备中" 
							},{
								key:"Confirmed",
								value:"已确认" 
							},{
								value:"全部"	
							}],
							handler:function(key,element){
								widget.get("grid").refresh(); 
							}
					},{
						id:"building",
						showAll:true,
						showAllFirst:"true",
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}]
               }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({ 
				parentNode:".J-grid", 
				url : "api/checkInImplement/query",
				params:function(){
					var time=widget.get("subnav").getValue("time");
					return {
						"status":widget.get("subnav").getValue("statusQuery"),
						"memberSigning.checkInDate":time.start, 
						"memberSigning.checkInDateEnd":time.end,
						"memberSigning.room.building" : widget.get("subnav").getValue("building"), 
						fetchProperties:fetchProperties		 	
					};
				},
				autoRender:false,
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"memberSigning.checkInDate",
						name:"入住时间",
						format:"date"
					},{
						key:"checkInFurinshing.status.value",
						name:"固定资产"
					},{
						key:"checkInRoomConfing.status.value",
						name:"房间配置"
					},{
						key:"checkInTelecom.status.value",
						name:"电信"
					},{
						key:"checkInNaturalGas.status.value",
						name:"天然气"
					},{
						key:"checkInMembershipCard.status.value",
						name:"一卡通"
					},{
						key:"checkInMoveHouse.status.value",
						name:"派车"
					},{
						key:"checkInOrderflowers.status.value",
						name:"订花"
					},{
						key:"status.value",
						name:"落实状态"
					},{
						key:"status",
						name:"操作",
						format:function(value,row){
							var fields=["checkInFurinshing","checkInRoomConfing","checkInTelecom",
							            "checkInNaturalGas","checkInMembershipCard","checkInMoveHouse"];
							var isEdit=true;
							for(var i = 0 ;i < fields.length;i++){
								var status=row[fields[i]] ? row[fields[i]].status.key : "";
								if(status == "Pended" || status == "Acceptance"){
									isEdit=false;
									break;
								}
							}
							if(isEdit||value.key == "Doing"||value.key=="Confirmed"){
								return "button";
							}else{
								return "已开始处理";
							}
						},
						formatparams:[{
							key:"",
							text:"详细",
							show:function(value,row){
								if(value.key == "Doing"||value.key=="Confirmed"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEleu){
								$(".J-grid,.J-list,.J-building,.J-time,.J-statusQuery,.J-search,.J-save").addClass("hidden");
								$(".J-tab,.J-card,.J-return").removeClass("hidden");
								widget.get("roomconfig").setDisabled(true);
								widget.get("baseinfo").setDisabled(true);
								widget.get("orderflowers").setDisabled(true);
								widget.get("service").setDisabled(true);
								aw.ajax({
									url:"api/annualfees/query",
									data:{
										"memberSigning.pkMemberSigning":data.memberSigning.pkMemberSigning,
										fetchProperties:"invoiceStatus,chargeStatus" 
									},
									success:function(result){
										if(result.length==0){
											data.memberSigning.annualFeesPayStatus = "未收费";
										}else{
											var invoiceStatus = result[result.length-1].invoiceStatus || [];
											var chargeStatus = result[result.length-1].chargeStatus || [];
											if(invoiceStatus.key== "Invoiced"){
												data.memberSigning.annualFeesPayStatus = "已开票";
											}else{
													if(chargeStatus.key=="Receiving"){
														data.memberSigning.annualFeesPayStatus = "已到账";
													}
													if(chargeStatus.key=="Charged"){
														data.memberSigning.annualFeesPayStatus = "已收费";
													}
													if(chargeStatus.key=="UnCharge"){
														data.memberSigning.annualFeesPayStatus = "未收费";
													}
											}
										}
										//处理data
										seajs.emit("el-event-checkinimplement-edit",data);
										//缓存data
										$(".el-ciimplement").data(data);
									}
								});
								//处理data
								seajs.emit("el-event-checkinimplement-edit",data);
								//缓存data
								$(".el-ciimplement").data(data);
								widget.get("member").refresh();
								aw.ajax({
									url:"api/membershipcontract/queryNormal",
									data:{
										membershipCard : data.memberSigning.membershipContract.membershipCard.pkMemberShipCard,
										status: "Normal",
										fetchProperties:"contractNo,personalCardowners.personalInfo.name,personalCardowners.personalInfo.sex,personalCardowners.personalInfo.birthday,personalCardowners.personalInfo.mobilePhone"
									},
									success:function(result){
										if(result){
											var cardOwner=result[0].personalCardowners||[];
											for(var i=0;i<cardOwner.length;i++){
												cardOwner[i].membershipCardno=result[0].contractNo;
											}
											widget.get("cardwoner").setData(cardOwner);
										}
									}
								});
							}
						},{
							key:"setting",
							text:"设置",
							show:function(value,row){
								if(value.key == "Initial"||value.key=="Edited"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEleu){
								if(data.memberSigning.members.length==0){
									Dialog.alert({
										content:"至少录入一个"+i18ns.get("sale_ship_owner","会员")+"或权益人!"
									});
									return;
								}
								aw.ajax({
									url:"api/membershipcontract/queryNormal",
									data:{
										membershipCard : data.memberSigning.membershipContract.membershipCard.pkMemberShipCard,
										status: "Normal",
										fetchProperties:"contractNo,personalCardowners.personalInfo.name,personalCardowners.personalInfo.sex,personalCardowners.personalInfo.birthday,personalCardowners.personalInfo.mobilePhone"
									},
									success:function(result){
										if(result.length==0){
											Dialog.alert({
												content:"至少录入一个"+i18ns.get("sale_ship_owner","会员")+"或权益人!"
											});
											return;
										}else{
											var cardOwner=result[0].personalCardowners||[];
											for(var i=0;i<cardOwner.length;i++){
												cardOwner[i].membershipCardno=result[0].contractNo;
											}
											widget.get("cardwoner").setData(cardOwner);
											$(".J-grid,.J-list,.J-building,.J-time,.J-statusQuery,.J-search").addClass("hidden");
											$(".J-tab,.J-card,.J-return,.J-save").removeClass("hidden");
										}
									}
								});
								widget.get("roomconfig").setDisabled(false);
								widget.get("baseinfo").setDisabled(false);
								widget.get("orderflowers").setDisabled(false);
								widget.get("service").setDisabled(false);
//								//订花时间设置
//								var form = widget.get("orderflowers");
//								var day = moment(data.memberSigning.checkInDate).subtract(3, 'days').valueOf();
//								form.setValue("checkInOrderflowers.orderTime",day);
								
								//添加服务费交纳状态
								aw.ajax({
									url:"api/annualfees/query",
									data:{
										"memberSigning.pkMemberSigning":data.memberSigning.pkMemberSigning,
										fetchProperties:"invoiceStatus,chargeStatus" 
									},
									success:function(result){
										if(result.length==0){
											data.memberSigning.annualFeesPayStatus = "未收费";
										}else{
											var invoiceStatus = result[result.length-1].invoiceStatus || [];
											var chargeStatus = result[result.length-1].chargeStatus || [];
											if(invoiceStatus.key== "Invoiced"){
												data.memberSigning.annualFeesPayStatus = "已开票";
											}else{
													if(chargeStatus.key=="Receiving"){
														data.memberSigning.annualFeesPayStatus = "已到账";
													}
													if(chargeStatus.key=="Charged"){
														data.memberSigning.annualFeesPayStatus = "已收费";
													}
													if(chargeStatus.key=="UnCharge"){
														data.memberSigning.annualFeesPayStatus = "未收费";
													}
											}
										}
										//处理data
										seajs.emit("el-event-checkinimplement-edit",data);
										//缓存data
										$(".el-ciimplement").data(data);
									}
								});
								//处理data
								seajs.emit("el-event-checkinimplement-edit",data);
								//缓存data
								$(".el-ciimplement").data(data);
								widget.get("member").refresh();
							}
						},{
							key:"doing",
							text:"准备",
							show:function(value,row){
								if(value.key == "Edited"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){ 
								aw.ajax({
									url:"api/annualfees/query",
									data:{
										"payer.memberSigning":data.memberSigning.pkMemberSigning,
										fetchProperties:"chargeStatus" 
									},
									success:function(result){
										if(result.length == 0 || result[0].chargeStatus.key!="Receiving"){
											//不可以准备
											Dialog.alert({
												content:"对应服务费收费状态为“已到账”才可以进行确认!"
											});
											return false;
										} else {
											aw.ajax({
												url:"api/checkinimplement/changetodoing",
												dataType:"json", 
												data:{
													pkCIImplement: data.pkCIImplement,
													version:data.version
												},
												success:function(data){	
													$(".J-card,.J-save").addClass("hidden");
													$(".J-grid,.J-list,.J-building,.J-time,.J-statusQuery").removeClass("hidden");
													$(".J-tab,.J-card,.J-return").addClass("hidden");
													widget.get("grid").refresh({
														pkCIImplement:data.pkCIImplement,
														fetchProperties:fetchProperties
													});
												}
											});
										}
									}
								})
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			var tab=new Tab({
				parentNode:".J-tab",
				model:{
					items:[{
						id:"cibaseinfo",
						title:"入住基本信息"
					},{
						id:"ciroomconfig",
						title:"房间配置"
					},{
						id:"ciorderflowers",
						title:"订花服务"
					},{
						id:"ciservice",
						title:"园区服务"
					},{
						id:"cimemberinfo",
						title:i18ns.get("sale_ship_owner","会员")+"信息"
					},{
						id:"cicardownerinfo",
						title:"权益人信息"
					}]
				}
			});
			
			this.set("baseinfo",cii_baseinfo(this));
			this.set("roomconfig",cii_roomconfig(this));
			this.set("orderflowers",cii_orderflowers(this));
			this.set("service",cii_service(this));
			this.set("member",cii_member(this));
			this.set("cardwoner",cii_cardwoner(this));
			this.set("tab",tab);
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("grid").refresh({
			    	memberSigning:params.pkFather,
			    	fetchProperties:fetchProperties		 	
			 });
			}else if(params && params.MemberSigning){
				  widget.get("grid").refresh({
				    	memberSigning:params.MemberSigning,
				    	fetchProperties:fetchProperties		 	
				 });
			} else {
				widget.get("grid").refresh();
			}
		},
		destroy:function(){
			seajs.off("el-event-checkinimplement-edit");
			ciimplement.superclass.destroy.call(this,arguments);
		}
	});
	module.exports = ciimplement;
});