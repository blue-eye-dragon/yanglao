import React from "react";

import HealthArchives_ListItem from "./HealthArchives_ListItem";

var HealthArchives_DiseaseHistory = React.createClass({

    getDefaultProps(){
        return {
            datas: []
        }
    },

    getItems(){
        return this.props.datas.map(function(data,index,array){
            return (
                <div key={index} style={{borderBottom:"2px solid #f5f5f9"}}>
                    <HealthArchives_ListItem label={"名称"} value={data.diseaseDetail.name}/>
                    <HealthArchives_ListItem label={"状态"} value={data.diseaseStatus.value}/>
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

export default HealthArchives_DiseaseHistory;