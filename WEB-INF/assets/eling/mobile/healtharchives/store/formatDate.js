import moment from "moment";
export default function formatDate(date,format){
    return date ? moment(date).format(format || "YYYY-MM-DD") : "";
}