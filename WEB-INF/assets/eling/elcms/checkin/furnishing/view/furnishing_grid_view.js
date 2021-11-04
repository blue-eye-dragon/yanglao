define(function(require,exports,module){
	var Backbone=require("backbone");
	Backbone.emulateJSON=true;
	Backbone.emulateHTTP=true;
	var Grid=require("grid-1.0.0");
	var aw = require("ajaxwrapper");
	
	var PersonalGridView=Backbone.View.extend({
		initialize:function(collection){
			this.collection=collection;
			this.collection.on("add",this.setData,this);
			this.collection.on("remove",this.setData,this);
			this.collection.on("reset",this.setData,this);
			this.render();
		},
		render:function(){
			this.component=this.initComponent();
			this.$el=this.component.element;
			this.$parentEL=this.$el.parents(".el-furnishing");
		},
		initComponent:function(){
			$(".J-grid-furnishing").empty();
			return new Grid({
				parentNode:".J-grid-furnishing",
				autoRender:false,
				model:{
					columns:[{
						key:"name",
						name:"固定资产名称"
					},{
						key:"code",
						name:"编号"
					},{
						key:"operate",
						name:"确认",
						format:function(value,row){
							if (row.code) {
								return "<input type='checkbox' name='assetCards' pkAssetCard='" + row.pkAsset + "' />";
							} else {
								return "<input type='checkbox' name='assetCards' pkAssetCard='" + row.pkAsset + "' disabled='disabled' />";
							}
						}
					}]
				}
			});
		},
		setData:function(){
			this.component.setData(this.collection.toJSON());
			aw.ajax({
				url:"api/checkinfurnishing/queryCardByFurnish",
				data:{
					pkCIFurnishing:$(".currentGird").attr("data-key"),
					fetchProperties:"*,assetCards.*", 
				},
				success:function(data){
					for(i in data.assetCards) {
						$('input[name="assetCards"][disabled!="disabled"]').each(function(){
							if ($(this).attr("pkAssetCard") == data.assetCards[i].pkAssetCard) {
								$(this).attr("checked","checked"); 
								return;
							}
						});
					}
				}
			});
		}
	});
	
	module.exports=PersonalGridView;
});