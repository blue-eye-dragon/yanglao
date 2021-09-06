define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Form=require("form");
	var store = require("store");
	var activeUser = store.get("user");
	var oneSelfPkAgentPapers=[];
	var oneSelfVersions=[];
	var agentPkAgentPapers=[];
	var agentVersions=[];
	//多语
	var i18ns = require("i18n");
	var template="<div class='el-agentworkapplyprocess'>"+ 
 					"<div class='J-subnav'></div>"+
 					"<div class='J-printGrid hidden'></div>"+
 					"<div class='J-grid'></div>"+ 
 					"<div class='J-form hidden'></div>"+ 
 				"</div>";
	var agentworkapplyprocess  = ELView.extend({
		events:{
			"change .J-form-agentworkapply-date-agentWorkProcess-transactDate":function(ele){
				var form=this.get("form");
				var transactDate=form.getValue("agentWorkProcess.transactDate");
				var days=form.getValue("agentWork.processingTime");
				if(days==""){
					days=0;
				}
				if(transactDate==""){
					var transactDate=moment().valueOf();
				}
				aw.ajax({
					url:"api/agentworkapply/getDate",
					data:{
						transactDate:transactDate,
						days:days,
					},
					dataType:"json",
					success:function(data){
						form.setValue("agentWorkProcess.expectedCompletionDate",data);
					}
				});
			},
			"click .J-forShort-detail":function(ele){
				var grid =this.get("grid");
				var subnav= this.get("subnav");
				var index = grid.getIndex(ele.target);
				var data = grid.getSelectedData(index);
				var form= this.get("form");
				form.setData(data);
				form.setDisabled(true);
				var oneSelfWorkGather=[];
				var agentWorkGather=[];
				var  agentWork=data.agentWork.workNO+data.agentWork.fullName;
				for(var i=0;i<data.oneSelfWorkGather.length;i++){
					if(data.oneSelfWorkGather[i].agentPaper.paperSource.key=="oneself"){
						oneSelfWorkGather.push({name:data.oneSelfWorkGather[i].agentPaper.papers.name});						
					}
					if(data.oneSelfWorkGather[i].agentPaper.paperSource.key=="agent"){
						agentWorkGather.push({name:data.oneSelfWorkGather[i].agentPaper.papers.name,});						
					}
				}
				var oneselfPapers=""; 
				var agentPapers="";
				for(var i=0;i<oneSelfWorkGather.length;i++){
					if(i<data.oneSelfWorkGather.length-1){
						oneselfPapers+= oneSelfWorkGather[i].name+"、";
					}else{
						oneselfPapers+= oneSelfWorkGather[i].name;
					}
				}
				for(var i=0;i<agentWorkGather.length;i++){
					if(i<agentWorkGather.length-1){
						agentPapers+=agentWorkGather[i].name+"、";
					}else{
						agentPapers+=agentWorkGather[i].name;
					}
				}
				form.setValue("oneSelfPapers",oneselfPapers);
				form.setValue("agentPapers",agentPapers);
				form.setValue("workNOfullName",agentWork);
				form.setData("status",[{
					key : "Ended",
					value : "办理完成"
				},{
					key : "Transacting",
					value : "办理中"
				},{
					key : "Commited",
					value : "已提交"
				}]);
				form.setValue("status",data.status.key);
				subnav.hide(["time","status","agentwork","print","building"]).show(["return"]);
				this.hide([".J-grid"]).show([".J-form"]);        							
			},
			"change .J-form-agentworkapply-select-agentWorkProcess-remind":function(ele){
				var form=this.get("form");
				var remind=form.getValue("agentWorkProcess.remind");
				if(remind=="false"){
					form.setValue("agentWorkProcess.numOfAdvanceRemindDays","");
					form.setValue("agentWorkProcess.remindContent","");
					form.setReadonly(["agentWorkProcess.numOfAdvanceRemindDays","agentWorkProcess.remindContent"],true);
				}else{
					form.setReadonly(["agentWorkProcess.numOfAdvanceRemindDays","agentWorkProcess.remindContent"],false);
				}
			},
		},
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"代办事项处理",
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
						tip : "状态查询",
						items:[{
							key:"Transacting,Commited,Ended",
							value:"全部"
						},{
							key:"Commited",
							value:"已提交"
						},{
							key:"Transacting",
							value:"办理中"
						},{
							key:"Ended",
							value:"办理完成"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
					time:{
						tip:"申请日期",
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
							subnav.hide(["status","agentwork","time","print","building"]);
							widget.hide([".J-grid"]).show([".J-printGrid"]);
							var data=widget.get("grid").getData();
							widget.get("printGrid").setData(data);
							widget.get("subnav").setTitle("代办事项处理");
							window.print();
							subnav.show(["status","agentwork","time","print"]);
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
							widget.hide([".J-form"]).show([".J-grid"]);
							subnav.hide(["return"]).show(["time","status","print","agentwork","building"]);
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
							return "<a href='javascript:void(0);' style='color:red;' class='J-forShort-detail'  >"+value.agentWork.workNO+value.agentWork.fullName+"</a>";
							
						},
					},{
						key:"agentWorkProcess.transactDate",
						name:"办理日期",
						format:"date",
					},{
						key:"applyDate",
						name:"申请日期",
						format:"date",
					},{
						key:"agentWorkProcess.processUser.name",
						name:"办理人"
					},{
						key:"status.value",
						name:"状态",
					},{
						key:"agentWorkProcess.remindDate",
						name:"提醒日期",
						format:"date",
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
						"statusIn":subnav.getValue("status"),
						"applyDate":time.start,
						"applyDateEnd":time.end,
						"agentWork.pkAgentWork":subnav.getValue("agentwork"),
						"member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						fetchProperties:"pkAgentWorkApply," +
						"agentWork.pkAgentWork,"+
						"agentWork.workNO," +
						"agentWork.fullName," +
						"applicant.name,"+
						"member.pkMember," +
						"member.memberSigning.room.number,"+
						"member.personalInfo.name," +
						"member.personalInfo.idNumber," +
						"member.personalInfo.mobilePhone,"+
						"applyDate," +
						"applicant,"+
						"agentWorkProcess.pkAgentWorkProcess,"+
						"agentWork.fee,"+
						"agentWork.agentFee,"+
						"agentWork.processingTime,"+
						"agentWork.setUser.name,"+
						"agentWork.agentType,"+
						"agentWork.agent,"+
						"status," +
						"oneSelfWorkGather.pkAgentPaperGather,"+
						"oneSelfWorkGather.gather,"+
						"oneSelfWorkGather.version,"+
						"oneSelfWorkGather.agentPaper.pkAgentPaper,"+
						"oneSelfWorkGather.agentPaper.version,"+
						"oneSelfWorkGather.agentPaper.paperSource,"+
						"oneSelfWorkGather.agentPaper.papers.pkPaperType,"+
						"oneSelfWorkGather.agentPaper.papers.name,"+
						"agentWorkProcess.transactDate,"+
						"agentWorkProcess.transactionResult,"+
						"agentWorkProcess.processUser.pkUser,"+
						"agentWorkProcess.processUser.name,"+
						"agentWorkProcess.remindDate,"+
						"agentWorkProcess.backReason,"+
						"agentWorkProcess.remind,"+
						"agentWorkProcess.expectedCompletionDate,"+
						"agentWorkProcess.numOfAdvanceRemindDays,"+
						"agentWorkProcess.remindContent,"+
						"agentWorkProcess.description,"+
						"agentWorkProcess.version," +
						"version",                    		
					};
				},
				model:{
					columns:[{
						key:"agentWork",
						name:"办理事项",
						format:function(row,value){
							var agentWork=row;
							return "<a href='javascript:void(0);' style='color:red;' class='J-forShort-detail'  >"+value.agentWork.workNO+value.agentWork.fullName+"</a>";
						},
					},{
						key:"memberRoom",
						name:"会员",
						format:function(value,row){
							return row.member.memberSigning.room.number+" "+row.member.personalInfo.name;
						}
					},{
						key:"agentWorkProcess.transactDate",
						name:"办理日期",
						format:"date",
					},{
						key:"applyDate",
						name:"申请日期",
						format:"date",
					},{
						key:"agentWorkProcess.processUser.name",
						name:"办理人"
					},{
						key:"status.value",
						name:"状态",
					},{
						key:"agentWorkProcess.remindDate",
						name:"提醒日期",
						format:"date",
					},{
						key:"operate",
						className:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"处理",
							show:function(value,row){
								if(row.status.key=='Ended'){
									return false;
								}else{
									return true;
								}
							},
							handler:function(index,data,rowEle){
								var form= widget.get("form");
								var subnav= widget.get("subnav");
								form.reset();
								form.setData(data);
								if(data.agentWorkProcess==null){
									form.setValue("agentWorkProcess.remind","false");
								}
								var  agentWork=data.agentWork.workNO+" "+data.agentWork.fullName;
								var oneSelfWorkGather=[];
								var agentWorkGather=[];
								for(var i=0;i<data.oneSelfWorkGather.length;i++){
									if(data.oneSelfWorkGather[i].agentPaper.paperSource.key=="oneself"){
										oneSelfWorkGather.push({name:data.oneSelfWorkGather[i].agentPaper.papers.name});
									}
									if(data.oneSelfWorkGather[i].agentPaper.paperSource.key=="agent"){
										agentWorkGather.push({name:data.oneSelfWorkGather[i].agentPaper.papers.name,});
									}
								}
								var oneselfPapers=""; 
								var agentPapers="";
								for(var i=0;i<oneSelfWorkGather.length;i++){
									if(i<data.oneSelfWorkGather.length-1){
										oneselfPapers+= oneSelfWorkGather[i].name+"、";
									}else{
										oneselfPapers+= oneSelfWorkGather[i].name;
									}
								}
								for(var i=0;i<agentWorkGather.length;i++){
									if(i<agentWorkGather.length-1){
										agentPapers+=agentWorkGather[i].name+"、";
									}else{
										agentPapers+=agentWorkGather[i].name;
									}
								}
								if(data.agentWorkProcess!=null){
									if(data.agentWorkProcess.transactDate!=null){
										var transactDate=data.agentWorkProcess.transactDate;
									}else{
										var transactDate=moment().valueOf();
									}
								}else{
									var transactDate=moment().valueOf();
								}
								var days=data.agentWork.processingTime;
								if(days==null){
									days=0;
								}
								
								if(data.agentWorkProcess!=null){
									if(data.agentWorkProcess.expectedCompletionDate==null){
										aw.ajax({
											url:"api/agentworkapply/getDate",
											data:{
												transactDate:transactDate,
												days:days,
											},
											dataType:"json",
											success:function(data){
												form.setValue("agentWorkProcess.expectedCompletionDate",data);
											}
										});
									}					        				
								}					        			
								if(data.status.key=="Commited"){
									form.setData("status",[{
										key : "Transacting",
										value : "开始办理"
									},{
										key : "Initial",
										value : "退回"
									},{
										key : "Commited",
										value : "已提交"
									}]);
									form.setValue("status","Commited");
								}
								if(data.status.key=="Transacting"){
									form.setData("status",[{
										key : "Ended",
										value : "办理完成"
									},{
										key : "Transacting",
										value : "办理中"
									},{
										key : "Initial",
										value : "退回"
									}]);
									form.setValue("status","Transacting");
								}
								if(data.status.key=="Ended"){
									form.setData("status",[{
										key : "Ended",
										value : "办理完成"
									}]);
									form.setValue("status","Ended");
								}
								var remind=form.getValue("agentWorkProcess.remind");
								if(remind=="false"){
									form.setReadonly(["agentWorkProcess.numOfAdvanceRemindDays","agentWorkProcess.remindContent"],true);
								}else{
									form.setReadonly(["agentWorkProcess.numOfAdvanceRemindDays","agentWorkProcess.remindContent"],false);
								}
								form.setValue("workNOfullName",agentWork);
								form.setValue("oneSelfPapers",oneselfPapers);
								form.setValue("agentPapers",agentPapers);
								subnav.hide(["time","status","print","agentwork","building"]).show(["return"]);
								widget.hide([".J-grid"]).show([".J-form"]);        							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form=new Form({
				parentNode:".J-form",
				model:{
					id:"agentworkapply",
					saveaction:function(){
						var form=widget.get("form");
						var status = form.getValue("status");
						if(status=="Transacting"){
							if(form.getValue("agentWorkProcess.transactDate") == "" || form.getValue("agentWorkProcess.processUser")==""){
								Dialog.alert({
									content : "请选择办理日期和办理人!"
								 });
								return false;
							}
						}else if(status=="Initial"){
							if(form.getValue("agentWorkProcess.backReason") == ""){
								Dialog.alert({
									content : "请填写退回原因!"
								 });
								return false;
							}
						}
						var remind = form.getValue("agentWorkProcess.remind");
						if(remind=="true"){
							if(form.getValue("agentWorkProcess.numOfAdvanceRemindDays") == "" || form.getValue("agentWorkProcess.remindContent")==""){
								Dialog.alert({
									content : "请填写提前提醒天数和提醒内容!"
								});
								return false;
							}
						}
						var version = form.getValue("agentWorkProcess.version");
						if(version==""){
							form.setValue("agentWorkProcess.version",0);
						}
						var data=form.getData();	
						aw.saveOrUpdate("api/agentworkapplyprocess/save",aw.customParam(data),function(data){
							widget.get("grid").refresh();
						});
						widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("form").reset();
						widget.get("subnav").hide(["return"]).show(["time","status","print","agentwork","building"]);
					},
					cancelaction:function(){
						widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("form").reset();
						widget.get("subnav").hide(["return"]).show(["time","status","print","agentwork","building"]);
					},
					items:[{
						name:"pkAgentWorkApply",
						type:"hidden"
					},{
						id:"agentWork",
						name:"agentWork.pkAgentWork",
						type:"hidden"
					},{
						name:"workNOfullName",
						label:"代办事项",
						value:"agentWork.workNO+agentWork.fullName",
						readonly:true
					},{
						id:"member",
						name : "member.personalInfo.name",
						label : i18ns.get("sale_ship_owner","会员")+"名称",
						readonly:true
					},{
						id:"applicant",
						name : "applicant.name",
						label : "申请人",
						readonly:true
					},{
						name:"applyDate",	
						label:"申请日期",
						type:"date",
						readonly:true,
						validate:["required"]
					},{
						id:"agentWorkProcess",
						name : "agentWorkProcess.processUser",
						label : "办理人",
						key:"pkUser",    							
						value:"name",
						url:"api/users",
						params:{
							fetchProperties:"pkUser,name"
						},
						type:"select"
					},{
						id:"agentWorkProcess",
						name :"agentWorkProcess.transactDate",
						label : "办理日期",
						defaultDate:new Date(moment().valueOf()),
						type:"date"
					},{
						name :"status",
						label :"办理状态",
						type:"select",
						validate:["required"]
					},{
						name:"oneSelfPapers",	
						label:"本人材料",
						readonly:true
					},{
						name : "agentPapers",
						label : "代办人材料",
						readonly:true
					},{
						id:"agentWorkProcess",//此处各字段的ID相同，是为了保存数据时区分属性
						name :"agentWorkProcess.expectedCompletionDate",
						label:"预计完成日期",
						type:"date",
						validate:["required"]
					},{
						id:"agentWorkProcess",
						name : "agentWorkProcess.remind",
						label : "是否提醒",
						type:"select",
						options:[{
							key:"true",
							value:"是"
						},{
							key:"false",
							value:"否"
						}],
						defaultValue:"false"
					},{
						id:"agentWorkProcess",
						name : "agentWorkProcess.numOfAdvanceRemindDays",
						label : "提前提醒天数",
						readonly:true
					},{
						id:"agentWorkProcess",
						name : "agentWorkProcess.remindContent",
						label : "提醒内容",
						readonly:true
					},{
						id:"agentWorkProcess",
						name : "agentWorkProcess.backReason",
						label : "退回原因"
					},{
						id:"agentWorkProcess",
						name : "agentWorkProcess.description",
						label : "说明"
					},{
						id:"agentWorkProcess",
						name :"agentWork.processingTime",
						type:"hidden"
					},{
						name :"version",
						defaultValue:0,
						type:"hidden"
					},{
						id:"agentWorkProcess",
						name :"agentWorkProcess.version",
						defaultValue:0,
						type:"hidden"
					},{
						id:"agentWorkProcess",
						name :"agentWorkProcess.pkAgentWorkProcess",
						type:"hidden"
					}]
				}
			});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			widget.hide([".J-grid2",".J-grid22",".J-grid3",".J-grid33",".J-from2"]).show([".J-grid"]);
			var subnav=widget.get("subnav");
			var time=subnav.getValue("time");
			var grid=widget.get("grid");
			if(params!=null){
				if(params.pkAgentWorkPaper!=null){
					aw.ajax({
						url:"api/agentworkapply/getDate",
						data:{
							"agentWork.pkAgentWork":subnav.getValue("agentwork"),
							pkAgentWorkPaper:params.pkAgentWorkPaper,
							fetchProperties:"pkAgentWorkApply," +
							"agentWork.pkAgentWork,"+
							"agentWork.workNO," +
							"agentWork.fullName," +
							"member.pkMember," +
							"member.memberSigning.room.number,"+
							"member.personalInfo.name," +
							"member.personalInfo.idNumber," +
							"member.personalInfo.mobilePhone,"+
							"applyDate," +
							"applicant,"+
							"agentWorkProcess.pkAgentWorkProcess,"+
							"agentWork.fee,"+
							"agentWork.agentFee,"+
							"agentWork.processingTime,"+
							"agentWork.setUser.name,"+
							"agentWork.agentType,"+
							"agentWork.agent,"+
							"status," +
							"oneSelfWorkGather.pkAgentPaperGather,"+
							"oneSelfWorkGather.gather,"+
							"oneSelfWorkGather.version,"+
							"oneSelfWorkGather.agentPaper.pkAgentPaper,"+
							"oneSelfWorkGather.agentPaper.version,"+
							"oneSelfWorkGather.agentPaper.paperSource,"+
							"oneSelfWorkGather.agentPaper.papers.pkPaperType,"+
							"oneSelfWorkGather.agentPaper.papers.name,"+
							"agentWorkGather.pkAgentPaperGather,"+
							"agentWorkGather.gather,"+
							"agentWorkGather.version,"+
							"agentWorkGather.agentPaper.pkAgentPaper,"+
							"agentWorkGather.agentPaper.version,"+
							"agentWorkGather.agentPaper.paperSource,"+
							"agentWorkGather.agentPaper.papers.pkPaperType,"+
							"agentWorkGather.agentPaper.papers.name,"+
							"agentWorkProcess.transactDate,"+
							"agentWorkProcess.transactionResult,"+
							"agentWorkProcess.processUser.pkUser,"+
							"agentWorkProcess.processUser.name,"+
							"agentWorkProcess.remindDate,"+
							"agentWorkProcess.backReason,"+
							"agentWorkProcess.remind,"+
							"agentWorkProcess.expectedCompletionDate,"+
							"agentWorkProcess.numOfAdvanceRemindDays,"+
							"agentWorkProcess.remindContent,"+
							"agentWorkProcess.version," +
							"version",                    		
							
						},
						dataType:"json",
						success:function(data){
							grid.setData(data);
						}
					});
					
					
				}
				
			}
		}
	});
        module.exports = agentworkapplyprocess ;
});