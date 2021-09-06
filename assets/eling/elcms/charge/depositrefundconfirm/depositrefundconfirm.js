define(function(require, exports, module) {
    var Dialog=require("dialog-1.0.0"); 
    var aw = require("ajaxwrapper");
    var Form =require("form-2.0.0")
    var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var ApprovalUI = require("approvalUI");
	var Grid = require("grid-1.0.0");
	var Properties=require("./properties");
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"+
	 "<div class='J-approvalUI hidden'></div>";;
	var depositrefundconfrim = ELView.extend({
		events : {
			"click .J-detail":function(e){
				var widget=this;
				var grid = this.get("grid");
				var index = grid.getIndex(e.target);
				var data = grid.getSelectedData(index);
				var approvalUI  = this.get("approvalUI");
				approvalUI.set("param",{
					modelId:data.depositRefundApply.pkDepositRefundApply,
					serviceType:"DepositRefund",
					hideButton:true
				});
				approvalUI.get("appgrid").refresh();
				widget.get("form").setData(data);
				widget.get("form").setDisabled(true);
				widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
				widget.get("subnav").hide(["search","time"]).show(["return"]);
			},
		},
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
							url : "api/deposit/searchapproved",
							data : {
								s : str,
								properties : "name,mobilePhone,phoneNumber,room.number",
								fetchProperties : "*,confirmTime,confirm.name,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser," +
										"operator.name,version,room.number,room.pkRoom,type.name,type.pkRoomType,depositRefundApply.pkDepositRefundApply," +
										"depositRefundApply.version,depositRefundApply.refundTime,depositRefundApply.refund.*,depositRefundApply.refunedConfirm," +
										"depositRefundApply.flowStatus.*,depositRefundApply.refundAmount,customer.mobilePhone,mobilePhone,customer.name," +
										"customer.pkCustomer,customer.phoneNumber,name,phoneNumber",
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
							widget.show([".J-grid"]).hide([".J-form",".J-approvalUI"]);
							widget.get("subnav").hide(["return"]).show(["search","time"]);
							return false;
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
				fetchProperties : "*,confirmTime,confirm.name,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser,operator.name,version," +
						"room.number,room.pkRoom,type.name,type.pkRoomType,depositRefundApply.pkDepositRefundApply,depositRefundApply.version," +
						"depositRefundApply.refundTime,depositRefundApply.refund.*,depositRefundApply.refunedConfirm,depositRefundApply.flowStatus.*," +
						"depositRefundApply.refundAmount,customer.mobilePhone,mobilePhone,customer.name,customer.pkCustomer,customer.phoneNumber,name,phoneNumber",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"depositRefundApply.refundTime":widget.get("subnav").getValue("time").start,
						"depositRefundApply.refundTimeEnd":widget.get("subnav").getValue("time").end,
						"depositRefundApply.flowStatus" : "Approved"
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
						name: i18ns.get("charge_deposit_depmoney","预约")+"金额",
						className: "text-right",
						format:"thousands",
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
							else if(value.depositRefundApply.flowStatus.key=="Approved" && (value.depositRefundApply.refunedConfirm == 0||value.depositRefundApply.refunedConfirm ==null)){
								return "button";
							}else{
								ret1 = "<div>"+"<a style='margin-left:5px;color:white;background:#f34541' class='J-detail btn btn-xs ' href='javascript:void(0);''>明细</a>"+
								"</div>";
								return ret1;
							}   
 						},
						formatparams:[
						{
							key:"edit",
							text:"确认",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否确认退款",
									confirm:function(){
										aw.ajax({
											type : "POST",
											url:"api/depositrefundapply/confirm",
											data:{
												pkDepositRefundApply:data.depositRefundApply.pkDepositRefundApply
											},
											dataType:"json",
											success:function(data){
												widget.get("grid").refresh();
											}
										});
									}
								});
							}
						},{
							key:"detail",
							text:"明细",
							handler:function(index,data,rowEle){
								var approvalUI  = widget.get("approvalUI");
								approvalUI.set("param",{
									modelId:data.depositRefundApply.pkDepositRefundApply,
									serviceType:"DepositRefund",
									hideButton:true
								});
								approvalUI.get("appgrid").refresh();
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
								widget.get("subnav").hide(["search","time"]).show(["return"]);
							}
						}]
					
 					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
				show:false,
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
         				label:i18ns.get("charge_deposit_depmoney","预约")+"金额(元)",
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
         				label:"流程状态",
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
	});
	module.exports = depositrefundconfrim;
});
