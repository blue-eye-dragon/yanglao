define(["eling","backbone","list",
        "hbars!./modules/healthdailyrecords/patient/patient_list",
        "hbars!./modules/healthdailyrecords/patient/patient_detail"],
		function(eling,Backbone,List,tplItem,tplDetail){
	
	var sidebarInstance = null;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkPatientRegistration"
	});
	
	var Collection = Backbone.Collection.extend({
		initialize : function(options){
			this.options = options;
		},
		model : Model,
		url : "api/patientregistration/query",
		load : function(firstResult){
			this.fetch({
				data : {
					member:sidebarInstance.getMember().pkMember,
					fetchProperties : "pkPatientRegistration,member.personalInfo.name," +
							"hospital.name,status,departmentsSickbed,disease,afterTreatment,dischargeDiagnosis,backDrug,doctorAdvised",
					maxResults : 10,
					firstResult : firstResult || 0
				}
			});
		},
		parse:function(data){
			for(var i=0;i<data.length;i++){
				data[i].dateStr = moment(data[i].checkInDate).format("YYYY-MM-DD");
				data[i].url = "#"+this.options.pkPersonalInfo+"/patient/"+data[i].pkPatientRegistration;
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
					title : "住院记录"
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
			":pkPersonalInfo/patient" : "list",
			":pkPersonalInfo/patient/:pkPatientRegistration" : "detail"
		},
		list : function(pkPersonalInfo){
			var view = new View({pkPersonalInfo : pkPersonalInfo});
			view.render();
			view.collection.load();
			this.view = view;
		},
		detail : function(pkPersonalInfo,pkPatientRegistration){
			if(this.view){
				this.view.$el.html(tplDetail(this.view.collection.get(pkPatientRegistration).toJSON()));
			}else{
				this.navigate("#"+pkPersonalInfo+"/patient",{trigger:true,replace:true});
			}
		}
	});
	
	return Router;
});
