import moment from "moment";
export default function formatDatetime(date,mode){
    if(date === undefined || date === null){
        return "-";
    }
    return moment(date).format(mode || "YYYY-MM-DD HH:mm");
}