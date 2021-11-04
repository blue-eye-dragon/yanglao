(function(__karma__, seajs) {

    var tests = [
        "health/healthDailyRecord/component/healthdailyrecord_healthdata_form/test/test"
        // ,
        // "eling/elcms/health/healthDailyRecord/component/healthdailyrecord_healthdata_grid/test/test",
        // "eling/elcms/health/healthDailyRecord/component/healthdailyrecord_tab/test/test"
    ];

    var __start = __karma__.start;

    __karma__.start = function() {

        seajs.config({
            "base":""
        })

        seajs.use(tests, function() {
            __start.call(); //要在seajs模块载入后调用,否则会加载不到任何测试用例
        });
    };

})(window.__karma__, window.seajs);