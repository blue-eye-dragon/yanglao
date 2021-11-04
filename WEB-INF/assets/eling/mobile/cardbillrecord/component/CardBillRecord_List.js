import React from "react";
import List from "material-ui/lib/lists/list";
import ListItem from "material-ui/lib/lists/list-item";

import LeftNav from 'ELLeftNav';
import aw from "Ajaxwrapper";

import CardBillRecord_ListItem from "./CardBillRecord_ListItem";
import CardBillRecord_Detail from "./CardBillRecord_Detail";

var CardBillRecord_List = React.createClass({
    getDefaultProps(){
        return {
            datas: [],
            width: document.documentElement.clientWidth
        }
    },
    getInitialState(){
        return {
            open: false,
            detail: {
                billDate: null,
                items: []
            }
        };
    },

    goDetail(data){
        aw.ajax({
            url: "api/cardSolution/purchasehistoryitem/queryBill",
            data: {
                billNo:data.billNo,
                billDate:data.billDate
            },
            success: function(detail){
                this.setState({
                    open: true,
                    detail: {
                        billDate: data.dateTime,
                        items: detail
                    }
                });
            }.bind(this)
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
            return (
                <CardBillRecord_ListItem key={data.billNo} data={data} goDetail={goDetail}/>
            );
        });

        return (
            <div>
                {
                    ListItems.length == 0 ? null : (
                        <div style={{borderBottom:"6px solid #f5f5f9",padding:"10px 0",fontSize:"22px",textAlign:"center",color:"#333333"}}>
                            <div style={{width:"50%",display:"inline-block"}}>消费时间</div>
                            <div style={{width:"50%",display:"inline-block"}}>消费金额</div>
                        </div>
                    )
                }

                <List>{ListItems}</List>
                <LeftNav width={document.documentElement.clientWidth}
                         open={this.state.open}>
                    {
                        this.state.detail ? (
                            <CardBillRecord_Detail goList={goList} data={this.state.detail}/>
                        ) : null
                    }
                </LeftNav>
            </div>
        );
    }

});

export default CardBillRecord_List;