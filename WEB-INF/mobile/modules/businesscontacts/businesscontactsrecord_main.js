require(["../../requirejs/config"],function(config){
	require(["hbars!./modules/businesscontacts/businesscontactsrecord",
	         "backbone","eling","moment"],function(tpl,Backbone,eling){
		var firstResult = 0;
		var maxResults = 10;
		
		$("ul.list-group").scroll(function(){
			//搜索有值时不支持下拉刷新
			if ($("Input.J-businesscontacts-search")[0].value==""){		
				var offsetHeight = $("ul")[0].scrollHeight;
				var clientHieght = $("ul").height();
				var scrollTop = $("ul").scrollTop();
				if (offsetHeight - clientHieght >= scrollTop - 5 && 
						offsetHeight - clientHieght <= scrollTop + 5 ) {
					firstResult += 10;
					view.collection.load()
				}
			}
		});
		
	    var BusinessContacts = Backbone.Model.extend({
	    	idAttribute : "pkBusinessContacts"
	    });

	    var BusinessContactsCollection = Backbone.Collection.extend({
	    	model:BusinessContacts,
	    	
	    	load : function(){
	    		eling.loading(true);
				$.ajax({
					url:"api/businesscontacts/query",
					data:{
						firstResult:firstResult,
						maxResults:maxResults
					},
					async:false,
					success:function(data){
						eling.loading(false);
						view.render(data);
					}
				});
			},
			search : function(s){
	    		eling.loading(true);
	    		firstResult = 0;
	    		if (s==""){
					$.ajax({
						url:"api/businesscontacts/query",
						data:{
							firstResult:firstResult,
							maxResults:maxResults
						},
						async:false,
						success:function(data){
							eling.loading(false);
							view.reRender(data);
						}
					});
	    		}else{
					$.ajax({
						url:"api/businesscontacts/search",
						async:false,
						data:{
							s:s,
							fetchProperties: "*"
						},
						success:function(data){
							eling.loading(false);
							view.reRender(data);
							$("input.J-businesscontacts-search").val(s);
						}
					});
	    		}
			}
	    });

	    var BusinessContactsView = Backbone.View.extend({
	    	el:".J-content",
			events : {
				"tap .icon-search" : function(e){
					var s = $("input.J-businesscontacts-search").val();
					this.collection.search(s);
				}
			},
	    	initialize:function(){
	    		this.collection = new BusinessContactsCollection();
	    	},
	    	render:function(data){
	    		this.$el.find("ul").append(tpl({datas:data || this.collection.toJSON()}));
	    	},
	    	reRender : function(data){
	    		this.$el.find("ul").html(tpl({datas:data}));
	    	}
	    });
	    
		var view = new BusinessContactsView();
		view.render();
		view.collection.load();
	});
});
