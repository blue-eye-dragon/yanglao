define(function(require,exports,module){
	var i18ns = require("i18n");
	var AdvanceAndAloneConfig={
		fetchProperties:"*," +
			"building.name," +
			"building.version," +
			"member.memberSigning.room.number," +
			"member.personalInfo.name",
		typeString:{
			"AdvancedAge" : "高龄"+i18ns.get("sale_ship_owner","会员")+"关照",
			"LivingAlone" : "独居"+i18ns.get("sale_ship_owner","会员")+"关怀"
		},
		addShowFlag:{
			"AdvancedAge" : false,
			"LivingAlone" : false
		} 
	};
	
	module.exports=AdvanceAndAloneConfig;
});