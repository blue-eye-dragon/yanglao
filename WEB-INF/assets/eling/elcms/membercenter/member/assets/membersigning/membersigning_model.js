define(function(require,exports,module) {
	var Backbone=require("backbone");
	
	var MemberSigning=Backbone.Model.extend({
		idAttribute:"pkMemberSigning"
	});
	module.exports=MemberSigning;
});
