define(["eling","backbone","hbars!./modules/report/memberstatistics/memberstatistics"],
		function(eling,Backbone,tpl){
	
	var data = {
		"normal" : {id : "normal", color : "blue", text : "入住", value : 0},
		"inCommunity" : {id : "inCommunity", color : "blue", text : "在园", value : 0},
		"out" : {id : "out", color : "orange", text : "外出", value : 0},
		"nursing" : {id : "nursing", color : "pink", text : "颐养", value : 0},
		"behospitalized" : {id : "behospitalized", color : "green", text : "住院", value : 0},
		"nursingandbehospitalized" : {id : "nursingandbehospitalized", color : "banana", text : "颐养且住院", value : 0},
		"alone" : {id : "alone", color : "blue", text : "独居", value : 0},
		"advanceage" : {id : "advanceage", color : "purple", text : "高龄", value : 0}
	};
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkMember",
		url : "api/member/queryMembersCountByStatus",
		load : function(){
			eling.loading(true);
			this.fetch({
				data : {
					useType:"Apartment"
				},
				success : function(){
					eling.loading(false);
				}
			});
		}
	});

	var View = Backbone.View.extend({
		el : "body",
		render : function(){
			var models = this.model.toJSON();
			for(var i in models){
				data[i].value = models[i]
			}
			this.$el.html(tpl({datas : data}));
		}
	});
	
	var view = new View();
	
	var Router = Backbone.Router.extend({
		routes : {
			"memberstatistics" : "index"
		},
		index : function(){
			//1.初始化视图
			this.view = new View();
			
			//2.初始化模型
			this.model = new Model();
			this.model.on("change",this.view.render,this.view);
			
			//3.模型和数据关联
			this.view.model = this.model;
			
			//4.渲染视图
			this.view.render();
			
			//5.加载数据
			this.model.load();
		}
	});
	
	return Router;
});

