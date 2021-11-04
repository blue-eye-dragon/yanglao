define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var RoomConfig = BaseView.extend({
		events:{
			"change .J-assetClass":function(e){
				if(this.get("card").getValue("assetClass")){
					this.get("card").load("asset");
				}
			},
			"change .J-asset":function(e){
				if(this.get("card").getValue("asset")){
					this.get("card").load("cards");
				}
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"房间配置管理",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							var subnav = widget.get("subnav");
							subnav.load({
								id:"room",
								callback:function(data){						
									widget.get("list").refresh();
								}
							});
						}
					},{
						id:"room",
						key:"pkRoom",
						value:"number",
						url:"api/room/query",
						params:function(){
							return {
								fetchProperties:"*,building.name",
								pkBuilding:widget.get("subnav").getValue("building")
							};
						},
						lazy:true,
						handler:function(key,element){
							widget.get("list").refresh();
						}
						
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/roomconfig/query",
				fetchProperties:"*,asset.*,asset.assetclass.*",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						pkRoom:subnav.getValue("room"),
						//pkBuilding:subnav.getValue("building")
					};
				},
				model:{
					columns:[{
						key:"asset.name",
						name:"资产名称",
					},{
						key:"code",
						name:"资产编码",				
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/roomconfig/removecard?assetCard="+data.pkAssetCard);	
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
    				var assetcard=widget.get("card").getValue("cards");
    				widget.save("api/roomconfig/addcard","room="+widget.get("subnav").getValue("room")+"&assetCard="+assetcard );
 				},
				model:{
					id:"assetCard",
					items:[{
						name:"pkAssetCard",
						type:"hidden"	
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"assetClass",
						label:"资产分类",
						type:"select",
						url:"api/assetclass/query",
						key:"pkAssetClass",
						value:"name",
						validate:["required"]
					},{
						name:"asset",
						label:"资产目录",
						type:"select",
						url:"api/asset/query",
						lazy:true,
						key:"pkAsset",
						value:"name",
						params:function(){
							return {
								assetclass:widget.get("card").getValue("assetClass"),
								fetchProperties:"pkAsset,name"
							};
						},
						validate:["required"]
					},{
						name:"cards",
						label:"资产编码",
						lazy:true,
						type:"select",
						url:"api/assetcard/queryconfigpk",					
						key:"pkAssetCard",
						params:function(){
							return {
								asset:widget.get("card").getValue("asset"),
								fetchProperties:"pkAssetCard,code"
							};
						},
						value:"code",
						validate:["required"]
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			var subnav = this.get("subnav");
			var grid = this.get("list");
			grid.loading();
			subnav.load({
				id:"room",
				callback:function(data){						
					grid.refresh();
				}
			});
		
		}
	});
	module.exports = RoomConfig;
});