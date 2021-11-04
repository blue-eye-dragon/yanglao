import React from "react";

import Score_Star from "./Score_Star";

var Score_MainService = React.createClass({
    render(){
        return (
            <div style={{height:"88px",lineHeight:"88px",borderBottom:"6px solid #f5f5f9"}}>
                <span style={{paddingLeft:"10px",fontSize:"30px",color:"gray"}}>家属沟通</span>
                <span style={{paddingLeft:"15px",marginTop:"6px",display: "inline-block",verticalAlign: "middle"}}>
                    <Score_Star _evaluateType={"FamilyCommunication"} data={this.props.data}/>
                </span>
            </div>
        );
    }
});

export default Score_MainService;