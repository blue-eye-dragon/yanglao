import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import Bill_ListItem from "../component/Bill_ListItem";
import Bill_PrimaryText from "../component/Bill_PrimaryText";
import Bill_SecondaryText from "../component/Bill_SecondaryText";
import FlatButton from 'material-ui/lib/flat-button';

import PowerIcon from "material-ui/lib/svg-icons/notification/power";

describe("账单信息-列表项", function(){

    it("正确显示值",function(){
        var wrapper = mount(<Bill_ListItem
            data={{
                key: 1,
                primaryText: "服务费",
                secondaryText: "￥656.00",
                status: "已缴清",
                statusColor: "#f56b47",
                icon: PowerIcon,
                iconColor: "#f34541"
            }}
        />);

        expect(wrapper.find(PowerIcon).prop("style").background).to.equal("#f34541");
        expect(wrapper.find(FlatButton).text()).to.equal("已缴清");
    });

});
