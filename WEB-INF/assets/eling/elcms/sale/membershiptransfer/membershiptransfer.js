/**
 * 会籍转让
 * 
 * @author cjf
 */
define(function(require, exports, module) {
	var ELView = require("elview");
	var Subnav = require("subnav");
	var aw = require("ajaxwrapper");
	var Grid = require("grid");
	var Form = require("form");
	var Dialog=require("dialog");
	var emnu = require("enums");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
				 "<div class='J-grid' ></div>"+
				 "<div class='box'>" +
				 "<div class='box-header' style='text-align:center' hidden>原"+i18ns.get("sale_ship_contract","会籍签约")+"</div>"+
				 "<div class='J-previousform hidden' ></div>" +
				 "</div>"+
				 "<div class='box'>" +
				 "<div class='box-header' style='text-align:center' hidden>新"+i18ns.get("sale_ship_contract","会籍签约")+"</div>"+
				 "<div class='J-newcontractform hidden'></div>" +
				 "</div>";
	var membershiptransfer = ELView.extend({
		attrs:{
	        template:template
		},
		events : {
			"change .J-form-newcontract-select-checkInType" : function(e){
				var newcontractform = this.get("newcontractform");
				var checkInType = newcontractform.getValue("checkInType");
				if(checkInType=="NotIn"){
					newcontractform.hide(["memberAssessment","flowStatus","room"]);
					newcontractform.load("memberAssessment");
					newcontractform.setValue("flowStatus","");
					newcontractform.load("room");
					
				}else{
					newcontractform.show(["memberAssessment","flowStatus","room"]);
					newcontractform.load("memberAssessment");
					newcontractform.setValue("flowStatus","");
					newcontractform.load("room");
				}
				if(checkInType!="HouseingNotIn"){
					newcontractform.hide(["annualfees"]);
					newcontractform.setValue("annualfees","");
				}else{
					newcontractform.show(["annualfees"]);
					newcontractform.setValue("annualfees","");
				}
					
			},
			//统一去掉日期校验
			/*"change .J-form-newcontract-date-signDate":function(e){
				var newcontractform = this.get("newcontractform");
				var signDate = newcontractform.getValue("signDate");
				if(signDate>moment()){
					Dialog.alert({
						content:"签约日期不能大于今天！"
					});
					newcontractform.setValue("signDate",moment().valueOf());
					return;
				}
			},
			"change .J-form-previouscontract-date-transferDate":function(e){
				var previousform = this.get("previousform");
				var transferDate = previousform.getValue("transferDate");
				if(transferDate>moment()){
					Dialog.alert({
						content:"转让日期不能大于今天！"
					});
					previousform.setValue("transferDate",moment().valueOf());
					return;
				}
			},*/
			"change .J-form-newcontract-select-memberAssessment":function(e){
				var newcontractform = this.get("newcontractform");
				var memberAssessment = newcontractform.getValue("memberAssessment");
				var pkType=this.get("newcontractform").getValue("memberAssessment");
				var memberAssessmentdata = this.get("newcontractform").getData("memberAssessment");
				var dataType = new Array(); 
				for(var i=0;i<memberAssessmentdata.length;i++){
					if(pkType[0]==memberAssessmentdata[i].pkMemberAssessment){
						dataType.push(memberAssessmentdata[i]);
					}
				}
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
						this.get("newcontractform").setValue("memberAssessment","");
						return false;
					}
				}
				var status="";
				for(var i=0;i<dataType.length;i++){
					status+=dataType[i].flowStatus.value+",";
				}
				status=status.substring(0,status.length-1);
				this.get("newcontractform").setValue("flowStatus",status);
				var roomseldata=this.get("newcontractform").getData("room");
				if(dataType[0]!=null&&dataType[0].room!=null){
					roomseldata.push(dataType[0].room);
				}
				this.get("newcontractform").setData("room",roomseldata);
				if(dataType.length>0){
					this.get("newcontractform").setValue("room",dataType[0].room);
				}
				if(memberAssessment.length<=0){
					newcontractform.setValue("flowStatus","");
					newcontractform.load("room");
					newcontractform.load("memberAssessment");
				}
			},
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会籍转让",
					items:[{
						id:"search",
						type:"search",
						placeholder : i18ns.get("sale_card_name","卡号"),
						handler : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/membershiptransfer/search",
								data:{
									s:str,
									properties:"membershipCard.name",
									fetchProperties:"membershipCard.pkMemberShipCard," +
									"membershipCard.name,membershipCard.cardType.name," +
									"membershipCard.cardType.pkMemberShipCardType,"+
									"membershipCard.cardStatus,membershipCard.toBeStatus," +
									"membershipCard.backCardDate,membershipCard.backCardReason,"+
									"pkMembershipContract,"+
									"contractNo,"+
									"room.number,"+
									"room.pkRoom,"+
									"memberAssessment.pkMemberAssessment,"+
									"memberAssessment.assessmentNumber,"+
									"memberAssessment.flowStatus,"+
									"signDate,"+
									"stopDate,"+
									"purchaseReason,"+
									"cardownerType,"+
									"memberShipFees,"+
									"charged,"+
									"operator.pkUser,"+
									"operator.name,"+
									"version,"+
									"checkInType",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
						id:"return",
						text:"返回",
						type:"button",
						show:false,
						handler : function() {
							widget.get("subnav").hide(["return"]).show(["search","all"]);
							widget.show([".J-grid"]).hide([".J-previousform",".J-newcontractform"]);
							$(".box-header").hide();
						}
					},{
						id:"all",
						text:"查看全部",
						type:"button",
						handler : function() {
							widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url:"api/membershiptransfer/querycard",
					params : function(){
						return {
							fetchProperties:"membershipCard.pkMemberShipCard," +
									"membershipCard.name,membershipCard.cardType.name," +
									"membershipCard.cardType.pkMemberShipCardType,"+
									"membershipCard.cardStatus,membershipCard.toBeStatus," +
									"membershipCard.backCardDate,membershipCard.backCardReason,"+
									"pkMembershipContract,"+
									"contractNo,"+
									"room.number,"+
									"room.pkRoom,"+
									"memberAssessment.pkMemberAssessment,"+
									"memberAssessment.assessmentNumber,"+
									"memberAssessment.flowStatus,"+
									"signDate,"+
									"stopDate,"+
									"purchaseReason,"+
									"cardownerType,"+
									"memberShipFees,"+
									"charged,"+
									"operator.pkUser,"+
									"operator.name,"+
									"version,"+
									"checkInType",
	                    };
					},
					columns:[{
						name:"membershipCard.name",
						label: i18ns.get("sale_card_name","卡号")
					},{
						name:"membershipCard.cardType.name",
						label: i18ns.get("sale_card_type","卡号类型")
					},{
						name:"membershipCard.cardStatus.value",
						label: i18ns.get("sale_card_status","会籍状态"),
					},{
						label:"查看权益人",
						format:"button",
						formatparams:[{
							id:"cardowner",
							text:"查看权益人",
							handler:function(index,data,rowEle){
								aw.ajax({
									url:"api/membershipcontract/query",
									dataType:"json",
									data:{
										pkMembershipContract : data.pkMembershipContract,
									},
									success:function(result){
										if(result && result.length!=0){
											if(result[0].cardownerType=="ORGANIZATIONAL"){
												//机构
												widget.openView({
													url:"eling/elcms/sale/organpeople/organpeople",
													params:{
														pkMembershipContract : result[0].pkMembershipContract
													},
													isAllowBack:true
													
												});
											}else{
												//个人
												widget.openView({
													url:"eling/elcms/sale/people/people",
													params:{
														pkMembershipContract : result[0].pkMembershipContract
													},
													isAllowBack:true
												});
											}
										}else{
											Dialog.alert({
												content:"该会籍卡没有进行"+i18ns.get("sale_ship_contract","会籍签约"),
											});
										}
									}
								});
							}
						}]
					},{
						name:"operate",
						label:"操作",
						format:"button",
						formatparams:[{
							id:"transfer",
							text:"转让",
							handler:function(index,data,rowEle){
								var signDate = moment(data.signDate).format("YYYYMMDD");
								var contractNoDate = moment().format("YYYYMMDD");
								var newContractNoDate = data.contractNo.substring(data.contractNo.length-8,data.contractNo.length);
								if(contractNoDate==newContractNoDate && signDate==contractNoDate){
									Dialog.alert({
										content:"当天签约的会籍卡不能在当天进行转让！"
									});
									return false;
								}
								if(contractNoDate==newContractNoDate){
									Dialog.alert({
										content:"同一会籍卡不能在同一天进行多次转让！"
									});
									return false;
								}
								if(data.checkInType.key=="HouseingNotIn"){
									Dialog.alert({
										content:"入住状态为“选房不入住”,暂不能进行会籍转让！"
									});
									return false;
								}
								$(".box-header").show();
								widget.get("subnav").hide(["search","all"]).show(["return"]);
								widget.hide([".J-grid"]).show([".J-previousform",".J-newcontractform"]);
								//原会籍签约表单赋值
								var previousform = widget.get("previousform");
								previousform.reset();
								previousform.setDisabled("purchaseReason",true);
								previousform.setDisabled("cardownerType",true);
								previousform.setDisabled("signDate",true);
								previousform.setValue("checkInType",data.checkInType);
								var temp = widget.get("previousform").getValue("checkInType");
								if(temp=="NotIn" || temp == ""){
									previousform.hide(["memberAssessment","flowStatus","room"]);
								}else{
									previousform.show(["memberAssessment","flowStatus","room"]);
									if(data.memberAssessment.length>0){
										previousform.setValue("memberAssessment",data.memberAssessment);
									}
									var status="";
									for(var i=0;i<data.memberAssessment.length;i++){
										status+=data.memberAssessment[i].flowStatus.value+",";
									}
									status=status.substring(0,status.length-1);
									previousform.setValue("flowStatus",status);
								}
								data.cardType=data.membershipCard.cardType.name;
								previousform.setValue("pkMembershipContract",data.pkMembershipContract);
								previousform.setValue("version",data.version);
								previousform.setValue("charged",data.charged);
								data.room != null?previousform.setValue("room",data.room):"";
								previousform.setValue("cardType",data.cardType);
								previousform.setValue("contractNo",data.contractNo);
								previousform.setValue("membershipCard",data.membershipCard);
								previousform.setValue("operator",data.operator);
								previousform.setValue("cardownerType",data.cardownerType);
								previousform.setValue("purchaseReason",data.purchaseReason);
								previousform.setValue("memberShipFees",data.memberShipFees);
								previousform.setValue("signDate",data.signDate);
								previousform.setValue("transferFee",Math.round(data.memberShipFees*0.1));//四舍五入取整
								//新会籍签约表单赋值
								// TODO cjf 会籍转让
								var newcontractform = widget.get("newcontractform");
								newcontractform.reset();
								newcontractform.setValue("membershipCard",data.membershipCard);
								newcontractform.setValue("cardType",data.cardType);
								//拼合同号
								var contractName = data.membershipCard.name+moment().format("YYYYMMDD");
								newcontractform.setValue("contractNo",contractName);
							}
						}]
					}]
				},
			});
			this.set("grid",grid);
			
			var previousform = new Form({
				parentNode:".J-previousform",
				model:{
					id:"previouscontract",
					defaultButton:false,
					items:[{
						name:"pkMembershipContract",
						type:"hidden"
					},{
						name:"version",
						type:"hidden"
					},{
						name:"BindRoom",
						type:"hidden"
					},{
						name:"charged",
						defaultValue:false,
						type:"hidden"
					},{
						name:"membershipCard",
    					label:"会籍卡",
    					type:"select",
    					url : "api/card/notmemsigned",
    					key:"pkMemberShipCard",
    					value:"name",
    					lazy:true,
    					readonly:true,
                        params : function(){
                            return {
                            	fetchProperties:"name,cardStatus,cardType.name,cardType.isBindRoom",
                            };
                        },
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						},
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
						readonly:true,
						options:emnu["com.eling.elcms.sale.model.MembershipContract.CheckInType"],
						type:"select",
    					validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"room",
						label:"房间号",
						type:"select",
						key:"pkRoom",
						value:"number",
						url:"api/room/query",
						readonly:true,
						lazy:true,
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
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"],
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
						type:"radio",
						list:[{
							key:"ORGANIZATIONAL",
							value:"机构"
						},{
							key:"PERSONAL",
							value:"个人",
						}],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"purchaseReason",
						label:"购买原因",
						type:"radio",
						list:[{
							key:"INVESTMENT",
							value:"投资"
						},{
							key:"PERSONAL",
							value:"自用",
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
						mode:"YYYY-MM-DD",
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
						readonly:true,
						url:"api/user/role?roleIn=3,17",//TODO 用户角色：wulina
						lazy:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"memberShipFees",
						label:"卡费",
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"transferDate",
						label:"转让日期",
						type:"date",
						mode:"YYYY-MM-DD",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"transferFee",
						label:"转让手续费",
						validate:["required","number"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"transferReason",
						label:"转让原因",
						type:"textarea",
						exValidate: function(value){
							if(value.length>510){
								return "不能超过500个字符";
							}else{
								return true;
							}
						},
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					}]
				}
			});
			this.set("previousform",previousform);
			
			
			//新会籍签约表单
			var newcontractform = new Form({ // TODO 新签约的表单
				parentNode:".J-newcontractform",
				model:{
					id:"newcontract",
					saveaction:function(){
						var newcontractform=widget.get("newcontractform");
						var previousform = widget.get("previousform");
						/*var cards=form.getValue("membershipCard");
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
						}*/
						//检验如果是选房不入住和入住 必须选房间
						var room  = newcontractform.getValue("room");
						var type = newcontractform.getValue("checkInType");
						if(type=="CheckIn"||type=="HouseingNotIn"){
							if(!room){
								Dialog.alert({
									content:"请选择房间！"
								});
								return;
							}
						}
						var pkMembershipContract = previousform.getValue("pkMembershipContract");
						var transferFee = previousform.getValue("transferFee");
						if(transferFee==null || transferFee==""){
							Dialog.alert({
								content:"请输入转让手续费!"
							});
							return;
						}
						var transferDate = previousform.getValue("transferDate");
						if(transferDate==null || transferDate==""){
							Dialog.alert({
								content:"请填写转让日期!"
							});
							return;
						}
						var transferReason = previousform.getValue("transferReason");
						var TransferType = "Transfer";
						var pkRoom = previousform.getValue("room");
						//将原会籍签约变为终止
						aw.saveOrUpdate("api/membershiptransfer/transfer?pkMc="+pkMembershipContract+"&pkR="+pkRoom,
								aw.customParam(newcontractform.getData())
								,function(data){
							//创建json
							var cond = {
									transferFee : transferFee,
									transferDate : transferDate,
									transferReason : transferReason,
									TransferType : TransferType,
									newContract : data.pkMembershipContract,
									previousContract : pkMembershipContract,
							};
							aw.saveOrUpdate("api/membershiptransfer/savemembershiptransfer",cond,function(datas){
								widget.get("grid").refresh()
								Dialog.confirm({
								title:"提示",
								content:"跳转到权益人档案节点？",
								confirm:function(){
									if(data.cardownerType=="ORGANIZATIONAL"){
										//机构
										widget.openView({
											url:"eling/elcms/sale/organpeople/organpeople",
											params:{
												pkMembershipContract : datas.newContract.pkMembershipContract
											},
											isAllowBack:true
										});
									}else{
										//个人
										widget.openView({
											url:"eling/elcms/sale/people/people",
											params:{
												pkMembershipContract : datas.newContract.pkMembershipContract
											},
											isAllowBack:true
										});
									}
								}
							});
								widget.get("subnav").hide(["return"]).show(["search","all"]);
								widget.show([".J-grid"]).hide([".J-previousform",".J-newcontractform"]);
								$(".box-header").hide();
							})
						})
					},
					cancelaction:function(){
						widget.get("subnav").hide(["return"]).show(["search","all"]);
						widget.show([".J-grid"]).hide([".J-previousform",".J-newcontractform"]);
						$(".box-header").hide();
					},
					items:[{
						name:"charged",
						defaultValue:false,
						type:"hidden"
					},{
						name:"membershipCard",
    					label:"会籍卡",
    					type:"select",
    					url : "api/card/notmemsigned",
    					key:"pkMemberShipCard",
    					value:"name",
    					lazy:true,
    					readonly:true,
                        params : function(){
                            return {
                            	fetchProperties:"name,cardStatus,cardType.name,cardType.isBindRoom",
                            };
                        },
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						},
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
						options:emnu["com.eling.elcms.sale.model.MembershipContract.CheckInType"],
						type:"select",
    					validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"room",
						label:"房间号",
						type:"select",
						key:"pkRoom",
						value:"number",
						url:"api/room/query",
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
						validate:["required"],
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
						type:"radio",
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
						type:"radio",
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
						mode:"YYYY-MM-DD",
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
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"memberShipFees",
						label:"卡费",
						validate:["required","number"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"annualfees",
						label:"服务费",
						defaultValue:0,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					}]
				}
			});
			this.set("newcontractform",newcontractform);
		},
		afterInitComponent:function(params,widget){
			var newcontractform=widget.get("newcontractform");
			newcontractform.hide(["annualfees"]);
		}
	});
	module.exports = membershiptransfer;
});