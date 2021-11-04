define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog");
	var userData = {};
	
	var UserProfile = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"用户配置",
					buttons:[]
				}
			};
		},
		initCard:function(widget){
			 return {
				compType:"profile",
				saveaction:function(){
					widget.save("api/user/add",$("#me").serialize()+"&fetchProperties=*,organization.pkOrganization,organization.name,community.pkCommunity,community.name,department.pkDepartment,department.name",function(data){
						if(data.pkUser){
                			//上传图片
							widget.get("card").upload(null,function(){
								$(".J-username img").attr("src",$(".J-username img").attr("src"));
								data.organizationName=data.organization.name;
								data.communityName=data.community ? data.community.name : "";
								data.departmentName=data.department ? data.department.name : "";
								widget.get("card").setData(data);
								Dialog.alert({
									content:"保存成功"
								});
							});
                		}
						return {
							forward:false
						};
					});	
				},
				model:{
					id :"me",
					items:[{
						title:"账户信息",
						icon:"github",
						img:{
							url:"api/attachment/userphoto/",
							idAttribute:"pkUser"
						},
						children:[{
							name:"pkUser",
							type:"hidden"
						},{
							name : "version",
							type : "hidden"
						},{
							name : "seal",
							type : "hidden",
							defaultValue : "false"
						},{
							label:"用户名",
							name:"code",
							readonly:true,
						},{
							label:"修改密码",
							name:"changePwd",
							format:function(){
								var ret=""+
								'<div class="controls">'+
									'<div class="checkbox">'+
										'<label>'+
											'<input data-target="#change-password" data-toggle="collapse" id="changepasswordcheck" value="option1" type="checkbox">'+
											'更改密码？'+
										'</label>'+
									'</div>'+
								'</div>'+
								'<div class="collapse" id="change-password">'+
									'<div class="form-group">'+
										'<label>原密码</label>'+
										'<input class="form-control" name="password" placeholder="原密码" type="password">'+
									'</div>'+
									'<div class="form-group">'+
										'<label>新密码</label>'+
										'<input class="form-control" name="newPassword" placeholder="新密码" type="password">'+
									'</div>'+
									'<div class="form-group">'+
										'<label>密码确认</label>'+
										'<input class="form-control" id="password-confirmation" placeholder="密码确认" type="password">'+
									'</div>'+
								'</div>';
								return ret;
							}
						}]
					},{
						title:"个人信息",
						icon:"user",
						remark:"",
						children:[{
							label:"姓名",
							name:"name",
							readonly:true
						},{
							name : "phone1",
							label:"联系电话1"
						},{
							name : "phone2",
							label:"联系电话2"
						},{
							label:"E-mail",
							name:"email"
						},{
							label:"职务",
							name:"duty"
						},{
							name:"organization",
							value:"pkOrganization",
							type:"hidden"
						},{
							label:"所属机构",
							name:"organizationName",
							readonly:true							
						},{
							name:"community",
							value:"pkCommunity",
							type:"hidden"
						},{
							label:"所属社区",
							name:"communityName",
							readonly:true
						},{
							name:"department",
							value:"pkDepartment",
							type:"hidden"
						},{
							label:"所属部门",
							name:"departmentName",
							readonly:true
							
						},{						
							name:"buildings",
							label:"负责楼宇",
							type:"select",
							url:"api/building/query",
							key:"pkBuilding",
							value:"name",
							lazy:true,
							multi:true
						},{
							name:"roles",
							label:"角色",
							type:"select",
							url:"api/role/query",
							key:"pkRole",
							value:"name",
							lazy:true,
							multi:true
						}]
					}]
				}
			};
		},
		
		afterInitComponent : function(params,widget) {
			//发ajax请求
			aw.ajax({
				url:"api/user/me",
				dataType:"json",
				data:{
					fetchProperties:"*,organization.pkOrganization,organization.name,community.pkCommunity,community.name,"+
									"department.pkDepartment,department.name,roles.pkRole,roles.name,buildings.pkBuilding,buildings.name"
				},
				success:function(data){
					data.organizationName=data.organization ? data.organization.name : "";
					data.communityName=data.community ? data.community.name : "";
					data.departmentName=data.department ? data.department.name : "";
					widget.get("card").setData(data);
					//加载楼和角色
					widget.userData = data;
					widget.get("card").load("buildings",{
						callback:function(){
							widget.get("card").setValue("buildings",widget.userData.buildings);
						}
					});
					$("select.J-buildings").select2("readonly", true);
					widget.get("card").load("roles",{
						callback:function(){
							widget.get("card").setValue("roles",widget.userData.roles);
						}
					});
					$("select.J-roles").select2("readonly", true);
					
					widget.get("card").loadPicture();
					widget.list2Card(true);
				},
				error:function(data){
					console.log(data);
				}
			});
		}
	});
	module.exports = UserProfile;
});