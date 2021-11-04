define(["hbars!./list"],function(tpl){
	
	var List = function(options){
		var firstResult = 0;
		
		$(options.parentNode.$el).html(tpl(options));
		
		$(options.parentNode.$el).find("ul").scroll(function(){
			var offsetHeight = $("ul")[0].scrollHeight;
			var clientHieght = $("ul").height();
			var scrollTop = $("ul").scrollTop();
	    	if (offsetHeight - clientHieght >= scrollTop - 5 && 
	    			offsetHeight - clientHieght <= scrollTop + 5 ) {
	    		firstResult += 10;
	    		if(typeof options.more === "function"){
	    			options.more.call(options.parentNode,firstResult);
	    		}
	    	}
	    });
	}
	
	return List;
	
//	var firstResult = 0;
//	
//	return function(options){
//		//初始化sidebar
//		
//		var Model = Backbone.Model.extend({
//			idAttribute:options.model.idAttribute
//		});
//		
//		var Collection = Backbone.Collection.extend({
//			model:Model,
//			url:options.collection.url,
//			parse:options.collection.parse || function(datas){return datas;}
//		});
//		
//		var View = Backbone.View.extend({
//			el:"body",
//	    	initialize:function(){
//	    		this.collection = new Collection();
//	    		this.collection.on("add",this.renderItem,this);
//	    	},
//	    	setTitle:function(){
//	    		$(".J-headerbar-title").text($(".J-sidebar-panel-item.active").attr("data-name"));
//				$(".J-list-title").text(options.view.title);
//	    	},
//			render:function(){
//				this.$el.append(tpl({
//					left:$("body").width(),
//					isArrow:options.view.isArrow
//				}));
//				$("ul.J-list-content").scroll(function(){
//					var offsetHeight = $("ul.J-list-content")[0].scrollHeight;
//					var clientHieght = $("ul.J-list-content").height();
//					var scrollTop = $("ul.J-list-content").scrollTop();
//			    	if (offsetHeight - clientHieght >= scrollTop - 5 && 
//			    			offsetHeight - clientHieght <= scrollTop + 5 ) {
//			    		firstResult += 10;
//			    		$("body").trigger("list-loading-more",{
//			    			firstResult : firstResult
//			    		});
//			    	}
//			    });
//			},
//	    	renderItem:function(model){
//	    		$(".J-list-content").append(options.view.tplItem(model.toJSON()));
//	    	},
//	    	reset:function(){
//	    		this.collection.reset();
//	    		$(".J-list-content").empty();
//	    		firstResult = 0;
//	    	},
//	    	loading:function(mark){
//	    		if(mark){
//	    			var div = $("<div></div>").addClass("masking").addClass("J-loading-masking");
//	    			var img = $("<img>").attr("src","../../resources/ajaxloader.gif");
//	    			var imgDiv=$("<div></div>").addClass("loading").addClass("J-loading-img").append(img);
//	    			$("body").append(div);
//	    			$("body").append(imgDiv);
//	    		}else{
//	    			$(".J-loading-masking,.J-loading-img").remove();
//	    		}
//	    	},
//	    	load:function(params){
//	    		var that= this;
//	    		this.loading(true);
//	    		var queryParams = {};
//	    		if(typeof options.collection.params === "function"){
//	    			queryParams = options.collection.params();
//	    		}
//	    		queryParams = $.extend(true,queryParams,{firstResult:params ? params.firstResult : 0})
//				this.collection.fetch({
//					data:queryParams,
//					success:function(){
//						that.loading(false);
//					}
//				});
//			}
//		});
//		return View;
//	}
});