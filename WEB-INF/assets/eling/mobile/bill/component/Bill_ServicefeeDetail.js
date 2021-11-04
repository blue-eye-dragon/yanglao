import React from "react";

import AppBar from 'material-ui/lib/app-bar';
import List from "material-ui/lib/lists/list";
import ListItem from "material-ui/lib/lists/list-item";

import IconButton from 'material-ui/lib/icon-button';
import NavigationLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import PhoneIcon from "material-ui/lib/svg-icons/communication/phone";
import HomeIcon from "material-ui/lib/svg-icons/action/home";

import Bill_DetailItem from "./Bill_DetailItem";
import Bill_PrimaryText from "./Bill_PrimaryText";
import Bill_SecondaryText from "./Bill_SecondaryText";

import Styles from "el-wechat/lib/Styles";

var homeIcon= {
    marginTop:"10px",fill:"white",width:"44px",height:"44px",marginTop:"12px",top:"0",left:"15px",padding:"12px",backgroundColor:"#f34541"
};

var phoneIcon= {
    marginTop:"10px",fill:"white",width:"44px",height:"44px",marginTop:"12px",top:"0",left:"15px",padding:"12px",backgroundColor:"#f8a326"
};

var Bill_Detail = React.createClass({
    render(){
        var data = this.props.data;

        var rightIconButtonStyle = {
            marginTop: "15px",
            marginRight: "10px",
            background: "white",
            borderRadius: "20px",
            color: data.statusColor,
            border: "1px solid " + (data.statusColor)
        };

        return data ? (
            <div>

                <AppBar
                    style={Styles.appbar.root}
                    titleStyle={Styles.appbar.title}
                    title={"服务费"}
                    iconElementLeft={
                        <IconButton
                            style={Styles.appbar.iconStyleLeft}
                            onTouchTap={this.props.goList}>
                            <NavigationLeft/>
                        </IconButton>
                    }
                />

                <div style={{borderBottom:"6px solid #f5f5f9"}}>

                    <Bill_DetailItem label={"应收金额"} value={data.dueAnnualFees}/>

                    <div style={{borderLeft:"2px solid #eeeeee",height:"60px",display:"inline-block",verticalAlign: "middle"}}></div>

                    <Bill_DetailItem label={"缴费日期"} value={data.beginDate}/>
                    
                </div>

                <List>
                    <ListItem
                        leftAvatar={<HomeIcon style={homeIcon}/>}
                        primaryText={<Bill_PrimaryText value={"房间号"}/>}
                        secondaryText={<Bill_SecondaryText value={data.memberSigning.room.number}/>}
                    />
                    <ListItem
                        leftAvatar={<PhoneIcon style={phoneIcon}/>}
                        primaryText={<Bill_PrimaryText value={"联系电话"}/>}
                        secondaryText={<Bill_SecondaryText value={data.memberSigning.room.telnumber}/>}
                    />
                </List>
            </div>
        ) : null;
    }
});

export default Bill_Detail;