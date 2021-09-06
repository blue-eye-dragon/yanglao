define(["hbars!./modules/lifedata/dol/dolT",
         "hbars!./modules/lifedata/dol/dolL",
         "backbone","jquery.flot"],function(tplT,tplL,Backbone){
	
	return function(type){
	    var types={
	    	"Restroom":"卫生间",
	    	"LivingRoom":"客厅",
	    	"Kitchen":"厨房",
	    	"Bedroom":"卧室"
	    };
		
		var Dof=Backbone.Model.extend({
			url:"api/durationoflocation/query",
			defaults:{
				type:type,
				date:moment().format("MM-DD"),
				today:moment().startOf("days").valueOf(),
				yesterday:moment().subtract("days",1).startOf("days").valueOf(),
				member:$(".active.J-sidebar-panel-item").attr("data-key")
			},
			getParams:function(){
				return {
					locationIn:this.get("type"),
					date:this.get("yesterday"),
					dateEnd:this.get("today"),
					member:this.get("member")
				};
			},
			parse:function(data){
				var today=this.get("today");
				//计算今天和昨天的时间
				var todayMins=0,yesteMins=0,percent=0,todayTimes=0,yesteTimes=0;
				for(var i=0;i<data.length;i++){
					if(data[i].date == today){
						todayMins+=data[i] ? data[i].duration : 0;
						todayTimes+=data[i] ? data[i].times : 0;
					}else{
						yesteMins+=data[i] ? data[i].duration : 0;
						yesteTimes+=data[i] ? data[i].times : 0;
					}
				}
				//计算次数
				if(todayMins==0 || yesteMins==0){
					percent=100;
				}else{
					percent=Math.round((Math.abs(todayMins-yesteMins))/yesteMins*100,1);
				}
				
				var result={
					minutes:{
						today:(todayMins/60).toFixed(0),
						yesterday:(yesteMins/60).toFixed(0),
						average:((todayMins+yesteMins)/2/60).toFixed(0),
						text:todayMins>=yesteMins ? "增长" : "减少",
						percent:percent
					},
					times:{
						today:todayTimes,
						yesterday:yesteTimes,
						average:(todayTimes+yesteTimes)/2
					}
				};
				
				this.set(result);
			}
		});
		
		var DolView=Backbone.View.extend({
			el:".J-dol-content",
			initialize:function(){
				this.model=new Dof();
				this.model.on("change:date",this.change,this);
				this.model.on("change:minutes change:times",this.render,this);
			},
			events:{
				"tap .J-prev" : function(){
					$(".J-next").removeClass("btn-default").addClass("btn-danger");
					this.model.set({
						"date":moment(this.model.get("yesterday")).format("MM-DD"),
						"yesterday":this.model.get("yesterday")-86400000,
						"today":this.model.get("today")-86400000
					});
					return false;
				},
				"tap .J-next" : function(){
					var today = this.model.get("today")+86400000;
					if(today >= moment().startOf("days").valueOf()){
						$(".J-next").addClass("btn-default").removeClass("btn-danger");
					}
					if(today > moment().startOf("days").valueOf()){
						return false;
					}
					this.model.set({
						"date":moment(this.model.get("date")).add("days",1).format("MM-DD"),
						"yesterday":this.model.get("yesterday")+86400000,
						"today":today
					});
					return false;
				}
			},
			render:function(){
				this.$el.html(tplT(this.model.toJSON()));
			},
			change:function(){
				this.$el.find(".J-dol-today-title").text(this.model.get("date"));
				this.load();
			},
			load:function(){
				this.model.fetch({
					data:this.model.getParams(),
		    		dataType:"json"
				});
			}
		});
		
		var DolTrend=Backbone.Model.extend({
			url:"api/sleepinglog/query",
			defaults:{
				date:moment().subtract("days",7).format("MM.DD")+"-"+moment().format("MM.DD"),
				datas:[]
			},
			parse:function(data){
				data=[44,46,45,43,44,45,47];
				var min=_.min(data);
				var max=_.max(data);
				var datas=[];
				var details=[];
				for(var i=0;i<7;i++){
					if(i!=0){
						details.push({date:moment().subtract("days",i).format("MM-DD"),value:data[i]});
					}
					datas.push([moment().subtract("days",i).format("DD"),data[i]]);
				}
				this.set("min",min);
				this.set("max",max);
				this.set("details",details);
				this.set("datas",datas);
			},
			getParams:function(){
				
			}
		});
		
		var DolTrendView=Backbone.View.extend({
			el:".J-dol-content",
			initialize:function(){
				this.model = new DolTrend();
			},
			render:function(){
				this.$el.html(tplL(this.model.toJSON()));
				$.plot(".J-dol-last7-chart",[this.model.get("datas")],{
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
			el:".J-dol",
			initialize:function(){
				this.dolView = new DolView();
				this.dolTrendView = new DolTrendView();
			},
			render:function(){
				$(".J-dol-title").text(types[type]);
				this.dolView.render();
				this.dolView.load();
				this.dolTrendView.load();
			},
			events:{
				"tap .J-btn-today" : function(e){
					$(".J-btn-today").addClass("btn-danger");
					$(".J-btn-last7days").removeClass("btn-danger");
					this.dolView.render();
				},
				"tap .J-btn-last7days" : function(e){
					$(".J-btn-today").removeClass("btn-danger");
					$(".J-btn-last7days").addClass("btn-danger");
					this.dolTrendView.render();
				}
			}
		});
		var view = new MainView();
		view.render();
	}
});