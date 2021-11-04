/*
 * 会员卡充值明细
 */
define(function(require, exports, module){
	var ELView = require("elview");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Form = require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	var store=require("store");
    var loginUser=store.get("user");
    //多语
    var i18ns = require("i18n");
	var template = "<div class='J-subnav'></div>"+
				"<div class='J-grid'></div>"+
				"<div class='J-form hidden'></div>";
	var cardrechargedetails = ELView.extend({
			events:{
			},
			attrs:{
				template:template
			},

			initComponent:function(params,widget){
				var subnav = new Subnav({
					parentNode:".J-subnav",
					model : {
						title:"会员卡充值明细",
						buttons:[{
								id:"return",
								text:"返回",
								show:false,
								handler:function(){
									if(params&&params.father=="cardbalance"&&params.intetion=="charge"){ 
				  						widget.openView({
											url:"eling/elcms/consume/cardrecharge/cardrecharge",
										});
				  					}else if(params&&params.father=="cardbalance"&&params.intetion=="chargedetail"){
				  						widget.openView({
											url:"eling/elcms/consume/cardrecharge/cardrecharge",
										});
				  					}
									else{
				  						widget.show([".J-grid,.J-adds,.J-time"]).hide([".J-form,.J-return"]); 
				  					}
									return false;
									}
								},
								{
								id:"adds",
								text:"增加",
								show:true,
								handler:function(){
									aw.ajax({
										url : "api/cardbalance/query",
										autoRender:false,
										data:{
											fetchProperties : "apps.amounts,totalMoney,balance",
											pkCardbalance:params.pkCardbalance
										},
										dataType:"json",
			        					success:function(data){ 
											widget.get("form").setValue("totalMoney",data[0].totalMoney);
											widget.get("form").setValue("balance",data[0].balance);
			        					}
									});
									
									widget.get("form").setValue("creator",loginUser.name);
									widget.get("form").setAttribute("creator","readonly","readonly");
									
									widget.get("form").removeAttribute("idCardNo","readonly","readonly");
									
									if(params&&params.father=="cardbalance"&&params.intetion=="chargedetail"){
										widget.get("subnav").hide(["adds","time","return"]);
										widget.show([".J-form"]).hide([".J-grid"]);
										widget.get("form").setValue("pkCardRecharge","");
										widget.get("form").setValue("version","");
										widget.get("form").setValue("amounts","");
//										widget.get("form").setValue("idCardNo","");
										widget.get("form").setValue("rechargeWay","");
										widget.get("form").setValue("idCardNo","");
										widget.get("form").setValue("dataSource","");
										widget.get("form").setValue("description","");
										
									}else if(params&&params.father=="cardbalance"&&params.intetion=="charge"){
										widget.get("subnav").hide(["adds","time","return"]);
										widget.show([".J-form"]).hide([".J-grid"]);
										widget.get("form").setValue("pkCardRecharge","");
										widget.get("form").setValue("version","");
										widget.get("form").setValue("amounts","");
//										widget.get("form").setValue("idCardNo","");
										widget.get("form").setValue("rechargeWay","");
										widget.get("form").setValue("idCardNo","");
										widget.get("form").setValue("dataSource","");
										widget.get("form").setValue("description","");
									}else{
										widget.get("subnav").hide(["adds","time"]).show(["return"]);
										widget.show([".J-form"]).hide([".J-grid"]);
									}
									 
									}
								}],
								time:{
									ranges:{
										"今天": [moment().startOf("days"),moment().endOf("days")],
										"本月": [moment().startOf("month"), moment().endOf("month")],
										"上月":[moment().subtract(1,"months").startOf("month"), moment().subtract(1,"months").endOf("month")],
										"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
										
									},
									defaultTime:"本月",
									click:function(time){
										widget.get("grid").refresh();
									}
								}
					}
				});
				this.set("subnav",subnav);
				
				var grid = new Grid({
					parentNode:".J-grid",
					url:"api/cardrecharge/query",
//					autoRender:false,
					fetchProperties : "cardBalance.membershipContract.membershipCard.pkMemberShipCard,cardBalance.membershipContract.room.number,cardBalance.membershipContract.personalCardowners.personalInfo.name,cardBalance.membershipContract.membershipCard.name,"+
										"pkCardRecharge,idCardNo,date,amounts,rechargeWay.value,dataSource.value,description,version,"+
										"cardBalance.pkCardbalance,cardBalance.balance,cardBalance.status.value,cardBalance.totalAmounts,"+
										"cardBalance.membershipContract.personalCardowners,cardBalance.membershipContract.membershipCard",
					params:function(){
					var time=widget.get("subnav").getValue("time");
					return{
						date:time.start,
						dateEnd:time.end,
						cardBalance:params.pkCardbalance
					};
					},
					model:{
						columns : [{
									key:"cardBalance.membershipContract.membershipCard",
									name:i18ns.get("sale_card_name","会籍卡号"),
									format:function(value,row){
										return value.name;  
				 					},
								},{
									key:"cardBalance.membershipContract.personalCardowners",
									name:"权益人",
									format:function(value,row){
										var name="";
										for(var i=0;i<value.length;i++){
											if(i<value.length-1){
												name+= value[i].personalInfo.name+",";
											}else{
												name+= value[i].personalInfo.name;
											}
										}
										return name;
				 					},	
								},{
									key:"cardBalance.membershipContract.room.number",
									name:"房间"
								},{
									key:"cardBalance.balance",
									name:"余额"
								},{
									key:"date",
									name:"充值日期",
									mode:"Y-m-d H:i",
									format:"date"
								},{
									key:"amounts",
									name:"充值金额"
								},{
									key:"rechargeWay.value",
									name:"充值方式"
								},{
									key:"dataSource.value",
									name:"记录来源"
								},{
									key:"idCardNo",
									name:"会员卡号"
								},{
									key:"description",
									name:"备注"
								},{
									key:"operate",
									name:"操作",
									col:"2",
									format:"button",
									formatparams:[{
										key:"edit",
										icon:"edit",
										handler:function(index,data,rowEle){
											aw.ajax({
												url : "api/cardbalance/query",
												autoRender:false,
												data:{
													fetchProperties : "apps.amounts,totalMoney,balance",
													pkCardbalance:data.cardBalance.pkCardbalance
												},
												dataType:"json",
					        					success:function(data){ 
													widget.get("form").setValue("totalMoney",data[0].totalMoney);
					        					}
											});
											
											
											
											var userSelect=widget.get("form").getData("idCardNo","");
											var flag = false;
											for(var  i =  0 ; i<userSelect.length;i++ ){
												if(userSelect[i].idCardNo == data.idCardNo){
													flag= true;
													break;
												}
											}
											if(flag){
												widget.get("form").setValue("idCardNo",data.idCardNo);
												widget.get("form").setAttribute("idCardNo","readonly","readonly");
											}else{
												var carddata=widget.get("form").getData("idCardNo","");
												carddata.push(data.idCardNo);
												widget.get("form").setData("idCardNo",carddata);
												widget.get("form").setValue("idCardNo",data.idCardNo);
												widget.get("form").setAttribute("idCardNo","readonly","readonly");
											}
				    				     
											
											widget.get("form").setAttribute("creator","readonly","readonly");
											
											widget.get("subnav").hide(["adds","time","return"]);
											widget.show([".J-form"]).hide([".J-grid"]);
											widget.get("form").setData(data);
											widget.get("form").setValue("room",data.cardBalance.membershipContract.room.number);
											widget.get("form").setValue("balance",data.cardBalance.balance);
											widget.get("form").setValue("creator",loginUser.name);
											widget.get("form").setValue("cardBalance",data.cardBalance.pkCardbalance);
											widget.get("form").setValue("memberShipCardNo",data.cardBalance.membershipContract.membershipCard.name);
											widget.get("form").setValue("code",params.people);
//											widget.get("form").setAttribute("disease","readonly","readonly");
											return false;
										}
									},{
										key:"delete",
										icon:"remove",
										handler:function(index,data,rowEle){
											aw.del("api/cardrecharge/" + data.pkCardRecharge + "/delete",function() {
												widget.get("subnav").show(["return","adds","time"]);
												widget.hide(".J-form").show(".J-grid");
												widget.get("grid").refresh();
											});
										}
									}]
								
								}]
					}
				});
				this.set("grid",grid);
				
				var form = new Form({
					parentNode:".J-form",
					//保存按钮
					saveaction : function(){
						var data=$("#cardrechargedetails").serializeArray();
						var minMoney = data[9].value;
						if(minMoney<=0){
							Dialog.alert({
								content:"充值金额必须大于0元！"
							});
						}else{
						aw.saveOrUpdate("api/cardrecharge/save", $("#cardrechargedetails").serialize(),function(data){
							widget.get("subnav").show(["return","adds","time"]);
							widget.hide(".J-form").show(".J-grid");
							widget.get("grid").refresh();
						});
					}
					},
					//取消按钮
					cancelaction : function(){
						if(params&&params.father=="cardbalance"&&params.intetion=="charge"){ 
	  						widget.openView({
								url:"eling/elcms/consume/cardrecharge/cardrecharge",
							});
	  					}else if(params&&params.father=="cardbalance"&&params.intetion=="chargedetail"){
	  						widget.show([".J-grid,.J-adds,.J-time,.J-return"]).hide([".J-form"]);
	  					}
						else{
	  						widget.show([".J-grid,.J-adds,.J-time"]).hide([".J-form,.J-return"]); 
	  					}
						return false;
					},
					model : {
						id:"cardrechargedetails",
						items : [{
								name:"pkCardRecharge",
								type:"hidden"
							},{
								name:"version",
								defaultValue : "0",
								type:"hidden"
							},{
								name : "memberShipCardNo",
								label : i18ns.get("sale_card_name","会籍卡号"),
								type : "text",
//								validate : [ "required" ],
								readonly:true
							},{
								name : "code",
								label : "权益人",
								type : "text",
								readonly:true
							},{
								name : "room",
								label : "房间",
								type : "text",
								readonly:true
							},{
								name:"date",
								label:"充值时间",
								mode:"Y-m-d H:mm:s",
								type:"date",
								defaultValue : moment(),
								validate:["required"]
							},
//							{
//								name:"idCardNo",
//								label:"会员卡号",
//								type:"text",
//								validate:["required"]
//							},
							{
								name:"idCardNo",
								key:"idCardNo",
								value:"idCardNo",
								label:"会员卡号",
								url:"api/cardbalance/querybillingmembershipcard", 
								params:{
									pkCardbalance:params.pkCardbalance,
									fetchProperties:"pkMemberCardBind,idCardNo"
								},
								type:"select",
								validate:["required"]
							},{
								name:"balance",
								label:"余额",
								type:"text",
								readonly:true
							},{
								name:"totalMoney",
								label:"累计充值金额",
								type:"text",
								readonly:true
							},{
								name:"amounts",
								label:"充值金额",
								type:"text",
								validate:["required"]
							},{
								name:"rechargeWay",
								label:"付款方式",
								type:"select",
								url:"api/enum/com.eling.elcms.consume.model.CardRecharge.RechargeWay",
								validate:["required"]
							},{
								name:"dataSource",
								defaultValue : "Manual",
								type:"hidden"
							},{
								name:"creator",
								label:"经手人",
//								type:"select",
//								key:"pkUser",
//								value:"name",
//								url:"api/users?role=4",
//								multi:false,
//								validate:["required"],
							},{
								name : "description",
								label : "备注",
								type : "textarea"
							}
							,{
								name : "cardBalance",
								type : "hidden"
							}
							]
					}
				});
				this.set("form",form);
				if(params && params.father=="cardbalance" && params.intetion=="charge"){
					widget.get("subnav").hide(["adds","time"]).show(["return"]);
					widget.show([".J-form"]).hide([".J-grid"]);	  
					widget.get("form").setValue("memberShipCardNo",params.memberShipCardNo);
					widget.get("form").setValue("code",params.people);
					widget.get("form").setValue("room",params.room);
					widget.get("form").setValue("balance",params.balance);
					widget.get("form").setValue("cardBalance",params.pkCardbalance);
//					widget.get("form").setValue("idCardNo",params.idCardNo==""?"":params.idCardNo);
					widget.get("form").setValue("totalMoney",params.totalMoney);
					widget.get("form").setValue("creator",loginUser.name);
					widget.get("form").setAttribute("creator","readonly","readonly");
	   		    }
				if(params && params.father=="cardbalance" && params.intetion=="chargedetail"){
					widget.get("subnav").show(["adds","time","return"]);
					widget.show([".J-grid"]).hide([".J-form"]);
					widget.get("form").setValue("memberShipCardNo",params.memberShipCardNo);
					widget.get("form").setValue("code",params.people);
					widget.get("form").setValue("room",params.room);
					widget.get("form").setValue("cardBalance",params.pkCardbalance);
//					widget.get("form").setValue("idCardNo",params.idCardNo==""?"":params.idCardNo);
	   		    }
			},
			afterInitComponent:function(params,widget,data){

	    	 }
	});
	module.exports=cardrechargedetails;
});