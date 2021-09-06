define(function(require, exports, module) {
	var ELView=require("elview");
	var tpl=require("./notifyshow1.tpl");
	require("./notifyshow.css");
	var aw=require("ajaxwrapper");
	var utils=require("./notifyshow_utils");
	
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
			
			aw.ajax({
				url:"api/announcement/queryNotLose",
				dataType:"json",
				data:{
					type:"PictureFull"
				},
				success:function(data){
					widget.get("model").data=data;
					widget.renderPartial("#carousel_container");
					utils._initCarouFredSel();
				}
			});
		}
	});
	module.exports = ActivityRoomControl;
});