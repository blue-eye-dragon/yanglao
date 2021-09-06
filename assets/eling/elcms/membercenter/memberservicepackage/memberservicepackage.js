define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Form=require("form");
	var emnu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	require("../../grid_css.css");
	var Dialog = require("dialog");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>" +
	"<div class='J-countgrid hidden' ></div>";
	var Service = ELView.extend({
		attrs:{
            template:template
		},
		 events:{
				"change .J-form-memberservicepackage-date-effectiveDate":function(e){
					var form =this.get("form"); 
					var effectiveDate = form.getValue("effectiveDate");
					var expiryDate = form.getValue("expiryDate");
					if(moment(effectiveDate).isAfter(expiryDate,"minutes")){
						Dialog.alert({
							content : "生效日期不能晚于失效日期",
						});
						form.setValue("effectiveDate","");
						return;
					}
				},
				"change .J-form-memberservicepackage-date-expiryDate":function(e){
					var form =this.get("form"); 
					var expiryDate = form.getValue("expiryDate");
					var effectiveDate =form.getValue("effectiveDate");
					if(moment(effectiveDate).isAfter(expiryDate,"minutes")){
						Dialog.alert({
							content : "失效日期不能早于生效日期",
						});
						form.setValue("expiryDate","");
						return;
					}
				},
				"change .J-form-memberservicepackage-select-servicePackagePrice":function(e){
					var form =this.get("form"); 
					var pkGeneralServicePrice =	form.getValue("servicePackagePrice");
					var data = form.getData("servicePackagePrice");
					var curData = {};
					for(var j in data){
						if(pkGeneralServicePrice ==data[j].pkGeneralServicePrice){
							curData = data[j];
							break;
						}
					}
					aw.ajax({
						url:"api/generalServicePackageItem/query",
						data:{
							"servicePackage" :curData.generalServicePackage.pkGeneralServicePackage,
							fetchProperties:"pkGeneralServicePackageItem," +
											"count," +
											"cycle," +
											"version," +
											"serviceItem," +
											"serviceItem.pkGeneralServiceItem," +
											"serviceItem.name," +
											"serviceItem.state",
						},
						dataType:"json",
						success:function(datas){
							var disable="";
							for(var i=0;i<datas.length;i++){
								if(datas[i].serviceItem.state.value=="停用"){
									disable+=datas[i].serviceItem.name+",";
								}else if(i==(datas.length-1)&& datas[i].serviceItem.state.value=="停用"){
									disable+=datas[i].serviceItem.name;
								}
							}
							form.setValue("price",curData.price);
							form.setValue("pkGeneralServicePackage",curData.generalServicePackage.pkGeneralServicePackage);
							if(disable!=""){
								Dialog.alert({
									content : "该套餐中"+disable+"项目已停用，确认选择？",
								});
							}
							return;
						}
					});
				}
		 },
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"套餐管理",
					items :[{
						id : "search",
						type : "search",
						placeholder : "按姓名或房间号搜索",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/memberservicepackage/search",
								data:{
									s:str,
									searchProperties:"member.memberSigning.room.number, member.personalInfo.name,pkMember",
									fetchProperties:"*," +
													"pkMemberServicePackage,"+
													"price,purchaseDate,effectiveDate,expiryDate,"+
													"member.personalInfo.name,"+
													"member.memberSigning.room.number,"+
													"generalServicePackage.name,"+
													"member.memberSigning.room.pkRoom",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
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
   							widget.get("subnav").setValue("search","");
   							widget.get("grid").refresh();
   						}
					},{
						 id:"e",
						 type:"buttongroup",
			   			 tip:"状态",
							items:[{
			                    key:"",
			                    value:"全部"
							},{
								key:"Init",
			                    value:"未生效"
							},{
			                    key:"Unarrange",
			                    value:"正常"
							},{
								key:"Unrepaired",
			                    value:"失效"
							}],
							handler:function(key,element){
								widget.get("grid").refresh();
							}
					},{
						id : "effectiveDate",
						tip : "生效日期",
						type : "daterange",
						ranges : {
							"上月": [moment().subtract(1,"month").startOf("year"),moment().subtract(1,"month").endOf("month")],
					        "本月": [moment().startOf("month"), moment().endOf("month")],
					        "本年": [moment().startOf("year"), moment().endOf("year")],
   					 		"去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
						},
						defaultRange : "本月",
						handler : function(){
							widget.get("subnav").setValue("search","");
							widget.get("grid").refresh();
						},
					},{
						id :"add",
						type : "button",
						text : "新增",
						handler : function(){
							widget.get("subnav").setValue("search","");
							var form=widget.get("form");
							form.reset();
							form.load("create",{
								params:{
									fetchProperties:"pkUser,name"
								},
								callback:function(data){
									//当前用户是管理员时，让recordPerson可用
									var userSelect=form.getData("create","");
								//	userSelect.push(activeUser);
									var flag = false;
									for(var  i =  0 ; i<userSelect.length;i++ ){
										if(userSelect[i].pkUser == activeUser.pkUser){
											flag= true;
											break;
										}
									}
									if(flag){
										form.setValue("create",activeUser.pkUser);
									}
									var create=form.getData("create","");
									create.push(activeUser);
									form.setData("create",create);
									form.setValue("create",activeUser);
								}
							});
							widget.get("subnav").hide(["search","add","building","e","effectiveDate"]).show(["return"]);
							widget.hide([".J-grid"]).show([".J-form"]);
						}
					},{
						id : "return",
						type :"button",
						text : "返回",
						show : false,
						handler : function(){
							widget.get("subnav").show(["search","add","building","e","effectiveDate"]).hide(["return"]);
							widget.show([".J-grid"]).hide([".J-form",".J-countgrid"]);
						}
					}],
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/memberservicepackage/queryByEffectiveState",
					params:function(){
						return {
						"effective":widget.get("subnav").getValue("e"),
						"start": widget.get("subnav").getValue("effectiveDate").start,
						"end": widget.get("subnav").getValue("effectiveDate").end,
						"pkBuilding":subnav.getValue("building"),
						fetchProperties:"*," +
										"pkMemberServicePackage,"+
										"price,purchaseDate,effectiveDate,expiryDate,"+
										"member.personalInfo.name,"+
										"member.memberSigning.room.number,"+
										"generalServicePackage.name,"+
										"member.memberSigning.room.pkRoom",
						}
					},
					columns : [{
						name : "member",
						label : i18ns.get("sale_ship_owner","会员"),
						className:"oneHalfColumn",
						 format:function(value,row){
	                        	return value.memberSigning.room.number+" "+value.personalInfo.name;
	                        },
					},{
						name : "generalServicePackage.name",
						label : "服务套餐",
						className:"oneHalfColumn",
						format:"detail",
						formatparams:{
 							key:"detail",
							handler:function(index,data,rowEle){
								var countgrid = widget.get("countgrid");
								var form = widget.get("form");
								countgrid.refresh({
									"pkMemberServicePackage" : data.pkMemberServicePackage,
									fetchProperties:"*," +
													"name,"+
													"numberName,effectiveDate,expiryDate,packageName," +
													"surplusList.itemName," +
													"surplusList.count," +
													"surplusList.surplus," +
													"surplusList.unit",
								},function(datas){
									if(datas.length>0){
										countgrid.setData(datas[0].surplusList);
										countgrid.setTitle(datas[0].packageName+"套餐");
									}
									
									form.setData(data);
									form.setDisabled(true);
                      	 			form.setValue("pkGeneralServicePackage",data.generalServicePackage.pkGeneralServicePackage);

                      	 			aw.ajax({
	    								url:"api/generalServicePrice/query",
	    								data:{
	    									"serviceType":"ServicePackage",
	    									"generalServicePackage":data.generalServicePackage.pkGeneralServicePackage,
	    									"price":data.price,
	    									fetchProperties:"generalServicePackage.name,price," +
	                            			"generalServicePackage.pkGeneralServicePackage," +
	                            			"pkGeneralServicePrice",
	    								},
	    								dataType:"json",
	    								success:function(data2){
	    									 	form.setValue("servicePackagePrice",data2);
	    									 	widget.get("subnav").hide(["search","add","building","e","effectiveDate"]).show(["return"]);
	    										widget.show([".J-countgrid",".J-form"]).hide([".J-grid"]);
	    								}
	    							});
									
				                });
							}
 						}
					},{
						name : "price",
						label : "价格",
						className:"oneHalfColumn",
					},{
						name : "purchaseDate",
						label : "办理时间",
						format:"date",
						className:"oneHalfColumn",
					},{
						name : "effectiveDate",
						label : "生效日期",
						format:"date",
						className:"oneHalfColumn",
					},{
						name : "expiryDate",
						label : "失效日期",
						format:"date",
						className:"oneHalfColumn",
					},{
						name : "status",
						label : "状态",
						className:"oneHalfColumn",
						format:function(value,row){
							if(moment(row.effectiveDate).startOf('day').isAfter(moment().valueOf(),"minutes")){
								return '未生效';
							}
							if(moment(moment()).isAfter(row.effectiveDate,"minutes")&&moment(row.expiryDate).endOf('day').isAfter(moment().valueOf(),"minutes")){
								return '正常';
							}else{
								return '失效';
							}
                        },
					},{
						 name : "operate",
	                        label : "操作",
	                        className:"oneHalfColumn",
	                        format : "button",
	                        formatparams : [{
	                            id : "edit",
	                            icon : "icon-edit",
	                            handler : function(index,data,rowELe){
	                              	var form=widget.get("form");
	                            	aw.ajax({
	    								url:"api/generalservicecharge/query",
	    								data:{
	    									"serviceType":"ServicePackage",
	    									memberServicePackage:data.pkMemberServicePackage
	    								},
	    								dataType:"json",
	    								success:function(data1){
	    									if(data1.length>0){
	    										Dialog.alert({
	    											title : "提示",
	    											content : "已存在通用收费记录，无法修改！",
	    										});
	    									}else{
	    										form.reset();
	    										form.setData(data);
	                              	 			form.setValue("pkGeneralServicePackage",data.generalServicePackage.pkGeneralServicePackage);
	                              	 			aw.ajax({
	        	    								url:"api/generalServicePrice/query",
	        	    								data:{
	        	    									"serviceType":"ServicePackage",
	        	    									"generalServicePackage":data.generalServicePackage.pkGeneralServicePackage,
	        	    									"price":data.price,
	        	    									fetchProperties:"generalServicePackage.name,price," +
	        	                            			"generalServicePackage.pkGeneralServicePackage," +
	        	                            			"pkGeneralServicePrice",
	        	    								},
	        	    								dataType:"json",
	        	    								success:function(data2){
	        	    									 	form.setValue("servicePackagePrice",data2);
	        	    		    							widget.get("subnav").show(["return"]).hide(["add","search","e","building","effectiveDate"]);
	        	    		    							widget.show(".J-form").hide([".J-grid",".J-countgrid"]);
	        	    								}
	        	    							});
    										}
	    								}
	    							});
								}
						},{
							key:"delete",	
							icon:"icon-remove",
							
							handler:function(index,data,rowEle){
								aw.del("api/memberservicepackage/" + data.pkMemberServicePackage + "/delete",function(){
									widget.get("grid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
				parentNode:".J-form",
					saveaction : function(){
						var form = widget.get("form");
						var data = form.getData();
						data.generalServicePackage = form.getValue("pkGeneralServicePackage");
						aw.saveOrUpdate("api/memberservicepackage/save",aw.customParam(data),function(data){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["search","add","e","building","effectiveDate"]);
							widget.get("grid").refresh();
						});
                    },
                    cancelaction : function(){
                    	widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("subnav").hide(["return"]).show(["search","add","e","building","effectiveDate"]);
						widget.get("grid").refresh();
                    },
                    model : {
    					id : "memberservicepackage",
                    items : [{
                    	name:"pkMemberServicePackage",
						type:"hidden"
                    },{
                    	name:"version",
                    	defaultValue : "0",
						type:"hidden"
                    },{
                    	name:"pkGeneralServicePackage",
                    	type:"hidden"
                    },{
                    	name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						keyField:"pkMember",
						params:function(){
							return {
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						format:function(data){
                        	return data.memberSigning.room.number+data.personalInfo.name;
                        },
						type:"select",
						validate:["required"]
                    },{
                     	name:"servicePackagePrice",
                    	label:"服务套餐",
    					url : "api/generalServicePrice/query",
    					keyField:"pkGeneralServicePrice",
    					valueFiled:"name",
    					params : function(){
                            return {
                            	serviceType :"ServicePackage",
                            	"generalServicePackage.state" : "Using",
                            	fetchProperties:"generalServicePackage.name,price," +
                            			"generalServicePackage.pkGeneralServicePackage," +
                            			"pkGeneralServicePrice",
                            };
                        },
                        format:function(data,value){
                        	return data.generalServicePackage.name+" "+data.price;
                        },
                    	type:"select",
                    	validate:["required"],
                    },{
                    	name:"price",
                    	label:"价格",
                    	readonly:true,
                    },{
                    	name:"effectiveDate",
						label:"生效日期",
	                    type:"date",
						validate:["required"],
                    },{
                    	name:"expiryDate",
						label:"失效日期",
	                    type:"date",
						validate:["required"],
                    },{
	                    name:"create",
						label:"创建人",
						keyField:"pkUser",
	    				url:"api/users",
	    				validate:["required"],
	    				params:{
							fetchProperties:"pkUser,name"
						},
						valueField:"name",
						type : "select",	
                    },{
                    	name:"purchaseDate",
						label:"办理时间",
	                    type:"date",
	                    defaultValue:moment().valueOf(),
	                    readonly:true,
						validate:["required"],
                    },{
	   					name:"description",
						label:"备注",
						type:"textarea",
                    }]
				}
			});
			this.set("form",form);
			
			var countgrid = new Grid({
				parentNode:".J-countgrid",
				model : {
					url:"api/report/memberpackagecondition",
					columns : [{
						name : "itemName",
						label : "服务项目",
						className:"oneHalfColumn",
					},{
						name : "count",
						label : "总量",
						className:"oneHalfColumn",
					},{
						name : "surplus",
						label : "剩余量",
						className:"oneHalfColumn",
					},{
						name : "unit",
						label : "单位",
						format:function(value,row){
							if(value=="Hour"){
								return "小时";
							}else if(value=="Time"){
								return "次";
							}else if(value=="Piece"){
								return "件";
							}
						},
						className:"oneHalfColumn",
					}]
				}
			});
			this.set("countgrid",countgrid);
		},
	});
	module.exports = Service;
});
