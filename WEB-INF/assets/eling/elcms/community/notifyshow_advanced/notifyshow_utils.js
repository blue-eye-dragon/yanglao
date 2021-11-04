define(function(require,exports,module){
	require("jquery.carouFredSel");
	
	var utils={
		_initCarouFredSel:function(){
			$('#carousel_container').carouFredSel({
				responsive: true,
				width: '100%',
			    direction: 'left',
				scroll: {
					items: 1
			    },
			    auto:{
			    	timeoutDuration:10000
			    },
			   items: {
				   width:1030,
				   visible:{
					   min: 1,
					   max: 1
				   }
				}
			});
		}
	};
	
	module.exports=utils;
});