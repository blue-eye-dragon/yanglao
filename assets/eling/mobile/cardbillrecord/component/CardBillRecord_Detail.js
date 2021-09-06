import React from "react";
import AppBar from 'material-ui/lib/app-bar';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import IconButton from 'material-ui/lib/icon-button';
import NavigationLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import moment from "moment";

import styles from "Styles";

import formatMoney from "../store/formatMoney"
import formatDatetime from "../store/formatDatetime"

var CardBillRecord_Detail = React.createClass({
    render(){
        var datas = this.props.data.items || [];

        var TableRows = datas.map(function(data,index,array){
            return (
                <TableRow key={index}>
                    <TableRowColumn style={{fontSize:"20px",color:"#737373"}}>{data.purchaseType}</TableRowColumn>
                    <TableRowColumn style={{fontSize:"20px",color:"#737373"}}>{data.purchaseItem}</TableRowColumn>
                    <TableRowColumn style={{fontSize:"20px",color:"#737373"}}>{formatMoney(data.itemPrice*data.itemQty)}</TableRowColumn>
                </TableRow>
            );
        });

        return this.props.data ? (
            <div>
                <AppBar
                    style={styles.appbar.root}
                    titleStyle={styles.appbar.title}
                    title={"一卡通消费记录明细"}
                    iconElementLeft={
                        <IconButton
                            style={styles.appbar.iconStyleLeft}
                            onTouchTap={this.props.goList}>
                            <NavigationLeft/>
                        </IconButton>
                    }
                >
                </AppBar>

                <div style={{height:"88px",lineHeight:"88px",textAlign:"center",fontSize:"22px",borderBottom:"6px solid #f5f5f9"}}>
                    <span>消费时间</span>
                    <span style={{color:"#f56b47",paddingLeft:"10px"}}>{formatDatetime(this.props.data.billDate)}</span>
                </div>

                <Table selectable={false}>
                    <TableHeader style={{borderBottom:"6px solid #f5f5f9"}} displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{fontSize:"22px",color:"#333333"}}>消费类型</TableHeaderColumn>
                            <TableHeaderColumn style={{fontSize:"22px",color:"#333333"}}>消费项目</TableHeaderColumn>
                            <TableHeaderColumn style={{fontSize:"22px",color:"#333333"}}>金额</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>{TableRows}</TableBody>
                </Table>
            </div>
        ) : null;
    }
});

export default CardBillRecord_Detail;