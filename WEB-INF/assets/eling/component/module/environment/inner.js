define(function(require,exports,module){
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	
	var template=require("./inner.tpl");
	require("./environment.css");
	
	var Inner=ELView.extend({
		attrs:{
			template:template,
			autoRender:false
		},
		cleanClass:function(){
			$(".J-in-co2-desc,.J-in-co2-advice,.J-in-co2-cur").removeClass("success-font").
				removeClass("warning-font").removeClass("danger-font");
			$(".J-co2-status").removeClass("success_status").removeClass("warning_status").removeClass("danger_status");
		},
		_loadData:function(params){
			var that=this;
			aw.ajax({
				url:this.get("url") || "api/device/measures/query",
				data:params || this.get("params"),
				dataType:"json",
				success:function(data){
					$(".J-current-time").text(moment().format("HH:mm:ss"));
					if(data){
						//外部数据
						$(".J-out-temp").text(data[0].temperature || 0);
						$(".J-out-wet").text(data[0].humidity || 0);
						//内部数据
						$(".J-in-temp").text(data[1].temperature || 0);
						$(".J-in-wet").text(data[1].humidity || 0);
						$(".J-in-pressure").text((data[1].pressure*0.0009869).toFixed(2) || 0);
						$(".J-in-co2-cur").text(data[1].co2 || 0);
						that.cleanClass();
						if(data[1].co2<450){
							$(".J-in-co2-desc").text("非常好");
							$(".J-in-co2-advice").text("请继续保持");
							$(".J-in-co2-desc,.J-in-co2-advice,.J-in-co2-cur").addClass("success-font");
							$(".J-co2-status").addClass("success_status");
						}else if(data[1].co2>=450 && data[1].co2<1000){
							$(".J-in-co2-desc").text("一般");
							$(".J-in-co2-advice").text("建议开窗通风");
							$(".J-in-co2-desc,.J-in-co2-advice,.J-in-co2-cur").addClass("warning-font");
							$(".J-co2-status").addClass("warning_status");
						}else{
							$(".J-in-co2-desc").text("差");
							$(".J-in-co2-advice").text("请立即通风");
							$(".J-in-co2-desc,.J-in-co2-advice,.J-in-co2-cur").addClass("danger-font");
							$(".J-co2-status").addClass("danger_status");
						}
					}
				}
			});
		},
		refresh:function(params){
			this._loadData(params);
		},
		afterRender:function(){
			var timer=window.setInterval(function(){
				$(".J-current-time").text(moment().format("HH:mm:ss"));
			},1000);
		},
		destroy:function(){
			window.clearInterval(this.get("timer"));
			Inner.superclass.destroy.call(this,arguments);
		}
	});
	
	module.exports=Inner;
});