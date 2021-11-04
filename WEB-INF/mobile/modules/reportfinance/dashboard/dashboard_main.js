define(["eling","backbone","hbars!./dashboard"],
		function(eling,Backbone,tpl){
	
	var datas = [{color:"green",url:"#annualfeemonthstatistics",text:"服务费月报",icon:"icon-list-ol"}]
	
	var View = Backbone.View.extend({
		el : "body",
		initialize : function(){
			this.$el.off();
		},
		render : function(){
			this.$el.html(tpl(datas));
		}
	});
	
	var Router = Backbone.Router.extend({
		routes : {
			"dashboard" : "index"
		},
		index : function(){
			new View().render();
		}
	});
	
	return Router;
});