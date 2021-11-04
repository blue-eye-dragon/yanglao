import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import Bill_Genefee from "../component/Bill_GenefeeList";
import Bill_ListItem from "../component/Bill_ListItem";

import PowerIcon from "material-ui/lib/svg-icons/notification/power";
import WaterIcon from "material-ui/lib/svg-icons/action/invert-colors";

describe("账单信息-能源电信收费列表", function(){

    it("数量正确",function(){
        var wrapper = mount(<Bill_Genefee
            datas={[{
                key: 1,
                type: "2",
                primaryText: "谷时用电",
                secondaryText: "￥657.00",
                status: "未缴清",
                statusColor: "",
                icon: PowerIcon,
                iconColor: "#f34541"
            },{
                key: 2,
                type: "4",
                primaryText: "热水费",
                secondaryText: "￥656.00",
                status: "已缴清",
                statusColor: "",
                icon: WaterIcon,
                iconColor: "#f34541"
            }]}
        />);

        expect(wrapper.find(Bill_ListItem).length).to.equal(2);
    });

});
