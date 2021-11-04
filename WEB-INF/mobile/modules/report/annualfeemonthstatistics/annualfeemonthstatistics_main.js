define(["eling","backbone","hbars!./modules/report/annualfeemonthstatistics/annualfeemonthstatistics"],
		function(eling,Backbone,tpl){
	var hasNext, start, end;
	
	var Model = Backbone.Model.extend({
		url : "api/report/annualFeeMonthCount",
		load : function(){
			eling.loading(true);
			this.fetch({
				data : {
					start : start.startOf("month").valueOf(),
					end : end.endOf("month").valueOf()
				},
				success : function(){
					eling.loading(false);
				}
			})
		},
		parse : function(data){
			var datas = {
				"ToCharge_num" : {color : "red", text : "应收", value : 0},
				"ToCharge_mny" : {color : "red", text : "应收", value : 0},
				"UnCharge_num" : {color : "blue", text : "未收", value : 0},
				"UnCharge_mny" : {color : "blue", text : "未收", value : 0},
				"Charged_num" : {color : "green", text : "已收费未到账", value : 0},
				"Charged_mny" : {color : "green", text : "已收费未到账", value : 0},
				"Receiving_num" : {color : "orange", text : "到账", value : 0},
				"Receiving_mny" : {color : "orange", text : "到账", value : 0},
			};
			for(var i in data){
				datas[i].value = data[i];
			}
			return {
				date : start.format("YYYY-MM"),
				datas : datas,
				hasNext : hasNext
			};
		}
	});
	
	var View = Backbone.View.extend({
		el : "body",
		events : {
			"tap .J-prev" : function(){
				start.subtract(1,"month").startOf("month");
				end.subtract(1,"month").endOf("month");
				location.replace("#annualfeemonthstatistics/query/"+(++hasNext));
			},
			"tap .J-next" : function(){
				start.add(1,"month").startOf("month");
				end.add(1,"month").endOf("month");
				location.replace("#annualfeemonthstatistics/query/"+(--hasNext));
			}
		},
		render : function(){
			this.$el.html(tpl(this.model.toJSON()));
		}
	});
	
	var Router = Backbone.Router.extend({
		routes : {
			"annualfeemonthstatistics" : "index",
			"annualfeemonthstatistics/query/:index" : "query"
		},
		index : function(){
			//0.初始化条件
			hasNext = 0;
			start = moment();
			end = moment();
			
			//1.初始化视图
			this.view = new View();
			
			//2.初始化模型
			this.model = new Model();
			this.model.on("change",this.view.render,this.view);
			
			//3.模型和视图关联
			this.view.model = this.model;
			
			//4.加载数据
			this.model.load();
		},
		query : function(index){
			this.model.load();
		}
	});
	
	return Router;
});