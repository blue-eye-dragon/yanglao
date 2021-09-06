import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import HealthData_HealthListItem from "../component/HealthData_HealthListItem";


describe("健康监护-总览-列表项组件", function(){

    it("正确显示值",function(){
        var wrapper = mount(<HealthData_HealthListItem
            ListItemdata = {{
                createDate:"2016-05-02",
                datas:[
                    {
                        createDate : "2016-05-02",
                        description : "收缩压:120,舒张压:60",
                        member:{pkMember:3497},
                        type:{
                            name:'血压',
                            name1:"收缩压",
                            name2:"舒张压"
                        },
                        value1:"120",
                        value2:"60"
                    },
                    {
                        createDate : "2016-05-02",
                        description : "血糖值(mmol/L):60",
                        member:{pkMember:3497},
                        type:{
                            name:'血糖(空腹)',
                            name1:"血糖值(mmol/L)"
                        },
                        value1:"10"
                    }
                ]
            }}
            />);

        expect(wrapper.find("HealthData_SubListItem")).to.have.length(6);
        expect(wrapper.find(".item-sub-title").text()).to.equal("05-02");
        expect(wrapper.find("HealthData_SubListItem").get(0).props.label).to.equal("血压");
        expect(wrapper.find("HealthData_SubListItem").get(1).props.label).to.equal("血糖值(mmol/L)");

    });

});
