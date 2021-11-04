define(["eling","./dashboard/dashboard_main","report_memberstatistics","report_member","report_died","report_apartmentstatus"],
		function(eling,Dashboard,MemberStatistics,MemberQuery,Died,ApartmentStatus){
	
	//导航到首页
	location.hash = "#dashboard";
	
	new Dashboard();
	
	new MemberStatistics();
	
	new MemberQuery();
	
	new Died();
	
	new ApartmentStatus();
	
	Backbone.history.start();
	
});