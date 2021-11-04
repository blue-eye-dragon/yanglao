define(["eling","backbone",
        "hbars!./modules/report/checkoutannualreport/checkoutannualreport",
        "hbars!./modules/report/checkoutannualreport/checkoutannualreport_item"],function(eling,Backbone,tpl,tplItem){
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkCheckOutRoomApply"
	});
	
	var Collection = Backbone.Collection.extend({
		model : Model,
		url : "api/checkoutroomapply/query",
		parse : function(datas){
			for(var i=0;i<datas.length;i++){
				datas[i].checkOutDateStr = moment(datas[i].checkOutDate).format("MM月DD日");
			}
			return datas;
		}
	});
	
	var View = Backbone.View.extend({
		el : ".el-mobile-report-detail",
		initialize : function(){
			this.options = {
				firstResult : 0,
				hasNext : 0,
				startMonth : moment().startOf("year"),
				endMonth : moment().endOf("year")
			};
			this.collection = new Collection();
			this.collection.on("add",this.renderItem,this);
		},
		events : {
			"tap .J-prev" : function(){
				this.options.firstResult = 0;
				this.options.hasNext++;
				this.options.startMonth.subtract("year",1);
				this.options.endMonth.subtract("year",1);
				this.render();
				this.load();
			},
			"tap .J-next" : function(){
				this.options.firstResult = 0;
				this.options.hasNext--;
				this.options.startMonth.add("year",1);
				this.options.endMonth.add("year",1);
				this.render();
				this.load();
			}
		},
		render : function(){
			this.$el.html(tpl({
				date : this.options.startMonth.format("YYYY"),
				hasNext : this.options.hasNext
			}));
		},
		renderItem : function(model){
			$(".list-group").append(tplItem(model.toJSON()));
		},
		bindEvent : function(){
			var that = this;
			$("ul").scroll(function(){
				var offsetHeight = $("ul")[0].scrollHeight;
				var clientHieght = $("ul").height();
				var scrollTop = $("ul").scrollTop();
		    	if (offsetHeight - clientHieght >= scrollTop - 5 && 
		    			offsetHeight - clientHieght <= scrollTop + 5 ) {
		    		that.options.firstResult += 10;
		    		that.load();
		    	}
			});
		},
		load : function(){
			eling.loading(true);
			this.collection.fetch({
				data : {
					firstResult : this.options.firstResult,
					maxResults : 10,
					checkOutDate : this.options.startMonth.valueOf(),
					checkOutDateEnd : this.options.endMonth.valueOf(),
					fetchProperties : "pkCheckOutRoomApply,checkOutDate,checkOutReason,memberSigning.room.number,memberSigning.annualFee,annualCheckOutFee"
				},
				success : function(){
					eling.loading(false);
				}
			});
		}
	});
	
	return View;
	
});