import React from "react";

import IconButton from 'material-ui/lib/icon-button';
import NavigationLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';

import initApplication from "el-wechat/lib/App";
import aw from "el-wechat/lib/Ajaxwrapper";
import LeftNav from 'el-wechat/lib/ELLeftNav';
import HealthData_AppBar from "el-wechat/lib/ELAppbar";
import styles from "el-wechat/lib/Styles";
import moment from "moment";

import arrangeData from "../store/arrangeData";
import healthDataManage from "../store/HealthDataManage";

import HealthData_MenuItem from "./HealthData_MenuItem";

import HealthData_OverView from "./HealthData_OverView";
import HealthData_BloodPressure from "./HealthData_BloodPressure";
import HealthData_BloodSugar from "./HealthData_BloodSugar";
import HealthData_Oxygen from "./HealthData_Oxygen";
import HealthData_Fat from "./HealthData_Fat";
import HealthData_HeartRate from "./HealthData_HeartRate";

let App = React.createClass({

    //条件需要统一管理
    getDefaultProps(){
        return {
            width: document.documentElement.clientWidth,
            queryCondition:{
                overViewCondition:{
                    member:"",
                    createDate: moment().startOf("months").valueOf(),
                    createDateEnd: moment().endOf("months").valueOf(),
                    "type.pkHealthExamDataType":"",
                    "type.preset":true,
                    fetchProperties:"pkHealthExamData,description,createDate,type.pkHealthExamDataType," +
                    "type.name,type.name1,type.name2,type.name3,type.name4,type.name5,type.name6,member.pkMember,value1,value2,value3,value4,value5,value6"
                }
            }
        };
    },
    getInitialState(){
        return {
            open: false,
            datas: [],
            type: null
        };
    },
    onGoDetail(type){

        if(this.state.type != type){
            this.props.queryCondition.overViewCondition.createDate = moment().startOf("months").valueOf();
            this.props.queryCondition.overViewCondition.createDateEnd = moment().endOf("months").valueOf();
        }

        this.setState({
            open: true,
            type: type,
            datas: []
        });

        this["get" + type.substring(0,1).toUpperCase() + type.substring(1)]();
    },
    onGoDashboard(){
        this.setState({
            open: false
        });

    },
    onMemberChange(member){

        this.props.queryCondition.overViewCondition.member = member.pkMember;

        if(this.state.type){
            //证明是点击
            this["get" + this.state.type.substring(0,1).toUpperCase() + this.state.type.substring(1)](member,null);
        }
        this.setState({
            member: member
        });
    },
    onDateChange(date){
        var startDate = moment(date).startOf("months").valueOf();
        var endDate = moment(date).endOf("months").valueOf();

        this.props.queryCondition.overViewCondition.createDate = startDate;
        this.props.queryCondition.overViewCondition.createDateEnd = endDate;

        this["get" + this.state.type.substring(0,1).toUpperCase() + this.state.type.substring(1)](null,date);
    },
    render(){
        var Child = null;

        switch(this.state.type){
            case "overView" : Child=HealthData_OverView; break;
            case "bloodPressure" : Child = HealthData_BloodPressure; break;
            case "bloodSugar" : Child = HealthData_BloodSugar; break;
            case "oxygen" : Child = HealthData_Oxygen; break;
            case "fat" : Child = HealthData_Fat; break;
            case "heartRate" : Child = HealthData_HeartRate; break;
            default : Child=null
        }

        return(
            <div>
                <img src={"./component/assets/banner.png"} style={{width: "100%"}}/>
                <div>
                    <HealthData_MenuItem onTouchTap={this.onGoDetail.bind(this,"overView")} label={"总览"} img={"./component/assets/zonglan.png"}/>
                    <HealthData_MenuItem onTouchTap={this.onGoDetail.bind(this,"bloodPressure")} label={"血压"} img={"./component/assets/xueya.png"}/>
                    <HealthData_MenuItem onTouchTap={this.onGoDetail.bind(this,"bloodSugar")} label={"血糖(空腹)"} img={"./component/assets/xuetang.png"}/>
                </div>
                <div>
                    <HealthData_MenuItem onTouchTap={this.onGoDetail.bind(this,"oxygen")} label={"血氧"} img={"./component/assets/xueyang.png"}/>
                    <HealthData_MenuItem onTouchTap={this.onGoDetail.bind(this,"fat")} label={"体脂"} img={"./component/assets/tizhi.png"}/>
                    <HealthData_MenuItem onTouchTap={this.onGoDetail.bind(this,"heartRate")} label={"心率"} img={"./component/assets/xinlv.png"}/>
                </div>

                <LeftNav width={this.props.width}
                         open={this.state.open}>
                    <HealthData_AppBar
                        iconElementLeft={
                            <IconButton style={styles.appbar.iconStyleLeft}
                                        onTouchTap={this.onGoDashboard}>
                                <NavigationLeft/>
                            </IconButton>
                        }
                        onMemberChange={this.onMemberChange}
                    />
                    {Child ? <Child onDateChange={this.onDateChange} datas={this.state.datas} />: null}
                </LeftNav>
            </div>
        );
    },
    getHealthData(){
        aw.ajax({
            url: "api/healthexamdata/query",
            async: false,
            data: this.props.queryCondition.overViewCondition,
            success: function(data){

                data = healthDataManage.getSort(data);

                this.setState({
                    datas: data
                });
            }.bind(this)
        });
    },
    //获取总览数据
    getOverView(member,date){

        this.props.queryCondition.overViewCondition["type.pkHealthExamDataType"] = null;

        aw.ajax({
            url: "api/healthexamdata/query",
            data: this.props.queryCondition.overViewCondition,
            success: function(data){
                data = arrangeData(data);
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    },
    //获取血压数据
    getBloodPressure(member,date){
        this.props.queryCondition.overViewCondition["type.pkHealthExamDataType"] = "1";
        this.getHealthData();
    },
    //获取血糖数据
    getBloodSugar(member,date){
        this.props.queryCondition.overViewCondition["type.pkHealthExamDataType"] = "2";
        this.getHealthData();
    },
    //获取血氧数据
    getOxygen(member,date){
        this.props.queryCondition.overViewCondition["type.pkHealthExamDataType"] = "3";
        this.getHealthData();
    },
    //获取体脂数据
    getFat(member,date){
        this.props.queryCondition.overViewCondition["type.pkHealthExamDataType"] = "4";
        this.getHealthData();
    },
    //获取心率数据
    getHeartRate(member,date){
        this.props.queryCondition.overViewCondition["type.pkHealthExamDataType"] = "5";
        this.getHealthData();
    }

});

initApplication(App);