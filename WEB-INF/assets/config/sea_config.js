var version = "";
var ctx = localStorage.getItem("ctx");

//设置缓存参数
localStorage.setItem("city","2151330");

var debug = localStorage.getItem("debug") || false;

seajs.config({
	alias : {
		// arale
		"base" : "arale/base/1.0.0/dist/base",
		"widget" : "arale/widget/1.0.0/dist/widget",
		"templatable" : "arale/templatable/1.0.0/dist/templatable",
		
		//backbone
		"backbone" : "backbone/backbone-seajs",
		"underscore" : "backbone/underscore-1.5.2",
		
		//baidu
		"ueditor.all" : "baidu/ueditor/ueditor.all",
		"ueditor.config" : "baidu/ueditor/ueditor.config",
		"ueditor.parse" : "baidu/ueditor/ueditor.parse",
		"eling.ueditor.parse" : "eling/component/ueditor/eling.ueditor.parse",
		"ue.parse" : "eling/component/ueditor/ue.parse",
		
		"echarts":"baidu/echarts/echarts.js",

		// bootstrap
		"bootstrap" : "bootstrap/bootstrap",
		"bootstrap.daterangepicker" : "bootstrap/bootstrap-plugins/daterangepicker/daterangepicker",
		"bootstrap.colorpicker":"jquery/jquery-plugins/colorpicker/bootstrap-colorpicker.js",
		
		//gallery
		"handlebars" : "gallery/handlebars/2.0.0/handlebars-seajs",
		"store" : "gallery/store/1.3.14/store-seajs",
		"json" : "gallery/json/1.0.3/json",
		
		//jquery
		"$" : "jquery/jquery/1.11.1/jquery",
		"jquery" : "jquery/jquery/1.11.1/jquery",
		
		"jquery.autocomplete" : "jquery/jquery-plugins/autocomplete/autocomplete",
		
		"jquery.ajaxfileupload" : "jquery/jquery-plugins/ajaxfileupload/ajaxfileupload",
		"jquery.carouFredSel" : "jquery/jquery-plugins/carouFredSel/carouFredSel",
		
		"jquery.datetimepicker" : "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker",
		
		"mixitup" : "jquery/jquery-plugins/mixitup/jquery.mixitup",
		
		"fullcalendar" : "jquery/jquery-plugins/fullcalendar/fullcalendar",
		
		"pagination" : "jquery/jquery-plugins/pagination/pagination",
		
		"validate" : "jquery/jquery-plugins/validate/jquery.validate",
		
		"jquery.ui" : "jquery/jquery.ui/1.11.4/jquery-ui.min",
		
		"select2" : "jquery/jquery-plugins/select2/select2",
		
		"flot":"jquery/jquery-plugins/flot/jquery.flot.min",
		"flot.pie":"jquery/jquery-plugins/flot/jquery.flot.pie",
		"flot.resize":"jquery/jquery-plugins/flot/jquery.flot.resize",
		"flot.time" : "jquery/jquery-plugins/flot/jquery.flot.time",
		"flot.stack" : "jquery/jquery-plugins/flot/jquery.flot.stack",
		
		"video" : "jquery/jquery-plugins/video/video.min",
		"video.css" : "jquery/jquery-plugins/video/video-js.min.css",
		"video.lang.zh" : "jquery/jquery-plugins/video/lang/zh-CN",
		"videojs-contrib-hls" : "jquery/jquery-plugins/video/videojs-contrib-hls",
		
		"knob" : "jquery/jquery-plugins/knob/jquery-knob",
		
		"autosize":"jquery/jquery-plugins/autosize/jquery.autosize.min",
		
		"toastr":"jquery/jquery-plugins/toastr/toastr.min",
		
		"spectrum":"jquery/jquery-plugins/spectrum/spectrum",
		
		"ztree":"jquery/jquery-plugins/tree/jquery.ztree.all.min",
		
		"jquery-ui-timepicker-addon":"jquery/jquery-plugins/timepicker-addon/jquery-ui-timepicker-addon",
		
		//moment
		"moment" : "moment/moment-2.9.0",
		
		// e-ling core
		"elview" : "eling/component/core/elview/1.0.0/src/elview",
		"uicomponent-2.0.0" : "eling/component/core/uicomponent/2.0.0/src/uicomponent",
		"baseview" : "eling/component/core/baseview/baseview",
		"mixitupview" : "eling/component/core/mixitupview/mixitupview",
		
		// e-ling ui
		"text-1.0.0" : "eling/component/ui/text/1.0.0/dist/text{mode}",
		"textarea-1.0.0" : "eling/component/ui/textarea/1.0.0/dist/textarea{mode}",
		"select-1.0.0" : "eling/component/ui/select/1.0.0/dist/select{mode}",
		"checkradio-1.0.0" : "eling/component/ui/checkradio/1.0.0/dist/checkradio{mode}",
		"autocomplete-1.0.0" : "eling/component/ui/autocomplete/1.0.0/dist/autocomplete{mode}",
		"button-1.0.0" : "eling/component/ui/button/1.0.0/dist/button{mode}",
		"date-1.0.0" : "eling/component/ui/date/1.0.0/dist/date{mode}",
		"buttongroup-1.0.0" : "eling/component/ui/buttongroup/1.0.0/dist/buttongroup{mode}",
		"daterange-1.0.0" : "eling/component/ui/daterange/1.0.0/dist/daterange{mode}",
		"file-1.0.0" : "eling/component/ui/file/1.0.0/dist/file{mode}",
		"place-1.0.0" : "eling/component/ui/place/1.0.0/dist/place{mode}",
		"number-1.0.0" : "eling/component/ui/number/1.0.0/dist/number{mode}",
		"admindivision-1.0.0" : "eling/component/ui/admindivision/1.0.0/dist/admindivision{mode}",
		"richtexteditor-1.0.0": "eling/component/ui/richtexteditor/1.0.0/dist/richtexteditor{mode}",
		"colorpicker-1.0.0" : "eling/component/ui/colorpicker/1.0.0/dist/colorpicker{mode}",
		"timepicker" : "eling/component/ui/timepicker/1.0.0/dist/timepicker{mode}",
		
		"subnav-1.0.0" : "eling/component/ui/subnav/1.0.0/dist/subnav{mode}",
		
		"grid-1.0.0" : "eling/component/ui/grid/1.0.0/dist/grid{mode}",
		"grid-2.0.0" : "eling/component/ui/grid/2.0.0/dist/grid{mode}",
		
		"form-1.0.0" : "eling/component/ui/form/1.0.0/dist/form{mode}",
		"form-2.0.0" : "eling/component/ui/form/2.0.0/dist/form{mode}",
		"form1" : "eling/component/ui/form/2.0.0/dist/form{mode}",
		"form-3.0.0" : "eling/component/ui/form/3.0.0/dist/form{mode}",
		
		"profile" : "eling/component/ui/profile/1.0.0/dist/profile{mode}",
		
		"editgrid-1.0.0" : "eling/component/ui/editgrid/1.0.0/dist/editgrid{mode}",
		"editgrid-2.0.0" : "eling/component/ui/editgrid/2.0.0/dist/editgrid{mode}",
		
		"wizard-1.0.0" : "eling/component/ui/wizard/1.0.0/dist/wizard{mode}",
		"wizard-2.0.0" : "eling/component/ui/wizard/2.0.0/dist/wizard{mode}",
		
		"reportgrid" : "eling/component/ui/reportgrid/1.0.0/dist/reportgrid{mode}",
		"multirowgrid" : "eling/component/ui/multirowgrid/1.0.0/dist/multirowgrid{mode}",
		"calendar" : "eling/component/ui/calendar/1.0.0/dist/calendar{mode}",
		"tab" : "eling/component/ui/tab/1.0.0/dist/tab{mode}",
		"panel" : "eling/component/ui/panel/1.0.0/dist/panel{mode}",
		
		// e-ling utils
		"ajaxwrapper" : "eling/component/utils/ajaxwrapper",
		"momentwrapper" : "eling/component/utils/momentwrapper",
		"fullscreen" : "eling/component/utils/fullscreen/fullscreen",
		"loadimage":"eling/component/utils/loadimgage/loadimage-debug",
		"enums":"eling/component/utils/enum",
		"i18n":"eling/component/utils/i18n/i18n",
		
		"dialog-1.0.0" : "eling/component/utils/dialog/1.0.0/dist/dialog{mode}",
		"dialog-2.0.0" : "eling/component/utils/dialog/2.0.0/dist/dialog{mode}",
		
		"tools" : "eling/component/utils/tools/tools",
		"gridformat" : "eling/component/utils/gridformat/gridformat",
		
		//home 特殊配置
		"openplatform" : "eling/component/utils/openplatform/openplatform",
		
		//elcms 特殊配置
		"simplereportgrid":"eling/component/ui/simplereportgrid/1.0.0/dist/simplereportgrid",
		"todolist" : "eling/component/ui/todolist/1.0.0/dist/todolist",
		"mainframe" : "eling/elcms/mainframe/src/mainframe",
		"dashboard" : "eling/elcms/dashboard/src/dashboard",
		"approvalUI":"eling/elcms/fp/approvalUtils/approvalUtils",
		"basedoc" : "eling/component/module/basedoc/basedoc",
		"healthstandard":"eling/component/module/healthstandard/healthstandard",
		"inner_environment" : "eling/component/module/environment/inner",
		"outer_environment" : "eling/component/module/environment/out",
		"flotwrapper":"eling/component/utils/flotwrapper",
		
		//当前业务开发使用的版本
		"text" : "eling/component/ui/text/1.0.0/dist/text{mode}",
		"textarea" : "eling/component/ui/textarea/1.0.0/dist/textarea{mode}",
		"select" : "eling/component/ui/select/1.0.0/dist/select{mode}",
		"checkradio" : "eling/component/ui/checkradio/1.0.0/dist/checkradio{mode}",
		"autocomplete" : "eling/component/ui/autocomplete/1.0.0/dist/autocomplete{mode}",
		"button" : "eling/component/ui/button/1.0.0/dist/button{mode}",
		"date" : "eling/component/ui/date/1.0.0/dist/date{mode}",
		"buttongroup" : "eling/component/ui/buttongroup/1.0.0/dist/buttongroup{mode}",
		"daterange" : "eling/component/ui/daterange/1.0.0/dist/daterange{mode}",
		"file" : "eling/component/ui/file/1.0.0/dist/file{mode}",
		"place" : "eling/component/ui/place/1.0.0/dist/place{mode}",
		"number" : "eling/component/ui/number/1.0.0/dist/number{mode}",
		"admindivision" : "eling/component/ui/admindivision/1.0.0/dist/admindivision{mode}",
		"richtexteditor": "eling/component/ui/richtexteditor/1.0.0/dist/richtexteditor{mode}",
		"subnav" : "eling/component/ui/subnav/2.0.0/dist/subnav{mode}",
		"grid" : "eling/component/ui/grid/2.0.0/dist/grid{mode}",
		"form" : "eling/component/ui/form/3.0.0/dist/form{mode}",
		"editgrid" : "eling/component/ui/editgrid/2.0.0/dist/editgrid{mode}",
		"wizard" : "eling/component/ui/wizard/2.0.0/dist/wizard{mode}",
		"dialog" : "eling/component/utils/dialog/2.0.0/dist/dialog{mode}",
		"colorpicker" : "eling/component/ui/colorpicker/1.0.0/dist/colorpicker{mode}",
	},
	
	vars:{
		mode : debug ? "-debug" : ""
	},
	
	base : ctx + "assets/",
	
	map : [[/^(.*\.(?:css|js|tpl))(.*)$/i, '$1?'+version]],
	
	preload:["$"]
});

seajs.on("server-response-event",function(){
	var btn = $(".J-form-save");
	var span = btn.find(".J-form-saveText")
	btn.removeAttr("disabled","disabled");
});
seajs.on("server-request-save-event",function(){
	var btn = $(".J-form-save");
	var span = btn.find(".J-form-saveText")
	btn.attr("disabled","disabled");
});
