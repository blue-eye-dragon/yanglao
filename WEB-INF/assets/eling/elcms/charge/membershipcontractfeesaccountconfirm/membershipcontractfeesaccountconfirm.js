/**
 * 会籍卡费到账确认
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
	require("./membershipcontractfeesaccountconfirm.css");
	var template="<div class='el-membershipcontractfeesaccountconfirm'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"<div class='J-feesDetilsGrid hidden'></div>"+
		"</div>";
	var membershipcontractfeesaccountconfirm = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:  i18ns.get("charge_shipfees_confirm","卡费到账确认"),
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/membershipcontractfees/search",
							data:{
								//会籍卡号、房间号、权益人、卡类型
								s:str,
								properties:"memberShipContract.membershipCard.name,"+
					                        "memberShipContract.room.number,"+
					                        "memberShipContract.personalCardowners.personalInfo.name,"+//没有索引
					                        "memberShipContract.membershipCard.cardType.name",
						                    fetchProperties:"*,"+
											"feesdetails.deposit.pkDeposit," +
											"feesdetails.deposit.realDeposit," +
											"feesdetails.deposit.customer.name," +
											"chargeStatus,"+
											"memberShipContract.membershipCard.name,"+
											"memberShipContract.membershipCard.cardType.name,"+
											"memberShipContract.personalCardowners.personalInfo.name,"+
											"feesdetails.personalCardowner.pkPersonalCardowner,"+
											"memberShipContract.signDate,"+
											"memberShipContract.checkInType,"+
											"memberShipContract.room.number,"+
											"memberShipContract.memberShipFees,"+
											"invoicedetails.pkMembershipContractFees,"+
											"invoicedetails.invoiceStatus,"+
											"memberShipContract.operator.name,"+
											"invoicedetails.invoicer.name,"+
											"invoicedetails.invoiceTime,"+
											"memberShipContract.status,"+
											"feesdetails.pkMembershipContractFeesDetail,"+
											"feesdetails.chargeMode,"+
											"feesdetails.chargeStatus,"+
											"feesdetails.chargeTime,"+
											"feesdetails.operator.name,"+
											"feesdetails.confirm.name,"+
											"feesdetails.confirmTime,"+
											"feesdetails.personalCardowner.personalInfo.name,"+
											"feesdetails.realFees," +
											"feesdetails.version",
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
							widget.show(".J-Grid").hide([".J-Form",".J-feesDetilsGrid"]);
							widget.get("subnav").hide(["return"]).show(["search","chargeStatusIn","time","memberShipContractStatus","building"]);
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
											confirm:activeUser.pkUser,
											chargeStatus:"Receiving",
											confirmTime:moment().valueOf(),
											version:widget.get("form").getValue("version")
											},
										dataType:"json",
										success:function(data){
											widget.show(".J-Grid").hide([".J-Form",".J-feesDetilsGrid"]);
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
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
        				id:"chargeStatusIn",
        				tip:"收费情况",
//        				showAll:true,
        				items:[{
        					 key:"Payup",
        					 value:"已缴清"  
        				   },{
        					 key:"UnCharge,Charging",
        					 value:"未缴清"
        				   },{
	        				 key:"Payup,UnCharge,Charging",
	        				 value:"全部"
	        			   }],
        				   handler:function(key,element){
   							   widget.get("grid").refresh();
        				   }
        			   },{
        				   id:"memberShipContractStatus",
        				   tip:  i18ns.get("sale_card_status","会籍状态"),
        				   showAll:true,
        					   items:[{
              					 key:"Normal",
              					 value:"正常"
              				   },{
              					   key:"Termination",
              					   value:"终止"  
              				   }],
              				 handler:function(key,element){
     							   widget.get("grid").refresh();
          				   }
        			   }],
						time:{
							tip:"签约时间",
							click:function(time){
								widget.get("grid").refresh();
							},
						}
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
            	autoRender:false,
            	url:"api/membershipcontractfees/query",
				params:function(){
					var time = widget.get("subnav").getValue("time");
					return {
						"pkMembershipContractFees":params?params.MembershipContractFees:"",
						"memberShipContract.signDate":time.start,
						"memberShipContract.signDateEnd":time.end,
						"memberShipContract.room.building":widget.get("subnav").getValue("building"),
						"chargeStatusIn":widget.get("subnav").getValue("chargeStatusIn"),
						"memberShipContract.status":widget.get("subnav").getValue("memberShipContractStatus"),
						fetchProperties:"*,"+
						"feesdetails.deposit.pkDeposit," +
						"feesdetails.deposit.realDeposit," +
						"feesdetails.deposit.customer.name," +
						"chargeStatus,"+
						"memberShipContract.membershipCard.name,"+
						"memberShipContract.membershipCard.cardType.name,"+
						"memberShipContract.personalCardowners.personalInfo.name,"+
						"memberShipContract.signDate,"+
						"memberShipContract.checkInType,"+
						"memberShipContract.room.number,"+
						"memberShipContract.memberShipFees,"+
						"invoicedetails.pkMembershipContractFees,"+
						"invoicedetails.invoiceStatus,"+
						"memberShipContract.operator.name,"+
						"invoicedetails.invoicer.name,"+
						"invoicedetails.invoiceTime,"+
						"memberShipContract.status,"+
						"feesdetails.pkMembershipContractFeesDetail,"+
						"feesdetails.chargeMode,"+
						"feesdetails.chargeStatus,"+
						"feesdetails.chargeTime,"+
						"feesdetails.operator.name,"+
						"feesdetails.confirm.name,"+
						"feesdetails.confirmTime,"+
						"feesdetails.personalCardowner.personalInfo.name,"+
						"feesdetails.personalCardowner.pkPersonalCardowner,"+
						"feesdetails.isDeposit,"+
						"feesdetails.deposit.pkDeposit,"+
						"feesdetails.deposit.transferredAmount,"+
						"feesdetails.deposit.transferredPeople.name,"+
						"version,"+
						"feesdetails.realFees," +
						"feesdetails.version",
					};
				},
				model:{
					/*
					 * 会籍卡号-、权益人-（合并显示全部权益人姓名）、
					 * 签约日期、入住类型、房间号-、会籍卡费、已收卡费-（已经收费的收款明细总额）、
					 * 已确认（已到账确认总额）、未确认（已收费未到账确认总额）、是否缴清、
					 * 经手人-、状态（会籍签约状态：正常、终止）操作-
					 */
					columns:[{
						key:"memberShipContract.membershipCard.name",
						name: i18ns.get("sale_card_name","会籍卡号"),
						className:"cardNo",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("form").setData(data);
								widget.get("feesDetilsGrid").setData(data.feesdetails);
								widget.get("form").setDisabled(true);
								widget.show([".J-Form",".J-feesDetilsGrid"]).hide(".J-Grid");
								widget.get("subnav").hide(["search","chargeStatusIn","time","memberShipContractStatus","building"]).show(["return"]);
							}
						}]
					},{
						key:"memberShipContract.personalCardowners",
						name:"权益人",
						className:"personalCardowners",
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
						key:"memberShipContract.signDate",
						name:"签约日期",
						className:"signDate",
						format:"date"
					},
