define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var AccompanyModel=Backbone.Model.extend({
		idAttribute:"pkAccompanyPerson",
//		urlRoot:"api/accompanyperson/query"
//		,
//		parse:function(model){
//			if(model.length==0){
//				this.clear();
//			}
//			return model;
//		}
	});
	
	module.exports=AccompanyModel;
});