define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var MemEduModel=Backbone.Model.extend({
		idAttribute:"pkEducation"
	});
	
	module.exports=MemEduModel;
});