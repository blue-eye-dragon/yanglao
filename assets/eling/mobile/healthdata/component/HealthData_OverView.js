import React from "react";

import HealthData_ELDateSubAppBar from "el-wechat/lib/ELDateSubAppBar";
import HealthData_HealthListItem from "./HealthData_HealthListItem";

var HealthData_OverView = React.createClass({
    getDefaultProps(){
        return {
            datas: []
        }
    },
    getListItems(){

        return this.props.datas.map(function(idata,index,array){

            return (
                <div key={index} style={{borderBottom:"6px solid #f5f5f9"}}>
                    <HealthData_HealthListItem ListItemdata={idata} />
                </div>
            );
        });
    },
    render(){
        return (<div>
            <HealthData_ELDateSubAppBar onDateChange={this.props.onDateChange} />
            {this.getListItems()}

        </div>);
    }


});

export default HealthData_OverView;