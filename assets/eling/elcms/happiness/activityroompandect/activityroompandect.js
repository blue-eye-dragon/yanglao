define(function(require,exports,module){
	var ELView = require("elview");
	var template = require("./activityroompandect.tpl");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var aw = require("ajaxwrapper");
	
	require("./activityroompandect.css");
	
	var ActivityroomPandect = ELView.extend({
		attrs : {
			template : template,
			model : {
				activities : []
			}
		},
		_getCO2Class : function(co2){
			if(co2 < 450){
				return "success";
			}else if(co2 >= 450 && co2 < 1000){
				return "common";
			}else{
				return "danger";
			}
		},
		_getWetClass : function(humidity){
			if(humidity < 35 || humidity > 65){
				return "danger";
			}else if(humidity >= 35 && humidity < 45){
				return "common";
			}else{
				return "success";
			}
		},
		_getTemperatureClass : function(temperature){
			if(temperature >= 18 || temperature <= 24){
				return "success";
			}else if(temperature < 18 || temperature > 24){
				return "common";
			}
		},
		_getClassName : function(index){
			if($(".J-activity-item").eq(index).hasClass("danger")){
				return "danger";
			}else if($(".J-activity-item").eq(index).hasClass("warning")){
				return "common";
			}else{
				return "success";
			}
		},
		initComponent : function(params,widget){
			var subnav = new Subnav({
				parentNode : ".J-subnav",
				model : {
					title : "活动室总览"
				}
			});
			this.set("subnav",subnav);
		},
		afterInitComponent : function(params,widget){
			this.refresh();
			
			var timer = window.setInterval(function(){
				widget.refresh.call(widget);
			},10*60*1000);
			
			this.set("timer",timer);
		},
		refresh : function(){
			var that = this;
			aw.ajax({
				url:"api/device/measures/queryActivityRoom",
				data:{
					fetchProperties:"co2,humidity,pressure,temperature,activityRoom.pkActivityRoom,activityRoom.name,activityRoom.circs,noise"
				},
				success:function(data){
					aw.ajax({
						url:"api/location/queryareamembernumber",
						dataType:"json",
						success:function(numberdata){
							for(var i=0;i<data.length;i++){
								data[i].co2ClassName = that._getCO2Class(data[i].co2);
								data[i].humidityClassName = that._getWetClass(data[i].humidity);
								data[i].temperatureClassName = that._getTemperatureClass(data[i].temperature);
								data[i].pressure = (data[i].pressure*0.0009869).toFixed(2);
																	
								for(var number in numberdata){
									if(data[i].activityRoom.pkActivityRoom == numberdata[number][0]){
										data[i].memberNumber = numberdata[number][1]+"人";
									}
								}
							}
							that.get("model").activities = data;
							that.renderPartial(".J-activityroom-pandect");
						}
					})
				}
			});
		},
		destroy : function(){
			window.clearInterval(this.get("timer"));
			ActivityroomPandect.superclass.destroy.call(this,arguments);
		}
	});
	
	module.exports = ActivityroomPandect;
});