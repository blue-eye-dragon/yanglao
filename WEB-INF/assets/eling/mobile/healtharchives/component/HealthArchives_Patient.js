import React from "react";

import HealthArchives_ListItem from "./HealthArchives_ListItem";
import formatDate from "../store/formatDate";

var HealthArchives_Patient = React.createClass({
    getDefaultProps(){
        return {
            datas: []
        }
    },
    getItems(){
        return this.props.datas.map(function(data,index,array){
            return (
                <div key={index} style={{borderBottom:"2px solid #f5f5f9"}}>
                    <HealthArchives_ListItem label={"医院名称"} value={data.hospital ? data.hospital.name : ""}/>
                    <HealthArchives_ListItem label={"科室名称"} value={data.departmentsSickbed ? data.departmentsSickbed : ""}/>
                    <HealthArchives_ListItem label={"住院状态"} value={data.status ? data.status.value : ""}/>
                    <HealthArchives_ListItem label={"入院时间"} value={formatDate(data.checkInDate)}/>
                    <HealthArchives_ListItem label={"入院原因"} value={data.disease ? data.disease : ""}/>
                    <HealthArchives_ListItem label={"治疗经过"} value={data.afterTreatment ? data.afterTreatment : ""}/>
                    <HealthArchives_ListItem label={"出院时间"} value={formatDate(data.checkOutDate)}/>
                    <HealthArchives_ListItem label={"出院诊断"} value={data.dischargeDiagnosis ? data.dischargeDiagnosis : ""}/>
                    <HealthArchives_ListItem label={"医生建议"} value={data.doctorAdvised ? data.doctorAdvised : ""}/>
                </div>
            );
        });
    },
    render(){
        return (
            <div>
                {this.getItems()}
            </div>
        );
    }
});

export default HealthArchives_Patient;