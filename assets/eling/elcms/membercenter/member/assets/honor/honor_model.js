define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var MemHonorModel=Backbone.Model.extend({
		idAttribute:"pkHonoraryTitle"
	});
	
	module.exports=MemHonorModel;
});