import React from "react";
import {render} from 'react-dom';

import initApplication from "el-wechat/lib/App";
import Score_AppBar from "el-wechat/lib/ELAppbar";
import aw from "el-wechat/lib/Ajaxwrapper";

import Score_Overall from "./Score_Overall";
import Score_FamilyCommunication from "./Score_FamilyCommunication";
import Score_Secretary from "./Score_Secretary";

var App = React.createClass({

    getInitialState(){
       return {
           overall: {},
           familyCommunication: {},
           secretaryScore: null,
           secretary: []
       };
    },

    render(){
        return (
            <div>
                <Score_AppBar/>
                <Score_Overall data={this.state.overall}/>
                <Score_FamilyCommunication data={this.state.familyCommunication}/>
                <Score_Secretary secretary={this.state.secretary} secretaryScore={this.state.secretaryScore}/>
            </div>
        );
    },

    fetchSecretary(){
        aw.ajax({
            url: "api/serviceevaluation/querySecretaryByPkPersonalInfo",
            data: {
                pkPersonalInfo: location.hash.substring(1)
            },
            success: function(secretary){
                this.setState({
                    secretary: secretary
                });
            }.bind(this)
        });
    },

    fetchScore(){
        aw.ajax({
            url: "api/serviceevaluation/queryByPkPersonalInfo",
            data: {
                pkPersonalInfo: location.hash.substring(1)
            },
            success: function(data){
                this.setState({
                    overall: this.processOverall(data),
                    familyCommunication: this.processFamilyCommunication(data),
                    secretaryScore: this.processSecretary(data)
                });
            }.bind(this)
        });
    },

    componentDidMount(){
        this.fetchSecretary();
        this.fetchScore();
    },

    processOverall(datas){
        for(var i in datas){
            if(datas[i].evaluateType.key == "Overall"){
                return datas[i];
            }
        }
        return {};
    },
    processFamilyCommunication(datas){
        for(var i in datas){
            if(datas[i].evaluateType.key == "FamilyCommunication"){
                return datas[i];
            }
        }
        return {};
    },
    processSecretary(datas){
        var ret = [];
        for(var i in datas) {
            if (datas[i].evaluateType.key == "Secretary") {
                ret.push(datas[i]);
            }
        }
        return ret;
    }
});

initApplication(App);