define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var BaseDoc=require("basedoc");
	var Form =require("form-2.0.0")
	var ProFile=require("profile");	
	var Dialog = require("dialog-1.0.0");
	var Tab = require("tab"); 
	var enmu = require("enums");
	var _ = require("underscore");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-tab hidden'></div>"; 
	var PhysicalExam = ELView.extend({
		_newTab:function(){			
			return new Tab({
				parentNode:".J-tab",
				model:{
					items:[{
						id:"step1",
						title:i18ns.get("sale_ship_owner","会员")+"体检总结" 
					}]
				}
			});
		},
		_loadMember:function(member,widget){
			widget.get("form").load("member",{
				callback:function(){
					var formMember=widget.get("form").getData("member","");
					formMember.push(member);
					widget.get("form").setData("member",formMember);
					widget.get("form").setValue("member",member.pkMember);
					widget.get("form").setAttribute("member","readonly","readonly");
				}
			});
		},
		setAddTab:function(data){
			widget=this;
			widget.get("form").load("physicalExaminationScheme",{
				callback:function(dat){
					for(var i=0;i<dat.length;i++){
						if(dat[i].status.key=="Default"){
							widget.get("form").setValue("physicalExaminationScheme",dat[i]);
        					widget._getScheme(dat[i].pkPhysicalExaminationScheme,null,null,widget,false);
						}
					}
				}
			});
			widget._setFormAttribute (data, widget);
		},
		_setFormAttribute : function(data, widget){
			widget.get("form").setAttribute("birthday","disabled","disabled");
			widget.get("form").setAttribute("nationality","readonly","readonly");
			widget.get("form").setAttribute("maritalStatus","readonly","readonly");
			if(data&&data.pkPhysicalExam&&data.pk&&data.pk!="null"){
				widget.get("form").setValue("pkPhysicalExam",data.pkPhysicalExam);
			}
			if(data!= null && data.version!=null){
				widget.get("form").setValue("version",data.version);
			}else{
				widget.get("form").setValue("version",0);
			}
		},
		_newForm:function(data, widget){	
			return new Form({
				parentNode:"#step1",
				model:{
					id : "baseinfo",
					defaultButton:false,
					items:[{
						name:"pkPhysicalExam",
						defaultValue:(data?data.pkPhysicalExam:null),
						type:"hidden"
					},{
						name:"version",
						defaultValue:(data?data.version:0),
						type:"hidden"
					},{
							name:"member",
							label:i18ns.get("sale_ship_owner","会员")+"姓名",
							validate : [ "required" ],
							type:"select",
							lazy:true,
							readonly:true,
							url:"api/member/query",
							className:{
								container:"col-md-6",label:"col-md-3"
							},
							params:function(){
								return {
									"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
									"memberSigning.status":"Normal",
 									"memberSigning.houseingNotIn":false,
									"memberSigning.room.building":widget.get("subnav").getValue("building"),
									fetchProperties:"*,personalInfo.idType,personalInfo.pkPersonalInfo,personalInfo.name,memberSigning.room.number,memberSigning.room.pkRoom,personalInfo.sex,personalInfo.birthday,personalInfo.birthplace,personalInfo.nationality,personalInfo.idNumber,personalInfo.maritalStatus"
								};
							},
							key:"pkMember",
							value:"memberSigning.room.number,personalInfo.name"
						},{
							name:"room",
							label:"房间号",
							type:"select",
							lazy:true,
							readonly:true,
							url:"api/room/query",
							validate : [ "required" ],
							className:{
								container:"col-md-6",label:"col-md-3"
							},
							params:function(){
								return {
									"building":widget.get("subnav").getValue("building"),
									fetchProperties:"number,pkRoom"
								};
							},
							key:"pkRoom",
							value:"number"
						},{
							name:"sex",
							label:"性别",
							defaultValue:(data?(data.member.personalInfo.sex?data.member.personalInfo.sex.value:null):null),
							type:"text",
							readonly:true,
							className:{
								container:"col-md-6",label:"col-md-3"
							},
						},{
							name:"birthplace",
							label:"出生地",
							defaultValue:(data?data.member.personalInfo.birthplace:null),
							type:"text",
							readonly:true,
							className:{
								container:"col-md-6",label:"col-md-3"
							},
						},{
							name:"birthday",
							label:"出生日期",
							defaultValue:(data?data.member.personalInfo.birthday:""),
							type:"date",
							className:{
								container:"col-md-6",label:"col-md-3"
							},
						},{
							name:"nationality",
							label:"民族",
							defaultValue:(data?data.member.personalInfo.nationality:""),
							type:"select",
							readonly:true,
							options:BaseDoc.nationality,
							className:{
								container:"col-md-6",label:"col-md-3"
							},
						},{
							name:"idNumber",
							label:"证件号",
							defaultValue:(data?(data.member.personalInfo.idType&&data.member.personalInfo.idNumber?(data.member.personalInfo.idType.value+":"+data.member.personalInfo.idNumber):null):null),
							type:"text",
							readonly:true,
							className:{
								container:"col-md-6",label:"col-md-3"
							},
						},{
							name:"maritalStatus",
							label:"婚姻状况",
							defaultValue:(data?data.member.personalInfo.maritalStatus:""),
							options:BaseDoc.maritalStatus,
							type:"select",
							readonly:true,
							className:{
								container:"col-md-6",label:"col-md-3"
							},
						},{
							name:"updateTime",
							label:"体检时间",
							defaultValue:(data?(data.updateTime?data.updateTime:moment()):moment()),
							type:"date",
							validate : [ "required" ],
							mode:"Y-m-d",
							className:{
								container:"col-md-6",label:"col-md-3"
							},
						},{
							name:"physicalExaminationScheme",
							label:"体检方案",
							validate : [ "required" ],
							type:"select",
							lazy:true,
							url:"api/physicalexaminationscheme/queryall",
							className:{
								container:"col-md-6",label:"col-md-3"
							},
							params:function(){
								return {
									"statusIn":"Using,Default",
									fetchProperties:"name,status,pkPhysicalExaminationScheme"
								};
							},
							key:"pkPhysicalExaminationScheme",
							value:"name"
						},{
							name:"examDepart",
							label:"体检机构",
							defaultValue:data==null||data.examDepart==""?"":data.examDepart,
							type:"select",
							key:"pkHospital",
							url:"api/hospital/query",
							lazy:true,
							value:"name",
							className:{
								container:"col-md-6",label:"col-md-3",
							},
						},{
							name:"examContact",
							label:"联系方式",
							defaultValue:data==null||data.examContact==""?null:data.examContact,
							type:"text",
							className:{
								container:"col-md-6",label:"col-md-3",
							},
						},{
							name:"clanHistory",
							label:"家族史",
							type:"textarea",
							readonly:true,
							className:{
								container:"col-md-6",label:"col-md-3",
							},
							style:{
								value:"width:180%;height:70px;"
							},
						},{
							name:"diseaseHistory",
							label:"既往病史",
							type:"textarea",
							readonly:true,
							className:{
								container:"col-md-6",label:"col-md-3",
							},
							style:{
								value:"width:180%;height:70px;"
							},
						},{
							name:"examEvaluation",
							label:"体检总结",
							defaultValue:(data?(data.examEvaluation?data.examEvaluation:null):null),
							type:"textarea",
							className:{
								container:"col-md-6",label:"col-md-3",
							},
							style:{
								value:"width: 180%;max-height: 110px;min-height: 110px;"
							}
						}]
				}
			});
		},
		_getScheme : function (pk,examData,tab,widget,disable){
			if (tab==null){
				tab = widget.get("tab");
			}
			aw.ajax({
				url:"api/physicalexaminationschemedetail/query",
				data:{
					"physicalExaminationScheme.pkPhysicalExaminationScheme":pk,
					fetchProperties:"orderNo,pkPhysicalExaminationSchemeDetail,version,physicalExaminationItemType.*,healthExamDataType.*"
				},
				dataType:"json",
				success:function(data){
					var ret = [];
					for(var i=0;i<data.length;i++){
						ret.push(data[i].physicalExaminationItemType.name);
					}
					var ret=_.uniq(ret);
					var m=2;
					for(var j=0;j<ret.length;j++){
						var detail=[];
						for(var t=0;t<data.length;t++){
							var b=0;
							if(ret[j]==data[t].physicalExaminationItemType.name){
								detail.push(data[t]);
							}
						}
						tab.addItem({
							id:"step"+m,
							title:ret[j] 
						});
						var items=[];
						for(var a=0;a<detail.length;a++){
							var children=[{
								name:"type",
								defaultValue:detail[a].healthExamDataType.pkHealthExamDataType,
								type:"hidden", 
							},{
								name:"source",
								defaultValue:"HealthExam",
								type:"hidden",
							}];
							if(detail[a].healthExamDataType.name1){
								var value=null;
								if (examData){									
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value1;
										}
									}
								}
								var chi={name:"value1",label:detail[a].healthExamDataType.name1,defaultValue:value==""?null:value,type:"text"};
								if(detail[a].healthExamDataType.inputNumeric1==true){
								 	chi.validate=[ "decimal_two" ];
								}
								children.push(chi);
							}
							if(detail[a].healthExamDataType.name2){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value2;
										}
									}
								}
								var chi={name:"value2",label:detail[a].healthExamDataType.name2,defaultValue:value==""?null:value,type:"text"};
								if(detail[a].healthExamDataType.inputNumeric2==true){
								 	chi.validate=[ "decimal_two" ];
								}
								children.push(chi);
							}if(detail[a].healthExamDataType.name3){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value3;
										}
									}
								}
								var chi={name:"value3",label:detail[a].healthExamDataType.name3,defaultValue:value==""?null:value,type:"text"};
								if(detail[a].healthExamDataType.inputNumeric3==true){
								 	chi.validate=[ "decimal_two" ];
								}
								children.push(chi);
							}if(detail[a].healthExamDataType.name4){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value4;
										}
									}
								}
								var chi={name:"value4",label:detail[a].healthExamDataType.name4,defaultValue:value==""?null:value,type:"text"};
								if(detail[a].healthExamDataType.inputNumeric4==true){
								 	chi.validate=[ "decimal_two" ];
								}
								children.push(chi);
							}if(detail[a].healthExamDataType.name5){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value5;
										}
									}
								}
								var chi={name:"value5",label:detail[a].healthExamDataType.name5,defaultValue:value==""?null:value,type:"text"};
								if(detail[a].healthExamDataType.inputNumeric5==true){
								 	chi.validate=[ "decimal_two" ];
								}
								children.push(chi);
							}if(detail[a].healthExamDataType.name6){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value6;
										}
									}
								}
								var chi={name:"value6",label:detail[a].healthExamDataType.name6,defaultValue:value==""?null:value,type:"text"};
								if(detail[a].healthExamDataType.inputNumeric6==true){
								 	chi.validate=[ "decimal_two" ];
								}
								children.push(chi);
							}
							items.push({
								title:detail[a].healthExamDataType.name,
								children:children
							});
						}
						var id="healthexamdata"+(m-1);
						var profile=new ProFile({
							parentNode:"#step"+m,
							model:{
								id:id,
								defaultButton:false,
								items:items
							}
						});
						widget.set("profile"+(m-1),profile);
						if (disable){
							profile.setDisabled(true);							 
						}
						m++;
					}
				}
			});
		},
		events : {
			"change .J-form-baseinfo-select-member ":function(e){
				var form=this.get("form");
				var pkType=form.getValue("member");
				var dataType = form.getData("member",{
					pk:pkType
				});
    			form.setValue("room",dataType.memberSigning.room.pkRoom); 
    			form.setAttribute("room","readonly","readonly");
    			form.setValue("sex",dataType.personalInfo.sex.value);
    			form.setValue("birthday",dataType.personalInfo.birthday);
    			form.setValue("birthplace",dataType.personalInfo.birthplace);
    			form.setValue("nationality",dataType.personalInfo.nationality);
    			form.setValue("idNumber",dataType.personalInfo.idType.value+":"+dataType.personalInfo.idNumber);
    			form.setValue("maritalStatus",dataType.personalInfo.maritalStatus);
    			aw.ajax({
					url:"api/diseasehistory/query",
					data:{
						member:pkType,
						fetchProperties:"diseaseDetail.name,diseaseDetail.disease.name,inherited"
					},
					dataType:"json",
					success:function(data){
						var diseaseHistory="";
						var clanHistory="";
						for(var i=0;i<data.length;i++){
							if(data[i].inherited==true){
								clanHistory+=data[i].diseaseDetail.name+",";
							}
							diseaseHistory+=data[i].diseaseDetail.name+",";
						}
						diseaseHistory=diseaseHistory.substring(0,diseaseHistory.length-1);
						clanHistory=clanHistory.substring(0,clanHistory.length-1);
						form.setValue("diseaseHistory",diseaseHistory);
						form.setValue("clanHistory",clanHistory);
					}
				});
			},
			"change .J-form-baseinfo-select-physicalExaminationScheme ":function(e){
				var widget=this;
				var form=this.get("form");
				var tab=this.get("tab");
				tab.removeItems(1);//页签只保留一个基本信息
				var  pk =form.getValue("physicalExaminationScheme");
				if(pk!=null&&pk!=""){
	    			aw.ajax({
						url:"api/physicalexaminationschemedetail/query",
						data:{
							"physicalExaminationScheme.pkPhysicalExaminationScheme":pk,
							fetchProperties:"orderNo,pkPhysicalExaminationSchemeDetail,version,physicalExaminationItemType.*,healthExamDataType.*"
						},
						dataType:"json",
						success:function(data){
							var ret = [];
							for(var i=0;i<data.length;i++){
								ret.push(data[i].physicalExaminationItemType.name);
							}
							var ret=_.uniq(ret);
								 var m=2;
								 for(var j=0;j<ret.length;j++){
									 var detail=[];
									 for(var t=0;t<data.length;t++){
										 var b=0;
										 if(ret[j]==data[t].physicalExaminationItemType.name){
											 detail.push(data[t].healthExamDataType);
										 }
									 }
									 tab.addItem({
				            			id:"step"+m,
				            			title:ret[j] 
				            		 });
									 var items=[];
									 for(var a=0;a<detail.length;a++){
										 var children=[{
											 name:"type",
											 defaultValue:detail[a].pkHealthExamDataType,
				    						 type:"hidden", 
										 },{
											 name:"source",
											 defaultValue:"HealthExam",
				    						 type:"hidden",
										 }];
										 if(detail[a].name1){
											 var chi={name:"value1",label:detail[a].name1,type:"text"};
											 if(detail[a].inputNumeric1==true){
											 	chi.validate=[ "money" ];
											 }
											 children.push(chi);
										 }
										 if(detail[a].name2){
											 var chi={name:"value2",label:detail[a].name2,type:"text"};
											 if(detail[a].inputNumeric2==true){
											 	chi.validate=[ "money" ];
											 }
											 children.push(chi);
										 }if(detail[a].name3){
											 var chi={name:"value3",label:detail[a].name3,type:"text"};
											 if(detail[a].inputNumeric3==true){
											 	chi.validate=[ "money" ];
											 }
											 children.push(chi);
										 }if(detail[a].name4){
											 var chi={name:"value4",label:detail[a].name4,type:"text"};
											 if(detail[a].inputNumeric4==true){
											 	chi.validate=[ "money" ];
											 }
											 children.push(chi);
										 }if(detail[a].name5){
											 var chi={name:"value5",label:detail[a].name5,type:"text"};
											 if(detail[a].inputNumeric5==true){
											 	chi.validate=[ "money" ];
											 }
											 children.push(chi);
										 }if(detail[a].name6){
											 var chi={name:"value6",label:detail[a].name6,type:"text"};
											 if(detail[a].inputNumeric6==true){
											 	chi.validate=[ "money" ];
											 }
											 children.push(chi);
										 }
										 items.push({
					    						title:detail[a].name,
					    						children:children
					    				 });
									 }
									 var id="healthexamdata"+(m-1);
									 var profile=new ProFile({
						        			parentNode:"#step"+m,
						        			model:{
						    					id:id,
						    					defaultButton:false,
						    					items:items
						    				}
									 });
									 widget.set("profile"+(m-1),profile);
									 m++;
								 }
						}
	    			});
				}
			},
		},
		attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"体检",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/physicalexam/search",
							data:{
								"memberType":"Member",
								"member.statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
								"member.memberSigning.status":"Normal",
								"member.memberSigning.houseingNotIn":false,
								s:str,
								properties:"member.personalInfo.name,member.memberSigning.room.number",
								"orderString":"member.memberSigning.room.number,member.iorder,updateTime:desc",
								fetchProperties:"examDepart.pkHospital,examDepart.name,pkPhysicalExam,version,updateTime,status,examContact,examEvaluation,familyDoctor.name," +
								"familyDoctor.pkUser,physicalExaminationScheme.name,physicalExaminationScheme.pkPhysicalExaminationScheme," +
								"member.pkMember,member.personalInfo.birthplace,member.personalInfo.maritalStatus.*," +
								"member.personalInfo.idType,member.personalInfo.name,member.personalInfo.birthday,member.personalInfo.nationality.*,member.personalInfo.idNumber," +
								"member.memberSigning.room.number,member.memberSigning.room.pkRoom,member.personalInfo.sex"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.show([".J-grid"]).hide([".J-form"]);
							}
						});
					},
					buttons : [{
								id : "adds",
								text : "新增",
								handler : function() {
									widget.get("subnav").hide(["search","adds","time"]).show(["building","return","save"]);
	    							widget.get("tab") ? widget.get("tab").destroy() : true;
									widget.hide([".J-grid"]).show([".J-form",".J-tab"]);
									var tab = widget._newTab();
	        						widget.set("tab",tab);		
	        						var form = widget._newForm(null, widget);
	        						widget.set("form",form);
									widget.setAddTab();
									widget.get("form").load("member");
									widget.get("form").load("examDepart",{
										callback:function(hospitaldata){
											for(var u=0;u<hospitaldata.length;u++){
												if(hospitaldata[u].description.indexOf("默认")>=0){
													widget.get("form").setValue("examDepart",hospitaldata[u]);
													break;
												}
											}
										}
									});
									widget.get("form").load("room");
								}
							},{
								id : "save",
								text : "保存",
								show : false,
								handler : function() {
									var form=widget.get("form");
									var updateTime = form.getValue("updateTime");
					    			if(form.getValue("member")==""){
					    				Dialog.alert({
		        							content : i18ns.get("sale_ship_owner","会员")+"不能为空！"
		        						 });
					    				return false;
					    			}
					    			if(form.getValue("room")==""){
					    				Dialog.alert({
		        							content : "房间号不能为空！"
		        						 });
					    				return false;
					    			}
					    			if(form.getValue("updateTime")==""){
					    				Dialog.alert({
		        							content : "体检时间不能为空！"
		        						 });
					    				return false;
					    			}
					    			if(form.getValue("physicalExaminationScheme")==""){
					    				Dialog.alert({
		        							content : "体检方案不能为空！"
		        						 });
					    				return false;
					    			}
					    			if(moment(updateTime).isAfter(moment(),'day')){
					    				Dialog.alert({
		        							content : "体检日期不能在今天之后！"
		        						 });
					    				return false;
					    			}
									var verformData=widget.get("form").getData();
									var size=widget.$("ul.nav-tabs").find("li").size();
									var carddata=[];
									for(var i=1;i<size;i++){
										carddata.push(widget.get("profile"+i).getSubData());
									}
									var data=[];
									var t=0;
									for(var j=0;j<carddata.length;j++){
										for(var m=0;m<carddata[j].length;m++){
											data[t]=carddata[j][m];
											t++;
										}
									}
									verformData.listsParams=data;
									verformData.physicalExaminationScheme=widget.get("form").getValue("physicalExaminationScheme");
									if($(".J-tab").find(".has-error").length>0){
										return false;
									}else{
										Dialog.alert({
			                        		title:"提示",
			                        		showBtn:false,
			                        		content:"正在保存，请稍后……"
			                        	});
									}
									aw.saveOrUpdate("api/physicalexamination/add",encodeURI(aw.customParam(verformData)),function(data){
											Dialog.close();
											widget.show([".J-grid"]).hide([".J-form",".J-tab"]);
											widget.get("subnav").show(["building","adds","search","time"]).hide(["return","save"]);
											widget.get("grid").refresh();
									},function(data){
										Dialog.close();
									});
								}
							},{
								id : "return",
								text : "返回",
								show : false,
								handler : function() {
									widget.hide(".J-form,.J-tab").show(".J-grid");
									widget.get("subnav").show(["building","adds","search","time"]).hide(["return","save"]);
									return false;
								}
							} ],
					buttonGroup:[{
						id:"building",
						showAll:true,
						handler:function(key,element){
							if(widget.get("form")!=null){//更新体检填报页面的会员下拉范围
								widget.get("form").load("member");
								widget.get("form").load("room");
							}
							grid.refresh();
						}
					}],
    				time:{
    					tip:"体检日期",
        				click:function(time){
        					  widget.get("grid").refresh();
        				},
        			}
				}
			});
        	this.set("subnav",subnav);
        	
        	var grid=new Grid({
        		parentNode:".J-grid",
        		url : "api/physicalexam/querymember",
				params:function(){
					return {
						"updateTime":widget.get("subnav").getValue("time").start,
						"updateTimeEnd":widget.get("subnav").getValue("time").end,
						"memberType":"Member",
						"member.statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
						"member.memberSigning.status":"Normal",
						"member.memberSigning.houseingNotIn":false,
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
						"orderString":"member.memberSigning.room.number,member.iorder,updateTime:desc",
						fetchProperties:"examDepart.pkHospital,examDepart.name,pkPhysicalExam,version,updateTime,status,examContact,examEvaluation,familyDoctor.name,familyDoctor.pkUser," +
								"physicalExaminationScheme.name,physicalExaminationScheme.pkPhysicalExaminationScheme," +
								"member.pkMember,member.personalInfo.birthplace,member.personalInfo.maritalStatus.*," +
								"member.personalInfo.idType,member.personalInfo.name,member.personalInfo.birthday,member.personalInfo.nationality.*,member.personalInfo.idNumber," +
								"member.memberSigning.room.number,member.memberSigning.room.pkRoom,member.personalInfo.sex"
					};
				},
				model:{
					columns:[{
						key:"member.personalInfo.name",
						className:"col_md_1",
						name:i18ns.get("sale_ship_owner","会员")+"姓名",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
									widget.get("subnav").hide(["search","building","adds","time"]).show(["return"]);
									widget.get("tab") ? widget.get("tab").destroy() : true;
									widget.hide([".J-grid"]).show([".J-form",".J-tab"]);
									var tab = widget._newTab();
	        						widget.set("tab",tab);		
	        						var form = widget._newForm(data, widget);
	        						widget.set("form",form);
									aw.ajax({
									url:"api/diseasehistory/query",
									data:{
										member:data.member.pkMember,
										fetchProperties:"diseaseDetail.name,diseaseDetail.disease.name,inherited"
									},
									dataType:"json",
									success:function(data1){
										var diseaseHistory="";
										var clanHistory="";
										for(var i=0;i<data1.length;i++){
											if(data1[i].inherited==true){
												clanHistory+=data1[i].diseaseDetail.name+",";
											}
											diseaseHistory+=data1[i].diseaseDetail.name+",";
										}
										diseaseHistory=diseaseHistory.substring(0,diseaseHistory.length-1);
										clanHistory=clanHistory.substring(0,clanHistory.length-1);
										widget.get("form").setValue("diseaseHistory",diseaseHistory);
										widget.get("form").setValue("clanHistory",clanHistory);
										widget.get("form").setAttribute("member","readonly","readonly");
										widget.get("form").setAttribute("room","readonly","readonly");
									}
								});
								widget.get("form").load("physicalExaminationScheme",{
									callback:function(dat){
										for(var i=0;i<dat.length;i++){
											if(dat[i].status.key=="Default"){
												var pk;
												if(data.physicalExaminationScheme==null){
													widget.get("form").setValue("physicalExaminationScheme",dat[i]);
													pk=dat[i].pkPhysicalExaminationScheme;
												}else{
													widget.get("form").setValue("physicalExaminationScheme",data.physicalExaminationScheme);
													pk=data.physicalExaminationScheme.pkPhysicalExaminationScheme;
												}
												aw.ajax({
													url:"api/physicalexamdata/query",
													data:{
														"physicalExamination":data.pkPhysicalExam,
														fetchProperties:"pkPhysicalExamData,healthExamData.*,physicalExaminationSchemeDetail.*"
												    },
													dataType:"json",
													success:function(data2){
														widget._getScheme(pk,data2,null,widget,true);
													}
												});
											}
										}
									}
								});
								widget._setFormAttribute(data, widget);
	    						widget._loadMember(data.member,widget);
								widget.get("form").setDisabled(true);
								widget.get("form").setAttribute("birthday","disabled","disabled");
								widget.get("form").setAttribute("nationality","readonly","readonly");
								widget.get("form").setAttribute("maritalStatus","readonly","readonly");
								widget.get("form").setValue("pkPhysicalExam",data.pkPhysicalExam);
								if(data.version!=null){
									widget.get("form").setValue("version",data.version);
								}else{
									widget.get("form").setValue("version",0);
								}
								widget.get("form").load("member",{
				    				callback:function(){
				    					var member=widget.get("form").getData("member","");
				    					member.push(data.member);
				    					widget.get("form").setData("member",member);
				    					widget.get("form").setValue("member",data.member.pkMember);
				    					widget.get("form").setAttribute("member","readonly","readonly");
				    				}
				    			});
								widget.get("form").load("room",{
				    				callback:function(){
				    					var roomdata=widget.get("form").getData("room","");
										roomdata.push(data.member.memberSigning.room);
										widget.get("form").setData("room",roomdata);
				    					widget.get("form").setValue("room",data.member.memberSigning.room.pkRoom);
				    					widget.get("form").setAttribute("room","readonly","readonly");
				    				}
				    			});
								widget.get("form").load("examDepart",{
									callback:function(){
				    					var roomdata=widget.get("form").getData("examDepart","");
				    					if(data.examDepart!=null){
											roomdata.push(data.examDepart);
											widget.get("form").setData("examDepart",roomdata);
					    					widget.get("form").setValue("examDepart",data.examDepart);
				    					}
				    					widget.get("form").setAttribute("examDepart","readonly","readonly");
				    				}
								});
								widget.get("form").setDisabled(true);
							}
						}]
					},{
						key:"member.memberSigning.room.number",
						name:"房间号",
						className:"col_md_1",
					},{
						key:"updateTime",
						name:"体检日期",
						className:"col_md_2",
						format:"date",
					},{
						key:"examEvaluation",
						className:"col-md-5",
						name:"体检总结"
					},{
						key:"physicalExaminationScheme",
						className:"col_md_2",
						name:"体检方案",
						format:function(value){
							if(value!=""&&value!=null){
								return value.name;
							}else{
								return "无";
							}
						}
					},{
						key:"operate",
						name:"操作",
						className:"col_md_1",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("subnav").hide(["search","building","adds","time"]).show(["save","return"]);
								widget.get("tab") ? widget.get("tab").destroy() : true;
								widget.hide([".J-grid"]).show([".J-form",".J-tab"]);
								aw.ajax({
									url:"api/diseasehistory/query",
									data:{
										member:data.member.pkMember,
										fetchProperties:"diseaseDetail.name,diseaseDetail.disease.name,inherited"
									},
									dataType:"json",
									success:function(data1){
										var diseaseHistory="";
										var clanHistory="";
										for(var i=0;i<data1.length;i++){
											if(data1[i].inherited==true){
												clanHistory+=data1[i].diseaseDetail.name+",";
											}
											diseaseHistory+=data1[i].diseaseDetail.name+",";
										}
										diseaseHistory=diseaseHistory.substring(0,diseaseHistory.length-1);
										clanHistory=clanHistory.substring(0,clanHistory.length-1);
										widget.get("form").setValue("diseaseHistory",diseaseHistory);
										widget.get("form").setValue("clanHistory",clanHistory);
										widget.get("form").setAttribute("member","readonly","readonly");
										widget.get("form").setAttribute("room","readonly","readonly");
									}
								});
								var tab = widget._newTab();
        						widget.set("tab",tab);		
        						var form = widget._newForm(data, widget);
        						widget.set("form",form);
        						widget.get("form").load("physicalExaminationScheme",{
									callback:function(dat){
										for(var i=0;i<dat.length;i++){
											if(dat[i].status.key=="Default"){
												var pk;
												if(data.physicalExaminationScheme==null){
													widget.get("form").setValue("physicalExaminationScheme",dat[i]);
													pk=dat[i].pkPhysicalExaminationScheme;
												}else{
													widget.get("form").setValue("physicalExaminationScheme",data.physicalExaminationScheme);
													pk=data.physicalExaminationScheme.pkPhysicalExaminationScheme;
												}
												aw.ajax({
													url:"api/physicalexamdata/query",
													data:{
														"physicalExamination":data.pkPhysicalExam,
														fetchProperties:"pkPhysicalExamData,healthExamData.*,physicalExaminationSchemeDetail.*"
												    },
													dataType:"json",
													success:function(data2){
														widget._getScheme(pk,data2,null,widget,false);
													}
												});
											}
										}
									}
        						});
								widget._setFormAttribute(data, widget);
	    						widget._loadMember(data.member,widget);
								widget.get("form").setAttribute("birthday","disabled","disabled");
								widget.get("form").setAttribute("nationality","readonly","readonly");
								widget.get("form").setAttribute("maritalStatus","readonly","readonly");
								widget.get("form").setValue("pkPhysicalExam",data.pkPhysicalExam);
								if(data.version!=null){
									widget.get("form").setValue("version",data.version);
								}else{
									widget.get("form").setValue("version",0);
								}
								widget.get("form").load("member",{
				    				callback:function(){
				    					var member=widget.get("form").getData("member","");
				    					member.push(data.member);
				    					widget.get("form").setData("member",member);
				    					widget.get("form").setValue("member",data.member.pkMember);
				    					widget.get("form").setAttribute("member","readonly","readonly");
				    				}
				    			});
								widget.get("form").load("room",{
				    				callback:function(){
				    					var roomdata=widget.get("form").getData("room","");
										roomdata.push(data.member.memberSigning.room);
										widget.get("form").setData("room",roomdata);
				    					widget.get("form").setValue("room",data.member.memberSigning.room.pkRoom);
				    					widget.get("form").setAttribute("room","readonly","readonly");
				    				}
				    			});
								widget.get("form").load("examDepart",{
				    				callback:function(){
				    					var roomdata=widget.get("form").getData("examDepart","");
				    					if(data.examDepart!=null){
											roomdata.push(data.examDepart);
											widget.get("form").setData("examDepart",roomdata);
					    					widget.get("form").setValue("examDepart",data.examDepart);
				    					}
				    				}
				    			});
							}
						},{
							id:"add",
							text:"增加",
							handler:function(index,data,rowEle){
								data.pkPhysicalExam=null;
								data.version=null;
								data.examContact=null;
								data.examEvaluation=null;
								data.updateTime=moment();
								widget.get("subnav").hide(["search","building","adds","time"]).show(["save","return"]);
    							widget.get("tab") ? widget.get("tab").destroy() : true;
								widget.hide([".J-grid"]).show([".J-form",".J-tab"]);
								aw.ajax({
									url:"api/diseasehistory/query",
									data:{
										member:data.member.pkMember,
										fetchProperties:"diseaseDetail.name,diseaseDetail.disease.name,inherited"
									},
									dataType:"json",
									success:function(data1){
										var diseaseHistory="";
										var clanHistory="";
										for(var i=0;i<data1.length;i++){
											if(data1[i].inherited==true){
												clanHistory+=data1[i].diseaseDetail.name+",";
											}
											diseaseHistory+=data1[i].diseaseDetail.name+",";
										}
										diseaseHistory=diseaseHistory.substring(0,diseaseHistory.length-1);
										clanHistory=clanHistory.substring(0,clanHistory.length-1);
										widget.get("form").setValue("diseaseHistory",diseaseHistory);
										widget.get("form").setValue("clanHistory",clanHistory);
										widget.get("form").setAttribute("member","readonly","readonly");
										widget.get("form").setAttribute("room","readonly","readonly");
									}
								});
								var tab = widget._newTab();
        						widget.set("tab",tab);		
        						var form = widget._newForm(data, widget);
        						widget.set("form",form);
								widget.setAddTab(data);
								widget.get("form").load("member",{
				    				callback:function(){
				    					var member=widget.get("form").getData("member","");
				    					member.push(data.member);
				    					widget.get("form").setData("member",member);
				    					widget.get("form").setValue("member",data.member.pkMember);
				    					widget.get("form").setAttribute("member","readonly","readonly");
				    				}
				    			});
								widget.get("form").load("room",{
				    				callback:function(){
				    					var roomdata=widget.get("form").getData("room","");
										roomdata.push(data.member.memberSigning.room);
										widget.get("form").setData("room",roomdata);
				    					widget.get("form").setValue("room",data.member.memberSigning.room.pkRoom);
				    					widget.get("form").setAttribute("room","readonly","readonly");
				    				}
				    			});
								widget.get("form").load("examDepart",{
									callback:function(hospitaldata){
										for(var u=0;u<hospitaldata.length;u++){
											if(hospitaldata[u].description.indexOf("默认")>=0){
												widget.get("form").setValue("examDepart",hospitaldata[u]);
												break;
											}
										}
									}
								});
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/physicalexam/" + data.pkPhysicalExam + "/delete",function() {
									  widget.get("grid").refresh();
								});
							}
						}]
					}]
				}
        	});
        	this.set("grid",grid);
			},
	});
	module.exports = PhysicalExam;
});