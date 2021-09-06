define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var RelativeModel=Backbone.Model.extend({
		idAttribute:"pkRelative"
	});
	
	module.exports=RelativeModel;
});