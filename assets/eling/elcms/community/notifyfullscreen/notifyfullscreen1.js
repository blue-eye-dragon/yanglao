define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	require("jquery.carouFredSel");
	var tpl=require("./notifyfullscreen1.tpl");
	require("./notifyfullscreen.css");
	
	var ActivityRoomControl=ELView.extend({
		attrs:{
			template:tpl
		},
		afterInitComponent:function(params,widget){
			//查询通知
			aw.ajax({
				url:"api/announcement/queryNotLose",
				dataType:"json",
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