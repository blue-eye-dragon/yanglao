import React from "react";

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import styles from "el-wechat/lib/Styles";

import Bill_Genefee from "./Bill_GenefeeList";
import Bill_Servicefee from "./Bill_ServicefeeList";

var Bill_StatusTab = React.createClass({
    getInitialState(){
        return {
            active : true
        }
    },

    toggleTab(){
        this.setState({
            "active" : !this.state.active
        });
    },

    render(){
        return (
            <Tabs tabItemContainerStyle={styles.tab.tabItemContainerStyle} onChange={this.toggleTab}>

                <Tab label={<span style={this.state.active ? styles.tab.active : styles.tab.unActive}>全部</span>}>
                    <Bill_Servicefee datas={this.props.serviceFees.paid}/>
                    <Bill_Genefee datas={this.props.geneFees.paid}/>
                </Tab>

                <Tab label={<span style={this.state.active ? styles.tab.unActive : styles.tab.active}>未缴清</span>}>
                    <Bill_Servicefee datas={this.props.serviceFees.unpaid}/>
                    <Bill_Genefee datas={this.props.geneFees.unpaid}/>
                </Tab>

            </Tabs>
        );
    }
});

export default Bill_StatusTab;