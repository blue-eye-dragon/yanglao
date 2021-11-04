import React from "react";

import MemberDailyRecord_ELDateSubAppBar from "el-wechat/lib/ELDateSubAppBar";

import formatDate from "../store/formatDate";

var HealthArchives_MemberDailyRecord = React.createClass({
    getDefaultProps(){
        return {
            datas: []
        }
    },

    getItems(){
        return this.props.datas.map(function(data,index,array){
            return (
                <div key={index} style={{borderBottom:"2px solid #f5f5f9",paddingLeft:"20px",paddingRight:"20px"}}>
                    <div style={{color:"#f56747",marginTop:"10px"}}>{formatDate(data.date,"MM-DD")}</div>
                    <div style={{fontSize: "18px",marginTop:"10px",marginBottom:"10px",color: "#737373"}}>{data.record}</div>
                </div>
            );
        });
    },

    render(){
        return (
            <div>
                <MemberDailyRecord_ELDateSubAppBar onDateChange={this.props.onDateChange}/>
                {this.getItems()}
            </div>
        );
    }
});

export default HealthArchives_MemberDailyRecord;