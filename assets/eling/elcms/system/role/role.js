define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var Role  = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"角色维护"
				}
			};
		},
		
		initList:function(widget){
			return {
				url : "api/role/query",
				fetchProperties:"pkRole,name,description",
				model:{
					columns:[{
						key:"name",
						name:"角色名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"description",
						name:"角色描述"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/role/" + data.pkRole + "/delete");
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
					widget.save("api/role/save",$("#role").serialize());
				},
				model:{
					id : "role",
					items:[{
						title:"基本信息",
						icon:"github",
						remark:"",
						children:[{
							name:"pkRole",
							type:"hidden",
							show:false
						},{
							name : "name",
							label:"角色名称",
							validate:["required"]
						},{
							name : "description",
							label:"角色描述",
							type:"textarea",
							validate:["required"]
						}]
					}]
				}
			};
		}
	});
	module.exports = Role;
});