define(function(require, exports, module) {
	var BaseView=require("baseview");
	var medicalinsurancetype = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"功能节点注册"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/menuitem/query",
				model:{
					columns:[{
						key:"code",
						name:"功能节点编号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"display",
						name:"名称"
					},{
						key:"icon",
						name:"图标"
					},{
						key:"parameter",
						name:"参数"
					},{
						key:"path",
						name:"文件位置"
					},{
						key:"enabled",
						name:"是否启用",
						format:function(value,row){
							if(value){
								return "启用";
							}else{
								return "未启用";
							}
						}
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
								widget.del("api/menuitem/" + data.pkMenuItem + "/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/menuitem/save",$("#menuitem").serialize());
				},
				model:{
					id:"menuitem",
					items:[{
						name:"pkMenuItem",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"code",
						label:"功能节点编号",
						validate:["required"]
					},{
						name:"display",
						label:"名称",
						validate:["required"]
					},{
						name:"icon",
						label:"图标",
						validate:["required"]
					},{
						name:"parameter",
						label:"参数"
					},{
						name:"path",
						label:"文件位置",
						validate:["required"]
					},{
						name:"enabled",
						label:"是否启用",
						type:"select",
					    options:[{
							key:true,
							value:"启用"							
						},{
							key:false,
							value:"不启用"	
						}],
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = medicalinsurancetype;
});