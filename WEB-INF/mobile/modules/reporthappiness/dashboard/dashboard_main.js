define(["eling","backbone","hbars!./dashboard"],
		function(eling,Backbone,tpl){
	
	var datas = [{color:"purple",url:"#member/search",text:"会员查询",icon:"icon-user"},
	             {color:"blue",url:"#apartmentstatus",text:"公寓入住",icon:"icon-building"},
	             {color:"pink",url:"#memberstatistics",text:"会员统计",icon:"icon-group"}]
	
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