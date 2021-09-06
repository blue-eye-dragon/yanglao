define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var ApartmentUsage=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"公寓使用情况报表",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/apartmentusage"
			};
		}
	});
	
	module.exports=ApartmentUsage;
});