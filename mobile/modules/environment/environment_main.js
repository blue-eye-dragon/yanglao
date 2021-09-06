require(["../../requirejs/config"],function(){
	require(["eling","backbone","hbars!modules/environment/environment"],function(eling,Backbone,tpl){
		var rooms = [];
		//查新会员
		$.ajax({
			url:"api/member/queryRelatedMembers",
			data:{
				pkPersonalInfo : location.hash.substring(1),
				fetchProperties:"memberSigning.room.pkRoom,memberSigning.room.number"
			},
			dataType : "json",
			async : false,
			success : function(data){
				var map = {}; 
				for(var i=0;i<data.length;i++){
					var pkRoom = data[i].memberSigning.room.pkRoom;
					if(!map[pkRoom]){
						map[pkRoom] = pkRoom;
						rooms.push(data[i].memberSigning.room);
					}
				}
			}
		});
		
		var hasPrev = 0,hasNext = 1,index = 0;
		
		var View = Backbone.View.extend({
			el : "body",
			events : {
				"tap .J-prev" : function(){
					hasPrev--;
					index--;
					hasNext++;
					this.render();
				},
				"tap .J-next" : function(){
					hasPrev++;
					index++;
					hasNext--;
					this.render();
				}
			},
			render : function(){
				var that = this;
				var $el = this.$el;
				//查询demo数据
				eling.loading(true);
				$.ajax({
					url : "api/device/measures/query",
					data : {
						last:true,
						pkActivityRoom : 1
					},
					success : function(data){
						eling.loading(false);
						$el.html(tpl(that.getDemoModel(data)));
					}
				})
			},
			_getCO2Class : function(co2){
				if(co2 < 450){
					return "success";
				}else if(co2 >= 450 && co2 < 1000){
					return "warning";
				}else{
					return "danger";
				}
			},
			_getNoiseClass : function(noise){
				if(noise <= 40){
					return "success";
				}else if (noise > 40 && noise <=70){
					return "warning";
				}else {
					return "danger";
				}
			},
			_getClassName : function(data){
				var co2 = this._getCO2Class(data[1].co2);
				var noise = this._getNoiseClass(data[1].noise);
				var status = "";
				if(co2 == "success" && noise == "success"){
					status = "success";
				}else if(co2 == "warning" || noise == "warning"){
					status = "warning";
				}else{
					status = "danger";
				}
				return {
					co2 : co2,
					noise : noise,
					status : status
				};
			},
			getDemoModel : function(data){
				var inTemperatures = (data[1].temperature+"").split(".");
				var outTemperatures = (data[0].temperature+"").split(".");
				
				var className = this._getClassName(data);
				
				return {
					"room" : rooms[index].number,
					"status" : className.status,
					"hasPrev" : hasPrev,
					"hasNext" : hasNext,
					"date" : moment().format("MM月DD日 HH:mm"),
					"out" : {
						temperature : outTemperatures[0],
						temperature_extend : outTemperatures.length == 2 ? outTemperatures[1] : 0,
						humidity : data[0].humidity,
						pressure : "1.00"
					},
					"in" : {
						temperature : inTemperatures[0],
						temperature_extend : inTemperatures.length == 2 ? inTemperatures[1] : 0,
						humidity : data[1].humidity,
						pressure : (data[1].pressure*0.0009869).toFixed(2),
						co2 : data[1].co2,
						co2Class : className.co2,
						noise : data[1].noise,
						noiseClass : className.noise
					}
				};
			}
		});
		
		var view = new View();
		view.render();
	});
});