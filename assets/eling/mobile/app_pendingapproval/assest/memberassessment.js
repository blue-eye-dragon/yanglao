define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var MemberAssessment = Backbone.Model.extend({
		idAttribute : "pkMemberAssessment"
	});
	
	var MemberAssessments = Backbone.Collection.extend({
		initialize : function(options){
			for(var i in options){
				this[i] = options[i];
			}
		},
		
		model : MemberAssessment,
		
		url : "api/memberassessment/query"
	});
	
	return MemberAssessments;
	
});