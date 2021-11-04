import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Bill_PrimaryText from "../component/Bill_PrimaryText";

describe("账单信息-列表项主文字", function(){

    describe('正确显示值', function () {

        it("空值",function(){
            var wrapper = shallow(<Bill_PrimaryText/>);
            expect(wrapper.text()).to.equal("");
        });

        it("非空值",function(){
            var wrapper = shallow(<Bill_PrimaryText value="张三丰"/>);
            expect(wrapper.text()).to.equal("张三丰");
        });

    });

});
