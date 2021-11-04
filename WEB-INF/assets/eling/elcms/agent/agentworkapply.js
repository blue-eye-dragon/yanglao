define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Form=require("form-2.0.0");
	var store = require("store");
	var activeUser = store.get("user");
	//多语
	var i18ns = require("i18n");
	require("./agentworkapply.css");
	var flag=true;
	var template="<div class='el-agentworkapply'><div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>"+ 
 				"<div class='J-printGrid hidden'></div>"+
 				"<div class='J-form hidden'></div>"+
 				"<div class='J-form2 hidden'></div>"+
 				"<div class='container'>" +
 					"<div class='row'>"+
	 					"<div class='J-grid22 col-md-6' style='padding:0;'></div>"+
	 	 				"<div class='J-grid33 col-md-6' style='padding:0;'></div>"+
	 	 				"<div class='J-grid2 col-md-6' style='padding:0;'></div>"+
	 	 				"<div class='J-grid3 col-md-6' style='padding:0;'></div>"+
 					"</div>"+
 				"</div>";
        var agentworkapply  = ELView.extend({
        	events:{
    			"change .J-form-agentworkapply-select-agentWork":function(e){
    				var widget = this;
    				var form=widget.get("form");
    				var grid2=widget.get("grid2");
    				var grid3=widget.get("grid3");
    				var agentWork=form.getValue("agentWork");
    				aw.ajax({
						url:"api/agentwork/query",
						data:{
							pkAgentWork:agentWork,
					        fetchProperties:"pkAgentWork," +
                				"fee,"+
                				"agentFee,"+
                				"processingTime,"+
                				"agentType,"+
                				"oneSelfPapers.pkAgentPaper,"+
                				"oneSelfPapers.version,"+
                				"oneSelfPapers.papers.pkPaperType,"+
                				"oneSelfPapers.papers.name,"+
                				"agentPapers.pkAgentPaper,"+
                				"agentPapers.version,"+
                				"agentPapers.papers.pkPaperType,"+
                				"agentPapers.papers.name",
						},
						dataType:"json",
						success:function(data){
							if(data[0].fee!=null){
								form.setValue("agentWork.fee",data[0].fee);
							}
							if(data[0].agentFee!=null){
								form.setValue("agentWork.agentFee",data[0].agentFee);
							}
							if(data[0].processingTime!=null){
								form.setValue("agentWork.processingTime",data[0].processingTime);
							}
							form.setValue("agentWork.agentType.value",data[0].agentType.value);
							var gridTwoData=[];
							for(var i=0; i<data[0].oneSelfPapers.length;i++){
								var agentPaperGather={
										pkAgentPaper:data[0].oneSelfPapers[i].pkAgentPaper,
										name:data[0].oneSelfPapers[i].papers.name,
										gather:null,
								};
								gridTwoData.push(agentPaperGather);
							}
							grid2.setData(gridTwoData);
							var gridThreeData=[];
							for(var j=0; j<data[0].agentPapers.length;j++){
								var agentPaperGather={
										pkAgentPaper:data[0].agentPapers[j].pkAgentPaper,
										name:data[0].agentPapers[j].papers.name,
										gather:null, 
										};
								gridThreeData.push(agentPaperGather);
							}
							grid3.setData(gridThreeData);
						}
					});
    			},
    			"change .J-form-agentworkapply-select-member":function(e){
    				var widget = this;
    				var form=widget.get("form");
    				var member=form.getValue("member");
    				aw.ajax({
						url:"api/member/query",
						data:{
							pkMember:member,
					        fetchProperties:"personalInfo.idNumber," +
            				"personalInfo.mobilePhone",
						},
						dataType:"json",
						success:function(data){
							form.setValue("idNumber",data[0].personalInfo.idNumber);
							form.setValue("mobilePhone",data[0].personalInfo.mobilePhone);
						}
					});
    			},
    			"click .J-forShort-detail":function(ele){
    				var grid =this.get("grid");
    				var grid2 =this.get("grid2");
    				var grid3 =this.get("grid3");
    				var subnav= this.get("subnav");
    				var index = grid.getIndex(ele.target);
    				var data = grid.getSelectedData(index);
    				var form1= this.get("form");
    				form1.setData(data);
    				form1.setDisabled(true);
    				var oneSelfWorkGather=[];
    				var agentWorkGather=[];
    				for(var i=0;i<data.oneSelfWorkGather.length;i++){
    					if(data.oneSelfWorkGather[i].agentPaper.paperSource.key=="oneself"){
    						oneSelfWorkGather.push({name:data.oneSelfWorkGather[i].agentPaper.papers.name,gather:data.oneSelfWorkGather[i].gather});
    						
    					}
    					if(data.oneSelfWorkGather[i].agentPaper.paperSource.key=="agent"){
    						agentWorkGather.push({name:data.oneSelfWorkGather[i].agentPaper.papers.name,gather:data.oneSelfWorkGather[i].gather});
    						
    					}					
				}
				form1.setValue("mobilePhone",data.member.personalInfo.mobilePhone);
				form1.setValue("idNumber",data.member.personalInfo.idNumber);
				grid2.setData(oneSelfWorkGather);
				grid3.setData(agentWorkGather);
				subnav.hide(["add","time","status","agentwork","search","building","print"]).show(["return",]);
				this.hide([".J-grid"]).show([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-form"]);        							
				}
    	},

            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:"代办事项申请",
        					search : function(str) {
        						var g=widget.get("grid");
        						g.loading();
        						aw.ajax({
        							url:"api/agentworkapply/search",
        							data:{
        								s:str,
        								searchProperties:"member.memberSigning.room.number,"+
        						          "member.personalInfo.name,"+
        						          "agentWork.fullName",
        						        fetchProperties:"pkAgentWorkApply," +
                                		"agentWork.pkAgentWork,"+
                        				"agentWork.workNO," +
                        				"agentWork.fullName," +
                        				"member.pkMember," +
                        				"member.memberSigning.room.number,"+
                        				"member.personalInfo.pkPersonalInfo,"+
                        				"member.personalInfo.name," +
                        				"member.personalInfo.idNumber," +
                        				"member.personalInfo.mobilePhone,"+
                        				"applyDate," +
                        				"applicant,"+
                        				"agentWorkProcess.pkAgentWorkProcess,"+
                        				"agentWorkProcess.transactDate,"+
                        				"agentWork.fee,"+
                        				"agentWork.agentFee,"+
                        				"agentWork.processingTime,"+
                        				"agentWork.setUser.name,"+
                        				"agentWork.agentType,"+
                        				"agentWork.agent,"+
                        				"status.display,"+
                        				"oneSelfWorkGather.pkAgentPaperGather,"+
                        				"oneSelfWorkGather.gather,"+
                        				"oneSelfWorkGather.version,"+
                        				"oneSelfWorkGather.agentPaper.pkAgentPaper,"+
                        				"oneSelfWorkGather.agentPaper.version,"+
                        				"oneSelfWorkGather.agentPaper.paperSource,"+
                        				"oneSelfWorkGather.agentPaper.papers.pkPaperType,"+
                        				"oneSelfWorkGather.agentPaper.papers.name,"+
                        				"description,"+
                        		        "version",                     		
        							},
        							dataType:"json",
        							success:function(data){
        								g.setData(data);
        								
        							}
        						});
        					},
        					buttonGroup:[{
            					id:"agentwork",
            					tip:"办理事项",
            					url:"api/agentwork/query",
            					params: function(){
        							return{
        								"statusIn":"InUse",
        								fetchProperties:"pkAgentWork,fullName",	
        							}
        						},
            					key:"pkAgentWork",
                                value:"fullName",
                                showAll:true,
        						showAllFirst:true,
        						handler:function(key,element){
        							widget.get("grid").refresh()
        						}
            				},{
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
        						url:"api/enum/com.eling.elcms.agent.model.AgentWorkApply.Status",
        						handler:function(){
        							widget.get("grid").refresh();
        						}
        					}],
        					time:{
        						tip:"申请时间",
        						ranges:{
        							"本月": [moment().subtract("month").startOf("month"),moment().subtract("month").endOf("month")],
        							"上月": [moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")],
        						},
        						defaultTime:"今年",
        						click:function(time){
        							widget.get("grid").refresh();
        						}
        					},
        					buttons:[{
        						id:"print",
        						text:"打印",
        						show:true,
        						handler:function(){	
        							var subnav=widget.get("subnav");
        							subnav.hide(["add","building","status","agentwork","time","search","print"]);
        							widget.hide([".J-grid"]).show([".J-printGrid"]);
        							var data=widget.get("grid").getData();
        							widget.get("printGrid").setData(data);
        							widget.get("subnav").setTitle("代办申请");
        							window.print();
        							subnav.show(["add","building","status","agentwork","time","search","print"]);
        							widget.hide([".J-printGrid"]).show([".J-grid"]);
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
        							subnav.hide(["return","save"]).show(["add","time","status","agentwork","building","search","print"]);
        						}
        					},{
        						id:"add",
        						text:"新增",
        						handler:function(){
        							var grid2 =widget.get("grid2");
        		    				var grid3 =widget.get("grid3");
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form.reset();
        							subnav.hide(["add","time","status","agentwork","building","search","print"]).show(["return","save"]);
        							widget.hide([".J-grid"]).show([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-form"]);
        						}
        					},{
        						id:"save",
        						text:"保存",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var data= form.getData();
        							if(!data.agentWork){
        								Dialog.alert({
        									content : "请选择待办事项!"
        								 });
        								return false;
        							}
        							if(!data.member){
        								Dialog.alert({
        									content : "请选择"+i18ns.get("sale_ship_owner","会员")+"!"
        								 });
        								return false;
        							}
        							var data2=widget.get("grid2").getData();
        							var data3=widget.get("grid3").getData();
        							var oneSelfWorkGatherList=[];
        							var agentWorkGatherList=[];
        							for(var i=0; i<data2.length;i++){
    									var agentPaperGather={
    											agentPaper:data2[i].pkAgentPaper,
    											gather:true,
    									};
    									oneSelfWorkGatherList.push(agentPaperGather);
        							}
        							for(var i=0; i<data3.length;i++){
    									var agentPaperGather={
    											agentPaper:data3[i].pkAgentPaper,
    											gather:true,
    									};
    									agentWorkGatherList.push(agentPaperGather);
        							}
            							$(".J-oneself").each(function(index,element){ 
            								if(element.checked==true){
            									oneSelfWorkGatherList[index].gather=true;
            								}else{
            									oneSelfWorkGatherList[index].gather=false;
            								}
            							}) 
            							data.oneSelfWorkGatherList=oneSelfWorkGatherList;
               							$(".J-agent").each(function(index,element){ 
            								if(element.checked==true){
            									agentWorkGatherList[index].gather=true;
            								}else{
            									agentWorkGatherList[index].gather=false;
            								}
            							}) 
            							data.agentWorkGatherList=agentWorkGatherList;
        							
           							data.applicant=activeUser.pkUser;
           							data.status="Initial";
           							data.idNumber=null;
           							data.mobilePhone=null;
        							aw.saveOrUpdate("api/agentworkapply/save",aw.customParam(data),function(data){
                									widget.get("grid").refresh();
                	        					});
        							var subnav= widget.get("subnav");
        							form.reset();
        							widget.hide([".J-form",".J-grid22",".J-grid33",".J-grid2",".J-grid3"]).show([".J-grid"]);
        							subnav.hide(["return","save"]).show(["add","time","status","agentwork","building","search","print"]);
        						}
        					}],
        				}
    				});
        			this.set("subnav",subnav);
        			var printGrid=new Grid({
        				parentNode:".J-printGrid",
        				autoRender:false,
        				isInitPageBar:false,
        				 model:{
                             columns:[{
                             	key:"agentWork",
         						name:"办理事项",
         						format:function(row,value){
         							var agentWork=row;
     								return row.workNO+row.fullName;
     								
     							},
                             },{
             					key:"member",
         						name:i18ns.get("sale_ship_owner","会员"),
         						format:function(row,value){
     								return "<a href='javascript:void(0);' style='color:red;' class='J-forShort-detail'  >"+value.member.memberSigning.room.number+value.member.personalInfo.name+"</a>";
     							},
         					},{
             					key:"member.personalInfo.mobilePhone",
         						name:"联系方式"
         					},{
             					key:"applyDate",
         						name:"申请日期",
         						format:"date",
         					},{
             					key:"agentWorkProcess.transactDate",
         						name:"办理日期",
         						format:"date",
         					},{
             					key:"status.value",
         						name:"办理状态"
         					},{
             					key:"applicant.name",
         						name:"申请人"
         					}]
         				}
        			});
        			widget.set("printGrid",printGrid);	
                    var grid=new Grid({
                    	parentNode:".J-grid",
                    	url : "api/agentworkapply/query",
                    	params:function(){
                    		var subnav=widget.get("subnav");
                    		var time=subnav.getValue("time");
                    		return {
                    			"agentWork.pkAgentWork":subnav.getValue("agentwork"),
                    			"member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
                    			status:subnav.getValue("status"),
                    			applyDate:time.start,
                    			applyDateEnd:time.end,
                        		fetchProperties:"pkAgentWorkApply," +
                        		"agentWork.pkAgentWork,"+
                				"agentWork.workNO," +
                				"agentWork.fullName," +
                				"member.pkMember," +
                				"member.memberSigning.room.number,"+
                				"member.personalInfo.pkPersonalInfo,"+
                				"member.personalInfo.name," +
                				"member.personalInfo.idNumber," +
                				"member.personalInfo.mobilePhone,"+
                				"applyDate," +
                				"applicant,"+
                				"agentWorkProcess.pkAgentWorkProcess,"+
                				"agentWorkProcess.transactDate,"+
                				"agentWork.fee,"+
                				"agentWork.agentFee,"+
                				"agentWork.processingTime,"+
                				"agentWork.setUser.name,"+
                				"agentWork.agentType,"+
                				"agentWork.agent,"+
                				"status.display,"+
                				"oneSelfWorkGather.pkAgentPaperGather,"+
                				"oneSelfWorkGather.gather,"+
                				"oneSelfWorkGather.version,"+
                				"oneSelfWorkGather.agentPaper.pkAgentPaper,"+
                				"oneSelfWorkGather.agentPaper.version,"+
                				"oneSelfWorkGather.agentPaper.paperSource,"+
                				"oneSelfWorkGather.agentPaper.papers.pkPaperType,"+
                				"oneSelfWorkGather.agentPaper.papers.name,"+
                				"description,"+
                		        "version",                    		
                		    };
                    	},
                        model:{
                            columns:[{
                            	key:"agentWork",
        						name:"办理事项",
        						format:function(row,value){
        							var agentWork=row;
    								return row.workNO+row.fullName;
    								
    							},
                            },{
            					key:"member",
        						name:i18ns.get("sale_ship_owner","会员"),
        						format:function(row,value){
    								return "<a href='javascript:void(0);' style='color:red;' class='J-forShort-detail'  >"+value.member.memberSigning.room.number+value.member.personalInfo.name+"</a>";
    							},
        					},{
            					key:"member.personalInfo.mobilePhone",
        						name:"联系方式"
        					},{
            					key:"applyDate",
        						name:"申请日期",
        						format:"date",
        					},{
            					key:"agentWorkProcess.transactDate",
        						name:"办理日期",
        						format:"date",
        					},{
            					key:"status.value",
        						name:"办理状态"
        					},{
            					key:"applicant.name",
        						name:"申请人"
        					},{
        						key:"operate",
        						className:"operate",
        						name:"操作",
        						format:"button",
        						formatparams:[{
        							key:"edit",
        							text:"修改",
        							show:function(value,row){
        								if(row.status.key=='Transacting'||row.status.key=='Ended'){
        									return false;
        								}
        								if(row.status.key=='Initial'){
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
	        							for(var i=0;i<data.oneSelfWorkGather.length;i++){
	        								if(data.oneSelfWorkGather[i].agentPaper.paperSource.key=="oneself"){
	        									oneSelfWorkGather.push({name:data.oneSelfWorkGather[i].agentPaper.papers.name,gather:data.oneSelfWorkGather[i].gather,pkAgentPaper:data.oneSelfWorkGather[i].agentPaper.pkAgentPaper,version:data.oneSelfWorkGather[i].agentPaper.version});
	        								}
	        							}
	        							for(var i=0;i<data.oneSelfWorkGather.length;i++){
	        								if(data.oneSelfWorkGather[i].agentPaper.paperSource.key=="agent"){
	        									agentWorkGather.push({name:data.oneSelfWorkGather[i].agentPaper.papers.name,gather:data.oneSelfWorkGather[i].gather,pkAgentPaper:data.oneSelfWorkGather[i].agentPaper.pkAgentPaper,version:data.oneSelfWorkGather[i].agentPaper.version});
	        								}
	        							}
	        							grid2.setData([]);
	        							grid3.setData([]);
	        							grid2.setData(oneSelfWorkGather);
	        							grid3.setData(agentWorkGather);
	        							form.reset();
										form.setData(data);
										form.setValue("mobilePhone",data.member.personalInfo.mobilePhone);
										form.setValue("idNumber",data.member.personalInfo.idNumber);
										subnav.hide(["add","time","status","agentwork","search","building","print"]).show(["return","save",]);
	        							widget.hide([".J-grid"]).show([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-form"]);        							
	        						}
        						},{
        							key:"commit",
        							text:"提交",
        							show:function(value,row){
        								if(row.status.key=='Transacting'||row.status.key=='Ended'){
        									return false;
        								}
        								if(row.status.key=='Initial'){
        									return true;
        								}else{
        									return false;
        								}        								
        							},
        							handler:function(index,data,rowEle){
        								Dialog.confirm({
        									title:"提示",
        									content:"是否提交申请？",
        									confirm:function(){
//        										for(var i=0;i<data.oneSelfWorkGather.length;i++){
//        											if(data.oneSelfWorkGather[i].gather==false){
//        												Dialog.alert({
//        													content : "材料未收取齐全！"
//        												});
//        												$(".el-dialog-mask")[$(".el-dialog-mask").length-1].remove();
//        												return false;
//        											}
//        										}
        										var statusData={};
        										statusData.pkAgentWorkApply=data.pkAgentWorkApply;
        										statusData.status='Commited';
        										statusData.version=data.version;
        										aw.saveOrUpdate("api/agentworkapply/saveStatus",aw.customParam(statusData),function(data){
        											widget.get("grid").refresh();
        										});
        									}
        								});
        							}
        						},{
        							key:"takeback",
        							text:"收回",
        							show:function(value,row){
        								if(row.status.key=='Transacting'||row.status.key=='Ended'){
        									return false;
        								}
        								if(row.status.key=='Commited'){
        									return true;
        								}else{
        									return false;
        								}
        							},
        							handler:function(index,data,rowEle){
        								Dialog.confirm({
        									title:"提示",
        									content:"是否收回当前代办请求？",
        									confirm:function(){
        										var statusData={};
        										statusData.pkAgentWorkApply=data.pkAgentWorkApply;
        										statusData.status='Initial';
        										statusData.version=data.version;
                								aw.saveOrUpdate("api/agentworkapply/saveStatus",statusData,function(data){
                	        						widget.get("grid").refresh();
                	        					});
        									}
        								});
        							}
        						},{
        							key:"delete",	
        							icon:"remove",
        							show:function(value,row){
        								if(row.status.key=='Transacting'||row.status.key=='Ended'){
        									return false;
        								}
        								if(row.status.key=='Commited'){
        									return false;
        								}
        								if(row.status.key=="Initial"){
        									return true;
        								}
        							},
        							handler:function(index,data,rowEle){
    									aw.del("api/agentworkapply/" + data.pkAgentWorkApply + "/delete",function(){
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
        				cancelaction:function(){
        					widget.show([".J-grid"]).hide([".J-from"]);
        					widget.get("form").reset();
        				},
        				model:{
        					id:"agentworkapply",
        					defaultButton:false,
        					items:[{
        						name:"pkAgentWorkApply",
        						type:"hidden",
        					},{
        						name:"agentWork",
        						label:"代办事项",
								url:"api/agentwork/query",
        						params:function(){
        							return {
        								status:"InUse",
        								fetchProperties:"pkAgentWork,workNO,fullName"
        							};
        						},
        						key:"pkAgentWork",
        						value:"workNO,fullName",
        						type:"select",
             					validate:["required"],
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "member",
								label : i18ns.get("sale_ship_owner","会员"),
								key:"pkMember",
								value :"personalInfo.name,memberSigning.room.number",
								url:"api/member/query",
								params:function(){
									return {
										"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
										fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
									};
								},
								type:"select",
								validate:["required"],
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "idNumber",
								label : "证件号",
								readonly:true,
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "mobilePhone",
								label : "联系方式",
								readonly:true,
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"applyDate",	
        						label:"申请日期",
        						type:"date",
    							mode:"Y-m-d",
    							defaultValue:moment().valueOf(),
    							validate : [ "required" ]
							    
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWork.fee",
								label : "办理费",
								readonly:true,
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWork.agentFee",
								label : "代办费",
								readonly:true,
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWork.processingTime",
								label : "办理时限(工作日)",
								readonly:true,
							},{
								className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"agentWork.applicant.name",	
        						label:"申请人",
        						defaultValue:activeUser.name,
             					validate:["required"],
             					readonly:true,
							},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "agentWork.agentType.value",
								label : "代办形式",
								readonly:true,
							},{
								className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name :"status.value",
								label:"办理状态",
								defaultValue:"初始",
								readonly:true,
							},{
								name : "description",
								label : "说明",
							    
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
        								return "<input  type='checkbox' class='J-oneself' checked='true'  >";
        							}else{
        								return "<input  type='checkbox' class='J-oneself'   >";
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
        								return "<input  type='checkbox' class='J-agent' checked='true'  >";
        							}else{
        								return "<input  type='checkbox' class='J-agent' >";
        							}
    							},
        					}]
        				}
                    });
                    this.set("grid3",grid3);
                },
                afterInitComponent:function(params,widget){
                	widget.hide([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-from2"]).show([".J-grid"]);
        		}
        });
        module.exports = agentworkapply ;
});