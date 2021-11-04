import React from "react";

import initApplication from "el-wechat/lib/App";
import Activity_AppBar from "el-wechat/lib/ELAppbar";
import aw from "el-wechat/lib/Ajaxwrapper";

import Activity_SubHeader from "./Activity_SubHeader";
import Activity_List from "./Activity_List";

import getIndexData from "../store/getIndexData"

var App = React.createClass({

    getInitialState(){
        return {
            length: 0,
            datas: [],
            title: ""
        };
    },

    render(){
        return (
            <div>
                <Activity_AppBar onMemberChange={this.onMemberChange}/>

                <Activity_SubHeader length={this.state.length}/>

                <Activity_List title={this.state.title} datas={this.state.datas}/>
            </div>
        );
    },

    onMemberChange(member){
        this.fetchData(member);
    },

    fetchData(member){
        aw.ajax({
            url: "api/activitysignup/queryMemberSignup",
            data: {
                pkMember: member.pkMember,
                firstResult: 0,
                maxResults: 10000,
                fetchProperties: "pkActivitysignup,start,notStart,signup.activity.theme," +
                    "signup.activity.activitySite,signup.activity.activityStartTime,signup.activity.activityEndTime," +
                    "signup.activity.type,signup.activity.scope.value,signup.activity.members,signup.activity.interestGroups," +
                    "signup.activity.interestGroups.description,signup.activity.status.value,signup.activity.members," +
                    "signup.activity.members.personalInfo.name"
            },
            dataType: "json",
            success: function(data){
                this.setState(getIndexData(data,member));
            }.bind(this)
        });
    }
});

initApplication(App);