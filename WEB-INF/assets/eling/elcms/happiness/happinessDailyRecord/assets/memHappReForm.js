 define(function(require,exports,module){
	var Form = require("form");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var memHappReForm={
			init:function(widget,inParams){
				return new Form({
					parentNode:"#memHappRe",
	            	saveaction:function(){
	            		var params="member="+widget.getMember()+"&"+$("#memHappReForm").serialize();
	            		aw.saveOrUpdate("api/memberdailyrecord/save",params,function(data){
	            			widget.hide("#memHappRe .el-form").show("#memHappRe .el-grid");
	            			widget.get("memHappReGrid").refresh();
	            		});
	 				},
	 				//取消按钮
					cancelaction:function(){
						widget.hide("#memHappRe .el-form").show("#memHappRe .el-grid");
					},
					model:{
						id:"memHappReForm",
						items:[{
							name:"pkMemberDailyRecord",
							type:"hidden"
						},{
							name:"type",
							type:"hidden",
							defaultValue:"Happy"
						},{
							name:"date",
							label:"业务日期",
							type:"date",
							validate:["required"]
						},{
							name:"recorder",
							label:"记录人",
						    url:"api/users",
							key:"pkUser",
							value:"name",
							params:function(){
								return{
									fetchProperties:"pkUser,name"
								  }
									},
							type:"select",
							readonly : true,
							defaultValue : activeUser.pkUser,
							validate:["required"]
						},{
							name:"recordDate",
							label:"记录日期",
							type:"date",
							defaultValue:moment().valueOf(),
							readonly : true,
							validate:["required"]
						},{
							name:"record",
							label:"描述",
							type:"textarea",
							validate:["required"]
						}]
					}
	             });
			}
		}
	module.exports=memHappReForm;
})


