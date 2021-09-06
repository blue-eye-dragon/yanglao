import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import processGenefee from "../store/processGenefee";

describe("获取能源电信收费",function(){

    it("按状态分组",function(){
        var ret = processGenefee([
            {
                "pkGeneralFees": 1451,
                "memberSigning": {
                    "room": {
                        "number": "02-101",
                        "telnumber": "38256418"
                    }
                },
                "feeMonth": 1446336000000,
                "payer": "朱多丽",
                "generalFeesDetails": [
                    {
                        "pkGeneralFeesDetail": 14509,
                        "feeType": {
                            "number": 8,
                            "name": "宽带"
                        },
                        "fees": 80.0,
                        "payStatus": {
                            "key": "UnPaid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14505,
                        "feeType": {
                            "number": 9,
                            "name": "上月转入"
                        },
                        "fees": 0.132,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14501,
                        "feeType": {
                            "number": 4,
                            "name": "热水费"
                        },
                        "fees": 30.0,
                        "payStatus": {
                            "key": "UnPaid",
                            "value": "未缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14510,
                        "feeType": {
                            "number": 10,
                            "name": "本月转出"
                        },
                        "fees": 0.009,
                        "payStatus": {
                            "key": "UnPaid",
                            "value": "未缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14503,
                        "feeType": {
                            "number": 5,
                            "name": "净水费"
                        },
                        "fees": 0.0,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14508,
                        "feeType": {
                            "number": 7,
                            "name": "IPTV"
                        },
                        "fees": 49.0,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14502,
                        "feeType": {
                            "number": 1,
                            "name": "平时用电"
                        },
                        "fees": 82.678,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14506,
                        "feeType": {
                            "number": 2,
                            "name": "谷时用电"
                        },
                        "fees": 8.289,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14507,
                        "feeType": {
                            "number": 3,
                            "name": "自来水费"
                        },
                        "fees": 24.150000000000002,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14504,
                        "feeType": {
                            "number": 6,
                            "name": "电话费"
                        },
                        "fees": 62.76,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    }
                ]
            }
        ]);

        expect(ret.paid.length).to.equal(10);
        expect(ret.unpaid.length).to.equal(3);
    })

    it("排序",function(){
        var ret = processGenefee([
            {
                "pkGeneralFees": 1451,
                "memberSigning": {
                    "room": {
                        "number": "02-101",
                        "telnumber": "38256418"
                    }
                },
                "feeMonth": 1446336000000,
                "payer": "朱多丽",
                "generalFeesDetails": [
                    {
                        "pkGeneralFeesDetail": 14509,
                        "feeType": {
                            "number": 8,
                            "name": "宽带"
                        },
                        "fees": 80.0,
                        "payStatus": {
                            "key": "UnPaid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14505,
                        "feeType": {
                            "number": 9,
                            "name": "上月转入"
                        },
                        "fees": 0.132,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14501,
                        "feeType": {
                            "number": 4,
                            "name": "热水费"
                        },
                        "fees": 30.0,
                        "payStatus": {
                            "key": "UnPaid",
                            "value": "未缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14510,
                        "feeType": {
                            "number": 10,
                            "name": "本月转出"
                        },
                        "fees": 0.009,
                        "payStatus": {
                            "key": "UnPaid",
                            "value": "未缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14503,
                        "feeType": {
                            "number": 5,
                            "name": "净水费"
                        },
                        "fees": 0.0,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14508,
                        "feeType": {
                            "number": 7,
                            "name": "IPTV"
                        },
                        "fees": 49.0,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14502,
                        "feeType": {
                            "number": 1,
                            "name": "平时用电"
                        },
                        "fees": 82.678,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14506,
                        "feeType": {
                            "number": 2,
                            "name": "谷时用电"
                        },
                        "fees": 8.289,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14507,
                        "feeType": {
                            "number": 3,
                            "name": "自来水费"
                        },
                        "fees": 24.150000000000002,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    },
                    {
                        "pkGeneralFeesDetail": 14504,
                        "feeType": {
                            "number": 6,
                            "name": "电话费"
                        },
                        "fees": 62.76,
                        "payStatus": {
                            "key": "Paid",
                            "value": "缴清",
                            "props": null
                        },
                        "payType": {
                            "key": "Cash",
                            "value": "现金",
                            "props": null
                        },
                        "payDate": 1452042511000
                    }
                ]
            }
        ]);
        expect(ret.paid[1].primaryText).to.equal("谷时用电");
        expect(ret.unpaid[1].secondaryText).to.equal("￥80.00");
    })
});