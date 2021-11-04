define(["eling","hbars!./modules/lifedata/sleeplog/sleeplogL",
         "hbars!./modules/lifedata/sleeplog/sleeplogT",
         "backbone","jquery.flot"],function(eling,tplL,tplT,Backbone){
	var today = moment().startOf("days");
	var yesterday = moment().startOf("days").subtract("days",1);
	var tomorrow = moment().startOf("days").add("days",1);
	
	var SleepLog=Backbone.Model.extend({
		url:"api/sleepinglog/query",
		defaults:{
			title:today.format("MM-DD"),
			hasNext:0
		},
		getParams:function(){
			var date = yesterday.valueOf() , dateEnd = tomorrow.valueOf();
			var name = decodeURI(eling.getParameter("name"));
			if(name.indexOf("张某某")!=-1 || name.indexOf("李某某")!=-1 || name.indexOf("王某某")!=-1 || 
					name.indexOf("赵某某")!=-1 || name.indexOf("王爱玲")!=-1){
				date = 1408716000000;
				dateEnd = 1408744800000;
			}
			return {
				fetchProperties:"date,status.key",
				member:eling.getParameter("member"),
				date:date,
				dateEnd:dateEnd
			};
		},
		parse:function(data){
			var datas=[];
			var coordinate=[];
			if(data && data.length!=0){
				//补数据，前后各补一个未睡眠，时常为1小时
				data=[{date:data[0].date-3600000,status:{key:"No"}}].concat(data);
				data.push({date:data[data.length-1].date+3600000,status:{key:"No"}});
				//计算整个时间轴的总长度，做为分母
				var total=data[data.length-1].date-data[0].date;
				var i=0;
				for(i=0;i<data.length;i++){
					if(data[i+1]){
						var type=data[i].status.key;
						var temp={
							className:type == "No" ? "nosleep" : ( type == "Light" ? "lightsleep" : "deepsleep"),
							width:(data[i+1].date-data[i].date)/total*100+"%"
						};
						datas.push(temp);
					}
				}
				//计算时间轴（横坐标）
				var statrTime=moment(data[0].date).hours();
				var endTime=moment(data[data.length-1].date).hours();
				for(i=statrTime;i<24;i++){
					coordinate.push({
						text:i<10 ? "0"+i : i
					});
				}
				for(i=0;i<endTime;i++){
					coordinate.push({
						text:i<10 ? "0"+i : i
					});
				}
			}
			this.set({
				"coordinate":{items:coordinate,width:100/coordinate.length+"%"},
				"data":datas,
				"goals":"75分",
				"totals":[{label:"深度睡眠",value:"3小时43分钟"},{label:"浅度睡眠",value:"3小时38分钟"},{label:"入睡时间",value:"22:14"},
			        {label:"起床时间",value:"05:14"},{label:"清醒次数",value:"2次"},{label:"睡眠时间",value:"7小时21分钟"}]
			});
			var name = decodeURI(eling.getParameter("name"));
			if(name.indexOf("张某某")!=-1 || name.indexOf("李某某")!=-1 || name.indexOf("王某某")!=-1 || 
					name.indexOf("赵某某")!=-1 || name.indexOf("王爱玲")!=-1){
				this.trigger("demo");
			}
		}
	});
	
	var SleeplogView = Backbone.View.extend({
		el:".J-sleeplog-content",
		initialize:function(){
			this.model = new SleepLog();
			this.model.on("change:title",this.load,this);
			this.model.on("change:coordinate",this.render,this);
			this.model.on("demo",this.render,this);
		},
		events:{
			"tap .J-prev" : function(){
				today.subtract("days",1);
				yesterday.subtract("days",1);
				tomorrow.subtract("days",1);
				this.model.set({
					title:today.format("MM-DD"),
					hasNext : this.model.get("hasNext")+1
				});
				return false;
			},
			"tap .J-next" : function(e){
				today.add("days",1);
				yesterday.add("days",1);
				tomorrow.add("days",1);
				if(this.model.get("hasNext") > 0){
					this.model.set({
						title:today.format("MM-DD"),
						hasNext : this.model.get("hasNext")-1
					});
				}
				return false;
			}
		},
		render:function(){
			this.$el.html(tplT(this.model.toJSON()));
		},
		load:function(){
			this.model.fetch({
				data:this.model.getParams(),
	    		dataType:"json"
			});
		}
	});
	
	var SleeplogTrend=Backbone.Model.extend({
		url:"api/sleepinglog/query",
		defaults:{
			title:moment().subtract("days",7).format("MM.DD")+"-"+moment().format("MM.DD"),
			datas:[]
		},
		parse:function(data){
			data=[76,98,65,72,88,90,78];
			var min=_.min(data);
			var max=_.max(data);
			data=[[[1,76],[2,98],[3,65],[4,72],[5,88],[6,90],[7,78]]];
			this.set("min",min);
			this.set("max",max);
			this.set("datas",data);
		},
		getParams:function(){
			
		}
	});
	
	var SleeplogTrendView=Backbone.View.extend({
		el:".J-sleeplog-content",
		initialize:function(){
			this.model = new SleeplogTrend();
		},
		render:function(){
			this.$el.html(tplL(this.model.toJSON()));
			$.plot(".J-sleeplog-last7-chart",this.model.get("datas"),{
				series: {
					lines: {
						fill: true
					},
					shadowSize: 0.8
				},
				yaxis:{
					min:this.model.get("min")-5,
					max:this.model.get("max")+5
				},
				grid: {
					borderWidth: 0
				},
				colors: ["#00acec"]
			});
		},
		load:function(){
			this.model.fetch({
				data:this.model.getParams(),
	    		dataType:"json"
			});
		}
	});
	
	var MainView = Backbone.View.extend({
		el:".J-sleeplog",
		initialize:function(){
			this.sleeplogView = new SleeplogView();
			this.sleeplogTrendView = new SleeplogTrendView();
		},
		render:function(){
			this.sleeplogView.render();
			this.sleeplogView.load();
			this.sleeplogTrendView.load();
		},
		events:{
			"tap .J-btn-today" : function(e){
				$(".J-btn-today").addClass("btn-danger");
				$(".J-btn-last7days").removeClass("btn-danger");
				this.sleeplogView.render();
				return false;
			},
			"tap .J-btn-last7days" : function(e){
				$(".J-btn-today").removeClass("btn-danger");
				$(".J-btn-last7days").addClass("btn-danger");
				this.sleeplogTrendView.render();
				return false;
			}
		}
	});
	var view = new MainView();
	view.render();
});