import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Activity_SubHeader from "../component/Activity_SubHeader"

describe("测试Activity_SubHeader.js", () => {

    it('测试初始状态', function () {
        expect(shallow(<Activity_SubHeader/>).childAt(1).text()).to.equal("（）");
    });

    it('测试length属性', function () {
        expect(shallow(<Activity_SubHeader length={4}/>).childAt(1).text()).to.equal("（4）");
    });
});