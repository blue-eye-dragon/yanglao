define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Form=require("form")
	var store = require("store");
	var activeUser = store.get("user");
	var gridData={};
	var template="<div class='el-agentwork'><div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>"+ 
 				"<div class='J-form hidden'></div>"+
 				"<div class='J-form2 hidden'></div>";
	require("./agentwork.css");
        var agentwork  = ELView.extend({
        	events:{
        		"click .J-forShort-detail":function(ele){
    	    		var grid =this.get("grid");
    				var index = grid.getIndex(ele.target);
    				var data = grid.getSelectedData(index);
    	    		var form= this.get("form");
    	    		form.setData(data);
    	    		var oneSelfPaperarray=[];
					for(var i=0; i<data.oneSelfPapers.length;i++){
						oneSelfPaperarray.push({pkPaperType:data.oneSelfPapers[i].papers.pkPaperType,name:data.oneSelfPapers[i].papers.name})
					}
					form.setValue("oneSelfPaperList",oneSelfPaperarray);
					var agentPaperarray=[];
					for(var j=0; j<data.agentPapers.length;j++){
						agentPaperarray.push({pkPaperType:data.agentPapers[j].papers.pkPaperType,name:data.agentPapers[j].papers.name})
					}	
					form.setValue("agentPaperList",agentPaperarray);
					form.setDisabled(true);
    	    		this.show([".J-form2"]).hide([".J-grid"]);
    	    		this.get("subnav").show("return2").hide(["add","agentType","status","search"]);
    	    	},
        	},
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:"代办事项设置",
        					search : function(str) {
        						var g=widget.get("grid");
        						g.loading();
        						aw.ajax({
        							url:"api/agentwork/search",
        							data:{
        								s:str,
        								searchProperties:"workNO,shortName,fullName,description",
        						        fetchProperties:"*," +
	                        				"setUser.pkUser,"+
	                        				"setUser.name," +
	                        				"status.display,"+
	                        				"description,"+
	                        				"oneSelfPapers.pkAgentPaper,"+
	                        				"oneSelfPapers.papers.pkPaperType,"+
	                        				"oneSelfPapers.papers.name,"+
	                        				"agentPapers.pkAgentPaper,"+
	                        				"agentPapers.papers.pkPaperType,"+
	                        				"agentPapers.papers.name"
        							},
        							dataType:"json",
        							success:function(data){
        								g.setData(data);
        								
        							}
        						});
        					},
        					buttonGroup:[{
            					id:"agentType",
            					tip:"代办形式",
            					showAll:true,
        						showAllFirst:true,
        						url:"api/enum/com.eling.elcms.agent.model.AgentWork.AgentType",
        						handler:function(){
        							widget.get("grid").refresh()
        						}
            				},{
        						id:"status",
        						tip:"状态",
        						showAll:true,
        						showAllFirst:true,
        						url:"api/enum/com.eling.elcms.agent.model.AgentWork.Status",
        						handler:function(){
        							widget.get("grid").refresh();
        						}
        					}],
        					buttons:[{
        						id:"add",
        						text:"新增",
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form.reset();
        							widget.hide([".J-grid"]).show(".J-form");
        							subnav.hide(["add","agentType","status","search"]).show(["return"]);
        							//多选加自适应高度
        		          			$(".J-form-agentwork-select-oneSelfPaperList .el-select>div:first").css("height","100%");
        		          			$(".J-form-agentwork-select-agentPaperList .el-select>div:first").css("height","100%");
        						}
        					},{
        						id:"return",
        						text:"返回",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form.reset();
        							widget.hide([".J-form"]).show([".J-grid"]);
        							subnav.hide(["return"]).show(["add","agentType","status","search"]);
        						}
        					},{
        						id:"return2",
        						text:"返回",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form2.reset();
        							widget.hide([".J-form2"]).show([".J-grid"]);
        							subnav.hide(["return2"]).show(["add","agentType","status","search"]);
        						}
        					}],
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
                    	url : "api/agentwork/query",
                    	params:function(){
                    		var subnav=widget.get("subnav");
                    		return {
                    			agentType:subnav.getValue("agentType"),
                    			status:subnav.getValue("status"),
                        		fetchProperties:"*," +
                				"setUser.pkUser,"+
                				"setUser.name,"+ 
                				"oneSelfPapers.pkAgentPaper,"+
                				"oneSelfPapers.papers.pkPaperType,"+
                				"oneSelfPapers.papers.name,"+
                				"oneSelfPapers.version,"+
                				"agentPapers.pkAgentPaper,"+
                				"agentPapers.papers.pkPaperType,"+
                				"agentPapers.papers.name,"+
                				"agentPapers.version",
                		    };
                    	},
                        model:{
                            columns:[{
                            	key:"workNO",
        						name:"编号"
                            },{
            					key:"shortName",
        						name:"简称",
        						format:function(value,row){
    								return "<a href='javascript:void(0);' style='color:red;' class='J-forShort-detail'  >"+value+"</a>";    								
    							},
        					},{
            					key:"fullName",
        						name:"全称"
        					},{
            					key:"setDate",
        						name:"设置日期",
        						format:"date"
        					},{
            					key:"setUser.name",
        						name:"设置人"
        					},{
            					key:"agentType.value",
        						name:"代办形式"
        					},{
            					key:"description",
            					className:"description",
        						name:"说明"
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
        							text:"修改",
        							handler:function(index,data,rowEle){
        								var form= widget.get("form");
	        							var subnav= widget.get("subnav");
	        							form.reset();
										form.setData(data);
										var oneSelfPaperarray=[];
										gridData=data;
										for(var i=0; i<data.oneSelfPapers.length;i++){
										    if(data.oneSelfPapers[i].papers!=null){
										    	oneSelfPaperarray.push({pkPaperType:data.oneSelfPapers[i].papers.pkPaperType,name:data.oneSelfPapers[i].papers.name});
										    }
										}
										form.setValue("oneSelfPaperList",oneSelfPaperarray);
										var agentPaperarray=[];
										for(var j=0; j<data.agentPapers.length;j++){
											if(data.agentPapers[j].papers!=null){
												agentPaperarray.push({pkPaperType:data.agentPapers[j].papers.pkPaperType,name:data.agentPapers[j].papers.name})
											}
										}	
										form.setValue("agentPaperList",agentPaperarray);
	        							widget.show([".J-form"]).hide([".J-grid"]);
	        							subnav.show(["return"]).hide(["add","agentType","status","search"]);
	        							//多选加自适应高度
	        		          			$(".J-form-agentwork-select-oneSelfPaperList .el-select>div:first").css("height","100%");
	        		          			$(".J-form-agentwork-select-agentPaperList .el-select>div:first").css("height","100%");
        							}
        						},{
        							key:"inuse",
        							text:"启用",
        							show:function(value,row){        								
        								if(row.status.key=='Disused'){
        									return true;
        								}else{
        									return false;
        								}
        							},
        							handler:function(index,data,rowEle){
        								Dialog.confirm({
        									title:"提示",
        									content:"是否确认启用代办事项？",
        									confirm:function(){
        										var statusData={};
        										statusData.pkAgentWork=data.pkAgentWork;
        										statusData.status='InUse';
        										statusData.version=data.version;
                								aw.saveOrUpdate("api/agentwork/saveStatus",statusData,function(data){
                									widget.get("grid").refresh();
                	        					});
        									}
        								});
        							}
        						},{
        							key:"disused",
        							text:"停用",
        							show:function(value,row){
        								if(row.status.key=='InUse'){
        									return true;
        								}else{
        									return false;
        								}
        							},
        							handler:function(index,data,rowEle){
        								Dialog.confirm({
        									title:"提示",
        									content:"是否确认停用代办事项？",
        									confirm:function(){
        										var statusData={};
        										statusData.pkAgentWork=data.pkAgentWork;
        										statusData.status='Disused';
        										statusData.version=data.version;
                								aw.saveOrUpdate("api/agentwork/saveStatus",statusData,function(data){
                	        						widget.get("grid").refresh();
                	        					});
        									}
        								});
        							}
        						},{
        							key:"delete",	
        							icon:"remove",
        							handler:function(index,data,rowEle){
        								aw.del("api/agentwork/" + data.pkAgentWork + "/delete",function(){
        									widget.get("grid").refresh();
        								});
        							}
        						}]
        					}]
        				}
                    });
                    this.set("grid",grid);
                        
                    var form=new Form({
        				parentNode:".J-form",
        				saveaction:function(){
        					var form=widget.get("form");
        					var  data = form.getData();
        					var  oneSelfPaperList = [];
        					for(var i=0; i<data.oneSelfPaperList.length;i++){
        							var agentPaper={
        									papers:data.oneSelfPaperList[i],
                							paperSource:"oneself",
                					};
            					oneSelfPaperList.push(agentPaper);
        					}
        					data.oneSelfPaperList = oneSelfPaperList;
                            var agentPaperList=[];
                            for(var j=0;j<data.agentPaperList.length;j++){
                            		var agentPaper={
                 							papers:data.agentPaperList[j],	
                 							paperSource:"agent",
                 					};  
                                agentPaperList.push(agentPaper);                                
                            }
                           data.agentPaperList=agentPaperList;
                           var setUser={};                      
                           data.setUser=activeUser.pkUser;
                           var status=form.getValue("status.key");
                           data.status=status;
        					aw.saveOrUpdate("api/agentwork/save",aw.customParam(data),function(data){
        						widget.show([".J-grid"]).hide([".J-form"]);
            					widget.get("subnav").hide(["return","return2"]).show(["add","agentType","status","search"]);
        						widget.get("grid").refresh();
        					});
        				},
        				cancelaction:function(){
        					widget.get("form").reset();
        					widget.show([".J-grid"]).hide([".J-form"]);
        					widget.get("subnav").hide(["return","return2"]).show(["add","agentType","status","search"]);
        				},
        				model:{
        					id:"agentwork",
        					items:[{
        						name:"pkAgentWork",
        						type:"hidden"
        					},{
        						name:"workNO",
        						label:"编号",
        						validate:["required"],
            					exValidate: function(value){
        							if(value.length>15){
        								return "不能超过15个字符";
        							}else{
        								return true;
        							}
        						}
        					},{
								name : "fullName",
								label : "全称",
								validate:["required"],
            					exValidate: function(value){
        							if(value.length>50){
        								return "不能超过50个字符";
        							}else{
        								return true;
        							}
        						}
							},{
								name : "shortName",
								label : "简称",
								validate:["required"],
            					exValidate: function(value){
        							if(value.length>15){
        								return "不能超过15个字符";
        							}else{
        								return true;
        							}
        						}
							},{
								name : "workType",
								label : "事项类型",
								url:"api/enum/com.eling.elcms.agent.model.AgentWork.WorkType",
								type:"select",
             					validate:["required"]
							},{
								name : "fee",
								label : "办理费",
								defaultValue:0,
	             				validate:["money"]
							},{
								name : "locations",
								label : "办理地点"
							},{
								name : "processingTime",
								label : "办理时限(工作日)",
								defaultValue:1,
	             				validate:["number"]
							},{
								name : "oneSelfPaperList",
								label : "所需本人材料",
								url:"api/papertype/query",
        						params:function(){
        							return {
        								status:"InUse",
        								fetchProperties:"pkPaperType,name,version"
        							};
        						},
        						key:"pkPaperType",
        						value:"name",
        						multi:true,
        						type:"select",
             					validate:["required"]
							},{
								name : "agentType",
								label : "代办形式",
								url:"api/enum/com.eling.elcms.agent.model.AgentWork.AgentType",
								type:"select",
								validate:["required"]
							},{
								name : "agentFee",
								label : "代办费",
								defaultValue:0,
	             				validate:["money"]
							},{
								name : "agentPaperList",
								label : "所需代办人材料",
								url:"api/papertype/query",
        						params:function(){
        							return {
        								status:"InUse",
        								fetchProperties:"pkPaperType,name,version"
        							};
        						},
        						key:"pkPaperType",
        						value:"name",
        						multi:true,
        						type:"select",
             					validate:["required"]
							},{
								name : "description",
								label : "说明",
								type:"textarea",
            					exValidate: function(value){
        							if(value.length>510){
        								return "不能超过500个字符";
        							}else{
        								return true;
        							}
        						}							    
							},{
        						name:"setDate",	
        						label:"设置日期",
        						type:"date",
    							mode:"YYYY-MM-DD",
    							defaultValue:moment().valueOf(),
    							validate : [ "required" ]							    
							},{
        						name:"activeUser",	
        						label:"设置人",
    							defaultValue:activeUser.name							    
							},{
								name :"version",
								defaultValue:0,
								type:"hidden"
							},{
								name :"status.key",
								defaultValue:"InUse",
								type:"hidden"
							}]
        				}
        			});
        			this.set("form",form);	
        			  var form2=new Form({
          				parentNode:".J-form2",
          				saveaction:function(){
          					var form2=widget.get("form2");
          					var  data = form2.getData();
          					var  oneSelfPaperList = [];
          					for(var i=0; i<data.oneSelfPaperList.length;i++){
          							var agentPaper={
                  							papers:data.oneSelfPaperList[i],
                  							paperSource:"oneself",
                  					};
              					oneSelfPaperList.push(agentPaper);
          					}
          					data.oneSelfPaperList = oneSelfPaperList;
                              var agentPaperList=[];
                              for(var j=0;j<data.agentPaperList.length;j++){
                              		var agentPaper={
                   							papers:data.agentPaperList[j],	
                   							paperSource:"agent",
                   					};  
                                  agentPaperList.push(agentPaper);                                
                              }
                             data.agentPaperList=agentPaperList;
                             var setUser={};                      
                             data.setUser=activeUser.pkUser;
                             var status=form.getValue("status.key");
                             data.status=status;
          					aw.saveOrUpdate("api/agentwork/save",aw.customParam(data),function(data){
          						widget.show([".J-grid"]).hide([".J-form2"]);
              					widget.get("subnav").hide(["return"]).show(["add","agentType","status","search"]);
          						widget.get("grid").refresh();
          					});
          				},
          				cancelaction:function(){
          					widget.get("form2").reset();
          					widget.show([".J-grid"]).hide([".J-form2"]);
          					widget.get("subnav").hide(["return"]).show(["add","agentType","status","search"]);
          				},
          				model:{
          					id:"agentwork",
          					items:[{
          						name:"pkAgentWork",
          						type:"hidden"
          					},{
          						name:"workNO",
          						label:"编号",
          						validate:["required"],
              					exValidate: function(value){
          							if(value.length>15){
          								return "不能超过15个字符";
          							}else{
          								return true;
          							}
          						}
          					},{
  								name : "fullName",
  								label : "全称",
  								validate:["required"],
              					exValidate: function(value){
          							if(value.length>50){
          								return "不能超过50个字符";
          							}else{
          								return true;
          							}
          						}
  							},{
  								name : "shortName",
  								label : "简称",
  								validate:["required"],
              					exValidate: function(value){
          							if(value.length>15){
          								return "不能超过15个字符";
          							}else{
          								return true;
          							}
          						}
  							},{
  								name : "workType",
  								label : "事项类型",
  								url:"api/enum/com.eling.elcms.agent.model.AgentWork.WorkType",
  								type:"select",
               					validate:["required"]
  							},{
  								name : "fee",
  								label : "办理费",
  								defaultValue:0,
  	             				validate:["money"]
  							},{
  								name : "locations",
  								label : "办理地点"
  							},{
  								name : "processingTime",
  								label : "办理时限(工作日)",
  								defaultValue:1,
  	             				validate:["number"]
  							},{
  								name : "oneSelfPaperList",
  								label : "所需本人材料",
  								url:"api/papertype/query",
          						params:function(){
          							return {
          								fetchProperties:"pkPaperType,name,version"
          							};
          						},
          						key:"pkPaperType",
          						value:"name",
          						multi:true,
          						type:"select",
               					validate:["required"]
  							},{
  								name : "agentType",
  								label : "代办形式",
  								url:"api/enum/com.eling.elcms.agent.model.AgentWork.AgentType",
  								type:"select",
  								validate:["required"]
  							},{
  								name : "agentFee",
  								label : "代办费",
  								defaultValue:0,
  	             				validate:["money"]
  							},{
  								name : "agentPaperList",
  								label : "所需代办人材料",
  								url:"api/papertype/query",
          						params:function(){
          							return {
          								fetchProperties:"pkPaperType,name,version"
          							};
          						},
          						key:"pkPaperType",
          						value:"name",
          						multi:true,
          						type:"select",
               					validate:["required"]
  							},{
  								name : "description",
  								label : "说明",
  								type:"textarea",
              					exValidate: function(value){
          							if(value.length>510){
          								return "不能超过500个字符";
          							}else{
          								return true;
          							}
          						}							    
  							},{
          						name:"setDate",	
          						label:"设置日期",
          						type:"date",
      							mode:"YYYY-MM-DD",
      							defaultValue:moment().valueOf(),
      							validate : [ "required" ]							    
  							},{
          						name:"activeUser",	
          						label:"设置人",
      							defaultValue:activeUser.name							    
  							},{
  								name :"version",
  								defaultValue:0,
  								type:"hidden"
  							},{
  								name :"status.key",
  								defaultValue:"InUse",
  								type:"hidden"
  							}]
          				}
          			});
          			this.set("form2",form2);	
          			//多选加自适应高度
          			$(".J-form-agentwork-select-oneSelfPaperList .el-select>div:first").css("height","100%");
          			$(".J-form-agentwork-select-agentPaperList .el-select>div:first").css("height","100%");
          			
                }
        });
        module.exports = agentwork ;
});