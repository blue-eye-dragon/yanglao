define(["backbone","eling","pie","list1"],function(Backbone,eling,pie,list){
	var Router = Backbone.Router.extend({
		routes : {
			"" : "dashboard",
			"report/membersex" : "membersex",
			"report/memberage" : "memberage",
			"report/politicialStatus" : "politicialStatus",
			"report/maritalStatus" : "maritalStatus",
			"report/qualifications" : "qualifications",
			"report/ethnic" : "ethnic",
			"report/citizenship" : "citizenship",
			"report/nativeplace" : "nativeplace"
		},
		dashboard : function(){
			require(["modules/memberinfostatistics/dashboard/dashboard"],function(view){
				view.render();
			});
		},
		membersex : function(){
			pie.render({
				url : "api/wechat/membersex",
				pieData : {
					MALE : {color: "#00A2E8",label: "男会员"},
					FEMALE : {color:"#FF538B",label: "女会员"}
				},
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		memberage : function(){
			pie.render({
				url : "api/wechat/memberage",
				pieData : {
					"95-99" : {color:"#f34541",label: "95-99"},
					"90-94" : {color:"#f8a326",label: "90-94"},
					"85-89" : {color:"#49bf67",label: "85-89"},
					"80-84" : {color:"#FF538B",label: "80-84"},
					"75-79" : {color: "#00A2E8",label: "75-79"},
					"70-74" : {color:"#E1FA00",label: "70-74"},
					"65-69" : {color:"#c44a83",label: "65-69"},
					"60-64" : {color:"#9564e2",label: "60-64"},
					"55-59" : {color:"#00FF0D",label: "55-59"},
					"50-54" : {color:"#FF6B00",label: "<55"},
					"100" : {color:"#00FFFF",label: ">100"}
				},
				css : {
					".pie-container" : {"margin-top" : "20px"}
				}
			});
		},
		politicialStatus : function(){
			pie.render({
				url : "api/wechat/memberPoliticalStatus",
				pieData : {
					"GCD" : {color:"#f34541",label: "共产党"},
					"GMDGMWYH" : {color:"#f8a326",label: "国民党"},
					"MZTM" : {color:"#49bf67",label: "民主同盟"},
					"MZJGH" : {color:"#FF538B",label: "民建会"},
					"MZCJH" : {color: "#00A2E8",label: "民促会"},
					"NGMZD" : {color:"#9564e2 ",label: "民主党"},
					"ZGD" : {color:"#c44a83 ",label: "致公党"},
					"JSXS" : {color:"#9564e2 ",label: "九三学社"},
					"TWMZZZTM" : {color:"#E1FA00 ",label: "自治同盟"},
					"QZ" : {color:"#FF6B00 ",label: "群众"},
					"OTHER" : {color:"#00FF0D ",label: "其他"}
				},
				isSort : true,
				css : {
					".pie-container" : {"margin-top" : "20px"}
				}
			});
		},
		maritalStatus : function(){
			pie.render({
				url : "api/wechat/memberMaritalStatus",
				pieData : {
					"Unmarried" : {color:"#f8a326",label: "未婚"},
					"Married" : {color:"#f34541",label: "已婚"},
					"Remarry" : {color:"#49bf67",label: "再婚"},
					"Divorced" : {color:"#FF538B",label: "离异"},
					"Widowed" : {color: "#00A2E8",label: "丧偶"},
					"Other" :{color: "#9564e2",label: "其他"}
				},
				isSort : true,
				css : {
					".pie-container" : {"margin-top" : "20px"}
				}
			});
		},
		qualifications : function(){
			pie.render({
				url : "api/wechat/qualifications",
				pieData : {
					"SmallSchool" : {color:"#f8a326",label: "小学"},
					"HighSchool" : {color:"#f34541",label: "中学"},
					"PolytechnicSchool" : {color:"#49bf67",label: "中专"},
					"HigherVocationalEducation" : {color:"#FF538B",label: "高职"},
					"JuniorCollege" : {color: "#00A2E8",label: "大专"},
					"RegularCollegeCourse" : {color:"#c44a83 ",label: "本科"},
					"Master" : {color:"#9564e2 ",label: "硕士"},
					"Doctor" : {color:"#E1FA00 ",label: "博士"},
					"No" : {color:"#FF6B00 ",label: "无"},
					"Other" :{color: "#00FF0D",label: "其他"}
				},
				css : {
					".pie-container" : {"margin-top" : "20px"}
				}
			});
		},
		ethnic : function(){
			list.render({
				url : "api/wechat/ethnic",
				params : {
					statusIn : "Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized"
				},
				title : "会员民族统计",
				cols : {
					label : "4",
					text : "4",
					percent : "4"
				},
			    isSort : true
			});
		},
		citizenship : function(){
			list.render({
				url : "api/wechat/citizenship",
				params : {
					statusIn : "Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized"
				},
				title : "会员国籍统计",
				isSort : true
			});
		},
		nativeplace : function(){
			list.render({
				url : "api/wechat/nativeplace",
				title : "会员籍贯统计",
				isSort : true
			});
		}
	});
	
	new Router();
	
	Backbone.history.start();
});