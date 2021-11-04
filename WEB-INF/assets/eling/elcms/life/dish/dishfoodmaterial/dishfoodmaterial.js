define(function(require, exports, module) {
	var BaseView=require("baseview");
	var dishFoodMaterial = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"食材档案"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/dishfoodmerial/query",
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
						key:"characteristic",
						name:"特性"
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
								widget.del("api/dishfoodmerial/" + data.pkDishFoodMaterial + "/delete");
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
					widget.save("api/dishfoodmerial/save",$("#dishfoodmerial").serialize());
				},
				model:{
					id:"dishfoodmerial",
					items:[{
						name:"pkDishFoodMaterial",
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
						name:"characteristic",
						label:"特性",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = dishFoodMaterial;
});