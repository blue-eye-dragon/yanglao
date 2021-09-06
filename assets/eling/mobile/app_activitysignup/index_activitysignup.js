define(function(require,exports,module){
	
	// 活动报名模型
	var Activitysignup = require("eling/mobile/app_activitysignup/model_activitysignup");
	var MemberActivitysignupNum = require("eling/mobile/app_activitysignup/model_memberactivitysignupnum");
	
	var activitysignupTPL = require("text!eling/mobile/app_activitysignup/view_list_item.html");
	
	//引入其他模块（关联人）
	var RelativePerson = require("eling/mobile/relativeperson/relativeperson");
	
	//初始化依赖模块（关联人）
	var relativePerson = new RelativePerson();
	
	var result=true;
	
	var loading=false;
	
	//定义自定义模块
	var QueryCondition = Backbone.Model.extend({
		
		defaults : {
			member : relativePerson.getDefault(),
		},
		
		
		//@test
		getParams_Activitysignup : function(firstResult){
			return {
				pkMember : this.get("member").pkMember,
				maxResults : 15,
				firstResult : firstResult,
				fetchProperties:"pkActivitysignup," +
					"start,notStart," +
					"signup.activity.theme," +
					"signup.activity.activitySite," +
					"signup.activity.activityStartTime," +
					"signup.activity.activityEndTime," +
					"signup.activity.type," +
					"signup.activity.scope.value," +
					"signup.activity.members," +
					"signup.activity.interestGroups," +
					"signup.activity.interestGroups.description," +
					"signup.activity.status.value," +
					"signup.activity.members," +
					"signup.activity.members.personalInfo.name"
			};
		},
		
		getParams_MemberActivitysignupNum : function(){
			return {
				pkMember : this.get("member").pkMember,
				fetchProperties:"num"
			};
		}
		
	});
	
	//framework7工具类
	var fw7 = require("f7");
	// 日期处理
	require("moment");
	
	var ELMView = require("elmview");
	
	//利用Backbone.View进行视图扩展
	var app = new ELMView({
		id : "app_activitysignup",
		model : {
			activitysignup : new Activitysignup.Collection(),
			memberactivitysignupnum : new MemberActivitysignupNum.Model(),
			queryCondition : new QueryCondition()
			
		},
		listener : {
			"add activitysignup" : "render_activitysignup",
			"change queryCondition" : "reload"
		},
		
		setup : function(widget){
			this.render("view_activitysignup_list.html",{
				personalInfo : this.model.queryCondition.get("member").personalInfo,
			});
		},
		
		initComponent : function(widget){
			var queryCondition = this.model.queryCondition;
			
			Dom7('.panel-left').on('close', function () {
				queryCondition.set("member",relativePerson.getDefault());
			});
			Dom7('.infinite-scroll').on('infinite', function(){
				if(loading) return;
				loading=true;
				if(result){
					widget.getActivitysignup(Dom7('.J-detail-container .J-detail').length);
				}
//				else{
//					Dom7('.infinite-scroll-preloader').remove();
//				}
				
			});
			
		},
		
		afterInitComponent : function(widget){
			this.load(0);
		},
		
		/******************服务器交互********************* */
		load : function(firstResult){
			this.getActivitysignup(firstResult);
			this.getSize();
		},
		
		reload : function(){
			this.refresh("view_activitysignup_list.html",this.model.queryCondition.get("member"));
			this.load(0);
		},
		
		//@test
		getActivitysignup : function(firstResult){
			this.model.activitysignup.fetch({
				data : this.model.queryCondition.getParams_Activitysignup(firstResult),
				success : function(data){
					loading=false;
					if(data.length==15){
						result=true;
					}else{
						result=false;
						Dom7('.infinite-scroll-preloader').remove();
					}
				} 
			});
		},
		getSize : function(){
			this.model.memberactivitysignupnum.fetch({
				data : this.model.queryCondition.getParams_MemberActivitysignupNum(),
				success : function(data){
					$('.page-content .title').text("活动报名列表("+data.id+")")
				}
			});
		},
		
		
		
		/*************视图**************/
		render_activitysignup : function(model){
			Dom7(".J-detail-container").append(Template7.compile(activitysignupTPL)(model.toJSON()));
//			this.refresh("view_activitysignup_list.html",{
//				personalInfo : this.model.queryCondition.get("member").personalInfo,
//				datas : this.model.activitysignup.toJSON(),
//			});
		},
		
		events : {
//			"tap .J-goback" : function(){
//				this.back({
//					url : "view_activitysignup_list.html"
//				});
//			}
		}
	});
	
	return app;
});