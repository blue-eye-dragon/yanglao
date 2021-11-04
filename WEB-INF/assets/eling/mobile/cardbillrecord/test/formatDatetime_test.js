import {expect} from 'chai';

import formatDatetime from "../store/formatDatetime";

describe("测试formatDatetime方法", () => {

    it('formatDatetime', function () {
        var date = new Date("2015-01-02 16:47").getTime();
        var ret = formatDatetime(date);
        expect(ret).to.equal("2015-01-02 16:47");
    });
});