define(["backbone","hbars!./modules/report/apartmentstatus/apartmentstatus","chart","moment","underscore"],function(Backbone,tpl){
	var Model = Backbone.Model.extend({
		url : "api/checkin/status",
		parse : function(data){
			var pieData = {
				empty : {
					color: "#13D842",
					label: "空房"
				},
				checkIn : {
					color:"#f34541",
					label: "入住"
				},
				waitting : {
					color: "#00acec",
					label: "预住"
				},
				outRoomMaintenance : {
					color: "#f8a326",
					label: "退房维修"
				},
				notLive : {
					color: "#F987A5",
					label: "选房不住"
				},
				occupy:{
					color: "rgb(165, 98, 98)",
					label: "占用"
				},
				appoint:{
					color: "#9564e2",
					label: "已预约"
				}
			};
			
			var room = data.room;
			var total = room.apartment;
			for(var i in room){
				if(i in pieData){
					pieData[i].value = room[i];
					pieData[i].percent = (room[i]/total*100).toFixed(2);
				}
			}
			var softData = _.sortBy(pieData,function(item){
				return -parseFloat(item.percent);
			});
			return softData;
		},
		load : function(){
			this.fetch({
				data : {
					fetchProperties : "room.apartment,room.empty,room.checkIn,room.Appoint," +
							"room.NotLive,room.outRoomMaintenance,room.notLive,room.Occupy"
				}
			});
		}
	});
	
	var View = Backbone.View.extend({
		el : "body",
		render : function(){
			var pieData = this.model.toJSON();
			this.$el.html(tpl({data:pieData}));
			var ctx = $("#chart-area")[0].getContext("2d");
			new Chart(ctx).Pie(pieData);
		}
	});
	
	var Router = Backbone.Router.extend({
		routes : {
			"apartmentstatus" : "index"
		},
		index : function(){
			//1.初始化视图
			this.view = new View();
			
			//2.初始化模型
			this.model = new Model();
			this.model.on("change",this.view.render,this.view);
			
			//3.模型和视图绑定
			this.view.model = this.model;
			
			//4.加载数据
			this.model.load();
		}
	});
	
	return Router;
});