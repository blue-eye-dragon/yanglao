define(function(require, exports, module) {
    var Dialog=require("dialog-1.0.0");
    var aw = require("ajaxwrapper");
    var Form =require("form-2.0.0")
    var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var store = require("store");
	var ApprovalUI = require("approvalUI");
	var activeUser = store.get("user");
	var Properties=require("./properties");
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"+
	 "<div class='J-approvalUI hidden'></div>";
	var depositrefundapproval = ELView.extend({
		attrs:{
        	template:template
        },
		 initComponent:function(params,widget){
	        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title : Properties.customize_title(widget),
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/deposit/searchrefund",
							data : {
								s : str,
								properties : "name,mobilePhone,phoneNumber,room.number",
								fetchProperties : "*,confirmTime,confirm.name,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser," +
										"operator.name,version,room.number,room.pkRoom,type.name,type.pkRoomType,depositRefundApply.pkDepositRefundApply," +
										"depositRefundApply.version,depositRefundApply.refundTime,depositRefundApply.refund.*,depositRefundApply.flowStatus.*," +
										"depositRefundApply.refundAmount,customer.mobilePhone,mobilePhone,customer.name,customer.pkCustomer,customer.phoneNumber," +
										"name,phoneNumber",
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
							$(".J-test").addClass("hidden");
							widget.show([".J-grid"]).hide([".J-form",".J-approvalUI"]);
							widget.get("subnav").hide(["return"]).show(["search","flowStatus","time"]);
							return false;
						}
					}],
					buttonGroup : [{
     				   id:"flowStatus",
     				   tip:"退款状态",
     				   items:[{
     					   key:"Approvaling",
     					   value:"审批中"
     				   },{
     					   key:"Approved",
     					   value:"审批通过"
     				   },{
     					   key:"NotApproved",
     					   value:"审批不通过"
     				   },{
     					   key:"Approvaling,Approved,NotApproved",
     					   value:"全部"
     				   }],
     				   handler:function(key,element){
							   widget.get("grid").refresh();
     				   }
     			   }],
					time:{
						tip:"申请时间",
					 	ranges:{
					 		"本月": [moment().startOf("month"), moment().endOf("month")],
					 		"三个月": [moment().subtract(3,"month").startOf("days"),moment().endOf("days")],
							"六个月": [moment().subtract(6,"month").startOf("days"),moment().endOf("days")],
							},
						defaultTime:"本月",
        				click:function(time){
        					widget.get("grid").refresh();
						}
					}
				}
			});
	        this.set("subnav",subnav);
	        
			var grid=new Grid({
    			parentNode:".J-grid",
				url : "api/deposit/query",
				autoRender:false,
				fetchProperties : "*,confirmTime,confirm.name,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser,operator.name,version," +
						"room.number,room.pkRoom,type.name,type.pkRoomType,depositRefundApply.flowStatus,depositRefundApply.version,depositRefundApply.refundTime," +
						"depositRefundApply.refund.*,depositRefundApply.flowStatus,depositRefundApply.refundAmount,customer.mobilePhone,mobilePhone,customer.name," +
						"customer.pkCustomer,customer.phoneNumber,name,phoneNumber",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"depositRefundApply.pkDepositRefundApply":params?params.modelId:"",
						"depositRefundApply.refundTime":widget.get("subnav").getValue("time").start,
						"depositRefundApply.refundTimeEnd":widget.get("subnav").getValue("time").end,
						"depositRefundApply.flowStatusIn" : widget.get("subnav").getValue("flowStatus")
					};
				},
				model:{
					columns:[{
						key : "name",
						name : "交款人"
					},{
						key : "room.number",
						name : "房间号"
					},{
						key : "phoneNumber",
						name : "联系电话"
					},{
						key:"realDeposit",
						name:i18ns.get("charge_deposit_depmoney","预约")+"金额",
						className: "text-right",
						format:"thousands"
					},{
						key:"chargeTime",
						name:"收款时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						key:"operator.name",
						name:"经手人"
					},{
						key:"depositRefundApply.refundTime",
						name:"退款申请时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						key : "depositRefundApply.refund.name",
						name : "退款申请人 "
					},{
						key:"depositRefundApply.flowStatus.value",
						name:"退款状态"
					},{
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(value.depositRefundApply==null){
								ret1 = "<div>"+"<a style='margin-left:5px;color:white;background:#f34541' class='J-detail btn btn-xs ' href='javascript:void(0);''>明细</a>"+
								"</div>";
								return ret1;
							}
							else if(value.depositRefundApply.flowStatus.key=="Approvaling" ){
								return "button";
							}else{
								ret1 = "<div>"+"<a style='margin-left:5px;color:white;background:#f34541' class='J-detail btn btn-xs ' href='javascript:void(0);''>明细</a>"+
								"</div>";
								return ret1;
							}   
 						},
						formatparams:[
						{
							key:"approval", 
							text:"审核",
							handler:function(index,data,rowEle){
								var approvalUI  = widget.get("approvalUI");
								approvalUI.set("param",{
									modelId:data.depositRefundApply.pkDepositRefundApply,
									serviceType:"DepositRefund",
									hideButton:false,
									callBack:function(data){
										if(data){
											aw.ajax({
												url:"api/depositrefundapply/query",
												data:{
													pkDepositRefundApply:data.pkDepositRefundApply,
													fetchProperties:"flowStatus"
												},
												dataType:"json",
												success:function(data){
													if(data[0]){
														if(data[0].flowStatus.key=="Approved" ){
															widget.get("form").setValue("depositRefundApply.flowStatus.value","已通过");
														}else if(data[0].flowStatus.key=="NotApproved"){
															widget.get("form").setValue("depositRefundApply.flowStatus.value","未通过");
														}
													}
													widget.get("grid").refresh()
												}
											});
										}
									}
								});
								approvalUI.get("appgrid").refresh();
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.hide([".J-grid"]).show([".J-form",".J-approvalUI"]);
								widget.get("subnav").show(["return"]).hide(["search","flowStatus","time"]);
							}
						},{
							key:"detail",
							text:"明细",
							handler:function(index,data,rowEle){
								approvalUI.set("param",{
									modelId:data.depositRefundApply.pkDepositRefundApply,
									serviceType:"DepositRefund",
									hideButton:true
								});
								approvalUI.get("appgrid").refresh();
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
								widget.get("subnav").hide(["search","flowStatus","time"]).show(["return"]);
							}
						}]
 					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
         		parentNode:".J-form",
         		model:{
         			id:"depositrefunddetail",
         			items:[{
         				name:"pkDeposit",
         				type:"hidden"
         			},{
         				name : "version",
						defaultValue : "0",
						type : "hidden"
         			},{
         				name:"name",
         				label:"交款人",
         				type:"text",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
						name:"chargeTime",
						label:"收款时间",
						type:"date",
						mode:"Y-m-d",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
         				name:"phoneNumber",
         				label:"联系电话",
         				type:"text",
     					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"depositRefundApply.refund.name",
         				label:"退款申请人",
         				type:"text",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"depositRefundApply.refundAmount",
         				label:"退款金额",
         				type:"text",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"realDeposit",
         				label: i18ns.get("charge_deposit_depmoney","预约")+"金额(元)",
         				type:"text",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"depositRefundApply.refundTime",
         				label:"退款申请时间",
         				type:"date",
         				mode:"Y-m-d",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"operator.name",
						label:"经手人",
						type:"text",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"depositRefundApply.flowStatus.value",
         				label:"退款状态",
         				type:"text",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			}]
         		}
			});
			this.set("form",form);
			var  approvalUI = new ApprovalUI({
				parentNode : ".J-approvalUI",
			});
			approvalUI.render();
			this.set("approvalUI",approvalUI);
			
		},
		approval : function(params,widget){
			 widget.get("grid").refresh();
		},
		afterInitComponent:function(params,widget) {
			widget.get("grid").refresh();
		}
	});
	module.exports = depositrefundapproval;
});
