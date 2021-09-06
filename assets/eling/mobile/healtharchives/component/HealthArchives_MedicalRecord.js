import React from "react";

import HealthArchives_ListItem from "./HealthArchives_ListItem";

import formatDate from "../store/formatDate";

var HealthArchives_MedicalRecord = React.createClass({
    getDefaultProps(){
        return {
            datas: []
        }
    },
    getItems(){
        return this.props.datas.map(function(data,index,array){
            return (
                <div key={index} style={{borderBottom:"2px solid #f5f5f9"}}>
                    <HealthArchives_ListItem label={"就诊医院"} value={data.hospital ? data.hospital.name : ""}/>
                    <HealthArchives_ListItem label={"就诊时间"} value={formatDate(data.date)}/>
                    <HealthArchives_ListItem label={"就诊原因"} value={data.reason || ""}/>
                    <div style={{paddingLeft:"10px",margin:"10px"}}>{data.summary || ""}</div>
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

export default HealthArchives_MedicalRecord;