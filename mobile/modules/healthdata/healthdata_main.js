require(["../../requirejs/config"],function(){
	require(["eling","sidebar","healthdata_dashboard","healthdata_list",
	         "healthdata_bloodpressure","healthdata_electrocardiogram","healthdata_detail"],
			function(eling,Sidebar,DashboardRouter,HealthDataListRouter,BloodPressure,ElectroCarDiogram,HealthdataDetail){
		
		//装载主controller
		var dashboardRouter = new DashboardRouter();
		
		Backbone.history.start();
		
		var hash = location.hash;
		if(hash.indexOf("/") != "-1"){
			hash = hash.substring(0,hash.indexOf("/"));
		}
		var sidebar = new Sidebar({
			el : ".J-sidebar",
			pkPersonalInfo : hash.substring(1)
		});
		sidebar.load();
		sidebar.render();
		$(".J-content").on("tap",".J-showsidebar",function(){
			sidebar.show();
		});
		//装载列表controller
		new HealthDataListRouter(sidebar);
		//装载血压controller
		new BloodPressure(sidebar);
		//装载心电图controller
		new ElectroCarDiogram(sidebar);
		//装载其他健康数据controller
		new HealthdataDetail(sidebar);
		
		dashboardRouter.navigate(hash,{trigger:true,replace:true});
	});
});
