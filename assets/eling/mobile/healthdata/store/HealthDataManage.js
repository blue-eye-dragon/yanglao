import moment from "moment";


let healthDataManage = {
    /**
     * 对健康数据按照最新排序
     * @param datas
     * @returns {datas}
     */
    getSort:function( datas ){

        datas.sort(function(iOld,iNew){
            if(iOld.createDate > iNew.createDate){
                return -1;
            }else if(iOld.createDate < iNew.createDate){
                return 1;
            }else if(iOld.createDate = iNew.createDate){
                if(iOld.pkHealthExamData > iNew.pkHealthExamData){
                    return -1;
                }else{
                    return 1;
                }
            }
        });

        return datas;
    },
    /**
     * 取得每天最新的数据
     * @param datas
     * @returns {Array}
     */
    getMostTimeData:function(datas){

        let tData = [];
        let timeArr = {};

        datas.forEach(function( n ){

            let t = moment(n.createDate).format("YYYY-MM-DD");

            if( timeArr[t] ){
                if( timeArr[t].createDate < n.createDate ){
                    timeArr[t].pkHealthExamData = n.pkHealthExamData;
                    timeArr[t].createDate = n.createDate;
                    timeArr[t].value1 = n.value1;
                }else if( timeArr[t].createDate == n.createDate && timeArr[t].pkHealthExamData < n.pkHealthExamData ){
                    timeArr[t].pkHealthExamData = n.pkHealthExamData;
                    timeArr[t].createDate = n.createDate;
                    timeArr[t].value1 = n.value1;
                }
            }else{
                timeArr[t] = {
                    pkHealthExamData: n.pkHealthExamData,
                    createDate: n.createDate,
                    value1: n.value1
                };
            }
        });

        for( var key in timeArr ){
            if( !tData[0] ){
                tData[0] = [];
            }
            tData[0].push( [moment(key).format("DD"), timeArr[key].value1] );
        }
        
        return tData;
    }

};

export default healthDataManage;