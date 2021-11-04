/**
*会员餐饮分析
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
	var start;
	var end ;
	var FoodAnaiysisView = ELView.extend({
		attrs : {
			model : {}
		},
		initComponent : function(params,widget) {
			$(widget.attrs["parentNode"].value).append("<div id='actRUse_echart'  style='height:500px'></div>");
			
			$(".J-piechart").append("<div id='tabStep1' style='width:100%;height:500px'>");
			$(".J-barchart").append("<div id='tabStep2' style='width:100%;height:480px;margin-top:20px;'>");
			var pieChart = echarts.init(document.getElementById('tabStep1'));
			this.set("pieChart",pieChart);
			var barChart = echarts.init(document.getElementById('tabStep2'));
			this.set("barChart",barChart);
		},
		refreshData : function(widget){
			Dialog.loading(true);
			var that = this;
			var subnav = widget.get("subnav");
			var month = subnav.getValue("timem");
			var year = subnav.getValue("timey");
			//把年份和月份拼起来
			var monthFirstDay= year + "-" +month;
			var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
			var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
			start = moment(monthFirstDay).startOf("month").valueOf();
			end = moment(monthLastDay).endOf("month").valueOf();
			
			var pieOption = {
                    tooltip : {
                    	show : false,
                    },
                    color:['#A14033','#86CB76','#7148AA','#FF7F50','#87CEFA','#E94E4C'],
                    toolbox: {
                        show : false,
                    },
                    calculable : false,
                    series : [{
						itemStyle:{ 
                            normal:{ 
                                label:{ 
                                   formatter: '{b}:\n{c}人({d}%)' 
                                }, 
                            } 
                        } ,
						name : '会员餐饮分析',
						type : 'pie',
						radius : '40%',
						center : [ '50%', '45%' ],
                    }]
                };
			var barOption = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show : false,
                    },
                    calculable : false,
                    grid: {
        		        borderWidth: 0,
        		        y: 80,
        		        y2: 60
        		    },
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
                        },
                    	data : ['1到5天','6到10天','11到15天','16到20天','21到25天','26天以上']
                    }],
                    series : [{
						name : '人次',
						type : 'bar',
						barWidth: 50, 
						itemStyle: {
			                normal: {
			                    color: function(params) {
			                        var colorList = ['#A14033','#86CB76','#7148AA','#FF7F50','#87CEFA','#E94E4C'];
			                        return colorList[params.dataIndex]
			                    },
			                    label: {
			                        show: true,
			                        position: 'top',
			                    }
			                }
			            },
                    }]
                };
			var mealpieOption = {
					title : {
                        x:40,
                        y:40,
                        fontSize:24,
                        color : '#333333',
                    },
                    tooltip : {
                    	show : false,
                    },
                    color:['#A14033','#86CB76','#7148AA','#FF7F50','#87CEFA','#E94E4C'],
                    legend: {
                    	 orient : 'vertical',
                    	 x : 20,
                    	 y : 'center',
                    	 itemGap:20
                    },
                    toolbox: {
                        show : false,
                    },
                    calculable : false,
                    series : [{
						itemStyle:{ 
                            normal:{ 
                                label:{ 
                                   show: false, 
                                }, 
                                labelLine :{show:false}
                            } 
                        } ,
						name : '会员餐饮分析',
						type : 'pie',
						radius : '50%',
						center : [ '75%', '50%' ],
                    }]
                };
			aw.ajax({
				url:"api/foodAnalysis/query",
				data:{
					"start" : start,
					"end" : end
				},
				dataType:"json",
				success:function(data){
					Dialog.loading(false);
					var barChart = that.get("barChart");
					var pieChart = that.get("pieChart");
					if(data){
						var yData = [data.oneToFiveDays,
						             data.sixToTenDays,
						             data.elevenToFifteenDays,
						             data.sixteenToTwentyDays,
						             data.twentyOneToTwentyFiveDays,
						             data.greaterThanTwentySixDays];
						barOption.series[0].data = yData;
						var number = data.memberCount;
						var money = data.purchaseCount;
						var title = year + "年"+month+'月会员餐饮分析'+' '+number+'人就餐,   共：'+money.toFixed(2)+'元';
						$(".J-title").text(title);
						pieChart = echarts.init(document.getElementById('tabStep1'));
						barChart = echarts.init(document.getElementById('tabStep2'));
						barChart.clear();
						barChart.setOption(barOption,true);
						var pieData = [{
							value:data.oneToFiveDays,
							name:'1到5天',
							itemStyle: {
			                    normal: {
				                    	label: { show: function () {
				                            if (data.oneToFiveDays == 0.00)
				                            { return false; }
				                         }()
			                        },
			                        labelLine: { show: function () {
			                            if (data.oneToFiveDays == 0.00)
			                            { return false; }
			                            }()
			                        }
			                    }
							}
						},{
							value:data.sixToTenDays,
							name:'6到10天',
							itemStyle: {
			                    normal: {
				                    	label: { show: function () {
				                            if (data.sixToTenDays == 0.00)
				                            { return false; }
				                         }()
			                        },
			                        labelLine: { show: function () {
			                            if (data.sixToTenDays == 0.00)
			                            { return false; }
			                            }()
			                        }
			                    }
							}
						},{
							value:data.elevenToFifteenDays,
							name:'11到15天',
							itemStyle: {
			                    normal: {
				                    	label: { show: function () {
				                            if (data.elevenToFifteenDays == 0.00)
				                            { return false; }
				                         }()
			                        },
			                        labelLine: { show: function () {
			                            if (data.elevenToFifteenDays == 0.00)
			                            { return false; }
			                            }()
			                        }
			                    }
							}
						},{
							value:data.sixteenToTwentyDays,
							name:'16到20天',
							itemStyle: {
			                    normal: {
				                    	label: { show: function () {
				                            if (data.sixteenToTwentyDays == 0.00)
				                            { return false; }
				                         }()
			                        },
			                        labelLine: { show: function () {
			                            if (data.sixteenToTwentyDays == 0.00)
			                            { return false; }
			                            }()
			                        }
			                    }
							}
						},{
							value:data.twentyOneToTwentyFiveDays,
							name:'21到25天',
							itemStyle: {
			                    normal: {
				                    	label: { show: function () {
				                            if (data.twentyOneToTwentyFiveDays == 0.00)
				                            { return false; }
				                         }()
			                        },
			                        labelLine: { show: function () {
			                            if (data.twentyOneToTwentyFiveDays == 0.00)
			                            { return false; }
			                            }()
			                        }
			                    }
							}
						},{
							value:data.greaterThanTwentySixDays,
							name:'26天以上',
							itemStyle: {
			                    normal: {
				                    	label: { show: function () {
				                            if (data.greaterThanTwentySixDays == 0.00)
				                            { return false; }
				                         }()
			                        },
			                        labelLine: { show: function () {
			                            if (data.greaterThanTwentySixDays == 0.00)
			                            { return false; }
			                            }()
			                        }
			                    }
							}
						}];
						pieChart.clear();
						pieOption.series[0].data = pieData;
						pieChart.setOption(pieOption,true);
						barChart.on('click', function(param){
							widget.openView({
								url:"eling/elcms/chargecard/chargecard",
								params:{
									name : param.name,
									start : start,
									end : end ,
								},
								isAllowBack:true
							});
						});
					}
				}
			});
			aw.ajax({
				url:"api/foodAnalysis/queryMealItem",
				data:{
					"start" : start,
					"end" : end
				},
				dataType:"json",
				success:function(data){
					for(var i=0;i<data.length;i++){
						if(data[i].purchaseType == 0){
							var sum = data[i].oneSeveral + data[i].twoSeveral+data[i].threeSeveral+data[i].fourSeveral+data[i].fiveSeveral+data[i].sixSeveral;
							var lege = ['≤1元             \n'+data[i].oneSeveral+'人次 ('+(data[i].oneSeveral*100/sum).toFixed(2)+'%)',
							            '≥1元 ≤2元    \n'+data[i].twoSeveral+'人次 ('+(data[i].twoSeveral*100/sum).toFixed(2)+'%)',
							            '≥2元 ≤3元    \n'+data[i].threeSeveral+'人次 ('+(data[i].threeSeveral*100/sum).toFixed(2)+'%)',
							            '≥3元 ≤4元    \n'+data[i].fourSeveral+'人次 ('+(data[i].fourSeveral*100/sum).toFixed(2)+'%)',
							            '≥4元 ≤5元    \n'+data[i].fiveSeveral+'人次 ('+(data[i].fiveSeveral*100/sum).toFixed(2)+'%)',
							            '5元以上        \n'+data[i].sixSeveral+'人次 ('+(data[i].sixSeveral*100/sum).toFixed(2)+'%)'];
							var pieData = [{
								value:data[i].oneSeveral,
								name:'≤1元             \n'+data[i].oneSeveral+'人次 ('+(data[i].oneSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].twoSeveral,
								name:'≥1元 ≤2元    \n'+data[i].twoSeveral+'人次 ('+(data[i].twoSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].threeSeveral,
								name:'≥2元 ≤3元    \n'+data[i].threeSeveral+'人次 ('+(data[i].threeSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].fourSeveral,
								name:'≥3元 ≤4元    \n'+data[i].fourSeveral+'人次 ('+(data[i].fourSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].fiveSeveral,
								name:'≥4元 ≤5元    \n'+data[i].fiveSeveral+'人次 ('+(data[i].fiveSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].sixSeveral,
								name:'5元以上        \n'+data[i].sixSeveral+'人次 ('+(data[i].sixSeveral*100/sum).toFixed(2)+'%)',
							}];
							var mealpiechart = echarts.init(document.getElementById('breakfast'));
							mealpieOption.title.text = "早餐";
							mealpieOption.legend.data = lege;
							mealpieOption.series[0].data =pieData;
							mealpiechart.setOption(mealpieOption,true);
						}else{
							var sum = data[i].oneSeveral + data[i].twoSeveral+data[i].threeSeveral+data[i].fourSeveral+data[i].fiveSeveral+data[i].sixSeveral;
							var lege = ['≤5元                  \n'+data[i].oneSeveral+'人次 ('+(data[i].oneSeveral*100/sum).toFixed(2)+'%)',
							            '≥5元 ≤10元      \n'+data[i].twoSeveral+'人次 ('+(data[i].twoSeveral*100/sum).toFixed(2)+'%)',
							            '≥10元 ≤15元    \n'+data[i].threeSeveral+'人次 ('+(data[i].threeSeveral*100/sum).toFixed(2)+'%)',
							            '≥15元 ≤20元    \n'+data[i].fourSeveral+'人次 ('+(data[i].fourSeveral*100/sum).toFixed(2)+'%)',
							            '≥20元 ≤25元    \n'+data[i].fiveSeveral+'人次 ('+(data[i].fiveSeveral*100/sum).toFixed(2)+'%)',
							            '25元以上           \n'+data[i].sixSeveral+'人次 ('+(data[i].sixSeveral*100/sum).toFixed(2)+'%)'];
							var pieData = [{
								value:data[i].oneSeveral,
								name:'≤5元                  \n'+data[i].oneSeveral+'人次 ('+(data[i].oneSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].twoSeveral,
								name:'≥5元 ≤10元      \n'+data[i].twoSeveral+'人次 ('+(data[i].twoSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].threeSeveral,
								name:'≥10元 ≤15元    \n'+data[i].threeSeveral+'人次 ('+(data[i].threeSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].fourSeveral,
								name:'≥15元 ≤20元    \n'+data[i].fourSeveral+'人次 ('+(data[i].fourSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].fiveSeveral,
								name:'≥20元 ≤25元    \n'+data[i].fiveSeveral+'人次 ('+(data[i].fiveSeveral*100/sum).toFixed(2)+'%)',
							},{
								value:data[i].sixSeveral,
								name:'25元以上           \n'+data[i].sixSeveral+'人次 ('+(data[i].sixSeveral*100/sum).toFixed(2)+'%)',
							}];
							var mealpiechart;
							if(data[i].purchaseType == 1){
								mealpiechart = echarts.init(document.getElementById('lunch'));
								mealpieOption.title.text = "午餐";
							}else if(data[i].purchaseType == 2){
								mealpiechart = echarts.init(document.getElementById('dinner'));
								mealpieOption.title.text = "晚餐";
							}
							mealpieOption.legend.data = lege;
							mealpieOption.series[0].data =pieData;
							mealpiechart.setOption(mealpieOption,true);
						}
					}
				}
			});
		}
	});
	module.exports = FoodAnaiysisView;
});
