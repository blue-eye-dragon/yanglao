import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Bill_DetailItem from "../component/Bill_DetailItem";

describe("账单信息-详情项", function(){

    it("正确显示label和value",function(){
        var wrapper = shallow(<Bill_DetailItem label={"姓名"} value={"张三"}/>);
        expect(wrapper.find("label").text()).to.equal("姓名");
        expect(wrapper.find("span").text()).to.equal("张三");
    });

});
