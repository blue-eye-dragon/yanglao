import React from "react";

import Score_Star from "./Score_Star";

var Score_SecretaryItem = React.createClass({
    render(){
        return (
            <div style={{marginTop:"22px"}}>
                <img width="172" height="204" src={"api/attachment/userphoto/"+this.props.data.pkUser}/>
                <div>
                    <div style={{display:"inline-block",verticalAlign:"middle",fontSize:"22px",color:"#333333"}}>{this.props.data.name}</div>
                    <div style={{display:"inline-block",verticalAlign:"middle"}}>
                        <Score_Star _evaluateType={"Secretary"} data={this.props.data}/>
                    </div>
                </div>
            </div>
        );
    }
});

export default Score_SecretaryItem;