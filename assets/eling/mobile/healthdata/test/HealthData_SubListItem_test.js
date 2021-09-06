import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import HealthData_SubListItem from "../component/HealthData_SubListItem";


describe("健康监护-总览-列表项组件-子元素", function(){

    it("非空值",function(){
        var wrapper = mount(<HealthData_SubListItem label="血压" value="舒张压"/>);
        expect(wrapper.prop("label")).to.equal("血压");
        expect(wrapper.prop("value")).to.equal("舒张压");
    });

    it("空值",function(){
        var wrapper = mount(<HealthData_SubListItem />);
        expect(wrapper.prop("label")).to.equal("");
        expect(wrapper.prop("value")).to.equal("");
    });

});
