define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Form=require("form");
	var enums = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	require("../../grid_css.css");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-printGrid hidden'></div>"+
	"<div class='J-form hidden' ></div>";
	var generalservicepackagededuction = ELView.extend({
		attrs:{
            template:template
		},
		events : {
			"change .J-form-generalserviceDeductionform-select-member" : function(e){
				var form = this.get("form");
				var curmember = form.getValue("member");
				var memberdata = form.getData("member");
				for(var i in memberdata){
					if(memberdata[i].member.pkMember == curmember){
						form.setData("generalServicePackage",memberdata[i].chargeList);
						break;
					}
				}
			},
			"change .J-form-generalserviceDeductionform-select-generalServicePackage" : function(e){
				var form = this.get("form");
				var  pkMemberServicePackage= form.getValue("generalServicePackage");
				var packageData = form.getData("generalServicePackage");
				var pkServicePackage;
				for(var i in packageData){
					if(packageData[i].memberServicePackage.pkMemberServicePackage == pkMemberServicePackage){
						form.setValue("generalCharges",packageData[i].pkGeneralServiceCharge);
						pkServicePackage = packageData[i].memberServicePackage.generalServicePackage.pkGeneralServicePackage;
						break;
					}
				}
				aw.ajax({
					url:"api/generalServicePackageItem/query",
					data:{
						servicePackage :pkServicePackage,
						fetchProperties:"pkGeneralServicePackageItem," +
								"servicePackage.pkGeneralServicePackage," +
								"servicePackage.name," +
								"serviceItem.pkGeneralServiceItem," +
								"serviceItem.name," +
								"count,cycle,version" 
					},
					dataType:"json",
					success:function(data){
						for(var i in data){
							data[i].pkMemberServicePackage = pkMemberServicePackage;
						}
						form.setData("serviceItem",data);
						form.setValue("serviceItem","");
					}
				});
				
			},
			"change .J-form-generalserviceDeductionform-select-serviceItem": function(e){
				var form = this.get("form");
				var itemData = form.getData("serviceItem");
				var pkServiceItem = form.getValue("serviceItem");
				var pkMemberServicePackage ;
				for(var i in itemData){
					if(itemData[i].serviceItem.pkGeneralServiceItem == pkServiceItem){
						pkMemberServicePackage = itemData[i].pkMemberServicePackage;
						break;
					}
				}
				aw.ajax({
					url:"api/report/memberpackagecondition",
					data:{
						"pkServiceItem" : pkServiceItem,
						"pkMemberServicePackage" : pkMemberServicePackage,
						fetchProperties:"*," +
										"name,"+
										"numberName,effectiveDate,expiryDate,packageName," +
										"surplusList.itemName," +
										"surplusList.count," +
										"surplusList.surplus," +
										"surplusList.unit",
					},
					dataType:"json",
					success:function(data){
						form.setValue("surplus",data[0].surplusList[0].surplus);
					}
				});
			},
			"click .J-theme-detail" : function(e){
				var index = this.get("grid").getIndex(e.target);
				var data = this.get("grid").getData(index);
				var form = this.get("form");
				form.reset();
				form.setData(data);
				form.setValue("member",data.generalCharges);
				form.setValue("generalServicePackage",data.generalCharges);
				form.setValue("serviceItem",data);
				form.setValue("generalCharges",data.generalCharges.pkGeneralServiceCharge);
				form.setDisabled(true);
				this.get("subnav").show(["return"]).hide(["add","search","date","building","print"]);
				this.show([".J-form"]).hide(".J-grid");
			}
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"服务套餐抵扣",
					items:[{
						id:"search",
						type:"search",
						placeholder : "搜索",
						handler : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/generalServicePackageDeduction/search",
								data:{
									s:str,
									searchProperties:"generalCharges.member.personalInfo.name," +
											"generalCharges.member.memberSigning.room.number," +
											"generalCharges.paymentName," +
											"generalCharges.number," +
											"generalCharges.telephone," +
											"user.name,serviceItem.name",
									fetchProperties: "generalCharges.member.pkMember,"+
													 "generalCharges.member.personalInfo.name,"+
													 "generalCharges.member.memberSigning.room.number,"+
													 "generalCharges.paymentName,"+
													 "number,"+
													 "generalCharges.telephone," +
													 "generalCharges.serviceType," +
													 "generalCharges.memberServicePackage.expiryDate,"+
													 "generalCharges.memberServicePackage.generalServicePackage.pkGeneralServicePackage," +
													 "generalCharges.memberServicePackage.generalServicePackage.name," +
													 "serviceItem.pkGeneralServiceItem," +
													 "serviceItem.name," +
													 "description,"+
													 "date,"+
													 "user.pkUser,"+
													 "user.name,"+
													 "pkGeneralServicePackageDeduction,"+
													 "version",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						},
					},{
   						id:"building",
   						tip:"楼宇",
   						type:"buttongroup",
   						keyField : "pkBuilding",
						valueField : "name",
						url : "api/building/query",
						params : function(){
							return {
								"useType":"Apartment",
								fecthProperties:"pkBuilding,name"
							};
						},
   						showAll:true,
   						showAllFirst:true,
   						handler:function(key,element){
   							widget.get("grid").refresh();
   							subnav.setValue("search","");
   						}
   					},{
						id : "date",
						type : "daterange",
						ranges : {
							"本年": [moment().startOf("year"), moment().endOf("year")],
   					 		"去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
   							"前年": [moment().subtract(2,"year").startOf("year"),moment().subtract(2,"year").endOf("year")],
						},
						defaultRange : "本年",
						handler : function(time){
							widget.get("grid").refresh();
							subnav.setValue("search","");
						},
						tip : "抵扣日期"
					},{
   						id:"add",
   						type:"button",
						text:"新增",
						show:true,
						handler:function(){
							subnav.setValue("search","");
							var forms = widget.get("form");
							forms.reset();
							form.load("user",{
								params:{
									fetchProperties:"pkUser,name"
								},
								callback:function(data){
									//当前用户是管理员时，让user可用
									var userSelect=form.getData("user","");
								//	userSelect.push(activeUser);
									var flag = false;
									for(var  i =  0 ; i<userSelect.length;i++ ){
										if(userSelect[i].pkUser == activeUser.pkUser){
											flag= true;
											break;
										}
									}
									if(flag){
										form.setValue("user",activeUser.pkUser);
									}
									var user=form.getData("user","");
									user.push(activeUser);
									form.setData("user",user);
									form.setValue("user",activeUser);
								}
							});
							widget.get("subnav").show(["return"]).hide(["add","search","date","building","print"]);
							widget.show([".J-form"]).hide(".J-grid");
						}
   					},{
   						id:"print",
						type:"button",
						text:"打印",
						handler:function(index,data,rowEL){
							$(".J-grid").addClass("hidden");
							$(".J-grid-title").removeClass("hidden");
							$(".J-printGrid").removeClass("hidden");
							var time = widget.get("subnav").getValue("date");
							var build=widget.get("subnav").getText("building");
							var title = moment(time.start).format("YYYY-MM-DD")+"至"+moment(time.end).format("YYYY-MM-DD")+"    楼宇:"+build+"";
							$(".J-grid-title").text(title);
							widget.get("subnav").hide(["add","search","date","building","print"]);
							var data=widget.get("grid").getData();
							widget.get("printGrid").setData(data);
							window.print();
							$(".J-grid-title").addClass("hidden");
							$(".J-printGrid").addClass("hidden");
							$(".J-grid").removeClass("hidden");
							widget.get("subnav").show(["add","search","date","building","print"]);
						
						}
					},{
   						id:"return",
   						type:"button",
   						text:"返回",
   						show:false,
   						handler:function(){
   							widget.get("subnav").hide(["return"]).show(["add","search","date","building","print"]);
							widget.hide([".J-form"]).show(".J-grid");
   						}
					}]
				}
				
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				model:{
					url:"api/generalServicePackageDeduction/query",
					params:function(){
					var subnav=widget.get("subnav");
					return {
						"generalCharges.member.memberSigning.room.building":subnav.getValue("building"),
						"date":subnav.getValue("date").start,
						"dateEnd":subnav.getValue("date").end,
						fetchProperties: "generalCharges.member.pkMember,"+
										 "generalCharges.member.personalInfo.name,"+
										 "generalCharges.member.memberSigning.room.number,"+
										 "generalCharges.paymentName,"+
										 "number," +
										 "generalCharges.pkGeneralServiceCharge,"+
										 "generalCharges.telephone," +
										 "generalCharges.serviceType," +
										 "generalCharges.memberServicePackage.pkMemberServicePackage," +
										 "generalCharges.memberServicePackage.expiryDate,"+
										 "generalCharges.memberServicePackage.generalServicePackage.pkGeneralServicePackage," +
										 "generalCharges.memberServicePackage.generalServicePackage.name," +
										 "serviceItem.pkGeneralServiceItem," +
										 "serviceItem.name," +
										 "description,"+
										 "date,"+
										 "user.pkUser,"+
										 "user.name,"+
										 "pkGeneralServicePackageDeduction,"+
										 "version",
					};
				},
				
					columns:[{
						key:"generalCharges",
						name:i18ns.get("sale_ship_owner","会员")+"姓名",
						className:"oneColumn",
						format:function(value,data){
							if(value){
								return '<a class="J-theme-detail" style="color:#f34541;" href="javascript:void(0);">'+
								value.member.memberSigning.room.number+" "+value.member.personalInfo.name+'</a>';
							}
                        },
					},{
						key:"generalCharges.paymentName",
						name:"付款人",
						className:"oneColumn",
					},{
						key:"generalCharges.telephone",
						name:"付款人联系电话",
						className:"oneColumn",
					},{
						key:"generalCharges.memberServicePackage.generalServicePackage.name",
						name:"服务套餐",
						className:"oneColumn",
					},{
						key:"serviceItem.name",
						name:"服务项目",
						className:"oneColumn",
					},{
						key:"number",
						name:"抵扣次数",
						className:"oneColumn",
					},{
						key:"date",
						name:"抵扣日期",
						className:"oneColumn",
						format:"date",
						formatparams :{
							mode : "YYYY-MM-DD",
						}
					},{
						key:"user.name",
						name:"记录人",
						className:"oneColumn",
					},{
						key : "operate",
                        name : "操作",
                        className:"oneColumn",
                        format:"button",
                        formatparams : [{
                            id : "edit",
                            icon : "icon-edit",
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								aw.ajax({
									url:"api/report/memberpackagecondition",
									data:{
										"pkServiceItem" : data.serviceItem.pkGeneralServiceItem,
										"pkMemberServicePackage" : data.generalCharges.memberServicePackage.pkMemberServicePackage,
										fetchProperties:"*," +
														"name,"+
														"numberName,effectiveDate,expiryDate,packageName," +
														"surplusList.itemName," +
														"surplusList.count," +
														"surplusList.surplus," +
														"surplusList.unit",
									},
									dataType:"json",
									success:function(datas){
										form.reset();
										form.setData(data);
										form.setValue("member",data.generalCharges);
										form.setValue("generalServicePackage",data.generalCharges);
										form.setValue("serviceItem",data);
										form.setValue("generalCharges",data.generalCharges.pkGeneralServiceCharge);
										form.setValue("surplus",datas[0].surplusList[0].surplus);
										widget.get("subnav").show(["return"]).hide(["add","search","building","print","date"]);
										widget.show(".J-form").hide(".J-grid");
										
									}
								});
							}
						},{
							 id : "delete",
							 icon:"icon-remove",
							 handler:function(index,data,rowEle){
								aw.del("api/generalServicePackageDeduction/" + data.pkGeneralServicePackageDeduction + "/delete",function(){
									widget.get("grid").refresh();
								});
						 	}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var printGrid=new Grid({
				parentNode:".J-printGrid",
				model:{
					isInitPageBar:false,
					columns:[{
						key:"generalCharges",
						name:i18ns.get("sale_ship_owner","会员")+"姓名",
						className:"oneColumn",
						format:function(value,data){
							if(value){
								return '<a class="J-theme-detail" style="color:#f34541;" href="javascript:void(0);">'+
								value.member.memberSigning.room.number+" "+value.member.personalInfo.name+'</a>';
							}
	                    },
					},{
						key:"generalCharges.paymentName",
						name:"付款人",
						className:"oneColumn",
					},{
						key:"generalCharges.telephone",
						name:"付款人联系电话",
						className:"oneColumn",
					},{
						key:"generalCharges.memberServicePackage.generalServicePackage.name",
						name:"服务套餐",
						className:"oneColumn",
					},{
						key:"serviceItem.name",
						name:"服务项目",
						className:"oneColumn",
					},{
						key:"number",
						name:"抵扣次数",
						className:"oneColumn",
					},{
						key:"date",
						name:"抵扣日期",
						className:"oneColumn",
						format:"date",
						formatparams :{
							mode : "YYYY-MM-DD",
						}
					},{
						key:"user.name",
						name:"记录人",
						className:"oneColumn",
					}]
				}
			});
			this.set("printGrid",printGrid);
			
			var form = new Form({
				parentNode:".J-form",
				saveaction:function(){
					var form = widget.get("form");
					var formdata = form.getData();
					if(!formdata.pkGeneralServicePackageDeduction){//新增
						if(parseInt(formdata.number)>parseInt(formdata.surplus)){
							Dialog.alert({
								content : "抵扣次数不能大于剩余次数，剩余次数为"+formdata.surplus,
							});
							return;
						}else{
							aw.saveOrUpdate("api/generalServicePackageDeduction/save",aw.customParam(form.getData()),function(data){
								widget.show([".J-grid"]).hide([".J-form"]);
								widget.get("subnav").hide(["return"]).show(["add","search","date","building","print"]);
								widget.get("grid").refresh();
							});
						}
					}else{//修改
						aw.ajax({
							url:"api/generalServicePackageDeduction/query",
							data:{
								pkGeneralServicePackageDeduction :formdata.pkGeneralServicePackageDeduction,
								fetchProperties:"generalCharges.pkGeneralServiceCharge,"+
								 "serviceItem.pkGeneralServiceItem," +
								 "number", 
							},
							dataType:"json",
							success:function(data){
									if(data[0].generalCharges.pkGeneralServiceCharge==formdata.generalCharges &&
											parseInt(formdata.number)>(parseInt(formdata.surplus)+parseInt(data[0].number))){
										Dialog.alert({
											content : "抵扣次数不能大于剩余次数，剩余次数为"+(parseInt(formdata.surplus)+parseInt(data[0].number)),
										});
										return;
									}else{
									aw.saveOrUpdate("api/generalServicePackageDeduction/save",aw.customParam(form.getData()),function(data){
										widget.show([".J-grid"]).hide([".J-form"]);
										widget.get("subnav").hide(["return"]).show(["add","search","date","building","print"]);
										widget.get("grid").refresh();
									});
								}
							}
						});
					}
					
				},
				cancelaction:function(){
					widget.get("subnav").hide(["return"]).show(["add","search","date","building","print"]);
					widget.hide(".J-form").show(".J-grid");
				},
				model:{
					id:"generalserviceDeductionform",
					items:[{
						name:"pkGeneralServicePackageDeduction",
						type:"hidden",
					},{
						name:"version",
						type:"hidden",
						defaultValue:0
					},{
						name:"generalCharges",
						type:"hidden"
					},{
						name:"surplus",
						type:"hidden"
					},{
						name:"member",
    					label:i18ns.get("sale_ship_owner","会员"),
    					type:"select",
    					url : "api/generalservicecharge/querychargemember",
    					keyField:"member.pkMember",
    					valueFiled:"member.personalInfo.name",
    					params : function(){
                            return {
                            	"chargeStatus":"Charge",
                            	"serviceType":"ServicePackage",
                            	fetchProperties:"member.pkMember,member.personalInfo.name," +
                            			"member.memberSigning.room.number," +
                            			"chargeList.pkGeneralServiceCharge," +
                            			"chargeList.memberServicePackage," +
                            			"chargeList.memberServicePackage.pkMemberServicePackage," +
                            			"chargeList.memberServicePackage.effectiveDate," +
                            			"chargeList.memberServicePackage.expiryDate," +
                            			"chargeList.memberServicePackage.generalServicePackage.pkGeneralServicePackage," +
                            			"chargeList.memberServicePackage.generalServicePackage.name",
                            };
                        },
                        format:function(data,value){
                        	return data.member.memberSigning.room.number+" "+data.member.personalInfo.name;
                        },
                        validate:["required"],
					},{
						name:"generalServicePackage",
						label:"服务套餐",
						type:"select",
    					keyField:"memberServicePackage.pkMemberServicePackage",
    					valueFiled:"memberServicePackage.generalServicePackage.name",
    					format:function(data){
                    		return data.memberServicePackage.generalServicePackage.name;
                        },
                        validate:["required"],
					},{
						name:"serviceItem",
						label:"服务项目",
						type:"select",
    					keyField:"serviceItem.pkGeneralServiceItem",
    					valueFiled:"serviceItem.name",
    					format:function(data){
                    		return data.serviceItem.name;
                        },
                        validate:["required"],
					},{
						name:"number",
    					label:"抵扣次数",
    					defaultValue:0,
						validate : ["required","number"],
					},{
						name:"date",
    					label:"抵扣日期",
    					type : "date",
    					mode : "YYYY-MM-DD",
    					defaultValue:moment().valueOf(),
    					validate:["required"],
					},{
						name:"user",
						label:"记录人",
						type:"select",
						key:"pkUser",
						url:"api/users",//TODO 用户角色：wulina
						params:{
							fetchProperties:"pkUser,name"
						},
						value:"name",
						validate:["required"],
					},{
						name:"description",
    					type : "textarea",
    					label:"备注",
    					exValidate: function(value){
							if(value.length>510){
								return "不能超过500个字符";
							}else{
								return true;
							}
						}
					}]
				}
			});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			
		}
	});
	module.exports = generalservicepackagededuction;
})