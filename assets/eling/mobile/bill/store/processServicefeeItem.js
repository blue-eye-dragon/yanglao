import moment from "moment";

function getStatusText(status){
    return status.key=="UnCharge" ? "未缴清" : "已缴清"
}

function getStatusColor(status){
    return status.key=="UnCharge" ? "#f56b47" : "#d2d2d2"
}

function formatMoney(money){
    if(money === null || money === undefined){
        return "-";
    }
    return "￥" + Number(money).toFixed(2);
}

function getBeginDate(beginDate){
    return beginDate ? moment(beginDate).format("YYYY-MM-DD") : "-";
}

export default function processServicefeeItem(servicefee){
    return {
        key: servicefee.pkAnnualFees,
        type: "servicefee",
        primaryText: "服务费",
        secondaryText: formatMoney(servicefee.realAnnualFees),
        status: getStatusText(servicefee.chargeStatus),
        statusColor: getStatusColor(servicefee.chargeStatus),
        dueAnnualFees: formatMoney(servicefee.dueAnnualFees),
        beginDate: getBeginDate(servicefee.beginDate),
        memberSigning: servicefee.memberSigning
    };
}