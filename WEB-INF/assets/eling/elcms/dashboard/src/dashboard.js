define(function(require, exports, module) {
	var ELView = require("elview");
	var Handlebars = require("handlebars");
	
	require("../css/dashboard.css");
	
	var tools = require("tools");
	
	Handlebars.registerHelper("dashboard_bottom_item",function(config,options){
		var color = config.color || "";
		var icon = config.icon || "";
		var text = config.text || "";
		var value = config.value === undefined || config.value === null ? "" : config.value;
		return "<div class='box-content box-statistic el-dashboard-bottom-item'>" + 
				"<h3 class='title "+color+" text-left'>"+value+"</h3>"+
				"<span>"+text+"</span>"+
				"<div class='"+color+" "+icon+" align-right'></div>"+
				"</div>";
	});
	
	var bottomConfigs = {};
	
	var Dashboard = ELView.extend({
		attrs : {
			template : require('./dashboard.tpl'),
			autoRender:true,
			model:{
				top:{
					columnClass:"col-xs-4 col-sm-2"
				}
			}
		},
		events : {
			"click .J-dashboard-top-item" : function(e){
				var model = this.get("model");
				var top = model.top || {};
				var items = top.items || [];
				var index = $(e.target).parents(".J-dashboard-top-item").prevAll().size();
				var item = items[index];
				
				var queryParams = item.params;
				if(tools.isFunction(queryParams)){
					queryParams = queryParams();
				}
				
				if(typeof item.handler === "function"){
					item.handler(item.url,queryParams);
				}else{
					this.openView({
						url:item.url,
						params:queryParams,
						forward:item.forward,
						isAllowBack:true
					});
				}
			}
		},
		loading : function(id){
			this.$(".J-dashboard-bottom-item-"+id+" h3.title").empty().addClass("loading");
      const width = this.$(".header").width()
      console.log('width ===  >', width);
		},
		renderItem : function(option,type){
			this.$(".J-dashboard-"+type+"-item-"+option.id).html
				(Handlebars.compile("{{#dashboard_bottom_item this}}{{/dashboard_bottom_item}}")(option));
		},
		setValue : function(id,value){
			this.$(".J-dashboard-bottom-item-"+id+" h3.title").removeClass("loading").text(value);
		}
		
	});

	module.exports = Dashboard;

});