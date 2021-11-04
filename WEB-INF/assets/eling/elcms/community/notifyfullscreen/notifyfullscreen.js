define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	require("jquery.carouFredSel");
	var tpl=require("./notifyfullscreen.tpl");
	require("./notifyfullscreen.css");
	
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
		afterInitComponent:function(params,widget){
			$("header").addClass("hidden");
			$("nav").addClass("hidden");
			$(".J-el-content").removeAttr("id");
			$(".J-fullscreen").addClass("hidden");
			$(".J-return").removeClass("hidden");
			
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
			
			var timer=setInterval(function(){
				var activeEL=$(".notifydetail.active");
				activeEL.removeClass("active").addClass("hidden");
				var nextEL=activeEL.next();
				nextEL=nextEL.length==0 ? $(".notifydetail.hidden").first() : nextEL;
				nextEL.removeClass("hidden").addClass("active");
			},30000);
			this.set("timer",timer);
		},
		destroy:function(){
			window.clearInterval(this.get("timer"));
			ActivityRoomControl.superclass.destroy.call(this,arguments);
		}
	});
	module.exports = ActivityRoomControl;
});