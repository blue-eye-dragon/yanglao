define(["backbone","eling","pie","list1"],function(Backbone,eling,pie,list){
	
	var Router = Backbone.Router.extend({
		routes : {
			"" : "dashboard",
			"report/interest" : "interest",
			"report/amusement" : "amusement",
			"report/holiday" : "holiday"
		},
		dashboard : function(){
			require(["modules/happyinfostatistics/dashboard/dashboard"],function(view){
				view.render();
			});
		},
		interest : function(){
			list.render({
				url : "api/wechat/interest",
				title : "兴趣爱好统计",
				isSort : true,
				cols : {
					label : "4",
					text : "4",
					percent : "4"
				}
			});
		},
		amusement : function(){
			list.render({
				url : "api/wechat/amusement",
				title : "休闲娱乐统计",
				isSort : true,
				cols : {
					label : "4",
					text : "4",
					percent : "4"
				}
			});
		},
		holiday : function(){
			list.render({
				url : "api/wechat/holiday",
				title : "节日统计",
				isSort : true,
				cols : {
					label : "4",
					text : "4",
					percent : "4"
				}
			});
		}
	});
	
	new Router();
	
	Backbone.history.start();
});