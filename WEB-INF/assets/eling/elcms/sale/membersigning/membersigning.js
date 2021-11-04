
define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var store=require("store");
	var  loginUser = store.get("user");
	var enmu = require("enums"); 
	var params = null;
	//多语
	var i18ns = require("i18n"); 
	var MemberSigning = BaseView.extend({
		events:{
			"change select.J-membershipContract":function(e){
				var card = this.get("card") ;
				var pkcard=card.getValue("membershipContract");  
				//带出会籍签约的房间
				var roomdata=card.getData("room");
				aw.ajax({
					url:"api/membershipcontractfees/query",
					data:{
						memberShipContract:pkcard,
						fetchProperties:"memberShipContract.room.pkRoom,memberShipContract.room.number,feesdetails.chargeStatus"
					},
					dataType:"json",
					success:function(data){
						if(data.length>0){
							var flag =true;
							var items= data[0].feesdetails;
							if(items.length>0){
								if(params&&params.customize&&params.customize=="linxuan"){
									//海宁林轩环境
									for(var i=0;i<items.length;i++){
										if(items[i].chargeStatus.key =="Receiving"){
											flag =true;
											break;
										}else if(i==(items.length-1)&&items[i].chargeStatus.key !="Receiving"){
											flag =false;
										}
									}
								}else{
									//其他环境
									for(var i=0;i<items.length;i++){
										if(items[i].chargeStatus.key !="Receiving"){
											flag =false;
											break;
										}else if(i==(items.length-1)&&items[i].chargeStatus.key =="Receiving"){
											flag =true;
										}
									}
								}
							}else{
								flag =false;
							}
							
							if(flag){
								if(data[0].memberShipContract.room){
									roomdata.push(data[0].memberShipContract.room);
									card.setModel("room",roomdata);
									card.setValue("room",data[0].memberShipContract.room);
								}else{
									card.setValue("room","");
								}
							}else{
								card.setValue("membershipContract",{});
								if(params&&params.customize&&params.customize=="linxuan"){
									//海宁林轩环境
									Dialog.alert({
										content:"无确认到账记录！"
									})
									return;
								}else{
									//其他环境
									Dialog.alert({
										content:"卡费未全部到账！"
									})
									return;
								}
								
							}
						}else{
							card.setValue("membershipContract",{});
							Dialog.alert({
								content:"无卡费交款记录！"
							})
							return;
						}
					}
				});
			},
			"change .J-signDate":function(e){
				var card = this.get("card") ;
				var signdate = card.getValue("signDate");
				if(signdate){
					card.setValue("checkInDate",moment(signdate).add(15,"days").valueOf());
					card.setValue("annualFeeDate",moment(signdate).add(15,"days").valueOf());
				}else{
					card.setValue("checkInDate");
					card.setValue("annualFeeDate");
				}
				
			},
			"change .J-checkInDate":function(e){
				var card = this.get("card") ;
				var checkInDate = card.getValue("checkInDate");
				if(checkInDate){
					card.setValue("annualFeeDate",moment(checkInDate).valueOf());
				}else{
					card.setValue("annualFeeDate");
				}
				
			}
		},
		initSubnav:function(widget){
			params = widget.get("params") || {};
			return {
				model:{
					title:  i18ns.get("sale_ship_owner","会员")+"签约",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/membersign/search",
							data:{
								s:str,
								houseingNotIn:false,
								properties:"contractNo," +
										"membershipContract.membershipCard.name," +
										"membershipContract.membershipCard.cardType.name," +
										"room.number," +
										"wantedRoomType.name," +
										"annualFee," +
										"membershipContract.membershipCard.CardStatus," +
										"signDate," +
										"room.status",
										fetchProperties:"*,membershipContract.membershipCard.cardType.name,room.number,room.status.value," +
										"wantedRoomType.name,card.cardStatus,members.pkMember,membershipContract.pkMembershipContract,membershipContract.membershipCard.name",
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
						handler:function(){
							var subnav=	widget.get("subnav");
							subnav.hide(["status","roomstatus","cardType","add","date","search"]).show(["return"]);
							widget.get("card").reset();
							widget.get("card").removeAttribute("annualFeePerson","readonly");
							widget.get("card").removeAttribute("annualFeePersonPhone","readonly");
							var userSelect=widget.get("card").getData("operator","");
							userSelect.push(loginUser);
							widget.get("card").setModel("operator",userSelect);
							widget.get("card").setValue("operator",loginUser);
							widget.list2Card(true);
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							var subnav=	widget.get("subnav");
							subnav.show(["status","roomstatus","cardType","add","date","search"]).hide(["return"]);
							widget.list2Card(false);
						}
					}],
					buttonGroup:[{
						id:"status",
						showAll:true,
						tip:"签约状态",
						items:enmu["com.eling.elcms.member.model.MemberSigning.Status"],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"roomstatus",
						tip:"入住状态",
						showAll:true,
						items:[{
							key:"InUse",
							value:"使用中"
						},{
							key:"Waitting",
							value:"待入住"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"cardType",
						tip:  i18ns.get("sale_card_type","卡类型"),
						key:"pkMemberShipCardType",
						showAll:true,
						showAllFirst:true,
						value:"name",
						url:"api/cardtype/query",
						handler:function(key,element){
							widget.get("list").refresh();
							}
					},{
						id:"date",
						tip:"签约日期",
						items:[{
							key:"0",
							value:"本月"
						},{
							key:"1",
							value:"今天"
						},{
							key:"2",
							value:"本周"
						},{
							key:"3",
							value:"上月"
						},{
							key:"",
							value:"全部"
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
				url : "api/membersign/query",
				fetchProperties:"*,membershipContract.membershipCard.cardType.name,room.number,room.status.value," +
				"wantedRoomType.name,membershipContract.membershipCard.cardStatus,members.pkMember,membershipContract.pkMembershipContract,membershipContract.membershipCard.name",
				params:function(){
					return {
						"status":widget.get("subnav").getValue("status"),
						"houseingNotIn":false,
						"room.status":widget.get("subnav").getValue("roomstatus"),
						"membershipContract.membershipCard.cardType.pkMemberShipCardType":widget.get("subnav").getValue("cardType"),
						date:widget.get("subnav").getValue("date")
					};
				},
				model:{
					columns:[{
						name: i18ns.get("sale_card_name","会籍卡号"),
						key:"membershipContract.membershipCard.name",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								aw.ajax({
									url : "api/annualfeepayer/query",
									type : "POST",
									data : {
										memberSigning:data.pkMemberSigning,
										status:"Normal",
										fetchProperties:"pkPayer,personalInfo.name,personalInfo.mobilePhone"
									},
									success:function(data){	
										var card=widget.get("card");
										if(data.length>0&&data[0].personalInfo!=null){
											card.setValue("annualFeePerson",data[0].personalInfo.name);
											card.setValue("annualFeePersonPhone",data[0].personalInfo.mobilePhone);
										}
									}
								});
								var subnav=	widget.get("subnav");
								subnav.hide(["status","roomstatus","cardType","add","date","search"]).show(["return"]);
								//首先处理会籍卡下拉列表
								var selcarddata=widget.get("card").getData("membershipContract");
								selcarddata.push(data.membershipContract);
								//之后处理房间下拉列表
								var selroomdata=widget.get("card").getData("room");
								selroomdata.push(data.room);
								widget.edit("detail",data);
								widget.get("card").setModel("membershipContract",selcarddata);
								widget.get("card").setValue("membershipContract",data.membershipContract);
								widget.get("card").setModel("room",selroomdata);
								widget.get("card").setValue("room",data.room);
								
								if(data.operator.pkUser==loginUser.pkUser){
									var userSelect=widget.get("card").getData("operator","");
									userSelect.push(loginUser);
									widget.get("card").setModel("operator",userSelect);
									widget.get("card").setValue("operator",loginUser);
								}
								return false;
							}
						}]
						
					},{
						name: i18ns.get("sale_card_type","会员卡种类"),
						format:function(value,row){
							var card=row.membershipContract.membershipCard || {};
							return card && card.cardType? card.cardType.name : "";
						}
					},{
						key:"room.number",
						name:"已选房间"
					},{
						key:"wantedRoomType.name",
						name:"房型偏好"
					},{
						key:"annualFee",
						name:"服务费(元)"
					},{
						name:"房间状态",
						key:"room.status.value"
					},{
						key:"signDate",
						name:"签约日期",
						format:"date"
					},{
						key:"checkInDate",
						name:"入住时间",
						format:"date"
					},{
						name:"签约状态",
						key:"status.value"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								aw.ajax({
									url : "api/annualfeepayer/query",
									type : "POST",
									data : {
										memberSigning:data.pkMemberSigning,
										status:"Normal",
										fetchProperties:"pkPayer,personalInfo.name,personalInfo.mobilePhone"
									},
									success:function(data){	
										var card=widget.get("card");
										if(data.length>0&&data[0].personalInfo!=null){
											card.setValue("annualFeePerson",data[0].personalInfo.name);
											card.setValue("annualFeePersonPhone",data[0].personalInfo.mobilePhone);
										}
										card.setAttribute("annualFeePerson","readonly","readonly");
										card.setAttribute("annualFeePersonPhone","readonly","readonly");
									}
								});
								var subnav=	widget.get("subnav");
								subnav.hide(["status","roomstatus","cardType","add","date","search"]).show(["return"]);
								//首先处理会籍卡下拉列表
								var selcarddata=widget.get("card").getData("membershipContract");
								selcarddata.push(data.membershipContract);
								//之后处理房间下拉列表
								var selroomdata=widget.get("card").getData("room");
								selroomdata.push(data.room);
								widget.edit("edit",data);
								widget.get("card").setModel("membershipContract",selcarddata);
								widget.get("card").setValue("membershipContract",data.membershipContract);
								widget.get("card").setModel("room",selroomdata);
								widget.get("card").setValue("room",data.room);
								if(data.operator.pkUser==loginUser.pkUser){
									var userSelect=widget.get("card").getData("operator","");
									userSelect.push(loginUser);
									widget.get("card").setModel("operator",userSelect);
									widget.get("card").setValue("operator",loginUser);
								}
								widget.get("card").setAttribute("room","readonly","readonly");
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
					//TODO：首先处理会员，加校验
					var para=$("#membersign").serialize()+"&params="+(params?params.customize:"");
					widget.save("api/membersign/save",para,function(data){
						widget.get("list").refresh();
						Dialog.confirm({
							title:"提示",
							content:"跳转到"+ i18ns.get("sale_ship_owner","会员")+"基本信息节点？",
							confirm:function(){
									widget.openView({
										url:"eling/elcms/membercenter/member/member",
										params:{
											pkMemberSigning : data.pkMemberSigning
										}
									});
								}
						});
					});
					var subnav=	widget.get("subnav");
					subnav.show(["status","roomstatus","cardType","add","date","search"]).hide(["return"]);
					widget.list2Card(false);
				},
				//取消按钮
  				cancelaction:function(){
  					var subnav=	widget.get("subnav");
					subnav.show(["status","roomstatus","cardType","add","date","search"]).hide(["return"]);
					widget.list2Card(false);
  				},
				model:{
					id:"membersign",
					items:[{
						name:"pkMemberSigning",
						type:"hidden"
					},{
						name:"contractNo",
						type:"hidden"
					},{
						name:"membershipContract",
						label: i18ns.get("sale_card_name","会籍卡号"),
						type:"select",
						url:"api/membershipcontract/queryNotSign",
						params:{
							fetchProperties:"membershipCard.name,pkMembershipContract"
						},
						key:"pkMembershipContract",
						value:"membershipCard.name",
						validate:["required"]
					},{
						name:"room",
						label:"房间",
						type:"select",
						url:"api/room/query",
						params:{
							status:"Empty",
							useType:"Apartment",
							fetchProperties:"number,pkRoom"
						},
						key:"pkRoom",
						value:"number",
						validate:["required"]
					},{
						name:"wantedRoomType",
						label:"房型偏好",
						type:"select",
						url:"api/roomType/query",
						params:{
							fetchProperties:"name,pkRoomType"
						},
						key:"pkRoomType",
						value:"name"
						//validate:["required"]
					},{
						name:"annualFee",
						label:"服务费(元)",
						validate:["money","required"]
					},{
						name:"signDate",
						label:"签约日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"operator",
						label:"经手人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/users",//TODO 用户角色：wulina
						params:{
							fetchProperties:"name,pkUser"
						},
						validate:["required"]
					},{
						name:"memberNames",
						label:  i18ns.get("sale_ship_owner","会员")+"名称"
					},{
						name:"checkInDate",
						label:"入住时间",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"annualFeeDate",
						label:"服务费生效日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"memberEnteringStatus",
						label:  i18ns.get("sale_ship_owner","会员")+"信息录入状态",
						defaultValue:"否",
						readonly:true
					},{
						name:"annualFeePerson",
						label:"服务费付款人",
						validate:["required"]
					},{
						name:"annualFeePersonPhone",
						label:"服务费付款人电话",
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = MemberSigning;
});