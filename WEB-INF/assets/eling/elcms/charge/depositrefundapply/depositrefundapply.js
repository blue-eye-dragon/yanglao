define(function(require, exports, module) {
    var Dialog=require("dialog-1.0.0");
    var aw = require("ajaxwrapper"); 
    var Form =require("form-2.0.0")
    var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Properties=require("./properties");
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>";
	var depositrefundapply = ELView.extend({
		events : {
			"click .J-submit":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				
				Dialog.confirm({
					setStyle:function(){},
					content:"确认提交？",
					confirm:function(){
						Dialog.alert({
							title:"提示",
							showBtn:false,
							content:"正在处理，请稍后……"
						});
						aw.ajax({
							url:"api/depositrefundapply/submit",
							data:{
								pkDepositRefundApply:data.depositRefundApply.pkDepositRefundApply,
								flowStatus:"Approvaling",
								version:data.depositRefundApply.version
							},
							dataType:"json",
							success:function(data){
								Dialog.close();
								grid.refresh();
							},
			                error: function (data){
			                	Dialog.close();
		                    }
						});
						return "NotClosed";
					}
				});
			}
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
						var g = widget.get("grid");
						aw.ajax({
							url:"api/deposit/search",
							data:{
								s : str,
								properties : "room.number,name,mobilePhone,phoneNumber",
								fetchProperties : "*,confirmTime,confirm.name,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser," +
										"operator.name,version,room.number,room.pkRoom,type.name,type.pkRoomType,depositRefundApply.version," +
										"depositRefundApply.refundTime,depositRefundApply.refund.*,depositRefundApply.flowStatus.*,customer.mobilePhone," +
										"mobilePhone,customer.name,customer.pkCustomer,customer.phoneNumber,name,phoneNumber",
							},
							dataType : "json",
							success : function(data) {
								g.setData(data);
							}
						});
					},
					buttonGroup : [{
	     				   id:"flowStatus",
	     				   tip:"退款状态",
	     				   showAll:true,
	     				   showAllFirst:true,
	     				   items:[{
	     					  key:"Initial",
	     					  value:"初始"
	     				   },{
	     					   key:"Approvaling",
	     					   value:"审评中"
	     				   },{
	     					   key:"Approved",
	     					   value:"审批通过"
	     				   },{
	     					   key:"NotApproved",
	     					   value:"审批不通过"
	     				   },{
	     					   key:"check",
	    					   value:"未申请"
	     				   }],
	     				   handler:function(key,element){
								   widget.get("grid").refresh();
	     				   }
	     			   }],
					buttons:[],
					time:{
						tip:"收款时间",
						ranges:{
							"今年": [moment().startOf("year"), moment().endOf("year")] ,
							"去年":[moment().subtract(1,"year").startOf("year"), moment().subtract(1,"year").endOf("year")],
						},
						defaultTime:"今年",
        				click:function(time){
        					widget.get("grid").refresh();
						}
					}
				}
			});
	        this.set("subnav",subnav);
	        
			var grid=new Grid({
    			parentNode:".J-grid",
				url : "api/deposit/queryapporva",
				fetchProperties : "*,confirmTime,confirm.name,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser," +
						"operator.name,version,room.number,room.pkRoom,type.name,type.pkRoomType,depositRefundApply.version," +
						"depositRefundApply.refundTime,depositRefundApply.refund.*,depositRefundApply.flowStatus.*,customer.mobilePhone," +
						"mobilePhone,customer.name,customer.pkCustomer,customer.phoneNumber,name,phoneNumber",
				params:function(){
					var subnav=widget.get("subnav");
					if(widget.get("subnav").getValue("flowStatus")=="check"){
						return {
							chargeTime:widget.get("subnav").getValue("time").start,
							chargeTimeEnd:widget.get("subnav").getValue("time").end,
							chargeStatus:"Receiving",
							check : true
						};
					}else{
						return {
							chargeTime:widget.get("subnav").getValue("time").start,
							chargeTimeEnd:widget.get("subnav").getValue("time").end,
							chargeStatus:"Receiving",
							check:false,
							"depositRefundApply.flowStatus" : widget.get("subnav").getValue("flowStatus")
						};
					}
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
						format:function(value,row){
							if(row.chargeStatus.key=="Receiving"&&row.depositRefundApply==null){//退款按钮
								return "button";
							}else if(row.depositRefundApply&&row.depositRefundApply.flowStatus&&row.depositRefundApply.flowStatus.key=="Initial"){//提交按钮
								return "<pre><a style='margin-left:5px;color:white;background:#f34541' class='J-submit btn btn-xs ' href='javascript:void(0);''>提交</a></pre>";
							}else{
								return "";
							}
							
 						}, 
						formatparams:[{
							key:"refund",
							text:"退款",
							handler : function(index,data, rowEle) {
									Dialog.showComponent({
										title:"请输入退款金额",
										setStyle:function(){},
//										content:"确认退款？",
										confirm:function(){
											var realDeposit=data.realDeposit;
											var refundAmount1=$("#refundMoney .J-form-refundMoney-text-refundMoney").val();
											if(isNaN(refundAmount1)){
						         				Dialog.alert({
					       							content : "请输入有效的金钱!"
					       						 });
						         				return "NotClosed";
						         			}
											if(refundAmount1==""){
					       		    			 Dialog.alert({
					       							content : "请输入退款金额 !"
					       						 });
					   		    			 	 return "NotClosed";
					   		    			 }
											if(refundAmount1>realDeposit){
					       		    			 Dialog.alert({
					       							content : "退款金额不能大于定金 !"
					       						 });
					   		    			 	 return "NotClosed";
					   		    			 }
											if(refundAmount1<0){
					       		    			 Dialog.alert({
					       							content : "退款金额不能小于零 !"
					       						 });
					   		    			 	 return "NotClosed";
					   		    			 }
											aw.ajax({
												url:"api/depositrefundapply/refund",
												data:{
													pkDeposit:data.pkDeposit,
													refundAmount:$("#refundMoney .J-form-refundMoney-text-refundMoney").val(),
													},
												dataType:"json",
												success:function(data){
													widget.get("grid").refresh();
												}
											});
										}
									},new Form({
										model:{
											id:"refundMoney",
											items:[{
												name:"refundMoney",
												label:"金额",
												type:"text",
												defaultValue:data.realDeposit
											}],
											defaultButton:false
										}
									}));
								
							}
						},{

							key:"detail",
							text:"明细",
							handler:function(index,data,rowEle){
								widget.openView({
									url:"eling/elcms/charge/depositcollectiondetails/depositcollectiondetails",
									params:{
											data:data,
											father:"depositrefundapply"
											},isAllowBack:true
									});
							}
						}]
					
 					}]
				}
			});
			this.set("grid",grid);
		},
	});
	module.exports = depositrefundapply;
});
