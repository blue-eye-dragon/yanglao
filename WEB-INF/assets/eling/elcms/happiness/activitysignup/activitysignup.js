define(function(require,exports,module){
	var ELView=require("elview");
	var Calendar=require("calendar");
	var ProFile=require("profile");
	var Subnav=require("subnav-1.0.0");
	var Tab = require("tab"); 
	var Verform = require("form-2.0.0")
	var aw=require("ajaxwrapper");
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var template=require("./activitysignup.tpl");
	require("./activitysignup.css");
	//多语
	var i18ns = require("i18n");
	 var store=require("store");
		var buildings=store.get("user").buildings || [];
	var clickparams = 1 ;
	var ActivitySignup=ELView.extend({
		attrs:{
			template:template
		},
		setGridTitle:function(){
			var length = this.get("grid").getData().length;
			var inParams=this.get("params");
			if(inParams&&inParams.name){
				var title="活动报名次数合计"+length+"次";
			}else{
				var title="活动报名人数合计"+length+"人";
			}
			this.get("grid").setTitle(title);
		},
		setPrintGridTitle:function(){
			var length = this.get("printGrid").getData().length;
			var inParams=this.get("params");
			if(inParams&&inParams.name){
				var title="活动报名次数合计"+length+"次";
			}else{
				var title="活动报名人数合计"+length+"人";
			}
			this.get("printGrid").setTitle(title);
		},
		_getDate:function(timestrap){
			return moment(timestrap).format("YYYY年MM月DD日HH时mm分")
		},
		_getFetchProperties:function(){
			var fetchProperties="*,member.memberSigning.room.number,"+
			"member.personalInfo.name,"+
			"healthData.pkHealthData,"+
			"healthData.nurseLevel,"+
			"healthData.sportIntensity,"+
			"healthData.goOut,"+
			"healthData.livingAlone,"+
			"healthData.description,"+
			"healthData.memAdiphone,"+
			"activity.pkActivity,"+
			"activity.theme,"+
			"activity.type,"+
			"activity.activityStartTime,"+
			"activity.activityEndTime,"+
			"activity.activitySite,"+
			"activity.activityDescription,"+
			"activity.users.pkUser,"+
			"activity.users.name,"+
			"activity.users.code,"+
			"activity.members.personalInfo.name,"+
			"activity.members.personalInfo.pkPersonalInfo,"+
			"activity.mostActivityNumber,"+
			"activity.mostQueueNumber,"+
			"activity.registrationStartTimen,"+
			"activity.registrationEndTimen,"+
			"activity.contactInformation,"+
			"memberInterests.interest.name,"+
			"diseaseHistory.name,"+
			"diseaseHistory.diseaseTime,"+
			"diseaseHistory.diseaseDegree,"+
			"diseaseHistory.diseaseStatus,"+
			"diseaseHistory.critical,"+
			"diseaseHistory.inherited";
			return fetchProperties;
		},
		_getHealthData:function(data){
			var healthData=data.healthData;
			if(healthData.memAdiphone == 0){
				healthData.memAdiphone="不佩戴";
			}
			else if(healthData.memAdiphone == 1){
				healthData.memAdiphone="单耳";
			}
			else if(healthData.memAdiphone == 2){
				healthData.memAdiphone="双耳";
			}
			if(healthData.sportIntensity=="High"){
				healthData.sportIntensity="高";
			}
			else if(healthData.sportIntensity == "Centre"){
				healthData.sportIntensity="中";
			}
			else if(healthData.sportIntensity == "Low"){
				healthData.sportIntensity="低";
			}
			if(healthData.goOut==true){
				healthData.goOut="建议出行";
			}
			else if(healthData.goOut == false){
				healthData.goOut="不建议出行";
			}
			if(healthData.livingAlone==true){
				healthData.livingAlone="是";
			}
			else if(healthData.livingAlone == false){
				healthData.livingAlone="否";
			}
			return healthData;
		},
		_queryDetail:function(pkMember,pkActivity){
			var that=this;
			var verform5=this.get("verform5");
			var inParams = this.get("params");
			var params;
			if(inParams){
				params={
					type:inParams.activitysignupType,
					pkActivity:pkActivity,
					pkMember:pkMember,
					fetchProperties:this._getFetchProperties()
				};
			}else{
				params={
					pkActivity:pkActivity,
					pkMember:pkMember,
					fetchProperties:this._getFetchProperties()
				};
			}
			aw.ajax({
				url:"api/activitysignup/queryDetail",
				data:params,
				dataType:"json",
				success:function(data){ 
					var signMembers=data.signMembers || [];
					var member=data.member || [];
					var date=moment().valueOf();
					var time=data.activity.registrationEndTimen;//报名结束
					var pk=$(".J-pkActivity").val();
					if(pk){
						for(var i=0;i<signMembers.length;i++){
							if(date<time){
								if(signMembers[i].pkMember == member.pkMember){
									$(".J-remove").removeClass("hidden");
									$(".J-enterfor").addClass("hidden");
									break;
								}else{
									if(i == signMembers.length-1){
										$(".J-enterfor").removeClass("hidden");
										$(".J-remove").addClass("hidden");
									}
								}
							}else{
								$(".J-remove").addClass("hidden");
								$(".J-enterfor").addClass("hidden");
							}
						}
					}
					var memberInterests=data.memberInterests || [];
					var memberInterestsStr="";
					for(var i=0;i<memberInterests.length;i++){
						memberInterestsStr+=memberInterests[i].interest.name+"，";
					}
					memberInterestsStr=memberInterestsStr.substring(0, memberInterestsStr.length-1);
					$(".J-memberRoom").val(data.member.memberSigning.room.number);
					$(".J-memberName").val(data.member.personalInfo.name);
					$(".J-memberInterest").val(memberInterestsStr?memberInterestsStr:" ");
					var healthData=that._getHealthData(data);
					$(".J-memberNurseLevel").val(healthData.nurseLevel?healthData.nurseLevel:" ");
					$(".J-memberMemAdiphone").val(healthData.memAdiphone?healthData.memAdiphone:" ");
					$(".J-memberSportIntensity").val(healthData.sportIntensity?healthData.sportIntensity:" ");
					$(".J-memberGoOut").val(healthData.goOut?healthData.goOut:" ");
					$(".J-memberLivingAlone").val(healthData.livingAlone?healthData.livingAlone:" ");
					$(".J-memberDescription").val(healthData.description?healthData.description:" ");
					aw.ajax({
        				url:"api/diseasehistory/diseasequery/beill",
        				dataType:"json",
        				data : {
        					pkMember:data.member.pkMember,
        					fetchProperties:"*,diseaseDetail.name,diseaseDetail.pkDiseaseDetail" 
        				},
        				success:function(data){
        					if(verform5){
        						verform5.setData(data);
        					}
        				}
        			});
				}
			});
		},
		initComponent:function(params,widget){
			var buttonGroups=[];
			var buttons=[];
			var inParams = this.get("params");
				buttonGroups.push({
					id:"building",
					show:false,
					handler:function(key,element){
						if(key==""){
							widget.get("subnav").hide(["defaultMembers"]);
//			        		widget.get("subnav").setData("defaultMembers",[{pkMember:"",personalInfo:{name:"全部"},memberSigning:{room:{number:""}}}]);
						}else{
							widget.get("subnav").show(["defaultMembers"]);
							var subnav=widget.get("subnav");
							//点击楼宇，切换会员
							subnav.load({
								id:"defaultMembers",
								params:{
									"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
									"memberSigning.status":"Normal",
									"memberSigning.houseingNotIn" : false,
									fetchProperties:"personalInfo.name,pkMember,memberSigning.room.number",
									"memberSigning.room.building.pkBuilding":key
								},
								callback:function(data){
									//1.获取到第一个会员
									//2.根据第一个会员查询活动信息api/activitysignup/queryDetail
									if(data[0]!=0 && data.length!=0){
										var pkMember=data[0].pkMember;
										if($(".J-pkActivity").val()){
											widget._queryDetail(pkMember, $(".J-pkActivity").val());
										}
									}
									else{
										Dialog.tip({
											title:"请先选择一个"+i18ns.get("sale_ship_owner","会员")
										});
										return false;
									}
								}
							});
						}
					}
				},{
					id:"order",
					tip:"排序",
					show:false,
					items:[{
	                    key:"member.memberSigning.room.number",
	                    value:"房间号"
					},{
	                    key:"registrationTime",
	                    value:"报名时间"
					}],
					handler:function(key,element){
						aw.ajax({
							url:"api/activitysignup/querypkActivity",
							dataType:"json",
							data : {
								orderString:key,
								pkBuilding:widget.get("subnav").getValue("buildings"),
								pkActivity:$(".J-pkActivity").val(),
								fetchProperties:"*,member.personalInfo.name,member.personalInfo.mobilePhone,member.memberSigning.room.number,member.memberSigning.room.telnumber,activity.mostActivityNumber,activity.mostQueueNumber" 
							},
							success:function(data){
								grid.setData(data);
								widget.setGridTitle();
							}
						});
					}
				},
				{
					id:"buildings",
					items:buildings,
					key:"pkBuilding",
					value:"name",
					show:false,
					showAll:true,
					showAllFirst:true,
					handler:function(key,element){
						aw.ajax({
							url:"api/activitysignup/querypkActivity",
							dataType:"json",
							data : {
								orderString:widget.get("subnav").getValue("order"),
								pkBuilding:widget.get("subnav").getValue("buildings"),
								pkActivity:$(".J-pkActivity").val(),
								fetchProperties:"*,member.personalInfo.name,member.personalInfo.mobilePhone,member.memberSigning.room.number,activity.mostActivityNumber,activity.mostQueueNumber" 
							},
							success:function(data){
								grid.setData(data);
								widget.setGridTitle();
							}
						});
					}
				},{
					id:"defaultMembers",
					key:"pkMember",
					value:"memberSigning.room.number,personalInfo.name",
					items:[],
					handler:function(key,element){
						widget._queryDetail(key, $(".J-pkActivity").val());
					}
				});
			
			buttons.push({
				id:"enterfor",
				text:"报名",
				show:false,
				handler:function(){
					if(inParams&&inParams.flg&&inParams.flg=="Died"){
						Dialog.alert({
							content:i18ns.get("sale_ship_owner","会员")+"已过世！"
						})
						return false;
					}
					var members;
					if(inParams&&inParams.pkMember){
						members=inParams.pkMember;
					}else{
						members=widget.get("subnav").getValue("defaultMembers");
					}
					aw.ajax({
						url:"api/activitysignup/save",
						data:{
							activity:$(".J-pkActivity").val(),
							members:members,
							signupType:"secretary",
							type:$(".J-type").val()
						},
						dataType:"json",
						success:function(data){
							var form = widget.get("verform2");
							var mostActivityNumber = form.getValue("mostActivityNumber");
							var mostQueueNumber = form.getValue("mostQueueNumber");
							var title ="";
							if(data[0]){
								if(data[0].activityStatus.key=="Success"){
									title="报名成功！";
								}else if(data[0].activityStatus.key=="Queuing"){
									title="报名成功！但此活动参加人数已满"+mostActivityNumber+"，您处于排队中！";
								}
								Dialog.alert({
									content:title
								});
								
							}else{
								Dialog.alert({
									content:"对不起，报名失败！此活动参加人数"+mostActivityNumber+"人和排队人数"+mostQueueNumber+"人，都已满"
								});
								return
							}
							$(".J-tab").removeClass("hidden");
							$(".J-enterfor").addClass("hidden");
							$(".J-calendar").addClass("hidden");
							$(".J-remove").removeClass("hidden");
							$(".J-cancel").addClass("hidden");
						}
					});
					widget.get("subnav").show(["return"]);
				}
			},{
				id:"remove",
				text:"取消报名",
				show:false,
				handler:function(){
					aw.ajax({
						url:"api/activityreport/query",
						data:{
							activity:$(".J-pkActivity").val(),
							member:widget.get("subnav").getValue("defaultMembers"),
						},
						dataType:"json",
						success:function(result){
							if(result.length>0){
								Dialog.alert({
									content:"该"+i18ns.get("sale_ship_owner","会员")+"此活动已记录"+i18ns.get("sale_ship_owner","会员")+"活动报告，不能取消报名！"
								})
								return false;
							}else{
								aw.ajax({
									url:"api/activitysignup/cancel",
									data:{
										activity:$(".J-pkActivity").val(),
										members:widget.get("subnav").getValue("defaultMembers"),
										type:$(".J-type").val(),
										signupType:"secretary",
									},
									dataType:"json",
									success:function(data){
										if(data.msg=="操作成功"){
											Dialog.tip({
												title:"取消报名成功"
											});
											$(".J-enterfor").removeClass("hidden");
											$(".J-remove").addClass("hidden");
										}else{
											$(".J-enterfor").addClass("hidden");
											$(".J-remove").removeClass("hidden");
										}
										$(".J-tab").removeClass("hidden");
										$(".J-calendar").addClass("hidden");
										
									}
								});
							}
						}
					});
					widget.get("subnav").show(["return"]);
				}
			},{
				id:"queryActiveSign",
				text:"查看报名",
				show:false,
				handler:function(){
					var inParams = widget.get("params");
					$(".J-defaultMembers,.J-building").addClass("hidden");
					$(".J-queryActiveSign").addClass("hidden");
					if(inParams&&inParams.name){
						$(".J-print,.J-order").removeClass("hidden");
					}else{
						$(".J-print,.J-buildings,.J-order").removeClass("hidden");
					}
					$(".J-tab").addClass("hidden");
					$(".J-activeSignList").removeClass("hidden");
					$(".J-return").removeClass("hidden");
					$(".J-enterfor").addClass("hidden");
					$(".J-remove").addClass("hidden");
					$(".J-cancel").addClass("hidden");
					if(inParams&&inParams.name){
						aw.ajax({
							url:"api/activitysignup/querypkActivitypkMember",
							dataType:"json",
							data : {
								"pkMember":inParams.pkMember,
								pkActivity:$(".J-pkActivity").val(),
								fetchProperties:"*,member.personalInfo.name,member.personalInfo.mobilePhone,member.personalInfo.phone,member.memberSigning.room.number,member.memberSigning.room.telnumber,activity.mostActivityNumber,activity.mostQueueNumber" 
							},
							success:function(data){
								grid.setData(data);
								printGrid.setData(data);
								widget.setGridTitle();
							}
						});
					}else{
						aw.ajax({
							url:"api/activitysignup/querypkActivity",
							dataType:"json",
							data : {
								pkBuilding:widget.get("subnav").getValue("buildings"),
								pkActivity:$(".J-pkActivity").val(),
								fetchProperties:"*,member.personalInfo.name,member.personalInfo.mobilePhone,member.personalInfo.phone,member.memberSigning.room.number,member.memberSigning.room.telnumber,activity.mostActivityNumber,activity.mostQueueNumber" 
							},
							success:function(data){
								grid.setData(data);
								printGrid.setData(data);
								widget.setGridTitle();
							}
						});
					}
					
				}
			},{
				id:"print",
				text:"打印",
				show:false,
				handler:function(){
					var subnav=widget.get("subnav");
					subnav.setTitle($(".J-theme").val());
					subnav.hide(["return","print","buildings","order"]);
					widget.hide([".J-activeSignList"]).show([".J-printGrid"]);
					var data=widget.get("grid").getData();
					widget.get("printGrid").setData(data);
					widget.setPrintGridTitle();
					window.print();
					subnav.setTitle("活动报名");
					subnav.show(["return","print","buildings","order"]);
					widget.hide([".J-printGrid"]).show([".J-activeSignList"]);
				}
			},{
				id:"return",
				text:"返回",
				show:false,
				handler:function(){
					var inParams = widget.get("params");
                    if(inParams&&inParams.name){
                    	widget.get("subnav").setTitle("活动报名："+inParams.name);
					}else{
						$(".J-defaultMembers,.J-building").removeClass("hidden");
					}
					
					$(".J-activeSignList").addClass("hidden");
					$(".J-activeSign").addClass("hidden");
					$(".J-tab,.J-order,.J-buildings").addClass("hidden");
					$(".J-print").addClass("hidden");
					$(".J-queryActiveSign").addClass("hidden");
					$(".J-return").addClass("hidden");
					$(".J-enterfor").addClass("hidden");
					$(".J-remove").addClass("hidden");
					$(".J-calendar").removeClass("hidden");
					if(inParams){
						$(".J-cancel").removeClass("hidden");
					}else{
						$(".J-cancel").addClass("hidden");
					};
					clickparams = 1;
				}
			});
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"活动报名",
					buttons:buttons,
					buttonGroup:buttonGroups
				}
			});
			widget.set("subnav",subnav);
			var params="";
			if(widget.get("params")){
				params={
					type:widget.get("params").activitysignupType
				};
			};
			var calendar=new Calendar({
				parentNode:".J-calendar",
				url:"api/activity/query",
				params:params,
				translate:{
					title:"theme",
					start:"activityStartTime",
					end:"activityEndTime"
				},
				model:{
					calendar:{
						 click:function(data,calEvent, jsEvent, view){
						   if(clickparams == 1){
							clickparams = 0;
							subnav.hide(["buildings","order"]);
							var inParams=widget.get("params");
							if(inParams&&inParams.name){
								var pkmember=inParams.pkMember;
							}else{
								if(!calEvent.id){
									return false;
								}
								$(".J-defaultMembers,.J-building").removeClass("hidden");
								if(!widget.get("subnav").getValue("defaultMembers")){
									Dialog.tip({
										title:"请先选择一个"+i18ns.get("sale_ship_owner","会员")
									});
									return false;
								}
							}
							
							widget.get("tab") ? widget.get("tab").destroy() : true;
							var params;
							if(widget.get("params")){
								if(inParams&&inParams.name){
									params={
											pkActivity:data.pkActivity,
											pkMember:pkmember,
											fetchProperties:widget._getFetchProperties(),
											type:widget.get("params").activitysignupType,
											activityStatus:"Success"
										};
								}else{
									params={
											pkActivity:data.pkActivity,
											pkMember:widget.get("subnav").getValue("defaultMembers"),
											fetchProperties:widget._getFetchProperties,
											type:widget.get("params").activitysignupType,
											activityStatus:"Success"
										};
									}
							}else{
								params={
										pkActivity:data.pkActivity,
										pkMember:widget.get("subnav").getValue("defaultMembers"),
										fetchProperties:widget._getFetchProperties,
										activityStatus:"Success"
									};
							}
							aw.ajax({
								url:"api/activitysignup/queryDetail",
								data:params,
								dataType:"json",
								success:function(data){
									var signMembers=data.signMembers || [];
									var member=data.member || [];
									var date=moment().valueOf();
									var time=data.activity.registrationEndTimen;//报名结束
									if(date<time){
										if(inParams&&inParams.flg=="deceasedmembers"){
											$(".J-enterfor").addClass("hidden");
										}else{
											if(signMembers.length>0){
												for(var i=0;i<signMembers.length;i++){
													if(signMembers[i].pkMember == member.pkMember){
														$(".J-remove").removeClass("hidden");
														break;
													}else{
														if(i == signMembers.length-1){
															$(".J-enterfor").removeClass("hidden");
														}
													}
												}
										}else{
												$(".J-enterfor").removeClass("hidden");
										}
										}
									}else{
										$(".J-remove").addClass("hidden");
										$(".J-enterfor").addClass("hidden");
									}
									
									$(".J-queryActiveSign").removeClass("hidden");
									$(".J-calendar").addClass("hidden");
									$(".J-tab").removeClass("hidden");
									$(".J-return").removeClass("hidden");
									$(".J-cancel").addClass("hidden");
									//获取会员健康状态
									var healthData=widget._getHealthData(data);
									//1.获取活动的秘书负责人和会员负责人
									var activity=data.activity;
									//秘书负责人
									var secretarys="";
									var secretary=activity.users || [];
									for(var s=0;s<secretary.length;s++){
										secretarys+=secretary[s].name+",";
									}
									secretarys=secretarys.substring("", secretarys.length-1);
									//会员负责人
									var members="";
									var member=activity.members || [];
									for(var s=0;s<member.length;s++){
										members+=member[s].personalInfo.name+",";
									}
									members=members.substring("", members.length-1);
									var signMemberNum=data.signMembers.length || "0";
									//会员兴趣爱好
									var memberInterests=data.memberInterests || [];
									var memberInterestsStr="";
									for(var i=0;i<memberInterests.length;i++){
										memberInterestsStr+=memberInterests[i].interest.name+"，";
									}
									memberInterestsStr=memberInterestsStr.substring("", memberInterestsStr.length-1);
									var diseaseHistory=data.diseaseHistory ||[];
									
									var tab=new Tab({
			            				parentNode:".J-tab",
			            				model:{
			            					items:[{
			            						id:"step1",
			            						title:"活动简介" 
			            					},{
			            						id:"step2",
			            						title:"报名相关事宜"
			            					},{
			            						id:"step3",
			            						title:i18ns.get("sale_ship_owner","会员")+"基本信息及活动推荐程度"
			            					},{
			            						id:"step4",
			            						title:i18ns.get("sale_ship_owner","会员")+"健康信息"
			            					},{
			            						id:"step5",
			            						title:i18ns.get("sale_ship_owner","会员")+"疾病信息"
			            					}]
			            				}
			            			});
									widget.set("tab",tab);
			            			
			            			var profile=new ProFile({
			                            parentNode:"#step1",
			                            model:{
			                            	defaultButton:false,
			                            	items:[{
												title:"活动简介",
												icon:"github",
												img:{
													idAttribute:"pkActivity",
													url:"api/attachment/activityphoto/"
												},
												children:[{
													name:"pkActivity",
													type:"hidden",
													defaultValue:activity.pkActivity
												},{
													name:"type",
													type:"hidden",
													defaultValue:activity.type
												},{
													name:"theme",
													label:"活动主题",
													defaultValue:activity.theme,
													readonly:true
												},{
													label:"活动时间",
													defaultValue:widget._getDate(activity.activityStartTime)+"  至   "+widget._getDate(activity.activityEndTime),
													readonly:true
												},{
													label:"活动地点",
													defaultValue:(activity.activitySite?activity.activitySite:null),
													readonly:true
												},{
													label:"秘书负责人",
													defaultValue:(secretarys?secretarys:null),
													readonly:true
												},{
													label:i18ns.get("sale_ship_owner","会员")+"负责人",
													defaultValue:(members?members:null),
													readonly:true
												},{
													name:"activityDescription",
													label:"活动描述",
													type:"textarea",
													defaultValue:activity.activityDescription,
													readonly:true,
													height:"100"
												}]
			                            	}]
			                            }
			                        });
			            			widget.set("profile",profile);
			                        //触发活动描述的textarea
			                        $(".J-activityDescription").trigger("input");
			                        
			                        var verform2 = new Verform({
			                            parentNode:"#step2",
			                            model:{
			                            	defaultButton:false,
											items:[{
												name:"mostActivityNumber",
												label:"报名人数上限",
												defaultValue:activity.mostActivityNumber,
												readonly:true
											},{
												name:"mostQueueNumber",
												label:"排队人数上限",
												defaultValue:activity.mostQueueNumber,
												readonly:true
											},{
												label:"报名开始日期",
												defaultValue:widget._getDate(activity.registrationStartTimen),
												readonly:true
											},{
												label:"报名截止日期",
												defaultValue:widget._getDate(activity.registrationEndTimen),
												readonly:true
											},{
												label:"报名方式",
												defaultValue:activity.contactInformation,
												readonly:true
											},{
												name:"signup",
												label:"已报名",
												defaultValue:signMemberNum,
												readonly:true
											}]
			                            }
			                        });
			                        widget.set("verform2",verform2);
			                        
			                        var verform3 = new Verform({
			                            parentNode:"#step3",
			                            model:{
			                            	defaultButton:false,
											items:[{
												name:"memberRoom",
												label:"房间号",
												defaultValue:data.member.memberSigning.room.number,
												readonly:true
											},{
												name:"memberName",
												label:"姓名",
												defaultValue:data.member.personalInfo.name,
												readonly:true
											},{
												name:"memberInterest",
												label:"兴趣爱好",
												defaultValue:memberInterestsStr,
												readonly:true
											},{
												label:"推荐程度",
												defaultValue:"推荐",
												readonly:true
											}]
			                            }
			                        });
			                        widget.set("verform3",verform3);
			                        
			                        var verform4 = new Verform({
			                        	
			                            parentNode:"#step4",
			                            model:{
			                            	defaultButton:false,
											items:[{
												name:"memberNurseLevel",
												label:"巡检等级",
												defaultValue:healthData.nurseLevel,
												readonly:true
											},{
												name:"memberMemAdiphone",
												label:"佩戴助听器",
												defaultValue:healthData.memAdiphone,
												readonly:true
											},{
												name:"memberSportIntensity",
												label:"运动强度",
												defaultValue:healthData.sportIntensity,
												readonly:true
											},{
												name:"memberGoOut",
												label:"建议出行",
												defaultValue:healthData.goOut,
												readonly:true
											},{
												name:"memberLivingAlone",
												label:"是否独居",
												defaultValue:healthData.livingAlone,
												readonly:true
											},{
												name:"memberDescription",
												label:"身体状况描述",
												type:"textarea",
												defaultValue:healthData.description,
												readonly:true,
												height:"100"
											}]
			                            }
			                        });
			                        widget.set("verform4",verform4);
			                        
			                        var verform5=new Grid({
			            				parentNode:"#step5",
			            				params:{
			            					member:data.member.pkMember,
			            					fetchProperties:"*,diseaseDetail.name,diseaseTime,diseaseDegree,diseaseDetail.pkDiseaseDetail",
			            				},
			            				model:{
			            					columns:[{
			            						key:"diseaseDetail.name",
			            						name:"疾病"
			            					},{
			            						key:"diseaseTime",
			            						name:"患病时间",
			            						format:"date"
			            					},{
			            						key:"diseaseDegree",
			            						name:"病情",
			            						format:function(value,row){
			            							if(value=="SLIGHT"){
			            								return "轻微";
			            							}else if(value=="COMMONLY"){
			            								return "一般";
			            							}else{
			            								return "严重";
			            							}
			            						}
			            					},{
			            						key:"diseaseStatus.value",
			            						name:"状态"
			            					},{
			            						key:"critical",
			            						name:"重大疾病",
			            						format:function(value,row){
			            							return value ? "是" : "否";
			            						}
			            					},{
			            						key:"inherited",
			            						name:"遗传病",
			            						format:function(value,row){
			            							return value ? "是" : "否";
			            						}
			            					}]
			            				}
			            			});
			                        widget.set("verform5",verform5);
			                        
			            			aw.ajax({
			            				url:"api/diseasehistory/query",
			            				dataType:"json",
			            				data : {
			            					member:data.member.pkMember,
			            					fetchProperties:"*,diseaseDetail.name,diseaseDetail.pkDiseaseDetail" 
			            				},
			            				success:function(data){
			            					widget.get("verform5").setData(data);
			            				}
			            			});
								}
							});
							return false;
						}
						}
					}
				}
			});
			calendar.refresh();
			var grid=new Grid({
				parentNode:".J-activeSignList",
				params:params,
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")+"姓名"
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.mobilePhone",
						name:"联系方式",
						format:function(value,row){
							return (row.member.memberSigning.room.telnumber ||"无") +"/"+(row.member.personalInfo.mobilePhone ||"无")
						}
						
					},{
						key:"registrationTime",
						name:"报名时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm:ss"
						}
					},{
						key:"activityStatus.value",
						name:"状态"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"signup",
							text:"重新报名",
							show:function(value,row){
								console.info(row);
								if(row.activityStatus != null){
									if(row.activityStatus.key == "Cancelled"){
										return true;
									}else{
										return false;
									}
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								aw.saveOrUpdate("api/activitysignup/save",{
									activity:$(".J-pkActivity").val(),
									members:data.member.pkMember,
									type:$(".J-type").val(),
									signupType:"secretary"
								},function(data){
									console.info(data);
									if(data[0].pkActivitysignup){
										Dialog.tip({
											title:data[0].activityStatus.value
										});
									}
									aw.ajax({
										url:"api/activitysignup/querypkActivity",
										dataType:"json",
										data : {
											pkBuilding:widget.get("subnav").getValue("buildings"),
											fetchProperties:"*,member.personalInfo.name,member.personalInfo.mobilePhone,member.memberSigning.room.number,activity.mostActivityNumber,activity.mostQueueNumber",
											pkActivity:$(".J-pkActivity").val()
										},
										success:function(data){
											grid.setData(data);
										}
									});
		 	 					});
							}
						},{
							key:"cancel",
							text:"取消报名",
							show:function(value,row){
								console.info(row);
								if(row.activityStatus != null){
									if(row.activityStatus.key == "Success" || row.activityStatus.key == "Queuing"){
										return true;
									}else{
										return false;
									}
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								aw.saveOrUpdate("api/activitysignup/cancel",{
									activity:$(".J-pkActivity").val(),
									members:data.member.pkMember,
									type:$(".J-type").val(),
									signupType:"secretary",
								},function(data){
									if(data.msg=="操作成功"){
										$(".J-remove").addClass("hidden");
										Dialog.tip({
											title:"取消报名成功"
										});
									}else{
										$(".J-enterfor").addClass("hidden");
										$(".J-remove").removeClass("hidden");
									}
									aw.ajax({
										url:"api/activitysignup/querypkActivity",
										dataType:"json",
										data : {
											pkBuilding:widget.get("subnav").getValue("buildings"),
											fetchProperties:"*,member.personalInfo.name,member.personalInfo.mobilePhone,member.memberSigning.room.number,activity.mostActivityNumber,activity.mostQueueNumber",
											pkActivity:$(".J-pkActivity").val()
										},
										success:function(data){
											grid.setData(data);
										}
									});
		 	 					});
							}
						}]
					}]
				}
			});
			widget.set("grid",grid);
			
			var printGrid=new Grid({
				parentNode:".J-printGrid",
//				url:"api/activitysignup/querypkActivity",
//				params:{
//					orderString:widget.get("subnav").getValue("order"),
//					pkBuilding:widget.get("subnav").getValue("buildings"),
//					pkActivity:$(".J-pkActivity").val(),
//					fetchProperties:"*,member.personalInfo.name,member.personalInfo.mobilePhone,member.memberSigning.room.number,activity.mostActivityNumber" 
//				},
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")+"姓名"
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.mobilePhone",
						name:"联系方式",
						format:function(value,row){
							return (row.member.memberSigning.room.telnumber ||"无") +"/"+(row.member.personalInfo.mobilePhone ||"无")
						}
						
					},{
						key:"registrationTime",
						name:"报名时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm:ss"
						}
					},{
						key:"activityStatus.value",
						name:"状态"
					}]
				}
			});
			widget.set("printGrid",printGrid);
		},
		afterInitComponent:function(params,widget){
			clickparams = 1;
			var subnav=widget.get("subnav");
			subnav.hide(["buildings"]);
        	var pkBuilding=params ? params.pkBuilding : "";
        	if(pkBuilding){
        		subnav.setValue("building",pkBuilding);
        	}
        	if(params&&params.name){
        		subnav.setValue("defaultMembers",params.pkMember);
        		subnav.hide(["buildings","defaultMembers"]);
        		this.get("subnav").setTitle("活动报名："+params.name);
        	}else{
        		subnav.load({
    				id:"defaultMembers",
    				params:{
    					"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
    					"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
    					fetchProperties:"personalInfo.name,pkMember,memberSigning.room.number",
    					"memberSigning.room.building":subnav.getValue("building")
    				},
    				callback:function(data){
            			widget.get("subnav").show(["building"]);
    				}
    			});
        	}
        	
		}
	});
	module.exports=ActivitySignup;
});
