define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var User = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"机构管理员重置密码",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
							return false;
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/users",
				fetchProperties:"*,organization.name,community.name",
				model:{
					columns:[{
						key:"code",
						name:"用户名",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"name",
						name:"姓名"
					},{
						key:"organization.name",
						name:"所属机构"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"resetbtn",
							text:"重置密码",
							handler:function(index,data,rowEle) {
								if(window.confirm("重置密码将为" + data.name + "生成新的随机密码并发送到<" + data.email + ">邮箱，是否继续？")) {
									aw.ajax({
										url:"requestRecoveryToken",
										data:"usercode="+data.code,
										dataType:"json",
										type:"GET",
										success:function(data) {
											alert(data.msg);
										},
										error:function(jqXHR,textStatus,errorThrown) {
											alert("邮件发送发生错误：" + errorThrown);
										}
									});
								}
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"profile",
				model:{
					id : "userinfo",
					items:[{
						title:"账户信息",
						icon:"github",
						children:[{
							name : "code",
							label:"用户名"
						},{
							name:"organization",
							label:"所属机构",
							value:"name"
						}]
					},{
						title:"个人信息",
						icon:"user",
						children:[{
							name : "name",
							label:"姓名"
						},{
							name : "phone1",
							label:"联系电话1"
						},{
							name : "phone2",
							label:"联系电话2"
						},{
							name : "email",
							label:"E-mail"
						},{
							label:"所属社区",
							name:"community",
							value:"name"
						},{
							label:"角色",
							name:"role",
							readonly:true,
							defaultValue:"机构管理员"
						}]
					}]
				}
			};
		}
	});
	module.exports = User;
});