define(function(require,exports,module){
	var Backbone = require("backbone");
	
	var ServiceFee = Backbone.Model.extend({
		idAttribute : "pkAnnualFees"
	});
	
	var ServiceFees = Backbone.Collection.extend({
		model : ServiceFee,
		url : "api/annualfees/queryByMemerAndTimes",
		parse : function(data){
			for(var i in data){
				data[i].beginDateStr = moment(data[i].beginDate).format("YYYY-MM-DD");
				data[i].realAnnualFees = Number(data[i].realAnnualFees).toFixed(2);
			}
			return data;
		}
	});
	
	return {
		Model : ServiceFee,
		Collection : ServiceFees
	};
});