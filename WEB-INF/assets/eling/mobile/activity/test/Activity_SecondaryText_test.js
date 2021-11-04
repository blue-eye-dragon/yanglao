import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Activity_SecondaryText from "../component/Activity_ListItem_SecondaryText"

describe("测试Activity_SecondaryText.js", () => {

    it('测试value属性', function () {
        expect(shallow(<Activity_SecondaryText value="张三"/>).text()).to.equal("张三");
    });
});