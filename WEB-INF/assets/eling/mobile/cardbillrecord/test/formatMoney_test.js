import {expect} from 'chai';

import formatMoney from "../store/formatMoney";

describe("formatMoney(money,scale)", function(){
    it('无参数', function () {
        var ret = formatMoney();
        expect(ret).to.equal("-");
    });

    it('一个参数', function () {
        var ret = formatMoney(156);
        expect(ret).to.equal("￥156.00");

        var ret = formatMoney("156.3663");
        expect(ret).to.equal("￥156.37");

        var ret = formatMoney(0);
        expect(ret).to.equal("￥0.00");
    });

    it('两个参数', function () {
        var ret = formatMoney(37.678,4);
        expect(ret).to.equal("￥37.6780");
    })
});
