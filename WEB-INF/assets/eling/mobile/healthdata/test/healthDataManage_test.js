import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import healthDataManage from "../store/healthDataManage";


describe("健康监护-图表数据处理工具", function(){

    it("排序",function(){
        var ret = healthDataManage.getSort([
            {
                "pkHealthExamData": 163744,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "15",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462178580000,
                "description": "血糖值(mmol/L):15"
            },
            {
                "pkHealthExamData": 163757,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "12",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462343820000,
                "description": "血糖值(mmol/L):12"
            },
            {
                "pkHealthExamData": 163758,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "15",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462343820000,
                "description": "血糖值(mmol/L):15"
            },
            {
                "pkHealthExamData": 163738,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "12",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462264500000,
                "description": "血糖值(mmol/L):12"
            },
            {
                "pkHealthExamData": 163750,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "26",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462092300000,
                "description": "血糖值(mmol/L):26"
            }
        ]);
        expect(ret[0].createDate).to.equal(1462343820000);
    });

    it("取得每天最新的数据",function(){
        var ret = healthDataManage.getMostTimeData([
            {
                "pkHealthExamData": 163758,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "15",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462343820000,
                "description": "血糖值(mmol/L):15"
            },
            {
                "pkHealthExamData": 163757,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "12",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462343820000,
                "description": "血糖值(mmol/L):12"
            },
            {
                "pkHealthExamData": 163738,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "12",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462264500000,
                "description": "血糖值(mmol/L):12"
            },
            {
                "pkHealthExamData": 163744,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "15",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462178580000,
                "description": "血糖值(mmol/L):15"
            },
            {
                "pkHealthExamData": 163750,
                "type": {
                    "pkHealthExamDataType": 2,
                    "name": "血糖(空腹)",
                    "name1": "血糖值(mmol/L)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "26",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462092300000,
                "description": "血糖值(mmol/L):26"
            }
        ]);
        
        expect(ret[0].length).to.equal(4);
    });

});