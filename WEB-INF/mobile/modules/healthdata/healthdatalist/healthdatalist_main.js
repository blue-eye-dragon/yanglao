define(["eling","backbone",
    "hbars!./modules/healthdata/healthdatalist/healthdatalist",
    "hbars!./modules/healthdata/healthdatalist/healthdatalist_item"],
    function(eling,Backbone,tpl,tplItem){
	
	var hasNext = 0;
	var pkPersonal = null;
	var routerInstance = null;
	var sidebarInstance = null;
	var types = null;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkHealthExamData"
	});
	
	var Collection = Backbone.Collection.extend({
		model : Model,
		url : "api/healthexamdata/query",
		parse : function(datas){
    		for(var i=0;i<datas.length;i++){
				datas[i].date=moment(datas[i].createDate).format("MM-DD");
			}
			return datas;
		},
		load : function(){
			eling.loading(true);
			this.fetch({
				data : {
					pkHealthExamDataTypes : types,
					member:sidebarInstance.getMember().pkMember,
					createDate:moment().subtract(hasNext,"month").startOf("month").valueOf(),
					createDateEnd:moment().subtract(hasNext,"month").endOf("month").valueOf(),
					fetchProperties:"pkHealthExamData,description,createDate,type.pkHealthExamDataType," +
						"type.name,member.pkMember,value1,value2,value3,value4,value5,value6"
				},
				success : function(){
					eling.loading(false);
				}
			});
		}
	});
	
	var View = Backbone.View.extend({
		el : ".J-content",
		initialize : function(){
			var collection = new Collection();
			this.collection = collection;
			this.collection.on("add",this.renderItem,this);
			this.collection.on("reset",this.reset,this);
			
			this.$el.off();
			sidebarInstance.off().on("sidebar-member-change",function(){
				collection.reset();
				collection.load();
			});
			
		},
		events : {
			"tap .J-prev" : function(){
				hasNext = hasNext+1;
				routerInstance.navigate("#"+pkPersonal+"/list/"+hasNext+"/"+types,{trigger : true,replace : true});
			},
			"tap .J-next" : function(){
				hasNext = hasNext-1;
				routerInstance.navigate("#"+pkPersonal+"/list/"+hasNext+"/"+types,{trigger : true,replace : true});
			}
		},
		renderItem : function(model){
			this.$el.find("ul").append(tplItem(model.toJSON()));
		},
		render:function(date){
			this.$el.html(tpl({
				date : moment().subtract(hasNext,"month").format("YYYY-MM"),
				hasNext : hasNext
			}));
		},
		reset: function(){
			this.$el.find("ul").empty();
		}
	});
	
	var Router = Backbone.Router.extend({
		initialize : function(sidebar){
			routerInstance = this;
			sidebarInstance = sidebar;
		},
		routes : {
			":pkPersonalInfo/list/:date/:types" : "index"
		},
		index : function(pkPersonalInfo,date,typeParams){
			pkPersonal = pkPersonalInfo;
			hasNext = parseInt(date);
			types = typeParams;
			
			var view = new View();
			view.render(date);
			view.collection.load(date);
		}
	});
	
	return Router;
});