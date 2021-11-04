import React from "react";
import moment from "moment";

import initApplication from "App";
import CardBillRecord_AppBar from "ELAppbar";
import aw from "Ajaxwrapper";

import CardBillRecord_Remaining from "./CardBillRecord_Remaining";
import CardBillRecord_SubAppBar from "./CardBillRecord_SubAppBar";
import CardBillRecord_List from "./CardBillRecord_List";

var App = React.createClass({

    getDefaultProps(){
        return {
            queryCondition: {
                balance: {
                    "member.pkMember": "",
                },
                cardbillrecord: {
                    "member.pkMember": "",
                    "start":moment().startOf("month").subtract(1,"month").valueOf(),
                    "end":moment().endOf("month").valueOf()
                }
            }
        };
    },

    getInitialState(){
        return {
            datas: [],
            balance: null
        }
    },

    render(){
        return (
            <div>
                <CardBillRecord_AppBar onMemberChange={this.onMemberChange}/>
                <CardBillRecord_Remaining value={this.state.balance}/>
                <CardBillRecord_SubAppBar onDateChange={this.onDateChange}/>
                <CardBillRecord_List datas={this.state.datas}/>
            </div>
        );
    },


    onDateChange(date){

        var start = moment(date).startOf("month").valueOf();
        var end = moment(date).endOf("month").valueOf();

        this.props.queryCondition.cardbillrecord.start = start;
        this.props.queryCondition.cardbillrecord.end = end;
        this.getCardBillRecords();
    },

    getCardBillRecords(){
        aw.ajax({
            url: "api/cardSolution/purchasehistory/query",
            data: this.props.queryCondition.cardbillrecord,
            success: function(data){
                this.setState({
                    datas: data
                });
            }.bind(this)
        });
    },

    onMemberChange(member){
        this.props.queryCondition.balance["member.pkMember"] = member.pkMember;
        this.props.queryCondition.cardbillrecord["member.pkMember"] = member.pkMember;

        this.getCardBillRecords();
        this.getBalance();
    },

    getBalance(){
        aw.ajax({
            url: "api/cardSolution/card/member",
            data: this.props.queryCondition.balance,
            success: function(data){
                this.setState({
                    balance: data
                });
            }.bind(this)
        });
    }
});

initApplication(App);