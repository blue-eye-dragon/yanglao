define(["framework7"],function(){
	
	var app, mainView;
	window.$ = Dom7;
	
	return {
		initialize : function(){
			app = new Framework7({
				template7Pages : true,
				template7Data : {}
			});
			
			mainView = app.addView(".view-main");
		},
		render : function(options,data){
			app.template7Data["url:"+options.url] = data;
			mainView.router.load(options);
		},
		refresh : function(html,data){
			app.template7Data["url:"+html] = data;
			mainView.router.reloadPage(html);
		},
		back : function(options){
			mainView.router.back(options);
		},
		getApp : function(){
			return app;
		},
		getMainView : function(){
			return mainView;
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
		getData : function(viewName){
			return app.template7Data["url:"+viewName];
		},
		setData : function(viewName,data,options){
			app.template7Data["url:"+viewName] = data;
			if(options){
				options.url = viewName;
				mainView.router[options.operate](options);
			}
		},
		getValue : function(viewName,fieldName){
			return app.template7Data["url:"+viewName][fieldName];
		},
		setValue : function(viewName,fieldName,fieldValue,options){
			app.template7Data["url:"+viewName][fieldName] = fieldValue;
			if(options){
				options.url = viewName;
				mainView.router[options.operate](options);
			}
		}
	};
});