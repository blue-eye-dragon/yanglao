define(["eling","./dashboard/dashboard_main","report_member","report_apartmentstatus","report_memberstatistics"],
		function(eling,Dashboard,MemberQuery,ApartmentStatus,MemberStatistics){
	
	//导航到首页
	location.hash = "#dashboard";
	
	new Dashboard();
	
	new MemberQuery();
	
	//装载公寓入住controller
	new ApartmentStatus();
	
	//装载会员统计controller
	new MemberStatistics();
	
	Backbone.history.start();
	
});