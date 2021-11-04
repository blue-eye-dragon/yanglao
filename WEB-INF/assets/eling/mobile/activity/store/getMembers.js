export default function getMembers(members){
    var ret = "";
    var value = members || [];
    for(var m=0;m<value.length;m++){
        ret += value[m].personalInfo.name+" ";
    }
    return ret.substring(0,ret.length-1);
}