import React from "react";

import ListItem from "material-ui/lib/lists/list-item";
import FlatButton from 'material-ui/lib/flat-button';
import Icon from 'material-ui/lib/svg-icons/places/free-breakfast';

import Bill_PrimaryText from "./Bill_PrimaryText";
import Bill_SecondaryText from "./Bill_SecondaryText";

var Bill_ListItem = React.createClass({
    goDetail(){
        this.props.goDetail(this.props.data);
        return false;
    },
    render(){
        var data = this.props.data;

        var Icon = data.icon;

        var leftAvatarStyle= {
            background: data.iconColor,
            marginTop: "10px",
            fill: "white",
            width: "44px",
            height: "44px",
            margin: "0",
            top: "0",
            left: "15px",
            padding: "12px"
        };

        var rightIconButtonStyle = {
            marginTop: "15px",
            marginRight: "10px",
            background: "white",
            borderRadius: "20px",
            color: data.statusColor,
            border: "1px solid " + data.statusColor
        };

        return (
            <ListItem
                onTouchTap={this.goDetail}
                primaryText={<Bill_PrimaryText value={data.primaryText}/>}
                secondaryText={<Bill_SecondaryText value={data.secondaryText}/>}
                leftIcon={<Icon style={leftAvatarStyle}/>}
                rightIconButton={
                    <FlatButton
                        label={data.status}
                        disabled={true}
                        style={rightIconButtonStyle}
                    />
                }
            />
        );
    }
});

export default Bill_ListItem;