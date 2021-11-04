define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
	var Tab=require("tab");
	var store = require("store");
	var activeUser = store.get("user");
	var Grid = require("grid-1.0.0");
	var Form = require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
	var lifeDailyRecord=ELView.extend({
		attrs:{
			template: "<div class='J-subnav'></div>"+
			"<div class='J-tab'></div>"+
			"<div class='J-main-date hidden'></div>"
		},
		_initGrid:function(){
			this.get("gooutGrid").refresh();
			this.get("visitorGrid").refresh();
			this.get("shackGrid").refresh();
			this.get("otherGrid").refresh();
		},
		getMember:function(){
			var params=this.get("params");
			if(params && params.pkMember){
				return params.pkMember;
			}else{
				return this.get("subnav").getValue("defaultMembers");
			}
		},
		getReturnForm:function(data){
			var returnForm	=new Form({
				model:{
					id:"returnForm",
					defaultButton:false,
					items:[{
						name:"pkGoOutRecord",
						type:"hidden",
						defaultValue:data.pkGoOutRecord,
					},{
						name:"version",
						type:"hidden",
						defaultValue:data.version,
					},{
						name:"status",
						type:"hidden",
						defaultValue:"back",
					},{
						name:"backDate",
						label:"返回时间",
						type:"date",
						mode:"Y-m-d",
						style:{
							label:"width:30%"
						},
						defaultValue:data.backDate?data.backDate:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("returnForm",returnForm);
			return returnForm;
		},
		initComponent:function(params,widget){
			var inParams=widget.get("params");
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"生活日志",
					buttonGroup:[{
						id:"building",
						show:false,
						handler:function(key,element){
							widget.get("subnav").load({
								id:"defaultMembers",
								params:{
									"memberSigning.room.building":widget.get("subnav").getValue("building"),
									"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
									"memberSigning.status":"Normal",
 									"memberSigning.houseingNotIn":false,
									fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number,status"
								},
								callback:function(data){
									if(data.length > 0){
										widget._initGrid();
									}else{
										widget.get("gooutGrid").setData([]);
										widget.get("visitorGrid").setData([]);
										widget.get("shackGrid").setData([]);
										widget.get("otherGrid").setData([]);
									}
								}
							});
						}
					},{
						id : "defaultMembers",
						handler : function(key, element) {
							widget._initGrid();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var tab = new Tab({
				parentNode:".J-tab",
				model:{
					items:[{
						id:"memGoOut",
						title:"外出记录"
					},{
						id:"memVisitor",
						title:"来访记录"
					},{
						id:"memShack",
						title:"暂住申请"
					},{
						id:"memOther",
						title:"生活记录"
					}]
				}
			});
			
			var gooutForm=new Form({
				parentNode:"#memGoOut",
            	saveaction:function(){
            		var form=widget.get("gooutForm");
					var outDate = form.getValue("outDate");
					var backDate = form.getValue("backDate");
					if(backDate <= outDate){
						Dialog.tip({
							title:i18ns.get("sale_ship_owner","会员")+"返回时间需大于出行时间"
						});
					}else{
						var params="member="+widget.getMember()+"&"+$("#gooutrecord").serialize()+"&"+"recordDate="+ $(".J-form-gooutrecord-date-recordDate").val();
						aw.saveOrUpdate("api/gooutrecord/save",params,function(data){
//							var subnav = widget.get("subnav");
//							var dat =subnav.getData("defaultMembers",widget.getMember());
//							dat.status.key = data.status;
//							dat.status.value = "外出";
							widget.hide("#memGoOut .el-form").show("#memGoOut .el-grid");
 							widget.get("gooutGrid").refresh();
						});
					}
 				},
 				//取消按钮
				cancelaction:function(){
					widget.hide("#memGoOut .el-form").show("#memGoOut .el-grid");
				},
				model:{
					id:"gooutrecord",
					items:[{
						name:"pkGoOutRecord",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"outDate",
						label:"出行日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"backDate",
						label:"返回日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"status",
						label:"状态",
						type:"select",
						options:[{
							key:"Out",
							value:"出行"
						},{
							key:"back",
							value:"已返回"
						}],
						defaultValue:"Out",
						validate:["required"]
					},{
						name:"accompanyPerson",
						label:"同行人员"
					},{
						name:"recordPerson",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
             });
			this.set("gooutForm",gooutForm);
			
			var gooutGrid=new Grid({
				parentNode:"#memGoOut",
				autoRender:false,
    			url:"api/gooutrecord/query",
    			params:function(){
    				return {
    					fetchProperties:"*,recordPerson.name,member.personalInfo.name,recordDate,member.status", 
        				member:widget.getMember()
    				};
    			},
 				model : {
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								//TODO cjf 会员过世后，暂时不限制
								/*if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:"会员已过世！"
									})
									return;
								}*/
								if(!widget.getMember()){
									Dialog.alert({
										content:"该楼无"+i18ns.get("sale_ship_owner","会员")+"！"
									})
									return;
								}
								var member = widget.get("subnav").getData("defaultMembers",widget.getMember())||widget.get("params");
								if(member.status.key != "Normal"&&member.status.key != "Died"){
										Dialog.alert({
											content:"当前"+i18ns.get("sale_ship_owner","会员")+"的状态为"+member.status.value+"，不能增加外出记录！"
										})
										return;
								}
								var form=widget.get("gooutForm");
								form.reset();
								var form = widget.get("gooutForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让recordPerson可用
										var userSelect=form.getData("recordPerson","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("recordPerson",activeUser.pkUser);
										}
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(activeUser);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",activeUser);
									}
								});
								form.setAttribute("status","readonly",true);
								form.setAttribute("recordPerson","readonly",true);
								form.setAttribute("recordDate","disabled",true);
								form.setData({
									recordDate:{key:"defaultValue",value:"moment().valueOf()"}  
								},{
	 								status:{key:"Out",value:"出行"}
	 							});
								widget.show("#memGoOut .el-form").hide("#memGoOut .el-grid");
							}
						}]
					},
					columns:[{
						key:"outDate",
						name:"出行日期",
						format:"date"
					},{
						key:"backDate",
						name:"返回日期",
						format:"date"
					},{
						key:"status",
						name:"状态",
						format:function(row,value){
							if(value.status=="back"){
								return "已返回";
							}else{
								return "出行";
							}
						},
					},{
						key:"accompanyPerson",
						name:"同行人员"
					},{
						key:"recordPerson.name",
						name:"记录人"
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(value.status=="back"){
								return "已返回";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var  form =widget.get("gooutForm");
								form.setAttribute("status","readonly",true);
								form.setAttribute("recordPerson","readonly",true);
								form.setAttribute("recordDate","disabled",true);
								form.setData(data);
								var form =widget.get("gooutForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(data.recordPerson);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",data.recordPerson);
									}
								});
								widget.show("#memGoOut .el-form").hide("#memGoOut .el-grid");
							}
						},{
							key:"memberreturn",
							text:"回园",
							handler:function(index,data,rowEle){
								Dialog.showComponent({
									title:"返回时间",
									confirm:function(){
										var backDate= widget.get("returnForm").getValue("backDate");
										//TODO:加入校验
										if(moment(backDate).isAfter(moment())){
											$("#returnForm .J-form-returnForm-date-backDate").parent().parent().next().text("返回时间不能大于今天");
											return "NotClosed";
										}else{
											aw.saveOrUpdate("api/gooutrecord/save",$("#returnForm").serialize(),function(data){
//												var subnav = widget.get("subnav");
//												var dat =subnav.getData("defaultMembers",widget.getMember());
												params.status.key = "Normal";
												params.status.value = "在住";
												widget.get("gooutGrid").refresh();
											});
										}
									},
									setStyle:function(){
										$(".el-dialog .modal.fade.in").css({
											"top":"10%"
										});
									}
								},widget.getReturnForm(data));
							}
						}]
					}]
 				}
    		});
			this.set("gooutGrid",gooutGrid);
			this.$("#memGoOut .el-form").addClass("hidden");
			
			//渲染页签二：来访纪录
			var visitorForm=new Form({
				parentNode:"#memVisitor",
				saveaction:function(){
					var params="member="+widget.getMember()+"&"+$("#visitorrecord").serialize()+"&"+"recordDate="+$(".J-form-visitorrecord-date-recordDate").val();
					aw.saveOrUpdate("api/visitorrecord/save",params,function(){
						widget.get("visitorGrid").refresh();
						widget.hide("#memVisitor .el-form").show("#memVisitor .el-grid");
					});	
				},
				cancelaction:function(){
					widget.hide("#memVisitor .el-form").show("#memVisitor .el-grid");
				},
				model:{
					id:"visitorrecord",
					items:[{
						name:"pkVisitorRecord",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"visitorTime",
						label:"来访日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"numberOfPeople",
						label:"人数"
					},{
						name:"relationship",
						label:"与"+i18ns.get("sale_ship_owner","会员")+"关系  "
					},{
						name:"creator",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						readonly:true,
						validate:["required"]
					}]
				}			
			});
			this.set("visitorForm",visitorForm);
			
			var visitorGrid=new Grid({
				autoRender:false,
				parentNode:"#memVisitor",
				url : "api/visitorrecord/query",
				params:function(){
    				return {
    					fetchProperties:"*,member.personalInfo.name,member.personalInfo.pkPersonalInfo,recordDate,member.memberSigning.room.number,creator.name,creator.pkUser",
        				member:widget.getMember()
    				};
    			},
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								//TODO cjf 会员过世后，暂时不限制
								/*if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:"会员已过世！"
									})
									return;
								}*/
								if(!widget.getMember()){
									Dialog.alert({
										content:"该楼无"+i18ns.get("sale_ship_owner","会员")+"！"
									})
									return;
								}
								widget.get("visitorForm").reset();
								var form = widget.get("visitorForm");
								form.load("creator",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让creator可用
										var userSelect=form.getData("creator","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("creator",activeUser.pkUser);
										}
										var creator=form.getData("creator","");
										creator.push(activeUser);
										form.setData("creator",creator);
										form.setValue("creator",activeUser);
									}
								});
								$(".J-form-visitorrecord-select-creator").attr("disabled",true);
								$(".J-form-visitorrecord-date-recordDate").attr("disabled",true);
								widget.show("#memVisitor .el-form").hide("#memVisitor .el-grid");
							}
						}]
					},
					columns:[{
						key:"visitorTime",
						name:"来访时间",
						format:"date"
					},{
						key:"numberOfPeople",
						name:"人数"
					},{
						key:"relationship",
						name:"与"+i18ns.get("sale_ship_owner","会员")+"关系",
					},{
						key:"creator.name",
						name:"记录人"
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$(".J-form-visitorrecord-select-creator").attr("disabled",true);
								$(".J-form-visitorrecord-date-recordDate").attr("disabled",true);
								widget.get("visitorForm").setData(data);
								var form =widget.get("visitorForm");
								form.load("creator",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var creator=form.getData("creator","");
										creator.push(data.creator);
										form.setData("creator",creator);
										form.setValue("creator",data.creator);
									}
								});
								widget.show("#memVisitor .el-form").hide("#memVisitor .el-grid");
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/visitorrecord/" + data.pkVisitorRecord + "/delete",function(){
									widget.get("visitorGrid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("visitorGrid",visitorGrid);
			this.$("#memVisitor .el-form").addClass("hidden");

			//渲染页签三：暂住申请
			var shackForm=new Form({
				parentNode:"#memShack",
				saveaction:function(){
					var form=widget.get("shackForm");
					var number=form.getValue("number");
					var startDate = form.getValue("date");
					var endDate = form.getValue("endDate");
					if(startDate!=""&&moment(startDate).isBefore(moment(), 'day')){
						Dialog.alert({
							content:"开始日期不能小于当前日期"
			    		});
						return;
					}
					if(startDate!=""&&endDate!=""&&moment(startDate).isAfter(moment(endDate), 'day')){
						Dialog.alert({
							content:"开始日期需小于结束日期"
			    		});
						return;
					}
					if(number!=""&&isNaN(number)){
						Dialog.alert({
							content:"人数只能填写数字!"
						});
						return false;
					}
					var params="member="+widget.getMember()+"&"+$("#shackapply").serialize()+"&"+"creator="+$("select.J-form-shackapply-select-creator").val()+"&"+"recordDate="+$(".J-form-shackapply-date-recordDate").val();
					aw.saveOrUpdate("api/shackapply/save",params,function(data){
						if(data.msg == "该"+i18ns.get("sale_ship_owner","会员")+"已有未完成的申请单"){
	                   		 Dialog.alert({
	                   			 content:"该"+i18ns.get("sale_ship_owner","会员")+"已有未完成的申请单"
	                   		 });
	                    }else{
	                    	widget.hide("#memShack .el-form").show("#memShack .el-grid");
		                   	widget.get("shackGrid").refresh();
	                    }
						
					});
					
				},
				cancelaction:function(){
					widget.hide("#memShack .el-form").show("#memShack .el-grid");
				},
				model:{
					id:"shackapply",
					items:[{
						name:"pkShackApply",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"flowStatus",
						type:"hidden",
						defaultValue:"Init"
					},{
						name:"date",
						label:"开始日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"endDate",
						label:"结束日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]					
					},{
						name:"nowDate",
						label:"申请日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]					
					},{
						name:"number",
						label:"人数",
						validate:["required"]
					},{
						name:"nexus",
						label:"与"+i18ns.get("sale_ship_owner","会员")+"关系",
						validate:["required"]
					},{
						name:"creator",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}			
			});
			this.set("shackForm",shackForm);
			
			var shackGrid=new Grid({
				parentNode:"#memShack",
				autoRender:false,
				url : "api/shackapply/query",
				params:function(){
    				return {
    					fetchProperties:"*,member.personalInfo.name,member.personalInfo.pkPersonalInfo,member.memberSigning.room.number,creator.name,recordDate,creator",
        				member:widget.getMember(),
        				
    				};
    			},
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								//TODO cjf 会员过世后，暂时不限制
								/*if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:"会员已过世！"
									})
									return;
								}*/
								if(!widget.getMember()){
									Dialog.alert({
										content:"该楼无"+i18ns.get("sale_ship_owner","会员")+"！"
									})
									return;
								}
								widget.get("shackForm").reset();
								var form = widget.get("shackForm");
								form.load("creator",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让recordPerson可用
										var userSelect=form.getData("creator","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("creator",activeUser.pkUser);
										}
										var creator=form.getData("creator","");
										creator.push(activeUser);
										form.setData("creator",creator);
										form.setValue("creator",activeUser);
									}
								});
								$(".J-form-shackapply-select-creator").attr("disabled",true);
								$(".J-form-shackapply-date-recordDate").attr("disabled",true);
								widget.show("#memShack .el-form").hide("#memShack .el-grid");
							}
						}]
					},
					columns:[{
						key:"date",
						name:"开始日期 ",
						format:"date"
					},{
						key:"endDate",
						name:"结束日期 ",
						format:"date"
					},{
						key:"nowDate",
						name:"申请日期 ",
						format:"date"
					},{
						key:"number",
						name:"人数"
					},{
						key:"nexus",
						name:"与"+i18ns.get("sale_ship_owner","会员")+"关系",
						
					},{
						key:"creator.name",
						name:"记录人"
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
 						key:"flowStatus.value",
 						name:"状态"
 					},{
						key:"operate",
						name:"操作",
						format:function(value,row){
							if(row.flowStatus.key=="Init"){
								return "button";
							}else{
								return "";
							}   
 						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$(".J-form-shackapply-select-creator").attr("disabled",true);
								$(".J-form-shackapply-date-recordDate").attr("disabled",true);
								widget.get("shackForm").setData(data);
								var form =widget.get("shackForm");
								form.load("creator",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var creator=form.getData("creator","");
										creator.push(data.creator);
										form.setData("creator",creator);
										form.setValue("creator",data.creator);
									}
								});
								widget.show("#memShack .el-form").hide("#memShack .el-grid");
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"确定删除？删除后无法恢复",
									confirm:function(){
										aw.saveOrUpdate("api/shackapply/" + data.pkShackApply + "/delete",data,function(){
											widget.get("shackGrid").refresh();
										});
									}
			 					});
							}
						},{
							key:"submit",
							text:"提交",
							handler:function(index,data,rowEle){
		                            aw.ajax({
		                                url : "api/shackapply/submit",
		                                type : "POST",
		                                data : {
		                                	pkShackApply:data.pkShackApply, 
		                                    version:data.version
		                                },
		                               success : function(data){
		                            	   widget.get("shackGrid").refresh(
//		                            		{
//		                            		   pkMember:widget.getMember()
//		                            	   }
		                            	   );
		                                }
		                            });
							}
						}]
					
 					}]
				}
			});
			this.set("shackGrid",shackGrid);
			this.$("#memShack .el-form").addClass("hidden");
			
			//渲染页签四：其他记录
			var otherForm=new Form({
				parentNode:"#memOther",
            	saveaction:function(){
            		var params="member="+widget.getMember()+"&"+$("#otherrecord").serialize()+"" +
            			//	"&"+"recorder="+$(".J-form-otherrecord-select-recorder").val()+
            				"&"+"recordDate="+$(".J-form-otherrecord-date-recordDate").val();
;
            		aw.saveOrUpdate("api/memberdailyrecord/save",params,function(data){
            			widget.hide("#memOther .el-form").show("#memOther .el-grid");
            			widget.get("otherGrid").refresh();
            		});
 				},
 				//取消按钮
				cancelaction:function(){
					widget.hide("#memOther .el-form").show("#memOther .el-grid");
				},
				model:{
					id:"otherrecord",
					items:[{
						name:"pkMemberDailyRecord",
						type:"hidden"
					},{
						name:"type",
						type:"hidden",
						defaultValue:"Life"
					},{
						name:"date",
						label:"业务日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"record",
						label:"描述",
						type:"textarea",
						validate:["required"]
					},{
						name:"recorder",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						lazy:true,
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
             });
			this.set("otherForm",otherForm);
			
			var otherGrid=new Grid({
				parentNode:"#memOther",
				autoRender:false,
    			url:"api/memberdailyrecord/query",
    			params:function(){
    				return {
    					fetchProperties:"*,recorder.name",
        				type:"Life",
        				member:widget.getMember()
    				};
    			},
 				model : {
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								//TODO cjf 会员过世后，暂时不限制
								/*if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:"会员已过世！"
									})
									return;
								}*/
								if(!widget.getMember()){
									Dialog.alert({
										content:"该楼无"+i18ns.get("sale_ship_owner","会员")+"！"
									})
									return;
								}
								widget.get("otherForm").reset();
								var form = widget.get("otherForm");
								form.load("recorder",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让recorder可用
										var userSelect=form.getData("recorder","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("recorder",activeUser.pkUser);
										}
										var recorder=form.getData("recorder","");
										recorder.push(activeUser);
										form.setData("recorder",recorder);
										form.setValue("recorder",activeUser);
									}
								});
								$(".J-form-otherrecord-select-recorder").attr("disabled",true);
								$(".J-form-otherrecord-date-recordDate").attr("disabled",true);
								widget.show("#memOther .el-form").hide("#memOther .el-grid");
							}
						}]
					},
					columns:[{
						col:2,
						key:"date",
						name:"业务日期",
						format:"date"
					},{
						col:5,
						key:"record",
						name:"描述"
					},{
						col:2,
						key:"recorder.name",
						name:"记录人"
					},{
						col:2,
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						col:1,
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$(".J-form-otherrecord-select-creator").attr("disabled",true);
								$(".J-form-otherrecord-date-recordDate").attr("disabled",true);
								widget.get("otherForm").setData(data);
								var form =widget.get("otherForm");
								form.load("recorder",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recorder=form.getData("recorder","");
										recorder.push(data.recorder);
										form.setData("recorder",recorder);
										form.setValue("recorder",data.recorder);
									}
								});
								widget.show("#memOther .el-form").hide("#memOther .el-grid");
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/memberdailyrecord/" + data.pkMemberDailyRecord + "/delete",function(){
									widget.get("otherGrid").refresh();
								});
								return false;
							}
						}]
					}]
 				}
    		 });
			this.set("otherGrid",otherGrid);
			this.$("#memOther .el-form").addClass("hidden");
			
			this.set("tab",tab);
		},
		afterInitComponent:function(params,widget){
			var subnav=this.get("subnav");
			if(params && params.name){
				subnav.setTitle("生活日志："+params.name);
				$(".J-main-date").attr("data-key", params.date);
				this._initGrid();
			}else{
				subnav.show([0,1]);
				subnav.load({
					id:"defaultMembers",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn":false,
						"memberSigning.room.building":widget.get("subnav").getValue("building"),
						fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number,status"
					},
					callback:function(data){
						if(data.length > 0){
							widget._initGrid();
						}
					}
				});
			}
		}
	});
	
	module.exports = lifeDailyRecord;
});