/**
 * 会籍收费-->卡费收取明细
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
	var template="<div class='el-membershipcontractfeescollectiondetails'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"<div class='J-feesDetilsGrid hidden'></div>"+
		"<div class='J-invoiceDetilsGrid hidden'></div>"+
		"</div>";
	var membershipcontractfeescollectiondetails = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title: i18ns.get("charge_shipfees_detailtitle","卡费收取明细"),
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/membershipcontractfees/search",
							data:{
								s:str,
								properties:"memberShipContract.membershipCard.name,"+
				                           "memberShipContract.personalCardowners.personalInfo.name,"+
					                       "memberShipContract.room.number," +
					                       "memberShipContract.signDate," +
					                       "memberShipContract.status," +
					                       "chargeStatus," +
					                       "memberShipContract.membershipCard.cardType.name",
						        fetchProperties:"pkMembershipContractFees,"+
											"chargeStatus,"+
											"invoiceStatus,"+
											"memberShipContract.membershipCard.cardType.name,"+
											"memberShipContract.membershipCard.name,"+
											"memberShipContract.personalCardowners.personalInfo.name,"+
											"memberShipContract.signDate,"+
											"memberShipContract.checkInType,"+
											"memberShipContract.room.number,"+
											"memberShipContract.memberShipFees,"+
											"memberShipContract.operator.name,"+
											"memberShipContract.status,"+
											"invoicedetails.pkMemberShipContractInvoiceDetail,"+
											"invoicedetails.invoiceStatus,"+
											"invoicedetails.invoicer.name,"+
											"invoicedetails.invoiceTime,"+
											"invoicedetails.invoiceFees,"+
											"feesdetails.isDeposit,"+
											"feesdetails.deposit,"+
											"feesdetails.personalCardowner.personalInfo.name,"+
											"feesdetails.chargeMode,"+
											"feesdetails.realFees,"+
											"feesdetails.chargeTime,"+
											"feesdetails.operator.name,"+
											"feesdetails.confirmTime,"+
											"feesdetails.confirm.name",
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
							widget.show(".J-Grid").hide([".J-Form",".J-feesDetilsGrid",".J-invoiceDetilsGrid"]);
							widget.get("subnav").hide(["return"]).show(["search","cardType","building","chargeStatus","status","time","toexcel"]);
							return false;
						}
        			},{
        				id:"toexcel",
        				text:"导出",
        				show:true,
        				handler:function(){
        					var carfdty=widget.get("subnav").getValue("cardType");
        					window.open("api/membershipcontractfees/toexcel?chargeStatusIn="+widget.get("subnav").getValue("chargeStatus")+
    		 						"&memberShipContract.membershipCard.cardType="+widget.get("subnav").getValue("cardType")+
    								"&memberShipContract.room.building="+widget.get("subnav").getValue("building")+
    								"&memberShipContract.status="+widget.get("subnav").getValue("status")+
    								"&memberShipContract.signDate="+widget.get("subnav").getValue("time").start+
    								"&memberShipContract.signDateEnd="+widget.get("subnav").getValue("time").end+
    								"&fetchProperties=pkMembershipContractFees,"+"chargeStatus,"+
            						"invoiceStatus,"+
            						"memberShipContract.membershipCard.name,"+
            						"memberShipContract.membershipCard.cardType.name,"+
            						"memberShipContract.personalCardowners.personalInfo.name,"+
            						"memberShipContract.signDate,"+
            						"memberShipContract.checkInType,"+
            						"memberShipContract.room.number,"+
            						"memberShipContract.memberShipFees,"+
            						"memberShipContract.operator.name,"+
            						"memberShipContract.status,"+
            						"invoicedetails.pkMemberShipContractInvoiceDetail,"+
            						"invoicedetails.invoiceStatus,"+
            						"invoicedetails.invoicer.name,"+
            						"invoicedetails.invoiceTime,"+
            						"invoicedetails.invoiceFees,"+
            						"feesdetails.isDeposit,"+
            						"feesdetails.deposit,"+
            						"feesdetails.personalCardowner.personalInfo.name,"+
            						"feesdetails.chargeStatus,"+
            						"feesdetails.chargeMode,"+
            						"feesdetails.realFees,"+
            						"feesdetails.chargeTime,"+
            						"feesdetails.operator.name,"+
            						"feesdetails.confirmTime,"+
            						"feesdetails.confirm.name"
    								);
    					   return false;
        				}
        			}],
        			
        			buttonGroup:[{
        				id:"cardType",
        				tip: i18ns.get("sale_card_type","卡类型"),
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
     				   id:"chargeStatus",
     				   tip:"缴费状态",
//    				   showAll:true,
//    				   showAllFirst:true,
    				   items:[{
    					   key:"UnCharge,Charging,Payup",
    					   value:"全部"
    				   },{
    					   key:"UnCharge,Charging",
    					   value:"未缴清"
    				   },{
    					   key:"Payup",
    					   value:"已缴清"  
    				   }],
    				   handler:function(key,element){
							   widget.get("grid").refresh();
    				   }
    			   },{
        				   id:"status",
        				   tip:"签约状态",
        				   showAll:true,
        				   showAllFirst:true,
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
   					 	ranges:{
   					 		"本月": [moment().startOf("month"), moment().endOf("month")],
   					 		"三个月": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
   							"六个月": [moment().subtract("month", 6).startOf("days"),moment().endOf("days")],
   							},
   						defaultTime:"本月",
   						tip: i18ns.get("sale_ship_datetitle","会籍签约日期"),
           				click:function(time){
           					widget.get("grid").refresh();
   						}
   					},
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
				url:"api/membershipcontractfees/query",
				params:function(){
					return {
						"chargeStatusIn":widget.get("subnav").getValue("chargeStatus"),
						"memberShipContract.membershipCard.cardType":widget.get("subnav").getValue("cardType"),
						"memberShipContract.room.building":widget.get("subnav").getValue("building"),
						"memberShipContract.status":widget.get("subnav").getValue("status"),
						"memberShipContract.signDate":widget.get("subnav").getValue("time").start,
						"memberShipContract.signDateEnd":widget.get("subnav").getValue("time").end,
						fetchProperties:"pkMembershipContractFees,"+
						"chargeStatus,"+
						"invoiceStatus,"+
						"memberShipContract.membershipCard.name,"+
						"memberShipContract.membershipCard.cardType.name,"+
						"memberShipContract.personalCardowners.personalInfo.name,"+
						"memberShipContract.signDate,"+
						"memberShipContract.checkInType,"+
						"memberShipContract.room.number,"+
						"memberShipContract.memberShipFees,"+
						"memberShipContract.operator.name,"+
						"memberShipContract.status,"+
						"invoicedetails.pkMemberShipContractInvoiceDetail,"+
						"invoicedetails.invoiceStatus,"+
						"invoicedetails.invoicer.name,"+
						"invoicedetails.invoiceTime,"+
						"invoicedetails.invoiceFees,"+
						"feesdetails.isDeposit,"+
						"feesdetails.deposit,"+
						"feesdetails.personalCardowner.personalInfo.name,"+
						"feesdetails.chargeStatus,"+
						"feesdetails.chargeMode,"+
						"feesdetails.realFees,"+
						"feesdetails.chargeTime,"+
						"feesdetails.operator.name,"+
						"feesdetails.confirmTime,"+
						"feesdetails.confirm.name",
					};
				},
				model:{
					columns:[{
						key:"memberShipContract.membershipCard.name",
						name:  i18ns.get("sale_card_name","会籍卡号"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("mainform").setData(data);
								widget.get("feesDetilsGrid").setData(data.feesdetails);
								widget.get("invoiceDetilsGrid").setData(data.invoicedetails);
								
								widget.get("mainform").setDisabled(true);//设置不可编辑
								widget.hide(".J-Grid").show([".J-Form",".J-feesDetilsGrid",".J-invoiceDetilsGrid"]);
								widget.get("subnav").show(["return"]).hide(["search","cardType","building","chargeStatus","status","time","toexcel"]);
							}
						}]
					},{
						key:"memberShipContract.membershipCard.cardType.name",
						name: i18ns.get("sale_card_type","卡类型"),
					},{
						key:"memberShipContract.personalCardowners",
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
						key:"memberShipContract.signDate",
						name:"签约日期",
						format:"date"
					},{
						key:"memberShipContract.checkInType.value",
						name:"入住类型",
					},{
						key:"memberShipContract.room.number",
						name:"房间号",
					},{
						key:"memberShipContract.memberShipFees",
						name: i18ns.get("charge_shipfees_confees","会籍卡费"),
						className:"text-right",
						format:"thousands"
					},{
						key:"feesdetails.realFees",
						name:  i18ns.get("charge_shipfees_realfees","已收卡费"),
						className:"text-right",
						format:function(value,row){
							var count=0;
							var datas =row.feesdetails;
							if(datas){
								for(var  i in datas){
									if(datas[i]){
//										if(datas[i].chargeStatus.key!="UnCharge")
											count += datas[i].realFees;
									}
								}
							}
							count=Number(count).toFixed(2)+"";
							return count.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
						}
					},{
						key:"chargeStatus.value",
						name:"是否缴清",
					},{
						key:"invoiceStatus.value",
						name:"是否开票",
					},{
						key:"memberShipContract.status.value",
						name:"签约状态",//合同状态
					}
//					,{
//						key:"operate",
//						name : "操作",
//						format:"button",
//						formatparams:[{
//							key:"detail",
//							text:"明细",
//							handler:function(index,data,rowEle){
//								widget.get("mainform").setData(data);
//								widget.get("feesDetilsGrid").setData(data.feesdetails);
//								widget.get("invoiceDetilsGrid").setData(data.invoicedetails);
//								
//								widget.get("mainform").setDisabled(true);//设置不可编辑
//								widget.hide(".J-Grid").show([".J-Form",".J-feesDetilsGrid",".J-invoiceDetilsGrid"]);
//								widget.get("subnav").show(["return"]).hide(["search","cardType","building","chargeStatus","status","time","toexcel"]);
//							}
//						}]
//					}
					]
				}
            });
            this.set("grid",grid);
            
        	var mainform=new Form({
        		parentNode:".J-Form",
        		model:{
        			id:"membershipcontractfeescollectiondetail",
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
        				label:"收费状态",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			}]
        		}
        	});
        	this.set("mainform",mainform);
        	
        	var feesDetilsGrid=new Grid({
            	parentNode:".J-feesDetilsGrid",
				model:{
					columns:[{
						key:"isDeposit",
						name:"是否预约金",
						format:function(value,row){
							if(value){
								return "是";
							}else{
								return "否";
							}
						}
					},{
						key:"personalCardowner.personalInfo.name",
						name:"付款权益人"
					},{
						key:"chargeMode.value",
						name:"交款方式"
					},{
						key:"realFees",
						name:"金额",
						className:"text-right",
						format:"thousands"
					},{
						key:"chargeTime",
						name:"收款时间",
						format:"date"
					},{
						key:"operator.name",
						name:"收款人"
					},{
						key:"confirmTime",
						name:"到账时间",
						format:"date"
					},{
						key:"confirm.name",
						name:"到账确认人"
					}]
				}
        	});
        	this.set("feesDetilsGrid",feesDetilsGrid);
        	
        	
        	var invoiceDetilsGrid=new Grid({
            	parentNode:".J-feesDetilsGrid",
				model:{
					columns:[{
						key:"invoiceStatus.value",
						name:"开票状态",
						className:"text-center",
					},{
						key:"invoiceFees",
						name:"开票金额",
						className:"text-right",
						format:"thousands"
					},{
						key:"invoiceTime",
						name:"开票时间",
						className:"text-center",
						format:"date"
					},{
						key:"invoicer.name",
						name:"开票人",
						className:"text-center",
					}]
				}
        	});
        	this.set("invoiceDetilsGrid",invoiceDetilsGrid);
        }
	});
	module.exports = membershipcontractfeescollectiondetails;	
});

