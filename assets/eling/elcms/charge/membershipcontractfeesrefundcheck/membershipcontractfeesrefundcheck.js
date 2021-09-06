/**
 * 卡费退款审核
 * elview
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Form =require("form-2.0.0")
	var ApprovalUI = require("approvalUI");
	var store = require("store");
	var activeUser = store.get("user");
	//多语
	var i18ns = require("i18n");
	require("json");
	var template="<div class='el-membershipcontractfeesrefundcheck'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+
		"<div class='J-form hidden'></div>"+
		"<div class='J-approvalUI hidden'></div>"+
		"</div>";
	var membershipcontractfeesrefundcheck = ELView.extend({
		attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:i18ns.get("sale_shipfees_contract","卡")+"费退款审核",
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/membershipcontractfeesrefund/search",
							data:{
								s:str,
								properties:"memberShipContractFees.memberShipContract.membershipCard.name,"+
					                        "memberShipContractFees.memberShipContract.room.number,"+
					                        "memberShipContractFees.memberShipContract.personalCardowners.personalInfo.name"+
						                    "memberShipContractFees.memberShipContract.membershipCard.cardType.name",
						        fetchProperties:"memberShipContractFees.memberShipContract.membershipCard.name," +
											"memberShipContractFees.memberShipContract.membershipCard.cardType.name," +
											"memberShipContractFees.memberShipContract.personalCardowners.personalInfo.name," +
											"memberShipContractFees.memberShipContract.signDate," +
											"memberShipContractFees.memberShipContract.checkInType," +
											"memberShipContractFees.memberShipContract.room.number," +
											"memberShipContractFees.memberShipContract.memberShipFees," +
											"refundTime," +
											"refundAmount," +
											"refund.name," +
											"flowStatus," +
											"pkMembershipContractFeesRefund"
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
							widget.get("subnav").hide(["return"]).show(["building","cardType","flowStatus","time"]);
						}
					}],
        			buttonGroup:[{
        				id:"cardType",
        				tip: i18ns.get("sale_card_type","会籍卡类型"),
        				key:"pkMemberShipCardType",
        				showAll:true,
        				showAllFirst:true,
        				value:"name",
        				url:"api/cardtype/query",
        				handler:function(key,element){
        					   widget.get("grid").refresh();
        				}
        			},{
						id:"building",
						tip:"楼号",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
        			},{
	     				   id:"flowStatus",
	     				   tip:"退款状态",
	     				   showAll:true,
	     				   items:[{
	     					  key:"Approvaling",
	     					  value:"审批中"
	     				   },{
	     					  key:"Initial",
	     					  value:"初始"  
	     				   },{
	     					   key:"Approved",
	     					   value:"审批通过"
	     				   },{
	     					   key:"NotApproved",
	     					   value:"审批不通过"
	     				   }],
	     				   handler:function(key,element){
								   widget.get("grid").refresh();
	     				   }
	     			   }],
        			time:{
        				tip:"退款时间",
   					 	ranges:{
   					 		"本月": [moment().startOf("month"), moment().endOf("month")],
   					 		"三个月": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
   							"六个月": [moment().subtract("month", 6).startOf("days"),moment().endOf("days")],
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
        		url:"api/membershipcontractfeesrefund/query",
        		params:function(){
					return {
						pkMembershipContractFeesRefund:params?params.modelId:"",
						"memberShipContractFees.memberShipContract.membershipCard.cardType":widget.get("subnav").getValue("cardType"),
						"memberShipContractFees.memberShipContract.room.building":widget.get("subnav").getValue("building"),
						"flowStatus":widget.get("subnav").getValue("flowStatus"),
						"refundTime":widget.get("subnav").getValue("time").start,
						"refundTimeEnd":widget.get("subnav").getValue("time").end,
						fetchProperties:"memberShipContractFees.memberShipContract.membershipCard.name," +
								"memberShipContractFees.memberShipContract.membershipCard.cardType.name," +
								"memberShipContractFees.memberShipContract.personalCardowners.personalInfo.name," +
								"memberShipContractFees.memberShipContract.signDate," +
								"memberShipContractFees.memberShipContract.checkInType," +
								"memberShipContractFees.memberShipContract.room.number," +
								"memberShipContractFees.memberShipContract.memberShipFees," +
								"refundTime," +
								"refundAmount," +
								"refund.name," +
								"flowStatus," +
								"pkMembershipContractFeesRefund"
					};
				},
				model:{
					columns:[{
						key:"memberShipContractFees.memberShipContract.membershipCard.name",
						name: i18ns.get("sale_card_name","会籍卡号"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								var name= "";
								if(data.memberShipContractFees.memberShipContract.personalCardowners.length>0){
									for(var i =0 ;i<data.memberShipContractFees.memberShipContract.personalCardowners.length;i++){
										if(i<data.memberShipContractFees.memberShipContract.personalCardowners.length-1){
											name+= data.memberShipContractFees.memberShipContract.personalCardowners[i].personalInfo.name+"、";
										}else{
											name+= data.memberShipContractFees.memberShipContract.personalCardowners[i].personalInfo.name;
										}
									}
								}else{
									name="无";
								};
								approvalUI.set("param",{
									modelId:data.pkMembershipContractFeesRefund,
									serviceType:"MemberShipFeesRefund",
									hideButton:true
								});
								approvalUI.get("appgrid").refresh();
								data.names= name;
								data.memberShipContractFees.memberShipContract.signDate = moment(data.memberShipContractFees.memberShipContract.signDate).format("YYYY-MM-DD");
								data.refundTime = moment(data.refundTime).format("YYYY-MM-DD");
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.hide([".J-grid"]).show([".J-form",".J-approvalUI"]);
								widget.get("subnav").show(["return"]).hide(["building","cardType","flowStatus","time"]);
								$(".J-approval").addClass("hidden");
							}
						}]
					},{
						key:"memberShipContractFees.memberShipContract.membershipCard.cardType.name",
						name:i18ns.get("sale_card_type","会籍卡类型"),
					},{
						key:"memberShipContractFees.memberShipContract.personalCardowners",
						name:"权益人",
						format:function(value,row){
							var name= "";
							if(value.length>0){
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
						key:"memberShipContractFees.memberShipContract.signDate",
						name:"签约日期",
						format:"date"
					},{
						key:"memberShipContractFees.memberShipContract.checkInType.value",
						name:"入住类型"
					},{
						key:"memberShipContractFees.memberShipContract.room.number",
						name:"房间号"
					},{
						key:"memberShipContractFees.memberShipContract.memberShipFees",
						name:i18ns.get("charge_shipfees_confees","会籍卡费"),
						format:"thousands"
					},{
						key:"refundTime",
						name:"申请日期",
						format:"date"
					},{
						key:"refundAmount",
						name:"退款金额",
						format:"thousands"
					},{
						key:"refund.name",
						name:"申请人",
					},{
						key:"flowStatus.value",
						name:"状态",
					},{
						key:"operate",
						name : "审核",
						format:function(value,row){
							if(row.flowStatus.key=="Approvaling"){
								return "button"	;
							}else{
								return row.flowStatus.value;
							}
							
						},
						formatparams:[{
							key:"refund",
							text:"审核",
							handler : function(index,data, rowEle) {
								var name= "";
								if(data.memberShipContractFees.memberShipContract.personalCardowners.length>0){
									for(var i =0 ;i<data.memberShipContractFees.memberShipContract.personalCardowners.length;i++){
										name+=data.memberShipContractFees.memberShipContract.personalCardowners[i].personalInfo.name+"、";
									}
								}else{
									name="无";
								}
								data.names= name;
								data.memberShipContractFees.memberShipContract.signDate = moment(data.memberShipContractFees.memberShipContract.signDate).format("YYYY-MM-DD");
								data.refundTime = moment(data.refundTime).format("YYYY-MM-DD");
								approvalUI.set("param",{
									modelId:data.pkMembershipContractFeesRefund,
									serviceType:"MemberShipFeesRefund",
									hideButton:false,
									callBack:function(data){
										if(data){
											aw.ajax({
												url:"api/membershipcontractfeesrefund/query",
												data:{
													pkMembershipContractFeesRefund:data.pkMembershipContractFeesRefund,
													fetchProperties:"flowStatus"
												},
												dataType:"json",
												success:function(data){
													if(data[0]){
														if(data[0].flowStatus.key=="Approved" ){
															widget.get("form").setValue("flowStatus.value","已通过");
														}else if(data[0].flowStatus.key=="NotApproved"){
															widget.get("form").setValue("flowStatus.value","未通过");
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
								widget.get("subnav").show(["return"]).hide(["building","cardType","flowStatus","time"]);
							}
						}]
					}]
				}
        	});
        	this.set("grid",grid);
        	
        	var form = new Form({
         		parentNode:".J-form",
         		model:{
         			id:"refundForm",
         			items:[{
         				name:"memberShipContractFees.memberShipContract.membershipCard.name",
         				label: i18ns.get("sale_card_name","会籍卡号"),
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
						name:"memberShipContractFees.memberShipContract.membershipCard.cardType.name",
						label: i18ns.get("sale_card_type","会籍卡类型"),
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
         				name:"memberShipContractFees.memberShipContract.signDate",
         				label:"签约时间",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"names",
         				label:"权益人",
     					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"memberShipContractFees.memberShipContract.checkInType.value",
         				label:"入住类型",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"memberShipContractFees.memberShipContract.room.number",
         				label:"房间号",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"memberShipContractFees.memberShipContract.memberShipFees",
         				label: i18ns.get("sale_shipfees_contract","卡")+"费",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"refundTime",
         				label:"申请时间",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"refund.name",
						label:"退款申请人",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"flowStatus.value",
         				label:"退款状态",
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
        }
	});
	module.exports = membershipcontractfeesrefundcheck;
});