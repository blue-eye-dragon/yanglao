require(["../../requirejs/config"],function(config){
	require(["hbars!./modules/remainder/remainder_item",
	         "backbone"],function(tpl,Backbone){
	    
	    var Remainder = Backbone.Model.extend({
	    	idAttribute : "pkRemainder"
	    });
	    
	    var RemainderCollection = Backbone.Collection.extend({
	    	model:Remainder,
	    	url:"data.json",
	    	parse:function(data){
	    		this.add(data);
	    	}
	    });
	    
	    var RemainderView = Backbone.View.extend({
	    	el:"ul",
	    	initialize:function(){
	    		this.collection = new RemainderCollection();
	    		this.collection.on("add",this.render,this);
	    	},
	    	load:function(){
	    		this.collection.fetch();
	    	},
	    	render:function(model){
	    		this.$el.append(tpl(model.toJSON()));
	    	}
	    });
	    
	    new RemainderView().load();
	});
});