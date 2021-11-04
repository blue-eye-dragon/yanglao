define(["eling","backbone","list","hbars!./modules/healthdailyrecords/medicalrecords/medicalrecords_list",
        "hbars!./modules/healthdailyrecords/medicalrecords/medicalrecords_detail"],
		function(eling,Backbone,List,tplItem,tplDetail){
	
	var sidebarInstance = null;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkMedicalRecords"
	});
	
	var Collection = Backbone.Collection.extend({
		initialize : function(options){
			this.options = options;
		},
		model : Model,
		url : "api/medicalrecords/query",
		load : function(firstResult){
			this.fetch({
				data : {
					member:sidebarInstance.getMember().pkMember,
					orderString:"date:desc",
					type : "就诊记录",
					fetchProperties:"*,diseaseDetails.*,hospital.name,member.personalInfo.name",
					maxResults : 10,
					firstResult : firstResult || 0
				}
			});
		},
		parse:function(data){
			for(var i=0;i<data.length;i++){
				data[i].dateStr = moment(data[i].date).format("YYYY-MM-DD");
				data[i].url = "#"+this.options.pkPersonalInfo+"/medicalrecords/"+data[i].pkMedicalRecords;
			}
			return data;
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
					title : "就诊记录"
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
			":pkPersonalInfo/medicalrecords" : "list",
			":pkPersonalInfo/medicalrecords/:pkMedicalRecords" : "detail"
		},
		list : function(pkPersonalInfo){
			var view = new View({pkPersonalInfo : pkPersonalInfo});
			view.render();
			view.collection.load();
			this.view = view;
		},
		detail : function(pkPersonalInfo,pkMedicalRecords){
			if(this.view){
				this.view.$el.html(tplDetail(this.view.collection.get(pkMedicalRecords).toJSON()));
			}else{
				this.navigate("#"+pkPersonalInfo+"/medicalrecords",{trigger:true,replace:true});
			}
		}
	});
	
	return Router;
});
