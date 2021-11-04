import React from "react";

import LeftNav from 'el-wechat/lib/ELLeftNav';

import Activity_ListItem from "./Activity_ListItem";
import Activity_Detail from "./Activity_Detail";

var Activity_List = React.createClass({

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
        var Cards = this.props.datas.map(function(data,index,array){
            return (
                <Activity_ListItem
                    key={data.pkActivitysignup}
                    data={data}
                    goDetail={goDetail}
                    />
            );
        });

        return (
            <div>
                <div>{Cards}</div>
                <LeftNav width={document.documentElement.clientWidth}
                         open={this.state.open}>
                    {
                        this.state.detail ? (
                            <Activity_Detail title={this.props.title} goList={goList} data={this.state.detail}/>
                        ) : null
                    }
                </LeftNav>
            </div>
        );
    }

});

export default Activity_List;