 define(function(require,exports,module){
	var Profile = require("profile");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var hapActRepForm={
			init:function(widget,inParams){
				return new Profile({
					parentNode:"#hapActRep",
					saveaction:function(){
						var params="member="+ widget.getMember() + "&"+ $("#hapActRepForm").serialize() +
					//	"&"+"create="+ $("select.J-create").val()+
						"&"+"recordDate="+ $(".J-recordDate").val();
						aw.saveOrUpdate("api/activityreport/save",params,function(data){
							//上传图片
							widget.get("hapActRepForm").upload("api/attachment/activityreportphoto/"+data.pkActivityReport);
	                		widget.get("hapActRepGrid").refresh();
	                		widget.hide("#hapActRep .el-profile").show("#hapActRep .el-grid");
						})
					},
					cancelaction:function(){
						widget.hide("#hapActRep .el-profile").show("#hapActRep .el-grid");
					},
					model:{
						id:"hapActRepForm",
						cancelText :"取消",
						items:[{
							title:"活动报告信息",
							img:{
								idAttribute:"pkActivityReport",
	            				label:"活动报告",
	            				url:"api/attachment/activityreportphoto/",
							},
							children:[{
								name:"pkActivityReport",
								type:"hidden"
							},{
								name:"version",
								defaultValue:"0",
								type:"hidden"
							},{
								name:"type",
								defaultValue:"happinessmember",
								type:"hidden"
							},{
								name:"activity",
								lazy:true,
								label:"活动名称",
								url:"api/activitysignup/queryNormal",
								key:"activity.pkActivity",
								value:"activity.theme",
								params:function(){
									return{
										"activity.type":"happiness",
										member:widget.getMember(),
										fetchProperties:"activity.pkActivity,activity.theme"
									}
								},
								type:"select",
								validate:["required"]
							},{
								name:"date",
								label:"业务时间",
								type:"date",
								validate:["required"]
							},{
								name:"create",
								label:"记录人",
								url:"api/users",
								key:"pkUser",
								value:"name",
								params:function(){
									return{
										fetchProperties:"pkUser,name"
									}
								},
								lazy:true,
								type:"select",
								defaultValue : activeUser.pkUser,
								validate:["required"]
							},{
								name:"recordDate",
								label:"记录日期",
								type:"date",
								defaultValue:moment().valueOf(),
								validate:["required"]
							},{
								name:"description",
								label:"活动描述",
								type:"textarea",
								height:"200"
							}]
						}]
					}			
				});
			}
		}
	module.exports=hapActRepForm;
})


