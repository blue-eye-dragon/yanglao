/**
 * 预约金收取明细
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var Properties=require("./properties");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"; 
	var depositcollectiondetails = ELView.extend({ 
		events : {
			
		},
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model : {
					//各环境对于标题显示有所区别,将其抽取到properties中进行判断
					title : Properties.customize_title(widget),
					search : function(str) {
						var g = widget.get("grid");
						aw.ajax({
							url : "api/deposit/search",
							data : {
								s : str,
								properties : "confirmTime,confirm.name,room.number,type.name,paymentWay.value,operator.name," +
										"phoneNumber,chargeTime,name,chargeStatus,realDeposit",
								fetchProperties : "mobilePhone,depositRefundApply.flowStatus,operator.*,confirmTime,confirm.name," +
										"customer.mobilePhone,customer.name,customer.pkCustomer,customer.phoneNumber,paymentWay.*," +
										"dataSource.*,name,phoneNumber,description,room.number,room.pkRoom,type.name,type.pkRoomType," +
										"chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser,operator.name,version",
							},
							dataType : "json",
							success : function(data) {
								g.setData(data);
							}
						});
					},
					buttonGroup : [{
						id:"chargeStatus",
						tip:"收费状态",
						items:[{
							key:"UnCharge,Charged,Receiving,CardFeeTransferred",
							value:"全部"
						},{
							key:"UnCharge",
							value:"未收费"
						},{
							key:"Charged",
							value:"已收费"  
						},{
							key:"Receiving",
							value:"已到账" 
						},{
							key:"CardFeeTransferred",
							value:"已转"+i18ns.get("charge_shipfees_money","卡费") 
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-grid").hide(".J-form");
							widget.get("subnav").hide(["return"]).show(["search","time","chargeStatus"]);
							return false;
						}
					}],
					time:{
						click:function(time){
							widget.get("grid").refresh();
						},
					}
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				url : "api/deposit/query",
				params : function() {
					var subnav = widget.get("subnav");
					return {
						"chargeStatusIn" : subnav.getValue("chargeStatus"),
						"chargeTime":widget.get("subnav").getValue("time").start,
						"chargeTimeEnd":widget.get("subnav").getValue("time").end,
						fetchProperties : "mobilePhone,depositRefundApply.flowStatus,operator.*,confirmTime,confirm.name," +
								"customer.mobilePhone,customer.name,customer.pkCustomer,customer.phoneNumber,paymentWay.*," +
								"dataSource.*,name,phoneNumber,description,room.number,room.pkRoom,type.name,type.pkRoomType," +
								"chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser,operator.name,version",
					};
				},
				model : {
					columns : [{
						key:"room.number",
						name:"房间"
					},{
						key:"type.name",
						name:"房型"
					},{
						key : "name",
						name : "交款人"
					},{
						key : "phoneNumber",
						name : "联系电话"
					},{
						key:"realDeposit",
						name: i18ns.get("charge_deposit_depmoney","预约")+"金额",
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
						key:"chargeStatus",
						name:"收款状态",
						format:function(value,row){
							return value.value;
						}
					},{
						key:"operator.name",
						name:"经手人"
					},{
						key:"confirm.name",
						name:"确认人"
					},{
						key:"confirmTime",
						name:"确认时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						key:"depositRefundApply.flowStatus",
						name:"退款状态",
						format:function(value,row){
							if(value){
								return value.value;
							}else{
								return "";
							}
						}
					},{
						key : "operate",
						name : "操作",
						format:"button",
						formatparams:[{
							key:"detail",
							text:"明细",
							handler:function(index,data,rowEle){
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").hide(["search","chargeStatus","time"]).show(["return"]);
								if(data.realDeposit==null||data.realDeposit==""){
									widget.get("form").setValue("realDeposit",0);
								}
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form=new Form({
				show:false,
				parentNode:".J-form",
				model : {
					id : "depositcollectiondetails",
					items : [ {
						name : "pkDeposit",
						type : "hidden"
					}, {
						name : "version",
						defaultValue : "0",
						type : "hidden"
					},{
						name:"dataSource",
						type:"hidden",
						defaultValue:"Manual"
					},{
						name:"name",
						label:"交款人",
						type:"text"
					},{
						name:"phoneNumber",
						label:"联系电话",
						type:"text"
					},{
						name:"room.number",
						label:"房间",
						type:"text",
					},{
						name:"type.name",
						label:"房型",
						type:"text",
					},{
						name:"realDeposit",
						label: i18ns.get("charge_deposit_depmoney","预约")+"金额(元)",
						type:"text"
					},{
						name:"paymentWay.value",
						label:"付款方式",
						type:"text",
					},{
						name:"chargeStatus",
						label:"收费状态",
						type:"select",
						options:[{
							key:"UnCharge",
							value:"未收费"
						},{
							key:"Charged",
							value:"已收费"  
						},{
							key:"Receiving",
							value:"已到账" 
						},{
							key:"Refund",
							value:"已退款" 
						},{
							key:"RefundReceiving",
							value:"退款已到账" 
						},{
							key:"CardFeeTransferred",
							value:"已转"+i18ns.get("charge_shipfees_money","卡费")
						}]
					},{
						name:"chargeTime",
						label:"收费日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"description",
						label:"备注",
						type:"text"
					},{
						name:"operator.name",
						label:"经手人",
						type:"text",	
					},{
						name:"confirm.name",
						label:"到账确认人",
						type:"text"
					},{
						name:"confirmTime",
						label:"到账确认日期",
						type:"date",
						mode:"Y-m-d"
					}]
				}
			});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			if(params&&params.father=="depositrefundapply"){
				data = params.data;
				var form = widget.get("form");
				form.reset();
				form.setData(data);
				if(data.realDeposit==null||data.realDeposit==""){
					widget.get("form").setValue("realDeposit",0);
				}
				form.setDisabled(true);
				widget.show([".J-form"]).hide([".J-grid"]);
				widget.get("subnav").hide(["search","chargeStatus","time"]).show(["return"]);
			}
		}
	});
	module.exports = depositcollectiondetails;
});