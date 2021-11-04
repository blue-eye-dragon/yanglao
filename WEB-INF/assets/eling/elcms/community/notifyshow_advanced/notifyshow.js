define(function(require, exports, module) {
	var ELView=require("elview");
	var tpl=require("./notifyshow.tpl");
	require("./notifyshow.css");
	var aw=require("ajaxwrapper");
	var utils=require("./notifyshow_utils");
	var InnerEnvironment=require("inner_environment");
	var OuterEnvironment=require("outer_environment");
	
	var ActivityRoomControl=ELView.extend({
		attrs:{
			template:tpl,
			model:{}
		},
		events:{
			"click .J-fullscreen" : function(e){
				$("header").addClass("hidden");
				$("nav").addClass("hidden");
				$(".J-el-content").removeAttr("id");
				$(".J-fullscreen").addClass("hidden");
				$(".J-return").removeClass("hidden");
				return false;
			},
			"click .J-return" : function(e){
				$("header").removeClass("hidden");
				$("nav").removeClass("hidden");
				$(".J-el-content").attr("id","content");
				$(".J-fullscreen").removeClass("hidden");
				$(".J-return").addClass("hidden");
				return false;
			}
		},
		_getData:function(widget){
			//查询天气预报
			var outer=new OuterEnvironment({
				parentNode:".J-out"
			});
			this.set("outer",outer);
			outer.render();
			outer.initWeather();
			//渲染环境数据
			var inner=new InnerEnvironment({
				parentNode:".J-inner"
			});
			this.set("inner",inner);
			inner.render();
			inner.refresh({
				last:true,
				pkActivityRoom:$(".J-title").attr("data-key")
			});
			aw.ajax({
				url:"api/announcement/queryNotLose",
				dataType:"json",
				data:{
					type:"PictureHalf"
				},
				success:function(data){
					widget.get("model").data=data;
					widget.renderPartial("#carousel_container");
					utils._initCarouFredSel();
				}
			});
		},
		afterInitComponent:function(params,widget){
			$("header").addClass("hidden");
			$("nav").addClass("hidden");
			$(".J-el-content").removeAttr("id");
			$(".J-fullscreen").addClass("hidden");
			$(".J-return").removeClass("hidden");
			aw.ajax({
				url:"api/activityroom/query",
				dataType:"json",
				success:function(data){
					$(".J-title").attr("data-key",data[0].pkActivityRoom).text(data[0].name);
					widget._getData(widget);
				}
			});
			var href =window.location.href;
			if(href.indexOf("view")>0){
				var timerefersh=setInterval(function(){
					window.location.reload();
				},60*1000);
				this.set("timerefersh",timerefersh);
			}
			
		},
		destroy:function(){
			this.get("inner").destroy();
			this.get("outer").destroy();
			window.clearInterval(this.get("timerefersh"));
			ActivityRoomControl.superclass.destroy.call(this,arguments);
		}
	});
	module.exports = ActivityRoomControl;
});