define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var tpl=require("./notifyshow.tpl");
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
			var params = widget.get("params") || {};
			//查询天气预报
			var outer=new OuterEnvironment({
				parentNode:".J-out"
			});
			outer.render();
			outer.initWeather();
			this.set("outer",outer);
			//渲染环境数据
			var inner=new InnerEnvironment({
				parentNode:".J-inner"
			});
			inner.render();
			inner.refresh({
				last:true,
				pkActivityRoom:params.pkActivityRoom || $(".J-title").attr("data-key")
			});
			this.set("inner",inner);
			
			//查询通知
			aw.ajax({
				url:"api/announcement/queryNotLose",
				dataType:"json",
				data:{
					type:"OnlyWords"
				},
				success:function(data){
					for(var i=0;i<data.length;i++){
						if(i==0){
							data[i].show=true;
						}else{
							data[i].show=false;
						}
					}
					widget.get("model").notifies=data;
					widget.renderPartial(".J-notify-container");
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
					widget._getData(widget);
				}
			});
			
			var timer=setInterval(function(){
				var activeEL=$(".notifydetail.active");
				activeEL.removeClass("active").addClass("hidden");
				var nextEL=activeEL.next();
				nextEL=nextEL.length==0 ? $(".notifydetail.hidden").first() : nextEL;
				nextEL.removeClass("hidden").addClass("active");
			},5000);
			this.set("timer",timer);
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
			window.clearInterval(this.get("timer"));
			window.clearInterval(this.get("timerefersh"));
			ActivityRoomControl.superclass.destroy.call(this,arguments);
		}
	});
	module.exports = ActivityRoomControl;
});