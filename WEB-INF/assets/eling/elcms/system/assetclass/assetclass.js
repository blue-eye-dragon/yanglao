define(function(require, exports, module) {
	var BaseView=require("baseview");
	var AssetClass = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"资产分类档案"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/assetclass/query",
				model:{
					columns:[{
						key:"code",
						name:"资产编码",
						format:"detail",
						formatparams:[{
							key:"detail",
                           handler:function(index,data,rowEle){
                        	   widget.edit("detail",data);
							} 
						}]
					},{
						key:"name",
						name:"资产类型",
					},{
						key:"remark",
						name:"备注"
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
								widget.del("api/assetclass/" + data.pkAssetClass + "/delete");
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
					widget.save("api/assetclass/save",$("#assetclass").serialize());
				},
				model:{
					id:"assetclass",
					items:[{
						name:"pkAssetClass",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"code",
						label:"资产编码",
						validate:["required"]
					},{
						name:"name",
						label:"资产类型",
						
						validate:["required"]
					},{
						name:"remark",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = AssetClass;
});