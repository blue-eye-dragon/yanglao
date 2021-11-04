import moment from "moment";

export default function processGenefeeItem(genefee,memberSigning){
    return {
        key: genefee.pkGeneralFeesDetail,
        type: genefee.feeType.number,
        primaryText: genefee.feeType.name,
        secondaryText: "￥" + Number(genefee.fees).toFixed(2),
        status: genefee.payStatus.key=="UnPaid" ? "未缴清" : "已缴清",
        statusColor: genefee.payStatus.key=="UnPaid" ? "#f56b47" : "#d2d2d2",
        payDate: genefee.payDate ? moment(genefee.payDate).format("MM-DD") : "-",
        payType: genefee.payType ? genefee.payType.value : "-",
        memberSigning: memberSigning
    };
}