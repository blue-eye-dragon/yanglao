/**
 * 预约金到账确认
 */
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
	var depositarrivalconfirm = ELView.extend({ 
		events : {
			"click .J-receiving":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				this.get("form").setData(data);
				this.get("form").setDisabled(true);
				this.show([".J-form"]).hide([".J-grid"]);
				this.get("subnav").hide(["search","chargeStatus","time"]).show(["return"]);
				if(data.realDeposit==null||data.realDeposit==""){
					this.get("form").setValue("realDeposit",0);
				}				
			},
			"click .J-roomquery":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				this.openView({
					url:"eling/elcms/charge/depositroomquery/depositroomquery",
					params:{
						pkDeposit:data.pkDeposit,
					},
					isAllowBack:true
				});
			},
			"click .J-charged":function(e){
				var subnav=this.get("subnav");
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				Dialog.confirm({
					title:"提示",
					content:"是否确认？",
					confirm:function(){
						aw.ajax({
							url:"api/deposit/accountConfirm",
							data:{
								pkDeposit:data.pkDeposit,
								pkUser:activeUser.pkUser,
								version:data.version
							},
							dataType:"json",
							success:function(data){
								grid.refresh({
									pkDeposit:data.pkDeposit,
									fetchProperties : "*,mobilePhone,confirmTime,confirm.name,customer.name,customer.pkCustomer," +
									"customer.phoneNumber,paymentWay.*,dataSource.*,name,phoneNumber,description,room.number," +
									"room.pkRoom,type.name,type.pkRoomType,chargeStatus.*,pkDeposit,realDeposit,chargeTime," +
									"operator.pkUser,operator.name,version"
								});
								subnav.setValue("chargeStatus","Receiving");
							}
						});
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
				model : {
					title : Properties.customize_title(widget),
					search : function(str) {
						var g = widget.get("grid");
						aw.ajax({
							url : "api/deposit/search",
							data : {
								s : str,
								"chargeStatusIn" : subnav.getValue("chargeStatus"),
								properties : "name,mobilePhone,phoneNumber",
								fetchProperties : "*,mobilePhone,confirmTime,confirm.name,customer.name,customer.pkCustomer,customer.phoneNumber,paymentWay.*,dataSource.*,name,phoneNumber,description,room.number,room.pkRoom,type.name,type.pkRoomType,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser,operator.name,version"
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
							key:"Charged",
							value:"已收款"  
						},{
							key:"Receiving",
							value:"已到账"  
						},{
							key:"Charged,Receiving",
							value:"全部"
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
							widget.get("subnav").hide(["return","confirm"]).show(["search","time","chargeStatus"]);
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
										url:"api/deposit/accountConfirm",
										data:{
											pkDeposit:widget.get("form").getValue("pkDeposit"),
											pkUser:activeUser.pkUser,
											version:widget.get("form").getValue("version")
										},
										dataType:"json",
										success:function(data){
											widget.show(".J-grid").hide(".J-form");
											widget.get("subnav").hide(["return","confirm"]).show(["search","time","chargeStatus"]);
											widget.get("grid").refresh({
												pkDeposit:data.pkDeposit,
												fetchProperties : "*,mobilePhone,confirmTime,confirm.name,customer.name,customer.pkCustomer,customer.phoneNumber,paymentWay.*,dataSource.*,name,phoneNumber,description,room.number,room.pkRoom,type.name,type.pkRoomType,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser,operator.name,version"
											});
											widget.get("subnav").setValue("chargeStatus","Receiving");
										}
									});
									
								}
							});
						}
					}],
					time:{
						click:function(time){
							widget.get("grid").refresh();
						}
					},
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
						fetchProperties : "*,mobilePhone,confirmTime,confirm.name,customer.name,customer.pkCustomer," +
						"customer.phoneNumber,paymentWay.*,dataSource.*,name,phoneNumber,description,room.number," +
						"room.pkRoom,type.name,type.pkRoomType,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser,operator.name,version"
					};
				},
				model : {
					columns : [{
						key : "name",
						name : "交款人"
					},{
						key:"phoneNumber", 
						name:"联系电话"
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
						key : "operate",
						name : "操作",
						format:function(row,value){
							if(value.chargeStatus.key=="Receiving"){
								var ret1 = "<pre>"+"<a style='margin-left:5px;color:white;background:#f34541' class='J-receiving btn btn-xs ' href='javascript:void(0);''>明细</a>";
								if(value.room!=null){
									ret1+="<a style='margin-left:5px;color:white;background:#f34541' class='J-roomquery btn btn-xs ' href='javascript:void(0);''>预约房间查询</a>"; 
								}
								ret1+="</pre>";
								return ret1; 
							}else if(value.chargeStatus.key=="Refund"){
								return "已退款";
							}else if(value.chargeStatus.key=="RefundReceiving"){
								return "退款已到账";
							}else if(value.chargeStatus.key=="Charged"){
								var ret1 = "<pre>"+"<a style='margin-left:5px;color:white;background:#f34541' class='J-charged btn btn-xs ' href='javascript:void(0);''>确认</a>"+
								"<a style='margin-left:5px;color:white;background:#f34541' class='J-receiving btn btn-xs ' href='javascript:void(0);''>明细</a>";
								ret1+="</pre>";
								return ret1;
							}else{
								return "";
							}
						},
					}]
				}
			});
			this.set("grid",grid);
			
			var form=new Form({
				show:false,
				parentNode:".J-form",
				model : {
					id : "depositarrivalconfirm",
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
						type:"text"	
					},{
						name:"type.name",
						label:"房型",
						type:"text"
					},{
						name:"realDeposit",
						label: i18ns.get("charge_deposit_depmoney","预约")+"金额(元)",
						type:"text"
					},{
						name:"paymentWay.value",
						label:"付款方式",
						type:"text"
					},{
						name:"chargeStatus",
						label:"收款状态",
						type:"select",
						options:[{
							key:"Charged",
							value:"已收费"  
						},{
							key:"Receiving",
							value:"已到账"  
						}]
					},{
						name:"chargeTime",
						label:"收款时间",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"description",
						label:"备注",
						type:"text"
					},{
						name:"operator.name",
						label:"经手人",
						type:"text"
					},{
						name:"confirmTime",
						label:"确认时间",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"confirm.name",
						label:"确认人",
						type:"text"
					}]
				}
			});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			if(params&&params.depositarrivalconfirm){
				widget.get("grid").refresh({
					pkDeposit:params.depositarrivalconfirm,
					fetchProperties : "*,mobilePhone,confirmTime,confirm.name,customer.name,customer.pkCustomer,customer.phoneNumber,paymentWay.*,dataSource.*,name,phoneNumber,description,room.number,room.pkRoom,type.name,type.pkRoomType,chargeStatus.*,pkDeposit,realDeposit,chargeTime,operator.pkUser,operator.name,version"
				});
			}
		}
	});
	module.exports = depositarrivalconfirm;
});