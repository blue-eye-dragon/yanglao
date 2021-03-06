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
							content : "???????????????????????????????????????!"
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
                   title:"????????????",
                   search :{
                	  placeholder :"??????/??????/??????/??????",
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
						text:"??????",
						show:true,
						handler:function(){
							widget.get("verform").reset();
							var data={
								flowStatus:{key:"Processing",value:"?????????"},
								sosType:{key:"Alarm",value:"?????????"},
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
						text:"??????",
						show:false,
						handler:function(){
							widget.hide(".J-verform,.J-return,.J-disposeGrid,.J-disposeForm").show(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
							return false;
						}
					}],
				   buttonGroup:[{
					   	id:"alarmType",
					   	tip:"????????????",
					    items:Enums["com.eling.elcms.ward.model.Sos.AlarmType"],
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
				   },{
					   	id:"sosType",
					   	tip:"????????????",
					    items:Enums["com.eling.elcms.ward.model.Sos.SosType"],
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
				   },{
					   	id:"hospitalize",
					   	tip:"????????????",
					    items:[{
					    	key:true,
					    	value:"???"
					    },{
					    	key:false,
					    	value:"???"
					    }],
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
				   },{
    					id:"flowStatus",
    					tip:"??????",
    					showAll:true,
                        items:[{
    						key:"Processing",
    						value:"?????????"
    					},{
    						key:"Finish",
    						value:"??????"
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
						tip:"????????????",
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
 						name:"????????????",
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
						name:"????????????",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
 					},{
 						key:"alarmType.value",
 						className:"width_alarmType",
 						name:"????????????"
 					},{
 						key:"sosType.value",
 						className:"width_sosType",
 						name:"????????????"
 					},{
 						key:"hospitalize",
 						className:"width_hospitalize",
 						name:"????????????",
 						format:function(value,row){
 							if(value){
 								return "???";
 							}else{
 								return "???";
 							}
 						}
 					},{
 						key:"content",
 						className:"width_content",
 						name:"????????????",
 						format:function(value,row){
 							if(value.length>39){
 								return value.substring(0,39)+"?????????";
 							}else{
 								return value;
 							}
 						}
 					},{
 						key:"place.name",
 						className:"width_place",
 						name:"??????"
 					},{
 						key:"member.personalInfo.name",
 						className:"width_member",
 						name:"??????" 						
 					},{
 						key:"flowStatus.value",
 						className:"width_flowStatus",
 						name:"??????"
 					},{
 						key:"personLiable.name",
 						className:"width_personLiable",
 						name:"????????????"	
 					},{
						key:"operate",
						className:"width_operate",
						name:"??????",
						format:function(value,row){
							if(row.flowStatus.key=="Processing"){
								return "button";
							}else{
								return "";
							}
 						},
						formatparams:[{
							key:"update",
							text:"??????",
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
						name:"????????????",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD hh:mm"
						}
 					},{
 						key:"name",
 						name:"?????????" 						
 					},{
 						key:"disposorType",
 						name:"???????????????",
 						format:function(value,row){
 							if(value=="Security"||value.key=="Security"){
 								return "??????";
 							} else if(value=="Secretary"||value.key=="Secretary"){
 								return "??????";
 							}else if(value=="Doctor"||value.key=="Doctor"){
 								return "??????";
 							}else if(value=="OneTwoZero"||value.key=="OneTwoZero"){
 								return "120";
 							}else if(value=="SixZeroZeroOne"||value.key=="SixZeroZeroOne"){
 								return "6001";
 							}else if(value=="LifeManagement"||value.key=="LifeManagement"){
 								return "????????????";
 							}else if(value=="HealthManagement"||value.key=="HealthManagement"){
 								return "????????????";
 							}else if(value=="CommunityManagement"||value.key=="CommunityManagement"){
 								return "????????????";
 							}else if(value=="Informant"||value.key=="Informant"){
 								return "?????????";
 							}else if(value=="Annunciator"||value.key=="Annunciator"){
 								return "?????????";
 							}
						}
 					},{
 						key:"locale",
 						name:"????????????",
 						format:function(value,row){
 							if(value){
 								return "???";
 							}else{
 								return "???";
 							}
 						}
 					},{
 						key:"arrivalTime",
						name:"????????????",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD hh:mm"
						}
 					},{
 						key:"result",
 						name:"????????????"	
 					},{
						key:"operate",
						name:"??????",
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
					saveText:"??????",
					items:[{
						name:"pkSosDispose",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"disposorType",
						label:"???????????????",
						type:"select",
						url:"api/enum/com.eling.elcms.ward.model.SosDispose.DisposorType",
						validate:["required"],
					},{
						name:"disposor",
						label:"?????????",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/users",//TODO ???????????????wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
						lazy:true,
						validate:["required"]
					},{
						name:"name",
						label:"??????",
						validate:["required"]
					},{
						name:"locale",
						label:"????????????",
						type:"radiolist",
						list:[{
							key:"true",
							value:"???"
						},{
							key:"false",
							value:"???"
						}],
						validate:["required"],
					},{
						name:"arrivalTime",
						label:"????????????",
						type:"date"	,
						defaultValue:moment().valueOf(),
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"doTime",
						label:"????????????",
						type:"date"	,
						defaultValue:moment().valueOf(),
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"result",
						label:"????????????",	
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
   							content : "???????????????!"
   						 });
						return false;
    				} 
    				var sosTime=verform.getValue("sosTime");
    				if(moment()<moment(sosTime)){
    					Dialog.alert({
   							content : "???????????????????????????????????????!"
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
						label:"????????????",	
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-3"
						}
					},{
						name:"sosType",
						label:"????????????",
						type:"select",
						options:[{
							key:"Tel",
							value:"??????"
						},{
							key:"Alarm",
							value:"?????????"
						},{
							key:"MemberCard",
							value:"?????????"
						}],
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"member",
						label:"??????",
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
						label:"????????????",
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
						label:"????????????",
						type:"select",
						url:"api/enum/com.eling.elcms.ward.model.Sos.AlarmType",
						validate:["required"],
						defaultValue:"HealthTurn",
						className:{
							container:"col-md-6",label:"col-md-3"
						},
					},{
						name:"hospitalize",
						label:"????????????",
						type:"radiolist",
						list:[{
							key:"true",
							value:"???",
						},{
							key:"false",
							value:"???"
						}],
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"hospital",
						label:"????????????",
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
						label:"????????????",
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
						label:"????????????",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"personLiable",
						label:"????????????",
						type:"select",
						key:"pkUser",
						value:"name",
						lazy:true,
						url:"api/user/role",//TODO ???????????????wulina ??????
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
						label:"????????????",
						type:"select",
						url:"api/enum/com.eling.elcms.ward.model.Sos.DataSource",
						defaultValue:"Manual",
						className:{
							container:"col-md-6",label:"col-md-3"
						},
					},{
						name:"flowStatus",
						label:"??????",
						type:"select",
						options:[{
							key:"Processing",
							value:"?????????"
						},{
							key:"Finish",
							value:"??????"
						}],
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"operator",
						label:"?????????",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/users",//TODO ???????????????wulina
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
						label:"????????????",
						type:"date",
						defaultValue:moment().valueOf(),
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"content",
						label:"????????????",
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