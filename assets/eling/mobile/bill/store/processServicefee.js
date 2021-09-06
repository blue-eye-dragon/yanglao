import processServicefeeItem from "./processServicefeeItem"

export default function processServicefee(serviceFees){
    var paid_serviceFees = [], unpaid_serviceFees = [];
    for(var s in serviceFees){
        var ret = processServicefeeItem(serviceFees[s]);
        paid_serviceFees.push(ret);

        if(serviceFees[s].chargeStatus.key=="UnCharge"){
            unpaid_serviceFees.push(ret);
        }
    }

    return {
        paid: paid_serviceFees,
        unpaid: unpaid_serviceFees
    };
}