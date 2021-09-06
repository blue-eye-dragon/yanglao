define(["eling","backbone","hbars!./modules/report/salemonthreport/salemonthreport"],
		function(eling,Backbone,tpl){
	var hasNext, date;
	
	var Model = Backbone.Model.extend({
		url : "api/report/saleMonthReportTotal",
		load : function(){
			eling.loading(true);
			this.fetch({
				data : {
					month : date.format("MM"),
					year : date.format("YYYY")
				},
				success : function(){
					eling.loading(false);
				}
			})
		}
	});
	
	var View = Backbone.View.extend({
		el : "body",
		events : {
			"tap .J-prev" : function(){
				date.subtract(1,"month");
				location.replace("#salemonthreport/query/"+(++hasNext));
			},
			"tap .J-next" : function(){
				date.add(1,"month");
				location.replace("#salemonthreport/query/"+(--hasNext));
			}
		},
		render : function(){
			this.$el.html(tpl({
				date : date.format("YYYY-MM"),
				hasNext : hasNext
			}));
		},
		setValue : function(){
			$(".J-contract-mny").text(this.model.get("contractMny")+"万");
			$(".J-deposit-mny").text(this.model.get("depositMny")+"万");
			$(".J-deposit-num").text(this.model.get("depositNum")+"份");
			$(".J-contract-num").text(this.model.get("contractNum")+"份");
		}
	});
	
	var Router = Backbone.Router.extend({
		routes : {
			"salemonthreport" : "index",
			"salemonthreport/query/:index" : "query"
		},
		index : function(){
			//初始化条件
			hasNext = 0
			date = moment().startOf("month");
			
			//1.初始化视图
			this.view = new View();
			this.view.render();
			
			//2.初始化模型
			this.model = new Model();
			this.model.on("change",this.view.setValue,this.view);
			
			//3.视图模型关联
			this.view.model = this.model;
			
			//4.加载数据
			this.model.load();
			
		},
		query : function(index){
			//1.初始化视图
			this.view.render();
			
			//2.加载数据
			this.model.load();
		}
	});
	
	return Router;
});

