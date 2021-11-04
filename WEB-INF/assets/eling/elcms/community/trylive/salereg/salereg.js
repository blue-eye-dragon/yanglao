define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form")
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var loginUser = store.get("user");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"; 
	
	var TryLiveSalereg = ELView.extend({
		_setDefaultValue:function(widget){
			var form = widget.get("form");
			form.reset();
			var intention={key:"Like",value:"感兴趣"};			
			form.setValue("intention", intention);
			
			var userSelect = form.getData("operator","");
			var flag = false;
			for(var  i =  0 ; i<userSelect.length;i++ ){
				if(userSelect[i].pkUser == loginUser.pkUser){
					flag= true;
					break;
				}
			}
			if(flag){
				form.setValue("operator",loginUser.pkUser);
				
			}else{
				form.setValue("operator","");
			}
		},
		events:{
			"change .J-form-salereg-select-tryLiveBatch":function(e){
				var card=this.get("form");
				var pk=this.get("form").getValue("tryLiveBatch");
				if(pk){
					aw.ajax({
						url : "api/trylivebatch/query",
						type : "POST",
						data : {
							pkTryLiveBatch:pk,
							fetchProperties:"*,tryLiveProduct.*,tryLiveProduct.cardType.*"
						},
						success:function(data){	
							card.setValue("remindDate",data[0].tryLiveDate + (data[0].days +7) * 86400000);
						}
					});
				} else {
					widget._setDefaultValue(widget);
				}
			},			
			"change .J-form-salereg-select-customers":function(e){
				var card=this.get("form");
				var pkCustomer=$(e.target).find("option:selected").attr("value");
				if(!pkCustomer){
					widget._setDefaultValue(widget);
				}
			},			
			"change .J-form-salereg-select-pkMembershipCard":function(e){
				var card=this.get("form");
				var pkMembershipCard=$(e.target).find("option:selected").attr("value");
				if(pkMembershipCard){
					aw.ajax({
						url : "api/card/query",
						type : "POST",
						data : {
							pkMemberShipCards:pkMembershipCard,
							fetchProperties:"*,cardType.pkMemberShipCardType,cardType.name"
						},
						success : function(data){														
							card.setValue("cardTypeName",data[0].cardType.name);
						}	
					});					
				} else {
					widget._setDefaultValue(widget);
				}
			}
		},
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"体验销售登记",
					search:function(str) {
						widget.get("grid").loading();
						aw.ajax({
							url:"api/trylivesalereg/search",
							data:{
								s:str,
								properties:"tryLiveBatch.batchcode,tryLiveBatch.tryLiveProduct.name,pkMembershipCard.name,customer.name," +
								"customer.phoneNumber,customer.contactInfo,customer.intention,communicateContent",  
								fetchProperties:"*,tryLiveBatch.batchcode,tryLiveBatch.tryLiveProduct.name,pkMembershipCard.cardType.name,pkMembershipCard.name,customer.*"
							},
							dataType:"json",
							success:function(data){
								widget.get("grid").setData(data); 
								widget.show([".J-grid"]).hide([".J-form"]);
								widget.get("subnav").show(["add","search","time"]).hide(["return"]);
							}
						});
					},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").show(["add","search","time"]).hide(["return"]);
							return false;
						}
					},{
						id:"add",
						text:"新增",
						handler:function(){
							widget.show([".J-form"]).hide([".J-grid"]);
							widget.get("subnav").show(["return"]).hide(["add","search","time"]);
							widget.get("form").reset();
							form.show("customers");
							form.setDisabled("customers",false);
							widget.get("form").load("pkMembershipCard");
							widget.get("form").load("tryLiveBatch");

							widget._setDefaultValue(widget);
							return false;
						}
					}],
					time:{
						click:function(time){
							widget.get("grid").refresh();
						}
					}
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				url : "api/trylivesalereg/query",
				fetchProperties:"*,pkMembershipCard.cardType.name,tryLiveBatch.tryLiveProduct.*,tryLiveBatch.tryLiveProduct.cardType.name,pkMembershipCard.name,pkMembershipCard.version,customer.*,tryLiveBatch.batchcode",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						saleRegDate:time.start,
						saleRegDateEnd:time.end							
					};
				},
				model:{
					columns:[{
						key:"tryLiveBatch.batchcode",
						name:"批次号"
					},{
						key:"tryLiveBatch.tryLiveProduct.name",
						name:"体验产品"
					},{
						key:"pkMembershipCard.name",
						name:"体验"+i18ns.get("sale_ship_owner","会员")+i18ns.get("sale_card_name","卡号"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").show(["return"]).hide(["add","search","time"]);
								if(data.tryLiveBatch!=null){
									data.cardTypeName = data.pkMembershipCard.cardType.name;
								}
								//data.membershipCardName = data.pkMembershipCard.name;
								if(data.customer!=null){
									data.intention = data.customer.intention;	
								}
								form.hide("customers");
								form.setData(data);
								form.setValue("customer",data.customer.pkCustomer);
								form.setValue("customer.name",data.customer.name);
								if(data.mobilePhone!=null){
									form.setValue("customer.mobilePhone",data.customer.phoneNumber);
								}
								if(data.contactInfo!=null){
									form.setValue("customer.contactInfo",data.customer.mobilePhone);
								}
								var carddata=widget.get("form").getData("pkMembershipCard","");
								carddata.push(data.pkMembershipCard);
								widget.get("form").setData("pkMembershipCard",carddata);
								widget.get("form").setValue("pkMembershipCard",data.pkMembershipCard);
								
								var batchdata=widget.get("form").getData("tryLiveBatch","");
								batchdata.push(data.tryLiveBatch);
								widget.get("form").setData("tryLiveBatch",batchdata);
								widget.get("form").setValue("tryLiveBatch",data.tryLiveBatch);
								
								widget.get("form").setDisabled(true);
								return false;
							}
						}]
					},{
						key:"customer.name",
						name:"姓名"
					},{
						key:"customer.phoneNumber",
						name:"手机号"
					},{
						key:"customer.contactInfo",
						name:"联系方式"
					},{
						key:"customer.intention",
						name:"意向",
						format:function(value,row){
							return value ? value.value : "";
						}
					},{
						key:"saleRegDate",
						name:"登记日期",
						format:"date"
					},{
						key:"communicateContent",
						name:"沟通内容",						
					},{
						key:"remindDate",
						name:"回访提醒日期",
						format:"date"				
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").show(["return"]).hide(["add","search","time"]);
								if(data.tryLiveBatch!=null){
									data.cardTypeName = data.pkMembershipCard.cardType.name;
								}
								if(data.customer!=null){
									data.intention = data.customer.intention;
								}
								var form = widget.get("form");
								form.reset();
								form.hide("customers");
								form.setDisabled("customers",true);
								form.setData(data);
								form.setValue("customer",data.customer.pkCustomer);
								form.setValue("customer.name",data.customer.name);
								if(data.mobilePhone!=null){
									form.setValue("customer.mobilePhone",data.customer.phoneNumber);
								}
								if(data.contactInfo!=null){
									form.setValue("customer.contactInfo",data.customer.mobilePhone);
								}
								
								var batchdata=widget.get("form").getData("tryLiveBatch","");
								var flag = false;
								for(var  i =  0 ; i<batchdata.length;i++ ){
									if(batchdata[i].pkTryLiveBatch == data.tryLiveBatch.pkTryLiveBatch){
										flag= true;
										break;
									}
								}
								if(!flag){
									batchdata.push(data.tryLiveBatch);
									widget.get("form").setData("tryLiveBatch",batchdata);
									widget.get("form").setValue("tryLiveBatch",data.tryLiveBatch);
								}
								
								var carddata=widget.get("form").getData("pkMembershipCard","");
								carddata.push(data.pkMembershipCard);
								widget.get("form").setData("pkMembershipCard",carddata);
								widget.get("form").setValue("pkMembershipCard",data.pkMembershipCard);
								
								var userSelect=widget.get("form").getData("operator","");
								var flag = false;
								var userflag=false;
								for(var  i =  0 ; i<userSelect.length;i++ ){
									if(userSelect[i].pkUser == loginUser.pkUser){
										flag= true;
										break;
									}
								}
								if(flag){
									widget.get("form").setValue("operator",loginUser.pkUser);
								}else{
									for(var  i =  0 ; i<userSelect.length;i++ ){
										if(data.operator.pkUser==userSelect[i].pkUser){
											widget.get("form").setValue("operator",data.operator.pkUser);
											userflag=true;
											break;
										}
									}
									if(!userflag){
										widget.get("form").setValue("operator","");
									}
								}
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/trylivesalereg/" + data.pkTryLiveSaleReg + "/delete",function() {
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
				saveaction:function(){
					aw.saveOrUpdate("api/trylivesalereg/save",$("#salereg").serialize(),function(data){
						widget.hide([".J-form"]).show([".J-grid"]);
						widget.get("subnav").show(["add","search","time"]).hide(["return"]);
						widget.get("grid").refresh();
					});
				},
				//取消按钮
				cancelaction:function(){
					widget.hide(".J-form").show(".J-grid");
					widget.get("subnav").show(["add","search","time"]).hide(["return"]);
				},
				model:{
					id:"salereg",
					items:[{
						name:"pkTryLiveSaleReg",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"pkMembershipCard.version",
						type:"hidden"
					},{
						name:"pkMembershipCard",
						key:"pkMemberShipCard",
						value:"name",
						label:"体验"+i18ns.get("sale_ship_owner","会员")+i18ns.get("sale_card_name","卡号"),
						url:"api/card/query",
						params:{
							"cardType.isExperience":true,
							cardStatus:"Free",
							fetchProperties:"pkMemberShipCard,name"
						},
						type:"select",
						validate:["required"]
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
							fetchProperties:"mobilePhone,phoneNumber,contactInfo,intention,name,pkCustomer"
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
							form.setValue("customer",data.pkCustomer);
							form.setValue("customer.name",data.name);
							form.setValue("intention",data.intention);
							if(data.mobilePhone!=null){
								form.setValue("customer.mobilePhone",data.phoneNumber);
							}
							if(data.contactInfo!=null){
								form.setValue("customer.contactInfo",data.mobilePhone);
							}
						}
					},{
						name:"tryLiveBatch",
						key:"pkTryLiveBatch",
						label:"体验批次",
						url:"api/trylivebatch/querylist",
						params:{
							fetchProperties:"batchcode,pkTryLiveBatch,tryLiveProduct.name"
						},
						type:"select",
						format:function(data,value){
							var result = "";
							if(data.tryLiveProduct.name!=null){
								result += data.tryLiveProduct.name+" ";
							}
							result += data.batchcode;
							return result;
						},
						validate:["required"]
					},{
						name:"cardTypeName",
						label:"体验"+i18ns.get("sale_shipfees_contract","卡")+"类型",
						readonly:true,
						validate:["required"]
					},{
						name:"customer.name",
						label:"姓名",
						readonly:true,
						validate:["required"]
					},{
						name:"customer.mobilePhone",
						label:"手机号",
						readonly:true
					},{
						name:"customer.contactInfo",
						label:"联系方式",
						readonly:true
					},{
						name:"intention",
						label:"意向",					
						type:"select",
						options:[{
							key:"Dislike",
							value:"不感兴趣"
						},{
							key:"General",
							value:"一般"
						},{
							key:"Like",
							value:"感兴趣"
						},{
							key:"Hopebuy",
							value:"希望购买"
						}],
						validate:["required"]
					},{
						name:"communicateContent",
						label:"沟通内容",
						type:"textarea",
						height:120
					},{
						name:"remindDate",
						label:"回访提醒时间",
						type:"date"				
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					},{
						name:"saleRegDate",
						label:"登记日期",
						type:"date",
						defaultValue:moment().valueOf()
					},{
						name:"operator",
						label:"经手人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/user/role",//TODO 用户角色：wulina 销售
						params:{
							roleIn:"3,17",
							fetchProperties:"pkUser,name"
						},
						multi:false,
						validate:["required"]
					}]
				}
			});
			this.set("form",form);
		}
	});
	module.exports = TryLiveSalereg;
});