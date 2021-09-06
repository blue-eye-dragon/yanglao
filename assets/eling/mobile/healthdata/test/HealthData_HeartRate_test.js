/**
 * Created by xuechao on 2016/5/6.
 */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import HealthData_HeartRate from "../component/HealthData_HeartRate";
import HealthData_ChartsTitle from "../component/HealthData_ChartsTitle";

describe("健康监护-心率", function(){

    it("心率(次/分)",function(){
        var wrapper = shallow(<HealthData_HeartRate
            datas={[
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
  }
]}
        />);

        expect(wrapper.find(HealthData_ChartsTitle)).to.have.length(1);

        expect(wrapper.find(HealthData_ChartsTitle).get(0).props.value).to.equal("70");

    });

});