define(function(require,exports,module){
	var Backbone=require("backbone");
	var FurnishModel=require("../models/furnishing_model");
	
	var FurnishCollection=Backbone.Collection.extend({
		url:"api/checkinfurnishing/queryAssetByRoom",
		model:FurnishModel
	});
	
	module.exports=FurnishCollection;
});