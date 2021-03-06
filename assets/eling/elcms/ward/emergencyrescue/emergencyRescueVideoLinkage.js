define(function(require, exports, module) {
    var ELView=require("elview");
    var aw = require("ajaxwrapper");
    var template=require("./emergencyrescue.tpl");
    require("./emergencyRescueVideoLinkage.css");
    var Form=require("form-2.0.0")
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
    var Json=require("json");
    var Dialog = require("dialog");
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
					if(disposorType=="Secretary"||disposorType=="SixZeroZeroOne"||disposorType=="LifeManagement"||disposorType=="HealthManagement"||disposorType=="CommunityManagement"||disposorType=="Informant"||disposorType=="Annunciator"){//??????
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
			}
		},
        initComponent:function(params,widget){
            var subnav=new Subnav({
            	parentNode:".J-subnav",
                model:{
                   title:"????????????????????????",
                   search:function(str) {
	            	   widget.get("grid").loading();
						aw.ajax({
							url:"api/sos/search",
							data:{
								s:str,
								searchProperties:"sosNo,content,place.name,member.personalInfo.name",
								flowStatus:"Processing",
								fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*,sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace,content,flowStatus,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,personLiable.pkUser,personLiable.name",
							},
							dataType:"json",
							success:function(data){
								widget.get("grid").setData(data);
								widget.show(".J-grid,.J-adds").hide(".J-verform,.J-return");
							}
						});
					},
                   buttons:[{
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
				   }],
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
						hospitalize:widget.get("subnav").getValue("hospitalize"),
						sosType:widget.get("subnav").getValue("sosType"),
						alarmType:widget.get("subnav").getValue("alarmType"),
						orderString:"sosTime",
//						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
    					//flowStatus:widget.get("subnav").getValue("flowStatus"),
						flowStatus:"Processing",
    					sosTime:time.start,
    					sosTimeEnd:time.end,
    					fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*,sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace,content,flowStatus,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,personLiable.pkUser,personLiable.name",
					};
				},
				model:{					
					columns:[{
 						key:"sosNo",
 						className:"width_sosNo",
 						name:"????????????",
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
								var userSelect=widget.get("verform").getData("operator","");
								userSelect.push(data.operator);
								widget.get("verform").setData("operator",userSelect);
								widget.get("verform").setValue("operator",data.operator);
								widget.get("verform").setValue("sosTime",moment(data.sosTime).format("YYYY-MM-DD HH:mm:ss"));
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
 						key:"personLiable.name",
 						className:"width_personLiable",
 						name:"????????????"	
 					},{
						key:"operate",
						className:"width_operate",
						name:"??????",
						format:function(value,row){
							$(".J-update,.J-dispose").removeClass("hidden");
							return "button";//???????????????
 						},
						formatparams:[{
							key:"videoLinkage",
							text:"???",
							handler:function(index,data,rowEle){
								var  pkPlace = data.place ? data.place.pkPlace:"";
								var  pkMember = data.member ? data.member.pkMember:"";
								if(!pkPlace && !pkMember){
									Dialog.alert({
		       							content : "??????????????????????????????!"
		       						 });
									return false;
								}
								aw.ajax({
									url : "api/vss/alarmlocation",
									type : "POST",
									data : {
										//????????????????????????pkMember,???????????????pkPlace
										pkMember : pkMember,
										pkPlace: pkPlace
									},
									success : function(result) {
										//???????????????????????????????????????????????????
										var pkPlace = result ? result.pkPlace:"";
										var coordinate = result ? result.coordinate:"";
										var URL = location.protocol+'//'+location.host+localStorage.getItem("ctx")+'html/monitors.jsp';//URL????????????????????????
										if(pkPlace) {
											newWinUrl(URL+'?pkPlace='+pkPlace,'????????????????????????');
											//window.open(URL+'?pkPlace='+pkPlace,'???????????????????????????');
										} else if (coordinate) {
											newWinUrl(URL+'?coordinate'+coordinate,'????????????????????????');
											//window.open(URL+'?coordinate'+coordinate,'???????????????????????????');
										} else {
											Dialog.alert({
				       							content : "?????????????????????!"
				       						 });
										}
									}
								});
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			function newWinUrl( url,title ){
				Dialog.confirm({
                    title : title,
                    //content : "<iframe src='allowscriptaccess='always' allowTransparency='true' http://117.121.26.96:51132/example/assets/eling/component/utils/dialog/2.0.0/test/demo.htm' width='100%' height='400px' frameborder='no'></iframe>",
                    content : "<iframe allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' src='"+url+"' width='100%' height='450px' frameborder='no'></iframe>",
	                    setStyle : function(){
                        $(".el-dialog-modal .modal").css({
                            top : "7%",
                            /*width:"1200",*/
                            height:"70%",
                            width : "90%",
                            left  : "5%"
                        });

                        $(".J-dialog-cancel").css({
                            display : "none"
                        });
                        
                        $(".el-dialog-modal .modal-body").css({
                        	height:"450px",
                        });

                        $(".el-dialog-modal .modal-body pre").css({
                            "padding": "0 9.5px",
                            "margin-bottom": "0"
                        });
                        
                    }
				
                });
				$("#videojsframe").attr("allowfullscreen","true");
				$(".J-dialog-confirm").text("??????");
				$(".J-dialog-confirm").addClass("btn btn-danger J-dialog-confirm");
	        }

			
            var disposeGrid=new Grid({
            	parentNode:".J-disposeGrid",
				autoRender:false,
				model:{	
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								ensureindex="";
								widget.get("disposeForm").reset();
								widget.get("disposeForm").load("disposor");
								widget.show(".J-disposeForm").hide(".J-disposeGrid");
							}
						}]
					},
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
						format:function(value,row){
							if(row.disposorType.key=="Informant"){
								return ""
							}else{
								return "button"
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								ensureindex=index;
								widget.get("disposeForm").reset();		
								var  datatype = widget.get("disposeForm").getData("disposorType");
								widget.get("disposeForm").setData(data);
								if(data.disposorType.key){
									var  disposorType = data.disposorType.key;
								}else{
									var  disposorType = data.disposorType;
								}
								if(disposorType=="Security"||disposorType=="Doctor"||disposorType=="OneTwoZero"){//????????????120
									widget.get("disposeForm").hide("disposor");
									widget.get("disposeForm").setValue("disposor","");
									widget.get("disposeForm").show("name");
									widget.get("disposeForm").setValue("name",data.name);
								}
								if(disposorType=="Secretary"||disposorType=="SixZeroZeroOne"||disposorType=="LifeManagement"||disposorType=="HealthManagement"||disposorType=="CommunityManagement"||disposorType=="Informant"||disposorType=="Annunciator"){//??????
									var flag = false;
	    							for(var  i =  0 ; i<datatype.length;i++ ){
	    								if(datatype[i].key == disposorType){
	    									flag= true;
	    									break;
	    								}
	    							}
	    							if(flag){
	    								widget.get("disposeForm").setValue("disposorType",data.disposorType);
	    							}else{
	    								var disposorType=widget.get("disposeForm").getData("disposorType","");
	    								disposorType.push(data.disposorType);
										widget.get("disposeForm").setData("disposorType",disposorType);
										widget.get("disposeForm").setValue("disposorType",data.disposorType);
	    							}
									widget.get("disposeForm").load("disposor",{
										callback:function(){
											widget.get("disposeForm").show("disposor");
											var userSelect=widget.get("disposeForm").getData("disposor","");
											userSelect.push(data.disposor);
											widget.get("disposeForm").setData("disposor",userSelect);
											widget.get("disposeForm").setValue("disposor",data.disposor);
										}
									});
									widget.get("disposeForm").hide("name");
									widget.get("disposeForm").setValue("name",data.name);
								}
								widget.show(".J-disposeForm").hide(".J-disposeGrid");
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"??????",
									content:"???????????????????????????????????????",
									confirm:function(){
										var carddata=widget.get("disposeGrid").getData();
										carddata.splice(index,1);
										widget.get("disposeGrid").setData(carddata);
										var carddata=widget.get("disposeGrid").getData();
										var verformData=widget.get("verform").getData();
										for(var i=0;i<carddata.length;i++){
											if(carddata[i].disposor!=null&&carddata[i].disposor.pkUser){
												carddata[i].disposor=carddata[i].disposor.pkUser;
											}
											if(carddata[i].disposorType.key){
												carddata[i].disposorType=carddata[i].disposorType.key;
											}
										}
										var arr=[];
										for(var i=0 ;i <carddata.length;i++){
											arr.push(carddata[i].disposorType);
										}
										verformData.listsParams=carddata;
										aw.saveOrUpdate("api/sos/savedispose",aw.customParam(verformData),function(data){
											aw.ajax({
												url : "api/sos/query",
												type : "POST",
												data : {
													pkSos : verformData.pkSos,
													fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*,sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace,content,flowStatus,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,personLiable.pkUser,personLiable.name",
												},
												success : function(result) {
													widget.get("disposeGrid").setData(result[0].sosDisposes);
													widget.get("grid").refresh();
												}
											});
										});
										widget.show(".J-disposeGrid").hide(".J-disposeForm");
									}
								});
							}
						}]
					}]
				}
			});
			this.set("disposeGrid",disposeGrid);
			// TODO
			/*var disposeForm = new Form({
            	parentNode:".J-disposeForm",
            	saveaction:function(){
					var carddata=widget.get("disposeGrid").getData();
					var verformData=widget.get("verform").getData();
					for(var i=0;i<carddata.length;i++){
						if(carddata[i].disposor!=null&&carddata[i].disposor.pkUser){
							carddata[i].disposor=carddata[i].disposor.pkUser;
						}
						if(carddata[i].disposorType.key){
							carddata[i].disposorType=carddata[i].disposorType.key;
						}
					}
					var arr=[];
					for(var i=0 ;i <carddata.length;i++){
						arr.push(carddata[i].disposorType);
					}
					verformData.listsParams=carddata;
					if(ensureindex==""){
						carddata.push(widget.get("disposeForm").getData());
					}else{
						carddata[ensureindex]=widget.get("disposeForm").getData();
					}
					aw.saveOrUpdate("api/sos/savedispose",aw.customParam(verformData),function(data){
						aw.ajax({
							url : "api/sos/query",
							type : "POST",
							data : {
								pkSos : verformData.pkSos,
								fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*,sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace,content,flowStatus,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,personLiable.pkUser,personLiable.name",
							},
							success : function(result) {
								widget.get("disposeGrid").setData(result[0].sosDisposes);
								widget.get("grid").refresh();
							}
						});
					});
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
						options:[{
        					key:"Security",
        					value:"??????"
        				},{
        					key:"Secretary",
            				value:"??????"
        				},{
        					key:"Doctor",
            				value:"??????"
        				},{
        					key:"OneTwoZero",
            				value:"120"
        				},{
        					key:"SixZeroZeroOne",
            				value:"6001"
        				},{
        					key:"LifeManagement",
            				value:"????????????"
        				},{
        					key:"HealthManagement",
            				value:"????????????"
        				},{
        					key:"CommunityManagement",
            				value:"????????????"
        				}],
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
						type:"date",
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
    		 this.set("disposeForm",disposeForm);*/
			
			var verform = new Form({
            	parentNode:".J-verform",
            	saveaction:function(){
            		aw.saveOrUpdate("api/sos/save",$("#sos").serialize(),function(data){
            			widget.get("grid").refresh();
    					widget.hide(".J-verform,.J-return").show(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
					});
            	},
  				cancelaction:function(){
					widget.hide(".J-verform,.J-return").show(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
  				},
				model:{
					id:"sos",
					defaultButton:false,
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
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"place",
						label:"????????????",
						url:"api/place/query",
						params:function(){
							return {
								fetchProperties:"name,pkPlace"
							};
						},
						key:"pkPlace",
						value:"name",
						type:"select",
						lazy:true,
						className:{
							container:"col-md-6",label:"col-md-3"
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
//								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"alarmType",
						label:"????????????",
						type:"select",
						url:"api/enum/com.eling.elcms.ward.model.Sos.AlarmType",
						validate:["required"],
						defaultValue:"LifeTurn",
						className:{
							container:"col-md-6",label:"col-md-3"
						},
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
						name:"content",
						label:"????????????",
						className:{
							container:"col-md-6",
							value : "form_content",label:"col-md-3"
						},
						type:"textarea"
					},{
						name:"sosTime",
						label:"????????????",
						readonly:true,
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"hospitalize",
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
					}
					]
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
						flowStatus:"Processing",
						fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*,sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace,content,flowStatus,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,personLiable.pkUser,personLiable.name",
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
						fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*,sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace,content,flowStatus,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,personLiable.pkUser,personLiable.name",
					},
					success : function(result) {
						widget.get("grid").setData(result);
					}
				});
			}else if(params&&params.orderString&&params.hospitalize&&params.flowStatusIn){
				widget.get("grid").refresh({
					hospitalize:params.hospitalize,
					flowStatus:params.flowStatusIn,
					orderString:params.orderString,
					fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*,sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace,content,flowStatus,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,personLiable.pkUser,personLiable.name",
				});
				widget.get("subnav").hide(["time"]);
				widget.get("subnav").setValue("hospitalize",params.hospitalize);
				widget.get("subnav").setValue("flowStatus",params.flowStatusIn);
			}else {
				widget.get("grid").refresh();
			}
        }
    });
    module.exports = EmergencyRescue;
});