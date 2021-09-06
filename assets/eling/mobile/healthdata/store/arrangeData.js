import moment from "moment";

/**
 * 对总览数组按天进行分组
 * @param datas
 * @returns {Array}
 */
export default function arrangeData(datas){

    var newData = [];

    datas.forEach(function (data) {

        data.createDate = moment(data.createDate).format("YYYY-MM-DD");

        var isExist = false;
        newData.forEach(function(n){
            if(n.createDate == data.createDate){
                n.datas.push(data);
                isExist = true;
            }
        });

        if(!isExist){
            newData.push({
                createDate: data.createDate,
                datas: [data]
            });
        }

    });

    return newData;
}