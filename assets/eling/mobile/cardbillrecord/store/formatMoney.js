export default function getMoney(money,scale){
    if(money === null || money === undefined){
        return "-";
    }

    return "￥" + Number(money).toFixed(scale === undefined ? 2 : scale);
}