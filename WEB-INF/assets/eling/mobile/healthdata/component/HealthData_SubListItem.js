import React from "react";

var SubItemStyle = {
    listItem:{
        marginTop:"10px",
        marginBottom:"10px",
        marginLeft:"20px"
    },
    label:{
        color:"#737373",
        width:"140px",
        display:"inline-block"
    },
    value:{
        color:"#333333",
        display:"inline-block"
    }
};


var HealthData_SubListItem = React.createClass({
    getDefaultProps(){
        return {
            label:"",
            value:""
        }
    },
    render(){
        return (
            <div style={SubItemStyle.listItem}>
                <div style={SubItemStyle.label}><span>{this.props.label}：</span></div>
                <div style={SubItemStyle.value}><span>{this.props.value}</span></div>
            </div>
        );
    }
});

export default HealthData_SubListItem;