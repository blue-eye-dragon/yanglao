import React from "react";
import Avatar from 'material-ui/lib/avatar';

var avatarStyle = {
    width: "78px",
    height: "78px",
    marginTop: "20px",
    border:"0 none",
    background: "white"
}

var avatarContainerStyle = {
    width:"33%",
    display:"inline-block",
    textAlign:"center"
};

var HealthData_MenuItem = React.createClass({
    
    render(){
        return (
            <div style={avatarContainerStyle}>
                <Avatar onTouchTap={this.props.onTouchTap} style={avatarStyle} src={this.props.img} />
                <div>{this.props.label}</div>
            </div>
        );
    }

});
export default HealthData_MenuItem;