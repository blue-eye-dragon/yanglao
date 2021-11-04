define(function(require,exports,module){
	var utils={
		drawSleep:function(param){
			var options = {
				series:{
					lines: { show: true, fill: 1, steps: true ,lineWidth:0}
				},
				xaxes:[{mode:"time",timeformat:"%H点%M分",timezone:"browser"}],
				yaxis:{
					min:0,
					max:5
				}
		    };
		    $.plot($(param.parentNode), param.data,options);
		}
	};
	
	module.exports=utils;
});