require(["../../requirejs/config"],function(){
	require(["eling","hbars!./modules/cardbillrecord/cardbilldetail",
	         "backbone","loading"],function(eling,tpl,Backbone,Loading){
		Loading.start();
		var CardBillDetail = Backbone.Model.extend({
	    	idAttribute : "billNo",
	    	url:"api/cardSolution/purchasehistoryitem/queryBill",
	    	load : function(){
				this.fetch({
					data : {
						billNo :  eling.getParameter("billNo"),
						billDate : eling.getParameter("billDate")
					}
				});
	    	},
	    	parse:function(datas){
	    		var time = moment(datas[0].dateTime).format("YYYY-MM-DD HH:mm");
	    		for(var i in datas){
	    			datas[i].itemMoney = (datas[i].itemPrice * datas[i].itemQty).toFixed(2);
	    		}
	    		return{
	    			time : time,
	    			datas : datas
	    		}
	    	}
	    });
	    
	    var CardBillDetailView = Backbone.View.extend({
	    	el:"body",
	    	initialize:function(){
	    		this.model = new CardBillDetail();
	    		this.model.on("change",this.render,this);
	    	},
	    	load:function(){
	    		this.model.load();
	    	},
	    	render:function(){
	    		this.$el.html(tpl(this.model.toJSON()));
	    	}
	    });
		
		var view = new CardBillDetailView();
		view.render();
		view.load();
		Loading.end();
	});
});