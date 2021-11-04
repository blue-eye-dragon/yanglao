define(["hbars!./dashboard"],function(tpl){
	
	return {
		render : function(){
			$("body").html(tpl([{
				name : "性别",icon : "user",color : "blue",url : "report/membersex"
			},{
				name : "年龄",icon : "calendar",color : "green",url : "report/memberage"
			},{
				name : "政治面貌",icon : "file-text",color : "pink",url : "report/politicialStatus"
			},{
				name : "婚姻状况",icon : "group",color : "blue", url : "report/maritalStatus"
			},{
				name : "学历",icon : "star",color : "green", url :"report/qualifications"
			},{
				name : "民族",icon : "file",color : "banana", url : "report/ethnic"
			},{
				name : "籍贯",icon : "home",color : "orange", url : "report/nativeplace"
			},{
				name : "国籍",icon : "flag",color : "purple", url : "report/citizenship"
			}]));
		}
	};
});
