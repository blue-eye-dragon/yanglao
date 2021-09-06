define(function(require,exports,module){
	
	require("framework7");
	
	var Backbone = require("backbone");
	
	var ELMView = Backbone.View.extend({
		el : ".view-main",
		initialize : function(options){
			this.loading(true);
			
			for(var i in options){
				this[i] = options[i];
			}
			
			window.app = this.app = new Framework7({template7Pages : true});
			
			window.mainView = this.mainView = this.app.addView(".view-main");
			
			if(typeof this.listener == "function"){
				this.listener();
			}else if(typeof this.listener == "object" && {}.toString.call(this.listener) === "[object Object]"){
				for(var i in this.listener){
					var eventAndModel = i.split(" ");
					this.model[eventAndModel[1]].on(eventAndModel[0],this[this.listener[i]],this);
				}
			}
			
			this.setup(this);
			
			this.initComponent(this);
			
			this.afterInitComponent(this);
			
			this.loading(false);
		},
		
		initComponent : function(widget){},
		afterInitComponent : function(widget){},
		
		render : function(viewName,data){
			this.app.template7Data["url:" + viewName] = data;
			this.mainView.router.load({
				url : viewName,
				animatePages : false
			});
		},
		
		refresh : function(url,data){
			this.app.template7Data["url:"+url] = data;
			mainView.router.reloadPage(url);
		},
		
		switchTo : function(viewName,data){
			this.app.template7Data["url:" + viewName] = data;
			this.mainView.router.load({
				url : viewName
			});
		},
		
		back : function(options){
			this.mainView.router.back(options);
		},
		
		loading : function(mark){
			if(mark){
				var html = "" +
					'<div class="J-f7-loading" style="z-index:10001;width:100%;height:100%;position:absolute;top:0;left:0;">' + 
						'<div style="padding:5px;text-align:center;background:#222;position:absolute;z-index:10001;border-radius:10px;top:30%;left:50%;margin-left:-30px;">' +
							'<span style="width:60px; height:55px" class="preloader preloader-white"></span>' +
						'</div>'
					'</div>';
				$("body").append(html);
			}else{
				$(".J-f7-loading").remove();
			}
		},
		renderPartial : function(selector,template,data){
			require(["text!eling/mobile/"+this.id + "/" + template],function(template){
				Dom7(".J-"+selector).html(Template7.compile(template)(data));
			});
		}
	});
	
	return ELMView;
});