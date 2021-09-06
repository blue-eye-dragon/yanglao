require(["../../requirejs/config"],function(config){
	require(["eling","hbars!./modules/cardbillrecord/cardbillrecord",
	         "backbone","loading","sidebar","moment"],function(eling,tpl,Backbone,Loading,Sidebar){
		eling.loading(true);

		var balance = null;
		
		var sidebar = new Sidebar({
			el : ".J-sidebar",
			pkPersonalInfo : location.hash.substring(1)
		});
		sidebar.load();
		sidebar.render();
		
		var today = moment().startOf("days");
		var lastWeek = moment().subtract(6,"days").startOf("days");
		var hasNext = 0;

		$.ajax({
			url:"api/cardSolution/card/member",
			dataType : "json",
			async : false,
			data :{
				"member.pkMember" : sidebar.getMember().pkMember,
			},
			success : function(data){
				balance = data;
			}
		});
		
	    var CardBill = Backbone.Model.extend({
	    	idAttribute : "billNo"
	    });

	    var CardBillCollection = Backbone.Collection.extend({
	    	model:CardBill,
	    	url:"api/cardSolution/purchasehistory/query",
	    	load : function(){
				this.fetch({
					reset : true,
					data : {
						"member.pkMember" : sidebar.getMember().pkMember,
						start:lastWeek.valueOf(),
						end:today.valueOf(),
					}
				});
			},
	    	parse:function(datas){
	    		for(var i in datas){
	    			datas[i].time = moment(datas[i].dateTime).format("YYYY-MM-DD HH:mm");
	    			datas[i].money = datas[i].money.toFixed(2);
	    		}
	    		return datas;
	    	}
	    });

	    var CardBillView = Backbone.View.extend({
	    	el:".J-content",
	    	events:{
	    		"tap .J-showsidebar" : function(e){
	    			sidebar.show();
	    		},
				"tap .J-prev-week" : function(){
					today.subtract("days",7);
					lastWeek.subtract("days",7);
					hasNext+=7;
					this.load();
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
					this.load();
				}
	    	},
	    	initialize:function(){
	    		that = this;
	    		this.collection = new CardBillCollection();
	    		this.collection.on("add",this.render,this);
	    		this.collection.on("reset",this.reset,this);
	    		
	    		collection = this.collection;
	    		
	    		this.$el.off();
	    		sidebar.off().on("sidebar-member-change",function(){
	    			$.ajax({
	    				url:"api/cardSolution/card/member",
	    				dataType : "json",
	    				async : false,
	    				data :{
	    					"member.pkMember" : sidebar.getMember().pkMember,
	    				},
	    				success : function(data){
	    					balance = data;
	    				}
	    			});
	    			that.load();
				});
	    	},
	    	load:function(){
	    		this.collection.reset();
	    		this.collection.load();
	    	},
	    	render:function(){
	    		this.$el.html(tpl({
	    			title:sidebar.getMember().personalInfo.name,
	    			balance : "￥"+balance,
	    			range : lastWeek.format("MM.DD")+"-"+today.format("MM.DD"),
					hasNext : hasNext,
	    			datas : this.collection.toJSON()
	    		}));
	    	},
	    	reset : function(){
	    		this.$("ul").empty();
	    		this.render();
	    	}
	    });
		var view = new CardBillView();
		view.render();
		view.load();
		eling.loading(false);
	});
});
