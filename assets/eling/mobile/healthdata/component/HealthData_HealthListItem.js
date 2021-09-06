import React from "react";

import moment from "moment";

import HealthData_SubListItem from "./HealthData_SubListItem";

var Styles = {
    ListItemStyle:{

    },
    DataTitle:{
        color: "#f56b47",
        margin:"10px 20px"
    }
};

var healthDataType = ["血压","血糖(空腹)","血氧","体脂","心率","体温"];

var healthDataTypeLabel = ["血压","血糖值(mmol/L)","血氧(%)","体脂(%)","心率(次/分)","体温(℃)"];

var HealthData_HealthListItem = React.createClass({

    getItems(){

        var healthDataTypeValue = [];

        this.props.ListItemdata.datas.map(function(idata,index,array){
            var length = healthDataType.length;
            for(var i = 0; i<length;i++) {
                if (healthDataType[i] == idata.type.name && i == 0) {
                    healthDataTypeValue[i] = idata.description;
                } else if (healthDataType[i] == idata.type.name) {
                    healthDataTypeValue[i] = idata.value1;
                }
            }
        });

        return healthDataTypeLabel.map(function(n,index,array){
            return (
                <div key={index} >
                    <HealthData_SubListItem label={n} value={ healthDataTypeValue[index]?healthDataTypeValue[index]:"" } />
                </div>
            );
        });
        
    },
    render(){
        return (<div style={Styles.ListItemStyle}>
            <div className={"item-sub-title"} style={Styles.DataTitle}>{moment(this.props.ListItemdata.createDate).format("MM-DD")}</div>
            {this.getItems()}
        </div>);
    }


});

export default HealthData_HealthListItem;