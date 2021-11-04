import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import processServicefeeItem from "../store/processServicefeeItem";

describe("获取服务费的行数据",function(){

    it("测试key字段",function(){
        var ret = processServicefeeItem({
            pkAnnualFees: 1,
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        })
        expect(ret.key).to.equal(1);
    })

    it("测试type字段",function(){
        var ret = processServicefeeItem({
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        })
        expect(ret.type).to.equal("servicefee");
    })

    it("测试primaryText字段",function(){
        var ret = processServicefeeItem({
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        })
        expect(ret.primaryText).to.equal("服务费");
    })

    it("测试secondaryText字段",function(){
        var ret = processServicefeeItem({
            realAnnualFees: 656,
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        });
        expect(ret.secondaryText).to.equal("￥656.00");
    })

    it("测试status字段——未缴清",function(){
        var ret = processServicefeeItem({
            "chargeStatus": {
                "key": "UnCharge",
                "value": "未收费",
                "props": null
            }
        });
        expect(ret.status).to.equal("未缴清");
    })

    it("测试status字段——已缴清",function(){
        var ret = processServicefeeItem({
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        });
        expect(ret.status).to.equal("已缴清");
    })

    it("测试statusColor字段——已缴清",function(){
        var ret = processServicefeeItem({
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        });
        expect(ret.statusColor).to.equal("#d2d2d2");
    })

    it("测试statusColor字段——未缴清",function(){
        var ret = processServicefeeItem({
            "chargeStatus": {
                "key": "UnCharge",
                "value": "未收费",
                "props": null
            }
        });
        expect(ret.statusColor).to.equal("#f56b47");
    })

    it("测试dueAnnualFees字段",function(){
        var ret = processServicefeeItem({
            dueAnnualFees: 2508.1,
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        });
        expect(ret.dueAnnualFees).to.equal("￥2508.10");
    })

    it("测试beginDate字段——空值",function(){
        var ret = processServicefeeItem({
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        });
        expect(ret.beginDate).to.equal("-");
    })

    it("测试beginDate字段——非空值",function(){
        var ret = processServicefeeItem({
            beginDate: 1461925324054,
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        });
        expect(ret.beginDate).to.equal("2016-04-29");
    })

    it("测试memberSigning字段是否正确显示",function(){
        var ret = processServicefeeItem({
            "memberSigning": {
                "room": {
                    "number": "02-101",
                    "telnumber": "38256418"
                }
            },
            "chargeStatus": {
                "key": "Charge",
                "value": "已收费",
                "props": null
            }
        });
        expect(ret.memberSigning.room.number).to.equal("02-101");
        expect(ret.memberSigning.room.telnumber).to.equal("38256418");
    })

    it("综合测试",function(){
        var ret = processServicefeeItem({
            "pkAnnualFees": null,
            "memberSigning": {
                "pkMemberSigning": 243,
                "room": {
                    "number": "02-101",
                    "telnumber": "38256418"
                }
            },
            "beginDate": 1478793600000,
            "dueAnnualFees": 73800.0,
            "realAnnualFees": 73800.0,
            "chargeStatus": {
                "key": "UnCharge",
                "value": "未收费",
                "props": null
            }
        });

        expect(ret.key).to.equal(null);
        expect(ret.type).to.equal("servicefee");
        expect(ret.primaryText).to.equal("服务费");
        expect(ret.secondaryText).to.equal("￥73800.00");
        expect(ret.status).to.equal("未缴清");
        expect(ret.statusColor).to.equal("#f56b47");
        expect(ret.dueAnnualFees).to.equal("￥73800.00");
        expect(ret.beginDate).to.equal("2016-11-11");
        expect(ret.memberSigning.room.number).to.equal("02-101");
        expect(ret.memberSigning.room.telnumber).to.equal("38256418");
    })
});