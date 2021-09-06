define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
    var ELView=require("elview");
    var aw = require("ajaxwrapper");
    var template=require("./emergencyrescue.tpl");
    require("./emergencytreatment.css");
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
					if(disposorType=="Secretary"||disposorType=="SixZeroZeroOne"||disposorType=="LifeManagement"||disposorType=="HealthManagement"||disposorType=="CommunityManagement"||disposorType=="Informant"||disposorType=="Annunciator"){//秘书
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
                   title:"紧急求助处理",
                   search:function(str) {
	            	   widget.get("grid").loading();
						aw.ajax({
							url:"api/sos/search",
							data:{
								s:str,
								properties:"sosNo,content,place.name,member.personalInfo.name",
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
					   	tip:"是否就医",
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
    					showAll:true,
    					tip:"状态",
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
						hospitalize:widget.get("subnav").getValue("hospitalize"),
						sosType:widget.get("subnav").getValue("sosType"),
						alarmType:widget.get("subnav").getValue("alarmType"),
						orderString:"sosTime",
//						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
    					flowStatus:widget.get("subnav").getValue("flowStatus"),
    					sosTime:time.start,
    					sosTimeEnd:time.end,
    					fetchProperties:"sosDisposesAsList,confirmor,confirmor.pkConfirm,sosDisposes.*,sosDisposes.disposor.name,hospitalize,alarmType.value,pkSos,sosType,dataSource,operator,operator.pkUser,operator.name,sosDisposes.doTime,sosDisposes.pkSosDispose,sosNo,sosTime,place.name,place.pkPlace,content,flowStatus,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,personLiable.pkUser,personLiable.name",
					};
				},
				model:{					
					columns:[{
 						key:"sosNo",
 						className:"width_sosNo",
 						name:"求助单号",
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
 						name:"是否就医",
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
 						name:i18ns.get("sale_ship_owner","会员") 						
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
							$(".J-update,.J-dispose").removeClass("hidden");
							if(row.flowStatus.key=="Finish"){
								return "";
							}else if(row.flowStatus.key=="Processing"){
								return "button";//修改，关闭
							}
 						},
						formatparams:[{
							key:"dispose",
							text:"处理",
							handler:function(index,data,rowEle){
								$(".J-delete,.J-grid-head-add,.J-grid-head-save,.J-edit").removeClass("hidden");
								widget.get("disposeGrid").setData(data.sosDisposes);
								widget.get("verform").reset();	
								widget.get("verform").setDisabled(true);
								widget.get("verform").setData(data);
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
								widget.show(".J-verform,.J-disposeGrid,.J-return").hide(".J-search,.J-flowStatus,.J-time,.J-hospitalize,.J-grid,.J-adds,.J-alarmType,.J-sosType");
							}
						},{
							key:"close",
							text:"关闭",
							handler:function(index,data,rowEle){
								var  alarmType = data.alarmType.key;
								var  hospitalize = data.hospitalize;
								var arr=[];
								for(var i=0 ;i <data.sosDisposes.length;i++){
									arr.push(data.sosDisposes[i].disposorType.key);
								}
								if(alarmType=="LifeTurn"){
									if(arr.indexOf("Security")==-1&&arr.indexOf("Secretary")==-1){
										Dialog.alert({
			       							content : "保安和秘书中必须填写一个!"
			       						 });
										return false;
									}
								}else if((alarmType=="HealthTurn"&&hospitalize==true)||(alarmType=="HealthTurn"&&hospitalize=="true")){
									if(arr.indexOf("Secretary")==-1||arr.indexOf("Doctor")==-1){
										Dialog.alert({
			       							content : "必须填写秘书和医生!"
			       						 });
										return false;
									}
								}else if((alarmType=="HealthTurn"&&hospitalize==false)||(alarmType=="HealthTurn"&&hospitalize=="false")){
									if(arr.indexOf("Secretary")==-1){
										Dialog.alert({
			       							content : "必须填写秘书!"
			       						 });
										return false;
									}
								}
								aw.ajax({
									url : "api/sos/close",
									type : "POST",
									data : {
										pkSos : data.pkSos,
										flowStatus:"Finish"
									},
									success : function(result) {
										widget.get("grid").refresh();
									}
								});
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
								if(disposorType=="Security"||disposorType=="Doctor"||disposorType=="OneTwoZero"){//保安医生120
									widget.get("disposeForm").hide("disposor");
									widget.get("disposeForm").setValue("disposor","");
									widget.get("disposeForm").show("name");
									widget.get("disposeForm").setValue("name",data.name);
								}
								if(disposorType=="Secretary"||disposorType=="SixZeroZeroOne"||disposorType=="LifeManagement"||disposorType=="HealthManagement"||disposorType=="CommunityManagement"||disposorType=="Informant"||disposorType=="Annunciator"){//秘书
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
									title:"提示",
									content:"确认删除？删除后将无法恢复",
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
			
			var disposeForm = new Form({
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
						options:[{
        					key:"Security",
        					value:"保安"
        				},{
        					key:"Secretary",
            				value:"秘书"
        				},{
        					key:"Doctor",
            				value:"医生"
        				},{
        					key:"OneTwoZero",
            				value:"120"
        				},{
        					key:"SixZeroZeroOne",
            				value:"6001"
        				},{
        					key:"LifeManagement",
            				value:"生活管理"
        				},{
        					key:"HealthManagement",
            				value:"健康管理"
        				},{
        					key:"CommunityManagement",
            				value:"社区管理"
        				}],
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
						type:"date",
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
						label:"求助单号",	
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"place",
						label:"位置信息",
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
						label:i18ns.get("sale_ship_owner","会员"),
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
						label:"求助类型",
						type:"select",
						url:"api/enum/com.eling.elcms.ward.model.Sos.AlarmType",
						validate:["required"],
						defaultValue:"LifeTurn",
						className:{
							container:"col-md-6",label:"col-md-3"
						},
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
						name:"content",
						label:"求助内容",
						className:{
							container:"col-md-6",
							value : "form_content",label:"col-md-3"
						},
						type:"textarea"
					},{
						name:"sosTime",
						label:"求助时间",
						readonly:true,
						validate:["required"],
						className:{
							container:"col-md-6",label:"col-md-3"
						}
					},{
						name:"hospitalize",
						label:"需要就医",
						type:"radiolist",
						list:[{
							key:"true",
							value:"是"
						},{
							key:"false",
							value:"否"
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