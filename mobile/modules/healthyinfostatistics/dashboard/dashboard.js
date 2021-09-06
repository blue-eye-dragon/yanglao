define(["hbars!./dashboard"],function(tpl){
	
	return {
		render : function(){
			$("body").html(tpl([{
				name : "疾病",icon : "user",color : "blue",url : "report/disease"
			},{
				name : "自理状态",icon : "home",color : "orange", url :"report/selfCareStatus"
			},{
				name : "医保类型",icon : "building",color : "red", url :"report/medicalInsurance"
			},{
				name : "身高",icon : "flag",color : "purple", url : "report/height"
			},{
				name : "体重",icon : "file-text",color : "pink", url : "report/weight"
			},{
				name : "血型",icon : "file-text",color : "pink", url : "report/bloodType"
			}]));
		}
	};
});
