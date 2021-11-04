define(function(require,exports,module){
	
	var store = require("store");
	var aw = require("ajaxwrapper");
	var $ = require("$");
	var moment = require("momentwrapper");
	
	//在sea_config中设置了这些参数。之所以不在这里直接设置，是因为eling文件夹下面的东西，maven变量打不进去
	var city = store.get("city");
	
	var appConfig = require("./app_config");
	
	//设置全局变量
	window.$ = window.jQuery = $;
	window.moment = moment;
	
	var Enums = require("enums");
	var I18n = require("i18n");
	
	var isEnumReady = false;
	var isI18nReady = false;
	var isThemeReady = false;
	
	var App = {
		setCity : function(){
			store.set("city",city);
		},
			
		initTheme : function(){
			var that = this;
			$.ajax({
				url : "api/organization/querytheme",
				success : function(theme){
					store.set("theme",theme);
					
					//设置背景颜色
					$("body").addClass("contrast-" + theme).removeClass("hidden");
					
					//设置favoicon
					$(".J-logo").attr("href","assets/eling/theme/" + theme + "/favicon.ico");
					
					store.set("theme",theme);

		            var link = document.createElement("link");
		            link.type = "text/css";
		            link.rel = "stylesheet";
		            link.href = "assets/eling/theme/" + theme + "/theme-color.css";
		            link.onload = function(){
		                var body = document.getElementsByTagName("body")[0];
		                body.className = "contrast-" + theme;
		                isThemeReady = true;
		                that.initView();
		            }

		            document.getElementsByTagName("head")[0].appendChild(link);
				}
			});
		},
		
		//查询枚举
		queryEnums : function(){
			var that = this;
			aw.ajax({
				url : "api/enums",
				success : function(data){
					Enums.init(data);
					isEnumReady = true;
					
					that.initView();
				}
			});
		},
		
		//查询多语
		queryI18ns : function(){
			var that = this;
			aw.ajax({
				url : "api/i18n",
				success : function(data){
					I18n.init(data);
					isI18nReady = true;
					
					that.initView();
				}
			});
		},
		
		init : function(view){
			
			this.view = view;
			
			this.setCity();
			
			this.initTheme();
			
			this.queryEnums();
			
			this.queryI18ns();
			
		},
		
		initView : function(){
			
			var view = this.view;
			
			if(isEnumReady && isI18nReady && isThemeReady){
				seajs.use([view.name],function(View){
					aw.ajax({
						url : "api/user/me",
						data : appConfig.queryUserConfig,
						success : function(data) {
							store.set("user",data);
							
							//正常打开
							new View({
								params : store.deserialize(view.parameters),
								model : $.extend(true,appConfig.mainframeConfig,{
									
								})
							}).render();
								
						}
					});
				});
			}
		}
	};
	
	module.exports = App;
});