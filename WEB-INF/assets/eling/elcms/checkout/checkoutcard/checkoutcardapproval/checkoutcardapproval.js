/**
 * 退卡审批
 */
define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0"); 
    var aw = require("ajaxwrapper");
  //多语
    var i18ns = require("i18n");
	var CheckOutCardApproval = BaseView.extend({
		initSubnav:function(widget){
			var buttonGroup=[{
				id:"flowStatusIn",
				items:[{
					key:"Submit",
					value:"未审批"
				},{
					key:"Approval,Reject",
					value:"已审批"
				},{
					key:"Submit,Approval,Reject",
					value:"全部"
				}],
				handler:function(key,element){
					widget.get("list").refresh();
				}
			}];
			return { 
				model:{
					title:"退卡审批",
					buttonGroup:buttonGroup,
					buttons:[{
						id:"rebut",
						text:"驳回",
						handler:function(){
							var approveStatus=widget.get("subnav").getValue("flowStatusIn");
							if(approveStatus=="Approval,Reject"){
								Dialog.alert({
									content:"已审批的申请不能修改！"
								});
								widget.get("list").refresh();
							}else{
								var old=widget.get("list").getSelectedData();
								var pkCheckOutCardApply="";
	                         	for(var i=0; i<old.length;i++){
	                         		pkCheckOutCardApply+="pkCheckOutCardApply="+old[i].pkCheckOutCardApply+"&";
	                         	}
	                         	if(pkCheckOutCardApply == ""){
	                         		Dialog.tip({
										title:"请选择一条申请单进行驳回!"
									});
	                         	}else{
	                         		aw.ajax({
		                                url : "api/checkoutcardapply/rebut",
		                                type : "POST",
		                                data : {
		                               	 	pk:pkCheckOutCardApply
		                                },
		                               success : function(data){
		                            	   if(data.msg){
		                            		   Dialog.tip({
		                            			   title:data.msg
		                            		   });
		                            	   }
		                            	   widget.get("list").refresh();
		                                }
		                            });
	                         	}
	                            
							}
						}
					},{
						id:"approval",
						text:"审批",
						handler:function(){
							var approveStatus=widget.get("subnav").getValue("flowStatusIn");
							if(approveStatus=="Approval,Reject"){
								Dialog.alert({
									content:"已审批的申请不能修改！"
								});
								 widget.get("list").refresh();
							}else{
								var old=widget.get("list").getSelectedData();
								var pks="";
	                         	for(var i=0; i<old.length;i++){
	                         		pks+=old[i].pkCheckOutCardApply+",";
	                         	}
	                            aw.ajax({
	                                url : "api/checkoutcardapply/approval",
	                                type : "POST",
	                                data : {
	                               	 	pk:pks,
	                                },
	                               success : function(data){
	                            	   if(data.msg){
	                            		   Dialog.tip({
	                            			   title:data.msg
											});
	                            	   }
	                            	   widget.get("list").refresh();
	                                }
	                            });
							}
						}
					}],
					 time:{
						 	ranges:{
						 		"本月": [moment().startOf("month"), moment().endOf("month")],
						 		"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
								"半年内": [moment().subtract("month", 6).startOf("days"),moment().endOf("days")],
								},
							defaultTime:"本月",
	        				click:function(time){
	        					widget.get("list").refresh();
							}
						}
				}
			};
		},
				
		initList:function(widget){
			return{
				url : "api/checkoutcardapply/query",
				fetchProperties:"*,membershipContract.membershipCard.name," +
				"membershipContract.membershipCard.cardType.name," +
				"membershipContract.memberShipFees," +
				"proposer.name," +
				"operator.name",
				params:function(){
					return {
						"createDate":widget.get("subnav").getValue("time").start,
						"createDateEnd":widget.get("subnav").getValue("time").end,
						"flowStatusIn":widget.get("subnav").getValue("flowStatusIn"),
					};
				},
				model:{
					isCheckbox:true,
					columns:[{
						key:"membershipContract.membershipCard.name",
						name:i18ns.get("sale_card_name","会籍卡号"),
					},{
						key:"membershipContract.membershipCard.cardType.name",
						name:"卡号类型"
					},{
						key:"proposer.name",
						name:"申请人"
					},{
						key:"membershipContract.memberShipFees",
						name:"会籍卡费"
					},{
						key:"refunded",
						name:"是否退费",
						format:function(row,value){
							if(row){
								return "是";
							}else{
								return "否";
							}
						}
					},{
						key:"createDate",
						name:"申请日期",
						format:"date"
					},{
						key:"checkOutCardDate",
						name:"退卡日期",
						format:"date"
					},{
						key:"operator.name",
						name:"经手人"
					},{
 						key:"flowStatus.value",
 						name:"审批状态"
 					}]
				}
			};
		}
	});
	module.exports = CheckOutCardApproval;
});
