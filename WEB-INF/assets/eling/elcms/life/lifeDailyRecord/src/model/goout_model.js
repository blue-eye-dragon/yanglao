define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var MemEduModel=Backbone.Model.extend({
		idAttribute:"pkGoOutRecord"
	});
	
	module.exports=MemEduModel;
});