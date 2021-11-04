/**
 * 会籍收费-->卡费退款确认
 * ELVIEW
 * subnav 
 * grid 
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	var store = require("store");
	var activeUser = store.get("user");
	//多语
	var i18ns = require("i18n");
	var template="<div class='el-membershipcontractfeesrefundapply'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+
		"<div class='J-form hidden'></div>"+
		"</div>";
	
	var membershipcontractfeesrefundapply = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title: i18ns.get("sale_shipfees_contract","卡")+"费退款确认",
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
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["building","cardType","time"]);
							return false;
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
        		autoRender:false,
        		url:"api/membershipcontractfeesrefund/query",
        		params:function(){
					return {
						"memberShipContractFees.memberShipContract.membershipCard.cardType":widget.get("subnav").getValue("cardType"),
						"memberShipContractFees.memberShipContract.room.building":widget.get("subnav").getValue("building"),
						"flowStatus":"Approved",
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
								"refundment," +
								"version," +
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
										name+=data.memberShipContractFees.memberShipContract.personalCardowners[i].personalInfo.name+"、";
									}
								}else{
									name="无";
								};
								data.names= name;
								data.memberShipContractFees.memberShipContract.signDate = moment(data.memberShipContractFees.memberShipContract.signDate).format("YYYY-MM-DD");
								data.refundTime = moment(data.refundTime).format("YYYY-MM-DD");
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.hide([".J-grid"]).show([".J-form"]);
								widget.get("subnav").show(["return"]).hide(["building","cardType","time"]);
								return false;
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
						name: i18ns.get("charge_shipfees_confees","会籍卡费"),
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
						name:"申请人"
					},{
						key:"flowStatus.value",
						name:"状态"
					},{
						key:"operate",
						name : "确认",
						format:function(value,row){
							if(row.refundment){
								return "已确认";
							}else{
								return "button"	;
							}
						},
						formatparams:[{
							key:"confirm",
							text:"确认",
							handler : function(index,data, rowEle) {
								Dialog.confirm({
									title:"提示",
									content:"是否确认？",
									confirm:function(){
										aw.ajax({
											url:"api/membershipcontractfeesrefund/save",
											data:{
												pkMembershipContractFeesRefund:data.pkMembershipContractFeesRefund,
												refundment:true,
												refundConfimTime:moment().valueOf(),
												refundConfirm:activeUser.pkUser,
												version:data.version
												},
											dataType:"json",
											success:function(data){
												widget.get("grid").refresh();
											}
										});
									}
								});
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
						label:i18ns.get("sale_card_type","会籍卡类型"),
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
        },
        afterInitComponent:function(params,widget){
        	if(!params){
        		widget.get("grid").refresh();
        	}
        	if(params && params.father == "membershipcontractfeessummary"){
				widget.get("grid").refresh({
					"refundTime":params.start,
					"refundTimeEnd":params.end,
					"flowStatus":"Approved",
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
					"refundment," +
					"version," +
					"pkMembershipContractFeesRefund"
				});
			}
        }
	});
	module.exports = membershipcontractfeesrefundapply;	
});

