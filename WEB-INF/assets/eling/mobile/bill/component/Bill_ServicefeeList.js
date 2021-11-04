import React from "react";

import List from "material-ui/lib/lists/list";
import LeftNav from 'el-wechat/lib/ELLeftNav';

import Bill_ListItem from "./Bill_ListItem";
import Bill_Detail from "./Bill_ServicefeeDetail";

import Icon from "material-ui/lib/svg-icons/places/free-breakfast";

var Bill_Servicefee = React.createClass({
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
            data.icon = Icon;
            data.iconColor = "#f34541";
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

export default Bill_Servicefee;