/**
 * Created by xuechao on 2016/5/6.
 */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import HealthData_Oxygen from "../component/HealthData_Oxygen";
import HealthData_ChartsTitle from "../component/HealthData_ChartsTitle";

describe("健康监护-血氧", function(){

    it("血氧(%)",function(){
        var wrapper = shallow(<HealthData_Oxygen
            datas={[{
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
                      }
                    ]}
        />);

        expect(wrapper.find(HealthData_ChartsTitle)).to.have.length(1);

        expect(wrapper.find(HealthData_ChartsTitle).get(0).props.value).to.equal("154");

    });

});