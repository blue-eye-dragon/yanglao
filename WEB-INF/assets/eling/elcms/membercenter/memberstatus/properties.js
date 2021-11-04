define(function(require,exports,module){
	var Propertie={
		mem_baseinfo:"*,"+
			"personalInfo.name,"+
			"personalInfo.sex,"+
		    "personalInfo.birthday,"+
		    "personalInfo.phone,"+
		    "personalInfo.mobilePhone,"+
		    "memberSigning.room.pkRoom,"+
		    "memberSigning.checkInDate,"+
		    "memberSigning.room.number,"+
		    "memberSigning.room.telnumber,"+
		    "memberSigning.ecPersons.personalInfo.name,"+
		    "memberSigning.ecPersons.personalInfo.phone,"+
		    "memberSigning.ecPersons.personalInfo.mobilePhone," +
		    "memberSigning.card.pkMemberShipCard"
	};
	
	module.exports=Propertie;
});