//					{
//						key:"memberShipContract.checkInType.value",
//						name:"入住类型",
//						className:"checkInType",
//					},{
//						key:"memberShipContract.membershipCard.cardType.name",
//						name:"卡类型",
//						className:"cardType",
//					},{
//						key:"memberShipContract.room.number",
//						name:"房间号",
//						className:"roomNo",
//					},
					{
						key:"memberShipContract.memberShipFees",
						name: i18ns.get("charge_shipfees_confees","会籍卡费"),
						format:"thousands",
						className:"memberShipFees"
					},{
						key:"feesdetails.realFees",
						name: i18ns.get("charge_shipfees_realfees","已收卡费"),
						className:"realFees",
						format:function(value,row){
							var count=0;
							var datas =row.feesdetails;
							for(var  i in datas){
								if(datas[i]){
									if(datas[i].chargeStatus.key!="UnCharge")
										count += datas[i].realFees;
								}
							}
							count =Number(count).toFixed(2)+"";
							return count.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
						}
					},{
						name:"已确认",
						className:"confirm",
						format:function(value,row){
							var confirm=0;
							var datas =row.feesdetails;
							for(var  i in datas){
								if(datas[i]){
									if(datas[i].chargeStatus.key=="Receiving")
										confirm += datas[i].realFees;
								}
							}
							confirm =Number(confirm).toFixed(2)+""; 
							return confirm.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
						}
					},{
						name:"未确认",
						className:"unConfirm",
						format:function(value,row){
							var unconfirm = 0
							var datas =row.feesdetails;
							for(var  i in datas){
								if(datas[i]){
									if(datas[i].chargeStatus.key=="Charged")
										unconfirm += datas[i].realFees;
								}
							}
							unconfirm =Number(unconfirm).toFixed(2)+"";
							return unconfirm.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
						}
					},{
						key:"chargeStatus.value",
						name:"是否缴清",
						className:"chargeStatus",
						format:function(value,row){
							var name= "";
							if(row.chargeStatus.key=="Payup"){
								name = "是";
							}else{
								name = "否";
							}
							return name;
						}
					},
