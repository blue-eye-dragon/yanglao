import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import Bill_ServicefeeDetail from "../component/Bill_ServicefeeDetail";

import Bill_PrimaryText from "../component/Bill_PrimaryText";
import Bill_SecondaryText from "../component/Bill_SecondaryText";
import Bill_DetailItem from "../component/Bill_DetailItem";
import PowerIcon from "material-ui/lib/svg-icons/places/free-breakfast";

describe("账单信息-服务费详情", function(){

    var wrapper;

    beforeEach(function(){
        wrapper = mount(<Bill_ServicefeeDetail
            data={{
                key: 1,
                type: "servicefee",
                primaryText: "服务费",
                secondaryText: "￥656.00",
                status: "已缴清",
                statusColor: "#d2d2d2",
                icon: PowerIcon,
                iconColor: "#f34541",
                dueAnnualFees: "￥656.00",
                beginDate: "2016-04-27",
                memberSigning: {
                    room: {
                        number: "02-201",
                        telnumber: "010-22223333"
                    }
                }
            }}
        />);
    });

    it("应收金额",function(){
        expect(wrapper.find(Bill_DetailItem).at(0).find("label").text()).to.equal("应收金额");
        expect(wrapper.find(Bill_DetailItem).at(0).find("span").text()).to.equal("￥656.00");
    });

    it("缴费日期",function(){
        expect(wrapper.find(Bill_DetailItem).at(1).find("label").text()).to.equal("缴费日期");
        expect(wrapper.find(Bill_DetailItem).at(1).find("span").text()).to.equal("2016-04-27");
    });

    it("房间号",function(){
        expect(wrapper.find(Bill_PrimaryText).at(0).text()).to.equal("房间号");
        expect(wrapper.find(Bill_SecondaryText).at(0).text()).to.equal("02-201");
    });

    it("联系电话",function(){
        expect(wrapper.find(Bill_PrimaryText).at(1).text()).to.equal("联系电话");
        expect(wrapper.find(Bill_SecondaryText).at(1).text()).to.equal("010-22223333");
    });

});
