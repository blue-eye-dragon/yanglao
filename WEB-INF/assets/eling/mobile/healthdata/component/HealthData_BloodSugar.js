import React from "react";

import HealthData_ELDateSubAppBar from "el-wechat/lib/ELDateSubAppBar";
import HealthData_ChartsTitle from "./HealthData_ChartsTitle";
import HealthData_LineCharts from "./HealthData_LineCharts";

import healthDataManage from "../store/HealthDataManage";

var BloodPressureStyle = {
    ChartsTitle: {
        display: "inline-block",
        textAlign: "center",
        width: "100%"
    }
};


var HealthData_BloodSugar = React.createClass({

    getBloodData(){
        let tData = this.props.datas;
        return healthDataManage.getMostTimeData(tData);
    },
    render(){

        var sugarValue = 0;

        if (this.props.datas.length > 0) {
            sugarValue = this.props.datas[0].value1;
        }

        return (
            <div>
                <HealthData_ELDateSubAppBar onDateChange={this.props.onDateChange}/>
                <div>
                    <div style={BloodPressureStyle.ChartsTitle}>
                        <HealthData_ChartsTitle name={"血糖值(mmol/L)"} value={sugarValue} valueColor="#f34440"/>
                    </div>
                </div>

                <HealthData_LineCharts datas={this.getBloodData()}/>

            </div>
        );
    }


});

export default HealthData_BloodSugar;