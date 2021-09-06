import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import processServicefee from "../store/processServicefee";

describe("获取服务费",function(){

    it("按状态分组",function(){
        var ret = processServicefee([{
            "chargeStatus": {
                "key": "UnCharge",
                "value": "未收费",
                "props": null
            }
        }]);

        expect(ret.paid.length).to.equal(1);
        expect(ret.unpaid.length).to.equal(1);
    })

    it("按状态分组",function(){
        var ret = processServicefee([{
            "pkAnnualFees": 1,
            "chargeStatus": {
                "key": "UnCharge",
                "value": "未收费",
                "props": null
            }
        },{
            "pkAnnualFees": 2,
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        }]);

        expect(ret.paid[1].key).to.equal(2);
        expect(ret.unpaid[0].key).to.equal(1);
    })
});