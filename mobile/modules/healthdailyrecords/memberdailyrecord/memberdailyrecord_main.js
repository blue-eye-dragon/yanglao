define(["eling","backbone","list","hbars!./modules/healthdailyrecords/memberdailyrecord/memberdailyrecord_item"],
		function(eling,Backbone,List,tplItem){
	
	var sidebarInstance = null;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkMemberDailyRecord"
	});
	
	var Collection = Backbone.Collection.extend({
		model : Model,
		url : "api/memberdailyrecord/query",
		load : function(firstResult){
			this.fetch({
				data : {
					member:sidebarInstance.getMember().pkMember,
					fetchProperties : "date,record",
					type : "Health",
					maxResults : 10,
					firstResult : firstResult || 0
				}
			});
		},
		parse : function(data){
			for(var i=0;i<data.length;i++){
				data[i].dateStr = moment(data[i].date).format("YYYY-MM-DD");
			}
			return data;
		}
	});
	
	var View = Backbone.View.extend({
		el : ".J-content",
		initialize : function(){
			var that = this;
			
			this.collection = new Collection();
			this.collection.on("add",this.renderItem,this);
			this.collection.on("reset",this.render,this);
			
			this.$el.off();
			sidebarInstance.off().on("sidebar-member-change",function(){
				that.collection.reset();
				that.collection.load();
			});
		},
		events : {
			"tap .J-showsidebar" : function(){
				sidebarInstance.show();
			}
		},
		render : function(){
			new List({
				parentNode : this,
				headerbar : {
					title : "日常记录"
				},
				list : {
					title : sidebarInstance.getMember().personalInfo.name
				},
				more : function(firstResult){
					this.collection.load(firstResult);
				}
			});
		},
		renderItem : function(model){
			this.$el.find("ul").append(tplItem(model.toJSON()));
		}
	});
	
	var Router = Backbone.Router.extend({
		initialize : function(sidebar){
			sidebarInstance = sidebar;
		},
		routes : {
			":pkPersonalInfo/memberdailyrecord" : "list"
		},
		list : function(){
			var view = new View();
			view.render();
			view.collection.load();
		}
	});
	
	return Router;
});