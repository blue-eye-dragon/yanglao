var version = "";
require.config({
	baseUrl:"../../",
	paths:{
		$:"../assets/jquery/jquery/jquery",
		jquery:"../assets/jquery/jquery/jquery",
		
		backbone:"../assets/backbone/backbone-1.1.2-min",
		underscore : "../assets/backbone/underscore-1.7.0-min",
		
		moment:"../assets/moment/moment-2.1.0",
		
		zepto:"../assets/zepto/zepto",
		
		"framework7" : "../assets/framework7/js/framework7",
		
		//gallery
		"handlebars" : "../assets/gallery/handlebars/2.0.0/handlebars",
		
		"store" : "../assets/gallery/store/1.3.14/store-debug",
		"json" : "../assets/gallery/json/1.0.3/json",
		
		"jquery.flot":"../assets/jquery/jquery-plugins/flot/jquery.flot.min",
		
		chart : "chart/chart.min",
		
		//modules
		//健康总览
		"healthpandec_physicalexamlist" : "modules/healthpandect/physicalexam/physicalexamlist",
		"healthpandec_physicalexam" : "modules/healthpandect/physicalexam/physicalexam",
		"healthpandec_physicalexamitem" : "modules/healthpandect/physicalexam/physicalexamitem",
		"healthpandec_list" : "modules/healthpandect/healthpandectlist/healthpandectlist",
		"healthpandec_bloodpressure" : "modules/healthpandect/bloodpressure/bloodpressure_main",
		"healthpandec_bloodsugar" : "modules/healthpandect/bloodsugar/bloodsugar_main",
		"healthpandec_spo2" : "modules/healthpandect/spo2/spo2_main",
		"healthpandec_bmi" : "modules/healthpandect/bmi/bmi_main",
		"healthpandec_heartrate" : "modules/healthpandect/heartrate/heartrate_main",
		"healthpandec_electrocardiogram" : "modules/healthpandect/electrocardiogram/electrocardiogram_main",
		"healthpandec_temprature" : "modules/healthpandect/temprature/temprature_main",
		"healthpandec_sports" : "modules/healthpandect/sports/sports_main",
		
		//健康数据
		"healthdata_dashboard":"modules/healthdata/dashboard/dashboard_main",
		"healthdata_list":"modules/healthdata/healthdatalist/healthdatalist_main",
		"healthdata_bloodpressure":"modules/healthdata/bloodpressure/bloodpressure_main",
		"healthdata_electrocardiogram":"modules/healthdata/electrocardiogram/electrocardiogram_main",
		"healthdata_detail":"modules/healthdata/healthdatadetail/healthdatadetail_main",
		
		//健康日志
		"healthdailyrecords_dashboard":"modules/healthdailyrecords/dashboard/dashboard_main",
		"healthdailyrecords_diseasehistory":"modules/healthdailyrecords/diseasehistory/diseasehistory_main",
		"healthdailyrecords_nextexam":"modules/healthdailyrecords/nextexam/nextexam_main",
		"healthdailyrecords_memberdailyrecord":"modules/healthdailyrecords/memberdailyrecord/memberdailyrecord_main",
		"healthdailyrecords_patient":"modules/healthdailyrecords/patient/patient_main",
		"healthdailyrecords_aller":"modules/healthdailyrecords/aller/aller_main",
		"healthdailyrecords_healthdoctorevaluation":"modules/healthdailyrecords/healthdoctorevaluation/healthdoctorevaluation_main",
		"healthdailyrecords_medicalrecords":"modules/healthdailyrecords/medicalrecords/medicalrecords_main",
		"healthdailyrecords_phatak":"modules/healthdailyrecords/phatak/phatak_main",
		
		//生活数据
		"sleeplog":"modules/lifedata/sleeplog/sleeplog_main",
		"locationlog":"modules/lifedata/locationlog/locationlog_main",
		"dol":"modules/lifedata/dol/dol_main",
		
		//报表
		"report_dashboard":"modules/report/dashboard/dashboard_main",
		"report_apartmentsalescontrol":"modules/report/apartmentsalescontrol/apartmentsalescontrol_main",
		"report_apartmentstatus":"modules/report/apartmentstatus/apartmentstatus_main",
		"report_salemonthreport":"modules/report/salemonthreport/salemonthreport_main",
		"report_annualfeemonthstatistics":"modules/report/annualfeemonthstatistics/annualfeemonthstatistics_main",
		"report_died":"modules/report/died/died_main",
		"report_member":"modules/report/member/member_main",
		"report_memberstatistics":"modules/report/memberstatistics/memberstatistics_main",
		"report_memberstatus":"modules/report/memberstatus/memberstatus_main",
		"cashjournal":"modules/report/cashjournal/cashjournal_main",
		"checkoutannualreport":"modules/report/checkoutannualreport/checkoutannualreport_main",
		
		"billlist" : "modules/billlist/billlist_main",
		"billdetail" : "modules/billdetail/billdetail_main",
		
		//component
		sidebar : "eling/sidebar/sidebar",
		list : "eling/list/list",
		list1 : "eling/list1/list",
		loading : "eling/loading/loading",
		f7 : "eling/f7/f7",
		pie : "eling/pie/pie",
		eling : "eling/eling",
		healthstandard : "eling/healthstandard",
	},
	shim:{
		underscore:{
			exports:"_"
		},
		$:{
			exports:"jQuery"
		},
		zepto:{
			exports:"Zepto"
		},
		"jquery.flot":["$"]
		
	},
	map: {
		'*': {
	      css : 'requirejs/require-css',
	      text : 'requirejs/require-text',
	      hbars : 'requirejs/require-hbars'
	    },
	    backbone:{
	    	jquery:"zepto"
	    }
	},
	urlArgs : version,
	hbars: {
		extension: '.tpl', // default = '.html'
		compileOptions: {}  // options object which is passed to Handlebars compile
	}
});