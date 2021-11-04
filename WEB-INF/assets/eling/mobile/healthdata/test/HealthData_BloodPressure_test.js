/**
 * Created by xuechao on 2016/5/6.
 */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import HealthData_BloodPressure from "../component/HealthData_BloodPressure";
import HealthData_ChartsTitle from "../component/HealthData_ChartsTitle";

describe("健康监护-血压", function(){

    it("收缩压，舒张压",function(){
        var wrapper = shallow(<HealthData_BloodPressure
                datas={[{
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
                      }
                    ]}
            />);

        expect(wrapper.find(HealthData_ChartsTitle)).to.have.length(2);

        expect(wrapper.find(HealthData_ChartsTitle).get(0).props.value).to.equal("130");
        expect(wrapper.find(HealthData_ChartsTitle).get(1).props.value).to.equal("95");

    });

});