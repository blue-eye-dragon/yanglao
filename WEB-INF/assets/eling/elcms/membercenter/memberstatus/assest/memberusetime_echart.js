/**
*活动室使用情况
*/
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var Grid = require("grid");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	var enmu = require("enums");
	require("echarts");
	var UseTimeView = ELView.extend({
		attrs : {
			model : {}
		},
		initComponent : function(params,widget) {
			$(widget.attrs["parentNode"].value).append("<div id='actRUse_echart'  style='height:400px'></div>");

			var barChart = echarts.init(document.getElementById('actRUse_echart'));
			this.set("barChart",barChart);
            
		},
		refreshData : function(widget,pkMember){
			var that = this;
			var subnav = widget.get("subnav");
			var month = subnav.getValue("timem");
			var year = subnav.getValue("timey");
			
			var start = moment(year+"-"+month).startOf('month');
			var end = moment(year+'-'+month).endOf('month');
			
			
			
			var barOption = {
                    title : {
                        text: year+'年'+month+'月活动室使用频次',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show : false,
                    },
                    dataZoom : {
                        show : true,
                        realtime : true,
                        fillerColor : '#b2b2b2',
                        handleColor : '#b2b2b2',
                        end : '40',
                        zoomLock:true,
                        height: 18,
                    },
                    calculable : false,
                    yAxis : [{
                        type : 'value',
                        splitLine: {  
                        	show: false,
                        }
                    }],
                    xAxis : [{
                    	type : 'category',
                    	splitLine: {  
                        	show: false,
                        }
                    }],
                    series : [{
						name : '次数',
						type : 'bar',
						itemStyle: {
			                normal: {
			                    color: function(params) {
			                    	var colorList = [
			            			                 '#00FF00','#00CDCD','#00BFFF','#008B45','#0000AA',
			            			                 '#6959CD','#7A378B','#76EEC6','#7A67EE','#8B0A50',
			            			                 '#EE9A49','#EE9A00','#EEAD0E','#EEC900','#EEEE00',
			            			                 '#AEEEEE','#9AFF9A','#9ACD32','#98FB98','#9BCD9B',
			            			                 '#CD3333','#CD3278','#CD2990','#CD5C5C',
			            			               ];
			                    	return colorList[params.dataIndex];
			                    },
			                    label: {
			                        show: true,
			                        position: 'top',
			                        formatter: '{b}\n{c}'
			                    }
			                }
			            },
                    }]
                };
			
			var xData = [];
			var yData = [];
			
			aw.ajax({
				url :"api/activityroom/queryUseTime",
				data : {
					"member":pkMember!=""?pkMember:"",
					"inTime":start.valueOf(),
					"inTimeEnd":end.valueOf(),
					fetchProperties:"actRoom.name,time,person"
				},
				success : function(data){
					var barChart = that.get("barChart");
					if(data.length > 0){
						for(var i in data){
							xData.push(data[i].actRoom.name);
							yData.push(data[i].time);
						}
						var max = 0;
						for (var j = 0; j < data.length-1; j++) {
						    if(data[j].time > max){
						     max = data[j].time;
						    }
						}
						//给图重新赋值
						barOption.xAxis[0].data = xData;
						barOption.series[0].data = yData;
						barOption.yAxis[0].max = max;
						barChart.clear();
						barChart.setOption(barOption,true);
					}else{
						barChart.clear();
						barOption.series[0].data = ['0'];
						barOption.xAxis[0].data = ['0'];
						barOption.dataZoom.show = false;
						barChart.setOption(barOption,true);
					}
				}
			});
		}
	});
	module.exports = UseTimeView;
});
