export default function getInterestGroups(interestGroups){
    var ret = "";
    var value = interestGroups || [];
    for(var j=0;j<value.length;j++){
        ret += value[j].description+" ";
    }
    return ret.substring(0,ret.length-1);
}