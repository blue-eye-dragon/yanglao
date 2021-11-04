define(["backbone","hbars!./modules/healthdata/dashboard/dashboard"],function(eling,tpl){
	
	//www.eling.com.cn/com.eling.elcms/mobile/modules/healthdata/index.html#3497  => 3497
	var pkPersonalInfo = location.hash.substring(1);
	
	//查询权限菜单
	var pMenus = null;
	$.ajax({
		url:"api/wcchildmenumember/querymemberhealthdatasmenu",
		data:{
			pkPersonalInfo:pkPersonalInfo,
			stairMenu :"healthdatas",
			fetchProperties : "*"
		},
		dataType:"json",
		async:false,
		success:function(data){
			pMenus = data;
		}
	});
	
	//默认全部权限的菜单
	var defaultMenus = {
		"血压" : {
			pkHealthExamDataType : 1,
			color : "blue",
			icon : "stethoscope",
			name : "血压"
		},
		"血糖(空腹)" : {
			pkHealthExamDataType : 2,
			color : "green",
			icon : "tint",
			name : "血糖(空腹)"
		},
		"血氧" : {
			pkHealthExamDataType : 3,
			color : "orange",
			icon : "heart",
			name : "血氧"
		},
		"体脂" : {
			pkHealthExamDataType : 4,
			color : "red",
			icon : "medkit",
			name : "体脂"
		},
		"心率" : {
			pkHealthExamDataType : 5,
			color : "muted",
			icon : "certificate",
			name : "心率"
		},
		"心电图" : {
			pkHealthExamDataType : 6,
			color : "purple",
			icon : "magnet",
			name : "心电图"
		},
		"体温" : {
			pkHealthExamDataType : 7,
			color : "pink",
			icon : "stethoscope",
			name : "体温"
		},
		"运动量" : {
			pkHealthExamDataType : 8,
			color : "banana",
			icon : "tint",
			name : "运动量"
		}
	};
	
	var realMenus = {}, totalTypes = "";
	
	//在实际菜单中增加总览
	if(pMenus && pMenus.length != 0){
		var totalMenu = {
			color:"dark-orange",
			icon:"th-list",
			name:"总览"
		};
		realMenus["总览"] = totalMenu;
	}
	
	//实际菜单
	for(var i in pMenus){
		var display = pMenus[i].display;
		var menu = defaultMenus[display];
		
		var pkHealthExamDataType = menu ? menu.pkHealthExamDataType : null;
		
		if(pkHealthExamDataType){
			if(pkHealthExamDataType == "1"){
				menu.url = "#" + pkPersonalInfo + "/bloodpressure/" + pkHealthExamDataType;
			}else if(pkHealthExamDataType == "6"){
				menu.url = "#" + pkPersonalInfo + "/electrocardiogram/index/" + pkHealthExamDataType;
			}else{
				menu.url = "#" + pkPersonalInfo + "/detail/" + pkHealthExamDataType + "/" + display;
			}
			realMenus[display] = menu;
			
			totalTypes += pkHealthExamDataType + ",";
		}
	}
	
	if(pMenus && pMenus.length != 0){
		realMenus["总览"].url = "#" + pkPersonalInfo + "/list/0/" + totalTypes.substring(0,totalTypes.length-1);
	}
	
	var View = Backbone.View.extend({
		el : ".J-content",
		render : function(){
			this.$el.html(tpl(realMenus));
		}
	});
	
	
	var Router = Backbone.Router.extend({
		routes : {
			":pkPersonalInfo" : "index"
		},
		index : function(pkPersonalInfo){
			if(this.view){
				this.view.render();
			}else{
				this.view = new View({pkPersonalInfo : pkPersonalInfo});
				this.view.render();
			}
		}
	});
	
	return Router;
});
