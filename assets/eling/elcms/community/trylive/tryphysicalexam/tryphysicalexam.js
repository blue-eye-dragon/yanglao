//						{
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
	var TryPhysicalExam = ELView.extend({
		_newTab:function(){			
			return new Tab({
				parentNode:".J-tab",
				model:{
					items:[{
						id:"step1",
						title:"体验"+i18ns.get("sale_ship_owner","会员")+"体检总结" 
					}]
				}
			});
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
						label:"体验"+i18ns.get("sale_ship_owner","会员"),
						type:"select",
						lazy:true,
						readonly:true,
						url:"api/trylivemember/query",
						className:{
							container:"col-md-6"
						},
						params:function(){
							return {
								fetchProperties:"*,personalInfo.idType,personalInfo.pkPersonalInfo,personalInfo.name,personalInfo.sex,personalInfo.birthday,personalInfo.birthplace,personalInfo.nationality,personalInfo.idNumber,personalInfo.maritalStatus,personalInfo.mobilePhone"
							};
						},
						key:"pkMember",
						validate : [ "required" ],
						value:"personalInfo.mobilePhone,personalInfo.name"
					},{
						name:"sex",
						label:"性别",
						defaultValue:(data?(data.member.personalInfo.sex?data.member.personalInfo.sex.value:null):null),
						type:"text",
						readonly:true,
						className:{
							container:"col-md-6"
						},
					},{
						name:"birthplace",
						label:"出生地",
						defaultValue:(data?data.member.personalInfo.birthplace:null),
						type:"text",
						readonly:true,
						className:{
							container:"col-md-6"
						},
					},{
						name:"birthday",
						label:"出生日期",
						defaultValue:(data?data.member.personalInfo.birthday:""),
						type:"date",
						className:{
							container:"col-md-6"
						},
					},{
						name:"nationality",
						label:"民族",
						defaultValue:(data?data.member.personalInfo.nationality:""),
						type:"select",
						readonly:true,
						options:BaseDoc.nationality,
						className:{
							container:"col-md-6"
						},
					},{
						name:"idNumber",
						label:"证件号",
						defaultValue:(data?(data.member.personalInfo.idType&&data.member.personalInfo.idNumber?(data.member.personalInfo.idType.value+":"+data.member.personalInfo.idNumber):null):null),
						type:"text",
						readonly:true,
						className:{
							container:"col-md-6"
						},
					},{
						name:"maritalStatus",
						label:"婚姻状况",
						defaultValue:(data?data.member.personalInfo.maritalStatus:""),
						options:BaseDoc.maritalStatus,
						type:"select",
						readonly:true,
						className:{
							container:"col-md-6"
						},
					},{
						name:"updateTime",
						label:"体检时间",
						type:"date",
						defaultValue:(data?(data.updateTime?data.updateTime:moment()):moment()),
						mode:"Y-m-d H:i",
						validate : [ "required" ],
						className:{
							container:"col-md-6"
						},
					},{
						name:"physicalExaminationScheme",
						label:"体检方案",
						type:"select",
						lazy:true,
						url:"api/physicalexaminationscheme/queryall",
						params:function(){
							return {
								"statusIn":"Using,Default",
								fetchProperties:"status,pkPhysicalExaminationScheme,name"
							};
						},
						key:"pkPhysicalExaminationScheme",
						value:"name",
						validate : [ "required" ],
						className:{
							container:"col-md-6"
						}
					},
//					{
//						name:"status",
//						label:"体检状态",
//						defaultValue:((data&&data.status)?data.status.key:""),
//						options:enmu["com.eling.elcms.health.model.PhysicalExamination.Status"],
//						type:"select",
//						className:{
//							container:"col-md-6"
//						},
//					},
					{
						name:"examEvaluation",
						label:"体检总结",
						defaultValue:(data?(data.examEvaluation?data.examEvaluation:null):null),
						type:"textarea",
						className:{
							container:"col-md-6",
							label:"col-md-0"
						},
						style:{
							value:"width:180%;height:110px;"
						},
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
								children.push({
									name:"value1",
									label:detail[a].healthExamDataType.name1,
									defaultValue:value,
									type:"text",
								});
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
								children.push({
									name:"value2",
									label:detail[a].healthExamDataType.name2,
									defaultValue:value,
									type:"text",
								});
							}if(detail[a].healthExamDataType.name3){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value3;
										}
									}
								}
								children.push({
									name:"value3",
									label:detail[a].healthExamDataType.name3,
									defaultValue:value,
									type:"text",
								});
							}if(detail[a].healthExamDataType.name4){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value4;
										}
									}
								}
								children.push({
									name:"value4",
									label:detail[a].healthExamDataType.name4,
									defaultValue:value,
									type:"text",
								});
							}if(detail[a].healthExamDataType.name5){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value5;
										}
									}
								}
								children.push({
									name:"value5",
									label:detail[a].healthExamDataType.name5,
									defaultValue:value,
									type:"text",
								});
							}if(detail[a].healthExamDataType.name6){
								var value=null;
								if (examData){
									for(var o=0;o<examData.length;o++){
										if(examData[o].healthExamData.type.pkHealthExamDataType==detail[a].healthExamDataType.pkHealthExamDataType){
											value=examData[o].healthExamData.value6;
										}
									}
								}
								children.push({
									name:"value6",
									label:detail[a].healthExamDataType.name6,
									defaultValue:value,
									type:"text",
								});
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
		events : {
			"change .J-form-baseinfo-select-member ":function(e){
				var form=this.get("form");
				var pkType=form.getValue("member");
				var dataType = form.getData("member",{
					pk:pkType
				});
				form.setValue("sex",dataType.personalInfo.sex?dataType.personalInfo.sex.value:null);
				form.setValue("birthday",dataType.personalInfo.birthday);
				form.setValue("birthplace",dataType.personalInfo.birthplace);
				form.setValue("nationality",dataType.personalInfo.nationality);
				form.setValue("idNumber",dataType.personalInfo.idType.value+":"+dataType.personalInfo.idNumber);
				form.setValue("maritalStatus",dataType.personalInfo.maritalStatus);
			},
			"change .J-form-baseinfo-select-physicalExaminationScheme ":function(e){
				var widget=this;
				var form=this.get("form");
				var tab=this.get("tab");
				tab.removeItems(1);//页签只保留一个基本信息
				var pk =form.getValue("physicalExaminationScheme");
				if(pk!=null&&pk!=""){
					widget._getScheme(pk,null,tab,widget,false);
				}
			},
		},
		attrs:{
			template:template
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
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"体验体检",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/physicalexam/search",
							data:{
								"memberType":"TryLiveMember",
								s:str,
								properties:"member.personalInfo.name,member.personalInfo.mobilePhone,member.idCardNo",
								"orderString":"updateTime:desc",
								fetchProperties:"pkPhysicalExam,version,updateTime,status,examContact,examEvaluation,familyDoctor.name,familyDoctor.pkUser,physicalExaminationScheme.name,physicalExaminationScheme.pkPhysicalExaminationScheme," +
								"member.pkMember,member.personalInfo.birthplace,member.personalInfo.maritalStatus.*" +
								",member.personalInfo.idType,member.personalInfo.name,member.personalInfo.birthday,member.personalInfo.nationality.*,member.personalInfo.idNumber" +
								",member.personalInfo.sex"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.show([".J-grid"]).hide([".J-form"]);
							}
						});
					},
					buttons : [
//				 {
//						id : "adds",
//						text : "新增",
//						handler : function() {
//							widget.get("subnav").hide(["search","adds","time"]).show(["return","save"]);
//							widget.get("tab") ? widget.get("tab").destroy() : true;
//							widget.hide([".J-grid"]).show([".J-form",".J-tab"]);
//							
//							var tab = widget._newTab();
//        					widget.set("tab",tab);	
//							
//        					var form = widget._newForm(null,widget);
//							widget.set("form",form);
//							
//							widget.setAddTab();
//							
//							widget.get("form").load("member");
//						}
//					},
					{
						id : "save",
						text : "保存",
						show : false,
						handler : function() {
							var form=widget.get("form");
							if(form.getValue("member")==""){
								Dialog.alert({
									content : i18ns.get("sale_ship_owner","会员")+"不能为空！"
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
							aw.saveOrUpdate("api/physicalexamination/add",encodeURI(aw.customParam(verformData)),function(data){
								widget.show([".J-grid"]).hide([".J-form",".J-tab"]);
//								widget.get("subnav").show(["adds","search","time"]).hide(["return","save"]);
								widget.get("subnav").show(["search","time"]).hide(["return","save"]);
								widget.get("grid").refresh();
							});
						}
					},{
						id : "return",
						text : "返回",
						show : false,
						handler : function() {
							widget.hide(".J-form,.J-tab").show(".J-grid");
//							widget.get("subnav").show(["adds","search","time"]).hide(["return","save"]);
							widget.get("subnav").show(["search","time"]).hide(["return","save"]);

							return false;
						}
					} ],
					time:{
						tip:"体验体检日期",
						click:function(time){
							widget.get("grid").refresh();
						},
					}
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				url : "api/physicalexam/query",
				params:function(){
					return {
						"updateTime":widget.get("subnav").getValue("time").start,
						"updateTimeEnd":widget.get("subnav").getValue("time").end,
						"memberType":"TryLiveMember",
						"orderString":"updateTime:desc",
						fetchProperties:"pkPhysicalExam,version,updateTime,status,examContact,examEvaluation,familyDoctor.name,familyDoctor.pkUser,physicalExaminationScheme.name,physicalExaminationScheme.pkPhysicalExaminationScheme," +
						"member.pkMember,member.personalInfo.birthplace,member.personalInfo.maritalStatus.*" +
						",member.personalInfo.idType,member.personalInfo.name,member.personalInfo.birthday,member.personalInfo.nationality.*,member.personalInfo.idNumber" +
						",member.personalInfo.sex"
					};
				},
				model:{
					columns:[{
						key:"member.personalInfo.name",
						className:"col-md-2",
						name:"姓名",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
//								widget.get("subnav").hide(["search","adds","time"]).show(["return"]);
								widget.get("subnav").hide(["search","time"]).show(["return"]);
								widget.get("tab") ? widget.get("tab").destroy() : true;
								widget.hide([".J-grid"]).show([".J-form",".J-tab"]);
								
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
							}
						}]
					},{
						key:"updateTime",
						name:"体检时间",
						className:"col-md-2",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"examEvaluation",
						className:"col-md-5",
						name:"体检总结"
					},{
						key:"physicalExaminationScheme",
						className:"col-md-2",
						name:"体检方案",
						format:function(value){
							if(value!=""&&value!=null){
								return value.name;
							}else{
								return "无";
							}
						}
					},
//					{
//						key:"status",
//						className:"col-md-1",
//						name:"体检状态",
//						format:function(value){
//							if(value!=""&&value!=null){
//								return value.value;
//							}else{
//								return "无";
//							}
//						}
//					},
					{
						key:"operate",
						name:"操作",
						className:"col-md-1",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
//								widget.get("subnav").hide(["search","adds","time"]).show(["save","return"]);
								widget.get("subnav").hide(["search","time"]).show(["save","return"]);
								widget.get("tab") ? widget.get("tab").destroy() : true;
								widget.hide([".J-grid"]).show([".J-form",".J-tab"]);
								
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
							}
						},
//						{
//    						key:"finished",
//    						text:"结束",
//    						handler:function(index,data,rowEle){
//    							aw.ajax({
//									url:"api/physicalexam/finished/" + data.pkPhysicalExam,
//									dataType:"json",
//									success:function(data2){
//										widget.get("grid").refresh();
//									}
//								});	
//    						}
//    					}
						
//						,{
//							id:"add",
//							text:"增加",
//							handler:function(index,data,rowEle){
//								data.pk="null";
//								data.updateTime=moment();
//								widget.get("subnav").hide(["search","adds","time"]).show(["save","return"]);
//    							widget.get("tab") ? widget.get("tab").destroy() : true;
//								widget.hide([".J-grid"]).show([".J-form",".J-tab"]);
//								
//								var tab = widget._newTab();
//								widget.set("tab",tab);		
						
//								var form = widget._newForm(data, widget);
//								widget.set("form",form);
						
//								widget.setAddTab(data);
						
//								widget._loadMember(data.member.pkMember,widget);

//							}
//						}
//						,{
//							key:"delete",
//							icon:"remove",
//							handler:function(index,data,rowEle){
//								aw.del("api/physicalexam/" + data.pkPhysicalExam + "/delete",function() {
//									  widget.get("grid").refresh();
//								});
//							}
//						}
						]
					}]
				}
        	});
        	this.set("grid",grid);
			},
	});
	module.exports = TryPhysicalExam;
});