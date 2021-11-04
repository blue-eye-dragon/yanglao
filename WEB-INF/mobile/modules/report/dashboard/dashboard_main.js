define(["eling","backbone","hbars!./modules/report/dashboard/dashboard"],
		function(eling,Backbone,tpl){
	
	var datas = [{color:"red",url:"#apartmentsalescontrol",text:"公寓销控",icon:"icon-th"},
         {color:"orange",url:"#salemonthreport",text:"销售月报",icon:"icon-list-ul"},
         {color:"green",url:"#annualfeemonthstatistics",text:"服务费月报",icon:"icon-list-ol"},
         {color:"blue",url:"#apartmentstatus",text:"公寓入住",icon:"icon-building"},
         {color:"pink",url:"#memberstatistics",text:"会员统计",icon:"icon-group"},
         {color:"purple",url:"#member/search",text:"会员查询",icon:"icon-user"},
         {color:"muted",url:"#dead/list",text:"会员过世",icon:"icon-ambulance"}]
	
	var View = Backbone.View.extend({
		el : "body",
		initialize : function(){
			this.$el.off();
		},
		events : {
			"tap .J-dashboard-item" : function(e){
				var $el = $(e.target).is("a") ? $(e.target) : $(e.target).parents(".J-dashboard-item");
				var text = $el.find(".content").text();
				$("title").text(text);
			}
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
			$("title").text("公寓报表");
			new View().render();
		}
	});
	
	return Router;
});