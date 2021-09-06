define(function(require, exports, module) {
	var BaseView=require("baseview");
	var expendables = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"低值易耗品目录维护",
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/expendables/query",
				model:{
					columns:[{
						key:"code",
						name:"编码"
					},{
						key:"name",
						name:"易耗品名称"
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
								widget.del("api/expendables/" + data.pkExpendables + "/delete");
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
					widget.save("api/expendables/save",$("#expendables").serialize());
				},
				model:{
					id:"expendables",
					items:[{
						name:"pkExpendables",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"code",
						label:"编码",
						validate:["required"]
					},{
						name:"name",
						label:"易耗品名称",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = expendables;
});
