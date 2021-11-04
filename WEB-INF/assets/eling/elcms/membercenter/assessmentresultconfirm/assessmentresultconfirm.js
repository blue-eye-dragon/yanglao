/**
 * 会员评估打分
 */ 
define(function(require, exports, module) { 
	//多语
	var i18ns = require("i18n");
	var ELView=require("elview");
	var BaseView=require("baseview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form-2.0.0")
	var Dialog = require("dialog");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var Profile=require("profile");
	var activeUser = store.get("user");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"+
	 "<div class='J-profile hidden'></div>"+
	 "<div class='J-memberGrid hidden'></div>"+
	 "<div class='J-memberForm hidden'></div>";
	var assessmentresultconfirm =ELView.extend({
		attrs:{
        	template:template
        },
        events:{
        	"click .J-grade":function(e){
        		var widget=this;
        		var grid=this.get("grid");
        		var index=grid.getIndex(e.target);
        		var data=grid.getSelectedData(index);
        		for(var i=0;i<data.memberAssessmentDetail.length;i++){
        			data.memberAssessmentDetail[i].leading=data.leading;
        			data.memberAssessmentDetail[i].pkMemberAssessment=data.pkMemberAssessment;
        			data.memberAssessmentDetail[i].assessmentTime=data.assessmentTime;
        			data.memberAssessmentDetail[i].flowStatus=data.flowStatus;
        		}
        		widget.get("memberGrid").setData(data.memberAssessmentDetail);
        		var form=widget.get("form");
        		form.setDisabled(true);
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
        		this.show([".J-form,.J-memberGrid"]).hide([".J-grid"]);
        		this.get("subnav").hide(["search","flowStatus","gradeStatus","time","back"]).show(["return"]);
        	},
        	"click .J-grades":function(e){
        		var widget=this;
        		widget.get("profile").setDisabled(false);
        		var grid=this.get("memberGrid");
        		var index=grid.getIndex(e.target);
        		var data=grid.getSelectedData(index);
        		widget.get("profile").setAttribute("assessmentTime","readonly","readonly");
        		if(data.leading!=null&&data.leading.pkUser==activeUser.pkUser){
        			if(data.assessmentResult==null){
        				if(data.isStayHome){
        					Dialog.confirm({
								title:"提示",
								content:"该会员为入住颐养院会员，是否跳过打分",
								confirm:function(){
									var params={
											pkMemberAssessmentDetail:data.pkMemberAssessmentDetail,
											pkMemberAssessment:data.pkMemberAssessment
									};
									Dialog.mask(true);
									aw.saveOrUpdate("api/assessmentresult/save",params,function(){
										Dialog.mask(false);
										aw.ajax({
											url : "api/memberassessmentdetail/query",
											data : {
												"memberAssessment.pkMemberAssessment":data.pkMemberAssessment,
												fetchProperties : "assessmentResult.description," +
												"assessmentResult.diseaseHistory,assessmentResult.version,"+
												"assessmentResult.score," +
												"assessmentResult.physiology.*,assessmentResult.psychology.*," +
												"assessmentResult.nature.*,assessmentResult.rank.*," +
												"assessmentResult.costSource.*,assessmentResult.maritalStatus.*," +
												"assessmentResult.childrenRelationship.*,assessmentResult.motive.*," +
												"assessmentResult.socialInterest.*,assessmentResult.consumptionConcept.*," +
												"assessmentResult.education.*,assessmentResult.age.*," +
												"assessmentResult.pkAssessmentResult," +
												"personalInfo.version,personalInfo.pkPersonalInfo," +
												"personalInfo.name,personalInfo.birthday,personalInfo.idNumber," +
												"personalInfo.idType,personalInfo.mobilePhone," +
												"personalInfo.phone,personalInfo.sex," +
												"gradeStatus,version,auditMaterials," +
												"isStayHome,pkMemberAssessmentDetail," +
												"memberAssessment.flowStatus," +
												"memberAssessment.leading," +
												"memberAssessment.pkMemberAssessment," +
												"memberAssessment.assessmentTime" 
											},
											dataType : "json",
											success : function(memberassessmentdetails) {
												for ( var i in memberassessmentdetails) {
													memberassessmentdetails[i].leading=memberassessmentdetails[i].memberAssessment.leading;
													memberassessmentdetails[i].pkMemberAssessment=memberassessmentdetails[i].memberAssessment.pkMemberAssessment;
													memberassessmentdetails[i].assessmentTime=memberassessmentdetails[i].memberAssessment.assessmentTime;
													memberassessmentdetails[i].flowStatus=memberassessmentdetails[i].memberAssessment.flowStatus;
												}
												grid.setData(memberassessmentdetails);
											}
										});
										
									});
								},
								 cancel : function(){
							            // 点击取消按钮触发的事件
									 	widget.show([".J-profile"]).hide([".J-grid,.J-form,.J-memberGrid"]);
				        				widget.get("subnav").hide(["search","flowStatus","gradeStatus","time","return"]).show(["back"]);
				        				widget.get("profile").setData(data);
				        				widget.get("profile").setValue("assessmentTime",moment());
				        				widget.get("profile").setValue("pkMemberAssessmentDetail",data.pkMemberAssessmentDetail);
				        				widget.get("profile").setValue("pkMemberAssessment",data.pkMemberAssessment);
				        				widget.get("profile").setValue("version",data.version);
							         }
							});
        				}else{
        					widget.show([".J-profile"]).hide([".J-grid,.J-form,.J-memberGrid"]);
        					widget.get("subnav").hide(["search","flowStatus","gradeStatus","time","return"]).show(["back"]);
        					widget.get("profile").setData(data);
        					widget.get("profile").setValue("assessmentTime",moment());
        					widget.get("profile").setValue("pkMemberAssessmentDetail",data.pkMemberAssessmentDetail);
        					widget.get("profile").setValue("pkMemberAssessment",data.pkMemberAssessment);
        					widget.get("profile").setValue("version",data.version);
        				}
        				
        			}else{
        				var pro=widget.get("profile");
        				pro.setData(data);
        				widget.get("profile").setValue("version",data.assessmentResult.version);
        				widget.get("profile").setValue("pkAssessmentResult",data.assessmentResult.pkAssessmentResult);
        				if(data.assessmentResult.diseaseHistory&&data.assessmentResult.diseaseHistory.split &&data.assessmentResult.diseaseHistory.split(",").length>1){
        					//证明是用，隔开的值
        					var datas=data.assessmentResult.diseaseHistory.split(",");
        				}else if(data.assessmentResult.diseaseHistory==null){
        					var datas="";
        				}else{
        					var datas=data.assessmentResult.diseaseHistory;
        				}
        				pro.setValue("diseaseHistory",datas);
        				pro.setValue("age",data.assessmentResult.age.pkAssessItem+"-"+data.assessmentResult.age.assessValue);
        				pro.setValue("education",data.assessmentResult.education.pkAssessItem+"-"+data.assessmentResult.education.assessValue);
        				pro.setValue("rank",data.assessmentResult.rank.pkAssessItem+"-"+data.assessmentResult.rank.assessValue);
        				pro.setValue("costSource",data.assessmentResult.costSource.pkAssessItem+"-"+data.assessmentResult.costSource.assessValue);
        				pro.setValue("maritalStatus",data.assessmentResult.maritalStatus.pkAssessItem+"-"+data.assessmentResult.maritalStatus.assessValue);
        				pro.setValue("childrenRelationship",data.assessmentResult.childrenRelationship.pkAssessItem+"-"+data.assessmentResult.childrenRelationship.assessValue);
        				pro.setValue("motive",data.assessmentResult.motive.pkAssessItem+"-"+data.assessmentResult.motive.assessValue);
        				pro.setValue("socialInterest",data.assessmentResult.socialInterest.pkAssessItem+"-"+data.assessmentResult.socialInterest.assessValue);
        				pro.setValue("consumptionConcept",data.assessmentResult.consumptionConcept.pkAssessItem+"-"+data.assessmentResult.consumptionConcept.assessValue);
        				pro.setValue("nature",data.assessmentResult.nature.pkAssessItem+"-"+data.assessmentResult.nature.assessValue);
        				pro.setValue("psychology",data.assessmentResult.psychology.pkAssessItem+"-"+data.assessmentResult.psychology.assessValue);
        				pro.setValue("physiology",data.assessmentResult.physiology.pkAssessItem+"-"+data.assessmentResult.physiology.assessValue);
        				pro.setAttribute("assessmentTime","readonly","readonly");
        				pro.setValue("assessmentTime",data.assessmentTime);
        				pro.setValue("version",data.assessmentResult.version);
        				pro.setValue("description",data.assessmentResult.description);
        				pro.setValue("score",data.assessmentResult.score);
        				widget.show([".J-profile"]).hide([".J-grid,.J-form,.J-memberGrid"]);
        				widget.get("subnav").hide(["search","flowStatus","gradeStatus","time","return"]).show(["back"]);
        			}
        		}else{
        			if(data.leading!=null){
        				Dialog.alert({
        					content : "您不是评估负责人，不能进行评分!评估负责人是:"+data.leading.name
        				});
        				return false;
        			}else{
        				Dialog.alert({
        					content : "没有评估负责人！"
        				});
        				return false;
        			}
        		}
        	},
        	"click .J-apply":function(e){
        		var widget=this;
        		var grid=this.get("grid");
        		var index=grid.getIndex(e.target);
        		var data=grid.getSelectedData(index);
        		for(var i=0;i<data.memberAssessmentDetail.length;i++){
        			data.memberAssessmentDetail[i].leading=data.leading;
        			data.memberAssessmentDetail[i].pkMemberAssessment=data.pkMemberAssessment;
        			data.memberAssessmentDetail[i].assessmentTime=data.assessmentTime;
        			data.memberAssessmentDetail[i].flowStatus=data.flowStatus;
        		}
        		widget.get("memberGrid").setData(data.memberAssessmentDetail);
        		var form=widget.get("form");
        		form.setDisabled(true);
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
        		this.get("profile").setDisabled(true);
        		this.show([".J-form,.J-memberGrid"]).hide([".J-grid"]);
        		this.get("subnav").hide(["search","flowStatus","gradeStatus","time","back"]).show(["return"]);
        		
        	},
        	"click input[type='radio']":function(e){
        		var profile=this.get("profile");
        		var age= profile.getValue("age")==undefined?0:parseInt(profile.getValue("age").split("-")[1]);
        		var education= profile.getValue("education")==undefined?0:parseInt(profile.getValue("education").split("-")[1]);
        		var rank= profile.getValue("rank")==undefined?0:parseInt(profile.getValue("rank").split("-")[1]);
        		var costSource= profile.getValue("costSource")==undefined?0:parseInt(profile.getValue("costSource").split("-")[1]);
        		var maritalStatus= profile.getValue("maritalStatus")==undefined?0:parseInt(profile.getValue("maritalStatus").split("-")[1]);
        		var childrenRelationship= profile.getValue("childrenRelationship")==undefined?0:parseInt(profile.getValue("childrenRelationship").split("-")[1]);
        		var motive= profile.getValue("motive")==undefined?0:parseInt(profile.getValue("motive").split("-")[1]);
        		var socialInterest= profile.getValue("socialInterest")==undefined?0:parseInt(profile.getValue("socialInterest").split("-")[1]);
        		var consumptionConcept= profile.getValue("consumptionConcept")==undefined?0:parseInt(profile.getValue("consumptionConcept").split("-")[1]);
        		var nature= profile.getValue("nature")==undefined?0:parseInt(profile.getValue("nature").split("-")[1]);
        		var psychology= profile.getValue("psychology")==undefined?0:parseInt(profile.getValue("psychology").split("-")[1]);
        		var physiology=profile.getValue("physiology")==undefined?0:parseInt(profile.getValue("physiology").split("-")[1]);
        		var score=age+education+rank+costSource+maritalStatus+childrenRelationship+motive+socialInterest+consumptionConcept+nature+psychology+physiology;
        		profile.setValue("score",score);
        		profile.setAttribute("score","readonly");
        	},
        	
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model : {
					title : i18ns.get("sale_ship_owner","会员")+"评估打分",
					search : function(str) {
						var g = widget.get("grid");
						aw.ajax({
							url : "api/memberassessment/search",
							data : {
								s : str,
								properties : "room.number,peopleQuantity,creator.name,leading.name,flowStatus",
								fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
								"memberAssessmentDetail.assessmentResult.diseaseHistory,memberAssessmentDetail.assessmentResult.version,"+
								"memberAssessmentDetail.assessmentResult.score," +
								"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*," +
								"memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*," +
								"memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*," +
								"memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*," +
								"memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*," +
								"memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
								"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
								"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo," +
								"memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber," +
								"memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone," +
								"memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
								"memberAssessmentDetail.gradeStatus,memberAssessmentDetail.version,memberAssessmentDetail.auditMaterials," +
								"memberAssessmentDetail.isStayHome,memberAssessmentDetail.pkMemberAssessmentDetail,*,leading.name,leading.pkUser," +
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
				   },{
					   key:"Commited,Approvaling,Approved,NotApproved",
					   value:"全部"
				   }],
    				   handler:function(key,element){
							   widget.get("grid").refresh();
    				   }
    			   },{
     				  id:"gradeStatus",
     				 tip:"是否打分",
     				  items:[{
					   key:"UnGrade",
					   value:"未打分"  
				   },{
					   key:"Grade",
					   value:"已打分"
				   },{
					   key:"",
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
							widget.show([".J-grid"]).hide([".J-profile,.J-memberForm,.J-memberGrid,.J-form"]);
							widget.get("subnav").hide(["return","back"]).show(["time","search","flowStatus","gradeStatus"]);
						}
    				},{
    					id:"back",
						text:"返回",
						show:false,
						handler:function(index,data,rowEle){
							widget.show([".J-form,.J-memberGrid"]).hide([".J-grid,.J-profile,.J-memberForm"]);
							widget.get("subnav").hide(["search","flowStatus","gradeStatus","time","back"]).show(["return"]);
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
        		parentNode:".J-grid",
        		url : "api/memberassessment/query",
        		lazy:true,
				params : function() {
					var subnav = widget.get("subnav");
					return {
						"flowStatusIn" : subnav.getValue("flowStatus"),
						"gradeStatus":subnav.getValue("gradeStatus"),
						"memberAssessmentDetail.gradeStatus":subnav.getValue("gradeStatus"),
						"createTime":widget.get("subnav").getValue("time").start,
						"createTimeEnd":widget.get("subnav").getValue("time").end,
						fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
								"memberAssessmentDetail.assessmentResult.diseaseHistory,memberAssessmentDetail.assessmentResult.version,"+
								"memberAssessmentDetail.assessmentResult.score," +
								"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*,memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*,memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*,memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*,memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*,memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
								"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
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
								widget.openView({
									url:"eling/elcms/membercenter/assessmentapply/assessmentapply",
									params:{
										pkMemberAssessment:data.pkMemberAssessment,
										flowStatus:data.flowStatus,
										assessmentOpinion:data.assessmentOpinion,
										auditMaterials:data.auditMaterials,
										personalCardowners:data.personalCardowners,
										name:data.name,
										idType:data.idType,
										phoneNumber:data.phoneNumber,
										mobilePhone:data.mobilePhone,
										sex:data.sex,
										idNumber:data.idNumber,
										birthday:data.birthday,
										peopleQuantity:data.peopleQuantity,
										type:data.type,
										checkInTime:data.checkInTime,
										room:data.room,
										cardType:data.cardType,
										isStayHome:data.isStayHome,
										createTime:data.createTime,
										leading:data.leading,
										assessmentTime:data.assessmentTime,
										creator:data.creator,
										memberAssessmentDetail:data.memberAssessmentDetail,
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
									if(value.flowStatus.key!="Commited"){
										var ret1 =  "<pre>" +  
          	                            "<a style='margin-left:5px;color:white;background:#f34541' class='J-apply btn btn-xs ' href='javascript:void(0);''>明细</a>"
										+"</pre>";
										return ret1;
									}else{
										var ret1 =  "<pre>" +  
          	                            "<a style='margin-left:5px;color:white;background:#f34541' class='J-grade btn btn-xs ' href='javascript:void(0);''>打分</a>" +  
          	                            "</pre>"; 
      					          		return ret1;  
									}
								}

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
	        	 
	        	 var memberGrid=new Grid({
	        		parentNode:".J-memberGrid",
	 				model : {
	 					columns : [{
	 						key:"personalInfo.name",
	 						name:"姓名",
	 						format:"detail",
		 					formatparams:[{
		 					key:"details",
								handler:function(index,data,rowEle){
									widget.show([".J-memberForm"]).hide([".J-memberGrid,.J-form"]);
									widget.get("subnav").hide(["return"]).show(["back"]);
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
	 						name:"打分状态"
	 					},{
	 						key:"assessmentResult.score",
	 						name:"评估得分",
	 						format:function(value,row){
	 							return value?value:0;
	 						}
	 					},{
							key:"operate",
							name:"操作",
							format:function(row,value){
								if(value.flowStatus.key=="Commited"){
									return "<pre><a style='margin-left:5px;color:white;background:#f34541' class='J-grades btn btn-xs ' href='javascript:void(0);''>打分</a></pre>";
								}else{
									return "button";  
								}
							},
							formatparams:[{
								key:"detail",
        						text:"明细",
								handler : function(index,data, rowEle) {
									widget.get("profile").setAttribute("assessmentTime","readonly","readonly");
									if(data.assessmentResult==null){
										Dialog.alert({
											content : "请先评分才能查看详情！"
										 });
										return false;
									}else{
										if(data.isStayHome && !data.assessmentResult.diseaseHistory){
											Dialog.alert({
												content : "该老人未入住颐养院老人打分流程已跳过！"
											 });
											return false;
										}
										
										var pro=widget.get("profile");
										pro.setData(data);
										widget.get("profile").setValue("version",data.assessmentResult.version);
										widget.get("profile").setValue("pkAssessmentResult",data.assessmentResult.pkAssessmentResult);
										if(data.assessmentResult.diseaseHistory&&data.assessmentResult.diseaseHistory.split &&data.assessmentResult.diseaseHistory.split(",").length>1){
											//证明是用，隔开的值
											var datas=data.assessmentResult.diseaseHistory.split(",");
										}else if(data.assessmentResult.diseaseHistory==null){
											var datas="";
										}else{
											var datas=data.assessmentResult.diseaseHistory;
										}
										pro.setValue("diseaseHistory",datas);
										pro.setValue("age",data.assessmentResult.age.pkAssessItem+"-"+data.assessmentResult.age.assessValue);
										pro.setValue("education",data.assessmentResult.education.pkAssessItem+"-"+data.assessmentResult.education.assessValue);
										pro.setValue("rank",data.assessmentResult.rank.pkAssessItem+"-"+data.assessmentResult.rank.assessValue);
										pro.setValue("costSource",data.assessmentResult.costSource.pkAssessItem+"-"+data.assessmentResult.costSource.assessValue);
										pro.setValue("maritalStatus",data.assessmentResult.maritalStatus.pkAssessItem+"-"+data.assessmentResult.maritalStatus.assessValue);
										pro.setValue("childrenRelationship",data.assessmentResult.childrenRelationship.pkAssessItem+"-"+data.assessmentResult.childrenRelationship.assessValue);
										pro.setValue("motive",data.assessmentResult.motive.pkAssessItem+"-"+data.assessmentResult.motive.assessValue);
										pro.setValue("socialInterest",data.assessmentResult.socialInterest.pkAssessItem+"-"+data.assessmentResult.socialInterest.assessValue);
										pro.setValue("consumptionConcept",data.assessmentResult.consumptionConcept.pkAssessItem+"-"+data.assessmentResult.consumptionConcept.assessValue);
										pro.setValue("nature",data.assessmentResult.nature.pkAssessItem+"-"+data.assessmentResult.nature.assessValue);
										pro.setValue("psychology",data.assessmentResult.psychology.pkAssessItem+"-"+data.assessmentResult.psychology.assessValue);
										pro.setValue("physiology",data.assessmentResult.physiology.pkAssessItem+"-"+data.assessmentResult.physiology.assessValue);
										pro.setAttribute("assessmentTime","readonly","readonly");
										pro.setValue("assessmentTime",data.assessmentTime);
										pro.setValue("version",data.assessmentResult.version);
										pro.setValue("description",data.assessmentResult.description);
										pro.setValue("score",data.assessmentResult.score);
										widget.show([".J-profile"]).hide([".J-grid,.J-form,.J-memberGrid"]);
										pro.setDisabled(true);
										widget.get("subnav").hide(["search","flowStatus","gradeStatus","time","return"]).show(["back"]);
									}
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
	 						list:[{key:"a",value:i18ns.get("sale_ship_owner","会员")+"入会表"},{key:"b",value:i18ns.get("sale_ship_owner","会员")+"信息登记表"},{key:"c",value:"权益人信息登记表"},{key:"d",value:"资产证明"},{key:"e",value:"入住"+i18ns.get("sale_ship_owner","会员")+"体检报告"},{key:"f",value:"权益人/"+i18ns.get("sale_ship_owner","会员")+"/担保人身份证复印件"},{key:"g",value:i18ns.get("sale_ship_owner","会员")+"户籍证明"},{key:"h",value:i18ns.get("sale_ship_owner","会员")+"婚姻证明"},{key:"i",value:"如有陪住人需提供陪住人身份证复印件，体检报告"}],
	         			}]
	  				}
	         	 });
	         	 this.set("memberForm",memberForm);
        	
     		},
     		afterInitComponent : function(params,widget) {
     			aw.ajax({
					url:"api/assessitem/query",
					dataType:"json",
					data : {
						fetchProperties:"*,assessType.*" 
					},
					success:function(data){
						widget.hide([".J-profile"]);
						var ageitems=[];
						var educationitems=[];
						var rankitems=[];
						var costSourceitems=[];
						var maritalStatusitems=[];
						var childrenRelationshipitems=[];
						var motiveitems=[];
						var socialInterestitems=[];
						var consumptionConceptitems=[];
						var physiologyitems=[];
						var natureitems=[];
						var psychologyitems=[];
						for(var i=0;i<data.length;i++){
							if(data[i].assessType.key=="Age"){
								ageitems.push({
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
									value:data[i].assessItem
								})
							}
							if(data[i].assessType.key=="Psychology"){
								psychologyitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="Nature"){
								natureitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="Education"){
								educationitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="Rank"){
								rankitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="CostSource"){
								costSourceitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="MaritalStatus"){
								maritalStatusitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="ChildrenRelationship"){
								childrenRelationshipitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="Motive"){
								motiveitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="SocialInterest"){
								socialInterestitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="ConsumptionConcept"){
								consumptionConceptitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							if(data[i].assessType.key=="Physiology"){
								physiologyitems.push({
									value:data[i].assessItem,
									key:data[i].pkAssessItem+"-"+data[i].assessValue,
								})
							}
							
						}
						var profile=new Profile({
							parentNode:".J-profile",
							saveaction:function(){
								var d=$("#assessmentresultconfirm").serializeArray();
								for(var i=4;i<16;i++){
									d[i].value=d[i].value.split("-")[0];
								}
								var results={};
								for(var i=0;i<d.length;i++){
									var name=d[i].name;
									var value=d[i].value;
									if(results[name]){
										results[name]+=value+",";
									}else{
										results[name]="";
										results[name]+=value+",";
									}
								}
									params="";
									for(var j in results){
										params+=j+"="+(results[j].substring(0,results[j].length-1))+"&";
									}
								params=params.substring(0,params.length-1);
								var m=params.indexOf("pkMemberAssessment");
								params =params.substring(m,params.length);
								Dialog.alert({
									title:"提示",
									showBtn:false,
									content:"正在处理，请稍后……"
								});
								aw.saveOrUpdate("api/assessmentresult/save",params,function(){
									if(params && params.pkMemberAssessment){
										data:{
											pkMemberAssessment:params.pkMemberAssessment;
										}
									}
									widget.get("grid").refresh();
									aw.ajax({
										url:"api/memberassessment/query",
										dataType:"json",
										data : {
											"pkMemberAssessment":d[0].value,
											fetchProperties:"assessmentTime,leading.pkUser,leading.name,flowStatus,memberAssessmentDetail.pkMemberAssessmentDetail,memberAssessmentDetail.personalInfo.*,memberAssessmentDetail.isStayHome,memberAssessmentDetail.auditMaterials,memberAssessmentDetail.gradeStatus,memberAssessmentDetail.version," +
											"memberAssessmentDetail.assessmentResult.description," +
											"memberAssessmentDetail.assessmentResult.diseaseHistory,memberAssessmentDetail.assessmentResult.version,"+
											"memberAssessmentDetail.assessmentResult.score," +
											"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*,memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*,memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*,memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*,memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*,memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
											"memberAssessmentDetail.assessmentResult.pkAssessmentResult"
										},
										success:function(data){
			                        		Dialog.close();
											if(data[0].flowStatus.key!="Approvaling"){
												var datas=data[0].memberAssessmentDetail;
												for(var o=0;o<datas.length;o++){
													datas[o].flowStatus=data[0].flowStatus;
													datas[o].leading=data[0].leading;
													datas[o].assessmentTime=data[0].assessmentTime;
													datas[o].pkMemberAssessment=d[0].value;
												}
												widget.get("memberGrid").setData(datas);
												widget.show([".J-form,.J-memberGrid"]).hide([".J-grid,.J-profile"]);
												widget.get("subnav").hide(["search","flowStatus","gradeStatus","time","back"]).show(["return"]);
											}else{
												widget.get("grid").refresh({
							  					  	pkMemberAssessment:d[0].value,
							  					  	fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
													"memberAssessmentDetail.assessmentResult.diseaseHistory,memberAssessmentDetail.assessmentResult.version,"+
													"memberAssessmentDetail.assessmentResult.score," +
													"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*,memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*,memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*,memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*,memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*,memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
													"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
													"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
													"memberAssessmentDetail.gradeStatus,memberAssessmentDetail.version,memberAssessmentDetail.auditMaterials,memberAssessmentDetail.isStayHome,memberAssessmentDetail.pkMemberAssessmentDetail,*,leading.name,leading.pkUser,creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
											    });
												widget.show([".J-grid"]).hide([".J-profile,.J-form,.J-memberGrid"]);
												widget.get("subnav").hide(["return","back"]).show(["time","search","flowStatus","gradeStatus"]);
											}
										},
						                error: function (data){
						                	Dialog.close();
					                    }
									});
								},function(data){
									Dialog.close();
								}); 
							},
			              model:{
								id:"assessmentresultconfirm",
								items:[{
									title:"基本情况",
									icon:"github",
									children:[{
										name:"pkMemberAssessment",
										type:"hidden"
									},{
										name:"pkMemberAssessmentDetail",
										type:"hidden"
									},{
										name:"pkAssessmentResult",
										type:"hidden"
									},{
										name:"version",
										type:"hidden",
										defaultValue:"0"
									},{
										name:"age",
			 							label:"年龄",
			 							type:"radiolist",
			 							list:ageitems,
										validate : [ "required" ]
									},{
										name:"education",
										label:"文化程度",
										type:"radiolist",
										list:educationitems,
										validate : [ "required" ]
									},{
										name:"rank",
										label:"职称",
										type:"radiolist",
										list:rankitems,
										validate : [ "required" ]
									},{
										name:"costSource",
										label:"经费来源",
										type:"radiolist",
										list:costSourceitems,
										validate : [ "required" ]
									},{
										name:"maritalStatus",
										label:"婚姻及居住",
										type:"radiolist",
										list:maritalStatusitems,
										validate : [ "required" ]
									},{
										name:"childrenRelationship",
										label:"子女关系",
										type:"radiolist",
										list:childrenRelationshipitems,
										validate : [ "required" ]
									},{
										name:"motive",
										label:"入会动机",
										type:"radiolist",
										list:motiveitems,
										validate : [ "required" ]
									},{
										name:"socialInterest",
										label:"兴趣社交",
										type:"radiolist",
										list:socialInterestitems,
										validate : [ "required" ]
									},{
										name:"consumptionConcept",
										label:"消费观念",
										type:"radiolist",
										list:consumptionConceptitems,
										validate : [ "required" ]
									},{
										name:"nature",
										label:"性格得分",
										type:"radiolist",
										list:natureitems,
										validate : [ "required" ]
									},{
										name:"psychology",
										label:"心理得分",
										type:"radiolist",
										list:psychologyitems,
										validate : [ "required" ]
									}]
								},{
									title:"健康状况",
									icon:"github",
									children:[{
										name:"physiology",
			 							label:"基本生理状况",
			 							type:"radiolist",
			 							list:physiologyitems,
										validate : [ "required" ]
									},{
										name:"diseaseHistory",
										label:"您目前或曾经是否患有以下疾病？可多选",
										type:"checklist",
										list:[{
											key:"a",
											value:"高血压"
										},{
											key:"b",
											value:"脑出血"
										},{
											key:"c",
											value:"脑血栓"
										},{
											key:"d",
											value:"冠心病"
										},{
											key:"e",
											value:"肺心病"
										},{
											key:"f",
											value:"先心病"
										},{
											key:"g",
											value:"高血压性心脏病 "
										},{
											key:"h",
											value:"Ⅰ型糖尿病"
										},{
											key:"i",
											value:"Ⅱ型糖尿病"
										},{
											key:"j",
											value:"慢性支气管炎"
										},{
											key:"k",
											value:"肺气肿"
										},{
											key:"l",
											value:"肺结核"
										},{
											key:"m",
											value:"支气管哮喘"
										},{
											key:"n",
											value:"哮喘"
										},{
											key:"o",
											value:"□肺癌"
										},{
											key:"p",
											value:"反复呼吸道感染"
										},{
											key:"q",
											value:"抑郁症"
										},{
											key:"r",
											value:"肝病"
										},{
											key:"s",
											value:"其他"
										}],
									}]
								},{
									title:"综合评价",
									icon:"github",
									children:[{
										label:"综合得分",
										name:"score",
										readonly:true
									},{
										label:"评估人",
										name:"leading.name",
										readonly:true
									},{
										label:"评估时间",
										name:"assessmentTime",
										type:"date",
										defaultValue:moment(),
										mode:"Y-m-d"
									},{
										label:"备注",
										name:"description",
										type:"textarea"
									}]
								}]
							}
			      });
			      widget.set("profile",profile);
			      
			      if(params&&params.assessmentResult){
	  					var pro=widget.get("profile");
	  					widget.get("profile").setDisabled(true);
	  					widget.show([".J-profile"]).hide([".J-grid"]);
	  					widget.get("subnav").hide(["search","flowStatus","gradeStatus","time"]);
	  					widget.get("profile").setValue("leading.name",params.leading.name);
	  					widget.get("profile").setAttribute("assessmentTime",params.assessmentTime);
	  					widget.get("profile").setValue("pkMemberAssessment",params.pkMemberAssessment);
	  					
	  					if(params.assessmentResult.diseaseHistory&&params.assessmentResult.diseaseHistory.split &&params.assessmentResult.diseaseHistory.split(",").length>1){
							//证明是用，隔开的值
							var datas=params.assessmentResult.diseaseHistory.split(",");
						}else if(params.assessmentResult.diseaseHistory==null){
							var datas="";
						}else{
							var datas=params.assessmentResult.diseaseHistory;
						}
						pro.setValue("diseaseHistory",datas);
						pro.setValue("age",params.assessmentResult.age.pkAssessItem+"-"+params.assessmentResult.age.assessValue);
						pro.setValue("education",params.assessmentResult.education.pkAssessItem+"-"+params.assessmentResult.education.assessValue);
						pro.setValue("rank",params.assessmentResult.rank.pkAssessItem+"-"+params.assessmentResult.rank.assessValue);
						pro.setValue("costSource",params.assessmentResult.costSource.pkAssessItem+"-"+params.assessmentResult.costSource.assessValue);
						pro.setValue("maritalStatus",params.assessmentResult.maritalStatus.pkAssessItem+"-"+params.assessmentResult.maritalStatus.assessValue);
						pro.setValue("childrenRelationship",params.assessmentResult.childrenRelationship.pkAssessItem+"-"+params.assessmentResult.childrenRelationship.assessValue);
						pro.setValue("motive",params.assessmentResult.motive.pkAssessItem+"-"+params.assessmentResult.motive.assessValue);
						pro.setValue("socialInterest",params.assessmentResult.socialInterest.pkAssessItem+"-"+params.assessmentResult.socialInterest.assessValue);
						pro.setValue("consumptionConcept",params.assessmentResult.consumptionConcept.pkAssessItem+"-"+params.assessmentResult.consumptionConcept.assessValue);
						pro.setValue("nature",params.assessmentResult.nature.pkAssessItem+"-"+params.assessmentResult.nature.assessValue);
						pro.setValue("psychology",params.assessmentResult.psychology.pkAssessItem+"-"+params.assessmentResult.psychology.assessValue);
						pro.setValue("physiology",params.assessmentResult.physiology.pkAssessItem+"-"+params.assessmentResult.physiology.assessValue);
						pro.setAttribute("assessmentTime","readonly","readonly");
						pro.setValue("assessmentTime",params.assessmentTime);
						pro.setValue("description",params.assessmentResult.description);
						pro.setValue("score",params.assessmentResult.score);
	  				}else if(params && params.pkMemberAssessment&&params.pkAssessmentResult!="undefined"){//申请单跳打分
	  					widget.show([".J-form,.J-memberGrid"]).hide([".J-grid"]);
	  					widget.get("subnav").hide(["search","flowStatus","gradeStatus","time","back","return"])/*.show()*/;
	  					for(var i=0;i<params.data.memberAssessmentDetail.length;i++){
	  							params.data.memberAssessmentDetail[i].leading=params.data.leading;
	  							params.data.memberAssessmentDetail[i].pkMemberAssessment=params.data.pkMemberAssessment;
	  							params.data.memberAssessmentDetail[i].assessmentTime=params.data.assessmentTime;
	  							params.data.memberAssessmentDetail[i].flowStatus=params.data.flowStatus;
	  					}
	  					widget.get("memberGrid").setData(params.data.memberAssessmentDetail);
	  					var form=widget.get("form");
	  					form.setDisabled(true);
	  					widget.get("form").setData(params.data);
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
	  							form.setValue("cardType",params.data.cardType);
	  						}
	  					});
	  				}else if(params && params.assessment){//消息
		  				  widget.get("grid").refresh({
		  					  	pkMemberAssessment:params.assessment,
		  					  fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
								"memberAssessmentDetail.assessmentResult.diseaseHistory,memberAssessmentDetail.assessmentResult.version,"+
								"memberAssessmentDetail.assessmentResult.score," +
								"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*,memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*,memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*,memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*,memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*,memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
								"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
								"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
								"memberAssessmentDetail.gradeStatus,memberAssessmentDetail.version,memberAssessmentDetail.auditMaterials,memberAssessmentDetail.isStayHome,memberAssessmentDetail.pkMemberAssessmentDetail,*,leading.name,leading.pkUser,creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
						  });
	  				}else if(params && params.pkMemberAssessment){
	  					widget.get("grid").refresh({
	  					  	pkMemberAssessment:params.pkMemberAssessment,
	  					  	fetchProperties : "memberAssessmentDetail.assessmentResult.description," +
							"memberAssessmentDetail.assessmentResult.diseaseHistory,memberAssessmentDetail.assessmentResult.version,"+
							"memberAssessmentDetail.assessmentResult.score," +
							"memberAssessmentDetail.assessmentResult.physiology.*,memberAssessmentDetail.assessmentResult.psychology.*,memberAssessmentDetail.assessmentResult.nature.*,memberAssessmentDetail.assessmentResult.rank.*,memberAssessmentDetail.assessmentResult.costSource.*,memberAssessmentDetail.assessmentResult.maritalStatus.*,memberAssessmentDetail.assessmentResult.childrenRelationship.*,memberAssessmentDetail.assessmentResult.motive.*,memberAssessmentDetail.assessmentResult.socialInterest.*,memberAssessmentDetail.assessmentResult.consumptionConcept.*,memberAssessmentDetail.assessmentResult.education.*,memberAssessmentDetail.assessmentResult.age.*," +
							"memberAssessmentDetail.assessmentResult.pkAssessmentResult," +
							"memberAssessmentDetail.personalInfo.version,memberAssessmentDetail.personalInfo.pkPersonalInfo,memberAssessmentDetail.personalInfo.name,memberAssessmentDetail.personalInfo.birthday,memberAssessmentDetail.personalInfo.idNumber,memberAssessmentDetail.personalInfo.idType,memberAssessmentDetail.personalInfo.mobilePhone,memberAssessmentDetail.personalInfo.phone,memberAssessmentDetail.personalInfo.sex," +
							"memberAssessmentDetail.gradeStatus,memberAssessmentDetail.version,memberAssessmentDetail.auditMaterials,memberAssessmentDetail.isStayHome,memberAssessmentDetail.pkMemberAssessmentDetail,*,leading.name,leading.pkUser,creator.name,creator.pkUser,room.number,room.pkRoom,flowStatus"
					    });
	  				}
				}
			});
    	}
	});
	module.exports = assessmentresultconfirm;
});