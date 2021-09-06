define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var OtherRelationModel=Backbone.Model.extend({
		idAttribute:"pkOtherRelation"
	});
	
	module.exports=OtherRelationModel;
});