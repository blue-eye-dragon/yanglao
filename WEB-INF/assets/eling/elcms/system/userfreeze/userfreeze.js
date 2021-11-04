define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
	var BaseView=require("baseview");
	var User = BaseView.extend({
		events:{
			"click .J-freeze":function(e){
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				aw.ajax({
					url : "api/user/" + data.pkUser + "/freeze",
					type : "POST",
					success : function(data){
						grid.refresh();	
					}	
			    });
		    } 
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"用户封存",
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
				fetchProperties:"*,version,organization.pkOrganization,organization.name,roles.pkRole,roles.name," +
				"department.pkDepartment,department.name,community.pkCommunity,community.name",  
				model:{
					columns:[{
						key:"name",
						name:"名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"organization",
						name:"所属机构",
						format:function(value,row){
							return value.name;
						}
					},{
						key:"seal",
						name:"是否封存",
						format:function(value,row){
							return value==true?"是":"否";
						}
					},{
						key:"seal",
						name:"操作",
						format:function(value,row){
							if(row.seal==true){
					          var ret1 = "<div>" +  
    	                            "<a style='margin-left:5px;color:white;background:green' href='javascript:void(0);' class='J-freeze btn btn-xs' >解封</a>" +  
    	                            "</div>"; 
					          return ret1;  
							}else{
								var ret = "<div>" +  
	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-freeze btn btn-xs' >封存</a>" +  
	                            "</div>";
								return ret; 
							}
    					}
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
						remark:"",
						children:[{
							name : "code",
							label:"用户名"
						},{
							label:"所属机构",
							name:"organization",
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
							label:"所属部门",
							name:"department",
							value:"name"
						},{
							label:"角色",
							name:"roles",
							type:"select",
							url:"api/role/dropdown",
							key:"pkRole",
							value:"name"
						}]
					}]
				}
			};
		}
	});
	module.exports = User;
});