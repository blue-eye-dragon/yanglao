define(function(require,exports,module){
	require("knob");
	require("flot");
//	require("flot.resize");
//	require("flot.time");
	
	var Flot={
		knob:function(param){
			var defaultParam={
		        'readOnly': true,
		        'width': 120,
		        'height': 120,
		        'dynamicDraw': true,
		        'thickness': 0.2,
		        'tickColorizeValues': true,
				'skin':'tron'
		    };
			var params=$.extend(true,defaultParam,param);
			$(param.parentNode).knob(params);
			var callback=param.callback || function(){return false;};
			callback();
		},
		line:function(param,datas,flotParam){
			flotParam=$.extend(true,{
				series: {
					lines: {
						show: true,
						lineWidth: 1,
						fill: true, 
						fillColor: {
							colors: [{ 
								opacity: 0.08 
							},{ 
								opacity: 0.01 
							}]
						}
					}
				},
				grid: {
					clickable: true,
					hoverable: true,
					borderWidth: 0,
					tickColor: "#f4f7f9"
				}
			},flotParam);
			$.plot($(param.parentNode),datas,flotParam);
		}
	};
	
	module.exports=Flot;
});