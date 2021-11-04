define(function(require,exports,module){
	var Backbone=require("backbone");
	var OtherRelationModel=require("./otherrelation_model");
	
	var OtherRelation=Backbone.Collection.extend({
		url:"api/otherrelation/query",
		model:OtherRelationModel
	});
	
	module.exports=OtherRelation;
});