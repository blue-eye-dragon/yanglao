define(["eling","backbone","hbars!./modules/healthdata/bloodpressure/bloodpressure","jquery.flot"],function(eling,Backbone,tpl){
	var isDemo = false,demoDatas = [];
	
	var sidebarInstance = null;
	
	var today = moment().startOf("days");
	var lastWeek = moment().subtract(6,"days").startOf("days");
	var type = null;
	var hasNext = 0;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkHealthExamData",
		url : "api/healthexamdata/query",
		defaults : {
			"chart":{  
				hBloodPress:[],
				lBlooadPress:[],
				xMax:today.valueOf(),
				xMin:lastWeek.valueOf(),
				yMax:0,
				yMin:0
			},
			"last":{
				high: 0,
				low: 0
			}
		},
		parse:function(datas){
			datas = isDemo ? this.getDemoData() : datas
			var results = {value1:[],value2:[]};
			for(var i=datas.length-1;i>=0;i--){
				if(datas[i].value2){
					results.value2.push([datas[i].createDate,parseFloat(datas[i].value2)]);
				}
				if(datas[i].value1){
					results.value1.push([datas[i].createDate,parseFloat(datas[i].value1)]);
				}
			}
			
			var max1 = parseFloat(_.max(datas,function(data){return data.value1}).value1);
			var max2 = parseFloat(_.max(datas,function(data){return data.value2}).value2);
			var min1 = parseFloat(_.min(datas,function(data){return data.value1}).value1);
			var min2 = parseFloat(_.min(datas,function(data){return data.value2}).value2);
			
			var yMax = datas.length != 0 ? Math.max(max1,max2,min1,min2) : 0 , 
				yMin = datas.length != 0 ? Math.min(max1,max2,min1,min2) : 0 ;
				define(["eling","backbone","hbars!./modules/healthdata/bloodpressure/bloodpressure","jquery.flot"],function(eling,Backbone,tpl){
	var isDemo = false,demoDatas = [];
	
	var sidebarInstance = null;
	
	var today = moment().startOf("days");
	var lastWeek = moment().subtract(6,"days").startOf("days");
	var type = null;
	var hasNext = 0;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkHealthExamData",
		url : "api/healthexamdata/query",
		defaults : {
			"chart":{  
				hBloodPress:[],
				lBlooadPress:[],
				xMax:today.valueOf(),
				xMin:lastWeek.valueOf(),
				yMax:0,
				yMin:0
			},
			"last":{
				high: 0,
				low: 0
			}
		},
		parse:function(datas){
			datas = isDemo ? this.getDemoData() : datas
			var results = {value1:[],value2:[]};
			for(var i=datas.length-1;i>=0;i--){
				if(datas[i].value2){
					results.value2.push([datas[i].createDate,parseFloat(datas[i].value2)]);
				}
				if(datas[i].value1){
					results.value1.push([datas[i].createDate,parseFloat(datas[i].value1)]);
				}
			}
			
			var max1 = parseFloat(_.max(datas,function(data){return data.value1}).value1);
			var max2 = parseFloat(_.max(datas,function(data){return data.value2}).value2);
			var min1 = parseFloat(_.min(datas,function(data){return data.value1}).value1);
			var min2 = parseFloat(_.min(datas,function(data){return data.value2}).value2);
			
			var yMax = datas.length != 0 ? Math.max(max1,max2,min1,min2) : 0 , 
				yMin = datas.length != 0 ? Math.min(max1,max2,min1,min2) : 0 ;
				
				
			var high = 0, low = 0;
			if(datas && datas[0] && datas[0].createDate >= today.startOf("days").valueOf()){
				high = datas[0].value1;
				low = datas[0].value2;
			}
			this.set({
				"title" : sidebarInstance.getMember().personalInfo.name,
				"chart" : {
					hBloodPress:results.value1,
					lBlooadPress:results.value2,
					xMax:today.valueOf(),
					xMin:lastWeek.valueOf(),
					yMax:yMax,
					yMin:yMin
				},
				"last" : {
					high: high,
					low: low
				}
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
					type:type
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
			var chart = this.model.get("chart");
			$el.html(tpl({
				title : sidebarInstance.getMember().personalInfo.name,
				date : today.format("YYYY.MM.DD"),
				range : lastWeek.format("MM.DD")+"-"+today.format("MM.DD"),
				high : this.model.get("last").high || 0,
				low : this.model.get("last").low || 0,
				hasNext : hasNext
			}));
    		var datas = [chart.hBloodPress,chart.lBlooadPress];
			$.plot(".J-healthdata-last7-chart",datas,{
  				series: {
  					lines: {show: true},
  					points: {show: true },
  					shadowSize: 0.8
  				},
  				xaxis:{show:false},
  				yaxis:{
  					min : Number(chart.yMin) == 0 ? 80 : Number(chart.yMin)-10,
  					max : Number(chart.yMax) == 0 ? 130 : Number(chart.yMax)+10,
					tickSize : (chart.yMax - chart.yMin)/5
  				},
  				grid: {borderWidth: 0},
  				colors: ["#00acec","#f34541"]
  			});
		}
	});
	
	var Router = Backbone.Router.extend({
		initialize : function(sidebar){
			sidebarInstance = sidebar;
		},
		routes : {
			":pkPersonalInfo/bloodpressure/:pkHealthExamType" : "index"
		},
		index : function(pkPersonalInfo,pkHealthExamType){
			//初始化条件
			today = moment().startOf("days");
			lastWeek = moment().subtract(6,"days").startOf("days");
			type = pkHealthExamType;
			hasNext = 0;
			demoDatas = [];
			for(var i=0;i<30;i++){
				demoDatas.push({
					pkHealthExamData : i,
					value1 : parseInt((Math.random())*(135-120))+120,
					value2 : parseInt((Math.random())*(110-95))+95
				});
			}
			//初始化视图
			var view = new View();
			view.render();
			view.model.load();
		}
	});
	
	return Router;
});
				
			var high = 0, low = 0;
			if(datas && datas[0] && datas[0].createDate >= today.startOf("days").valueOf()){
				high = datas[0].value1;
				low = datas[0].value2;
			}
			this.set({
				"title" : sidebarInstance.getMember().personalInfo.name,
				"chart" : {
					hBloodPress:results.value1,
					lBlooadPress:results.value2,
					xMax:today.valueOf(),
					xMin:lastWeek.valueOf(),
					yMax:yMax,
					yMin:yMin
				},
				"last" : {
					high: high,
					low: low
				}
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
					type:type
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
			var chart = this.model.get("chart");
			$el.html(tpl({
				title : sidebarInstance.getMember().personalInfo.name,
				date : today.format("YYYY.MM.DD"),
				range : lastWeek.format("MM.DD")+"-"+today.format("MM.DD"),
				high : this.model.get("last").high || 0,
				low : this.model.get("last").low || 0,
				hasNext : hasNext
			}));
    		var datas = [chart.hBloodPress,chart.lBlooadPress];
			$.plot(".J-healthdata-last7-chart",datas,{
  				series: {
  					lines: {show: true},
  					points: {show: true },
  					shadowSize: 0.8
  				},
  				xaxis:{show:false},
  				yaxis:{
  					min : Number(chart.yMin) == 0 ? 80 : Number(chart.yMin)-10,
  					max : Number(chart.yMax) == 0 ? 130 : Number(chart.yMax)+10,
					tickSize : (chart.yMax - chart.yMin)/5
  				},
  				grid: {borderWidth: 0},
  				colors: ["#00acec","#f34541"]
  			});
		}
	});
	
	var Router = Backbone.Router.extend({
		initialize : function(sidebar){
			sidebarInstance = sidebar;
		},
		routes : {
			":pkPersonalInfo/bloodpressure/:pkHealthExamType" : "index"
		},
		index : function(pkPersonalInfo,pkHealthExamType){
			//初始化条件
			today = moment().startOf("days");
			lastWeek = moment().subtract(6,"days").startOf("days");
			type = pkHealthExamType;
			hasNext = 0;
			demoDatas = [];
			for(var i=0;i<30;i++){
				demoDatas.push({
					pkHealthExamData : i,
					value1 : parseInt((Math.random())*(135-120))+120,
					value2 : parseInt((Math.random())*(110-95))+95
				});
			}
			//初始化视图
			var view = new View();
			view.render();
			view.model.load();
		}
	});
	
	return Router;
});