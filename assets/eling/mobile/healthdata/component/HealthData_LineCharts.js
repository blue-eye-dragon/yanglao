import React from "react";

import ECharts from 'el-wechat/lib/ECharts';

var HealthData_LineCharts = React.createClass({
    getDefaultProps(){
        return {
            width: document.documentElement.clientWidth,
            datas: [],
            option: {}
        }
    },
    getOptions(){

        var options = {
            xAxis: {
                type:"value",
                splitLine: {show: false},
                axisLine: {show:false},
                axisTick :{show:false},
                axisLabel:{show:false},
                min: 1
            },
            grid: {
                top:10
            },
            yAxis: {},
            series: [{
                name: '收缩压',
                type: 'line',
                lineStyle:{
                    normal:{
                        color:"#f34440"
                    }
                },
                data: []
            },{
                name: '舒张压',
                type: 'line',
                lineStyle:{
                    normal:{
                        color:"#00a8eb"
                    }
                },
                data: []
            }]
        };

        if( this.props.datas.length ){
            this.props.datas.forEach(function(iData,index){
                options.series[index].data = iData;
            });
        }

        return options;
    },
    render(){

        return (<ECharts option={this.getOptions()} />);
    }


});

export default HealthData_LineCharts;