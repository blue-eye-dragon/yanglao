import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import Bill_GeneralfeeDetail from "../component/Bill_GeneralfeeDetail";

import Bill_PrimaryText from "../component/Bill_PrimaryText";
import Bill_SecondaryText from "../component/Bill_SecondaryText";
import Bill_DetailItem from "../component/Bill_DetailItem";
import FlatButton from 'material-ui/lib/flat-button';
import PowerIcon from "material-ui/lib/svg-icons/notification/power";

describe("账单信息-能源电信收费详情", function(){

    var wrapper;

    beforeEach(function(){
        wrapper = mount(<Bill_GeneralfeeDetail
            data={{
                key: 1,
                type: "5",
                primaryText: "平时用电",
                secondaryText: "￥82.68",
                status: "已缴清",
                statusColor: "#d2d2d2",
                icon: PowerIcon,
                iconColor: "#00acec",
                payDate: "04-27",
                payType: "现金",
                memberSigning: {
                    room: {
                        number: "02-201",
                        telnumber: "010-22223333"
                    }
                }
            }}
        />);
    });

    it("缴费金额",function(){
        expect(wrapper.find(Bill_DetailItem).at(0).find("label").text()).to.equal("缴费金额");
        expect(wrapper.find(Bill_DetailItem).at(0).find("span").text()).to.equal("￥82.68");
    });

    it("缴费时间",function(){
        expect(wrapper.find(Bill_DetailItem).at(1).find("label").text()).to.equal("缴费时间");
        expect(wrapper.find(Bill_DetailItem).at(1).find("span").text()).to.equal("04-27");
    });

    it("房间号",function(){
        expect(wrapper.find(Bill_PrimaryText).at(0).text()).to.equal("房间号");
        expect(wrapper.find(Bill_SecondaryText).at(0).text()).to.equal("02-201");
    });

    it("联系电话",function(){
        expect(wrapper.find(Bill_PrimaryText).at(1).text()).to.equal("联系电话");
        expect(wrapper.find(Bill_SecondaryText).at(1).text()).to.equal("010-22223333");
    });

    it("付款方式",function(){
        expect(wrapper.find(Bill_PrimaryText).at(2).text()).to.equal("付款方式");
        expect(wrapper.find(Bill_SecondaryText).at(2).text()).to.equal("现金");
        expect(wrapper.find(FlatButton).text()).to.equal("已缴清");
    });

});
