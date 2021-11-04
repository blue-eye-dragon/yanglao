import React from "react";
import moment from "moment";

import initApplication from "el-wechat/lib/App";

import Bill_AppBar from "el-wechat/lib/ELAppbar";
import aw from "el-wechat/lib/Ajaxwrapper";

import Bill_SubAppBar from "./Bill_SubAppBar";
import Bill_StatusTab from "./Bill_StatusTab";

import processServicefee from "../store/processServicefee";
import processGenefee from "../store/processGenefee";

var App = React.createClass({
    getDefaultProps(){
        return {
            queryCondition: {
                servicefees: {
                    date : moment().startOf("year").valueOf(),
                    dateEnd : moment().endOf("year").valueOf(),
                    pkMember : "",
                    fetchProperties: "*,"+
                    "memberSigning.room.number," +
                    "memberSigning.room.telnumber"
                },
                genefees: {
                    pkMember : "",
                    feeMonth : moment().startOf("month").valueOf(),
                    feeMonthEnd : moment().endOf("month").valueOf(),
                    fetchProperties:"pkGeneralFees," +
                    "feeMonth,payer," +
                    "memberSigning.room.number," +
                    "memberSigning.room.telnumber," +
                    "generalFeesDetails.pkGeneralFeesDetail," +
                    "generalFeesDetails.fees," +
                    "generalFeesDetails.payStatus," +
                    "generalFeesDetails.payType," +
                    "generalFeesDetails.payDate," +
                    "generalFeesDetails.feeType.number," +
                    "generalFeesDetails.feeType.name"
                }
            }
        };
    },
    getInitialState(){
        return {
            serviceFees: {
                paid: [],
                unpaid: []
            },
            geneFees: {
                paid: [],
                unpaid: []
            }
        }
    },
    render(){
        return (
            <div>
                <Bill_AppBar onMemberChange={this.onMemberChange}/>
                <Bill_SubAppBar onDateChange={this.onDateChange}/>
                <Bill_StatusTab serviceFees={this.state.serviceFees} geneFees={this.state.geneFees}/>
            </div>
        );
    },

    onDateChange(date){

        this.props.queryCondition.genefees.feeMonth = moment(date).startOf("month").valueOf();
        this.props.queryCondition.genefees.feeMonthEnd = moment(date).endOf("month").valueOf();

        this.props.queryCondition.servicefees.date = moment(date).startOf("year").valueOf();
        this.props.queryCondition.servicefees.dateEnd = moment(date).endOf("year").valueOf();

        this.fetchData();
    },

    onMemberChange(member){
        this.props.queryCondition.genefees.pkMember = member.pkMember;
        this.props.queryCondition.servicefees.pkMember = member.pkMember;
        this.fetchData();
    },

    getServicefee(){
        aw.ajax({
            url: "api/annualfees/queryByMemerAndTimes",
            data: this.props.queryCondition.servicefees,
            success: function(data){
                var serviceFee = processServicefee(data);
                this.setState({
                    "serviceFees": {
                        paid: serviceFee.paid,
                        unpaid: serviceFee.unpaid
                    }
                });
            }.bind(this)
        });
    },

    getGenefees(date,pkMember){
        aw.ajax({
            url: "api/generalfees/queryByPkMember",
            data: this.props.queryCondition.genefees,
            success: function(data){
                var geneFee = processGenefee(data);
                this.setState({
                    "geneFees": {
                        paid: geneFee.paid,
                        unpaid: geneFee.unpaid
                    }
                });
            }.bind(this)
        });
    },

    fetchData(){
        this.getGenefees();
        this.getServicefee();
    }
});

initApplication(App)