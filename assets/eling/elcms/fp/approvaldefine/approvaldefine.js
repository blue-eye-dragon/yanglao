define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Form=require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	var template="<div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>"+ 
 				"<div class='J-form hidden'></div>"+
 				"<div class='J-appGrid hidden'></div>"+
 				"<div class='J-appForm hidden'></div>";
	var fetchProperties="pkApprovalDefine," +
						"version," +
						"serviceType," +
						"setupTime," +
						"serviceImpl," +
						"modelClass," +
						"pageLink," +
						"description," +
						"user.pkUser," +
						"user.name," +
						"status," +
						"apporvaltype," +
						"approvalDefineItems.pkApprovalDefineItem," +
						"approvalDefineItems.sequenceNumber," +
						"approvalDefineItems.appsidetype," +
						"approvalDefineItems.approvalDepartment.pkDepartment," +
						"approvalDefineItems.approvalDepartment.name," +
						"approvalDefineItems.approvalRole.pkRole," +
						"approvalDefineItems.approvalRole.name," +
						"approvalDefineItems.approvalUser.pkUser," +
						"approvalDefineItems.approvalUser.name," +
						"approvalDefineItems.approvalRuleRegister.pkApprovalRuleRegister," +
						"approvalDefineItems.approvalRuleRegister.name," +
						"approvalDefineItems.approvalRuleRegister.paramName," +
						"approvalDefineItems.approvalRuleRegister.ruleClass," +
						"approvalDefineItems.arrKeyValue," +
						"approvalDefineItems.arrValue," +
						"approvalDefineItems.version";
	
        var approvaldefine  = ELView.extend({
        	events:{
        		"change .J-form-approvalDefineItemForm-select-approvalRuleRegister":function(e){
        			var widget = this;
        			var appForm = widget.get("appForm");
        			var approvalRuleRegister = appForm.getValue("approvalRuleRegister");
        			widget._loadarrKeyValue(appForm,approvalRuleRegister)
        		}
        	},
            attrs:{
            	template:template
            },
            _loadarrKeyValue:function(appForm,pk,callback){
            	if(pk && pk != 1){
            		aw.ajax({
                		url:"api/approvalruleregister/findCandidatePara",
    					data:{
    						pkApprovalRuleRegister:pk
    					},
        				dataType:"json",
        				success:function(data){
    						if(data){
    							var label = appForm.getData("approvalRuleRegister",{
    								pk:appForm.getValue("approvalRuleRegister")
    							}).paramName;
    							if(label){
    								appForm.setLabel("arrKeyValue",label);
    								appForm.show("arrKeyValue");
    							}
    							var datas = [] ;
    							for ( var i in data) {
    								datas.push({
    									key:i,
    									value:data[i]
    								})
    							}
    							//??????form2.0?????????setData???????????????????????????????????????????????????????????????
    							appForm.load("arrKeyValue",{
    								options:datas,
    								callback:callback?callback:""
    							});
    						}else{
    							appForm.hide("arrKeyValue");
    							appForm.setData("arrKeyValue",[]);
    							appForm.setLabel("arrKeyValue","");
    						}
        				}
                	})
            	}else{
            		appForm.hide("arrKeyValue");
					appForm.setData("arrKeyValue",[]);
					appForm.setLabel("arrKeyValue","");
            	}
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:"??????????????????",
        					buttons:[{
        						id:"return",
        						text:"??????",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							widget.get("grid").refresh();
        							form.reset();
        							widget.hide([".J-form",".J-appGrid",".J-appForm"]).show(".J-grid");
        							subnav.hide(["return"]);
        						}
        					}],
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
                    	url : "api/approvaldefine/query",
                    	params:function(){
                    		return {
                        		fetchProperties:fetchProperties
                    		};
                    	},
                        model:{
                            columns:[{
                            	key:"description",
        						name:"??????",
        						format:"detail",
        						formatparams:[{
        							key:"detail",
        							handler:function(index,data,rowEle){
        								var form= widget.get("form");
	        							var subnav= widget.get("subnav");
	        							var appGrid= widget.get("appGrid");
	        							form.reset();
	        							if(data.setupTime){
	        								data.setupTime = moment(data.setupTime).format("YYYY-MM-DD");
	        							}
										form.setData(data);
										form.setDisabled(true);
										appGrid.setData(data.approvalDefineItems);
	        							widget.show([".J-form",".J-appGrid"]).hide(".J-grid");
	        							subnav.show(["return"]);
	        							$(".J-appedit").addClass("hidden");
	        							$(".J-appdelete").addClass("hidden");
	        							$(".J-grid-head-add").addClass("hidden");
	        							
        							}
        							
        						}]
                            },{
        						key:"setupTime",
        						name:"????????????",
        						format:"date"
        					},{
        						key:"user.name",
        						name:"?????????"
        					},{
        						key:"blockup",
        						name:"??????",
        						format:function(value,row){
        							if(row.status.key=="Setting"){
        								return "button";
        							}else{
        								return "?????????"
        							}
        						},
        						formatparams:[{
        							key:"blockupbtn",
        							text:"??????",
        							handler:function(index,data,rowEle){
        								Dialog.confirm({
        									title:"??????",
        									content:"?????????????????????????????????",
        									confirm:function(){
        										aw.ajax({
        											url:"api/approvaldefine/blockup",
        											data:{
        												pkApprovalDefine:data.pkApprovalDefine,
        												version:data.version,
        												},
        											dataType:"json",
        											success:function(data){
        												widget.get("grid").refresh();
        											}
        										});
        										
        									}
        								});
        							}
        						}]
        					},{
        						key:"operate",
        						name:"??????",
        						format:function(value,row){
        							if(row.status.key!="Setting"){
        								return "button";
        							}else {
        								return "?????????";
        							}
        						},
        						formatparams:[{
        							key:"edit",
        							icon:"edit",
        							handler:function(index,data,rowEle){
        								var form= widget.get("form");
	        							var subnav= widget.get("subnav");
	        							var appGrid= widget.get("appGrid");
	        							form.reset();
	        							if(data.setupTime){
	        								data.setupTime = moment(data.setupTime).format("YYYY-MM-DD");
	        							}
										form.setData(data);
										form.setDisabled(true);
										appGrid.setData(data.approvalDefineItems);
										$(".J-grid-head-add").removeClass("hidden");
	        							widget.show([".J-form",".J-appGrid"]).hide(".J-grid");
	        							subnav.show(["return"]);
        							}
        						},{
        							key:"setup",
        							text:"??????",
        							handler:function(index,data,rowEle){
        								if(data.approvalDefineItems.length==0){
        									Dialog.alert({
        	        							content:"???????????????????????????????????????,????????????????????????"
        	        						});
        									return;
        								}
        								if(data.approvalDefineItems.length==1){
        									if (data.approvalDefineItems[0].approvalRuleRegister.pkApprovalRuleRegister == 1) {
        										Dialog.alert({
            	        							content:"?????????????????????????????????,??????????????????????????????"
            	        						});
            									return;
											}
        								}
        								var falg = true;
        								for (var i in data.approvalDefineItems ) {
        									if (data.approvalDefineItems[i].approvalRuleRegister.pkApprovalRuleRegister == 1) {
        										falg =false;
        										break;
											}
										}
        								if(falg){
        									Dialog.alert({
        	        							content:"?????????????????????????????????,??????????????????????????????"
        	        						});
        									return;
        								}
        								Dialog.confirm({
        									title:"??????",
        									content:"?????????????????????????????????",
        									confirm:function(){
        										aw.ajax({
        											url:"api/approvaldefine/save",
        											data:{
        												pkApprovalDefine:data.pkApprovalDefine,
        												status:"Setting",
        												version:data.version,
        												},
        											dataType:"json",
        											success:function(data){
        												widget.get("grid").refresh();
        											}
        										});
        										
        									}
        								});
        							}
        						}]
        					}]
        				}
                    });
                    this.set("grid",grid);
                        
                    var form=new Form({
        				parentNode:".J-form",
        				model:{
        					id:"approvalDefineForm",
        					defaultButton:false,
        					items:[{
        						name:"pkApprovalDefine",
        						type:"hidden",
        					},{
        						name:"version",
        						defaultValue:"0",
        						type:"hidden"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"description",
        						label:"??????",
        						validate:["required"]
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"setupTime",
        						label:"????????????",
        						validate:["required"]
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"user.name",
        						label:"?????????",
        						validate:["required"]
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"status",
    							label:"????????????",
    							type:"select",
    							options:[{
    								key:"Setting",
    								value:"?????????"
    							},{
    								key:"BlockUp",
    								value:"?????????"
    							}],
    							validate:["required"]
        					}
        					]
        				}
        			});
        			this.set("form",form);
        			
        			var appGrid = new Grid({
        				parentNode:".J-appGrid",
        				url:"api/approvaldefineitem/query",
                		autoRender:false,
                		params:function(){
                			return{
                				"approvalDefine":widget.get("form").getValue("pkApprovalDefine"),
                				"orderString":"sequenceNumber,pkApprovalDefineItem",
                				fetchProperties:"pkApprovalDefineItem" +
                						",approvalDepartment.pkDepartment" +
                						",approvalDepartment.name" +
                						",approvalRole.pkRole"+
                						",approvalRole.name" +
                						",sequenceNumber" +
                						",appsidetype" +
                						",approvalUser.pkUser" +
                						",approvalUser.name," +
                						"approvalRuleRegister.pkApprovalRuleRegister," +
                						"approvalRuleRegister.name," +
                						"approvalRuleRegister.paramName," +
                						"approvalRuleRegister.ruleClass," +
                						"arrKeyValue," +
                						"arrValue," +
                						",version" ,
                			}
                		},
        				model:{
        					head:{
        						title:"????????????", 
        						buttons:[{
        							id:"add",
        							icon:"icon-plus",
        							handler:function(){
        								widget.hide(".J-appGrid").show(".J-appForm");
        								widget.get("appForm").reset();
        							}
        						}]
        					},
        					columns:[{
        						key : "sequenceNumber",
        						name : "??????",
        					},{
        						key :"approvalRuleRegister.name",
        						name : "????????????",
        					},{
        						key:"arrValue",
        						name:"?????????",
        					},{
        						key:"operate",
        						name:"??????",
        						format:"button",
        						formatparams:[{
        							key:"appedit",	
        							icon:"edit",
        							handler:function(index,data,rowEle){
        								widget.hide(".J-appGrid").show(".J-appForm");
        								var form = widget.get("form")
        								var appform = widget.get("appForm");
        								appform.reset();
        								appform.setData(data);
        								if(data.approvalRuleRegister){
        									widget._loadarrKeyValue(appForm,data.approvalRuleRegister.pkApprovalRuleRegister,function(){
        										appform.setValue("arrKeyValue",data.arrKeyValue);
        									})
        								}
        							}
        						},{
        							key:"appdelete",	
        							icon:"remove",
        							handler:function(index,data,rowEle){
        								aw.del("api/approvaldefineitem/"+data.pkApprovalDefineItem+"/delete"
        										,function(data){
        											 widget.get("appGrid").refresh();
        								})
        							}
        						}]
        					}]
        				}
        			})
        			this.set("appGrid",appGrid);
        			
        			var appForm=new Form ({
        				parentNode:".J-appForm",
        				saveaction:function(){
        					var form = widget.get("form");
        					var appGrid = widget.get("appGrid");
        					var appForm = widget.get("appForm");
        					var data =appForm.getData() ;
        					if(data.sequenceNumber != 0 && data.approvalRuleRegister.pkApprovalRuleRegister == 1){
        						Dialog.alert({
        							content:"?????????????????????0??????"
        						});
                				return;
        					}
        					if(data.arrKeyValue){
        						data.arrValue=appForm.getData("arrKeyValue",{
        							pk:data.arrKeyValue
        						}).value
        					}
        					data.approvalDefine =form.getValue("pkApprovalDefine");
        					aw.saveOrUpdate("api/approvaldefineitem/saveInDefine"
        							,aw.customParam(data)
        							,function(data){
        								form.setValue("setupTime",moment().format("YYYY-MM-DD"));
        								form.setValue("user.name",activeUser.name);
    									widget.show(".J-appGrid").hide(".J-appForm");
        								appGrid.refresh();
        								widget.get("grid").refresh();
        					});
        					
        				},
        				cancelaction:function(){
        					widget.show(".J-appGrid").hide(".J-appForm");
        				},
        				model:{
        					id:"approvalDefineItemForm",
        					items:[
        					{
        						name:"pkApprovalDefineItem",
        						type:"hidden"
        					},{
        						name:"version",
        						defaultValue:"0",
        						type:"hidden"
        					},{
        						name:"sequenceNumber",
        						label:"??????",
        						validate:["required","zeronumber"]
        					},{
        						name:"approvalRuleRegister",
        						label:"????????????",
    							key:"pkApprovalRuleRegister",
    							value:"name",
    							url:"api/approvalruleregister/query",
    							params:{
    								fetchProperties:"pkApprovalRuleRegister,name,paramName"
    							},
    							type:"select",
        					},{
        						show:false,
        						lazy:true,
        						name:"arrKeyValue",
        						label:"??????",
    							key:"key",
    							value:"value",
    							type:"select",
        					}]
        				}
        			});
        			this.set("appForm",appForm);
        			
                },
        });
        module.exports = approvaldefine ;
});
