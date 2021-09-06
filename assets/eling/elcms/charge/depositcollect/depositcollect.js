/**
 * 预约金收取
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form")
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var Properties=require("./properties");
	var activeUser = store.get("user");
	var gridData;
	var Button = require("button");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"; 
	
	var customer;
	var depositcollect = ELView.extend({ 
		events : {
			"click .J-detail" : function(e){
				var pkDeposit=$(e.target).attr("data-key");
				var form = this.get("form");
				var gridData = this.get("grid").getData();
				var data;
				for(var i=0;i<gridData.length;i++){
					if(gridData[i].pkDeposit==pkDeposit){
						data=gridData[i];
					}
				}
				form.reset();
				form.setValue("name",data.name);
				form.setValue("phoneNumber",data.phoneNumber);
				if(data.room!=null){
					form.setValue("room",data.room);
				}
				if(data.type!=null){
					form.setValue("type",data.type);
				}
				form.setValue("realDeposit",data.realDeposit);
				form.setValue("paymentWay",data.paymentWay);
				form.setValue("chargeStatus",data.chargeStatus);
				form.setValue("chargeTime",data.chargeTime);
				form.setValue("description",data.description);
				if(data.operator!=null){
					form.setValue("operator",data.operator);
				}
				form.setDisabled(true);
				form.hide("customers");
				this.show([".J-form"]).hide([".J-grid"]);
				this.get("subnav").hide(["add","search","chargeStatus","time"]).show(["return"]);
				this.hide([".J-grid"]).show([".J-form"]);
			},
			"change .J-form-depositcollect-select-customer ":function(e){
				var form=this.get("form");
				var  pkType =form.getValue("customer");
				var dataType = form.getData("customer",{
					pk:pkType
				});
				if(pkType==""){
					form.setValue("name","");
					form.setValue("phoneNumber","");
					form.setReadonly("phoneNumber",false);
					form.setReadonly("name",false);
				}else{
					form.setValue("name",dataType.name);
					form.setValue("phoneNumber",dataType.phoneNumber);
					form.setReadonly("name",true);
					form.setReadonly("phoneNumber",true);
				}
			},
			"change .J-form-depositcollect-select-room ":function(e){
				var form=this.get("form");
				var  pkType =form.getValue("room");
				var dataType = form.getData("room",{
					pk:pkType
				});
				if(dataType==null){
					form.setValue("type",gridData.room.type.pkRoomType);
					form.setReadonly("type",true);
				}else{
					if(pkType==""){
						form.setReadonly("type",false);
						form.setValue("type","");
					}else{
						for(var i=0; i<dataType.length;i++){
							if(dataType[i].pkRoom == pkType){
								form.setValue("type",dataType[i].type.pkRoomType);
								form.setReadonly("type",true);
								break;
							}
						}
						
					}
				}
			},
		},
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model : {
//					各环境对于标题显示有所区别,将其抽取到properties中进行判断
					title : Properties.customize_title(widget),
//					title : "预约金收取",
					search : function(str) {
						var g = widget.get("grid");
						aw.ajax({
							url : "api/deposit/search",
							data : {
								s : str, 
								properties : "name,contactphone,mobilePhone,phoneNumber,room.number,type.name,depositRefundApply.refunedConfirm",
								fetchProperties : "*,room.pkRoom,room.number,room.type.pkRoomType,type.name,type.pkRoomType," +
								"customer.name,customer.mobilePhone,customer.pkCustomer,customer.phoneNumber," +
								"paymentWay.*,dataSource.*,chargeStatus.*,operator.pkUser,operator.name," +
								"depositRefundApply.pkDepositRefundApply,depositRefundApply.refunedConfirm," +
								"depositRefundApply.refundRealAmount"
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
							key:"UnCharge",
							value:"未收款"
						},{
							key:"Receiving",
							value:"已到账"
						},{
							key:"UnCharge,Charged,Receiving",
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
					buttons:[{
						id:"add",
						text:"新增",
						show:true,
						handler:function(){
							var form=widget.get("form");
							form.reset();
							form.show("customers");
							form.setReadonly("phoneNumber",true);
							form.setReadonly("name",true);
							var userSelect=form.getData("operator","");
							userSelect.push(activeUser);
							form.setData("operator",userSelect);
							form.setValue("operator",activeUser);
							form.setReadonly("operator",true);

							widget.show([".J-form"]).hide([".J-grid"]);
							widget.get("subnav").hide(["add","search","chargeStatus","time"]).show(["return"]);
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["add","time","search","chargeStatus"]);
						}
					}],
					time:{
						tip:"收款日期",
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
				autoRender:false,
				params : function() {
					var subnav = widget.get("subnav");
					return {
						"chargeStatusIn" : subnav.getValue("chargeStatus"),
						"chargeTime":widget.get("subnav").getValue("time").start,
						"chargeTimeEnd":widget.get("subnav").getValue("time").end,
						fetchProperties : "*,room.pkRoom,room.number,room.type.pkRoomType,type.name,type.pkRoomType," +
						"customer.name,customer.mobilePhone,customer.pkCustomer,customer.phoneNumber," +
						"customer.status," +
						"paymentWay.*,dataSource.*,chargeStatus.*,operator.pkUser,operator.name," +
						"depositRefundApply.pkDepositRefundApply,depositRefundApply.refunedConfirm," +
						"depositRefundApply.refundRealAmount"
					};
				},
				model : {
					columns : [{
						key : "customer.name",
						name : "交款人",
						format:function(value,row){
							if(row.customer){
								return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+row.pkDeposit+"'>"+value+"</a>";
							}else{
								return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+row.pkDeposit+"'>"+row.name+"</a>";
							}
							
						}
					},{
						key:"customer.phoneNumber",
						name:"联系电话",
						format:function(value,row){
							if(row.customer){
								return value != null ? value : "";
							}else{
								return row.phoneNumber != null ? row.phoneNumber : "";
							}
						}
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
						key:"type.name",
						name:"房型"
					},{
						key:"room.number",
						name:"房间号"
					},{
						key:"chargeStatus.value",
						name:"收款状态",
					},{
						key:"operator.name",
						name:"经手人"
					},{
						key:"depositRefundApply.refunedConfirm",
						name:"是否退费",
						className:"text-right",
						format:function(value,row){
							if(row.depositRefundApply){
								if(row.depositRefundApply.refunedConfirm){
									return  "是";
								}
							}
							return "否"
						}
					} ,{
						key:"depositRefundApply.refundRealAmount",
						name:"退费金额",
						format:function (value,row){
							if(row.depositRefundApply){
								return row.depositRefundApply.refundRealAmount!=null?row.depositRefundApply.refundRealAmount : 0;
							}else{
								return 0;
							}
						}
					},{
						key : "operate",
						name : "操作",
						format :function(value,row){
							if(row.chargeStatus.key=="UnCharge" || row.chargeStatus.key=="Charged"){
								return "button";
							}else{
								return "";
							}   
						},
						formatparams : [{
							key:"edit",
							icon:"edit",
							handler : function(index,data, rowEle) {
								customer = data.customer;
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").hide(["add","search","chargeStatus","time"]);
								var form = widget.get("form");
								form.reset();
                                if(data.chargeStatus.key=="Charged"){
                                form.setDisabled("room",true);
                                form.setDisabled("type",true);
                                form.setDisabled("paymentWay",true);
                                form.setDisabled("chargeStatus",true);
                                form.setDisabled("chargeTime",true);             
								}
								form.hide("customers");
								form.setDisabled("customers",true);
								form.setValue("pkDeposit",data.pkDeposit);
								form.setValue("version",data.version);
								form.setValue("customer",data.customer.pkCustomer);
								form.setValue("name",data.customer.name);
								form.setValue("phoneNumber",data.customer.phoneNumber);
								if(data.room!=null){
									form.setValue("room",data.room);
								}
								if(data.type!=null){
									form.setValue("type",data.type);
								}
								form.setValue("realDeposit",data.realDeposit);
								form.setValue("paymentWay",data.paymentWay);
								form.setValue("chargeStatus",data.chargeStatus);
								form.setValue("chargeTime",data.chargeTime);
								form.setValue("operator",data.operator);
								form.setValue("description",data.description);
								form.setDisabled("operator",true);
							}
						},{
							key:"delete",
							icon:"remove",
							show : function(value, row) {
  	                		   if (row.chargeStatus.key == 'Charged') {
  	                			 return false; 
  	                		   } else {
  	                			 return true;
  	                		   }
  	                	   },
							handler:function(index,data,rowEle){
								aw.del("api/deposit/" + data.pkDeposit + "/delete",function() {
									widget.get("grid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form=new Form({
				show:false,
				parentNode:".J-form",
				saveaction : function() {
					var formdata = form.getData();
					var chargeStatus=form.getValue("chargeStatus");
					var chargeTime=form.getValue("chargeTime");
					var currentTime=moment();
					if(chargeStatus=="Charged"&&chargeTime>currentTime){
						Dialog.alert({
							content : "收款日期不能大于当前日期!"
						});
						return false;
					}
					if(isNaN(form.getValue("realDeposit"))){
						Dialog.alert({
							content : "请输入有效的"+i18ns.get("charge_deposit_depmoney","预约金")+"!"
						});
						return false;
					}
					if((form.getValue("realDeposit")<=0)){
						Dialog.alert({
							content : i18ns.get("charge_deposit_depmoney","预约金"+"不能为0或负数")+"!"
						});	
						return false;
					}
					var param = $("#depositcollect").serialize();
					
					if(formdata.pkDeposit!="" || customer.status.value=="已交预约金"){
						param+="&updatetype=chargedupdate";
					}
					aw.saveOrUpdate("api/deposit/savedeposit",param,function(data){
						widget.hide([".J-form"]).show([".J-grid"]);
						widget.get("subnav").show(["add","chargeStatus","search","time"]).hide(["return"]);
						widget.get("grid").refresh();
					});
				},
				//取消按钮
				cancelaction:function(){
					widget.hide(".J-form").show(".J-grid");
					widget.get("subnav").show(["add","search","chargeStatus","time"]).hide("return");
					return false;
				},
				model : {
					id : "depositcollect",
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
						name:"customer",
						type:"hidden",
					},{
						name:"customers",
						keyField:"pkCustomer",
						type:"autocomplete",
						queryParamName : "s",
						maxItemsToShow:15,
						useCache:false,
						label:"意向客户",
						url:"api/customer/autocompletequery",
						params:{
							statusIn:"Purpose,CheckOutCard",
							searchProperties:"mobilePhone,phoneNumber,name",
							fetchProperties:"mobilePhone,phoneNumber,name,pkCustomer,status"
						},
						format : function(data,value){
							var result = "";
							if(data.mobilePhone!=null){
								result += data.mobilePhone+" ";
							}
							if(data.phoneNumber!=null){
								result += data.phoneNumber+" ";
							}
							result += data.name;
							return result;
						},
						onItemSelect : function(data){//TODO autocomplete
							var form=widget.get("form");
							form.setValue("name",data.name);
							form.setValue("customer",data.pkCustomer);
							if(data.phoneNumber!=null){
								form.setValue("phoneNumber",data.phoneNumber);
							}
							customer = data;
						}
					},{
						name:"name",
						label:"姓名",
						type:"text",
						readonly:true,
						validate : [ "required" ]
					},{
						name:"phoneNumber",
						label:"联系电话",
						type:"text",
						readonly:true,
					},{
						name:"room",
						label:"意向房间",
						keyField :"pkRoom",
						type:"select",
						url:"api/room/query",
						params:function(){
							return{
								"statusIn":"Empty",
								"useType":"Apartment",
								fetchProperties:"pkRoom,number,type.pkRoomType,status",
							};
						},
						valueField :"number",
						validate : [ "required" ]
					},{
						name:"type",
						label:"意向房型",
						type:"select",
						value:"name",
						key:"pkRoomType",
						url :"api/roomType/query"
					},{
						name:"realDeposit",
						label:i18ns.get("charge_deposit_depmoney","预约金")+"(元)",
						type:"text",
						validate : [ "required" ]
					},{
						name:"paymentWay",
						label:"付款方式",
						type:"select",
						url:"api/enum/com.eling.elcms.charge.model.Deposit.PaymentWay",
						defaultValue:"Cash",
						validate:["required"]
					},{
						name:"chargeStatus",
						label:"收款状态",
						type:"select",
						options:[{
							key:"UnCharge",
							value:"未收费"
						},{
							key:"Charged",
							value:"已收费"
						}],
						defaultValue:"Charged",
						validate:["required"]
					},{
						name:"chargeTime",
						label:"收款日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					},{
						name:"operator",
						label:"经手人",
						type:"select",
						key:"pkUser",
						url:"api/users",//TODO 用户角色：wulina
						params:{
							fetchProperties:"pkUser,name"
						},
        				lazy:true,
						value:"name",
						readonly:true,
						validate:["required"],
					}]
				}
			});
			this.set("form",form);
			if(params && params.customize  == "linxuan"){
				var addCustomers  = new Button({
					parentNode:".J-form-depositcollect-autocomplete-customers",
					model:{
						id:"addCustomers",
						text:"新增意向客户",
						style:"position: absolute;right: 16px;top: 1px;",
						handler : function(e){
							widget.openView({
								url : "eling/elcms/visittrack/visittrack/customertrace",
								params : {
									type:"VisitRecordTrack",
									back:"depositcollect"
								}
							});
						},
					}
				})
				this.set("addCustomers",addCustomers);
			}
		},
		afterInitComponent:function(params,widget){			
			if(params && params.room){
				widget.get("subnav").setTitle(params.title);
				var form=widget.get("form");
				form.reset();
				form.show("customers");
				widget.get("form").load("room",{
					callback:function(){
						form.setValue("room",params.room.pkRoom);
					}
				})
				widget.get("form").load("type",{
					callback:function(){
						form.setValue("type",params.room.type);
						form.setReadonly("type",true);
					}
				})
				form.setReadonly("phoneNumber",true);
				form.setReadonly("name",true);
				var userSelect=form.getData("operator","");
				userSelect.push(activeUser);
				widget.get("form").load("operator",{
					callback:function(){
						form.setValue("operator",activeUser);
						form.setReadonly("operator",true);
					}
				})
				widget.show([".J-form"]).hide([".J-grid"]);
				widget.get("subnav").hide(["add","search","chargeStatus","time"]).show(["return"]);
			} else if(params && params.back){
				customer = params.customer;
				var form=widget.get("form");
				form.reset();
				form.show("customers");
				form.setReadonly("phoneNumber",true);
				form.setReadonly("name",true);
				var userSelect=form.getData("operator","");
				userSelect.push(activeUser);
				form.setData("operator",userSelect);
				form.setValue("operator",activeUser);
				form.setReadonly("operator",true);
				form.setData("customers",params.customer);
				form.setValue("customer",params.customer.pkCustomer);
				form.setValue("name",params.customer.name);
				form.setValue("phoneNumber",params.customer.phoneNumber);
				

				widget.show([".J-form"]).hide([".J-grid"]);
				widget.get("subnav").hide(["add","search","chargeStatus","time"]).show(["return"]);
				
				
				
			}else {
				widget.get("grid").refresh();
			}
		}
	});
	module.exports = depositcollect;
});