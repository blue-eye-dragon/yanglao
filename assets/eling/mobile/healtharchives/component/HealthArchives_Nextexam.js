import React from "react";

import HealthArchives_ListItem from "./HealthArchives_ListItem";

import formatDate from "../store/formatDate";

var HealthArchives_Nextexam = React.createClass({
    getDefaultProps(){
        return {
            datas: []
        }
    },
    getItems(){
        return this.props.datas.map(function(data,index,array){
            return (
                <div key={index} style={{borderBottom:"2px solid #f5f5f9"}}>
                    <HealthArchives_ListItem label={"疾病"} value={data.diseaseDetail.name}/>
                    <HealthArchives_ListItem label={"医生"} value={data.doctor || ""}/>
                    <HealthArchives_ListItem label={"医院"} value={data.hospital ? data.hospital.name: ""}/>
                    <HealthArchives_ListItem label={"时间"} value={formatDate(data.date)}/>
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

export default HealthArchives_Nextexam;