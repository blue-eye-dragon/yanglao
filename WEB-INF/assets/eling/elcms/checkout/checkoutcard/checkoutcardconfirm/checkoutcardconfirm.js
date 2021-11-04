/**
 * 退卡确认
 */
define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0"); 
    var aw = require("ajaxwrapper");
  //多语
    var i18ns = require("i18n");
	var CheckOutCardConfirm = BaseView.extend({
		initSubnav:function(widget){
			var buttonGroup=[{
				id:"flowStatusIn",
				items:[{
					key:"Approval",
					value:"准备中"
				},{
					key:"Confirmed",
					value:"已确认"
				},{
					key:"",
					value:"全部"
				}],
				handler:function(key,element){
					widget.get("list").refresh();
				}
			}];
			return { 
				model:{
					title:"退卡确认",
					buttonGroup:buttonGroup,
					buttons:[],
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
 						name:"状态"
 					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"确认",
							show:function(data,row){
								if(row.flowStatus.key=="Approval"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEL){
								aw.ajax({
	                                url : "api/checkoutcardapply/confirm",
	                                type : "POST",
	                                data : {
	                               	 	pk:data.pkCIImplement,
	                                },
	                                success : function(result){
	                            	    widget.get("list").refresh({
	                            	    	pkCIImplement:data.pkCIImplement,
	                            	    	fetchProperties:"*,memberSigning.members.personalInfo.name,memberSigning.checkInDate,memberSigning.room.number,memberSigning.members.pkMember,"+
	                						"checkInFurinshing.status,checkInMembershipCard.status,checkInNaturalGas.status,checkInRoomConfing.status," +
	                						"checkInTelecom.status,checkInMoveHouse.status"
	                            	    });
	                                }
	                            });
							}
						}]
					
 					}]
				}
			};
		}
	});
	module.exports = CheckOutCardConfirm;
});