define(function(require,exports,module){
	var Backbone = require("backbone");
	
	
	var DepartmentView = Backbone.Model.extend({
		idAttribute : "pkDepartment"
	});
	
	var DepartmentViews = Backbone.Collection.extend({
		model : DepartmentView,
		url : "api/department/query",
	});
	
	return {
		Model : DepartmentView,
		Collection : DepartmentViews
	};
});