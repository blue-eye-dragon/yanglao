import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import Activity_CardItem from "../component/Activity_Detail"

describe("Activity_Detail", () => {

    it('是否正确显示结果', function (){
        var data = {
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
                    "members": [{
                            personalInfo: {
                                name: "张三"
                            }
                        },{
                            personalInfo: {
                                name: "李四"
                            }
                        }
                    ],
                    "activityStartTime": 1429767000000,
                    "activityEndTime": 1429776000000,
                    "interestGroups": [{
                            "description": "其他1"
                        },{
                            "description": "其他2"
                        },{
                            "description": "其他3"
                        },{
                            "description": "其他4"
                        },{
                            "description": "其他5"
                        }
                    ],
                    "status": null
                }
            },
            "start": true
        };

        var wrapper = mount(<Activity_CardItem data={data}/>);

        expect(wrapper.childAt(1).childAt(0).find("span").text()).to.equal("上海新国际博览中心");
        expect(wrapper.childAt(1).childAt(1).find("span").text()).to.equal("2015-04-23 13:30");
        expect(wrapper.childAt(1).childAt(2).find("span").text()).to.equal("2015-04-23 16:00");
        expect(wrapper.childAt(1).childAt(3).find("span").text()).to.equal("其他1 其他2 其他3 其他4 其他5");
        expect(wrapper.childAt(1).childAt(4).find("span").text()).to.equal("社区外");
        expect(wrapper.childAt(1).childAt(5).find("span").text()).to.equal("张三 李四");
    });
});