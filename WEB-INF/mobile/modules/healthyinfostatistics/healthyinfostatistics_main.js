define(["backbone","eling","pie","list1"],function(Backbone,eling,pie,list){
	
	var Router = Backbone.Router.extend({
		routes : {
			"" : "dashboard",
			"report/selfCareStatus" : "selfCareStatus",
			"report/medicalInsurance" : "medicalInsurance",
			"report/bloodType" : "bloodType",
			"report/height" : "height",
			"report/weight" : "weight",
			"report/disease" : "disease"
		},
		dashboard : function(){
			require(["modules/healthyinfostatistics/dashboard/dashboard"],function(view){
				view.render();
			});
		},
		selfCareStatus : function(){
			pie.render({
				url : "api/wechat/selfcarestatus",
				pieData : {
					"完全自理" : {color:"#f34541",label: "完全自理"},
					"完全卧床" : {color:"#f8a326",label: "完全卧床"},
					"吃饭需要帮助" : {color:"#49bf67",label: "需要喂食"},
					"完全依赖轮椅出行" : {color:"#FF538B",label: "靠轮椅出行"},
					"能依赖工具独自行走" : {color: "#00A2E8",label: "靠工具行走"},
					"其它选项" : {color:"#9564e2 ",label: "其它选项"},
					"Other" : {color:"#c44a83 ",label: "未统计"}
					},
				isSort : true,
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		medicalInsurance : function(){
			pie.render({
				url : "api/wechat/medicalinsurance",
				pieData : {
					"上海市城镇居民基本医疗保险" : {color:"#f34541",label: "上海居民医保"},
					"上海市城镇职工基本医疗保险" : {color:"#f8a326",label: "上海职工医保"},
					"上海市小城镇基本养老保险" : {color:"#49bf67",label: "上海小城镇养老保险"},
					"上海市民社区医疗互助帮困" : {color:"#E1FA00",label: "上海医疗互帮"},
					"外省市医疗保险异地安置" : {color:"#FF538B",label: "外省市医保异地安置"},
					"离休干部医疗" : {color: "#00A2E8",label: "离休医保"},
					"红卡干部医疗" : {color:"#9564e2 ",label: "红卡医保"},
					"外籍" : {color:"#c44a83 ",label: "外籍"},
					"Other" : {color:"#00FF0D ",label: "其他"},
					},
				isSort : true,
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		bloodType : function(){
			pie.render({
				url : "api/wechat/bloodtype",
				pieData : {
					"A" : {color:"#f34541",label: "A型"},
					"B" : {color:"#f8a326",label: "B型"},
					"AB" : {color:"#49bf67",label: "AB型"},
					"O" : {color:"#E1FA00",label: "O型"},
					"OTHER" : {color:"#00A2E8",label: "其他血型"},
					"Other" : {color:"#FF538B",label: "未录入"},
					},
				isSort : true,
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		height : function(){
			pie.render({
				url : "api/wechat/height",
				pieData : {
					"<150" : {color:"#f34541",label: "150cm以下"},
					"150-159" : {color:"#f8a326",label: "150cm-159cm"},
					"160-169" : {color:"#49bf67",label: "160cm-169cm"},
					"170-179" : {color:"#E1FA00",label: "170cm-179cm"},
					">180" : {color:"#FF538B",label: "180cm以上"},
					"Other" : {color: "#00A2E8",label: "其他"},
					},
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		weight : function(){
			pie.render({
				url : "api/wechat/weight",
				pieData : {
					"<40" : {color:"#f34541",label: "40kg以下"},
					"40-49" : {color:"#f8a326",label: "40kg-49kg"},
					"50-59" : {color:"#49bf67",label: "50kg-59kg"},
					"60-69" : {color:"#E1FA00",label: "60kg-69kg"},
					"70-79" : {color:"#FF538B",label: "70kg-79kg"},
					"80-89" : {color: "#00A2E8",label: "80kg-89kg"},
					"90-99" : {color:"#9564e2 ",label: "90kg-99kg"},
					">100" : {color:"#c44a83 ",label: "100kg以上"},
					"Other" : {color:"#00FF0D ",label: "其他"},
					},
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		disease : function(){
			list.render({
				url : "api/wechat/disease",
				title : "会员疾病统计",
				isSort : true
			});
		}
	});
	
	new Router();
	
	Backbone.history.start();
});