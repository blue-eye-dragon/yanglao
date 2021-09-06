import React from "react";
import ListItem from "material-ui/lib/lists/list-item";

import moment from "moment";

import Activity_ListItem_PrimaryText from "./Activity_ListItem_PrimaryText";
import Activity_ListItem_SecondaryText from "./Activity_ListItem_SecondaryText";

import KeyboardArrowRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';


const styles = {
    header: {
        height: "auto",
        borderBottom: "2px solid #f5f5f9"
    }
};

var Activity_ListItem = React.createClass({
    goDetail(){
        this.props.goDetail(this.props.data);
        return false;
    },
    render(){
        return (
            <ListItem
                onTouchTap={this.goDetail}
                rightIcon={<KeyboardArrowRight/>}
                style={styles.header}
                primaryText={<Activity_ListItem_PrimaryText value={this.props.data.signup.activity.theme}/>}
                secondaryText={<Activity_ListItem_SecondaryText value={moment(this.props.data.signup.activity.activityStartTime).format("YYYY-MM-DD")}/>}>
            </ListItem>
        );
    }
});

export default Activity_ListItem;