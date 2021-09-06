import React from "react";

var SecondaryText = React.createClass({
    render(){
        return (
            <div style={{marginTop:"20px",fontSize:"24px",color:"#f56b47",marginLeft:"30px"}}>
                {this.props.value}
            </div>
        );
    }
});

export default SecondaryText;