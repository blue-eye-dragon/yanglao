require(["../../requirejs/config"],function(){
	require(["eling","sidebar","healthdailyrecords_dashboard","healthdailyrecords_diseasehistory",
	         "healthdailyrecords_healthdoctorevaluation","healthdailyrecords_aller","healthdailyrecords_memberdailyrecord",
	         "healthdailyrecords_phatak","healthdailyrecords_medicalrecords","healthdailyrecords_nextexam","healthdailyrecords_patient"],
			function(eling,Sidebar,DashboardRouter,DiseasehistoryRouter,HealthdoctorevaluationRouter,AllerRouter,MemberdailyrecordRouter,
					PhatakRouter,MedicalrecordsRouter,NextexamRouter,PatientRouter){
		
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
		
		//装载dashboard的controller
		new DashboardRouter();
		
		//装载疾病controller
		new DiseasehistoryRouter(sidebar);
		
		//装载巡检controller
		new HealthdoctorevaluationRouter(sidebar);
		
		//装载过敏controller
		new AllerRouter(sidebar);
		
		//装载日常controller
		new MemberdailyrecordRouter(sidebar);
		
		//装载用药controller
		new PhatakRouter(sidebar);
		
		//装载就诊controller
		new MedicalrecordsRouter(sidebar);
		
		//装载复诊controller
		new NextexamRouter(sidebar);
		
		//装载住院controller
		new PatientRouter(sidebar);
		
		Backbone.history.start();
		
	});
});
