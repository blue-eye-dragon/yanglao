import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import Bill_Servicefee from "../component/Bill_ServicefeeList";
import Bill_ListItem from "../component/Bill_ListItem";
import Icon from "material-ui/lib/svg-icons/places/free-breakfast";

describe("账单信息-服务费列表", function(){

    var wrapper;
    beforeEach(function(){
        wrapper = mount(<Bill_Servicefee
            datas={[{
                key: 1,
                type: "servicefee",
                primaryText: "服务费",
                secondaryText: "￥657.00",
                status: "未缴清",
                statusColor: "#f56b47",
                icon: Icon,
                iconColor: "#f34541"
            },{
                key: 2,
                type: "servicefee",
                primaryText: "服务费",
                secondaryText: "￥656.00",
                status: "已缴清",
                statusColor: "#f56b47",
                icon: Icon,
                iconColor: "#f34541"
            }]}
        />);
    });

    it("数量正确",function(){
        expect(wrapper.find(Bill_ListItem).length).to.equal(2);
    });

});
