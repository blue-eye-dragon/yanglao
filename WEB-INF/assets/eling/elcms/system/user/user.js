define(function(require, exports, module) {
	var BaseView=require("baseview");
	var User = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"机构管理员维护"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/users",
				params:{
					fetchProperties:"*,organization.pkOrganization,organization.name," +
							"department.pkDepartment,department.name," +
							"community.pkCommunity,community.name"
				},
				model:{
					columns:[{
						key:"code",
						name:"用户名",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data,function(){
									$(".J-password").parents(".form-group").addClass("hidden");
									$(".J-confirmPassword").parents(".form-group").addClass("hidden");
								});
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
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data,function(){
									$(".J-password").parents(".form-group").addClass("hidden");
									$(".J-confirmPassword").parents(".form-group").addClass("hidden");
								});
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/user/"+data.pkUser+"/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"profile",
				saveaction:function(){
					widget.save("api/user/add",$("#userinfo").serialize());
				},
				model:{
					id : "userinfo",
					items:[{
						title:"账户信息",
						icon:"github",
						remark:"",
						children:[{
							name:"pkUser",
							type:"hidden"
						},{
							name : "version",
							type : "hidden",
							defaultValue : "0"
						},{
							name : "code",
							label:"用户名",
							validate:["required"]
						},{
							label:"所属机构",
							name:"organization",
							type:"select",
							url:"api/organization/query",
							key:"pkOrganization",
							value:"name",
							validate:["required"]
						},{
							name : "password",
							type:"password",
							label:"密码",
							validate:["required"]
						},{
							name : "confirmPassword",
							type:"password",
							label:"再次输入密码",
							validate:["required"]
						}]
					},{
						title:"个人信息",
						icon:"user",
						remark:"",
						children:[{
							name : "name",
							label:"姓名",
							validate:["required"]
						},{
							name : "phone1",
							label:"联系电话1",
							validate:["required"]
						},{
							name : "phone2",
							label:"联系电话2"
						},{
							name : "email",
							label:"E-mail",
							validate:["required"]
						},{
							label:"所属社区",
							name:"community",
							type:"select",
							url:"api/community/query",
							key:"pkCommunity",
							value:"name"
						},{
							label:"所属部门",
							name:"department",
							type:"select",
							url:"api/department/query",
							key:"pkDepartment",
							value:"name"
						},{
							name : "position",
							label:"职务"
						},{
							name : "pkRole",
							label:"角色",
							type:"hidden",
							defaultValue:"2"// 默认角色为机构管理员
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