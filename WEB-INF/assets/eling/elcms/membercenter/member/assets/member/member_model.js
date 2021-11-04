define(function(require,exports,module){
	var Backbone=require("backbone");
	
	var MemberModel=Backbone.Model.extend({
		idAttribute:"pkMember",
		urlRoot:"api/member/"
	});
	
	module.exports=MemberModel;
});