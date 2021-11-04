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
	var generalcharges = ELView.extend({
		attrs:{
            template:template
		},
		events : {
			"change .J-form-generalchargesform-select-serviceType":function(e){
				var form=this.get("form");
				var  serviceType=form.getValue("serviceType");
				this.loadSelect(form,serviceType);
				
			},
			"change .J-form-generalchargesform-select-member" : function(e){
				var form = this.get("form");
				var member = form.getValue("member");
				
				var serviceType = form.getValue("serviceType");
				if(serviceType == "ServicePackage"){
					aw.ajax({
						url:"api/generalservicecharge/querypackage",
						data:{
							member :member,
							"generalServicePackage.state" : "Using",
							fetchProperties:"pkMemberServicePackage,description,price,version," +
									"generalServicePackage.pkGeneralServicePackage," +
									"generalServicePackage.name"
						},
						dataType:"json",
						success:function(data){
							for(var i in data){
								data[i].pk=data[i].pkMemberServicePackage;
								data[i].name = data[i].generalServicePackage.name;
							}
							form.setData("generalService",data);
							form.setValue("generalService","");
						}
					});
				}
				
			},
			"change .J-form-generalchargesform-select-generalService" : function(e){
				var form = this.get("form");

				var pk = form.getValue("generalService");
				var data = form.getData("generalService");
				for(var i in data)
				{
					if(pk ==data[i].pk)
						{
						form.setValue("number",data[i].price);
						return;
						}
				}
			
			},
			"click .J-theme-detail" : function(e){
				var index = this.get("grid").getIndex(e.target);
				var data = this.get("grid").getData(index);
				var form = this.get("form");
				form.setData(data);
				form.setDisabled(true);
				this.loadSelect(form,data.serviceType.key,data);
				this.get("subnav").show(["return"]).hide(["add","generalchargesSearch","date","building","print"]);
				this.show([".J-form"]).hide(".J-grid");
			}
		},
		loadSelect : function(form,serviceType,orgData){
			if(serviceType=="ServiceItem"){
				aw.ajax({
					url:"api/generalservicecharge/queryitem",
					data:{
						state : "Using",
						fetchProperties:"pkGeneralServicePrice," +
										"name," +
										"price,description," +
										"version," +
										"serviceType," +
										"generalServiceItem.pkGeneralServiceItem," +
										"generalServiceItem.name",
					},
					dataType:"json",
					success:function(data){
						for(var i in data){
							data[i].pk=data[i].generalServiceItem.pkGeneralServiceItem;
						}
						form.setData("generalService",data);
						form.setValue("generalService","");
						if(orgData){
							var item=orgData.generalServiceItem;
							item.pk = item.pkGeneralServiceItem;
							form.setValue("generalService",item);
						}
					}
				});
			}else if(serviceType=="ServicePackage"){
				var member=form.getValue("member");
				if(!member){
					Dialog.alert({
						content : "请先选择 "+i18ns.get("sale_ship_owner","会员")+"！"
					 });
 				    return false;
				}
				aw.ajax({
					url:"api/generalservicecharge/querypackage",
					data:{
						member :member,
						"generalServicePackage.state" : "Using",
						fetchProperties:"pkMemberServicePackage,description,price,version," +
								"generalServicePackage.pkGeneralServicePackage," +
								"generalServicePackage.name"
					},
					dataType:"json",
					success:function(data){
						for(var i in data){
							data[i].pk=data[i].pkMemberServicePackage;
							data[i].name = data[i].generalServicePackage.name;
						}
						form.setData("generalService",data);
						form.setValue("generalService","");
						if(orgData){
							var item=orgData.memberServicePackage;
							item.pk = item.pkMemberServicePackage;
							item.name = item.generalServicePackage.name;
							form.setValue("generalService",item);
						}
					}
				});
			}
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"通用收费",
					items:[{
						id:"generalchargesSearch",
						type:"search",
						placeholder : "搜索",
						handler : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/generalservicecharge/search",
								data:{
									s:str,
									searchProperties:"member.personalInfo.name,member.memberSigning.room.number,paymentname,number,telephone,user.name,chargeStatus,generalServiceItem.name",
									fetchProperties: "member.pkMember,"+
													 "member.personalInfo.name,"+
													 "member.memberSigning.room.number,"+
													 "paymentName,"+
													 "number,"+
													 "telephone," +
													 "serviceType,"+
													 "generalServiceItem.pkGeneralServiceItem,"+
													 "generalServiceItem.name,"+
													 "generalServiceItem.state," +
													 "memberServicePackage.generalServicePackage.pkGeneralServicePackage," +
													 "memberServicePackage.generalServicePackage.name,"+
													 "description,"+
													 "date,"+
													 "user.pkUser,"+
													 "user.name,"+
													 "chargeStatus,"+
													 "pkGeneralServiceCharge,"+
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
						minDate: "1930-05-31",
						maxDate: "2020-12-31",
						handler : function(time){
							widget.get("grid").refresh();
						},
						tip : "收费日期"
					},{
   						id:"add",
   						type:"button",
						text:"新增",
						show:true,
						handler:function(){
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
							widget.get("subnav").show(["return"]).hide(["add","generalchargesSearch","date","building","print"]);
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
							widget.get("subnav").hide(["add","generalchargesSearch","date","building","print"]);
							var data=widget.get("grid").getData();
							widget.get("printGrid").setData(data);
							window.print();
							$(".J-grid-title").addClass("hidden");
							$(".J-printGrid").addClass("hidden");
							$(".J-grid").removeClass("hidden");
							widget.get("subnav").show(["add","generalchargesSearch","date","building","print"]);
						}
					},{
   						id:"return",
   						type:"button",
   						text:"返回",
   						show:false,
   						handler:function(){
   							widget.get("subnav").hide(["return"]).show(["add","generalchargesSearch","date","building","print"]);
							widget.hide([".J-form"]).show(".J-grid");
   						}
					}]
				}
				
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				model:{
					url:"api/generalservicecharge/query",
					params:function(){
					var subnav=widget.get("subnav");
					return {
						"member.memberSigning.room.building":subnav.getValue("building"),
						"date":subnav.getValue("date").start,
						"dateEnd":subnav.getValue("date").end,
						fetchProperties: "member.pkMember,"+
										 "member.personalInfo.name,"+
										 "member.memberSigning.room.number,"+
										 "paymentName,"+
										 "number,"+
										 "telephone," +
										 "serviceType,"+
										 "generalServiceItem.pkGeneralServiceItem,"+
										 "generalServiceItem.name,"+
										 "generalServiceItem.state," +
										 "memberServicePackage.pkMemberServicePackage," +
										 "memberServicePackage.generalServicePackage.pkGeneralServicePackage," +
										 "memberServicePackage.generalServicePackage.name," +
										 "memberServicePackage.price,"+
										 "description,"+
										 "date,"+
										 "user.pkUser,"+
										 "user.name,"+
										 "chargeStatus,"+
										 "pkGeneralServiceCharge,"+
										 "version",
					};
				},
				
					columns:[{
						key:"member",
						name:i18ns.get("sale_ship_owner","会员")+"姓名",
						className:"oneColumn",
						format:function(value,data){
							return '<a class="J-theme-detail" style="color:#f34541;" href="javascript:void(0);">'+
							value.memberSigning.room.number+" "+value.personalInfo.name+'</a>';
                        },
					},{
						key:"paymentName",
						name:"付款人",
						className:"oneColumn",
					},{
						key:"telephone",
						name:"付款人联系电话",
						className:"oneColumn",
					},{
						key:"serviceType.value",
						name:"服务类型",
						className:"oneColumn",
					},{
						key:"serviceType",
						name:"服务项目/套餐",
						className:"oneColumn",
						format:function(value,row){
							if(row.serviceType && row.serviceType.value=="服务套餐"){
								return row.memberServicePackage.generalServicePackage?row.memberServicePackage.generalServicePackage.name:"";
							}else if(row.serviceType && row.serviceType.value=="服务项目"){
								return row.generalServiceItem?row.generalServiceItem.name:"";
							}
						}
					},{
						key:"number",
						name:"收费金额",
						className:"oneColumn",
					},{
						key:"date",
						name:"收费日期",
						className:"oneColumn",
						format:"date",
						formatparams :{
							mode : "YYYY-MM-DD",
						}
					},{
						key:"user.name",
						name:"收款人",
						className:"oneColumn",
					},{
						key:"chargeStatus.value",
						name:"收费状态",
						className:"oneColumn",
					},{
						key : "operate",
                        name : "操作",
                        className:"oneColumn",
                        format:"button",
                        formatparams : [{
                            id : "edit",
                            icon : "icon-edit",
                            show:function(value,row){
    							if(row.chargeStatus && row.chargeStatus.key=="UnCharge"){
    								return true;
    							}else{
    								return false;
    							}   
    						},
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								form.reset();
								form.setData(data);
								widget.loadSelect(form,data.serviceType.key,data);
								widget.get("subnav").show(["return"]).hide(["add","generalchargesSearch","building","print","date"]);
								widget.show(".J-form").hide(".J-grid");
							}
						},{
							 id : "delete",
							 icon:"icon-remove",
							 show:function(value,row){
	    							if(row.chargeStatus && row.chargeStatus.key=="UnCharge"){
	    								return true;
	    							}else{
	    								return false;
	    							}   
	    						},
							 handler:function(index,data,rowEle){
								aw.del("api/generalservicecharge/" + data.pkGeneralServiceCharge + "/delete",function(){
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
					key:"member",
					name:i18ns.get("sale_ship_owner","会员")+"姓名",
					className:"oneColumn",
					format:function(value,data){
						return '<a class="J-theme-detail" style="color:#f34541;" href="javascript:void(0);">'+
						value.memberSigning.room.number+" "+value.personalInfo.name+'</a>';
                    },
				},{
					key:"paymentName",
					name:"付款人",
					className:"oneColumn",
				},{
					key:"telephone",
					name:"付款人联系电话",
					className:"oneColumn",
				},{
					key:"serviceType.value",
					name:"服务类型",
					className:"oneColumn",
				},{
					key:"serviceType",
					name:"服务项目/套餐",
					className:"oneColumn",
					format:function(value,row){
						if(row.serviceType && row.serviceType.value=="服务套餐"){
							return row.memberServicePackage.generalServicePackage?row.memberServicePackage.generalServicePackage.name:"";
						}else if(row.serviceType && row.serviceType.value=="服务项目"){
							return row.generalServiceItem?row.generalServiceItem.name:"";
						}
					}
				},{
					key:"number",
					name:"收费金额",
					className:"oneColumn",
				},{
					key:"date",
					name:"收费日期",
					className:"oneColumn",
					format:"date",
					formatparams :{
						mode : "YYYY-MM-DD",
					}
				},{
					key:"user.name",
					name:"收款人",
					className:"oneColumn",
				},{
					key:"chargeStatus.value",
					name:"收费状态",
					className:"oneColumn",
				}]
				}
			});
			this.set("printGrid",printGrid);
			
			var form = new Form({
				parentNode:".J-form",
				saveaction:function(){
					var form = widget.get("form");
					var data = form.getData();
					var serviceType = form.getValue("serviceType");
					var pk = form.getValue("generalService");
					if(serviceType=="ServiceItem"){
						data.generalServiceItem = pk;
					}else if(serviceType=="ServicePackage"){
						data.memberServicePackage = pk;
					}
					aw.saveOrUpdate("api/generalservicecharge/save",aw.customParam(data),function(data){
						widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("subnav").hide(["return"]).show(["add","generalchargesSearch","date","building","print"]);
						widget.get("grid").refresh();
					});
				},
				cancelaction:function(){
					widget.get("subnav").hide(["return"]).show(["add","generalchargesSearch","date","building","print"]);
					widget.hide(".J-form").show(".J-grid");
				},
				model:{
					id:"generalchargesform",
					items:[{
						name:"pkGeneralServiceCharge",
						type:"hidden",
					},{
						name:"version",
						type:"hidden",
						defaultValue:0
					},{
						name:"pkMemberServicePackage",
						type:"hidden"
					},{
						name:"member",
    					label:i18ns.get("sale_ship_owner","会员"),
    					type:"select",
    					url : "api/member/query",
    					keyField:"pkMember",
    					valueFiled:"name",
    					params : function(){
                            return {
                            	fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number",
                            };
                        },
                        format:function(data,value){
                        	return data.memberSigning.room.number+" "+data.personalInfo.name;
                        },
                        validate:["required"],
					},{
						name:"paymentName",
    					label:"付款人",
    					validate:["required"],
					},{
						name:"telephone",
    					label:"联系电话",
    					validate:["required"],
					},{
                    	name:"serviceType",
						label:"服务类型",
						type:"select",
						options:enums["com.eling.elcms.service.model.GeneralServicePrice.ServiceType"],
						validate:["required"],
					},{
						name:"generalService",
						label:"服务项目/套餐",
						type:"select",
    					keyField:"pk",
    					valueFiled:"name",
                        format:function(data){
                        	if(!data.serviceType){
                        		return data.name+" "+data.price;
                        	}else if(data.serviceType&&data.serviceType.value=="服务项目"){
                        		return data.generalServiceItem.name+" "+data.price;
                        	}
                        	
                        },
                        validate:["required"],
					},{
						name:"number",
    					label:"收费金额",
    					defaultValue:0,
						validate : ["required","number"],
					},{
						name:"date",
    					label:"收费日期",
    					type : "date",
    					mode : "YYYY-MM-DD",
    					defaultValue:moment().valueOf(),
    					validate:["required"],
					},{
						name:"user",
						label:"收款人",
						type:"select",
						key:"pkUser",
						url:"api/users",//TODO 用户角色：wulina
						params:{
							fetchProperties:"pkUser,name"
						},
//        						lazy:true,
						value:"name",
						validate:["required"],
					},{
						name:"chargeStatus",
    					label:"收费状态",
						options:enums["com.eling.elcms.charge.model.GeneralServiceCharge.ChargeStatus"],
						type:"select",
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
	module.exports = generalcharges;
})