define(function(require,exporst,module){
	var aw=require("ajaxwrapper");
	var FlotWrapper=require("flotwrapper");
	
	var Utils={
		initPercent:function(data){
			for(var i in data){
				var subData=data[i];
				for(var j=0;j<subData.length;j++){
					(function(item){
						if(item.isPercent){
							var style=""
							if(item.isNoPercent){
								style="text_in_circle_nopercent"
							}else{
								style="text_in_circle"
							}
							
							FlotWrapper.knob({
								parentNode:".J-"+item.key+"-value",
								'width': 100,
						        'height': 100,
								fgColor: item.color,
								callback:function(){
									var span=$("<span></span>").addClass(style).addClass("J-"+item.key+"-value").text((item.value || 0)+(item.unit || "")).css({
										color:item.color
									});
									$(".J-"+item.key+"-value").before(span);
									$(".J-"+item.key+"-value").removeClass("hidden");
								},
								format:function(v){
									if(isNaN(v)){
										return "";
									}else{
										return v+"%";
									}
								}
							});
						}
					})(subData[j]);
				}
			}
		}
	};
	module.exports=Utils;
});