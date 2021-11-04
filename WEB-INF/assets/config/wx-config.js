var version = "";
require.config({
	baseUrl:"../../../",
	paths:{
		backbone : "backbone/backbone-1.2.3",
		underscore : "backbone/underscore-1.7.0-min",
		
		moment : "moment/moment-2.1.0",
		
		zepto:"zepto/zepto",
		
		framework7 : "framework7/js/framework7",
		f7 : "eling/component/utils/f7/f7",
		
		elmview : "eling/component/core/elmview/1.0.0/dist/elmview"
	},
	shim:{
		underscore:{
			exports:"_"
		},
		zepto:{
			exports:"Zepto"
		}
		
	},
	
	map: {
		'*': {
	      text : 'requirejs/require-text'
	    },
	    backbone:{
	    	jquery:"zepto"
	    }
	},
	urlArgs : version
});