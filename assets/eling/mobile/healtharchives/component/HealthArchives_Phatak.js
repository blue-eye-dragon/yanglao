import React from "react";

import HealthArchives_ListItem from "./HealthArchives_ListItem";

import formatDate from "../store/formatDate";

var HealthArchives_Phatak = React.createClass({
    getDefaultProps(){
        return {
            datas: []
        }
    },
    getItems(){
        return this.props.datas.map(function(data,index,array){
            return (
                <div key={index} style={{borderBottom:"2px solid #f5f5f9"}}>
                    <HealthArchives_ListItem label={"药品"} value={data.medicine.name}/>
                    <HealthArchives_ListItem label={"时间"} value={formatDate(data.startTime)}/>
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

export default HealthArchives_Phatak;