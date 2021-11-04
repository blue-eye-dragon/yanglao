define(["eling","backbone","hbars!./dashboard"],
		function(eling,Backbone,tpl){
	
	var datas = [{color:"red",url:"#apartmentsalescontrol",text:"公寓销控",icon:"icon-th"},
         {color:"orange",url:"#salemonthreport",text:"销售月报",icon:"icon-list-ul"}]
	
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