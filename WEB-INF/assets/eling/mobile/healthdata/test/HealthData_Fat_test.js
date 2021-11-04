/**
 * Created by xuechao on 2016/5/6.
 */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import HealthData_Fat from "../component/HealthData_Fat";
import HealthData_ChartsTitle from "../component/HealthData_ChartsTitle";

describe("健康监护-体脂", function(){

    it("体脂(%)",function(){
        var wrapper = shallow(<HealthData_Fat
            datas={[{
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
                      }
                    ]}
        />);

        expect(wrapper.find(HealthData_ChartsTitle)).to.have.length(1);

        expect(wrapper.find(HealthData_ChartsTitle).get(0).props.value).to.equal("45");

    });

});