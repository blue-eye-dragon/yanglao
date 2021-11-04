 define(function(require,exports,module){
	var Grid = require("grid");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog=require("dialog");
	//多语
	var i18ns = require("i18n");
	var memHappReGrid={
			init:function(widget,inParams){
				return new Grid({
					parentNode:"#memHappRe",
					autoRender:false,
	    			url:"api/memberdailyrecord/query",
	    			params:function(){
	    				return {
	    					fetchProperties:"pkMemberDailyRecord,record,date,recordDate,type,version,recorder.pkUser,recorder.name",
	        				type:"Happy",
	        				member:widget.getMember()
	    				};
	    			},
	 				model : {
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
									widget.show("#memHappRe .el-form").hide("#memHappRe .el-grid");
									var form = widget.get("memHappReForm");
									form.reset();
									var form = widget.get("memHappReForm");
									form.load("recorder",{
										params:{
											fetchProperties:"pkUser,name"
										},
										callback:function(){
											//当前用户是管理员时，让recorder可用
											var userSelect=form.getData("recorder","");
											var flag = false;
											for(var  i =  0 ; i<userSelect.length;i++ ){
												if(userSelect[i].pkUser == activeUser.pkUser){
													flag= true;
													break;
												}
											}
											if(flag){
												form.setValue("recorder",activeUser.pkUser);
											}
											var recorder=form.getData("recorder","");
											recorder.push(activeUser);
											form.setData("recorder",recorder);
											form.setValue("recorder",activeUser);
										}
									});
									return false;
								}
							}]
						},
						columns:[{
							name:"date",
							label:"业务日期",
							format:"date",
							className:"grid_20"
						},{
							name:"record",
							label:"描述",
							className:"grid_40"
						},{
							name:"recorder.name",
							label:"记录人",
							className:"grid_10"
						},{
							name:"recordDate",
							label:"记录日期",
							format:"date",
							className:"grid_20"
						},{
							name:"operate",
							label:"操作",
							format:"button",
							formatparams:[{
								id:"edit",
								icon:"icon-edit",
								handler:function(index,data,rowEle){
									if(data.recorder.pkUser){
										data.recorder = data.recorder.pkUser;
									}
									if( data.type.key){
										data.type =data.type.key
									}
									widget.get("memHappReForm").setData(data);
									widget.show("#memHappRe .el-form").hide("#memHappRe .el-grid");
								}
							},{
								id:"delete",
								icon:"icon-remove",
								handler:function(index,data,rowEle){
									aw.del("api/memberdailyrecord/" + data.pkMemberDailyRecord + "/delete",function(){
										widget.get("memHappReGrid").refresh();
									});
									return false;
								}
							}]
						}]
	 				}
	    		 });
			}
		}
	module.exports=memHappReGrid  ;
})


