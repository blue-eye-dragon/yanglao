define(["eling","backbone","hbars!./modules/healthdata/healthdatadetail/healthdata_detail","jquery.flot"],function(eling,Backbone,tpl){
	var isDemo = false , demoDatas = [];
	
	//ranges用来做测试数据
	var types = {
		"2" : {
			id : "2",
			name : "血糖（空腹）",
			ranges : [5,8],
			fixed : 1
		},
		"3" : {
			id : "3",
			name : "血氧",
			ranges : [94,98],
			fixed : 1
		},
		"4" : {
			id : "4",
			name : "体脂",
			ranges : [18,20],
			fixed : 1
		},
		"5" : {
			id : "5",
			name : "心率",
			ranges : [65,75],
			fixed : 0
		},
		"7" : {
			id : "7",
			name : "体温",
			ranges : [37.2,37.8]
		},
		"8" : {
			id : "8",
			name : "运动量",
			ranges : [10000,18000],
			fixed : 0
		}
	};
	
	var sidebarInstance = null;
	
	var today = moment().startOf("days");
	var lastWeek = moment().subtract(6,"days").startOf("days");
	var type = null;
	var hasNext = 0;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkHealthExamData",
		url : "api/healthexamdata/query",
		defaults : {
			chart : [],
			last : 0
		},
		parse:function(datas){
			datas = isDemo ? this.getDemoData() : datas;
			var chart = [];
			for(var i=datas.length-1;i>=0;i--){
				datas[i].value1 = parseFloat(datas[i].value1);
				chart.push([datas[i].createDate,datas[i].value1]);
			}
			
			var max = _.max(datas,function(data){
				return data.value1;
			}).value1;
			var min = _.min(datas,function(data){
				return data.value1;
			}).value1;
			var tickSize = (max-min)/5;
			
			var last = 0;
			if(datas && datas[0] && datas[0].createDate >= today.startOf("days").valueOf()){
				last = datas[0].value1;
			}
			
			this.set({
				member : sidebarInstance.getMember().personalInfo.name,
				chart : chart,
				last : last,
				min : parseFloat(min),
				max : parseFloat(max),
				tickSize : parseFloat(tickSize)
			});
			this.trigger("change");
		},
		load : function(){
			eling.loading(true);
			this.fetch({
				data : {
					member:sidebarInstance.getMember().pkMember,
					createDate : lastWeek.valueOf(),
					createDateEnd : today.endOf("days").valueOf(),
					type : type.id
				},
				success : function(){
					eling.loading(false);
				}
			});
		},
		getDemoData : function(){
			var results = [],createDate = moment().endOf("days");
			//1首先计算当前系统时间和当前查询时间之间相差的天数，将这个差作为循环的开始
			var start = createDate.diff(today, "days");
			for(var i=0;i<14;i++){
				var index = start + i >= 30 ? (start + i)%30 : start + i;
				demoDatas[index].createDate = createDate.subtract(12,"hours").valueOf();
				results.push(demoDatas[index]);
			}
			return results;
		}
	});
	
	var View = Backbone.View.extend({
		el : ".J-content",
		initialize : function(){
			var model = new Model();
			this.model = model;
			this.model.on("change",this.render,this);
			
			this.$el.off();
			sidebarInstance.off().on("sidebar-member-change",function(){
				model.load();
			});
		},
    	events:{
			"tap .J-prev" : function(){
				today.subtract("days",1);
				lastWeek.subtract("days",1);
				hasNext++;
				this.model.load();
			},
			"tap .J-next" : function(){
				today.add("days",1);
				lastWeek.add("days",1);
				hasNext--;
				this.model.load();
			},
			"tap .J-prev-week" : function(){
				today.subtract("days",7);
				lastWeek.subtract("days",7);
				hasNext+=7;
				this.model.load();
			},
			"tap .J-next-week" : function(){
				today.add("days",7);
				lastWeek.add("days",7);
				hasNext-=7;
				if(hasNext < 0){
					//说明已经超过今天了
					today = moment().startOf("days");
					lastWeek = moment().subtract(6,"days").startOf("days");
					hasNext = 0;
				}
				this.model.load();
			}
		},
		render : function(){
			var $el = this.$el;
			var model = this.model;
			$el.html(tpl({
				member : sidebarInstance.getMember().personalInfo.name,
				typeName : type.name,
				date : today.format("YYYY.MM.DD"),
				range : lastWeek.format("MM.DD")+"-"+today.format("MM.DD"),
				high : model.get("last"),
				hasNext : hasNext
			}));
			$.plot(".J-healthdata-last7-chart",[model.get("chart")],{
  				series: {
  					lines: {show: true},
  					points: {show: true },
  					shadowSize: 0.8
  				},
  				xaxis:{show : false},
  				yaxis:{
  					min : model.get("min") - model.get("tickSize"),
  					max : model.get("max") + model.get("tickSize"),
					tickSize : model.get("tickSize")
  				},
  				grid: {borderWidth: 0},
  				colors: ["#f34541"]
  			});
		}
	});
	
	var Router = Backbone.Router.extend({
		initialize : function(sidebar){
			sidebarInstance = sidebar;
		},
		routes : {
			":pkPersonalInfo/detail/:pkHealthExamType/:name" : "index"
		},
		index : function(pkPersonalInfo,pkHealthExamType,name){
			//初始化测试数据
			today = moment().startOf("days");
			lastWeek = moment().subtract(6,"days").startOf("days");
			hasNext = 0;
			type = types[pkHealthExamType];
			demoDatas = [];
			for(var i=0;i<30;i++){
				demoDatas.push({
					pkHealthExamData : i,
					value1 : (parseFloat((Math.random())*(type.ranges[1]-type.ranges[0]))+type.ranges[0]).toFixed(type.fixed)
				});
			}
			//初始化视图
			var view = new View();
			view.model.load();
		}
	});
	
	return Router;
});
