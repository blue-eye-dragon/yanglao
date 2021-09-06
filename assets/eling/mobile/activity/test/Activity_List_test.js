import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Activity_List from "../component/Activity_List"

describe("测试Activity_List.js", () => {

    it('测试datas属性', function () {
        var datas = [
            {
                "pkActivitysignup": 2356,
                "signup": {
                    "activity": {
                        "theme": "第十届中国国际养老及康复医疗博览会",
                        "activitySite": "上海新国际博览中心",
                        "type": "happiness",
                        "scope": {
                            "key": "Outer",
                            "value": "社区外",
                            "props": null
                        },
                        "members": [],
                        "activityStartTime": 1429767000000,
                        "activityEndTime": 1429776000000,
                        "interestGroups": [
                            {
                                "description": "其他"
                            }
                        ],
                        "status": null
                    }
                },
                "start": true
            },
            {
                "pkActivitysignup": 1276,
                "signup": {
                    "activity": {
                        "theme": "健康知识讲座",
                        "activitySite": "3号楼讲学堂",
                        "type": "health",
                        "scope": {
                            "key": "Inner",
                            "value": "社区内",
                            "props": null
                        },
                        "members": [],
                        "activityStartTime": 1423807200000,
                        "activityEndTime": 1423814400000,
                        "interestGroups": [
                            {
                                "description": "养生类"
                            }
                        ],
                        "status": null
                    }
                },
                "start": true
            },
            {
                "pkActivitysignup": 1023,
                "signup": {
                    "activity": {
                        "theme": "健康知识讲座",
                        "activitySite": "3号楼亲和讲学堂",
                        "type": "health",
                        "scope": {
                            "key": "Inner",
                            "value": "社区内",
                            "props": null
                        },
                        "members": [],
                        "activityStartTime": 1422943200000,
                        "activityEndTime": 1422950400000,
                        "interestGroups": [
                            {
                                "description": "养生类"
                            }
                        ],
                        "status": null
                    }
                },
                "start": true
            },
            {
                "pkActivitysignup": 1022,
                "signup": {
                    "activity": {
                        "theme": "徐中伟中医专家门诊",
                        "activitySite": "10号楼1层",
                        "type": "health",
                        "scope": {
                            "key": "Inner",
                            "value": "社区内",
                            "props": null
                        },
                        "members": [],
                        "activityStartTime": 1422837000000,
                        "activityEndTime": 1422860400000,
                        "interestGroups": [
                            {
                                "description": "养生类"
                            }
                        ],
                        "status": null
                    }
                },
                "start": true
            }
        ]
        expect(shallow(<Activity_List datas={datas}/>).childAt(0).children().length).to.equal(4);
    });
});