  define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Grid = require("grid");
	var Form=require("form-2.0.0")
	var ELView=require("elview"); 
	var store = require("store");
	var activeUser = store.get("user").pkUser;
	var emnu = require("enums");
	
	require("./approvalUtils.css");
	var approvalUtils = ELView.extend({
		attrs : {
			parentNode : ".J-approval"
		},
		events : {
			"click .J-abandonApproval":function(e){
				var appgrid=this.get("appgrid");
				var index=appgrid.getIndex(e.target);
				var data=appgrid.getSelectedData(index);
				Dialog.confirm({
					setStyle:function(){},
					content:"确认弃审？",
					confirm:function(){
						aw.ajax({
							url:"api/approval/abandonapproval",
							data:{
								pkApprovalProcess:data.pkApprovalProcess,
							},
							dataType:"json",
							success:function(data){
								appgrid.refresh();
							}
						});
					}
				});
			}
		},
		getDatasBySeq:function(seq,datas){
			var apps =[];
			for ( var  i in datas) {
				if(datas[i].sequenceNumber == seq){
					apps.push(datas[i]);
				}
			}
			return apps
		},
        initComponent:function(params,widget){
        	var appgrid =  new Grid({
    			parentNode:widget.get("parentNode"),
    			autoRender:false,
 				url :"api/approvalprocess/query", 
 				params:function(){
 					var param = widget.get("param");
 					return { 
 						"approvalInstance.approvalDefine.serviceType":param.serviceType,
 						"approvalInstance.modelId":param.modelId,
 						"orderString":"approvalInstance.createTime,sequenceNumber,pkApprovalProcess",
 						fetchProperties:"sequenceNumber," +
 								"checkTime," +
 								"commitTime," +
 								"checker.name," +
 								"checker.pkUser," +
 								"checker.duty," +
 								"agent," +
 								"note," +
 								"agentChecker.name," +
 								"agentChecker.pkUser," +
 								"status," +
 								"pkApprovalProcess," +
 								"version",
					}; 
				},
 				model:{
 					columns:[{
 						name:"sequenceNumber",
 						label:"审批次序",
 						className:"grid8"
 					},{
 						name:"checkTime",
 						label:"时间",
 						format:"date",
 						className:"grid16",
 						format:function(value,row){
 							if(row.sequenceNumber==0){
 								return moment(row.commitTime).format("YYYY-MM-DD HH:mm:ss"); 
 							}else{
 								return value?moment(value).format("YYYY-MM-DD HH:mm:ss"):""; 
 							}
 						},
 					},{
 						name:"checker.name",
 						label:"审批人",
 						className:"grid8"
 					},{
 						name:"checker.duty",
 						label:"职务",
 						className:"grid8"
 					},{
 						name:"note",
 						label:"意见",
 						className:"grid40"
 					},{
 						name:"agentChecker.name",
 						label:"代签人",
 						className:"grid8"
 					},{
						name:"operate",
						label:"操作", 	
						format:"button",
						formatparams:[{
							id:"approval",
							text:"审批",
							show:function(value,row){
								if(widget.get("param").hideButton){
									return false
								}else{
									if(row.status.key == "Initial"){
										return true
									}else if(row.status.key == "Commit" ){
										return "提交"
									}
								}
							},
							handler:function(index,data,rowEle){
								if(activeUser!=data.checker.pkUser){
									Dialog.alert({
		    							content:"对不起，您没有权限审批！"
		    						});
		            				return;
								}
								var datas =widget.get("appgrid").getData();
								var flag = false;
								for (var i in datas ) {
									if (data.sequenceNumber > datas[i].sequenceNumber
											&&
											datas[i].status.key == "Initial"
										) {
										flag = true;
										break;
									}

								}
								if (flag) {
									Dialog.alert({
		    							content:"对不起，您不能越次审批！"
		    						});
		            				return;
								}
								Dialog.showComponent({
									title:"审批",
									events:{
										"change select.J-form-approvalform-select-status":function(){
											var form  = widget.get("appform");
											var value = form.getValue("status");
											if(value == "Agent"){
												form.load("agentChecker");
												form.show("agentChecker");
												form.setValue("note","代签");
												form.hide("plusChecker");
												form.setValue("plusChecker","");
											}else if(value == "Pass"){
												form.hide("agentChecker");
												form.setValue("agentChecker","");
												form.hide("plusChecker");
												form.setValue("plusChecker","");
												form.setValue("note","同意");
											}else if(value == "NotPass"){
												form.hide("agentChecker");
												form.setValue("agentChecker","");
												form.hide("plusChecker");
												form.setValue("plusChecker","");
												form.setValue("note","不同意");
											}else if(value == "Plus"){
												form.show("plusChecker");
												form.load("plusChecker");
												form.hide("agentChecker");
												form.setValue("agentChecker","");
												form.setValue("note","加签");
											}
										}
									},
									confirm:function(){
										var form  = widget.get("appform");
										var note = form.getValue("note");
										var status =form.getValue("status");
										var agentChecker =form.getValue("agentChecker");
										if(!note){
											//TODO:后续提供统一处理
											$("#approvalform .J-form-approvalform-textarea-note").parent().parent().append("<div class='J-noteError'>请填写审批意见</div>");
											$(".J-noteError").addClass("text-error");
											return "NotClosed";
										}else{
											$(".J-noteError").text("").removeClass("text-error");
										}
										if(!status){
											//TODO:后续提供统一处理
											$("#approvalform .J-form-approvalform-select-status").parent().parent().append("<div class='J-statusError'>请修改审批结果</div>");
											$(".J-statusError").addClass("text-error");
											return "NotClosed";
										}else{
											$(".J-statusError").text("").removeClass("text-error");
											if(status == "Agent" && !agentChecker  ){
												$("#approvalform .J-form-approvalform-select-agentChecker").parent().parent().append("<div class='J-agentCheckerError'>请选择代签人</div>");
												$(".J-agentCheckerError").addClass("text-error");
												return "NotClosed";
											}else{
												$(".J-agentCheckerError").text("").removeClass("text-error");
											}
										}
										
										aw.saveOrUpdate("api/approval/approval",$("#approvalform").serialize(),function(data){
											var model = data.model;
											widget.get("appgrid").refresh(null,function(data){
												var callBack = widget.get("param").callBack;
												if(typeof callBack==="function"){
													callBack(model);
												}
											});
										});
									},
									setStyle:function(){
										$(".el-dialog .modal.fade.in").css({
											"top":"10%",
											"width": "50%",
											"left": "20%"
										});
									}
								},
								widget.getAppForm(data)
								);
							}
						},{
							id:"undo",
							text:"弃审",
							show:function(value,row){
								if(widget.get("param").hideButton){
									return row.status.value
								}
								if(row.status.key == "Initial" || row.status.key == "Agent" ){
									return false
								}
								if(row.status.key == "Commit"){
									return ""
								}
								if(row.status.key == "NotPass"){
									return row.status.value
								}
								if(row.status.key == "Pass"){
									var datas=widget.get("appgrid").getData(); 
									var index =widget.get("appgrid").getData().indexOf(row);
									var length =datas.length;
									if(row.sequenceNumber == datas[length-1].sequenceNumber){
										return row.status.value
									}else{
										var data ={};
										var sequenceNumber;
										for (var int = 0; int +index < datas.length; int++) {
											if(datas[int +index].sequenceNumber !=row.sequenceNumber){
												sequenceNumber=datas[int +index].sequenceNumber
												break;
											}
										}
										var  falg = true;
										var apps =widget.getDatasBySeq(sequenceNumber,datas);
										for ( var i in apps) {
											if(apps[i].status.key != "Initial"){
												falg =false;
											}
										}
										if(falg){
											return true
										}else{
											return row.status.value
										}
										
									}
								}
							},
							handler:function(index,data,rowEle){
								if(activeUser!=data.checker.pkUser){
									Dialog.alert({
		    							content:"对不起，您没有权限弃审！"
		    						});
		            				return;
								}
								var datas=widget.get("appgrid").getData();
								var sequenceNumber 
								for (var int = 0; int +index < datas.length; int++) {
									if(datas[int +index].sequenceNumber !=data.sequenceNumber){
										sequenceNumber=datas[int +index].sequenceNumber;
										break;
									}
								}
								var apps =widget.getDatasBySeq(sequenceNumber,datas);
								var pks=[]
								for ( var i in apps) {
									pks.push(apps[i].pkApprovalProcess);
								}
								Dialog.confirm({
									setStyle:function(){},
									content:"确认弃审？",
									confirm:function(){
										aw.ajax({
											url:"api/approval/abandonapproval",
											data:{
												pkApprovalProcess:data.pkApprovalProcess,
												version:data.version,
												status:"Initial",
												nextApprovalprocesspk:pks.toString()
											},
											dataType:"json",
											success:function(data){
												appgrid.refresh();
											}
										});
									}
								})
							}
						}]					
 					}]
 				}
    		 });
			this.set("appgrid",appgrid);
        },
        getAppForm:function(data){
			var appform =new Form({
				defaultButton:false,
				model:{
					id:"approvalform",
					defaultButton:false,
					items:[{
						name:"pkApprovalProcess",
						type:"hidden",
						defaultValue:data.pkApprovalProcess,
					},{
						name:"version",
						type:"hidden",
						defaultValue:data.version || 0,
					},{
						name:"checker",
						type:"hidden",
						defaultValue:data.checker.pkUser,
					},{
						name:"name",
						label:"审批人",
						defaultValue:data.checker.name || "",
						readonly:true,
						validate:["required"]
					},{
						name:"status",
						label:"审批结果",
						type : "select",
						options:[{
							key:"Pass",
							value:"通过"
						},{
							key:"NotPass",
							value:"驳回"
						},{
							key:"Agent",
							value:"代签"
						},{
							key:"Plus",
							value:"加签"
						}],
						defaultValue:"Pass",
						validate:["required"]
					},{
						name:"note",
						label:"审批意见",
						type : "textarea",
						defaultValue:"同意",
						validate:["required"]
					},{
						name:"agentChecker",
        				label:"代签人",
        				lazy:true,
        				show:false,
        				key:"pkUser",
        				type:"select",
        				url:"api/users/nofreeze",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name",
							seal:false
						}, 
        				value:"name"
					},{
						name:"plusChecker",
        				label:"加签人",
        				lazy:true,
        				show:false,
        				key:"pkUser",
        				type:"select",
        				url:"api/users/nofreeze",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name",
							seal:false
						}, 
        				value:"name"
					}]
				}
			});
			this.set("appform",appform);
			return appform;
		},
	})
	module.exports=approvalUtils;
})


