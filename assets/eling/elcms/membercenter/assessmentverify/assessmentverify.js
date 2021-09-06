/**
 * 会员评估审核 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var ApprovalTest = require("approvalUI");
	require("./assessmentverify.css");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"+
	 "<div class='J-printform hidden'></div>"+
	 "<div class='J-memberGrid hidden'></div>"+
	 "<div class='J-approvalTest hidden'></div>";
	
	var assessmentverify = ELView.extend({
		events:{
			"click .J-verify":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var widget =this ;
				var form=widget.get("form");
				var approvalTest  = widget.get("approvalTest");
				approvalTest.set("param",{
					modelId:data.pkMemberAssessment,
					serviceType:"MemberCheckinAssessment",
					hideButton:false,
					callBack:function(data){
						aw.ajax({
							url:"api/memberassessment/query",
							data:{
								pkMemberAssessment:data.pkMemberAssessment,
								fetchProperties:"flowStatus"
							},
							dataType:"json",
							success:function(data2){
								form.setValue("flowStatus",data2[0].flowStatus);
							}
						});
					}
				});
				approvalTest.get("appgrid").refresh();
				var auditMaterials=data.auditMaterials;
				
				if(auditMaterials&&auditMaterials.split &&auditMaterials.split(",").length>1){
					//证明是用，隔开的值
					var datas=auditMaterials.split(",");
				}else{
					var datas=auditMaterials;
				}
				data.auditMaterials=datas;
				form.setData(data);
				form.load("room",{
					callback:function(){
						var room=form.getData("room","");
						room.push(data.room);
						form.setData("room",room);
						form.setValue("room",data.room);
					}
				});
				form.load("creator",{
					callback:function(){
						var creator=form.getData("creator","");
						creator.push(data.creator);
						form.setData("creator",creator);
						form.setValue("creator",data.creator);
					}
				});
				form.load("cardType",{
					callback:function(){
						var cardType=form.getData("cardType","");
						if(data.cardType!=null){
							cardType.push(data.cardType);
							form.setData("cardType",cardType);
							form.setValue("cardType",data.cardType);
						}
					}
				});
				widget.get("form").setData(data);
				widget.get("form").setDisabled(true);
				widget.get("memberGrid").setData(data.memberAssessmentDetail);
				widget.hide([".J-grid"]).show([".J-form",".J-memberGrid",".J-approvalTest"]);
				widget.get("subnav").show(["return","print"]).hide(["search","flowStatus","time"]);
			},
			"click .J-grade":function(e){
				var widget=this;
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var form=widget.get("form");
				var approvalTest  = widget.get("approvalTest");
				approvalTest.set("param",{
					modelId:data.pkMemberAssessment,
					serviceType:"MemberCheckinAssessment",
					hideButton:true,
				});
				approvalTest.get("appgrid").refresh();
				var auditMaterials=data.auditMaterials;
				if(auditMaterials&&auditMaterials.split &&auditMaterials.split(",").length>1){
					//证明是用，隔开的值
					var datas=auditMaterials.split(",");
				}else{
					var datas=auditMaterials;
				}
				data.auditMaterials=datas;
				form.setData(data);
				form.load("room",{
					callback:function(){
						var room=form.getData("room","");
						room.push(data.room);
						form.setData("room",room);
						form.setValue("room",data.room);
					}
				});
				form.load("creator",{
					callback:function(){
						var creator=form.getData("creator","");
						creator.push(data.creator);
						form.setData("creator",creator);
						form.setValue("creator",data.creator);
					}
				});
				form.load("cardType",{
					callback:function(){
						var cardType=form.getData("cardType","");
						if(data.cardType!=null){
							cardType.push(data.cardType);
							form.setData("cardType",cardType);
							form.setValue("cardType",data.cardType);
						}
					}
				});
				var approvalTest  = widget.get("approvalTest");
				widget.get("form").setDisabled(true);
				$(".J-test").addClass("hidden");
				widget.get("memberGrid").setData(data.memberAssessmentDetail);
				widget.hide([".J-grid"]).show([".J-form",".J-memberGrid",".J-approvalTest"]);
				widget.get("subnav").show(["return","print"]).hide(["time","search","flowStatus"]);
			}
		},
		attrs:{
        	template:template
        },
        initComponent:function(params,widget){
		        	var subnav=new Subnav({
						parentNode:".J-subnav",
						model : {
							title :  i18ns.get("sale_ship_owner","会员")+"评估审核",
							search : function(str) {
								var g = widget.get("grid");
								aw.ajax({
											url : "api/memberassessment/search",
											data : {
												s : str,
												properties : "room.number,peopleQuantity,creator.name,leading.name,flowStatus",
												fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
												"memberAssessmentDetail.assessmentResult.diseaseHistory," +
												"memberAssessmentDetail.assessmentResult.version,"+
												"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
												"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
												"memberAssessmentDetail.version," +
												"memberAssessmentDetail.auditMaterials," +
												"memberAssessmentDetail.isStayHome," +
												"memberAssessmentDetail.pkMemberAssessmentDetail,*," +
												"memberAssessmentDetail.gradeStatus," +
												"memberAssessmentDetail.assessmentResult.physiology.*," +
												"memberAssessmentDetail.assessmentResult.score," +
												"memberAssessmentDetail.assessmentResult.psychology.*," +
												"memberAssessmentDetail.assessmentResult.nature.*," +
												"memberAssessmentDetail.assessmentResult.rank.*," +
												"memberAssessmentDetail.assessmentResult.costSource.*," +
												"memberAssessmentDetail.assessmentResult.maritalStatus.*," +
												"memberAssessmentDetail.assessmentResult.childrenRelationship.*," +
												"memberAssessmentDetail.assessmentResult.motive.*," +
												"memberAssessmentDetail.assessmentResult.socialInterest.*," +
												"memberAssessmentDetail.assessmentResult.consumptionConcept.*," +
												"memberAssessmentDetail.assessmentResult.education.*," +
												"memberAssessmentDetail.assessmentResult.age.*,*," +
												"leading.name,leading.pkUser," +
												"memberAssessmentDetail.assessmentResult.*," +
												"creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
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
		    				   items:[{
		    					   key:"Approvaling",
		    					   value:"审批中"
		    				   },{
		    					   key:"Approved",
		    					   value:"已通过"  
		    				   },{
		    					   key:"NotApproved",
		    					   value:"未通过"  
		    				   },{
		    					   key:"Approvaling,Approved,NotApproved",
		    					   value:"全部"
		    				   }],
		    				   handler:function(key,element){
									   widget.get("grid").refresh();
		    				   }
		    			   }],
							buttons:[{
		    					id:"return",
								text:"返回",
								show:false,
								handler:function(){
									widget.show([".J-grid"]).hide([".J-form",".J-memberGrid",".J-approvalTest"]);
									$(".J-test").addClass("hidden");
									widget.get("subnav").hide(["return","print"]).show(["time","search","flowStatus"]);
								}
		    				},{
		    					id:"print",
								text:"打印",
								show:false,
								handler:function(){
									var  printform=widget.get("printform");
									var  form=widget.get("form");
									printform.reset();
									printform.setValue("personalCardowners",form.getValue("personalCardowners"));
									printform.setValue("peopleQuantity",form.getValue("peopleQuantity"));
									printform.setValue("checkInTime",moment(form.getValue("checkInTime")).format("YYYY-MM-DD"));
									printform.setValue("room",form.getData("room",{pk:form.getValue("room")}).number);
									printform.setValue("createTime",moment(form.getValue("createTime")).format("YYYY-MM-DD"));
									printform.setValue("assessmentTime",moment(form.getValue("assessmentTime")).format("YYYY-MM-DD"));
									printform.setValue("cardType",form.getData("cardType",{pk:form.getValue("cardType")}).name);
									printform.setValue("creator",form.getData("creator",{pk:form.getValue("creator")}).name);
									printform.setValue("flowStatus",form.getValue("flowStatus"));
									
									window.print();
								}
		    				
		    				}],time:{
		      				   		tip:"申请日期",
		        				   click:function(time){
		        					   widget.get("grid").refresh();
		        				   },
		        			   }
						}
					});
		        	this.set("subnav",subnav);
        	
		        	var grid=new Grid({
		        		autoRender:false,
		        		parentNode:".J-grid",
		        		url : "api/memberassessment/query",
						params : function() {
							var subnav = widget.get("subnav");
							return {
								"flowStatusIn" : subnav.getValue("flowStatus"),
								"createTime":widget.get("subnav").getValue("time").start,
								"createTimeEnd":widget.get("subnav").getValue("time").end,
								fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
								"memberAssessmentDetail.assessmentResult.diseaseHistory," +
								"memberAssessmentDetail.assessmentResult.version,"+
								"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
								"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
								"memberAssessmentDetail.version," +
								"memberAssessmentDetail.auditMaterials," +
								"memberAssessmentDetail.isStayHome," +
								"memberAssessmentDetail.pkMemberAssessmentDetail,*," +
								"memberAssessmentDetail.gradeStatus," +
								"memberAssessmentDetail.assessmentResult.physiology.*," +
								"memberAssessmentDetail.assessmentResult.score," +
								"memberAssessmentDetail.assessmentResult.psychology.*," +
								"memberAssessmentDetail.assessmentResult.nature.*," +
								"memberAssessmentDetail.assessmentResult.rank.*," +
								"memberAssessmentDetail.assessmentResult.costSource.*," +
								"memberAssessmentDetail.assessmentResult.maritalStatus.*," +
								"memberAssessmentDetail.assessmentResult.childrenRelationship.*," +
								"memberAssessmentDetail.assessmentResult.motive.*," +
								"memberAssessmentDetail.assessmentResult.socialInterest.*," +
								"memberAssessmentDetail.assessmentResult.consumptionConcept.*," +
								"memberAssessmentDetail.assessmentResult.education.*," +
								"memberAssessmentDetail.assessmentResult.age.*,*," +
								"leading.name,leading.pkUser," +
								"memberAssessmentDetail.assessmentResult.*," +
								"creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
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
									widget.openView({
										url:"eling/elcms/membercenter/assessmentresultconfirm/assessmentresultconfirm",
										params:{
											data:data,
											pkMemberAssessment:data.pkMemberAssessment,
											version:data.version,
											leading:data.leading,
											pkAssessmentResult:data.assessmentResult,
											father:"MemberAssessment"
										},
										isAllowBack:true
									});
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
											if(value.flowStatus.key=="Approvaling"){
												var ret1 = "<pre><a style='margin-left:5px;color:white;background:#f34541' class='J-grade btn btn-xs ' href='javascript:void(0);''>详细</a>" +  
		          	                            "<a style='margin-left:5px;color:white;background:#f34541' class='J-verify btn btn-xs ' href='javascript:void(0);''>审核</a></pre>"; 
		      					          		return ret1;  
//												return "button";
											}else{
												return"<pre><a style='margin-left:5px;color:white;background:#f34541' class='J-grade btn btn-xs ' href='javascript:void(0);''>详细</a></pre>";  
											}
										},
										formatparams : []
									}]
						}
		        	});
		        	 this.set("grid",grid);
		        	 
		        	 var form = new Form({
		          		parentNode:".J-form",
		          		model:{
		          			id:"assessmentdetail",
		          			items:[{
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
								label:"会籍卡类别",
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
		        				type:"select",
		        				className:{
		        					
									container:"col-md-6",
									label:"col-md-4"
								},
		        				url:"api/enum/com.eling.elcms.fp.model.FlowStatus",
		        			}]
		          		}
		 			});
		 			this.set("form",form);
		 			
		 			var printform = new Form({
		 				parentNode:".J-printform",
		 				model:{
		 					id:"printform",
		 					defaultButton:false,
		 					items:[{
								label:"权益人",
								name:"personalCardowners",
								type:"text",
								style:{
									container:"width:45%;float:left;",
									label:"width:40%;float:left;",
									value:"width:50%;float:left;"
								},
							},{
								name:"peopleQuantity",
								label:"入住人数",
								type:"select",
								options:[{
		        					key:"1",
		        					value:"1"
		        				},{
		        					key:"2",
		            				value:"2"
		        				}],
		        				style:{
		    						container:"width:45%;float:left;",
		    						label:"width:40%;float:left;",
		    						value:"width:50%;float:left;"
		    					},
							},{
								name:"checkInTime",
								label:"入住时间",
								style:{
									container:"width:45%;float:left;",
									label:"width:40%;float:left;",
									value:"width:50%;"
								},
							},{
								name:"room",
		        				label:"房号",
		        				style:{
		    						container:"width:45%;float:left;",
		    						label:"width:40%;float:left;",
		    						value:"width:50%;float:left;"
		    					},
							},{
		        				name:"createTime",
		        				label:"申请日期",
								style:{
									container:"width:45%;float:left;",
									label:"width:40%;float:left;",
									value:"width:50%;float:left;"
								},
		        			},{
		        				name:"assessmentTime",
		        				label:"评估时间",
								style:{
									container:"width:45%;float:left;",
									label:"width:40%;float:left;",
									value:"width:50%;float:left;"
								},
		        			},{
								name:"cardType",
								label:"会籍卡",
								style:{
									container:"width:45%;float:left;",
									label:"width:40%;float:left;",
									value:"width:50%;float:left;"
								},
							},{
								name:"creator",
		        				label:"申请人",
		        				style:{
		    						container:"width:45%;float:left;",
		    						label:"width:40%;float:left;",
		    						value:"width:50%;float:left;"
		    					},
							},{
		        				name:"flowStatus",
		        				label:"状态",
		        				type:"select",
		        				url:"api/enum/com.eling.elcms.fp.model.FlowStatus",
		        				style:{
		    						container:"width:45%;float:left;",
		    						label:"width:40%;float:left;",
		    						value:"width:50%;float:left;"
		    					},
		        				
		        			}] 
		 				}
		 			})
		 			this.set("printform",printform);
		 			
		 			 var memberGrid=new Grid({
		         		parentNode:".J-memberGrid",
		         		isInitPageBar:false,
		  				model : {
		  					columns : [{
		  						key:"personalInfo.name",
		  						name:"姓名"
		  					},{
		  						key:"personalInfo.sex.value",
		  						name:"性别",
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
		  					}]
		  				}
		         	 });
		         	 this.set("memberGrid",memberGrid);
		 			
		 			var  approvalTest = new ApprovalTest({
		 				parentNode : ".J-approvalTest"
		 			});
		 			approvalTest.render();
		 			this.set("approvalTest",approvalTest);
		        	 
		},
		approval : function(params,widget){
			if(params&&params.modelId){
				 widget.get("grid").refresh({
					  	pkMemberAssessment:params.modelId,
					  	fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
						"memberAssessmentDetail.assessmentResult.diseaseHistory," +
						"memberAssessmentDetail.assessmentResult.version,"+
						"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
						"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
						"memberAssessmentDetail.version," +
						"memberAssessmentDetail.auditMaterials," +
						"memberAssessmentDetail.isStayHome," +
						"memberAssessmentDetail.pkMemberAssessmentDetail,*," +
						"memberAssessmentDetail.gradeStatus," +
						"memberAssessmentDetail.assessmentResult.physiology.*," +
						"memberAssessmentDetail.assessmentResult.score," +
						"memberAssessmentDetail.assessmentResult.psychology.*," +
						"memberAssessmentDetail.assessmentResult.nature.*," +
						"memberAssessmentDetail.assessmentResult.rank.*," +
						"memberAssessmentDetail.assessmentResult.costSource.*," +
						"memberAssessmentDetail.assessmentResult.maritalStatus.*," +
						"memberAssessmentDetail.assessmentResult.childrenRelationship.*," +
						"memberAssessmentDetail.assessmentResult.motive.*," +
						"memberAssessmentDetail.assessmentResult.socialInterest.*," +
						"memberAssessmentDetail.assessmentResult.consumptionConcept.*," +
						"memberAssessmentDetail.assessmentResult.education.*," +
						"memberAssessmentDetail.assessmentResult.age.*,*," +
						"leading.name,leading.pkUser," +
						"memberAssessmentDetail.assessmentResult.*," +
						"creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
				});
			}
		},
		afterInitComponent:function(params,widget) {
			if(params&&params.modelId){
				 widget.get("grid").refresh({
					  	pkMemberAssessment:params.modelId,
					  	fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
						"memberAssessmentDetail.assessmentResult.diseaseHistory," +
						"memberAssessmentDetail.assessmentResult.version,"+
						"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
						"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
						"memberAssessmentDetail.version," +
						"memberAssessmentDetail.auditMaterials," +
						"memberAssessmentDetail.isStayHome," +
						"memberAssessmentDetail.pkMemberAssessmentDetail,*," +
						"memberAssessmentDetail.gradeStatus," +
						"memberAssessmentDetail.assessmentResult.physiology.*," +
						"memberAssessmentDetail.assessmentResult.score," +
						"memberAssessmentDetail.assessmentResult.psychology.*," +
						"memberAssessmentDetail.assessmentResult.nature.*," +
						"memberAssessmentDetail.assessmentResult.rank.*," +
						"memberAssessmentDetail.assessmentResult.costSource.*," +
						"memberAssessmentDetail.assessmentResult.maritalStatus.*," +
						"memberAssessmentDetail.assessmentResult.childrenRelationship.*," +
						"memberAssessmentDetail.assessmentResult.motive.*," +
						"memberAssessmentDetail.assessmentResult.socialInterest.*," +
						"memberAssessmentDetail.assessmentResult.consumptionConcept.*," +
						"memberAssessmentDetail.assessmentResult.education.*," +
						"memberAssessmentDetail.assessmentResult.age.*,*," +
						"leading.name,leading.pkUser," +
						"memberAssessmentDetail.assessmentResult.*," +
						"creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
				});
			}else{
				widget.get("grid").refresh();
			}
		}
	});
	module.exports = assessmentverify;
});