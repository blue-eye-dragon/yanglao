define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var Asset = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"资产目录维护"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/asset/query",
				fetchProperties:"*,community.name,assetclass.name",
				model:{
					columns:[{
						key:"code",
						name:"编码",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"name",
						name:"名称"
					},{
						key:"community.name",
						name:"所属社区"
					},{
						key:"assetclass.name",
						name:"所属分类"
					},{
						key:"spec",
						name:"规格"
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
								widget.get("card").reset();
								widget.edit("edit",data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/asset/" + data.pkAsset + "/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					widget.save("api/asset/save",$("#asset").serialize());
				},
				model:{
					id:"asset",
					items:[{
						name:"pkAsset",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"code",
						label:"编码",
						validate:["required"]
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"community",
						label:"所属社区",
						type:"select",
						url:"api/community/query",
						key:"pkCommunity",
						value:"name",
						validate:["required"]
					},{
						name:"assetclass",
						label:"所属分类",
						type:"select",
						url:"api/assetclass/query",
						key:"pkAssetClass",
						value:"name",
						validate:["required"]
					},{
						name:"spec",
						label:"规格",
						
					},{
						name:"remark",
						label:"备注",
						type:"textarea"
						
					}]
				}
			};
		}
	});
	module.exports = Asset;
});