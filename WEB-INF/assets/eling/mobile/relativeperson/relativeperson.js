define(function(require,exports,module){
	var Backbone = require("backbone");
	var fw7 = require("f7");
	
	var tpl = require("text!eling/mobile/relativeperson/relativeperson.html");
	
	var RelativePerson = Backbone.Model.extend({
		idAttribute : "pkMember"
	});
	
	var RelativePersons = Backbone.Collection.extend({
		model : RelativePerson,
		url : "api/member/queryRelatedMembers",
		load : function(){
			this.fetch({
				reset : true,
				async : false,
				data:{
					pkPersonalInfo : location.hash.substring(1),
					fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone"
				}
			});
		},
		parse : function(datas){
			if(datas[0]){
				datas[0].isDefault = true;
			}
			return datas;
		}
	});
	
	var RelativeView = Backbone.View.extend({
		el : ".J-relatives",
		initialize : function(){
			this.collection = new RelativePersons();
			
			this.collection.on("reset",this.render,this);
			
			this.collection.load();
		},
		events : {
			"tap .J-member-item" : function(e){
				var pkMember = e.currentTarget.id;
				
				this.collection.findWhere({isDefault : true}).set({"isDefault":false},{silent : true});
				this.collection.get(pkMember).set("isDefault",true);
				
				window.app.closePanel();
			}
		},
		
		render : function(){
			this.$el.html(Template7.compile(tpl)(this.collection.toJSON()));
		},
		
		getDefault : function(){
			return this.collection.where({isDefault : true})[0].toJSON();
		}
	});
	
	return RelativeView;
});