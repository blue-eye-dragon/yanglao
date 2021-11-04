define(function(require, exports, module) {
	var BaseView=require("baseview");
	var dishClassify = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"分类档案"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/dishclassify/query",
				model:{
					columns:[{
						key:"name",
						name:"名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
							}
						}]
					},{
						key:"description",
						name:"描述"
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
								widget.del("api/dishclassify/" + data.pkDishClassify + "/delete");
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
					widget.save("api/dishclassify/save",$("#dishclassify").serialize());
				},
				model:{
					id:"dishclassify",
					items:[{
						name:"pkDishClassify",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"description",
						label:"描述",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = dishClassify;
});