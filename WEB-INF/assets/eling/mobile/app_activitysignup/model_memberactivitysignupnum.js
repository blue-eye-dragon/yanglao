define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var MemberActivitysignupNum = Backbone.Model.extend({
		//模型的主键
		idAttribute : "num",
		
		url : "api/activitysignup/queryMemberSignupNum",
	});

	
	return {
		Model : MemberActivitysignupNum,
	};
});