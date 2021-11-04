import React from "react";

import HealthData_ELDateSubAppBar from "el-wechat/lib/ELDateSubAppBar";
import HealthData_ChartsTitle from "./HealthData_ChartsTitle";
import HealthData_LineCharts from "./HealthData_LineCharts";
import moment from "moment";

var BloodPressureStyle = {
    ChartsTitle:{
        display:"inline-block",
        textAlign: "center",
        width:"50%"
    }
};


var HealthData_BloodPressure = React.createClass({
    getBloodData(){
        var tData = [];

        let tmpData = this.props.datas;
        let timeArr = {};

        tmpData.forEach(function( n ){
            n.createDate = moment(n.createDate).format("YYYY-MM-DD");
            
            if( timeArr[n.createDate] ){
                (timeArr[n.createDate][0] < n.value1) ? (timeArr[n.createDate][0] = n.value1) : null;
                (timeArr[n.createDate][1] > n.value2) ? (timeArr[n.createDate][1] = n.value2) : null;
            }else{
                timeArr[n.createDate] = [ n.value1, n.value2 ];
            }
        });

        for( var key in timeArr ){
            if( !tData[0] ){
                tData[0] = [];
            }
            tData[0].push( [moment(key).format("DD"), timeArr[key][0]] );

            if( !tData[1] ){
                tData[1] = [];
            }
            tData[1].push( [moment(key).format("DD"), timeArr[key][1]] );
        }

        return tData;
    },
    render(){

        var systolicValue = 0;
        var diastolicValue = 0;

        if(this.props.datas.length > 0){
            systolicValue = this.props.datas[0].value1;
            diastolicValue = this.props.datas[0].value2;
        }

        return (<div>
            <HealthData_ELDateSubAppBar onDateChange={this.props.onDateChange}/>
            <div>
                <div style={BloodPressureStyle.ChartsTitle}>
                    <HealthData_ChartsTitle name={"收缩压"} value={systolicValue} valueColor="#f34440"  />
                </div>
                <div style={BloodPressureStyle.ChartsTitle}>
                    <HealthData_ChartsTitle name={"舒张压"} value={diastolicValue} valueColor="#00a8eb" />
                </div>
            </div>

            <HealthData_LineCharts datas={this.getBloodData()} />

        </div>);
    }


});

export default HealthData_BloodPressure;