define(["eling","backbone","list",
         "hbars!./modules/healthdailyrecords/nextexam/nextexam_list"],
		function(eling,Backbone,List,tplItem){
	
	var sidebarInstance = null;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkExaminationRecord"
	});
	
	var Collection = Backbone.Collection.extend({
		initialize : function(options){
			this.options = options;
		},
		model : Model,
		url : "api/examrecord/query",
		load : function(firstResult){
			this.fetch({
				data : {
					member:sidebarInstance.getMember().pkMember,
					fetchProperties : "pkExaminationRecord,date,doctor,hospital.name," +
							"diseaseDetail.name,member.personalInfo.name,etcommdata.name",
					maxResults : 10,
					firstResult : firstResult || 0
				}
			});
		},
		parse:function(datas){
			for(var i=0;i<datas.length;i++){
				if(datas[i].date){
					datas[i].dateStr = moment(datas[i].date).format("YYYY-MM-DD");
				}
				datas[i].url = "#"+this.options.pkPersonalInfo+"/nextexam/"+datas[i].pkExaminationRecord;
			}
			return datas;
		}
	});
	
	var View = Backbone.View.extend({
		el : ".J-content",
		initialize : function(options){
			var that = this;
			
			this.collection = new Collection({pkPersonalInfo : options.pkPersonalInfo});
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
					title : "复诊提醒"
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
			":pkPersonalInfo/nextexam" : "list"
		},
		list : function(pkPersonalInfo){
			var view = new View({pkPersonalInfo : pkPersonalInfo});
			view.render();
			view.collection.load();
		}
	});
	
	return Router;
});