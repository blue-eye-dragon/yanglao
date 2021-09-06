define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var tpl=require("./announcementslide.tpl");
	var InnerEnvironment=require("inner_environment");
	var OuterEnvironment=require("outer_environment");
	
	var ActivityRoomControl=ELView.extend({
		attrs:{
			template:tpl,
			model:{}
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
					typeIn:"OnlyWords,PictureHalf"
				},
				success:function(data){
					var left = $("body").width();
					for(var i=0;i<data.length;i++){
						if(i==0){
							data[i].left = 0;
							data[i].show=true;
						}else{
							data[i].left = left;
							data[i].show=false;
						}
					}
					widget.get("model").notifies=data;
					widget.renderPartial(".J-notify-container");
				}
			});
		},
		afterInitComponent:function(params,widget){
			aw.ajax({
				url:"api/activityroom/query",
				dataType:"json",
				success:function(data){
					widget._getData(widget);
				}
			});
			
			var timer=setInterval(function(){
				var width = $('body').width();
				var activeEL=$(".notifydetail.active");
				activeEL.removeClass("active").addClass("hidden").css({left:width+"px"});
				var nextEL=activeEL.next();
				nextEL=nextEL.length==0 ? $(".notifydetail.hidden").first() : nextEL;
				nextEL.removeClass("hidden").addClass("active").animate({left:0});
			},5000);
			this.set("timer",timer);
			
		},
		destroy:function(){
			this.get("inner").destroy();
			this.get("outer").destroy();
			window.clearInterval(this.get("timer"));
			ActivityRoomControl.superclass.destroy.call(this,arguments);
		}
	});
	module.exports = ActivityRoomControl;
});