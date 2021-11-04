 define(function(require,exports,module){
	var Grid = require("grid");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog=require("dialog");
	//多语
	var i18ns = require("i18n");
	var hapActRepGrid={
			init:function(widget,inParams){
				return new Grid({
					parentNode:"#hapActRep",
					autoRender:false,
					url : "api/activityreport/query",
					params:function(){
	    				return {
	    					fetchProperties:"pkActivityReport,version,activity.theme,create.pkUser,create.name,activity.pkActivity,date,recordDate,description",
	        				member:widget.getMember(),
	        				type:"happinessmember"
	    				};
	    			},
					model:{
						head:{
							buttons:[{
								id:"add",
								icon:"icon-plus",
								handler:function(){
									//TODO cjf 会员过世后，暂时不限制
									/*if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
										Dialog.alert({
											content:"会员已过世！"
										})
										return;
									}*/
									if(!widget.getMember()){
										Dialog.alert({
											content:"该楼无"+i18ns.get("sale_ship_owner","会员")+"！"
										})
										return;
									}           
									widget.get("hapActRepForm").reset();
									var form = widget.get("hapActRepForm");
									form.load("create",{
										params:{
											fetchProperties:"pkUser,name"
										},
										callback:function(data){
											//当前用户是管理员时，让recordPerson可用
											var userSelect=form.getData("create","");
										//	userSelect.push(activeUser);
											var flag = false;
											for(var  i =  0 ; i<userSelect.length;i++ ){
												if(userSelect[i].pkUser == activeUser.pkUser){
													flag= true;
													break;
												}
											}
											if(flag){
												form.setValue("create",activeUser.pkUser);
											}
											var createData=form.getData("create","");
											createData.push(activeUser);
											form.setData({"create":createData,
												"recordDate":moment()});
											form.setValue("create",activeUser);
										}
									});
									widget.get("hapActRepForm").loadPicture("api/attachment/activityreportphoto/"+0);
									widget.show("#hapActRep .el-profile").hide("#hapActRep .el-grid");
									$(".J-create").attr("disabled",true);
									$(".J-recordDate").attr("disabled",true);
//									var arr = form.getData("create");
//									for(var i in arr)
//									{
//									   if(activeUser.pkUser==arr[i].pkUser)
//										   {
//										   form.setValue("create",activeUser.pkUser)
//										   }
//									}
									return false;
								}
							}]
						},
						columns:[{
	                        name:"activity.theme",
	                        label:"活动",
	                        className:"grid_20"
	                    },{
	                        name:"date",
	                        label:"业务日期",
	                        format:"date",
	                        className:"grid_10"
	                    },{
	                    	name:"description",
							label:"描述",
							className:"grid_30"
						},{
							name:"create.name",
							label:"记录人",
							className:"grid_20"
						},{
							name:"recordDate",
							label:"记录日期",
							format:"date",
							className:"grid_10"
						},{
							name:"operate",
							label:"操作",
							format:"button",
							formatparams:[{
								id:"edit",
								icon:"icon-edit",
								handler:function(index,data,rowEle){
									widget.get("hapActRepForm").reset();
									$(".J-recordDate").attr("disabled",true);
									$(".J-create").attr("disabled",true);
									widget.get("hapActRepForm").loadPicture("api/attachment/activityreportphoto/"+data.pkActivityReport);
									$(".J-img").attr("src",data.pkActivityReport);
									data.activity.activity=data.activity;
									widget.get("hapActRepForm").setData(data);
									widget.get("hapActRepForm").setAttribute("activity","readonly","readonly");
									widget.show("#hapActRep .el-profile").hide("#hapActRep .el-grid");
								}
							},{
								id:"delete",
								icon:"icon-remove",
								handler:function(index,data,rowEle){
									aw.del("api/activityreport/" + data.pkActivityReport + "/delete",function(){
									widget.get("hapActRepGrid").refresh();
									});
								}
							}]
						}]
					}
				});
			}
		}
	module.exports=hapActRepGrid  ;
})


