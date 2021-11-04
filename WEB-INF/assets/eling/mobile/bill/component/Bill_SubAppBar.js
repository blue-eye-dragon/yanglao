import React from "react";

import IconButton from 'material-ui/lib/icon-button';
import NavigationLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import NavigationRight from 'material-ui/lib/svg-icons/navigation/chevron-right';

import moment from "moment";

const styles = {
    style: {textAlign:"center"},
    toggleBtn: {
        style: {display:"inline-block",width:"84px",height:"84px"},
        iconStyle: {width:"60px",height:"60px",fill:"#f56b47",cursor:"pointer"}
    },
    font: {
        fontSize:"32px",color:"#f56b47",display:"inline-block",verticalAlign:"top",marginTop:"20px"
    }
}

var Bill_SubAppBar = React.createClass({
    getInitialState(){
        return {
            date: moment().format("YYYY-MM"),
            hasNext: 0
        }
    },
    prevDate(){
        var date = moment(this.state.date).subtract("1","months").format("YYYY-MM");
        this.setState({
            date: date,
            hasNext: this.state.hasNext+1
        });

        this.props.onDateChange(date);
    },
    nextDate(){
        if(this.state.hasNext){
            var date = moment(this.state.date).add("1","months").format("YYYY-MM");
            this.setState({
                date: date,
                hasNext: this.state.hasNext > 0 ? this.state.hasNext-1 : 0
            });
            this.props.onDateChange(date);
        }
    },
    render(){
        var LeftArrow = (
            <IconButton
                onTouchTap={this.prevDate}
                style={styles.toggleBtn.style}
                iconStyle={styles.toggleBtn.iconStyle}>
                    <NavigationLeft/>
            </IconButton>
        );
        var RightArrow = (
            <IconButton
                onTouchTap={this.nextDate}
                style={styles.toggleBtn.style}
                disabled={this.state.hasNext ? false : true}
                iconStyle={styles.toggleBtn.iconStyle}>
                    <NavigationRight/>
            </IconButton>
        );
        return (
            <div style={styles.style}>
                {LeftArrow}
                <div style={styles.font}>{this.state.date}</div>
                {RightArrow}
            </div>
        );
    }
});

export default Bill_SubAppBar;