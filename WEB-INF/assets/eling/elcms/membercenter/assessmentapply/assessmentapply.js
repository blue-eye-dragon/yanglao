/**
 * 会员评估申请
 */
define(function(require, exports, module) { 
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form-2.0.0")
	var Dialog = require("dialog");
	var EditGrid=require("editgrid-1.0.0");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var ApprovalTest = require("approvalUI");
	require("./assessmentapply.css");
	var ensureindex="";
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"+
	 "<div class='J-printform hidden' ></div>"+
	 "<div class='J-memberGrid hidden'></div>"+
	 "<div class='J-approvalTest hidden'></div>"+
	 "<div class='J-memberForm hidden'></div>"; 
	var assessmentapply = ELView.extend({
		events:{
			"blur .J-form-assessmentapply-date-checkInTime":function(e){
				var form=this.get("form");
				if(form.getValue("checkInTime")<form.getValue("createTime")){
    				Dialog.alert({
						content : "计划入住时间不能小于申请日期！"
					 });
    				form.setValue("checkInTime","");
    				return false;
    			}
			},
			"blur .J-form-assessmentapply-date-assessmentTime":function(e){
				var form=this.get("form");
				if(form.getValue("assessmentTime")<form.getValue("createTime")){
    				Dialog.alert({
						content : "评估时间不能小于申请日期！"
					 });
    				form.setValue("assessmentTime","");
    				return false;
    			}
			},
			"click .J-print":function(e){
					var widget =this;
					var grid=widget.get("grid");
					var index=grid.getIndex(e.target);
					var data=grid.getSelectedData(index);
					var approvalTest  = widget.get("approvalTest");
					widget.get("memberGrid").setData(data.memberAssessmentDetail);
					var form=widget.get("printform");
					form.setDisabled(true);
					$(".J-edit,.J-delete,.J-grid-head-add").addClass("hidden");
//					widget.get("memberGrid").setDisabled(true);
					form.setData(data);
					form.setValue("creator",data.creator.name)
					form.setValue("room",data.room.number);
					form.setValue("assessmentTime",moment(data.assessmentTime).format("YYYY-MM-DD"));
					form.setValue("createTime",moment(data.createTime).format("YYYY-MM-DD"));
					form.setValue("checkInTime",moment(data.checkInTime).format("YYYY-MM-DD"));
					if(data.cardType!=null){
						form.setValue("cardType",data.cardType.name);
					}
					widget.show([".J-printform,.J-memberGrid,.J-approvalTest"]).hide([".J-grid"]);
					widget.get("subnav").hide(["add","search","flowStatus","time"]);
					approvalTest.set("param",{
						modelId:data.pkMemberAssessment,
						serviceType:"MemberCheckinAssessment",
						hideButton:true,
					});
					approvalTest.get("appgrid").refresh(null,function(data){
						window.print();
						widget.show([".J-grid"]).hide([".J-printform,.J-memberGrid,.J-approvalTest"]);
						widget.get("subnav").show(["add","search","flowStatus","time"]);
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
					title : i18ns.get("sale_ship_owner","会员")+"评估申请",
					search : function(str) {
						var g = widget.get("grid");
						aw.ajax({
									url : "api/memberassessment/search",
									data : {
										s : str,
										properties : "room.number,peopleQuantity,creator.name,leading.name,flowStatus",
										fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
										"cardType.name," +
										"memberAssessmentDetail.assessmentResult.diseaseHistory,"+
										"memberAssessmentDetail.assessmentResult.score,memberAssessmentDetail.assessmentResult.version," +
										"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*,memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*,memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*,memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*,memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*,memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
										"memberAssessmentDetail.assessmentResult.pkAssessmentResult,"+
										"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
										"memberAssessmentDetail.gradeStatus,memberAssessmentDetail.version,memberAssessmentDetail.auditMaterials,memberAssessmentDetail.isStayHome,memberAssessmentDetail.pkMemberAssessmentDetail,*,leading.name,leading.pkUser,creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
									},
									dataType : "json",
									success : function(data) {
											g.setData(data);
									}
								});
					},
					buttonGroup : [{
     				   id:"flowStatus",
     				   tip:"状态",
     				   showAll:true,
     				   showAllFirst:true,
    				   items:[{
    					   key:"Initial",
    					   value:"初始"
    				   },{
    					   key:"Commited",
    					   value:"已提交"
    				   },{
    					   key:"Approvaling",
    					   value:"审批中"
    				   },{
    					   key:"Approved",
    					   value:"已通过"  
    				   },{
    					   key:"NotApproved",
    					   value:"未通过"  
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
							form.reset();
							$(".J-edit,.J-delete,.J-grid-head-add").removeClass("hidden");
//							$('input[name="auditMaterials"]').removeAttr('checked');
							form.load("creator",{
								params:{
									fetchProperties:"pkUser,name"
								},
								callback:function(){
									//当前用户是管理员时，让operator可用
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
							form.load("room");
							form.load("cardType");
							form.setValue("createTime",moment());
							form.setValue("flowStatus","Initial");
							form.setAttribute("flowStatus","readonly","readonly");
							form.setAttribute("creator","readonly","readonly");
							widget.show([".J-form",".J-memberGrid"]).hide([".J-grid"]);
							widget.get("subnav").hide(["add","search","flowStatus","time","back"]).show(["return","save"]);
							form.removeAttribute("personalCardowners","readonly");
							widget.get("memberGrid").setData([]);
						}
    				},{ 
    					id:"save",
						text:"保存",
						show:false,
						handler:function(){
							var form=widget.get("form");
			    			if(form.getValue("personalCardowners")==""){
			    				Dialog.alert({
        							content : "权益人不能为空！"
        						 });
			    				return false;
			    			}
			    			if(form.getValue("checkInTime")==""){
			    				Dialog.alert({
        							content : "计划入住时间不能为空！"
        						 });
			    				return false;
			    			}
			    			if(form.getValue("createTime")==""){
			    				Dialog.alert({
        							content : "申请日期不能为空！"
        						 });
			    				return false;
			    			}
			    			if(form.getValue("peopleQuantity")==""){
			    				Dialog.alert({
        							content : "请选择计划入住人数！"
        						 });
			    				return false;
			    			}
			    			if(form.getValue("room")==""){
			    				Dialog.alert({
        							content : "请选择计划入住房号！"
        						 });
			    				return false;
			    			}if(form.getValue("assessmentTime")==""){
			    				Dialog.alert({
        							content : "评估时间不能为空！"
        						 });
			    				return false;
			    			}if(form.getValue("creator")==""){
			    				Dialog.alert({
        							content : "评估申请人不能为空！"
        						 });
			    				return false;
			    			}
							var griddata=widget.get("memberGrid").getData();//会员信息
			    			if(griddata.length!=form.getValue("peopleQuantity")){
			    				Dialog.alert({
        							content : "会员数量和计划入住人数不一致！"
        						 });
			    				return false;
			    			}
							if(griddata.length<1){
								Dialog.alert({
        							content : "会员不能为空!"
        						 });
								return false;
							}
							var name="";
							for(var i=0;i<griddata.length;i++){
								if(griddata[i].name){
									name+=griddata[i].name+" ";
								}else{
									name+=griddata[i].personalInfo.name+" ";
								}
								if(griddata[i].gradeStatus.key){
									griddata[i].gradeStatus=griddata[i].gradeStatus.key;
								}
								if(griddata[i].personalInfo.idType.key){
									griddata[i].personalInfo.idType=griddata[i].personalInfo.idType.key;
								}
								if(griddata[i].personalInfo.sex.key){
									griddata[i].personalInfo.sex=griddata[i].personalInfo.sex.key;
								}
							}
							var  pkType =form.getValue("room");
			    			var dataType = form.getData("room",{
								pk:pkType
							});
							form.setValue("assessmentNumber",dataType.number+" "+name);
							var formData=form.getData();//主表信息
							formData.lists=griddata;//personal
							formData.list=griddata;//MemberAssessmentDetail
							Dialog.loading(true);
							aw.saveOrUpdate("api/memberassessment/save",aw.customParam(formData),function(data){
									Dialog.loading(false);
									widget.get("grid").refresh();
						   			widget.hide([".J-form,.J-memberGrid"]).show([".J-grid"]);
									widget.get("subnav").show(["add","flowStatus","search","time"]).hide(["return","save","back"]);
							},function(data){
								Dialog.loading(false);
							});
						}
    				},{
    					id:"return",
						text:"返回",
						show:false,
						handler:function(index,data,rowEle){
							$(".J-edit,.J-delete,.J-grid-head-add").removeClass("hidden");
							widget.show([".J-grid"]).hide([".J-form",".J-memberGrid",".J-memberForm"]);
							widget.get("subnav").hide(["return","save","back"]).show(["add","time","search","flowStatus"]);
						}
    				},{
    					id:"back",
						text:"返回",
						show:false,
						handler:function(index,data,rowEle){
							widget.show([".J-form,.J-memberGrid"]).hide([".J-grid,.J-memberForm"]);
							widget.get("subnav").hide(["search","flowStatus","time","back"]).show(["return"]);
						}
    				}],
    				time:{
    					tip:"申请日期",
					 	ranges:{
							"本年": [moment().startOf("year"),moment().endOf("year")],
							},
						defaultTime:"本年",
        				click:function(time){
        					widget.get("grid").refresh();
						}
					}
				}
			});
        	this.set("subnav",subnav);
        	
        	var grid=new Grid({
        		parentNode:".J-grid",
        		url : "api/memberassessment/query",
				params : function() {
					var subnav = widget.get("subnav");
					return {
						"flowStatus" : subnav.getValue("flowStatus"),
						"createTime":widget.get("subnav").getValue("time").start,
						"createTimeEnd":widget.get("subnav").getValue("time").end,
						fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
						"cardType.name," +
						"memberAssessmentDetail.assessmentResult.diseaseHistory,"+
						"memberAssessmentDetail.assessmentResult.score,memberAssessmentDetail.assessmentResult.version," +
						"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*,memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*,memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*,memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*,memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*,memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
						"memberAssessmentDetail.assessmentResult.pkAssessmentResult,"+
						"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
						"memberAssessmentDetail.gradeStatus,memberAssessmentDetail.version,memberAssessmentDetail.auditMaterials,memberAssessmentDetail.isStayHome,memberAssessmentDetail.pkMemberAssessmentDetail,*,leading.name,leading.pkUser,creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
					};
				},
				model : {
					columns : [{
						key:"room.number",
						name:"房间",
						format:"detail",
	 					formatparams:[{
	 					key:"detail",
							handler:function(index,data,rowEle){
								widget.get("memberGrid").setData(data.memberAssessmentDetail);
								var form=widget.get("form");
								form.setDisabled(true);
								$(".J-edit,.J-delete,.J-grid-head-add").addClass("hidden");
//								widget.get("memberGrid").setDisabled(true);
								widget.get("form").setData(data);
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
								form.load("room",{
									callback:function(){
										var room=form.getData("room","");
										room.push(data.room);
										form.setData("room",room);
										form.setValue("room",data.room);
									}
								});
								form.load("cardType",{
									callback:function(){
										form.setValue("cardType",data.cardType);
									}
								});
								widget.show([".J-form,.J-memberGrid"]).hide([".J-grid"]);
								widget.get("subnav").hide(["add","search","flowStatus","time","back"]).show(["return"]);
							}
	 					}]
					},{
						key:"member",
						name:"会员",
						format:function(value,row){
	                        	if(row.memberAssessmentDetail.length > 0){
	                        		var name ="";
	                        		for ( var i in row.memberAssessmentDetail) {
	                        			name +=row.memberAssessmentDetail[i].personalInfo.name +" " 
									}
	                        		return name;
	                        	}else{
	                        		return "";
	                        	}
	                        },
					},{
						key : "checkInTime",
						name : "入住时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						key : "peopleQuantity",
						name : "入住人数"
					},{
								key:"createTime",
								name:"申请日期",
								format:"date",
        						formatparams:{
        							mode:"YYYY-MM-DD"
        						}
							},{
								key:"creator.name",
								name:"申请人"
							},{
								key:"leading.name",
								name:"负责人(打分人)"
							},{
								key:"assessmentTime",
								name:"评估日期",
								format:"date",
        						formatparams:{
        							mode:"YYYY-MM-DD"
        						}
							},{
								key:"flowStatus",
								name:"状态",
								format:function(value,row){
									return value.value;
								}
							},{
								key : "operate",
								name : "操作",
								format:function(row,value){
									if(value.flowStatus.key=="Initial"){
										return "button";
									}else if(value.flowStatus.key=="Approved"){
										return "<pre><a style='margin-left:5px;color:white;background:#f34541' class='J-print btn btn-xs ' href='javascript:void(0);''>打印</a></pre>";
									}else{
										return "";
									}
								},
								formatparams : [{
											key:"edit",
					        				icon:"edit",
											handler : function(index,data, rowEle) {
												widget.get("memberGrid").setData(data.memberAssessmentDetail);
												var form=widget.get("form");
												form.setDisabled(false);
												widget.get("form").setData(data);
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
												form.load("room",{
													callback:function(){
														var room=form.getData("room","");
														room.push(data.room);
														form.setData("room",room);
														form.setValue("room",data.room);
													}
												});
												form.load("cardType",{
													callback:function(){
														form.setValue("cardType",data.cardType);
													}
												});
												widget.show([".J-form,.J-memberGrid"]).hide([".J-grid"]);
												widget.get("subnav").hide(["add","search","flowStatus","time","back"]).show(["return","save"]);
											}
										},{
											key:"delete",
											icon:"remove",
											handler:function(index,data,rowEle){
												if(data.flowStatus.key!="Initial"){
													Dialog.alert({
					        							content : "状态为"+data.flowStatus.value+",不能删除!"
					        						 });
													return false;
												}
												aw.del("api/memberassessment/" + data.pkMemberAssessment + "/delete",function() {
													  widget.get("grid").refresh();
												});
											}
										},{
			        						key:"submit",
			        						text:"提交",
			        						handler:function(index,data,rowEle){
												if(data.flowStatus.key!="Initial"){
													Dialog.alert({
					        							content : "状态为"+data.flowStatus.value+",不能提交!"
					        						 });
													return false;
												}
												Dialog.confirm({
													title:"提示",
													content:"是否提交？",
													confirm:function(){	
														Dialog.mask(true);
														aw.ajax({
															url:"api/memberassessment/submit",
															data:{
																pkMemberAssessment:data.pkMemberAssessment,
																version:data.version
																},
															dataType:"json",
															success:function(data){
																Dialog.mask(false);
																widget.show(".J-grid").hide(".J-form");
																widget.get("subnav").hide(["return","save","back"]).show(["search","time","flowStatus","time"]);
																widget.get("grid").refresh({
																	pkMemberAssessment:data.pkMemberAssessment,
																	fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
																	"memberAssessmentDetail.assessmentResult.diseaseHistory,"+
																	"memberAssessmentDetail.assessmentResult.score,memberAssessmentDetail.assessmentResult.version," +
																	"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*,memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*,memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*,memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*,memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*,memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
																	"memberAssessmentDetail.assessmentResult.pkAssessmentResult,"+
																	"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
																	"memberAssessmentDetail.gradeStatus,memberAssessmentDetail.version,memberAssessmentDetail.auditMaterials,memberAssessmentDetail.isStayHome,memberAssessmentDetail.pkMemberAssessmentDetail,*,leading.name,leading.pkUser,creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
																});
															}
														});
														
													}
												});
											}
			        					}]

							} ]
				}
        	});
        	 this.set("grid",grid);
        	 
        	 var form=new Form({
        		show:false,
         		parentNode:".J-form",
				model : {
					id : "assessmentapply",
					defaultButton:false,
					items :
						[ {
						name : "pkMemberAssessment",
						type : "hidden"
					}, {
						name : "version",
						defaultValue : "0",
						type : "hidden"
					},{
						name:"assessmentNumber",
						label:"评估单号",
						type:"hidden",
						validate:["required"],
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						label:"权益人",
						name:"personalCardowners",
						type:"text",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"peopleQuantity",
						label:"计划入住人数",
						type:"select",
						validate:["required"],
						options:[{
        					key:"1",
        					value:"1"
        				},{
        					key:"2",
            				value:"2"
        				}],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"checkInTime",
						label:"计划入住时间",
						type:"date",
						mode:"Y-m-d",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"room",
        				label:"计划入住房号",
        				key:"pkRoom",
        				type:"select",
        				lazy:true,
        				validate:["required"],
        				url:"api/room/query",
        				params:function(){
        					return{
        						"statusIn":"Empty,Appoint",
            					"useType":"Apartment",
            					fetchProperties:"pkRoom,number,type.pkRoomType",
        					};
        				},
        				value:"number",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
        				name:"createTime",
        				label:"申请日期",
        				type:"date",
						mode:"Y-m-d",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"assessmentTime",
        				label:"评估时间",
        				type:"date",
						mode:"Y-m-d",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
						name:"cardType",
						label:i18ns.get("sale_card_type","会籍卡类别"),
						type:"select",
						url:"api/cardtype/query",
						key:"pkMemberShipCardType",
						value:"name",
						lazy:true,
						params:function(){
							return {
								fetchProperties:"pkMemberShipCardType,name"
					        };
						},
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"creator",
        				label:"评估申请人",
        				key:"pkUser",
        				type:"select",
        				url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						}, 
						lazy:true,
        				value:"name",
        				validate:["required"],
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
        				name:"flowStatus",
        				label:"状态",
        				type:"hidden",
        				options:[{
        					key:"Initial",
        					value:"初始"
        				},{
        					key:"Submit",
        					value:"已提交"
        				}],
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			}]
				}
        	 });
        	 this.set("form",form);
        	 var printform=new Form({
         		show:false,
          		parentNode:".J-printform",
 				model : {
 					id : "assessmentapply",
 					defaultButton:false,
 					items :
 						[{
 						label:"权益人",
 						name:"personalCardowners",
 						type:"text",
 						style:{
							container:"width:50%;float:left;",
							label:"width:40%;float:left;",
							value:"width:50%;float:left;"
						},
 					},{
 						name:"peopleQuantity",
 						label:"计划入住人数",
         				style:{
							container:"width:50%;float:right;",
							label:"width:40%;float:left;",
							value:"width:50%;float:left;"
						},
 					},{
 						name:"checkInTime",
 						label:"计划入住时间",
 						style:{
							container:"width:50%;float:left;",
							label:"width:40%;float:left;",
							value:"width:50%;float:left;"
						},
 					},{
 						name:"room",
         				label:"计划入住房号",
         				style:{
							container:"width:50%;float:right;",
							label:"width:40%;float:left;",
							value:"width:50%;float:left;"
						},
 					},{
         				name:"createTime",
         				label:"申请日期",
 						style:{
							container:"width:50%;float:left;",
							label:"width:40%;float:left;",
							value:"width:50%;float:left;"
						},
         			},{
         				name:"assessmentTime",
         				label:"评估时间",
 						style:{
							container:"width:50%;float:right;",
							label:"width:40%;float:left;",
							value:"width:50%;float:left;"
						},
         			},{
 						name:"cardType",
 						label: i18ns.get("sale_card_type","会籍卡类别"),
 						style:{
							container:"width:50%;float:left;",
							label:"width:40%;float:left;",
							value:"width:50%;float:left;"
						},
 					},{
 						name:"creator",
         				label:"评估申请人",
         				style:{
							container:"width:50%;float:right;",
							label:"width:40%;float:left;",
							value:"width:50%;float:left;"
						},
 					}]
 				}
         	 });
         	 this.set("printform",printform); 
        	 var memberGrid=new Grid({
        		parentNode:".J-memberGrid",
 				model : {
 					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								ensureindex="";
								var form=widget.get("form");
				    			var peopleQuantity =form.getValue("peopleQuantity");
				    			if(peopleQuantity==""){
				    				Dialog.alert({
	        							content : "请选择计划入住人数！"
	        						 });
				    				return false;
				    			}
				    			var data=widget.get("memberGrid").getData();
				    			if(data.length>=peopleQuantity){
				    				Dialog.alert({
	        							content : "会员数量已达到计划入住人数！"
	        						 });
				    				return false;
				    			}
								widget.get("memberForm").reset();
								widget.get("subnav").hide(["return","save","back"]);
								widget.show(".J-memberForm").hide(".J-memberGrid,.J-form");
							}
						}]
 					},
 					columns : [{
 						key:"personalInfo.name",
 						name:"姓名",
 						format:"detail",
	 					formatparams:[{
	 					key:"detail",
							handler:function(index,data,rowEle){
								ensureindex=index;
								widget.show([".J-memberForm"]).hide([".J-memberGrid,.J-form"]);
								widget.get("subnav").hide(["return","save"]).show(["back"]);
								if(data.auditMaterials&&data.auditMaterials.split&&data.auditMaterials.split(",").length>1){
									//证明是用，隔开的值
									var datas=data.auditMaterials.split(",");
								}else{
									var datas=data.auditMaterials;
								}
								data.auditMaterials=datas;
								widget.get("memberForm").setData(data);
								widget.get("memberForm").setValue("name",data.personalInfo.name);
								widget.get("memberForm").setValue("sex",data.personalInfo.sex);
								widget.get("memberForm").setValue("birthday",data.personalInfo.birthday);
								widget.get("memberForm").setValue("idNumber",data.personalInfo.idNumber);
								widget.get("memberForm").setValue("idType",data.personalInfo.idType);
								widget.get("memberForm").setValue("mobilePhone",data.personalInfo.mobilePhone);
								widget.get("memberForm").setValue("phone",data.personalInfo.phone);
								widget.get("memberForm").setDisabled(true);
							}
	 					}]
 					},{
 						key:"personalInfo.sex",
 						name:"性别",
 						format:function(value,row){
 							if(value=="FEMALE"||value.key=="FEMALE"){
 								return "女";
 							}else{
 								return "男";
 							}
 						}
 					},{
 						key:"personalInfo.birthday",
 						name:"出生日期",
 						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
 					},{
 						key:"personalInfo.phone",
 						name:"联系电话",
 					},{
 						key:"personalInfo.idNumber",
 						name:"证件号",
 					},{
 						key:"gradeStatus.value",
 						name:"打分状态",
 					},{
 						key:"assessmentResult.score",
 						name:"评估得分"
 					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
	        				icon:"edit",
							handler : function(index,data, rowEle) {
								ensureindex=index;
								widget.show([".J-memberForm"]).hide([".J-memberGrid,.J-form"]);
								widget.get("subnav").hide(["return","save","back"]);
								if(data.auditMaterials&&data.auditMaterials.split&&data.auditMaterials.split(",").length>1){
									//证明是用，隔开的值
									var datas=data.auditMaterials.split(",");
								}else{
									var datas=data.auditMaterials;
								}
								data.auditMaterials=datas;
								widget.get("memberForm").setData(data);
								widget.get("memberForm").setValue("name",data.personalInfo.name);
								widget.get("memberForm").setValue("sex",data.personalInfo.sex);
								widget.get("memberForm").setValue("birthday",data.personalInfo.birthday);
								widget.get("memberForm").setValue("idNumber",data.personalInfo.idNumber);
								widget.get("memberForm").setValue("idType",data.personalInfo.idType);
								widget.get("memberForm").setValue("mobilePhone",data.personalInfo.mobilePhone);
								widget.get("memberForm").setValue("phone",data.personalInfo.phone);
								widget.get("memberForm").setDisabled(false);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								var carddata=widget.get("memberGrid").getData();
								carddata.splice(index,1);
								widget.get("memberGrid").setData(carddata);
							}
						}]
					}]
 				}
        	 });
        	 this.set("memberGrid",memberGrid);
        	 
        	 var memberForm=new Form({
        		parentNode:".J-memberForm",
             	saveaction:function(){
             		var data=widget.get("memberForm").getData();
//             		var key=memberForm.getValue("gradeStatus");
//             		var s=memberForm.getData("gradeStatus");
             		data.personalInfo=[];
             		data.personalInfo.name=data.name;
             		data.personalInfo.birthday=data.birthday;
             		data.personalInfo.idNumber=data.idNumber;
             		data.personalInfo.idType=data.idType;
             		data.personalInfo.mobilePhone=data.mobilePhone;
             		data.personalInfo.phone=data.phone;
             		data.personalInfo.sex=data.sex;
             		var carddata=widget.get("memberGrid").getData();
             		if(ensureindex==""){
	 					carddata.push(data);
             		}else{
	             		carddata[ensureindex]=data;
             		}
             		widget.get("memberGrid").setData(carddata);
             		widget.get("subnav").show(["return","save"]).hide(["back"]);
 					widget.show(".J-memberGrid,.J-form").hide(".J-memberForm");
             	},
  				//取消按钮
   				cancelaction:function(){
   					widget.get("subnav").show(["return","save"]).hide(["back"]);
   					widget.show(".J-memberGrid,.J-form").hide(".J-memberForm");
   				},
 				model:{
 					id:"member",
 					saveText:"确定",
 					items:[{
 						name:"pkMemberAssessmentDetail",
 						type:"hidden"
 					},{
 						name:"version",
 						type:"hidden",
 						defaultValue:0
 					},{
 						name:"isUsed",
 						type:"hidden",
 						defaultValue:false
 					},{
 						name:"died",
 						type:"hidden",
 						defaultValue:false
 					},{
 						name:"name",
 						label:"姓名",
 						type:"text",
						validate : [ "required" ],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
 					},{
 						name:"phone",
 						label:"联系电话",
						type:"text",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
 					},{
 						name:"sex",
 						label:"性别",
 						type:"radiolist",
						list:[{
							key:"MALE",
							value:"男"
						},{
							key:"FEMALE",
							value:"女"
						}],
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
 					},{
 						name:"mobilePhone",
 						label:"移动电话",
						type:"text",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
 					},{
 						name:"birthday",
 						label:"出生日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
 					},{
 						name:"idType",
 						label:"证件类型",
						type:"select",
						validate:["required"],
						url:"api/enum/com.eling.elcms.basedoc.model.PersonalInfo.IdType",
						defaultValue:"IdentityCard",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
 					},{
						name:"isStayHome",
						label:"是否入住颐养院",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}],
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
 						name:"idNumber",
 						label:"证件号",
						type:"text",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
 					},{
						name:"gradeStatus",
						type:"hidden",
						options:[{
        					key:"UnGrade",
        					value:"未打分"
        				},{
        					key:"Grade",
        					value:"已打分"
        				}],
						defaultValue:"UnGrade"
					},{
        				name:"auditMaterials",
						label:"审核材料",
						type:"checklist",
						list:[{key:"a",value:"会员入会表"},{key:"b",value:"会员信息登记表"},{key:"c",value:"权益人信息登记表"},{key:"d",value:"资产证明"},{key:"e",value:"入住会员体检报告"},{key:"f",value:"权益人/会员/担保人身份证复印件"},{key:"g",value:"会员户籍证明"},{key:"h",value:"会员婚姻证明"},{key:"i",value:"如有陪住人需提供陪住人身份证复印件，体检报告"}],
        			}]
 				}
        	 });
        	 this.set("memberForm",memberForm);
	 			var  approvalTest = new ApprovalTest({
	 				parentNode : ".J-approvalTest"
	 			});
	 			approvalTest.render();
	 			this.set("approvalTest",approvalTest);
		},
		afterInitComponent : function(params,widget) {
			var form=widget.get("form");
			var grid=widget.get("grid");
			if(params && params.pkMemberAssessment){
				widget.get("subnav").hide(["search","flowStatus","time","add","return"]);
				widget.show([".J-form,.J-memberGrid"]).hide([".J-grid"]);
				widget.get("memberGrid").setData(params.memberAssessmentDetail);
				form.setDisabled(true);
				$(".J-edit,.J-delete,.J-grid-head-add").addClass("hidden");
				var auditMaterials=params.auditMaterials;
				if(auditMaterials&&auditMaterials.split &&auditMaterials.split(",").length>1){
					//证明是用，隔开的值
					var datas=auditMaterials.split(",");
				}else{
					var datas=auditMaterials;
				}
				params.auditMaterials=datas;
				form.setData(params);
				form.load("room",{
					callback:function(){
						var room=form.getData("room","");
						room.push(params.room);
						form.setData("room",room);
						form.setValue("room",params.room);
					}
				});
				form.load("creator",{
					callback:function(){
						var creator=form.getData("creator","");
						creator.push(params.creator);
						form.setData("creator",creator);
						form.setValue("creator",params.creator);
					}
				});
				form.load("cardType",{
					callback:function(){
						var cardType=form.getData("cardType","");
						if(params.cardType!=null){
							cardType.push(params.cardType);
							form.setData("cardType",cardType);
							form.setValue("cardType",params.cardType);
						}
					}
				});
			}
		}
	});
	module.exports = assessmentapply;
});