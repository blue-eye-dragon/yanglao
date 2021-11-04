import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Bill_SecondaryText from "../component/Bill_SecondaryText";

describe("账单信息-列表项二级文字", function(){

    describe('正确显示值', function () {

        it("空值",function(){
            var wrapper = shallow(<Bill_SecondaryText/>);
            expect(wrapper.text()).to.equal("");
        });

        it("非空值",function(){
            var wrapper = shallow(<Bill_SecondaryText value="图基金"/>);
            expect(wrapper.text()).to.equal("图基金");
        });

    });

});
