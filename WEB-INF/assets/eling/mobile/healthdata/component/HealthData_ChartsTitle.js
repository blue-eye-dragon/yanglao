import React from "react";

var styles = {
    TitleStyle:{
        display: "inline-block",
        textAlign: "center",
        margin:"20px 30px"
    },
    ValueStyle:{
        color:"#00a8eb",
        fontSize:"40px"
    },
    NameStyle:{
        color:"#373737",
        fontSize:"25px"
    }
};

var HealthData_ChartsTitile = React.createClass({
    getDefaultProps(){
        return {
            datas: [],
            valueColor:"#00a8eb"
        }
    },
    render(){
        styles.ValueStyle.color = this.props.valueColor;

        return (<div style={styles.TitleStyle}>
            <div style={styles.ValueStyle}>{this.props.value}</div>
            <div style={styles.NameStyle}>{this.props.name}</div>
        </div>);
    }


});

export default HealthData_ChartsTitile;