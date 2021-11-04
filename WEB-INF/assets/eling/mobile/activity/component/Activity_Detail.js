import React from "react";
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import moment from "moment";

import Styles from "el-wechat/lib/Styles";

import getInterestGroups from "../store/getInterestGroups";
import getMembers from "../store/getMembers";

import i18n from "el-wechat/lib/i18n";

var styles = Styles;

styles.root = {backgroundColor: "red"};
styles.cardText = {padding: "10px 16px",border:"1px solid #eeeeee"};
styles.itemContainer = {marginTop:"10px"};
styles.label = {fontSize: "16px",color: "#b2b2b2",display: "inline-block",textAlign: "right"};
styles.value = {fontSize: "18px",color: "#737373",display: "inline-block",paddingLeft: "20px"}

var Activity_Detail = React.createClass({
    mixins: [
        {getInterestGroups: getInterestGroups},
        {getMembers: getMembers}
    ],
    render(){
        return this.props.data ? (
            <div>
                <AppBar
                    style={styles.appbar.root}
                    titleStyle={styles.appbar.title}
                    title={this.props.title}
                    iconElementLeft={
                        <IconButton
                            style={styles.appbar.iconStyleLeft}
                            onTouchTap={this.props.goList}>
                            <NavigationLeft/>
                        </IconButton>
                    }
                    />

                <div style={styles.cardText}>
                    <div>
                        <label style={styles.label}>活动地点：</label>
                        <span style={styles.value}>
                        {this.props.data.signup.activity.activitySite}
                        </span>
                    </div>
                    <div style={styles.itemContainer}>
                        <label style={styles.label}>开始时间：</label>
                        <span style={styles.value}>
                        {moment(this.props.data.signup.activity.activityStartTime).format("YYYY-MM-DD HH:mm")}
                        </span>
                    </div>
                    <div style={styles.itemContainer}>
                        <label style={styles.label}>结束时间：</label>
                        <span style={styles.value}>
                        {moment(this.props.data.signup.activity.activityEndTime).format("YYYY-MM-DD HH:mm")}
                        </span>
                    </div>
                    <div style={styles.itemContainer}>
                        <label style={styles.label}>活动类型：</label>
                        <span style={styles.value}>
                        {this.getInterestGroups(this.props.data.signup.activity.interestGroups)}
                        </span>
                    </div>
                    <div style={styles.itemContainer}>
                        <label style={styles.label}>活动范围：</label>
                        <span style={styles.value}>
                        {this.props.data.signup.activity.scope.value}
                        </span>
                    </div>
                    <div style={styles.itemContainer}>
                        <label style={styles.label}>{i18n.get("sale_ship_owner","会员") + "负责人："}</label>
                        <span style={styles.value}>
                        {this.getMembers(this.props.data.signup.activity.members)}
                        </span>
                    </div>
                </div>
            </div>
        ) : null;
    }
});

export default Activity_Detail;