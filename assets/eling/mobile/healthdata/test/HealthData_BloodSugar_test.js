/**
 * Created by xuechao on 2016/5/6.
 */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import HealthData_BloodSugar from "../component/HealthData_BloodSugar";
import HealthData_ChartsTitle from "../component/HealthData_ChartsTitle";

describe("健康监护-血糖(空腹)", function(){

    it("血糖值(mmol/L)",function(){
        var wrapper = shallow(<HealthData_BloodSugar
            datas={[{
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
                    ]}
        />);

        expect(wrapper.find(HealthData_ChartsTitle)).to.have.length(1);

        expect(wrapper.find(HealthData_ChartsTitle).get(0).props.value).to.equal("15");

    });

});