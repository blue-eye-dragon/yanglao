define(["eling","report_dashboard","report_apartmentsalescontrol","report_salemonthreport","report_annualfeemonthstatistics",
         "report_died","report_member","report_apartmentstatus","report_memberstatistics"],
		function(eling,Dashboard,ApartmentSalesControl,SaleMonthReport,AnnualfeeMonthStatistics,Died,
				MemberQuery,ApartmentStatus,MemberStatistics){
	
	//导航到首页
	location.hash = "#dashboard";
	
	//装载dashboard controller
	new Dashboard();
	
	//装载公寓销控controller
	new ApartmentSalesControl();
	
	//装载销售月报controller
	new SaleMonthReport();
	
	//装载服务费月报controller
	new AnnualfeeMonthStatistics();
	
	//装载会员过世controller
	new Died();
	
	//装载会员查询controller
	new MemberQuery();
	
	//装载公寓入住controller
	new ApartmentStatus();
	
	//装载会员统计controller
	new MemberStatistics();
	
	Backbone.history.start();
	
});