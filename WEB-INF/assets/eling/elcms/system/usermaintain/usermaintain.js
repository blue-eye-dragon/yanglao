define(function(require, exports, module) {
	var BaseView=require('baseview');
	var store=require("store");
	var aw=require("ajaxwrapper");

	require("./usermaintain.css");
	
	var User = BaseView.extend({
		events:{
			"change .J-pkRole" : function(e){
				var pk=$(e.target).find("option:selected").attr("value");
				if(pk=="4"||pk=="5"||pk=="3"){
				var pkBuildings=[];
				$("select.J-buildings option").each(function(){
					pkBuildings.push($(this).attr("value"));
				});
				this.get("card").setValue("buildings",pkBuildings);
				}else{
					this.get("card").setValue("buildings","");
				}
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"用户维护",
					search:function(str) { 
						var g=widget.get("list"); 
						g.loading();
						aw.ajax({
							url:"api/user/search",
							data:{
								s:str,
								properties:"*,code,name,roles.name,organization.name",//去掉*编辑里面的数据带不过去   
								fetchProperties:"*,version,organization.pkOrganization,organization.name,roles.pkRole,roles.name," +
										"buildings.pkBuilding,buildings.name,department.pkDepartment,department.name," +
										"community.pkCommunity,community.name",  
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.list2Card(false);
							}
						});
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/users", 
				fetchProperties:"*,version,organization.pkOrganization,organization.name,roles.pkRole,roles.name," +
				"buildings.pkBuilding,buildings.name,department.pkDepartment,department.name," +
				"community.pkCommunity,community.name",  
				model:{
					columns:[{
						key:"code",
						name:"用户名",
                        className:"oneHalfColumn",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								data.organizationName = data.organization.name;
								widget.edit("detail",data);
								widget.get("card").setValue("organization",data.organization.pkOrganization);
								widget.get("card").hide(["password","confirmPassword"]);
								return false;
							}
						}]
					},{
						key:"name",
						name:"姓名",
	                    className:"oneColumn"
					},{
						key:"organization.name",
						name:"所属机构",
	                    className:"twoColumn"
					},{
						key:"role",
						name:"所属角色",
	                    className:"sixColumn",
						format:function(cell,row){
							var ret = "";
							var roles = row.roles || [];
							for(var i=0;i<roles.length;i++){
								ret += roles[i].name+"，";
							}
							return ret.substring(0,ret.length-1);
						}
					},{
						key:"operate",
						name:"操作",
                        className:"oneColumn",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								data.organizationName = data.organization.name;
								widget.edit("edit",data);
								widget.get("card").setValue("organization",data.organization.pkOrganization);
								widget.get("card").setAttribute("password","disabled","disabled");
								widget.get("card").setAttribute("confirmPassword","disabled","disabled");
								widget.get("card").hide(["password","confirmPassword"]);
								
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/user/" + data .pkUser + "/delete");
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
					widget.save("api/user/add",$("#userinfo").serialize(),function(data){
						if(data.pkUser){
                			//上传图片
							widget.get("card").upload("api/attachment/userphoto/"+data.pkUser,function(){
								$(".J-username img").attr("src",$(".J-username img").attr("src"));
							});
							widget.get("list").refresh();
                		}
					});
				},
				model:{
					id : "userinfo",
					isLogo:false,
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
							type : "hidden",
							defaultValue : "0"
						},{
							name : "code",
							label:"用户名",
							validate:["required"]
						},{
							name:"organization",
							defaultValue:store.get("user").organization.pkOrganization,
							type:"hidden"
						},{
							label:"所属机构",
							name:"organizationName",
							defaultValue:store.get("user").organization.name,
							readonly:true	
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
						children:[{
							name : "name",
							label:"姓名",
							validate:["required"]
						},{
							name : "phone1",
							label:"手机号",
							validate:["required"]
						},{
							name : "phone2",
							label:"其他联系方式"
						},{
							name : "email",
							label:"E-mail",
							validate:["required"]
						},{
							name : "duty",
							label:"职务"
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
							name:"buildings",
							label:"负责楼宇",
							type:"select",
							url:"api/buildings",
							key:"pkBuilding",
							value:"name",
							multi:true,
							validate:["required"]
						},{
							label:"角色",
							name:"roles",
							type:"select",
							url:"api/role/dropdown",
							key:"pkRole",
							value:"name",
							multi:true,
							validate:["required"]
						}]
					}]
				}
			};
		}
	});
	module.exports = User;
});