import React from "react";

var subHeader_left = {
    display: "inline-block",
    width: "49%",
    textAlign: "center",
    verticalAlign: "middle",
    height: "60px",
    margin: "18px 0"
}

var Bill_DetailItem = React.createClass({
    render(){
        return (
            <div style={subHeader_left}>

                <div style={{fontSize:"20px",color:"#333333"}}>
                    <label>{this.props.label}</label>
                </div>

                <div style={{fontSize:"24px",color:"#f56b47",marginTop:"10px"}}>
                    <span>{this.props.value}</span>
                </div>
                
            </div>
        );
    }
});

export default Bill_DetailItem;