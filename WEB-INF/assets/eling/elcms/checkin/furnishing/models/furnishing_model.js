define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var FurnishModel=Backbone.Model.extend({
		idAttribute:"pkAsset",
		url:"api/checkinfurnishing/queryAssetByRoom",
		parse:function(model){
			if(model.length==0){
				this.clear();
			}
			return model;
		}
	});
	
	module.exports=FurnishModel;
});