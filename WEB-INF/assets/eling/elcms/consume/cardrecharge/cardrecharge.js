/**
 * 会员卡充值
 */
define(function(require, exports, module) { 
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>";
	var cardbalance = ELView
			.extend({ 
				events : {
				},
				attrs:{
		        	template:template
		        },
		        initComponent:function(params,widget){
		        	var subnav=new Subnav({
						parentNode:".J-subnav",
						model : {
							title : "会员卡充值",
							search : function(str) {
								var g = widget.get("grid");
								g.loading();
								aw.ajax({
											url : "api/cardbalance/search",
											data:{
												s:str,
												properties:"membershipContract.room.number,membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name" ,
												fetchProperties:"membershipContract.room.number,membershipContract.personalCardowners.personalInfo.name,pkCardbalance,balance,remindBalance,ifExcess,creditLine,creditBalance,description,version,membershipContract.membershipCard.name,membershipContract.membershipCard.cardType.name,status.value,membershipContract.membershipCard.pkMemberShipCard,membershipContract.membershipCard.name" 
											},
											dataType:"json",
											success:function(data){
												g.setData(data);
											}
										});
							},
							buttons:[{
									id:"return",
									text:"返回",
									show:false,
									handler:function(){ 
										widget.get("subnav").show(["search","cardType","status"]);
										widget.hide(".J-form,.J-return").show(".J-grid");
									}
							}],
							buttonGroup : [{
								id:"status",
								items: [{
									key:"Normal",
									value:"正常"
								},{
									key:"Termination",
									value:"已冻结"
								}],	
								handler:function(key,element){
									widget.get("grid").refresh();
								}
							} ,{
								id : "cardType",
								showAll:true,
								showAllFirst:true,
								url : "api/cardtype/query",
								key : "pkMemberShipCardType",
								value : "name",
								items : [],
								lazy:true,
								handler : function(key, element) {
									widget.get("grid").refresh();
								}
							}],
						}
					});
		        	this.set("subnav",subnav);
		        	
		        	var grid=new Grid({
		        		parentNode:".J-grid",
		        		url : "api/cardbalance/query",
						autoRender:false,
						fetchProperties : "apps.amounts,totalMoney,membershipContract.room.number,membershipContract.personalCardowners.personalInfo.name,pkCardbalance,balance,remindBalance,ifExcess,creditLine,creditBalance,description,version,membershipContract.membershipCard.name,membershipContract.membershipCard.cardType.name,status.value,membershipContract.membershipCard.pkMemberShipCard,membershipContract.membershipCard.name",
						params : function() {
							var subnav = widget.get("subnav");
							return {
								"membershipContract.membershipCard.toBeStatus":"Normal",
								"status" : subnav.getValue("status"),
								"membershipContract.membershipCard.cardType": subnav.getValue("cardType")
							};
						},
						model : { 
							columns : [{
										key : "membershipContract.membershipCard",
										name : i18ns.get("sale_card_name","会籍卡号"),
										format:function(value,row){
											return value.name;  
				 						},
									},{
										key : "membershipContract.personalCardowners",
										name : "权益人 ",
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
										key : "membershipContract.room.number",
										name : "房间 "
									},{
										key : "balance",
										name : "余额"
									},{
										key : "remindBalance",
										name : "提醒额度"
									},{
										key : "ifExcess",
										name : "是否授信",
										format : function(value, row) {
											return value ? "是" : "否"
										}
									},{
										key : "creditLine",
										name : "信用额度"
									},{
										key : "creditBalance",
										name : "信用余额"
									},{
										key : "status.value",
										name : "消费状态"
									},{
										key : "description",
										name : "备注"
									},{
										key : "operate",
										name : "操作",
										format : "button",
										formatparams : [{
											key:"recharge",
					        				text:"充值",
											handler : function(index,data, rowEle) {
												
												//权益人
												var personal=data.membershipContract.personalCardowners;
												var name="";
												for(var i=0;i<personal.length;i++){
													if(i<personal.length-1){
														name+= personal[i].personalInfo.name+",";
													}else{
														name+= personal[i].personalInfo.name;
													}
												}
												//会籍卡号
												var memberShipCardNo=data.membershipContract.membershipCard.name;
//												 //会员卡号
//												var memberShipCardNoName=data.membershipContract.membershipCard;
//												var idCardNo="";
//												for(var i=0;i<memberShipCardNoName.length;i++){
//													if(i<memberShipCardNoName.length-1){
//														idCardNo+= memberShipCardNoName[i].name+",";
//													}else{
//														idCardNo+= memberShipCardNoName[i].name;
//													}
//												}
//												//会籍卡绑定会员卡的时候  查出所绑定的会员卡号
//												aw.ajax({
//													url : "api/cardbalance/querybillingmembershipcard",
//													autoRender:false,
//													data:{
//														pkCardbalance:data.pkCardbalance,
//														fetchProperties : "idCardNo"
//													},
//													dataType:"json",
//						        					success:function(data1){
						        						widget.openView({
															url:"eling/elcms/consume/cardrechargedetail/cardrechargedetail",
															params:{
															 	intetion:"charge",
															 	pkCardbalance:data.pkCardbalance, 
																memberShipCardNo:memberShipCardNo, //会籍卡号
																people:name,//权益人
																room:data.membershipContract.room.number, //房间
																balance:data.balance, 				   //余额	
																totalMoney:data.totalMoney,					//总金额
//																idCardNo:data1.length==0?"":data1[0].idCardNo, //会员卡号
																father:"cardbalance"
																}
														});
//						        					}
//												});
												
											
											}
										},{
											key:"rechargedetail",
					        				text:"充值明细",
											handler : function(index,data, rowEle) {
												//权益人
												var personal=data.membershipContract.personalCardowners;
												var name="";
												for(var i=0;i<personal.length;i++){
													if(i<personal.length-1){
														name+= personal[i].personalInfo.name+",";
													}else{
														name+= personal[i].personalInfo.name;
													}
												}
												//会籍卡号
												var memberShipCardNo=data.membershipContract.membershipCard;
												var Cards="";
												for(var i=0;i<memberShipCardNo.length;i++){
													if(i<memberShipCardNo.length-1){
														Cards+= memberShipCardNo[i].name+",";
													}else{
														Cards+= memberShipCardNo[i].name;
													}
												}
//												 //会员卡号
//												var memberShipCardNoName=data.membershipContract.membershipCard;
//												var idCardNo="";
//												for(var i=0;i<memberShipCardNoName.length;i++){
//													if(i<memberShipCardNoName.length-1){
//														idCardNo+= memberShipCardNoName[i].name+",";
//													}else{
//														idCardNo+= memberShipCardNoName[i].name;
//													}
//												}
//												//会籍卡绑定会员卡的时候  查出所绑定的会员卡号
//												aw.ajax({
//													url : "api/cardbalance/querybillingmembershipcard",
//													autoRender:false,
//													data:{
//														pkCardbalance:data.pkCardbalance,
//														fetchProperties : "idCardNo"
//													},
//													dataType:"json",
//						        					success:function(data1){
												
						        						widget.openView({
						        							url:"eling/elcms/consume/cardrechargedetail/cardrechargedetail",
						        							params:{
															 	intetion:"chargedetail",
															 	pkCardbalance:data.pkCardbalance, 
															 	memberShipCardNo:Cards, //会籍卡号
																people:name,//权益人
																room:data.membershipContract.room.number, //房间
																balance:data.balance, 				   //余额	
																totalMoney:data.totalMoney,						//总金额
//																idCardNo:data1.length==0?"":data1[0].idCardNo, //会员卡号
																father:"cardbalance"
																	}
														});
//						        					}
//												});
											}
										},{
													key:"edit",
							        				icon:"edit",
													handler : function(index,data, rowEle) {
														form.setData(data);
														form.setValue("membershipCard",data.membershipContract.membershipCard.name);
														var personal=data.membershipContract.personalCardowners;
														var name="";
														for(var i=0;i<personal.length;i++){
															if(i<personal.length-1){
																name+= personal[i].personalInfo.name+",";
															}else{
																name+= personal[i].personalInfo.name;
															}
														}
														form.setValue("personalCardowners",name);
														widget.hide([".J-grid"]);
														widget.get("subnav").hide(["search","cardType","status"]).show(["return"]);
													}
												}]

									} ]
						}
		        	});
		        	 this.set("grid",grid);
		        	 
		        	 var form=new Form({
		         		parentNode:".J-form",
		         		saveaction : function() {
//							var data = $("#cardrecharge").serializeArray();
//							var maxFees = data[10].value;
//							var minFees = data[11].value;
//							if (maxFees != null && maxFees != ""&& minFees != null && minFees != "") {
//								if (maxFees < minFees) {
//									Dialog.tip({
//										title : "收费上限必须大于或等于收费下限！"
//									});
//									return false;
//								}
//								var price = data[7].value;
//								if (price != null && data[7].value != "") {
//									if (price < minFees || price > maxFees) {
//										Dialog.tip({
//											title : "单价必须在上限和下限的范围内！"
//										});
//										return false;
//									}
//								}
//							}
							aw.saveOrUpdate("api/cardbalance/save", $("#cardbalance").serialize(),function(data){
								widget.get("subnav").show(["search","cardType","status"]);
								widget.show([".J-grid"]).hide([".J-form"]);
								widget.get("grid").refresh();
							});
//							widget.get("subnav").show(["search","waresClass","adds"]);
						},
						//取消按钮
		  				cancelaction:function(){
		  					widget.get("subnav").show(["search","cardType","status"]);
							widget.hide(".J-form,.J-return").show(".J-grid");
							return false;
		  				},
						model : {
							id : "cardbalance",
							items : [ {
								name : "pkCardbalance",
								type : "hidden"
							}, {
								name : "version",
								type : "hidden"
							}, {
								name : "membershipCard",
								label : i18ns.get("sale_card_name","会籍卡号"),
								type : "text",
								validate : [ "required" ],
								readonly:true
							}, {
								name : "personalCardowners",
								label : "权益人",
								type : "text",
								readonly:true
							}, {
								name : "membershipContract.room.number",
								label : "房间",
								type : "text",
								readonly:true
							}, {
								name : "ifExcess",
								label : "是否授信",
								type : "radiolist",
								list : [ {
									key : true,
									value : "是"
								}, {
									key : false,
									value : "否"
								}  ],
							}, {
								name : "status",
								label : "消费状态",
								type : "select",
								options:[{
    								key:"Normal",
    								value:"正常"
    							},{
    								key:"Termination",
    								value:"已冻结"
    							}]
							},  {
								name : "balance",
								label : "余额",
								type : "text",
								readonly:true
							}, {
								name : "totalMoney",
								label : "累计充值金额",
								type : "text",
								readonly:true
							}, {
								name : "remindBalance",
								label : "提醒额度",
								type : "text"
							}, {
								name : "creditLine",
								label : "信用额度",
								type : "text"
							}, {
								name : "creditBalance",
								label : "信用余额",
								type : "text"
							},{
								name : "description",
								label : "备注",
								type : "textarea"
							} ]
						}
		        	 });
		        	 this.set("form",form);
				},
				afterInitComponent:function(params,widget){
					var subnav=widget.get("subnav");
		        	subnav.load({
						id:"cardType",
						callback:function(data){
							widget.get("grid").refresh();
						}
					});
				}
			});
	module.exports = cardbalance;
});