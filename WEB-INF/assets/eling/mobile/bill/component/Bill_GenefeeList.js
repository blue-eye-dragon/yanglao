import React from "react";

import List from "material-ui/lib/lists/list";
import PowerIcon from "material-ui/lib/svg-icons/notification/power";
import PhoneIcon from "material-ui/lib/svg-icons/communication/phone";
import TVIcon from "material-ui/lib/svg-icons/hardware/tv";
import WaterIcon from "material-ui/lib/svg-icons/action/invert-colors";
import WifiIcon from "material-ui/lib/svg-icons/device/wifi-tethering";
import DownwardIcon from "material-ui/lib/svg-icons/navigation/arrow-downward";
import UpwardIcon from "material-ui/lib/svg-icons/navigation/arrow-upward";

import LeftNav from 'el-wechat/lib/ELLeftNav';

import Bill_ListItem from "./Bill_ListItem";
import Bill_Detail from "./Bill_GeneralfeeDetail";

var types = {
    "1" : {icon:PowerIcon,color:"#00acec"},
    "2" : {icon:PowerIcon,color:"#00acec"},
    "3" : {icon:WaterIcon,color:"#49bf67"},
    "4" : {icon:WaterIcon,color:"#49bf67"},
    "5" : {icon:WaterIcon,color:"#49bf67"},
    "6" : {icon:PhoneIcon,color:"#f8a326"},
    "7" : {icon:TVIcon,color:"#f8a326"},
    "8" : {icon:WifiIcon,color:"#f8a326"},
    "9" : {icon:DownwardIcon,color:"#f8a326"},
    "10" : {icon:UpwardIcon,color:"#f8a326"}
};

var Bill_GeneFee = React.createClass({
    getInitialState(){
        return {
            open: false,
            detail: null
        };
    },

    goDetail(data){
        this.setState({
            open: true,
            detail: data
        });
    },

    goList(){
        this.setState({
            open: false
        });
    },

    render(){
        var goDetail = this.goDetail;
        var goList = this.goList;
        var ListItems = this.props.datas.map(function(data,index,array){
            data.icon = types[data.type].icon;
            data.iconColor = types[data.type].color;

            return (
                <Bill_ListItem
                    key={data.key}
                    goDetail={goDetail}
                    data={data}
                />
            );
        });

        return (
            <div>
                
                <List>{ListItems}</List>

                {
                    this.state.detail ? (
                        <LeftNav width={document.documentElement.clientWidth} open={this.state.open}>
                            <Bill_Detail goList={goList} data={this.state.detail}/>
                        </LeftNav>
                    ) : null
                }

            </div>
        );
    }

});

export default Bill_GeneFee;
