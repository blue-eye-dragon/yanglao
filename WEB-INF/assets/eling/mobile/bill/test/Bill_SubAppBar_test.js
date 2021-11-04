import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import moment from "moment";

import Bill_SubAppBar from "../component/Bill_SubAppBar";

function onDateChange(){};

describe("账单信息-时间范围", function(){

    describe('初始化时', function () {

        it("中间区域显示当前月份",function(){
            var wrapper = shallow(<Bill_SubAppBar onDateChange={onDateChange}/>);
            expect(wrapper.childAt(1).text()).to.equal(moment().format("YYYY-MM"));
        });

    });

    describe('切换时间', function () {

        it("左箭头点击一次",function(){

            var wrapper = shallow(<Bill_SubAppBar onDateChange={onDateChange}/>);

            const leftClickArrow = wrapper.childAt(0);

            leftClickArrow.simulate("touchTap");

            expect(wrapper.childAt(1).text()).to.equal(moment().subtract(1,"month").format("YYYY-MM"));

        });

        it("左箭头点击两次，右箭头点击三次",function(){
            var wrapper = shallow(<Bill_SubAppBar onDateChange={onDateChange}/>);

            const leftClickArrow = wrapper.childAt(0);
            const rightClickArrow = wrapper.childAt(2);

            leftClickArrow.simulate("touchTap");
            leftClickArrow.simulate("touchTap");
            rightClickArrow.simulate("touchTap");
            rightClickArrow.simulate("touchTap");
            rightClickArrow.simulate("touchTap");

            expect(wrapper.childAt(1).text()).to.equal(moment().format("YYYY-MM"));
        });


        it("右箭头点击一次",function(){
            var wrapper = shallow(<Bill_SubAppBar onDateChange={onDateChange}/>);

            const rightClickArrow = wrapper.childAt(2);

            rightClickArrow.simulate("touchTap");

            expect(wrapper.childAt(1).text()).to.equal(moment().format("YYYY-MM"));
        });

        it("左箭头点击四次，右箭头点击一次",function(){
            var wrapper = shallow(<Bill_SubAppBar onDateChange={onDateChange}/>);

            const leftClickArrow = wrapper.childAt(0);
            const rightClickArrow = wrapper.childAt(2);

            leftClickArrow.simulate("touchTap");
            leftClickArrow.simulate("touchTap");
            leftClickArrow.simulate("touchTap");
            leftClickArrow.simulate("touchTap");
            rightClickArrow.simulate("touchTap");

            expect(wrapper.childAt(1).text()).to.equal(moment().subtract(3,"month").format("YYYY-MM"));
        });

    });
});
