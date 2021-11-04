define(["eling","./dashboard/dashboard_main","report_apartmentsalescontrol","report_salemonthreport"],
		function(eling,Dashboard,ApartmentSalesControl,SaleMonthReport){
	
	//导航到首页
	location.hash = "#dashboard";
	
	//装载dashboard controller
	new Dashboard();
	
	//装载公寓销控controller
	new ApartmentSalesControl();
	
	//装载销售月报controller
	new SaleMonthReport();
	
	Backbone.history.start();
	
});