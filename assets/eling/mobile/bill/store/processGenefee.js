import processGenefeeItem from "./processGenefeeItem"

export default function processGenefee(geneFees){
    var paid_geneFees = [], unpaid_geneFees = [];
    for(var i in geneFees){
        var generalFeesDetails = geneFees[i].generalFeesDetails || [];
        for(var j in generalFeesDetails){
            var ret = processGenefeeItem(generalFeesDetails[j],geneFees[i].memberSigning)
            paid_geneFees.push(ret);
            if(generalFeesDetails[j].payStatus.key == "UnPaid"){
                unpaid_geneFees.push(ret);
            }
        }
    }

    paid_geneFees = paid_geneFees.sort(function(a,b){
        if(a.type>b.type){
            return 1;
        }else{
            return -1;
        }
    });

    unpaid_geneFees = unpaid_geneFees.sort(function(a,b){
        if(a.type>b.type){
            return 1;
        }else{
            return -1;
        }
    });

    return {
        paid: paid_geneFees,
        unpaid: unpaid_geneFees
    }
}