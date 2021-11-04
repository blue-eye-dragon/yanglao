require(["../../requirejs/config"],function(){
	require(["eling","hbars!./modules/businesscontacts/businesscontactsdetail",
	         "backbone","loading"],function(eling,tpl,Backbone,Loading){
		Loading.start();
		
		var BusinessContactsDetail = Backbone.Model.extend({
	    	idAttribute : "pkBusinessContacts",
	    	load : function(){
				this.fetch({
					url:"api/businesscontacts/queryByPk",
					data : {
						pkBusinessContacts : eling.getParameter("pkBusinessContacts")
					},
					success : function(data){
						Loading.end();
					}
				});
	    	},
	    	parse:function(datas){
	    		return datas;
	    	}
	    });
	    
	    var BusinessContactsView = Backbone.View.extend({
	    	el:"body",
	    	initialize:function(){
	    		this.model = new BusinessContactsDetail();
	    		this.model.on("change",this.render,this);
	    	},
	    	load:function(){
	    		this.model.load();
	    	},
	    	render:function(){
	    		this.$el.html(tpl(this.model.toJSON()));
	    	}
	    });
		
		var view = new BusinessContactsView();
		view.render();
		view.load();
		Loading.end();
	});
});