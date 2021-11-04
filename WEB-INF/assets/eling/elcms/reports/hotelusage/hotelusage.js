define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var HotelUsage=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"酒店使用情况报表",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/hotelusage"
			};
		}
	});
	
	module.exports=HotelUsage;
});