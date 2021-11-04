define(["eling","backbone","hbars!./modules/healthdailyrecords/dashboard/dashboard"],
		function(eling,Backbone,tpl){
	
	var pkPersonalInfo = location.hash.substring(1);
	
	var datas = [];
	
	//chaxun quanxian
	$.ajax({
		url:"api/wcchildmenumember/querymemberhealthrecordsmenu",
		data:{
			pkPersonalInfo:pkPersonalInfo,
			stairMenu :"healthdailyrecords",
		},
		dataType:"json",
		async:false,
		success:function(data){//拿到的data为该微信用户所关注会员拥有的菜单的交集
			if(data){
				for(var i=0;i<data.length;i++){
					if(data[i].code == "2010"){
						datas.push({color:"purple",name:"疾病",icon:"stethoscope",
						url:"#"+pkPersonalInfo+"/diseasehistory"})
					}
					if(data[i].code == "2020"){
						datas.push({color:"blue",name:"复诊",icon:"tint",
							url:"#"+pkPersonalInfo+"/nextexam"})
					}
					if(data[i].code == "2030"){
						datas.push({color:"green",name:"住院",icon:"heart",
							url:"#"+pkPersonalInfo+"/patient"})
					}
					if(data[i].code == "2040"){
						datas.push({color:"red",name:"日常",icon:"user-md",
							url:"#"+pkPersonalInfo+"/memberdailyrecord"})
					}
					if(data[i].code == "2050"){
						datas.push({color:"orange",name:"巡检",icon:"medkit",
							url:"#"+pkPersonalInfo+"/healthdoctorevaluation"})
					}
					if(data[i].code == "2060"){
						datas.push({color:"pink",name:"过敏",icon:"magnet",
							url:"#"+pkPersonalInfo+"/aller"})
					}
					if(data[i].code == "2070"){
						datas.push({color:"banana",name:"就诊",icon:"hospital",
							url:"#"+pkPersonalInfo+"/medicalrecords"})
					}
					if(data[i].code == "2080"){
						datas.push({color:"dark-orange",name:"用药",icon:"certificate",
							url:"#"+pkPersonalInfo+"/phatak"})
					}
				}
			}
		}
	});
	
	var View = Backbone.View.extend({
		el : ".J-content",
		render : function(pkPersonalInfo){
			this.$el.html(tpl({datas : datas}));
		}
	});
	
	var view = new View();
	
	var Router = Backbone.Router.extend({
		routes : {
			":pkPersonalInfo" : "index"
		},
		index : function(pkPersonalInfo){
			view.render(pkPersonalInfo);
		}
	});
	
	return Router;
});