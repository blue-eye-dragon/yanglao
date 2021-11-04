define(function(require,exports,module){
	var Backbone = require("backbone");
	
	var styles = {
		"1" : {icon:"icon-bolt",color:"blue"},
		"2" : {icon:"icon-bolt",color:"blue"},
		"3" : {icon:"icon-tint",color:"green"},
		"4" : {icon:"icon-tint",color:"green"},
		"5" : {icon:"icon-tint",color:"green"},
		"6" : {icon:"icon-phone",color:"orange"},
		"7" : {icon:"icon-hdd",color:"orange"},
		"8" : {icon:"icon-rss",color:"orange"},
		"9" : {icon:"icon-arrow-down",color:"orange"},
		"10" : {icon:"icon-arrow-up",color:"orange"}
	};
	
	var GeneraFee = Backbone.Model.extend({
		idAttribute : "pkGeneralFees"
	});
	
	var GeneraFees = Backbone.Collection.extend({
		model : GeneraFee,
		url : "api/generalfees/queryByPkMember",
		parse : function(datas){
			datas = _.sortBy(datas,function(data){return -data.feeMonth});
			for(var i in datas){
				datas[i].date = moment(datas[i].feeMonth).format("YYYY-MM-DD");
				datas[i].generalFeesDetails = _.sortBy(datas[i].generalFeesDetails,function(data){return data.feeType.number});
				for(var j=0; j<datas[i].generalFeesDetails.length ; j++){
    				datas[i].generalFeesDetails[j].icon = styles[datas[i].generalFeesDetails[j].feeType.number].icon;
	    			datas[i].generalFeesDetails[j].color = styles[datas[i].generalFeesDetails[j].feeType.number].color;
	    			datas[i].generalFeesDetails[j].pkGeneralFees = datas[i].pkGeneralFees;
	    			
    				if(datas[i].generalFeesDetails[j].payStatus.key == "Paid"){
	    				datas[i].generalFeesDetails[j].status = true;
	    			}else if(datas[i].generalFeesDetails[j].payStatus.key == "UnPaid"){
	    				datas[i].generalFeesDetails[j].notStatus = true;
	    			}
    				
    				if(datas[i].generalFeesDetails[j].fees == null){
    					datas[i].generalFeesDetails[j].fees = 0.00;
    				}
    				
    				datas[i].generalFeesDetails[j].fees = Number(datas[i].generalFeesDetails[j].fees).toFixed(2);
    			}
			}
			return datas;
		}
	});
	
	return {
		Model : GeneraFee,
		Collection : GeneraFees
	};
});