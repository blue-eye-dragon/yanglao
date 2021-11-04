define(function(require,exports,module){
	var Backbone = require("backbone");
	
	
	var Activitysignup = Backbone.Model.extend({
		idAttribute : "pkActivitysignup"
	});
	
	var Activitysignups = Backbone.Collection.extend({
		model : Activitysignup,
		url : "api/activitysignup/queryMemberSignup",
		parse : function(data){
			for(var i=0;i<data.length;i++){
				data[i].startDate=moment(data[i].signup.activity.activityStartTime).format("YYYY年MM月DD日");
				data[i].signup.activity.activityStartTime=moment(data[i].signup.activity.activityStartTime).format("YYYY年MM月DD日HH时mm分");
				data[i].signup.activity.activityEndTime=moment(data[i].signup.activity.activityEndTime).format("YYYY年MM月DD日HH时mm分");
				var interestGroups = "";
				var value=data[i].signup.activity.interestGroups;
				for(var j=0;j<value.length;j++){
					interestGroups += value[j].description+" ";
				}
				data[i].signup.activity.interestTypes=interestGroups;
				
				var members = "";
				var memvalue=data[i].signup.activity.members;
				for(var m=0;m<memvalue.length;m++){
					members += memvalue[m].personalInfo.name+" ";
				}
				data[i].signup.activity.members=members;
				data[i].signup.activity.status=data[i].signup.activity.status!=null?data[i].signup.activity.status.value:"";
			}
		    return data;
		}
	});
	
	return {
		Model : Activitysignup,
		Collection : Activitysignups
	};
});