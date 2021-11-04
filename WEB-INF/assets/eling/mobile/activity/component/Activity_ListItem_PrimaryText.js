import React from "react";

var PrimaryText = React.createClass({
    render(){
        return (
            <div style={{height:"auto",lineHeight:"26px",color: "#333333",fontSize: "22px"}}>
                {this.props.value}
            </div>
        );
    }
});

export default PrimaryText;