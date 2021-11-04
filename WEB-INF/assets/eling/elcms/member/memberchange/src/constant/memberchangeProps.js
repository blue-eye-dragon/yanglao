	define(function (require, exports, module) {
    module.exports = {
    		getProperties :function(str){
    			switch (str) {
				case "fetchProperties":
					return "memberSigning.room.number,memberSigning.pkMemberSigning,memberSigning.version,memberSigning.signDate,memberSigning.checkInDate,memberSigning.room.building.name," +
							"memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.personalCardowners.personalInfo.name," +
							"changeMemberItems.pkChangeMemberItem,changeMemberItems.version,changeMemberItems.changeTime,"+
							"changeMemberItems.member.personalInfo.name,changeMemberItems.member.pkMember," +
							"changeMemberItems.pkChangeMemberItem,changeMemberItems.version," +
							"changeMemberItems.assessmentDetail.personalInfo.name," +
							"changeMemberItems.assessmentDetail.pkMemberAssessmentDetail," +
							"changeMemberItems.assessmentDetail.version," +
							"carryOver,changeDate,carOverFees,newCheckInDate,hisAnnualFees,version," +
							"pkChangeMember,status,content,operator.pkUser,operator.name"
					break;
				case "searchProperties":
					return "memberSigning.room.number,memberSigning.room.building.name," +
							"changeMemberItems.member.personalInfo.name," +
							"changeMemberItems.assessmentDetail.personalInfo.name," +
							"carOverFees,newAnnualFees,"
					break;
				default:
					break;
    			}
    		} ,
    		list2Card :function(widget,flag){
    			if(flag){
    				widget.show([".J-form",".J-membergrid"]).hide([".J-grid"]);
    				widget.get("subnav").show(["save","return"]).hide(["status","search","time","add"]);
    			}else{
    				widget.show([".J-grid"]).hide([".J-form",".J-membergrid"]);
    				widget.get("subnav").show(["status","search","time","add"]).hide(["save","return"]);
    			}
    		}
    };
});
