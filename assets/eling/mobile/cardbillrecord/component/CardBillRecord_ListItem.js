import React from "react";

import ListItem from "material-ui/lib/lists/list-item";

import Loyalty from 'material-ui/lib/svg-icons/action/loyalty';

import formatMoney from "../store/formatMoney"
import formatDatetime from "../store/formatDatetime"

var custStyles={
    listItem:{
        borderBottom:"1px solid #f5f5f9"
    },
    primaryText:{
        marginLeft: "-40px",
        fontSize:"20px",
        position:"relative",
        textAlign: "center"
    },
    date: {
        display:"inline-block",
        width:"50%"
    },
    money:{
        display:"inline-block",
        color:"#f56b47",
        width:"50%"
    },
    leftIcon : {
        transform:"rotate(90deg)",
        msTransform:"rotate(90deg)",
        MozTransform:"rotate(90deg)",
        WebkitTransform:"rotate(90deg)",
        OTransform:"rotate(90deg)",
        fill:"#f56747"
    }
}

var _PrimaryText = React.createClass({
    render(){
        return (
            <div style={custStyles.primaryText}>
                <span style={custStyles.date}>{this.props.date}</span>
                <span style={custStyles.money}>{this.props.money}</span>
            </div>
        );
    }
});

var CardBillRecord_ListItem = React.createClass({
    goDetail(){
        this.props.goDetail(this.props.data);
        return false;
    },
    render(){

        return (
            <ListItem
                key={this.props.data.billNo}
                style={custStyles.listItem}
                onTouchTap={this.goDetail}
                primaryText={<_PrimaryText date={formatDatetime(this.props.data.dateTime,"MM-DD HH:mm")} money={formatMoney(this.props.data.money)}/>}
                leftIcon={<Loyalty style={custStyles.leftIcon}/>}
                />
        );
    }
});

export default CardBillRecord_ListItem;