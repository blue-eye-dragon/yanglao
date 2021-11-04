 define(function(require,exports,module){
	 var Grid=require("grid");
	 var aw = require("ajaxwrapper");
	 var store = require("store");
	 var Dialog=require("dialog-1.0.0");
	var activeUser = store.get("user");
	var matterprocessesgrid1={
			init:function(widget,params,data){
				   var matterprocessesgrid = new Grid({
	         		parentNode:".J-mpgrid",
	         		autoRender:false,
	         		url :"api/matter/queryUndo",
	  				model:{
	  					id : "matterprocessesgrid",
	  					columns:[{
	  						name:"sequenceNumber",
	  						label:"序号"
	  					},{
	  						name:"finishTime",
	  						label:"处理时间",
	  						format:"date"
	  					},{
	  						name:"user.name",
	  						label:"处理人"
	  					},{
	  						name:"content",
	  						label:"处理意见"
	  					},{
	  						name:"operate",
	  						label:"操作", 	
	  						format:"button",
	  						formatparams:[{
	  							id:"do",
	  							text:"处理",
	  							show:function(value,row){
									if(row.status.key == "Initial"){
										return true
									}else{
										return row.status.value
									}
								},
	  							handler:function(index,data,rowEle){
									if(activeUser.pkUser!=data.user.pkUser){
										Dialog.alert({
			    							content:"对不起，您没有权限处理！"
			    						});
			            				return;
									}
									var datas =widget.get("matterprocessesgrid").getData();
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
			    							content:"对不起，您不能越次处理！"
			    						});
			            				return;
									}
									Dialog.showComponent({
										title:"事项处理",
										events:{
											"change select.J-form-approvalform-select-status":function(){
												var form  = widget.get("appform");
												var value = form.getValue("status");
												if(value == "Pass"){
													form.hide("plusChecker");
													form.setValue("plusChecker","");
													form.setValue("content","同意");
												}else if(value == "Read"){
													form.hide("plusChecker");
													form.setValue("plusChecker","");
													form.setValue("content","已阅");
												}else if(value == "NotPass"){
													form.hide("plusChecker");
													form.setValue("plusChecker","");
													form.setValue("content","不同意");
												}else if(value == "Plus"){
													form.show("plusChecker");
													form.load("plusChecker");
													form.setValue("content","加签");
												}
											}
										},
										confirm:function(){
											var form  = widget.get("mpform");
											var note = form.getValue("content");
											var status =form.getValue("status");
											var plusChecker =form.getValue("plusChecker");
											if(!note){
												//TODO:后续提供统一处理
												$("#mpform .J-form-mpform-textarea-content").parent().parent().append("<div class='J-contentError'>请填写审批意见</div>");
												$(".J-contentError").addClass("text-error");
												return "NotClosed";
											}else{
												$(".J-noteError").text("").removeClass("text-error");
											}
											if(!status){
												//TODO:后续提供统一处理
												$("#mpform .J-form-mpform-select-status").parent().parent().append("<div class='J-statusError'>请修改审批结果</div>");
												$(".J-statusError").addClass("text-error");
												return "NotClosed";
											}else{
												$(".J-statusError").text("").removeClass("text-error");
												if(status == "Plus" && !plusChecker  ){
													$("#mpform .J-form-mpform-select-plusChecker").parent().parent().append("<div class='J-plusCheckerError'>请选择代签人</div>");
													$(".J-plusCheckerError").addClass("text-error");
													return "NotClosed";
												}else{
													$(".J-plusCheckerError").text("").removeClass("text-error");
												}
											}
											
											aw.saveOrUpdate("api/matter/handler",$("#mpform").serialize(),function(data){
												//前台刷新数据 
												datas =matterprocessesgrid.getData();
												for ( var i in datas) {
													if(datas[i].pkMatterProcess ==data.pkMatterProcess){
														datas[i]=data
													}
												}
												
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
									widget.getMpForm(data,widget)
									);
	  							}
	  						}]
	  					}]
	  				}
	         	 });
				return matterprocessesgrid;
			}
		}
	module.exports=matterprocessesgrid1  ;
})


