define(["eling","./dashboard/dashboard_main","report_apartmentstatus",
        "report_memberstatistics","report_member","report_died"],
		function(eling,Dashboard,ApartmentStatus,MemberStatistics,MemberQuery,Died){
	
	//导航到首页
	location.hash = "#dashboard";
	
	new Dashboard();
	
	new ApartmentStatus();
	
	new MemberStatistics();
	
	new MemberQuery();
	
	new Died();
	
	Backbone.history.start();
	
});