//					{
//						//会籍签约状态：正常、终止
//						key:"memberShipContract.status.value",
//						name:"会籍卡状态",//合同状态
//						className:"status",
//					},
					{
						key:"operate",
						name : "操作",
						className:"operate",
						format:function(row,value){
								return "button";
						},
						formatparams:[{
							key:"confirm",
							text:"确认",
							show:function(value,row){
								var unconfirm = 0
								var datas =row.feesdetails;
								for(var  i in datas){
									if(datas[i]){
										if(datas[i].chargeStatus.key=="Charged"){
											unconfirm += datas[i].realFees;
											if(unconfirm>0){
												return true;
											}
										}
									}
								}
							},
							handler:function(index,data,rowEle){
								widget.get("form").setData(data);
								widget.get("feesDetilsGrid").setData(data.feesdetails);
								widget.get("form").setDisabled(true);
								widget.show([".J-Form",".J-feesDetilsGrid"]).hide(".J-Grid");
								widget.get("subnav").hide(["search","chargeStatusIn","time","memberShipContractStatus","building"]).show(["return"]);
							}
						}]
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
        				label: i18ns.get("sale_card_name","会籍卡"),
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
        				name:"chargeStatus.value",
        				label:"状态",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			}]
        		}
        	});
        	this.set("form",form);
            
        	var feesDetilsGrid=new Grid({
            	parentNode:".J-feesDetilsGrid",
				model:{
					columns:[{
						key:"personalCardowner.personalInfo.name",
						name:"付款权益人"
					},{
						key:"chargeTime",
						name:"缴费日期",
						format:"date",
					},{
						key:"realFees",
						name:"金额",
						className:"text-right",
						format:"thousands"
					},{
						 key:"chargeStatus.value",
						 name:"状态"
					},{
						key:"operator.name",//所有收款人
						name:"经手人",
					},{
						key:"confirm.name",
						name:"确认人",
					},{
						key:"confirmTime",
						name:"确认时间",
						format:"date",
					},{
							key:"operate",
							name : "操作",
							format:function(row,value){
								if(value.chargeStatus.key=="Receiving"){
									return "已到账";
								}else if(value.chargeStatus.key=="UnCharge"){
									return "未收费";
								}else{
									return "button";
								}
							},
							formatparams:[{
								key:"edit",
								text:"确认",
								handler:function(index,data,rowEle){
										if(!data.personalCardowner){
											Dialog.alert({
												content:"请您补充付费权益人！"
											})
											return 
										}	
										Dialog.confirm({
											title:"提示",
											content:"是否确认？",
											confirm:function(){
												aw.ajax({
													url:"api/membershipcontractfeesdetail/saveFeesDetail",
													data:{
														pkMembershipContractFeesDetail:data.pkMembershipContractFeesDetail,
														confirm:activeUser.pkUser,
														confirmTime:moment().valueOf(),
														version:data.version,
														chargeStatus:"Receiving",
														fetchProperties:"*,"+
																		"personalCardowner.personalInfo.name,"+
																		"operator.name,"+
																		"confirm.name",
														},
													dataType:"json",
													success:function(data){
														var datas = widget.get("feesDetilsGrid").getData();
														datas.splice(index,1,data);
														widget.get("feesDetilsGrid").setData(datas);
														widget.get("grid").refresh();
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
        	this.set("feesDetilsGrid",feesDetilsGrid);

        },
        afterInitComponent:function(params,widget){
        	if(!params){
        		widget.get("grid").refresh();
        	}
        	if(params && params.MembershipContractFees ){
        		widget.get("grid").refresh();
        	}
        	if(params && params.father == "membershipcontractfeessummary"){
				widget.get("grid").refresh({
					"memberShipContract.signDate":params.start,
					"memberShipContract.signDateEnd":params.end,
					"feesdetails.chargeStatus":"Receiving",
					fetchProperties:"*,"+
					"feesdetails.deposit.pkDeposit," +
					"feesdetails.deposit.realDeposit," +
					"feesdetails.deposit.customer.name," +
					"chargeStatus,"+
					"memberShipContract.membershipCard.name,"+
					"memberShipContract.membershipCard.cardType.name,"+
					"memberShipContract.personalCardowners.personalInfo.name,"+
					"memberShipContract.signDate,"+
					"memberShipContract.checkInType,"+
					"memberShipContract.room.number,"+
					"memberShipContract.memberShipFees,"+
					"invoicedetails.pkMembershipContractFees,"+
					"invoicedetails.invoiceStatus,"+
					"memberShipContract.operator.name,"+
					"invoicedetails.invoicer.name,"+
					"invoicedetails.invoiceTime,"+
					"memberShipContract.status,"+
					"feesdetails.pkMembershipContractFeesDetail,"+
					"feesdetails.chargeMode,"+
					"feesdetails.chargeStatus,"+
					"feesdetails.chargeTime,"+
					"feesdetails.operator.name,"+
					"feesdetails.confirm.name,"+
					"feesdetails.confirmTime,"+
					"feesdetails.personalCardowner.personalInfo.name,"+
					"feesdetails.personalCardowner.pkPersonalCardowner,"+
					"feesdetails.isDeposit,"+
					"feesdetails.deposit.pkDeposit,"+
					"feesdetails.deposit.transferredAmount,"+
					"feesdetails.deposit.transferredPeople.name,"+
					"version,"+
					"feesdetails.realFees,"+
					"feesdetails.version"
				});
			}
        }
	});
	module.exports = membershipcontractfeesaccountconfirm;	
});

