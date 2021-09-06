import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import Bill_StatusTab from "../component/Bill_StatusTab";

import Tab from 'material-ui/lib/tabs/tab';
import Bill_Genefee from "../component/Bill_GenefeeList";
import Bill_Servicefee from "../component/Bill_ServicefeeList";
import Bill_ListItem from "../component/Bill_ListItem";

import Icon from "material-ui/lib/svg-icons/places/free-breakfast";

describe("账单信息-状态页签", function(){

    var wrapper;
    beforeEach(function(){
        wrapper = mount(<Bill_StatusTab
            serviceFees={{
                paid: [{
                    key: 2,
                    type: "servicefee",
                    primaryText: "服务费",
                    secondaryText: "￥656.00",
                    status: "已缴清",
                    statusColor: "#f56b47",
                    icon: Icon,
                    iconColor: "#f34541"
                }],
                unpaid: []
            }}
            geneFees={{
                paid: [{
                    key: 1,
                    type: "2",
                    primaryText: "谷时用电",
                    secondaryText: "￥657.00",
                    status: "已缴清",
                    statusColor: "#f56b47",
                    icon: Icon,
                    iconColor: "#f34541"
                },{
                    key: 2,
                    type: "4",
                    primaryText: "热水费",
                    secondaryText: "￥656.00",
                    status: "已缴清",
                    statusColor: "#f56b47",
                    icon: Icon,
                    iconColor: "#f34541"
                }],
                unpaid: [{
                    key: 1,
                    type: "2",
                    primaryText: "谷时用电",
                    secondaryText: "￥657.00",
                    status: "未缴清",
                    statusColor: "#f56b47",
                    icon: Icon,
                    iconColor: "#f34541"
                }]
            }}/>
        );
    })

    it("页签信息正确",function(){
        expect(wrapper.find(Tab).at(0).find("button").text()).to.equal("全部");
        expect(wrapper.find(Tab).at(1).find("button").text()).to.equal("未缴清");
    });

    it("页签下内容正确",function(){
        expect(wrapper.find(Bill_Servicefee).at(0).find(Bill_ListItem).length).to.equal(1);
        expect(wrapper.find(Bill_Genefee).at(0).find(Bill_ListItem).length).to.equal(2);

        expect(wrapper.find(Bill_Servicefee).at(1).find(Bill_ListItem).length).to.equal(0);
        expect(wrapper.find(Bill_Genefee).at(1).find(Bill_ListItem).length).to.equal(1);
    });

});
