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
	var Tab = require("tab");
	require("echarts");
	var UseTimeView = ELView.extend({
		attrs : {
			model : {}
		},
		initComponent : function(params,widget) {
			$(widget.attrs["parentNode"].value).append("<div id='actRUse_echart'  style='height:710px'></div>");

			$(".J-piechart").append("<div id='tabStep1' style='width:90%;height:710px'>");
			$(".J-barchart").append("<div id='tabStep2' style='width:100%;height:680px;margin-top:30px;'>");
				
			var pieChart = echarts.init(document.getElementById('tabStep1'));
			this.set("pieChart",pieChart);
			
			var barChart = echarts.init(document.getElementById('tabStep2'));
			this.set("barChart",barChart);
            
		},
		refreshData : function(widget){
			var that = this;
			var subnav = widget.get("subnav");
			var month = subnav.getValue("timem");
			var year = subnav.getValue("timey");
			
			var start = moment(year+"-"+month).startOf('month');
			var end = moment(year+'-'+month).endOf('month');
			
			var pieOption = {
                    title : {
                        text: year+'年'+month+'月最受欢迎活动室分析(人数)',
                        x:'center',
                        y:40,
                        fontSize:24,
                        color : '#333333',
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}  {c}人 ({d}%)"
                    },
                    legend: {
                        //orient : 'vertical',
                        x : 30,
                        y : 'bottom',
                        itemGap : 22,
                    },
                    toolbox: {
                        show : false,
                    },
                    calculable : false,
                    series : [{
						itemStyle:{ 
                            normal:{ 
                                label:{ 
                                   show: true, 
                                   formatter: '{b}{c}人({d}%)' 
                                }, 
                                labelLine :{show:true}
                            } 
                        } ,
						name : '活动室使用情况',
						type : 'pie',
						radius : '35%',
						center : [ '48%', '45%' ],
                    }]
                };
			var barOption = {
                    title : {
                        text: year+'年'+month+'月活动室使用情况',
                    	x:'center',
                        fontSize:24,
                        color : '#333333',
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['人次','人数'],
                        x:20,
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
						name : '人次',
						type : 'bar',
						itemStyle: {
			                normal: {
			                    label: {
			                        show: true,
			                        position: 'top',
			                    }
			                }
			            },
                    },{
						name : '人数',
						type : 'bar',
						itemStyle: {
			                normal: {
			                    label: {
			                        show: true,
			                        position: 'top',
			                    }
			                }
			            },
                    }]
                };
			
			var xData = [];
			var yData = [];
			var yyData = [];
			var lege = [];
			var pieData = [];
			
			aw.ajax({
				url :"api/activityroom/queryUseTime",
				data : {
					"inTime":start.valueOf(),
					"inTimeEnd":end.valueOf(),
					fetchProperties:"actRoom.name,actRoom.room.number,time,person"
				},
				success : function(data){
					
					var barChart = that.get("barChart");
					var pieChart = that.get("pieChart");
					if(data.length > 0){
						for(var i in data){
							if(data[i].time != 0){
								var actr = data[i].actRoom.room.number+" "+data[i].actRoom.name;
								lege.push(actr);
								xData.push(data[i].actRoom.name);
								yData.push(data[i].time);
								pieData.push({
									value:data[i].person,
									name:actr,
								})
							}
							if(data[i].person != 0){
								yyData.push(data[i].person);
							}
						}
						var max = 0;
						for (var j = 0; j < data.length-1; j++) {
						    if(data[j].time > max){
						     max = data[j].time;
						    }
						}
						
						pieChart = echarts.init(document.getElementById('tabStep1'));
						barChart = echarts.init(document.getElementById('tabStep2'));
						
						pieChart.clear();
						//给图重新赋值
						pieOption.legend.data = lege;
						pieOption.series[0].data = pieData;
						
						pieChart.setOption(pieOption,true);
						
						barOption.xAxis[0].data = xData;
						barOption.yAxis[0].max = max;
						barOption.series[0].data = yData;
						barOption.series[1].data = yyData;
						
						barChart.clear();
						barChart.setOption(barOption,true);
						
					}else{
						barChart.clear();
						pieChart.clear();
						pieOption.series[0].data = ['0'];
						pieOption.legend.data = ['0'];
						pieOption.dataZoom.show = false;
						
						barOption.series[0].data = ['0'];
						barOption.xAxis[0].data = ['0'];
						barOption.dataZoom.show = false;
						barChart.setOption(barOption,true);
						pieChart.setOption(pieOption,true);
					}
				}
			});
		}
	});
	module.exports = UseTimeView;
});
