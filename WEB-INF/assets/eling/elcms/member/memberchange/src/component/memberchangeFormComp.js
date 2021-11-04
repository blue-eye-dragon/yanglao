
define(function(require, exports, module) {
	var Form = require("form");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var memberchange_form = {
			init:function(params,widget){
					var form=new Form({
						parentNode:".J-form",
						model:{
							layout: "2_1",
							defaultButton:false,
							id:"memberchange_form",
							items:[{
								name:"pkChangeMember",
								type:"hidden",
							},{
								name:"version",
								type:"hidden",
							},{
								name:"memberSigning",
								label:"房间",
			    				type:"select",
			    				keyField:"pkMemberSigning",
			    				valueField:"room.number",
			    				url : "api/membersign/queryroom",
								params : function(){
									return {
										status:"Normal",
										houseingNotIn:false,
										fetchProperties:
											"pkMemberSigning," +
											"signDate," +
											"room.number," +
											"membershipContract.membershipCard.name," +
											"membershipContract.personalCardowners.personalInfo.name," +
											"members.pkMember,members.personalInfo.name,members.status," +
											"checkInDate"
									}
								},
								validate:["required"]
							},{
								id:"memberSigning",
								name:"memberSigning.membershipContract.membershipCard.name",
								label:"会籍卡",
								type:"text",
								readonly:true
							},{
								id:"memberSigning",
								name:"memberSigning.signDate",
								label:"签约日期",
								type:"date",
								readonly:true
							},{
								name:"personalCardowners",
								label:"权益人",
								type:"text",
								readonly:true
							},{
								id:"memberSigning",
								name:"memberSigning.checkInDate",
								label:"入住时间",
								type:"date",
								readonly:true
							},{
								name:"hisAnnualFees",
								label:"已缴服务费",
								readonly:true
							},{
								name:"carryOver",
								label:"是否结转",
								type:"radio",
								list:[{
									key:true,
									value:"是",
									isDefault: true
								},{
									key:false,
									value:"否",
									
								}],
								validate:["required"]
							},{
								name:"carOverFees",
								label:"结转金额",
								defaultValue:0,
								validate:["money"]
							},{
								name:"changeDate",
								label:"变更日期",
								type:"date",
								defaultValue:moment().valueOf(),
								validate:["required"]
							},{
								name:"newCheckInDate",
								label:"新入住日期",
								type:"date",
								validate:["required"]
							},{
								name:"operator",
								label:"经手人",
								type:"select",
								keyField:"pkUser",
								valueField:"name",
								url:"api/users/nofreeze",//TODO 用户角色：wulina
								defaultValue:activeUser,
								validate:["required"]
								
							},{
								name:"content",
								label:"备注",
								type:"textarea",
								"break":true
							}]
						}
					});
					return form;
			 }
	}
	module.exports = memberchange_form;
});