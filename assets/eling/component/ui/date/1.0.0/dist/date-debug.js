/**
 * @name date
 * @version 1.0.0
 * @description 日期
 * @dependencies []
 */
define("eling/component/ui/date/1.0.0/dist/date-debug", [ "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./date.tpl" ], function(require, exports, module) {
    require("jquery/jquery-plugins/datetimepicker/jquery.datetimepicker");
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var tpl = require("./date.tpl");
    var Date_1_0_0 = UIComponent.extend({
        attrs: {
            autoRender: true,
            template: tpl,
            //用来标识当前是否可以编辑
            curReadonly: false,
            curDisabled: false,
            model: {
                id: null,
                className: null,
                style: null,
                name: null,
                placeholder: null,
                readonly: false,
                disabled: false,
                mode: "YYYY-MM-DD",
                triggerType: "button"
            }
        },
        initCustAttr: function() {
            var model = this.get("model");
            if (model.triggerType == "button") {
                model.innerClassName = "btn btn-theme";
                //在按钮触发的时候，如果没有设置defaultDate,则用当前日期作为默认值
                model.defaultValue = model.defaultDate ? model.defaultDate : moment().format("YYYY-MM-DD");
            } else {
                model.innerClassName = "form-control";
            }
        },
        events: function() {
            var model = this.get("model");
            var results = {};
            var events = this.get("model").events;
            for (var i in events) {
                results[i + " #" + model.id] = events[i];
            }
            return results;
        },
        afterRender: function() {
            var that = this;
            var model = this.get("model");
            var mode = this._transMode(model.mode);
            //组织参数
            var params = $.extend(true, {
                closeOnDateSelect: true,
                onSelectDate: function(ct, $i) {
                    if (typeof model.handler === "function") {
                        var start = moment(ct).startOf("days").valueOf();
                        var end = moment(ct).endOf("days").valueOf();
                        model.handler(start, end);
                    }
                },
                lang: "zh",
                scrollInput: false,
                scrollMonth: false,
                defaultDate: false,
                defaultTime: false
            }, model);
            params.onShow = function() {
                if (that.get("curReadonly") || that.get("curDisabled")) {
                    return false;
                }
                if (tools.isFunction(model.onShow)) {
                    model.onShow();
                }
            };
            params.format = mode;
            params.datepicker = mode.indexOf("Y") != -1 ? true : false;
            params.timepicker = mode.indexOf("H") != -1 ? true : false;
            //设置默认日期
            if (params.defaultDate !== false) {
                this.setValue(params.defaultDate);
            }
            //设置默认时间
            if (params.defaultTime !== false) {
                this.setValue(params.defaultTime);
            }
            if (model.readonly) {
                this.setReadonly(true);
            }
            if (model.disabled) {
                this.setDisabled(true);
            }
            this.$("input").datetimepicker(params);
        },
        getValue: function() {
            var model = this.get("model");
            var mode = model.mode || "YYYY-MM-DD";
            var value = this.$("input").val();
            if (mode.indexOf("YYYY-MM-DD") != -1) {
                return value ? moment(value).valueOf() : "";
            } else {
                return value;
            }
        },
        setValue: function(value) {
            if (value === null || value === undefined || value === "") {
                this.$("input").val("");
                return false;
            }
            var result = null;
            var model = this.get("model");
            var mode = model.mode;
            if (mode == "HH:mm" && value !== null && value !== undefined && tools.isString(value)) {
                //传递进来的是一个HH:mm的字符串
                this.$("input").val(value);
                return false;
            } else if (mode == "HH:mm" && value !== null && value !== undefined) {
                //传递进来的是一个时间戳，这时只把小时和分钟部分format出来
                this.$("input").val(moment(value).format("HH:mm"));
                return false;
            } else if (mode == "HH:mm" && value !== null && value !== undefined) {
                return false;
            }
            if (tools.isString(value)) {
                //证明传入的是一个字符串
                result = value;
            } else if (tools.isDate(value)) {
                //证明传入的是一个Date类型的值
                result = moment(value).valueOf();
            } else if (typeof value === "number") {
                //证明传入的是毫秒数
                result = moment(value).valueOf();
            } else {
                //moment类型
                result = value.valueOf();
            }
            if (result < -1325491557e3) {
                result = result + 357e3;
            }
            this.$("input").val(moment(result).format(mode));
        },
        setReadonly: function(mark) {
            this.set("curReadonly", mark);
            if (mark) {
                this.$("input").attr("readonly", "readonly");
            } else {
                this.$("input").removeAttr("readonly");
            }
        },
        setDisabled: function(mark) {
            this.set("curDisabled", mark);
            if (mark) {
                this.$("input").attr("disabled", "disabled");
            } else {
                this.$("input").removeAttr("disabled");
            }
        },
        reset: function() {
            var model = this.get("model");
            if (model.defaultDate !== false) {
                //设置默认日期
                this.setValue(model.defaultDate);
            } else if (model.defaultTime !== false) {
                //设置默认时间
                this.setValue(model.defaultTime);
            } else {
                this.$("input").val("");
            }
            //如果设置了readonly
            if (model.readonly) {
                this.setReadonly(true);
            } else {
                this.setReadonly(false);
            }
            //如果设置了disabled
            if (model.disabled) {
                this.setDisabled(true);
            } else {
                this.setDisabled(false);
            }
        },
        getInstance: function() {
            return this.$("input");
        },
        destroy: function() {
            this.$("input").datetimepicker("destroy");
            Date_1_0_0.superclass.destroy.call(this, arguments);
        },
        _transMode: function(mode) {
            if (mode) {
                return mode.replace("YYYY", "Y").replace("MM", "m").replace("DD", "d").replace("HH", "H").replace("mm", "i");
            } else {
                return "Y-m-d";
            }
        }
    });
    module.exports = Date_1_0_0;
});

define("eling/component/ui/date/1.0.0/dist/date.tpl", [], '<div class="el-date {{this.className}}" style="{{this.style}}">\n	<input id="{{this.id}}" name="{{this.name}}" class="{{this.innerClassName}}" style={{this.innerStyle}} \n	type="{{this.triggerType}}" value="{{this.defaultValue}}" placeholder="{{this.placeholder}}" {{this.validate}}/>\n</div>');
