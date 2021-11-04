import React from "react";

import IconButton from 'material-ui/lib/icon-button';
import NavigationLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';

import initApplication from "el-wechat/lib/App";
import aw from "el-wechat/lib/Ajaxwrapper";
import LeftNav from 'el-wechat/lib/ELLeftNav';
import HealthArchives_AppBar from "el-wechat/lib/ELAppbar";
import styles from "el-wechat/lib/Styles";
import moment from "moment";

import HealthArchives_HealthDoctoRevaluation from "./HealthArchives_HealthDoctoRevaluation";
import HealthArchives_Aller from "./HealthArchives_Aller";
import HealthArchives_MedicalRecord from "./HealthArchives_MedicalRecord";
import HealthArchives_Phatak from "./HealthArchives_Phatak";
import HealthArchives_DiseaseHistory from "./HealthArchives_DiseaseHistory";
import HealthArchives_Nextexam from "./HealthArchives_Nextexam";
import HealthArchives_Patient from "./HealthArchives_Patient";
import HealthArchives_MemberDailyRecord from "./HealthArchives_MemberDailyRecord";
import HealthArchives_MenuItem from "./HealthArchives_MenuItem";

var App = React.createClass({
    getDefaultProps(){
       return {
           width: document.documentElement.clientWidth
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
        if(this.state.type){
            //证明是点击
            this["get" + this.state.type.substring(0,1).toUpperCase() + this.state.type.substring(1)](member,null);
        }
        this.setState({
            member: member
        });
    },
    onDateChange(date){
        this["get" + this.state.type.substring(0,1).toUpperCase() + this.state.type.substring(1)](null,date);
    },
    render(){
        var Child;
        switch(this.state.type){
            case "aller" : Child=HealthArchives_Aller; break;
            case "diseaseHistory" : Child=HealthArchives_DiseaseHistory; break;
            case "nextexam" : Child=HealthArchives_Nextexam;break;
            case "phatak" : Child=HealthArchives_Phatak;break;
            case "medicalRecord" : Child=HealthArchives_MedicalRecord;break;
            case "patient" : Child=HealthArchives_Patient;break;
            case "healthDoctoRevaluation" : Child=HealthArchives_HealthDoctoRevaluation;break;
            case "memberDailyRecord" : Child=HealthArchives_MemberDailyRecord;break;
            default : Child=null
        }
        return (
            <div>
                <img src={"./component/assets/banner.png"} style={{width: "100%"}}/>
                <div>
                    <HealthArchives_MenuItem onTouchTap={this.onGoDetail.bind(this,"healthDoctoRevaluation")} label={"巡检"} img={"./component/assets/xunjian.svg"}/>
                    <HealthArchives_MenuItem onTouchTap={this.onGoDetail.bind(this,"aller")} label={"过敏"} img={"./component/assets/guomin.svg"}/>
                    <HealthArchives_MenuItem onTouchTap={this.onGoDetail.bind(this,"medicalRecord")} label={"就诊"} img={"./component/assets/jiuzhen.svg"}/>
                </div>

                <div>
                    <HealthArchives_MenuItem onTouchTap={this.onGoDetail.bind(this,"phatak")} label={"用药"} img={"./component/assets/yongyao.svg"}/>
                    <HealthArchives_MenuItem onTouchTap={this.onGoDetail.bind(this,"diseaseHistory")} label={"疾病"} img={"./component/assets/jibing.svg"}/>
                    <HealthArchives_MenuItem onTouchTap={this.onGoDetail.bind(this,"nextexam")} label={"复诊"} img={"./component/assets/fuzhen.svg"}/>
                </div>
                <div>
                    <HealthArchives_MenuItem onTouchTap={this.onGoDetail.bind(this,"patient")} label={"住院"} img={"./component/assets/zhuyuan.svg"}/>
                    <HealthArchives_MenuItem onTouchTap={this.onGoDetail.bind(this,"memberDailyRecord")} label={"日常"} img={"./component/assets/richang.svg"}/>
                </div>

                <LeftNav width={this.props.width}
                         open={this.state.open}>
                    <HealthArchives_AppBar
                        iconElementLeft={
                            <IconButton style={styles.appbar.iconStyleLeft}
                                        onTouchTap={this.onGoDashboard}>
                                <NavigationLeft/>
                            </IconButton>
                        }
                        onMemberChange={this.onMemberChange}
                        />
                    {Child ? <Child onDateChange={this.onDateChange} datas={this.state.datas}/>: null}
                </LeftNav>

            </div>
        );
    },
    getAller(member){
        aw.ajax({
            url: "api/allergichistory/query",
            data: {
                member: (member || this.state.member).pkMember,
                type: "过敏史",
                fetchProperties: "name,date"
            },
            success: function(data){
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    },
    getDiseaseHistory(member){
        aw.ajax({
            url: "api/diseasehistory/query",
            data: {
                member: (member || this.state.member).pkMember,
                fetchProperties: "pkDiseaseHistory,diseaseDetail.name,diseaseStatus"
            },
            success: function(data){
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    },
    getNextexam(member){
        aw.ajax({
            url: "api/examrecord/query",
            data: {
                member: (member || this.state.member).pkMember,
                fetchProperties: "pkExaminationRecord,date,doctor,hospital.name,diseaseDetail.name,member.personalInfo.name,etcommdata.name"
            },
            success: function(data){
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    },
    getPhatak(member){
        aw.ajax({
            url: "api/pharmacytakenotes/query",
            data: {
                member: (member || this.state.member).pkMember,
                type:"用药记录",
                "orderString:startTime":"desc",
                fetchProperties: "startTime,medicine.name"
            },
            success: function(data){
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    },
    getMedicalRecord(member){
        aw.ajax({
            url: "api/medicalrecords/query",
            data: {
                member: (member || this.state.member).pkMember,
                orderString: "date:desc",
                type: "就诊记录",
                fetchProperties: "*,diseaseDetails.*,hospital.name"
            },
            success: function(data){
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    },
    getPatient(member){
        aw.ajax({
            url: "api/patientregistration/query",
            data: {
                member: (member || this.state.member).pkMember,
                fetchProperties: "disease,checkInDate,checkOutDate,hospital.name," +
                    "status,departmentsSickbed,afterTreatment,dischargeDiagnosis,doctorAdvised"
            },
            success: function(data){
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    },
    getHealthDoctoRevaluation(member,date){
        aw.ajax({
            url: "api/doctorevaluation/query",
            data: {
                member: (member || this.state.member).pkMember,
                updateTime: (date ? moment(date) : moment()).startOf("months").valueOf(),
                updateTimeEnd: (date ? moment(date) : moment()).endOf("months").valueOf(),
                fetchProperties: "pkDoctorEvaluation,description,updateTime"
            },
            success: function(data){
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    },
    getMemberDailyRecord(member,date){
        aw.ajax({
            url: "api/memberdailyrecord/query",
            data: {
                member: (member || this.state.member).pkMember,
                date: (date ? moment(date) : moment()).startOf("months").valueOf(),
                dateEnd: (date ? moment(date) : moment()).endOf("months").valueOf(),
                fetchProperties : "date,record",
                type : "Health"
            },
            success: function(data){
                this.setState({
                    datas: data
                })
            }.bind(this)
        });
    }
});
initApplication(App)