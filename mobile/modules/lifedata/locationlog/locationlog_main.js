define(["eling","hbars!./modules/lifedata/locationlog/locationlog","backbone"],function(eling,tpl,Backbone){
	var hasNext = 0;
	
	var LocationLog=Backbone.Model.extend({
		url:"api/locationlog/query",
		defaults:{
			hasNext:hasNext,
			today:moment().startOf("days").valueOf(),
			yesterday:moment().subtract("days",1).startOf("days").valueOf(),
			tomorrow:moment().add("days",1).startOf("days").valueOf(),
			member:$(".active.J-sidebar-panel-item").attr("data-key"),
			date:moment().format("MM-DD"),
			coordinate:[{text:"02",left:"8.33333333%"},{text:"06",left:"25%"},{text:"10",left:"41.66666667%"},
			            {text:"14",left:"58.33333336%"},{text:"18",left:"75%"},{text:"22",left:"91.66666667%"}]
		},
		getParams:function(){
			return {
				date:this.get("today"),
				dateEnd:this.get("tomorrow")-1,
    			member:this.get("member")
			};
		},
		parse:function(data){
			var today=this.get("today");
			var tomorrow=this.get("tomorrow");
			var rows={
				Restroom:{icon:"toilet",color:"#337ab7",datas:[]},
				LivingRoom:{icon:"coffee",color:"#5cb85c",datas:[]},
				Kitchen:{icon:"food",color:"#5bc0de",datas:[]},
				Bedroom:{icon:"inbox",color:"#f0ad4e",datas:[]},
				Outdoor:{icon:"plane",color:"#d9534f",datas:[]}
			};
			//处理数据
			if(data.length!=0 && data[0].type=="Out"){
				data=[{
					date:today,
					location:data[0].location,
					type:"In"
				}].concat(data);
			}
			//如果最后一条数据时In，则要补一条Out，时间为当前时间
			if(data.length!=0 && data[data.length-1].type == "In"){
				data.push({
					date:moment().valueOf() > tomorrow.valueOf() ? tomorrow.valueOf()-1 : moment().valueOf(),
					location:data[data.length-1].location,
					type:"Out"
				});
			}
			for(var i=0;i<data.length;i++){
				if(data[i].type == "In"){
					data[i].left=(data[i].date-today)/864000+"%";
					data[i].width= ((data[i+1] ? data[i+1].date : moment().valueOf())-data[i].date)/864000+"%";
					var location=data[i].location;
					rows[location].datas.push(data[i]);
				}
			}
			this.set("rows",rows);
		}
	});
	
	var LocationLogView=Backbone.View.extend({
		el:".J-locationlog",
		initialize:function(){
			this.model=new LocationLog();
			this.model.on("change:today",this.change,this);
			this.model.on("change:rows",this.render,this);
		},
		events:{
			"tap .J-prev" : function(){
				hasNext++;
				this.model.set({
					"hasNext":hasNext,
					"date":moment(this.model.get("yesterday")).format("MM-DD"),
					"yesterday":this.model.get("yesterday")-86400000,
					"today":this.model.get("today")-86400000,
					"tomorrow":this.model.get("tomorrow")-86400000
				});
				return false;
			},
			"tap .J-next" : function(){
				if(hasNext > 0){
					hasNext--;
					this.model.set({
						"hasNext":hasNext,
						"date":moment(this.model.get("tomorrow")).format("MM-DD"),
						"yesterday":this.model.get("yesterday")+86400000,
						"today":this.model.get("today")+86400000,
						"tomorrow":this.model.get("tomorrow")+86400000
					});
				}
				return false;
			}
		},
		render:function(){
			this.$el.html(tpl(this.model.toJSON()));
		},
		change:function(){
			this.$el.find(".J-locationlog-title").text(this.model.get("date"));
			this.load();
		},
		load:function(){
			this.model.fetch({
				data:this.model.getParams(),
	    		dataType:"json",
	    		success:function(){
	    			view.render();
	    		}
			});
		}
	});
	var view=new LocationLogView();
	view.render();
	view.load();
});
