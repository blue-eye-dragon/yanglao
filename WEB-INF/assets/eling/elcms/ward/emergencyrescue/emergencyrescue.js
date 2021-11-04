define(function(require, exports, module) {
    var ELView=require("elview");
    var aw = require("ajaxwrapper");
    var template=require("./emergencyrescue.tpl");
    require("./emergencyrescue.css");
    var Form=require("form-2.0.0")
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
    var Json=require("json");
    var Dialog = require("dialog-1.0.0");
    var Enums = require("enums");
    var store = require("store");
    var ensureindex="";

    var EmergencyRescue = ELView.extend({
        attrs:{
        	template:template
        },
    	loadSelect:function(form,name){
    		var selectName="isInit"+name;
    		if(!this.get(selectName)){
				this.get(form).load(name);
				this.set(selectName,true);
			}
		},
    	events:{
    		"change .J-form-sos-select-dataSource":function(e){
    			var source=this.get("verform").getValue("dataSource");
    			if(source=="automatic"){
    				this.get("verform").setAttribute("sosTime","disabled","disabled");
    			}else{
    				this.get("verform").removeAttribute("sosTime","disabled");
    			}
    		},
			"change .J-form-sos-select-member":function(e){
				var verform=this.get("verform");
				var pkMember=$(e.target).find("option:selected").attr("value");
				if(pkMember){
					aw.ajax({
						url : "api/member/query",
						type : "POST",
						data : {
							pkMember:pkMember,
							fetchProperties:"pkMember,personalInfo.name,memberSigning.room.pkRoom"
						},
						success:function(memberdata){	
							var pkRoom=memberdata[0].memberSigning.room.pkRoom;
							aw.ajax({
								url : "api/place/query",
								type : "POST",
								data : {
									room:pkRoom,
									fetchProperties:"pkPlace,room.pkRoom"
								},
								success:function(placedata){	
									verform.setValue("place",placedata[0].pkPlace);
								}
							});
							verform.load("diseaseHistory",{
								params:{
									member:memberdata[0].pkMember,
									diseaseStatus:"BEILL",
									fetchProperties:"diseaseDetail.name,pkDiseaseHistory,diseaseDetail.pkDiseaseDetail"
								}
							});
						}
					});
				}else{
					verform.setValue("place",[{pkPlace:""}]);
				}
			},
			"change .J-form-sos-select-place":function(e){
				var verform=this.get("verform");
				var subnav=this.get("subnav");
				var pkPlace=$(e.target).find("option:selected").attr("value");
				if(pkPlace){
					aw.ajax({
						url : "api/place/query",
						type : "POST",
						data : {
							pkPlace:pkPlace,
							fetchProperties:"room.pkRoom"
						},
						success:function(roomdata){	
							if(roomdata[0].room!=null){
								verform.load("member",{
									params:{
										"memberSigning.room":roomdata[0].room.pkRoom,
										fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
									}
								});
							}else{
								verform.load("member",{
									params:{
//										"memberSigning.room.building":subnav.getValue("building"),
										fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
									}
								});
							}
							
						}
					});
				}else{
					verform.load("member",{
						params:{
//							"memberSigning.room.building":subnav.getValue("building"),
							fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
						}
					});
				}
			},
			"change .J-form-sosDispose-select-disposorType" : function(e){ 
				var  disposorType = this.get("disposeForm").getValue("disposorType");
					if(disposorType=="Security"||disposorType=="Doctor"||disposorType=="OneTwoZero"){
						this.get("disposeForm").hide("disposor");
						this.get("disposeForm").setValue("disposor","");
						this.get("disposeForm").show("name");
						this.get("disposeForm").setValue("name","");
					}
					if(disposorType=="Secretary"||disposorType=="Administrative"){
						this.get("disposeForm").hide("name");
						this.get("disposeForm").setValue("name","");
						this.get("disposeForm").show("disposor");
						this.get("disposeForm").setValue("disposor","");
					}
			
			},
			"change .J-form-sosDispose-select-disposor" : function(e){
					var pkDisposor=this.get("disposeForm").getValue("disposor");
        			var disposor = this.get("disposeForm").getData("disposor",{
						pk:pkDisposor
					});
					this.get("disposeForm").setValue("name",disposor.name);
					this.get("disposeForm").hide("name");
			},
			"change .J-form-sos-date-sosTime" : function(e){
				var sosTime=this.get("verform").getValue("sosTime");
				if(moment()<moment(sosTime)){
					Dialog.alert({
							content : "求助时间不能大于服务器时间!"
						 });
					this.get("verform").setValue("sosTime",moment());
					return false;
				}
			},
			"change .J-form-sos-select-alarmType" : function(e){
				var alarmType=this.get("verform").getValue("alarmType");
				if(alarmType=="HealthTurn"){
					this.get("verform").setAttribute("hospitalize","disabled","disabled");
					this.get("verform").setValue("hospitalize","true");
					this.get("verform").show(["hospital","diseaseHistory"]);
				}else if(alarmType=="FalseAlarm"||alarmType=="LifeTurn"){
					this.get("verform").setAttribute("hospitalize","disabled","disabled");
					this.get("verform").setValue("hospitalize","false");
					this.get("verform").hide(["hospital","diseaseHistory"]);
				}else{
					this.get("verform").removeAttribute("hospitalize","disabled","disabled");
				}
			},
			"change .J-form-sos-radiolist-hospitalize" : function(e){
				var hospitalize=this.get("verform").getValue("hospitalize");
				if(hospitalize){
					this.get("verform").show(["hospital","diseaseHistory"]);
				}else{
					this.get("verform").hide(["hospital","diseaseHistory"]);
				}
			},
		},
        initComponent:function(params,widget){
            var subnav=new Subnav({
            	parentNode:".J-subnav",
                model:{
                   title:"紧急求助",
                   search :{
                	  placeholder :"单号/内容/位置/会员",
					  handler :function(str) {
	            	     widget.get("grid").loading();
						 aw.ajax({
							url:"api/sos/search",
							data:{
								s:str,
								properties:"sosNo,content,place.name,member.personalInfo.name",
								fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm," +
										"sosDisposes.*,sosDisposes.disposor.name,hospitalize," +
										"alarmType.value,pkSos,sosType,dataSource,operator," +
										"operator.pkUser,operator.name,sosDisposes.doTime," +
										"sosDisposes.pkSosDispose,sosNo,sosTime,place.name," +
										"place.pkPlace,content,flowStatus,member.pkMember," +
										"member.memberSigning.room.number,member.personalInfo.name," +
										"personLiable.pkUser,personLiable.name," +
										"recordDate,hospital.pkHospital,hospital.name," +
										"diseaseHistory.pkDiseaseHistory,diseaseHistory.name",
							},
							dataType:"json",
							success:function(data){
								widget.get("grid").setData(data);
								widget.show(".J-grid,.J-adds").hide(".J-verform,.J-return");
							}
						});
					  }
					},
                   buttons:[{
   					id:"adds",
						text:"新增",
						show:true,
						handler:function(){
							widget.get("verform").reset();
							var data={
								flowStatus:{key:"Processing",value:"处理中"},
								sosType:{key:"Alarm",value:"报警器"},
								operator:store.get("user")
							};			
							widget.get("verform").setAttribute("hospitalize","disabled","disabled");
							widget.get("verform").setValue("flowStatus",data.flowStatus);
							widget.get("verform").setValue("sosType",data.sosType);
							widget.get("verform").setValue("sosTime",moment());
							widget.get("verform").setValue("sosNo",moment().format('YYYYMMDDHHmmss').toString());
							widget.get("verform").load("operator",{
								callback:function(){
									var userSelect=widget.get("verform").getData("operator","");
									userSelect.push(data.operator);
									widget.get("verform").setData("operator",userSelect);
									widget.get("verform").setValue("operator",data.operator);
								}
							});
							widget.get("verform").load("member");
				        	widget.get("verform").load("place");
				        	widget.get("verform").load("personLiable");
				        	widget.get("verform").load("hospital");
				        	widget.get("verform").load("diseaseHistory");
				        	widget.get("verform").setValue("hospitalize","true");
				        	widget.get("verform").setAttribute("recordDate","disabled","disabled");
							widget.get("verform").setAttribute("sosNo","readonly","readonly");
							widget.get("verform").setAttribute("flowStatus","readonly","readonly");
							widget.get("verform").setAttribute("operator","readonly","readonly");
							widget.get("verform").setAttribute("dataSource","readonly","readonly");
							widget.show(".J-verform,.J-return").hide(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
						}
   					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide(".J-verform,.J-return,.J-disposeGrid,.J-disposeForm").show(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
							return false;
						}
					}],
				   buttonGroup:[{
					   	id:"alarmType",
					   	tip:"求助类型",
					    items:Enums["com.eling.elcms.ward.model.Sos.AlarmType"],
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
				   },{
					   	id:"sosType",
					   	tip:"求助方式",
					    items:Enums["com.eling.elcms.ward.model.Sos.SosType"],
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
				   },{
					   	id:"hospitalize",
					   	tip:"紧急就医",
					    items:[{
					    	key:true,
					    	value:"是"
					    },{
					    	key:false,
					    	value:"否"
					    }],
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
				   },{
    					id:"flowStatus",
    					tip:"状态",
    					showAll:true,
                        items:[{
    						key:"Processing",
    						value:"处理中"
    					},{
    						key:"Finish",
    						value:"结束"
    					}],
    					defaultValue:"Processing",
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
//				   id:"building",
//					showAll:true,
//					showAllFirst:true,
//					handler:function(key,element){
//						widget.get("grid").refresh();
//						widget.get("verform").load("member");
//					}
					time:{
						tip:"求助时间",
						click:function(time){
							widget.get("grid").refresh();
						}
					}
                }
            });
            this.set("subnav",subnav);
            
            var grid=new Grid({
            	parentNode:".J-grid",
				url:"api/sos/query",
				autoRender:false,
				params:function(){
					var time=widget.get("subnav").getValue("time");
					return {
						fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*," +
								"sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource," +
								"operator,operator.pkUser,operator.name,sosDisposes.doTime," +
								"sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace," +
								"content,flowStatus,member.pkMember,member.memberSigning.room.number," +
								"member.personalInfo.name,personLiable.pkUser,personLiable.name," +
								"recordDate,hospital.pkHospital,hospital.name," +
								"diseaseHistory.pkDiseaseHistory,diseaseHistory.name",
						hospitalize:widget.get("subnav").getValue("hospitalize"),
						sosType:widget.get("subnav").getValue("sosType"),
						orderString:"sosTime",
						alarmType:widget.get("subnav").getValue("alarmType"),
//						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
    					flowStatus:widget.get("subnav").getValue("flowStatus"),
    					sosTime:time.start,
    					sosTimeEnd:time.end
    					
					};
				},
				model:{					
					columns:[{
 						key:"sosNo",
 						name:"求助单号",
 						className:"width_sosNo",
 						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("verform").reset();		
								widget.get("verform").setDisabled(true);
								widget.get("verform").setData(data);
								widget.get("disposeGrid").setData(data.sosDisposes);
								$(".J-delete,.J-grid-head-add,.J-grid-head-save,.J-edit").addClass("hidden");
								widget.get("verform").load("member",{
									callback:function(){
										widget.get("verform").setValue("member",data.member);
									}
								});
					        	widget.get("verform").load("place",{
									callback:function(){
										widget.get("verform").setValue("place",data.place);
									}
								});
					        	widget.get("verform").load("personLiable",{
									callback:function(){
										widget.get("verform").setValue("personLiable",data.personLiable);
									}
								});
					        	if(data.hospitalize=="true"){
					        		widget.get("verform").load("hospital",{
										callback:function(){
											if(data.hospital != null ){
												widget.get("verform").setValue("hospital",data.hospital.pkHospital);
											}
										}
									});
				        			widget.get("verform").load("diseaseHistory",{
										callback:function(){
											if(data.diseaseHistory != null ){
												widget.get("verform").setValue("diseaseHistory",data.diseaseHistory.pkDiseaseHistory);
											}
										}
									});
					        	}else{
					        		widget.get("verform").hide(["hospital","diseaseHistory"]);
					        	}
								var userSelect=widget.get("verform").getData("operator","");
								userSelect.push(data.operator);
								widget.get("verform").setData("operator",userSelect);
								widget.get("verform").setValue("operator",data.operator);
								widget.get("verform").setAttribute("sosNo","readonly","readonly");
								widget.get("verform").setAttribute("operator","readonly","readonly");
								widget.get("verform").setAttribute("dataSource","readonly","readonly");
								widget.show(".J-verform,.J-return,.J-disposeGrid").hide(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
							}
						}]
 					},{
 						key:"sosTime",
 						className:"width_sosTime",
						name:"求助时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
 					},{
 						key:"alarmType.value",
 						className:"width_alarmType",
 						name:"求助类型"
 					},{
 						key:"sosType.value",
 						className:"width_sosType",
 						name:"求助方式"
 					},{
 						key:"hospitalize",
 						className:"width_hospitalize",
 						name:"紧急就医",
 						format:function(value,row){
 							if(value){
 								return "是";
 							}else{
 								return "否";
 							}
 						}
 					},{
 						key:"content",
 						className:"width_content",
 						name:"求助内容",
 						format:function(value,row){
 							if(value.length>39){
 								return value.substring(0,39)+"。。。";
 							}else{
 								return value;
 							}
 						}
 					},{
 						key:"place.name",
 						className:"width_place",
 						name:"位置"
 					},{
 						key:"member.personalInfo.name",
 						className:"width_member",
 						name:"会员" 						
 					},{
 						key:"flowStatus.value",
 						className:"width_flowStatus",
 						name:"状态"
 					},{
 						key:"personLiable.name",
 						className:"width_personLiable",
 						name:"责任秘书"	
 					},{
						key:"operate",
						className:"width_operate",
						name:"操作",
						format:function(value,row){
							if(row.flowStatus.key=="Processing"){
								return "button";
							}else{
								return "";
							}
 						},
						formatparams:[{
							key:"update",
							text:"修改",
							handler:function(index,data,rowEle){
								widget.get("disposeGrid").setData(data.sosDisposes);
								widget.get("verform").reset();		
								widget.loadSelect("disposeForm","disposor");
								widget.get("verform").setData(data);
				    			if(data.dataSource.key=="automatic"){
				    				widget.get("verform").setAttribute("sosTime","disabled","disabled");
				    			}else{
				    				widget.get("verform").removeAttribute("sosTime","disabled");
				    			}
								widget.get("verform").load("member",{
									callback:function(){
										widget.get("verform").setValue("member",data.member);
									}
								});
					        	widget.get("verform").load("place",{
									callback:function(){
										widget.get("verform").setValue("place",data.place);
									}
								});
					        	if(data.hospitalize == "true"){
				        			widget.get("verform").load("hospital",{
										callback:function(){
											if(data.hospital != null ){
												widget.get("verform").setValue("hospital",data.hospital.pkHospital);
											}
										}
									});
				        			widget.get("verform").load("diseaseHistory",{
				        				params:{
											member:data.member.pkMember,
											diseaseStatus:"BEILL",
											fetchProperties:"diseaseDetail.name,pkDiseaseHistory,diseaseDetail.pkDiseaseDetail"
										},
										callback:function(){
											if(data.diseaseHistory != null ){
												widget.get("verform").setValue("diseaseHistory",data.diseaseHistory.pkDiseaseHistory);
											}
										}
									});
					        	}else{
					        		widget.get("verform").hide(["hospital","diseaseHistory"]);
					        	}
					        	widget.get("verform").load("personLiable",{
									callback:function(){
										widget.get("verform").setValue("personLiable",data.personLiable);
									}
								});
					        	var alarmType=widget.get("verform").getValue("alarmType");
								if(alarmType=="FalseAlarm"||alarmType=="LifeTurn"){
									widget.get("verform").setAttribute("hospitalize","disabled","disabled");
									widget.get("verform").setValue("hospitalize","false");
								}else{
									widget.get("verform").removeAttribute("hospitalize","disabled","disabled");
								}
								var userSelect=widget.get("verform").getData("operator","");
								userSelect.push(data.operator);
								widget.get("verform").setData("operator",userSelect);
								widget.get("verform").setValue("operator",data.operator);
								widget.get("verform").setAttribute("recordDate","disabled","disabled");
								widget.get("verform").setAttribute("sosNo","readonly","readonly");
								widget.get("verform").setAttribute("operator","readonly","readonly");
								widget.get("verform").setAttribute("flowStatus","readonly","readonly");
								$(".J-delete,.J-grid-head-add,.J-grid-head-save,.J-edit").addClass("hidden");
								widget.show(".J-verform,.J-disposeGrid,.J-return").hide(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
            var disposeGrid=new Grid({
            	parentNode:".J-disposeGrid",
				autoRender:false,
				model:{	
					columns:[{
 						key:"doTime",
						name:"处理时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD hh:mm"
						}
 					},{
 						key:"name",
 						name:"处理人" 						
 					},{
 						key:"disposorType",
 						name:"处理人角色",
 						format:function(value,row){
 							if(value=="Security"||value.key=="Security"){
 								return "保安";
 							} else if(value=="Secretary"||value.key=="Secretary"){
 								return "秘书";
 							}else if(value=="Doctor"||value.key=="Doctor"){
 								return "医生";
 							}else if(value=="OneTwoZero"||value.key=="OneTwoZero"){
 								return "120";
 							}else if(value=="SixZeroZeroOne"||value.key=="SixZeroZeroOne"){
 								return "6001";
 							}else if(value=="LifeManagement"||value.key=="LifeManagement"){
 								return "生活管理";
 							}else if(value=="HealthManagement"||value.key=="HealthManagement"){
 								return "健康管理";
 							}else if(value=="CommunityManagement"||value.key=="CommunityManagement"){
 								return "社区管理";
 							}else if(value=="Informant"||value.key=="Informant"){
 								return "填报人";
 							}else if(value=="Annunciator"||value.key=="Annunciator"){
 								return "报警器";
 							}
						}
 					},{
 						key:"locale",
 						name:"是否现场",
 						format:function(value,row){
 							if(value){
 								return "是";
 							}else{
 								return "否";
 							}
 						}
 					},{
 						key:"arrivalTime",
						name:"到达时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD hh:mm"
						}
 					},{
 						key:"result",
 						name:"处理结果"	
 					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								ensureindex=index;
								widget.get("disposeForm").reset();										
								widget.get("disposeForm").setData(data);
								var  disposorType = widget.get("disposeForm").getValue("disposorType");
								if(disposorType=="Security"||disposorType=="Doctor"||disposorType=="OneTwoZero"){
									widget.get("disposeForm").hide("disposor");
									widget.get("disposeForm").setValue("disposor","");
									widget.get("disposeForm").show("name");
									widget.get("disposeForm").setValue("name",data.name);
								}
								if(disposorType=="Secretary"||disposorType=="Administrative"){
									widget.get("disposeForm").hide("name");
									widget.get("disposeForm").setValue("name",data.name);
									widget.get("disposeForm").show("disposor");
									widget.get("disposeForm").setValue("disposor",data.disposor);
								}
								widget.show(".J-disposeForm").hide(".J-disposeGrid");
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								var carddata=widget.get("disposeGrid").getData();
								carddata.splice(index,1);
								widget.get("disposeGrid").setData(carddata);
							}
						}]
					}]
				}
			});
			this.set("disposeGrid",disposeGrid);
			
			var disposeForm = new Form({
            	parentNode:".J-disposeForm",
            	saveaction:function(){
            		var data=widget.get("disposeForm").getData();
            		var disposor=widget.get("disposeForm").getData("disposor",{
            			pk:widget.get("disposeForm").getValue("disposor")
            		});
            		if(widget.get("disposeForm").getValue("disposor")==""){
            			data.disposor=""
            		}else{
            			data.disposor=disposor;
            		}
            		var carddata=widget.get("disposeGrid").getData();
            		if(ensureindex==""){
	 					carddata.push(data);
             		}else{
	             		carddata[ensureindex]=data;
             		}
					widget.get("disposeGrid").setData(carddata);
					widget.show(".J-disposeGrid").hide(".J-disposeForm");
            	},
  				cancelaction:function(){
  					widget.show(".J-disposeGrid").hide(".J-disposeForm");
  				},
				model:{
					id:"sosDispose",
					saveText:"确定",
					items:[{
						name:"pkSosDispose",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"disposorType",
						label:"处理人角色",
						type:"select",
						url:"api/enum/com.eling.elcms.ward.model.SosDispose.DisposorType",
						validate:["required"],
					},{
						name:"disposor",
						label:"处理人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
						lazy:true,
						validate:["required"]
					},{
						name:"name",
						label:"姓名",
						validate:["required"]
					},{
						name:"locale",
						label:"是否现场",
						type:"radiolist",
						list:[{
							key:"true",
							value:"是"
						},{
							key:"false",
							value:"否"
						}],
						validate:["required"],
					},{
						name:"arrivalTime",
						label:"到达时间",
						type:"date"	,
						defaultValue:moment().valueOf(),
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"doTime",
						label:"处理时间",
						type:"date"	,
						defaultValue:moment().valueOf(),
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"result",
						label:"处理结果",	
						type:"textarea"
					}]
				}
             });
    		 this.set("disposeForm",disposeForm);
			
			var verform = new Form({
            	parentNode:".J-verform",
            	saveaction:function(){
    				var member=verform.getValue("member");
    				if(member == ""){
    					Dialog.alert({
   							content : "请选择会员!"
   						 });
						return false;
    				} 
    				var sosTime=verform.getValue("sosTime");
    				if(moment()<moment(sosTime)){
    					Dialog.alert({
   							content : "求助时间不能大于服务器时间!"
   						 });
						return false;
    				}
    				var hospitalize=verform.getValue("hospitalize");
    				var ser=$("#sos").serialize();
    				if(ser.indexOf("hospitalize")==-1){
    					ser+="&hospitalize="+hospitalize;
    				}
    				ser+="&recordDate="+moment();
            		aw.saveOrUpdate("api/sos/save",ser,function(data){
            			widget.get("grid").refresh();
    					widget.hide(".J-verform,.J-return,.J-disposeGrid").show(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
					});
            	},
  				cancelaction:function(){
					widget.hide(".J-verform,.J-return,.J-disposeGrid").show(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
  				},
				model:{
					id:"sos",
					items:[{
						name:"pkSos",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"sosNo",
						label:"求助单号",	
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-3"
						}
					},{
						name:"sosType",
						label:"求助方式",
						type:"select",
						options:[{
							key:"Tel",
							value:"电话"
						},{
							key:"Alarm",
							value:"报警器"
						},{
							key:"MemberCard",
							value:"会员卡"
						}],
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"member",
						label:"会员",
						url:"api/member/query",
						key:"pkMember",
						lazy:true,
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
//								"memberSigning.room":widget.get("verform").getValue("place"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"place",
						label:"求助位置",
						url:"api/place/query",
						params:function(){
							return {
								fetchProperties:"name,pkPlace,pkRoom"
							};
						},
						key:"pkPlace",
						value:"name",
						type:"select",
						lazy:true,
						className:{
							container:"col-md-6",
							label:"col-md-3"
						}
					},{
						name:"alarmType",
						label:"求助类型",
						type:"select",
						url:"api/enum/com.eling.elcms.ward.model.Sos.AlarmType",
						validate:["required"],
						defaultValue:"HealthTurn",
						className:{
							container:"col-md-6",label:"col-md-3"
						},
					},{
						name:"hospitalize",
						label:"紧急就医",
						type:"radiolist",
						list:[{
							key:"true",
							value:"是",
						},{
							key:"false",
							value:"否"
						}],
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"hospital",
						label:"就诊医院",
						type:"select",
						key:"pkHospital",
						lazy:true,
						url:"api/hospital/query",
						value:"name",
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"diseaseHistory",
						label:"就诊原因",
						type:"select",
						key:"pkDiseaseHistory",
						lazy:true,
						value:"diseaseDetail.name",
						url:"api/diseasehistory/query",
						params:function(){
							return {
								diseaseStatus:"BEILL",
								fetchProperties:"diseaseDetail.name,pkDiseaseHistory,diseaseDetail.pkDiseaseDetail"
							};
						},
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"sosTime",
						label:"求助时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"personLiable",
						label:"责任秘书",
						type:"select",
						key:"pkUser",
						value:"name",
						lazy:true,
						url:"api/user/role",//TODO 用户角色：wulina 秘书
        				params:{
        					roleIn:"6,11,12,18,19,20,21",
							fetchProperties:"pkUser,name"
						},
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"dataSource",
						label:"数据来源",
						type:"select",
						url:"api/enum/com.eling.elcms.ward.model.Sos.DataSource",
						defaultValue:"Manual",
						className:{
							container:"col-md-6",label:"col-md-3"
						},
					},{
						name:"flowStatus",
						label:"状态",
						type:"select",
						options:[{
							key:"Processing",
							value:"处理中"
						},{
							key:"Finish",
							value:"结束"
						}],
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"operator",
						label:"经手人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
						lazy:true,
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"content",
						label:"求助描述",
						type:"textarea",
						className:{
							container:"col-md-6",
							value : "form_content",label:"col-md-3"
						}
					}]
				}
             });
    		 this.set("verform",verform);
        },
        afterInitComponent:function(params,widget){        
        	if (params && params.pkFather) {
				aw.ajax({
					url : "api/sos/query",
					type : "POST",
					data : {
						pkSos : params.pkFather,
						fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm," +
								"sosDisposes.*,sosDisposes.disposor.name,hospitalize," +
								"alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser," +
								"operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose," +
								"sosNo,sosTime,place.name,place.pkPlace,content,flowStatus," +
								"member.pkMember,member.memberSigning.room.number," +
								"member.personalInfo.name,personLiable.pkUser,personLiable.name," +
								"recordDate,hospital.pkHospital,hospital.name," +
								"diseaseHistory.pkDiseaseHistory,diseaseHistory.name",
					},
					success : function(result) {
						widget.get("grid").setData(result);
					}
				});
			} else if(params && params.pkBuilding&&params.flowStatus){
				aw.ajax({
					url : "api/sos/query",
					type : "POST",
					data : {
						"member.memberSigning.room.building":params.pkBuilding,
						flowStatus:params.flowStatus,
						fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm," +
								"sosDisposes.*,sosDisposes.disposor.name,hospitalize," +
								"alarmType.value,pkSos,sosType,dataSource,operator," +
								"operator.pkUser,operator.name,sosDisposes.doTime," +
								"sosDisposes.pkSosDispose,sosNo,sosTime,place.name," +
								"place.pkPlace,content,flowStatus,member.pkMember," +
								"member.memberSigning.room.number,member.personalInfo.name," +
								"personLiable.pkUser,personLiable.name" +
								"recordDate,hospital.pkHospital,hospital.name," +
								"diseaseHistory.pkDiseaseHistory,diseaseHistory.name",
					},
					success : function(result) {
						widget.get("grid").setData(result);
					}
				});
			}else if(params&&params.type){
				widget.get("subnav").setValue("time",{
					start:params.start,
					end:params.end
				});
				if(params.hospitalize){
					widget.get("subnav").setValue("hospitalize",params.hospitalize.key);
				}
				if(params.flowStatus){
					widget.get("subnav").setValue("flowStatus",params.flowStatus.key);
				}else{
					widget.get("subnav").setValue("flowStatus","");
				}
				widget.get("subnav").setValue("alarmType",params.type.key=="sum"?null:params.type.key);
				widget.get("grid").refresh({
					fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*," +
							"sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType," +
							"dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime," +
							"sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace," +
							"content,flowStatus,member.pkMember,member.memberSigning.room.number," +
							"member.personalInfo.name,personLiable.pkUser,personLiable.name," +
							"recordDate,hospital.pkHospital,hospital.name," +
							"diseaseHistory.pkDiseaseHistory,diseaseHistory.name",
					hospitalize:widget.get("subnav").getValue("hospitalize"),
					orderString:"sosTime",
					alarmType:params.type.key=="sum"?"":params.type.key,
					flowStatus:params.flowStatus!=null?params.flowStatus.key:null,
					sosTime:params.start,
					sosTimeEnd:params.end
				});
			}else if(params&&params.type1){
				widget.get("subnav").setValue("time",{
					start:params.start,
					end:params.end
				});
				if(params.hospitalize){
					widget.get("subnav").setValue("hospitalize",params.hospitalize.key);
				}
				if(params.flowStatus){
					widget.get("subnav").setValue("flowStatus",params.flowStatus.key);
				}else{
					widget.get("subnav").setValue("flowStatus","");
				}
				widget.get("subnav").setValue("sosType",params.type1.key=="sum"?null:params.type1.key);
				widget.get("grid").refresh({
					fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*," +
							"sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType," +
							"dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime," +
							"sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace," +
							"content,flowStatus,member.pkMember,member.memberSigning.room.number," +
							"member.personalInfo.name,personLiable.pkUser,personLiable.name," +
							"recordDate,hospital.pkHospital,hospital.name," +
							"diseaseHistory.pkDiseaseHistory,diseaseHistory.name",
					hospitalize:widget.get("subnav").getValue("hospitalize"),
					orderString:"sosTime",
					sosType:params.type1.key=="sum"?null:params.type1.key,
					flowStatus:params.flowStatus!=null?params.flowStatus.key:null,
					sosTime:params.start,
					sosTimeEnd:params.end
				});
			}else {
				widget.get("grid").refresh();
			}
        }
    });
    module.exports = EmergencyRescue;
});