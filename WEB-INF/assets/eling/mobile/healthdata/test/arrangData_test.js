import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import arrangeData from "../store/arrangeData";


describe("健康监护-对总览数组按天进行分组", function(){

    it("数据库查询的值",function(){
        var ret = arrangeData([
            {
                "pkHealthExamData": 163755,
                "type": {
                    "pkHealthExamDataType": 1,
                    "name": "血压",
                    "name1": "收缩压",
                    "name2": "舒张压",
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "128",
                "value2": "90",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462343820000,
                "description": "收缩压:128,舒张压:90"
            },
            {
                "pkHealthExamData": 163756,
                "type": {
                    "pkHealthExamDataType": 1,
                    "name": "血压",
                    "name1": "收缩压",
                    "name2": "舒张压",
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "130",
                "value2": "95",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462343820000,
                "description": "收缩压:130,舒张压:95"
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
                "pkHealthExamData": 163739,
                "type": {
                    "pkHealthExamDataType": 3,
                    "name": "血氧",
                    "name1": "血氧(%)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "154",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462264500000,
                "description": "血氧(%):154"
            },
            {
                "pkHealthExamData": 163740,
                "type": {
                    "pkHealthExamDataType": 4,
                    "name": "体脂",
                    "name1": "体脂(%)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "45",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462264500000,
                "description": "体脂(%):45"
            },
            {
                "pkHealthExamData": 163741,
                "type": {
                    "pkHealthExamDataType": 5,
                    "name": "心率",
                    "name1": "心率(次/分)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "70",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462264500000,
                "description": "心率(次/分):70"
            },
            {
                "pkHealthExamData": 163742,
                "type": {
                    "pkHealthExamDataType": 7,
                    "name": "体温",
                    "name1": "体温(℃)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "36.5",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462264500000,
                "description": "体温(℃):36.5"
            },
            {
                "pkHealthExamData": 163737,
                "type": {
                    "pkHealthExamDataType": 1,
                    "name": "血压",
                    "name1": "收缩压",
                    "name2": "舒张压",
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "121",
                "value2": "71",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462264440000,
                "description": "收缩压:121,舒张压:71"
            },
            {
                "pkHealthExamData": 163748,
                "type": {
                    "pkHealthExamDataType": 7,
                    "name": "体温",
                    "name1": "体温(℃)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "36",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462178640000,
                "description": "体温(℃):36"
            },
            {
                "pkHealthExamData": 163743,
                "type": {
                    "pkHealthExamDataType": 1,
                    "name": "血压",
                    "name1": "收缩压",
                    "name2": "舒张压",
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "110",
                "value2": "60",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462178580000,
                "description": "收缩压:110,舒张压:60"
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
                "pkHealthExamData": 163745,
                "type": {
                    "pkHealthExamDataType": 3,
                    "name": "血氧",
                    "name1": "血氧(%)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "25",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462178580000,
                "description": "血氧(%):25"
            },
            {
                "pkHealthExamData": 163746,
                "type": {
                    "pkHealthExamDataType": 4,
                    "name": "体脂",
                    "name1": "体脂(%)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "48",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462178580000,
                "description": "体脂(%):48"
            },
            {
                "pkHealthExamData": 163747,
                "type": {
                    "pkHealthExamDataType": 5,
                    "name": "心率",
                    "name1": "心率(次/分)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "60",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462178580000,
                "description": "心率(次/分):60"
            },
            {
                "pkHealthExamData": 163749,
                "type": {
                    "pkHealthExamDataType": 1,
                    "name": "血压",
                    "name1": "收缩压",
                    "name2": "舒张压",
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "135",
                "value2": "80",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462092300000,
                "description": "收缩压:135,舒张压:80"
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
            },
            {
                "pkHealthExamData": 163751,
                "type": {
                    "pkHealthExamDataType": 3,
                    "name": "血氧",
                    "name1": "血氧(%)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "65",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462092300000,
                "description": "血氧(%):65"
            },
            {
                "pkHealthExamData": 163752,
                "type": {
                    "pkHealthExamDataType": 4,
                    "name": "体脂",
                    "name1": "体脂(%)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "65",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462092300000,
                "description": "体脂(%):65"
            },
            {
                "pkHealthExamData": 163753,
                "type": {
                    "pkHealthExamDataType": 5,
                    "name": "心率",
                    "name1": "心率(次/分)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "68",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462092300000,
                "description": "心率(次/分):68"
            },
            {
                "pkHealthExamData": 163754,
                "type": {
                    "pkHealthExamDataType": 7,
                    "name": "体温",
                    "name1": "体温(℃)",
                    "name2": null,
                    "name3": null,
                    "name4": null,
                    "name5": null,
                    "name6": null
                },
                "value1": "38",
                "value2": "",
                "value3": "",
                "value4": "",
                "value5": "",
                "value6": "",
                "member": {
                    "pkMember": 3497
                },
                "createDate": 1462092300000,
                "description": "体温(℃):38"
            }
        ]);

        expect(ret.length).to.equal(4);
        expect(ret[0].createDate).to.equal("2016-05-04");
    });

});
