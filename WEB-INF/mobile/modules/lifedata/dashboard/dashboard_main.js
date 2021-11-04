require(["../../../requirejs/config"],function(){
	require(["eling","backbone","sidebar",
	         "hbars!./modules/lifedata/dashboard/dashboard"],
			function(eling,Backbone,Sidebar,tpl){
		
		var View = Backbone.View.extend({
			initialize:function(options){
				//渲染
				this.render(options.pkPersonalInfo);
				//初始化sidebar
				this.initSidebar(options.pkPersonalInfo);
				//设置缓存
				eling.setCache("lifedata",{
					pkPersonalInfo:options.pkPersonalInfo
				});
			},
			render:function(pkPersonalInfo){
				$("body").html(tpl({
					left:$("body").width(),
					menus:[{
						color:"purple",
						icon:"icon-th-list",
						url:"#"+pkPersonalInfo+"/locationlog",
						text:"总览"
					},{
						color:"blue",
						icon:"icon-moon",
						url:"#"+pkPersonalInfo+"/sleeplog",
						text:"睡眠"
					},{
						color:"green",
						icon:"icon-inbox",
						url:"#"+pkPersonalInfo+"/dol/Bedroom",
						text:"卧室"
					},{
						color:"orange",
						icon:"icon-coffee",
						url:"#"+pkPersonalInfo+"/dol/LivingRoom",
						text:"客厅"
					},{
						color:"red",
						icon:"icon-food",
						url:"#"+pkPersonalInfo+"/dol/Kitchen",
						text:"厨房"
					},{
						color:"muted",
						icon:"icon-toilet",
						url:"#"+pkPersonalInfo+"/dol/Restroom",
						text:"卫生间"
					}]
				}));
			},
			initSidebar : function(pkPersonalInfo){
				var sidebar = new Sidebar({pkPersonalInfo:pkPersonalInfo});
				sidebar.load();
				sidebar.render();
				sidebar.on("sidebar-member-change",function(){
				});
			},
			dashboard:function(){
				$(window).scrollTop(0);
				$(".sliderContainer").not(".J-dashboard").addClass("hidden").css({left : $("body").width()+"px"});
				$(".J-dashboard").removeClass("hidden").animate({left : 0},"fast");
			},
			sleeplog:function(){
				$(".J-dashboard").addClass("hidden").css({left : "-"+$("body").width()+"px"});
				$(".J-sleeplog").removeClass("hidden").animate({left : 0},"fast");
			},
			locationlog:function(){
				$(".J-dashboard").addClass("hidden").css({left : "-"+$("body").width()+"px"});
				$(".J-locationlog").removeClass("hidden").animate({left : 0},"fast");
			},
			dol:function(){
				$(".J-dashboard").addClass("hidden").css({left : "-"+$("body").width()+"px"});
				$(".J-dol").removeClass("hidden").animate({left : 0},"fast");
			}
		});
		
		var Route = Backbone.Router.extend({
			routes : {
				":pkPersonalInfo" : "index",
				":pkPersonalInfo/sleeplog" : "sleeplog",
				":pkPersonalInfo/locationlog" : "locationlog",
				":pkPersonalInfo/dol/:type" : "dol"
			},
			index : function(pkPersonalInfo){
				if(!this.view){
					//如果没有初始化，则说明是第一次访问该地址，则初始化
					this.view = new View({
						pkPersonalInfo : pkPersonalInfo
					});
				}else{
					//如果已经初始化，则返回首页dashboard
					this.view.dashboard();
				}
			},
			sleeplog : function(pkPersonalInfo){
				var view = this.view;
				require(["sleeplog"],function(){
					view.sleeplog();
				});
			},
			locationlog : function(){
				var view = this.view;
				require(["locationlog"],function(){
					view.locationlog();
				});
			},
			dol : function(pkPersonalInfo,type){
				var view = this.view;
				require(["dol"],function(module){
					module(type);
					view.dol();
				});
			}
		});
		new Route();
		Backbone.history.start();
	});
});