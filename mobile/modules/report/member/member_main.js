define(["eling","backbone","hbars!./modules/report/member/list","hbars!./modules/report/member/detail"],function(eling,Backbone,tpl,tplDetail){
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkMember"
	});
	
	var Collection = Backbone.Collection.extend({
		model : Model,
		url:"api/member/search",
		parse : function(datas){
			for(var i=0;i<datas.length;i++){
				datas[i].sexClass = datas[i].personalInfo.sex.key.toLowerCase();
				datas[i].isMale = datas[i].personalInfo.sex.key == "MALE" ? true : false;
				datas[i].age = moment().diff(datas[i].personalInfo.birthday, 'years');
				datas[i].checkInDateStr = moment(datas[i].memberSigning.checkInDate).format("YYYY-MM-DD");
			}
			return datas;
		},
		search : function(s){
			eling.loading(true);
			this.fetch({
				reset : true,
				data:{
					s:s,
					searchProperties:"memberSigning.room.number,personalInfo.name,personalInfo.sex,",
					statusIn : "Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
					fetchProperties: "pkMember,personalInfo.pkPersonalInfo,personalInfo.mobilePhone,personalInfo.phone," +
							"personalInfo.name,personalInfo.birthday,memberSigning.room.number,personalInfo.nativePlace.fullName," +
					"memberSigning.annualFee,memberSigning.checkInDate,memberSigning.card.cardType.cardTypeMoney,personalInfo.sex,status"
				},
				success:function(){
					eling.loading(false);
				}
			});
		}
	});
	
	var View = Backbone.View.extend({
		el : "body",
		events : {
			"tap .icon-search" : function(e){
				var s = $("input.J-member-search").val();
				this.collection.search(s);
			}
		},
		render : function(){
			this.$el.html(tpl({
				datas : this.collection.toJSON()
			}));
		},
		detail : function(member){
			this.$el.html(tplDetail(member));
		}
	});
	
	var Router = Backbone.Router.extend({
		routes : {
			"member/search" : "index",
			"member/search/:str" : "search",
			"member/detail/:pkMember" : "detail"
		},
		index : function(){
			//1.初始化视图
			this.view = new View();
			
			//2.初始化模型
			this.collection = new Collection();
			this.collection.on("reset",this.view.render,this.view);
			
			//3.模型和数据绑定
			this.view.collection = this.collection;
			
			//4.渲染视图
			this.view.render();
		},
		search : function(str){
			this.collection.search(str);
		},
		detail : function(pkMember){
			var member = this.collection.get(pkMember);
			this.view.detail(member.toJSON());
		}
	});
	
	return Router;
	
});