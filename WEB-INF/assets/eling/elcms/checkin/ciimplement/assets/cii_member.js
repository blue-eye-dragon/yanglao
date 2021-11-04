define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
	var init=function(widget){
		var grid=new Grid({
			parentNode:"#cimemberinfo",
			url:"api/CheckInImplementAndMemberAssessmentView/query",
			autoRender:false,
			params:function(){
				var member=widget.get("baseinfo").getValue("memberSigning");
//				if(member==""){
//					Dialog.alert({
//						content:"未进行会员签约！"
//					});
//				}else{
					return {
						ms:widget.get("baseinfo").getValue("memberSigning"),
						fetchProperties:"member.personalInfo.name,"+
						"member.personalInfo.sex.value,"+
						"member.personalInfo.birthday,"+
						"member.personalInfo.idNumber,"+
						"member.personalInfo.mobilePhone,"+
						"ma.assessmentTime,"+
						"ma.flowStatus",
					};
//				}
			},
			model:{
				columns:[{
					key:"member.personalInfo.name",
					name:i18ns.get("sale_ship_owner","会员"),
				},{
					key:"member.personalInfo.sex.value",
					name:"性别"
				},{
					key:"member.personalInfo.birthday",
					name:"年龄",
					format:"age"
				},{
					key:"member.personalInfo.idNumber",
					name:"证件号",
				},{
					key:"member.personalInfo.mobilePhone",
					name:"电话",
				},{
					key:"ma",
					name:"评估时间",
					format:function(value,row){
						if(row.ma.length>0){
							return moment(row.ma[0].assessmentTime).format("YYYY-MM-DD");
						}else{
							return "";
						}
					}
				},{
					key:"ma",
					name:"评估结果",
					format:function(value,row){
						if(row.ma.length>0){
							return row.ma[0].flowStatus.value;
						}else{
							return "";
						}
					}
				}]
			}
		});
		return grid;
	};
	
	module.exports=init;
});