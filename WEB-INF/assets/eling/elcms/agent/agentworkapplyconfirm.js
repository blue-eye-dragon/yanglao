define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Form=require("form-2.0.0");
	var store = require("store");
	var Profile = require("profile");
	var activeUser = store.get("user");
	var Panel=require("panel");
	var pkAgentWorkApplyConfirm={};
	//多语
	var i18ns = require("i18n");
	require("./agentworkapplyconfirm.css");
	var template="<div class='el-agentworkapplyconfirm'><div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>"+ 
 				"<div class='J-form hidden'></div>"+
 				"<div class='J-printform hidden'style='border:0 none'></div>"+
 				"<div class='container'>" +
	 					"<div class='J-grid22' style='padding:0;width:50%;float:left;'></div>"+
	 	 				"<div class='J-grid33 ' style='padding:0;width:50%;float:right;'></div>"+
	 	 				"<div class='J-grid2' style='padding:0;width:50%;float:left;'></div>"+
	 	 				"<div class='J-grid3' style='padding:0;width:50%;float:right;'></div>"+
 				"</div>"+
 				"<div class='J-printtext' style='margin:20px;'>" +
					"<span style='padding:0 10%;width:50%;float:left;'>确认签名：</span>"+
	 				"<span style='padding:0 10%;width:50%;float:left;'>日期：</span>"+
			"</div>"+
					"<div class='container box'>"+
						"<div class='J-panel hiden'></div>"+
						"<div class='p-box-content'>"+
							"<img class='J-picture' style='width: 50%; margin: 0 25%;' src='api/attachment/agentworkconfirm/"+pkAgentWorkApplyConfirm+"'/>"+
						"</div>"+
					"</div>"+
					"<div class='hidden'>"+
					"<form id='photoform' enctype='multipart/form-data' target='hidden_iframe' method='post' novalidate='novalidate' >"+
					"<input name='file' type='file' id='J-fileupload' class='hidden'>"+
					"</form>"+
					"<iframe name='hidden_iframe' class='hidden'></iframe>"
			        "</div>";
        var agentworkapplyconfirm  = ELView.extend({
        	events:{
    			"change .J-form-agentworkapplyconfirm-select-confirmResult":function(e){
    				var form =this.get("form");
    				var confirmResult=form.getValue("confirmResult");
    				if(confirmResult){
    					form.setValue("status","Comfirmed");
    				}
    			},
    			"change #J-fileupload" : function(e){
    				this.fileUpload($(e.target).attr("data-key"),$(e.target).attr("data-type"));
    			},
    			"click .J-attachment" : function(e){
    				var grid =this.get("grid");
   				 var index = grid.getIndex(e.target);
   				var data = grid.getSelectedData(index);
   				pkAgentWorkApplyConfirm=data.pkAgentWorkApplyConfirm;
    			},
    			"change .J-form-agentworkapplyconfirm-select-nextRemind" : function(e){
    				var nextRemind=this.get("form").getValue("nextRemind");
    				if(nextRemind=="true"){
    					this.get("form").show(["nextRemindDate","nextRemindContent","nextRemindUser"]);
    				}else{
    					this.get("form").hide(["nextRemindDate","nextRemindContent","nextRemindUser"]);
    				}
    			},
    	},
            attrs:{
            	template:template
            },
        	fileUpload:function(mark,type){
    			var url="api/attachment/agentworkconfirm/"+mark;
    			$.ajaxFileUpload({
                    url:url, 
                    secureuri:false,
                    fileElementId:'J-fileupload',
                    dataType: 'json',
                    success: function (data){
                    	if(data.msg=="success"){
                    		$(".J-picture").attr("src",url);
                    	}
                    }
                });
    		},
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:"代办事项确认",
        					buttonGroup:[{
        						id:"building",
        						tip:"楼号",
        						showAll:true,
        						showAllFirst:true,
        						handler:function(key,element){
        							widget.get("grid").refresh();
        						  }
        					},{
        						id:"status",
        						tip:"状态",
        						showAll:true,
        						showAllFirst:true,
        						url:"api/enum/com.eling.elcms.agent.model.AgentWorkApplyConfirm.Status",
        						handler:function(){
        							widget.get("grid").refresh();
        						}
        					}],
        					time:{
        						tip:"办理日期",
        						ranges:{
        							"今年": [moment().subtract("year").startOf("year"),moment().subtract("year").endOf("year")],
        						},
        						defaultTime:"今年",
        						click:function(time){
        							widget.get("grid").refresh();
        						}
        					},
        					buttons:[{
        						id:"toexcel",
        						text:"导出",
        						handler:function(){
        							var subnav=widget.get("subnav");
                            		var time=subnav.getValue("time");
                					window.open("api/agentworkapplyconfirm/toexcel?status="+subnav.getValue("status")+
            								"&agentWorkApply.agentWorkProcess.transactDate="+time.start+
            								"&agentWorkApply.agentWorkProcess.transactDateEnd="+time.end+
            								"&agentWorkApply.member.memberSigning.room.building.pkBuilding="+subnav.getValue("building")+
            								"&fetchProperties=pkAgentWorkApplyConfirm,"+
                                    		"agentWorkApply.pkAgentWorkApply,"+
                                    		"agentWorkApply.agentWork.pkAgentWork,"+
                            				"agentWorkApply.agentWork.workNO," +
                            				"agentWorkApply.agentWork.shortName," +
                            				"agentWorkApply.member.pkMember," +
                            				"agentWorkApply.member.memberSigning.room.number,"+
                            				"agentWorkApply.member.personalInfo.pkPersonalInfo,"+
                            				"agentWorkApply.member.personalInfo.name," +
                            				"agentWorkApply.member.personalInfo.idNumber," +
                            				"agentWorkApply.member.personalInfo.mobilePhone,"+
                            				"agentWorkApply.applyDate," +
                            				"agentWorkApply.applicant.pkApplicant,"+
                            				"agentWorkApply.applicant.name,"+
                            				"agentWorkApply.agentWorkProcess.pkAgentWorkProcess,"+
                            				"agentWorkApply.agentWorkProcess.transactDate,"+
                            				"agentWorkApply.agentWork.fee,"+
                            				"agentWorkApply.agentWork.agentFee,"+
                            				"agentWorkApply.agentWork.processingTime,"+
                            				"agentWorkApply.agentWork.setUser.name,"+
                            				"agentWorkApply.agentWork.agentType,"+
                            				"agentWorkApply.agentWork.agent,"+
                            				"agentWorkApply.status,"+
                            				"agentWorkApply.user,"+
                            				"status.display,"+
                            				"agentWorkApply.oneSelfWorkGather.pkAgentPaperGather,"+
                            				"agentWorkApply.oneSelfWorkGather.gather,"+
                            				"agentWorkApply.oneSelfWorkGather.agentPaper.pkAgentPaper,"+
                            				"agentWorkApply.oneSelfWorkGather.agentPaper.paperSource,"+
                            				"agentWorkApply.oneSelfWorkGather.agentPaper.papers.name,"+
                            				"agentWorkApply.agentWorkProcess.transactDate,"+
                            				"agentWorkApply.agentWorkProcess.processUser.pkProcessUser,"+
                            				"agentWorkApply.agentWorkProcess.processUser.name,"+
                            				"paperComplete,"+
                            				"confirmResult,"+
                            				"description,"
            								);
            					   return false;
                				}
        					},{
        						id:"upload",
        						text:"附件上传",
        						show:false,
        						handler:function(){
        							$("#J-fileupload").attr("data-key",pkAgentWorkApplyConfirm);
        							$("#J-fileupload").attr("data-type","half");
        							$("#J-fileupload").click();
        						}
        					},{
        						id:"save",
        						text:"保存",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var data= form.getData();
        							data.agentWorkApply=data.pkAgentWorkApply
        							aw.saveOrUpdate("api/agentworkapplyconfirm/savenextremind",aw.customParam(data),function(data){
                									widget.get("grid").refresh();
                	        					});
        							var subnav= widget.get("subnav");
        							form.reset();
        							widget.hide([".J-form",".J-grid22",".J-grid33",".J-grid2",".J-grid3"]).show([".J-grid"]);
        							subnav.hide(["return","save"]).show(["time","status","building"]);
        						}
        					},{
            						id:"return2",
            						text:"返回",
            						show:false,
            						handler:function(){
            							var form= widget.get("form");
            							var subnav= widget.get("subnav");
            							form.reset();
            							widget.hide([".J-panel",".p-box-content"]).show(".J-grid");
            							subnav.hide(["return2","upload"]).show(["time","status","building"]);
            					}
        					},{
        						id:"return",
        						text:"返回",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form.reset();
        							widget.hide([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-form"]).show(".J-grid");
        							subnav.hide(["return","save"]).show(["time","status","building"]);
        						}
        					}],
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
                    	url:"api/agentworkapplyconfirm/query",
                    	params:function(){
                    		var subnav=widget.get("subnav");
                    		var time=subnav.getValue("time");
                    		return {
                    			status:subnav.getValue("status"),
                    			"agentWorkApply.member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
                    			"agentWorkApply.agentWorkProcess.transactDate":time.start,
                    			"agentWorkApply.agentWorkProcess.transactDateEnd":time.end,
                        		fetchProperties:"pkAgentWorkApplyConfirm," +
                        		"agentWorkApply.pkAgentWorkApply,"+
                        		"agentWorkApply.agentWork.pkAgentWork,"+
                				"agentWorkApply.agentWork.workNO," +
                				"agentWorkApply.agentWork.shortName," +
                				"agentWorkApply.member.pkMember," +
                				"agentWorkApply.member.memberSigning.room.number,"+
                				"agentWorkApply.member.personalInfo.pkPersonalInfo,"+
                				"agentWorkApply.member.personalInfo.name," +
                				"agentWorkApply.member.personalInfo.idNumber," +
                				"agentWorkApply.member.personalInfo.mobilePhone,"+
                				"agentWorkApply.applyDate," +
                				"agentWorkApply.applicant.pkApplicant,"+
                				"agentWorkApply.applicant.name,"+
                				"agentWorkApply.agentWorkProcess.pkAgentWorkProcess,"+
                				"agentWorkApply.agentWorkProcess.transactDate,"+
                				"agentWorkApply.agentWork.fee,"+
                				"agentWorkApply.agentWork.agentFee,"+
                				"agentWorkApply.agentWork.processingTime,"+
                				"agentWorkApply.agentWork.setUser.name,"+
                				"agentWorkApply.agentWork.agentType,"+
                				"agentWorkApply.agentWork.agent,"+
                				"agentWorkApply.status,"+
                				"agentWorkApply.user,"+
                				"status.display,"+
                				"agentWorkApply.oneSelfWorkGather.pkAgentPaperGather,"+
                				"agentWorkApply.oneSelfWorkGather.gather,"+
                				"agentWorkApply.oneSelfWorkGather.agentPaper.pkAgentPaper,"+
                				"agentWorkApply.oneSelfWorkGather.agentPaper.paperSource,"+
                				"agentWorkApply.oneSelfWorkGather.agentPaper.papers.name,"+
                				"agentWorkApply.agentWorkProcess.transactDate,"+
                				"agentWorkApply.agentWorkProcess.processUser.pkProcessUser,"+
                				"agentWorkApply.agentWorkProcess.processUser.name,"+
                				"paperComplete,"+
                				"confirmResult,"+
                				"description," +
                				"nextRemind," +
                				"nextRemindDate," +
                				"nextRemindContent," +
                				"nextRemindUser.pkUser," +
                				"nextRemindUser.name,"+
                		        "version",                    		
                		    };
                    	},
                        model:{
                            columns:[{
                            	key:"agentWorkApply.agentWork",
        						name:"办理事项",
        						format:function(row,value){
        							var agentWork=row;
    								return row.workNO+row.shortName;
    								
    							},
                            },{
            					key:"agentWorkApply.member",
        						name:i18ns.get("sale_ship_owner","会员"),
        						format:function(row,value){
    								return row.memberSigning.room.number+row.personalInfo.name;
    							},
        					},{
            					key:"agentWorkApply.agentWorkProcess.transactDate",
        						name:"办理日期",
        						format:"date",
        					},{
            					key:"agentWorkApply.applicant.name",
        						name:"提交人"
        					},{
            					key:"agentWorkApply.agentWorkProcess.processUser.name",
        						name:"办理人",
        					},{
            					key:"paperComplete",
        						name:"资料是否齐全",
        						format:function(value,row){
    								if(value){
    									return "是";
    								}else{
    									return "否" ;
    											
    								}
    							}
        					},{
            					key:"status.value",
        						name:"状态"
        					},{
        						key:"operate",
        						className:"operate",
        						name:"操作",
        						format:"button",
        						formatparams:[{
        							key:"edit",
        							text:"处理",
        							show:function(value,row){
        								if(row.status.key=='Confirming'){
        									return true;
        								}else{
        									return false;
        								}
        							},
                                    
        							handler:function(index,data,rowEle){
        								var form= widget.get("form");
	        							var subnav= widget.get("subnav");
	        							var grid2=widget.get("grid2");
	        							var grid3=widget.get("grid3");
	        							var oneSelfWorkGather=[];
	        							var agentWorkGather=[];
	        							for(var i=0;i<data.agentWorkApply.oneSelfWorkGather.length;i++){
	        								if(data.agentWorkApply.oneSelfWorkGather[i].gather==false){
	        									form.setValue("paperComplete","false");
	        								}else{
	        									form.setValue("paperComplete","true");
	        								}
	        								if(data.agentWorkApply.oneSelfWorkGather[i].agentPaper.paperSource.key=="oneself"){
	        									oneSelfWorkGather.push({name:data.agentWorkApply.oneSelfWorkGather[i].agentPaper.papers.name,gather:data.agentWorkApply.oneSelfWorkGather[i].gather});
	        										
	        								}
	        								
	        							}
	        							for(var i=0;i<data.agentWorkApply.oneSelfWorkGather.length;i++){
	        								if(data.agentWorkApply.oneSelfWorkGather[i].agentPaper.paperSource.key=="agent"){
	        									agentWorkGather.push({name:data.agentWorkApply.oneSelfWorkGather[i].agentPaper.papers.name,gather:data.agentWorkApply.oneSelfWorkGather[i].gather});
	        								}
	        								
	        							}
	        							grid2.setData([]);
	        							grid3.setData([]);
	        							grid2.setData(oneSelfWorkGather);
	        							grid3.setData(agentWorkGather);
	        							form.reset();
										form.setData(data);
										form.setAttribute("agentWorkApply.status","readonly","readonly");
										var numberName=data.agentWorkApply.member.memberSigning.room.number+data.agentWorkApply.member.personalInfo.name;
										var workNOShortName=data.agentWorkApply.agentWork.workNO+data.agentWorkApply.agentWork.shortName;
										form.setValue("numberName",numberName)
										form.setValue("workNOShortName",workNOShortName)
										form.setValue("pkAgentWorkApply",data.agentWorkApply.pkAgentWorkApply);
										form.setValue("nextRemind",data.nextRemind);
										if(data.nextRemind == "true"){
											form.show(["nextRemindDate","nextRemindContent","nextRemindUser"]);
										}else{
											form.hide(["nextRemindDate","nextRemindContent","nextRemindUser"]);
										}
										subnav.hide(["time","status","toexcel","building"]).show(["return","save"]);
	        							widget.hide([".J-grid"]).show([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-form"]);        							
	        							}
        						},
        						{
        							key:"print",
        							text:"打印",
        							show:function(value,row){
        								if(row.status.key=='Confirming'){
        									return true;
        								}else{
        									return false;
        								}
        								
        							},
        							handler:function(index,data,rowEle){
        								var printForm= widget.get("printForm");
	        							var subnav= widget.get("subnav");
	        							var grid2=widget.get("grid2");
	        							var grid3=widget.get("grid3");
	        							var oneSelfWorkGather=[];
	        							var agentWorkGather=[];
	        							for(var i=0;i<data.agentWorkApply.oneSelfWorkGather.length;i++){
	        								if(data.agentWorkApply.oneSelfWorkGather[i].gather==false){
	        									printForm.setValue("paperComplete","false");
	        								}else{
	        									printForm.setValue("paperComplete","true");
	        								}
	        								if(data.agentWorkApply.oneSelfWorkGather[i].agentPaper.paperSource.key=="oneself"){
	        									oneSelfWorkGather.push({name:data.agentWorkApply.oneSelfWorkGather[i].agentPaper.papers.name,gather:data.agentWorkApply.oneSelfWorkGather[i].gather});
	        										
	        								}
	        								
	        							}
	        							for(var i=0;i<data.agentWorkApply.oneSelfWorkGather.length;i++){
	        								if(data.agentWorkApply.oneSelfWorkGather[i].agentPaper.paperSource.key=="agent"){
	        									agentWorkGather.push({name:data.agentWorkApply.oneSelfWorkGather[i].agentPaper.papers.name,gather:data.agentWorkApply.oneSelfWorkGather[i].gather});
	        								}
	        								
	        							}
	        							grid2.setData([]);
	        							grid3.setData([]);
	        							grid2.setData(oneSelfWorkGather);
	        							grid3.setData(agentWorkGather);
	        							printForm.reset();
	        							printForm.setData(data);
										var numberName=data.agentWorkApply.member.memberSigning.room.number+data.agentWorkApply.member.personalInfo.name;
										var workNOShortName=data.agentWorkApply.agentWork.workNO+data.agentWorkApply.agentWork.shortName;
										printForm.setValue("numberName",numberName)
										printForm.setValue("workNOShortName",workNOShortName)
										subnav.hide(["time","status","toexcel","building"])
										widget.hide([".J-grid"]).show([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-printform",".J-printtext"]);
										window.print();
										subnav.show(["time","status","toexcel","building"])
										widget.hide([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-printform",".J-printtext"]).show([".J-grid"]);
        							}
        						},
        						{
        							key:"attachment",
        							text:"附件",
        							show:function(value,row){
        								if(row.status.key=='Comfirmed'){
        									return true;
        								}else{
        									return false;
        								}
        							},
        							handler:function(index,data,rowEle){
        								var url="api/attachment/agentworkconfirm/"+data.pkAgentWorkApplyConfirm;
        								var panel=widget.get("panel");
        								panel.setData(data);
        								$(".J-picture").attr("src",url);
        								subnav.hide(["time","status","toexcel","building"]).show(["return2","upload",]);
	        							widget.hide([".J-grid"]).show([ ".p-box-content",".J-panel"]);
        							}
        						}]
        					}]
        				}
                    });
                    this.set("grid",grid);
                        
                    var form=new Form({
        				parentNode:".J-form",
        				cancelaction:function(){
        					widget.show([".J-grid"]).hide([".J-from"]);
        					widget.get("form").reset();
        				},
        				model:{
        					id:"agentworkapplyconfirm",
        					defaultButton:false,
        					items:[{
        						name:"pkAgentWorkApplyConfirm",
        						type:"hidden",
        					},{
        						name:"workNOShortName",
        						label:"代办事项",
        						readonly:true,
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "numberName",
								label : i18ns.get("sale_ship_owner","会员"),
								readonly:true,
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWorkApply.agentWork.fee",
								label : "办理费"
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWorkApply.agentWork.agentFee",
								label : "代办费"
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"agentWorkApply.agentWork.processingTime",	
        						label:"办理时限",
        						readonly:true
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWorkApply.agentWork.setUser.name",
								label : "申请人",
								readonly:true,
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWorkApply.agentWork.agentType.value",
								label : "是否可代办",
								readonly:true,
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWorkApply.status",
								label : "办理状态",
								url:"api/enum/com.eling.elcms.agent.model.AgentWorkApply.Status",
								type:"select",
								readonly:true,
							},{
								className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"paperComplete",	
        						label:"资料是否齐全",
        						type:"select",
								options:[{
		        					key:"true",
		        					value:"是"
		        				},{
		        					key:"false",
		            				value:"否"
		        				}],
		        				defaultValue:"false",
							},{
								name : "confirmResult",
								label : "老人确认结果",
								type:"select",
								options:[{
		        					key:"true",
		        					value:"已确认"
		        				},{
		        					key:"false",
		            				value:"待确认"
		        				}],
		        				defaultValue:"false",
							},{
								name : "description",
								label : "说明",
							    
							},{
								name:"nextRemind",	
        						label:"再次办理提醒",
        						type:"select",
								options:[{
		        					key:"true",
		        					value:"是"
		        				},{
		        					key:"false",
		            				value:"否"
		        				}],
		        				defaultValue:"false",
							},{
								name:"nextRemindDate",
								label:"再次办理提醒日期",
								type:"date",
								validate:["required"]
							},{
								name : "nextRemindContent",
								label : "再次办理提醒内容",
								validate:["required"]
							},{
								name:"nextRemindUser",
								label:"再次办理提醒人",
								type:"select",
								key:"pkUser",
								value:"name",
								url:"api/users",//TODO 用户角色：wulina
		        				params:{
									fetchProperties:"pkUser,name"
								},
								//lazy:true,
								multi : true,
								validate:["required"]
							},{
								name :"status",
								defaultValue:"Comfirming",
								type:"hidden",
							    
							},{
								name :"pkAgentWorkApply",
								type:"hidden",
							},{
								name :"version",
								defaultValue:0,
								type:"hidden",
							}]
        				}
        			});
        			this.set("form",form);
        			
                    
                    var grid2=new Grid({
                    	parentNode:".J-grid2",
                    	title:"本人材料收取",
                        model:{
                        	id:"oneselfpapers",
                        	head : {
                                title :"本人材料收取",
                                style:{
                                	container:"width:50%;",
        						},
                            },
                            columns:[{
                            	className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
                            	key:"name",
        						name:"材料名称"
                            },{
                            	className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
            					key:"gather",
        						name:"是否收取",
        						format:function(value,row){
        							if(row.gather==true){
        								return "<input  type='checkbox' class='J-oneself' checked='true' onclick='return false' >";
        							}else{
        								return "<input  type='checkbox' class='J-oneself'  onclick='return false' >";
        							}
        						},
        					}]
        				}
                    });
                    this.set("grid2",grid2);
                    
                    var grid3=new Grid({
                    	parentNode:".J-grid3",
                    	title:"代办人材料收取",
                        model:{
                            head : {
                                title :"代办人材料收取",
                                style:{
                                	container:"width:50%;",
        						},
                            },
                            columns:[{
                            	className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
                            	key:"name",
        						name:"材料名称"
                            },{
                            	className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
            					key:"gather",
        						name:"是否收取",
        						format:function(value,row){
        							if(row.gather==true){
        								return "<input  type='checkbox' class='J-agent' checked='true'  onclick='return false' >";
        							}else{
        								return "<input  type='checkbox' class='J-agent' onclick='return false' >";
        							}
    							},
        					}]
        				}
                    });
                    this.set("grid3",grid3);
                    var printForm=new Form({
        				parentNode:".J-printform",
        				isInitPageBar:false,
        				cancelaction:function(){
        					widget.show([".J-grid"]).hide([".J-from"]);
        					widget.get("form").reset();
        				},
        				model:{
        					id:"agentworkapplyconfirm",
        					defaultButton:false,
        					items:[{
        						name:"pkAgentWorkApplyConfirm",
        						type:"hidden",
        					},{
        						style:{
        							container:"width:50%;float:left;",
        							label:"width:30%;float:left;",
        							value:"width:50%;float:left;"
        						},
        						name:"workNOShortName",
        						label:"代办事项",
        						readonly:true,
        					},{
        						style:{
        							container:"width:50%;float:left;",
        							label:"width:30%;float:left;",
        							value:"width:50%;float:left;"
        						},
								name : "numberName",
								label : i18ns.get("sale_ship_owner","会员"),
								readonly:true,
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
        						},
								name : "agentWorkApply.agentWork.fee",
								label : "办理费",
								readonly:true,
								defaultValue:" "
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
        						},
								name : "agentWorkApply.agentWork.agentFee",
								label : "代办费",
								readonly:true,
								defaultValue:" "
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
        						},
        						name:"agentWorkApply.agentWork.processingTime",	
        						label:"办理时限",
        						readonly:true,
        						defaultValue:" "
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
        						},
								name : "agentWorkApply.agentWork.setUser.name",
								label : "申请人",
								readonly:true,
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
        						},
								name : "agentWorkApply.agentWork.agentType.value",
								label : "代办类型",
								readonly:true,
								defaultValue:" "
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
        						},
								name : "agentWorkApply.status",
								label : "办理状态",
								url:"api/enum/com.eling.elcms.agent.model.AgentWorkApply.Status",
								type:"select",
								readonly:true,
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
        						},
        						name:"paperComplete",	
        						label:"资料是否齐全",
        						type:"select",
								options:[{
		        					key:"true",
		        					value:"是"
		        				},{
		        					key:"false",
		            				value:"否"
		        				}],
		        				defaultValue:"false",
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
        						},
								name : "confirmResult",
								label : "老人确认结果",
								type:"select",
								options:[{
		        					key:"true",
		        					value:"已确认"
		        				},{
		        					key:"false",
		            				value:"待确认"
		        				}],
		        				defaultValue:"false",
							},{
								style:{
									container:"width:50%;float:left;",
									label:"width:30%;float:left;",
									value:"width:50%;float:left;"
								},
								name : "description",
								label : "说明",
								defaultValue:" "
							    
							},{
								name :"status",
								defaultValue:"Comfirming",
								type:"hidden",
							    
							},{
								name :"pkAgentWorkApply",
								type:"hidden",
							},{
								name :"version",
								defaultValue:0,
								type:"hidden",
							}]
        				}
        			});
        			this.set("printForm",printForm);
                   var panel=new Panel({
       				parentNode:".J-panel",
       				model:{
       					labelWidth:55,
       					valueWidth:40,
       					items:[{
    						name:"agentWorkApply.agentWork",
    						label:"办理事项",
    						format:function(value,data){
								return value.workNO+value.shortName;
								
							},
                        },{
    						name:"agentWorkApply.member",
    						label:i18ns.get("sale_ship_owner","会员"),
    						format:function(value,data){
								return value.memberSigning.room.number+value.personalInfo.name;
							},
    					},{
    						name:"agentWorkApply.agentWorkProcess.transactDate",
    						label:"办理日期",
    						format:function(value,data){
    							return moment(value).format("YYYY-MM-DD")
    						}
    					},{
    						name:"agentWorkApply.applicant.name",
    						label:"提交人",
    					},{
    						name:"agentWorkApply.agentWorkProcess.processUser.name",
    						label:"办理人",
    					},{
    						name:"paperComplete",
    						label:"资料是否齐全",
    						format:function(value,data){
								if(value){
									return "是";
								}else{
									return "否" ;
											
								}
							}
    					},{
    							name:"status.value",
        						label:"状态",
    					}]
       				}
                   });
                   this.set("panel",panel);
                },
                afterInitComponent:function(params,widget){
                	widget.hide([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-from2",".p-box-content",".J-panel",".J-printform",".J-printtext"]).show([".J-grid"]);
        		}
        });
        module.exports = agentworkapplyconfirm ;
});