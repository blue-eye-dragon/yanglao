import React from "react";

var SecondaryText = React.createClass({
    render(){
        return (
            <div style={{marginTop:"5px",fontSize:"18px",color:"#f56b47"}}>
                {this.props.value}
            </div>
        );
    }
});

export default SecondaryText;