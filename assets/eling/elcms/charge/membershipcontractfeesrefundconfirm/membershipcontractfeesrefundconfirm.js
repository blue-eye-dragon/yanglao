/**
 * 卡费退款
 * ELVIEW
 * subnav 
 * grid 
 * form
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	//多语
	var i18ns = require("i18n");
	var template="<div class='el-membershipcontractfeesrefundconfirm'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"</div>";
	var membershipcontractfeesrefundconfirm = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"卡费退款",
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/membershipcontractfees/search",
							data:{
								s:str,
								properties:"memberShipContract.membershipCard.name"+
					                       "memberShipContract.room.number"+
					                       "memberShipContract.personalCardowners"+
						                   "personalCardowner.personalInfo.name"+
					                       "personalCardowner.personalInfo.phone"+
					                       "realFees"+
					                       "invoiceTime"+
					                       "invoiceAmount"+
					                       "invoice.name"+
					                       "refund.name"+
					                       "refundConfirm.name"+
					                       "refundConfirmTime",
								fetchProperties:"*," +
								"personalCardowner.pkPersonalCardowners," +
								"personalCardowner.personalInfo.name," +
								"personalCardowner.personalInfo.phone," +
								"deposit.pkDeposit," +
								"deposit.realDeposit," +
								"deposit.customer.name," +
								"memberShipContract.pkMemberShipContract," +
								"memberShipContract.personalCardowners.personalInfo.name," +
								"memberShipContract.membershipCard.name," +
								"memberShipContract.memberShipFees," +
								"memberShipContract.room.number," +
								"operator.pkUser," +
								"operator.name," +
								"confirm.pkUser," +
								"confirm.name,"+
								"invoice.pkUser,"+
								"invoice.name," +
								"refund.pkUser," +
								"refund.name," +
								"refundConfirm.pkUser," +
								"refundConfirm.name"
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
							widget.show(".J-Grid").hide(".J-Form");
							widget.get("subnav").hide(["return","confirm"]).show(["search","chargeStatus"]);
							return false;
						}
        			},{
        				id:"confirm",
        				text:"确认",
						show:false,
						handler:function(){
							Dialog.confirm({
								title:"提示",
								content:"是否确认？",
								confirm:function(){
									aw.ajax({
										url:"api/membershipcontractfees/save",
										data:{
											pkMembershipContractFees:widget.get("form").getValue("pkMembershipContractFees"),
											refundConfirm:activeUser.pkUser,
											chargeStatus:"RefundReceiving",
											refundConfirmTime:moment().valueOf(),
											version:widget.get("form").getValue("version")
											},
										dataType:"json",
										success:function(data){
											widget.show(".J-Grid").hide(".J-Form");
											widget.get("subnav").hide(["return","confirm"]).show(["search","chargeStatus"]);
											widget.get("grid").refresh({
												pkMembershipContractFees:data.pkMembershipContractFees,
											});
											
										}
									});
									
								}
							});
						}
        			}],
        			
        			buttonGroup:[{
        				   id:"chargeStatus",
        				   items:[{
        					   key:"Refund",
        					   value:"已退款"
        				   },{
        					   key:"RefundReceiving",
        					   value:"退款已到账"  
        				   }],
        				   handler:function(key,element){
   							   widget.get("grid").refresh();
        				   }
        			   }]
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
				url:"api/membershipcontractfees/query",
				fetchProperties:"*," +
				"personalCardowner.pkPersonalCardowners," +
				"personalCardowner.personalInfo.name," +
				"personalCardowner.personalInfo.phone," +
				"deposit.pkDeposit," +
				"deposit.realDeposit," +
				"deposit.customer.name," +
				"memberShipContract.pkMemberShipContract," +
				"memberShipContract.personalCardowners.personalInfo.name," +
				"memberShipContract.membershipCard.name," +
				"memberShipContract.memberShipFees," +
				"memberShipContract.room.number," +
				"operator.pkUser," +
				"operator.name," +
				"confirm.pkUser," +
				"confirm.name,"+
				"invoice.pkUser,"+
				"invoice.name," +
				"refund.pkUser," +
				"refund.name," +
				"refundConfirm.pkUser," +
				"refundConfirm.name",
				params:function(){
					return {
					"chargeStatus":widget.get("subnav").getValue("chargeStatus"),
					"invoiceStatus":"Invoiced"
					};
				},
				model:{
					columns:[{
						key:"memberShipContract.membershipCard.name",
						name:i18ns.get("sale_card_name","会籍卡号"),
					},{
						key:"memberShipContract.room.number",
						name:"房间号"
					},{
						key:"memberShipContract.personalCardowners",
						name:"权益人",
						format:function(row,value){
							var name= "";
							if(row.length>0){
								for(var i =0 ;i<value.length;i++){
									if(i<value.length-1){
										name+= value[i].personalInfo.name+"、";
									}else{
										name+= value[i].personalInfo.name;
									}
								}
							}else{
								name="无";
							}
							return name;
						}
					},{
						key:"personalCardowner.personalInfo.name",
						name:"付款权益人"
					},{
						key:"personalCardowner.personalInfo.phone",
						name:"付款权益人电话"
					},{
						key:"realFees",
						name:"实收会籍费"
					},{
						key:"invoiceTime",
						name:"开票时间",
						format:"date"
					},{
						key:"invoiceAmount",
						name:"开票金额",
					},{
						key:"invoice.name",
						name:"开票人",
					},{
						key:"refund.name",
						name:"退款经手人",
					},{
						key:"refundConfirm.name",
						name:"退款到账确认人"
					},{
						key:"refundConfirmTime",
						name:"退款到账确认时间",
						format:"date"
					},{
						key:"operate",
						name : "操作",
						format:function(row,value){
							if(value.chargeStatus.key=="RefundReceiving"){
								return "退款已到账";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"detail",
							text:"明细",
							handler:function(index,data,rowEle){
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.show(".J-Form").hide(".J-Grid");
								widget.get("subnav").hide(["search","chargeStatus"]).show(["return","confirm"]);
							}
						},{
							key:"edit",
							text:"确认",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否确认？",
									confirm:function(){
										aw.ajax({
											url:"api/membershipcontractfees/save",
											data:{
												pkMembershipContractFees:data.pkMembershipContractFees,
												refundConfirm:activeUser.pkUser,
												refundConfirmTime:moment().valueOf(),
												chargeStatus:"RefundReceiving",
												version:data.version
												},
											dataType:"json",
											success:function(data){
												widget.get("grid").refresh({
													pkMembershipContractFees:data.pkMembershipContractFees,
												});
												
											}
										});
										
									}
								});
							}
						}
						]
					}]
				}
            });
            this.set("grid",grid);
            
        	var form=new Form({
        		parentNode:".J-Form",
        		model:{
        			id:"annualfeepaymentdetailsForm",
        			items:[{
        				name:"pkMembershipContractFees",
        				type:"hidden"
        			},{
        				name:"version",
        				type:"hidden"
        			},{
        				name:"memberShipContract.membershipCard.name",
        				label:"会籍卡",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"memberShipContract.room.number",
        				label:"房间",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"personalCardowner.personalInfo.name",
        				label:"付款权益人",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"deposit.customer.name",
        				label:"选择定金",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        				
        			},{
        				name:"memberShipContract.memberShipFees",
        				label:"应收卡费",
        				defaultValue:0,
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"deposit.realDeposit",
        				label:"定金",
        				defaultValue:0,
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"realFees",
        				label:"实收卡费",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"chargeMode.value",
        				label:"收费方式",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"chargeStatus.value",
        				label:"收费状态",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"chargeTime",
        				label:"收费日期",
        				type:"date",
						mode:"Y-m-d",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"operator.name",
        				label:"经手人",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"confirmTime",
        				label:"到账日期",
        				type:"date",
						mode:"Y-m-d",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"confirm.name",
        				label:"确认人",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"invoiceStatus.value",
        				label:"开票状态",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"invoiceAmount",
        				label:"开票金额",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"invoiceTime",
        				label:"开票日期",
        				type:"date",
						mode:"Y-m-d",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"invoice.name",
        				label:"开票人",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"refund.name",
        				label:"退款经手人",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"refundTime",
        				label:"退款日期",
        				type:"date",
						mode:"Y-m-d",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"refundAmount",
        				label:"退款金额",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"refundConfirm.name",
        				label:"退款到账确认人",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"refundConfirmTime",
        				label:"退款到账时间",
        				type:"date",
						mode:"Y-m-d",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			}]
        		}
        	});
        	this.set("form",form);
            
        }
	});
	module.exports = membershipcontractfeesrefundconfirm;	
});

