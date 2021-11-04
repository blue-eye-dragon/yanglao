define(["eling","./dashboard/dashboard_main","report_annualfeemonthstatistics"],
		function(eling,Dashboard,AnnualfeeMonthStatistics){
	
	//导航到首页
	location.hash = "#dashboard";
	
	new Dashboard();
	
	new AnnualfeeMonthStatistics();
	
	Backbone.history.start();
	
});