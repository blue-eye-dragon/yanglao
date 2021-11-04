import React from "react";

var PrimaryText = React.createClass({
    render(){
        return (
            <div style={{marginLeft:"30px",fontSize:"24px",color:"#333333"}}>
                {this.props.value}
            </div>
        );
    }
});

export default PrimaryText;