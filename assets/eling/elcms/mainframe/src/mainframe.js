define(function(require, exports, module) {
	
	var store=require("store");
	
	var themeName = store.get("theme");
	
	var aw=require("ajaxwrapper");
	
	var ELView = require("elview");
	
	var tpl = require("./mainframe.tpl");
	
	var Dialog = require("dialog");
	
	var Enums = require("enums");
	
	var dayOfWeek = ["日","一","二","三","四","五","六"];
	var weather={
		"0":{text:"龙卷风"},"1":{text:"风暴"},"2":{text:"飓风"},"3":{text:"雷雨"},"4":{text:"雷雨"},"5":{text:"雨夹雪"},"6":{text:"雨夹雪"},"7":{text:"雨夹雪"},"8":{text:"阵雨"},
		"9":{text:"阵雨"},"10":{text:"阵雨"},"11":{text:"阵雨"},"12":{text:"阵雨"},"13":{text:"阵雪"},"14":{text:"阵雪"},"15":{text:"阵雪"},"16":{text:"阵雪"},"17":{text:"冰雹"},
		"18":{text:"雨夹雪"},"19":{text:"霾"},"20":{text:"晴"},"21":{text:"霾"},"22":{text:"霾"},"23":{text:"风"},"24":{text:"大风"},"25":{text:"大风"},"26":{text:"多云"},
		"27":{text:"多云"},"28":{text:"多云"},"29":{text:"晴转多云"},"30":{text:"晴转多云"},"31":{text:"晴"},"32":{text:"晴"},"33":{text:"晴"},"34":{text:"晴"},"35":{text:"冰雹"},
		"36":{text:"晴"},"37":{text:"雷雨"},"38":{text:"雷雨"},"39":{text:"雷雨"},"40":{text:"阵雨"},"41":{text:"大雪"},"42":{text:"雨夹雪"},"43":{text:"阵雪"},"44":{text:"多云"},
		"45":{text:"雷雨"},"46":{text:"雨夹雪"},"47":{text:"雷雨"}
	};
	
	require("./mainframe.css");
		
	var MainFrame = ELView.extend({
		attrs : {
			parentNode : ".J-mainframe-container",
			template : tpl,
			model : {
				logo_width : 81,
				logo_height : 30,
				logo_left : "assets/eling/theme/" + themeName + "/logo.png",
				logo_left_xs : "assets/eling/theme/" + themeName + "/logo_xs.png",
				todos : [],
				time : true,
				weather : true,
				todolist : true
			}
		},
		events : {
			"click .J-headerbar-openview" : "_openView_headerbar",
			"click .toggle-nav" : "_togglenav",
			"click .J-headerbar-logo" : function(){
				location.reload();
			},
			"click .J-header-todolist-item" : function(e){
				var el=$(e.target);
				if(!el.is("a")){
					el=el.parents("a.J-header-todolist-item");
				}
				var url=el.attr("data-url");
				var params=store.deserialize(el.attr("data-params"));
				this.openView({
					url:url,
					params:params
				});
			},
			"click .J-header-todolist" : function(){
				this.setTodolist();
			},
			"click .J-changeuser" : function(){
				$(".login,.J-mask").removeClass("hidden");
				$("body").addClass("login");
				var user=store.get("user") || {};
				var usercode=user.code || "";
			    $("#j_username").val(usercode);
			},
			"click .J-headerbar-cancel" : function(){
				$("body").removeClass("login");
				$(".login,.J-mask").addClass("hidden");
				return false;
			},
			"click .isleaf" : "_openView_menu",
			"click .dropdown-collapse" : "_dropdown"
		},
		afterInitComponent : function(params,widget){
			
			var that = this;
			var model = this.get("model");
		
			//初始化view管理
			this.initViewManage();
			
			if(model.time){
				//设置时间
				this.setDateTime();
				
				//初始化定时器
				var severTime = store.get("server");
				
				window.setInterval(function(){
					that.setDateTime();
					var old = moment($(".J-headerbar-datetime").attr("data-old")).valueOf();
					var now = moment($(".J-headerbar-datetime").text()).valueOf();
					var monitorTime = now - old;
					if( monitorTime >= 300000 || monitorTime <= -300000){
						Dialog.alert({
							title:"系统提示",
							content : "系统将为您重新校准时间！出现此提示可能是以下原因：\n1.客户端时间被修改。\n2.客户端进入了较长的休眠状态。",
							confirm : function(){
								location.reload();
							}
						});
					}
				},1000);
			}
			
			if(model.weather){
				//设置天气
				this.setWeather();
			}
			
			if(model.todolist){
				//设置待办
				this.setTodolist();
			}
			
			//设置用户
			this.setUser();
			//设置菜单
			this.setMenu()
			
			//代理菜单收缩事件
			var body = $("body");
			$(document).bind("nav-close", function(event, params) {
				body.removeClass("main-nav-opened").addClass("main-nav-closed");
				return;
			});
			$(document).bind("nav-open", function(event, params) {
				body.addClass("main-nav-opened").removeClass("main-nav-closed");
				return;
			});
		},
		setDateTime : function(){
			//设置时间
			var time = moment();
			$(".J-headerbar-datetime").attr("data-old",$(".J-headerbar-datetime").text());
			$(".J-headerbar-datetime").text(time.format("YYYY-MM-DD HH:mm:ss"));
			$(".J-headerbar-weekday").text(" 星期"+dayOfWeek[time.days()]);
		},
		setWeather : function(){
			var city=store.get("city");
			
			aw.ajax({
				url:"https://query.yahooapis.com/v1/public/yql?"+
					"q=select * from weather.forecast where woeid="+city+"&diagnostics=true&format=json",
				dataType:"jsonp",
				jsonp:"callback",
				success:function(data){
					var results=data.query.results.channel.item.forecast || {};
					var current=data.query.results.channel.item.condition || {};
					var temperature = parseInt((results[0].low-32)*5/9)+"℃"+"-"+parseInt((results[0].high-32)*5/9)+"℃"
					var text = weather[current.code].text || "";
					$(".J-headerbar-weather").text(text+" "+temperature);
				}
			});
		},
		setTodolist : function(){
			var that = this;
			var model = this.get("model");
			aw.ajax({
				url:"api/action/queryUser",
				success:function(data){
					if(data){
						for(var i=0;i<data.length;i++){
							data[i].date=moment(data[i].date).format("YYYY-MM-DD");
						}
					}
					model.todos=data;
					that.renderPartial(".J-header-todolist");
				}
			});
		},
		setUser : function(){
			var user=store.get("user") || {};
			var model = this.get("model");
			model.name = user.name;
			model.logo_right = "api/attachment/userphoto/"+store.get("user").pkUser;
			this.renderPartial(".J-username");
		},
		setMenu : function(){
			var that = this;
			var model = this.get("model");
			aw.ajax({
				url:'api/rbac/permission/menuitems',
				type : "GET",
				data:{
					fetchProperties:"pkMenuItem,code,display,path,icon,parameter," +
							"subItems.pkMenuItem,subItems.code,subItems.display,subItems.path,subItems.icon,subItems.parameter," +
							"subItems.subItems.pkMenuItem,subItems.subItems.code,subItems.subItems.display,subItems.subItems.path,subItems.subItems.icon,subItems.subItems.parameter," +
							"subItems.subItems.subItems.pkMenuItem,subItems.subItems.subItems.code,subItems.subItems.subItems.display,subItems.subItems.subItems.path,subItems.subItems.subItems.icon,subItems.subItems.subItems.parameter"
				},
				dataType : "json",
				success : function(data) {
					model.menus = data;
					that.renderPartial(".nav-stacked");
					that.openView({
						id : "snode" + data[0].code,
						url : data[0].path,
						params : data[0].parameter
					});
				}
			});
		},
		initViewManage : function(){
			var that = this;
			window.eling = {
				history : {},
				instance : null
			};
			location.hash = "";
			//绑定hashchange事件
			window.onhashchange = function(e){
				var id = location.hash.substring(1);
				var config = window.eling.history[id];
				
				that._openView(config);
			};
		},
		_dropdown : function(e) {
			e.preventDefault();
			
			var link=$(e.currentTarget);
			var list=link.parent().find("> ul");
			if (list.is(":visible")) {
				if ($("body").hasClass("main-nav-closed") && link.parents("li").length === 1) {
					false;
				} else {
					link.removeClass("in");
					list.slideUp(300, function() {
						return link.removeClass("in");
					});
				}
			} else {
				if (list.parents("ul.nav.nav-stacked").length === 1) {
					$(document).trigger("nav-open");
				}
				if(link.parents("ul").size() == 1){
					//点击的是第一级菜单
					//所有已展开的菜单收起
					this.$(".navigation>ul>li>ul.nav.nav-stacked").slideUp(function(){
						$(".dropdown-collapse").removeClass("in");
					});
				}
				link.addClass("in");
				list.slideDown(300, function() {
					return $(e.currentTarget).addClass("in");
				});
			}
			return false;
		},
		_togglenav : function(eventObject) {
			if (this._nav_open()) {
				$(document).trigger("nav-close");
			} else {
				$(document).trigger("nav-open");
			}
			return false;
		},
		_nav_open : function() {
			return $("body").hasClass("main-nav-opened") || $("#main-nav").width() > 50;
		},
		_openView_headerbar:function(e){
			this.openView({
				url : $(e.target).attr("data-url"),
				params : $(e.target).attr("data-params")
			});
			e.preventDefault();
			return false;
		},
		_openView_menu:function(e){
			$(".isleaf").find("span").css("color","black");
			$(e.currentTarget).find("span").css("color","red");
			this.openView({
				id : "snode" + $(e.currentTarget).attr("id"),
				url : $(e.currentTarget).attr("data-url"),
				params : $(e.currentTarget).attr("data-params")
			});
			e.preventDefault();
			return false;
		}
	});
	
	module.exports = MainFrame;
});