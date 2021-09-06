import React from "react";

import HealthArchives_ListItem from "./HealthArchives_ListItem";

import formatDate from "../store/formatDate";

var HealthArchives_Aller = React.createClass({
    getDefaultProps(){
        return {
            datas: []
        }
    },
    getItems(){
        return this.props.datas.map(function(data,index,array){
            return (
                <div key={index} style={{borderBottom:"2px solid #f5f5f9"}}>
                    <HealthArchives_ListItem label={"过敏原名称"} value={data.name}/>
                    <HealthArchives_ListItem label={"发现时间"} value={formatDate(data.date,"YYYY-MM-DD")}/>
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

export default HealthArchives_Aller;