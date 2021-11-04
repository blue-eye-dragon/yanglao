import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Activity_PrimaryText from "../component/Activity_ListItem_PrimaryText"

describe("测试Activity_PrimaryText.js", () => {

    it('测试value属性', function () {
        expect(shallow(<Activity_PrimaryText value="张三"/>).text()).to.equal("张三");
    });
});