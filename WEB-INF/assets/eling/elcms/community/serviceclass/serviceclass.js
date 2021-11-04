define(function(require, exports, module) {
	var BaseView=require("baseview");
	var ServiceClass = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"服务等级定义"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/service/query",
				model:{
					columns:[{
						key:"name",
						name:"服务名称",
						format:"detail",
						formatparams:{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
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
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/service/" + data.pkService + "/delete");
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				saveaction:function(){
					widget.save("api/service/add",$("#service").serialize());
				},
				model:{
					id:"service",
					items:[{
						name:"pkService",
						type:"hidden"
					},{
						name:"name",
						label:"服务名称",
						validate:["required"]
					},{
						name:"name",
						label:"指标",
						type:"checklist",
						list:[{
							key:"0",
							value:"独居"
						},{
							key:"1",
							value:"高龄"
						},{
							key:"2",
							value:"痴呆"
						}],
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = ServiceClass;
});