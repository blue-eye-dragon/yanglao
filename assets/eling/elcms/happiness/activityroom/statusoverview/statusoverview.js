define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Statusoverview = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"活动室状态总览",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return{
				url:"api/device/measures/queryActivityRoom",
				params:{
					fetchProperties:"*,activityRoom.name"
				},
				model:{
					columns:[{
						key:"activityRoom.name",
						name:"名称"
					},{
						key:"temperature",
						name:"温度(°C) "
					},{
						key:"humidity",
						name:"湿度(%)"
					},{
						key:"pressure",
						name:"气压(标准大气压)",
						format:function(value,row){
							return (value*0.0009869).toFixed(2);
						}
					},{
						key:"co2",
						name:"二氧化碳(ppm)"
					},{
						key:"noise",
						name:"噪音(分贝)"
					}]
				}
			};
		}
	});
	module.exports = Statusoverview;
});