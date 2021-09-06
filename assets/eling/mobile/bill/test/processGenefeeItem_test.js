import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import processGenefeeItem from "../store/processGenefeeItem";

describe("获取能源电信收费的行数据",function(){

    it("测试key字段",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "Paid",
                props: null,
                value: "缴清"
            }
        })
        expect(ret.key).to.equal(14504);
    })

    it("测试type字段",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "Paid",
                props: null,
                value: "缴清"
            }
        });
        expect(ret.type).to.equal(6);
    })

    it("测试primaryText字段",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "Paid",
                props: null,
                value: "缴清"
            }
        });
        expect(ret.primaryText).to.equal("电话费");
    })

    it("测试secondaryText字段",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "Paid",
                props: null,
                value: "缴清"
            },
            fees: 62.76
        });
        expect(ret.secondaryText).to.equal("￥62.76");
    })

    it("测试status字段——已缴清",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "Paid",
                props: null,
                value: "缴清"
            }
        });
        expect(ret.status).to.equal("已缴清");
    })

    it("测试status字段——未缴清",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "UnPaid",
                props: null,
                value: "未缴清"
            }
        });
        expect(ret.status).to.equal("未缴清");
    })

    it("测试statusColor字段——已缴清",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "Paid",
                props: null,
                value: "缴清"
            }
        });
        expect(ret.statusColor).to.equal("#d2d2d2");
    })

    it("测试statusColor字段——未缴清",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "UnPaid",
                props: null,
                value: "未缴清"
            }
        });
        expect(ret.statusColor).to.equal("#f56b47");
    })

    it("测试payDate字段——非空值",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payDate: 1452042511000,
            payStatus: {
                key: "UnPaid",
                props: null,
                value: "未缴清"
            }
        });
        expect(ret.payDate).to.equal("01-06");
    })

    it("测试payDate字段——空值",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "UnPaid",
                props: null,
                value: "未缴清"
            }
        });
        expect(ret.payDate).to.equal("-");
    })

    it("测试payType字段——非空值",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payType: {
                key: "Cash",
                props: null,
                value: "现金"
            },
            payStatus: {
                key: "UnPaid",
                props: null,
                value: "未缴清"
            }
        });
        expect(ret.payType).to.equal("现金");
    })

    it("测试payType字段——空值",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "UnPaid",
                props: null,
                value: "未缴清"
            }
        });
        expect(ret.payType).to.equal("-");
    })

    it("测试memberSigning字段是否正确显示",function(){
        var ret = processGenefeeItem({
            pkGeneralFeesDetail: 14504,
            feeType: {
                name: "电话费",
                number: 6
            },
            payStatus: {
                key: "UnPaid",
                props: null,
                value: "未缴清"
            }
        },{
            room: {
                number: "02-101",
                telnumber: "38256418"
            }
        });
        expect(ret.memberSigning.room.number).to.equal("02-101");
        expect(ret.memberSigning.room.telnumber).to.equal("38256418");
    })

    it("综合测试",function(){
        var ret = processGenefeeItem({
            feeType: {
                name: "自来水费",
                number: 3
            },
            fees: 99,
            payDate: null,
            payStatus: {
                key: "Paid",
                props: null,
                value: "缴清"
            },
            payType: {
                key: "Cash",
                props: null,
                value: "现金"
            },
            pkGeneralFeesDetail: 1
        },{
            room: {
                number: "02-103",
                telnumber: "38256411"
            }
        });

        expect(ret.key).to.equal(1);
        expect(ret.type).to.equal(3);
        expect(ret.primaryText).to.equal("自来水费");
        expect(ret.secondaryText).to.equal("￥99.00");
        expect(ret.status).to.equal("已缴清");
        expect(ret.statusColor).to.equal("#d2d2d2");
        expect(ret.payDate).to.equal("-");
        expect(ret.payType).to.equal("现金");
        expect(ret.memberSigning.room.number).to.equal("02-103");
        expect(ret.memberSigning.room.telnumber).to.equal("38256411");
    })
});