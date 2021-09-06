import React from "react";

import Radio from "material-ui/lib/svg-icons/av/radio"

import formatMoney from "../store/formatMoney"

var custStyles={
    root: {
        height:"64px",
        textAlign:"center",
        position:"relative",
        lineHeight:"64px",
        borderBottom:"6px solid #f5f5f9"
    },
    icon: {
        fill:"white",
        width:"25px",
        height:"25px",
        margin:"0",
        padding:"12px",
        background:"#f56b47",
        position:"absolute",
        left:"20px",
        top:"7px"
    },
    remainText: {
        color:"#333333",fontSize:"20px",
        display: "inline-block",
        verticalAlign: "bottom"
    },
    remainValue: {
        color:"#f56b47",
        fontSize:"30px",
        display: "inline-block",
        verticalAlign: "bottom",
        paddingLeft:"20px"
    }
}

var CardBillRecord_Remaining = React.createClass({
    render(){
        return (
            <div style={custStyles.root}>
                <Radio style={custStyles.icon}/>
                <span style={custStyles.remainText}>余额</span>
                <span style={custStyles.remainValue}>{formatMoney(this.props.value)}</span>
            </div>
        );
    }
});

export default CardBillRecord_Remaining;