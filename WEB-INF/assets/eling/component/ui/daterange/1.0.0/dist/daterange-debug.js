/**
 * @name buttongroup
 * @version 1.0.0
 * @description 按钮组
 * @dependencies []
 */
/**
 * daterange统一不显示自定义按钮，选择时直接打开自定义日历框。
 * 由于boorstrap-datetimerange没有提供对应的参数，所以直接修改了boorstrap-datetimerange文件（371行）
 */
define("eling/component/ui/daterange/1.0.0/dist/daterange-debug", [ "bootstrap/bootstrap-plugins/daterangepicker/daterangepicker", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./daterange.tpl", "./daterange.css" ], function(require, exports, module) {
    require("bootstrap/bootstrap-plugins/daterangepicker/daterangepicker");
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var tpl = require("./daterange.tpl");
    require("./daterange.css");
    var Daterange_1_0_0 = UIComponent.extend({
        attrs: {
            autoRender: true,
            template: tpl,
            model: {
                isinput: false,
                readonly: false,
                disabled: false,
                defaultRange: "本月"
            }
        },
        events: function() {
            var that = this;
            var model = this.get("model");
            if (model.isinput) {
                return null;
            } else {
                return {
                    "mouseover .J-daterange": function(e) {
                        $(e.currentTarget).next().css({
                            display: "block"
                        });
                        return false;
                    },
                    "mouseout .J-daterange": function(e) {
                        $(e.currentTarget).next().css({
                            display: "none"
                        });
                        return false;
                    }
                };
            }
        },
        initCustAttr: function() {
            var model = this.get("model");
            //对外统一提供参数triggerType，用来决定是按钮形式还是表单形式
            var triggerType = model.triggerType;
            if (triggerType === "form") {
                model.isinput = true;
                model.innerStyle = "cursor:pointer;";
            }
            var ranges = model.ranges;
            if (!ranges) {
                ranges = model.ranges = {
                    "今天": [ moment().startOf("days"), moment().endOf("days") ],
                    "昨天": [ moment().subtract(1, "days").startOf("days"), moment().subtract(1, "days").endOf("days") ],
                    "本月": [ moment().startOf("month"), moment().endOf("month") ]
                };
            }
            if (tools.isFunction(ranges)) {
                ranges = model.ranges = ranges();
            }
            //设置开始时间和结束时间
            var startDate, endDate;
            var defaultRange = model.defaultValue || model.defaultRange;
            if (tools.isString(defaultRange)) {
                //配置的是ranges中的key
                var time = ranges[defaultRange];
                if (time) {
                    startDate = time[0];
                    endDate = time[1];
                } else {
                    startDate = moment().startOf("month");
                    endDate = moment().endOf("month");
                }
            } else if (tools.isArray(defaultRange)) {
                //配置的是ranges是数组（数组中的元素是moment对象）
                startDate = defaultRange[0];
                endDate = defaultRange[1];
            } else {
                startDate = moment().startOf("month");
                endDate = moment().endOf("month");
            }
            model.startDate = model.startDate || startDate;
            model.endDate = model.endDate || endDate;
        },
        afterRender: function() {
            var model = this.get("model");
            var $el = this.$(".J-daterange");
            var dp = $el.daterangepicker({
                format: model.format || "YYYY.MM.DD",
                ranges: model.ranges,
                startView: 3,
                showDropdowns: true,
                minDate: model.minDate,
                maxDate: model.maxDate,
                singleDatePicker: model.singleDatePicker,
                separator: "-",
                locale: {
                    applyLabel: "确定",
                    cancelLabel: "取消",
                    fromLabel: "从",
                    toLabel: "到",
                    daysOfWeek: [ "日", "一", "二", "三", "四", "五", "六" ],
                    monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
                    firstDay: 1
                },
                startDate: model.startDate.format(model.format || "YYYY.MM.DD"),
                endDate: model.endDate.format(model.format || "YYYY.MM.DD"),
                opens: "left",
                buttonClasses: [ "btn", "btn-sm" ]
            }, function(start, end) {
                var startTime = start.format(model.format || "YYYY.MM.DD");
                var endTime = end.format(model.format || "YYYY.MM.DD");
                //判断控件类型
                if (model.isinput) {
                    $el.find(".J-daterange").val(startTime + "-" + endTime);
                } else {
                    if (startTime == endTime) {
                        $el.find("span").html(startTime);
                    } else {
                        $el.find("span").html(startTime + "-" + endTime);
                    }
                }
                if (typeof model.handler === "function") {
                    model.handler({
                        start: start.valueOf(),
                        end: end.valueOf()
                    });
                }
            });
            //直接打开
            dp.on("show.daterangepicker", function() {
                dp.data("daterangepicker").showCalendars();
            });
            if (!model.title) {
                //设置初始值
                if (model.isinput) {
                    $el.find(".J-daterange").val(model.startDate.format(model.format || "YYYY.MM.DD") + "-" + model.endDate.format(model.format || "YYYY.MM.DD"));
                } else {
                    if (model.startDate.format(model.format || "YYYY.MM.DD") == model.endDate.format(model.format || "YYYY.MM.DD")) {
                        this.$(".J-daterange span").html(model.startDate.format(model.format || "YYYY.MM.DD"));
                    } else {
                        this.$(".J-daterange span").html(model.startDate.format(model.format || "YYYY.MM.DD") + "-" + model.endDate.format(model.format || "YYYY.MM.DD"));
                    }
                }
            }
            if (model.readonly) {
                this.setReadonly(true);
            }
            if (model.disabled) {
                this.setDisabled(true);
            }
        },
        _transValue2Text: function(value) {
            var model = this.get("model");
            if (tools.isString(value)) {
                //证明传入的是一个字符串
                return value;
            } else if (tools.isDate(value)) {
                //证明传入的是一个Date类型的值
                return moment(value).format(model.format || "YYYY.MM.DD");
            } else if (typeof value === "number") {
                //证明传入的是毫秒数
                return moment(value).format(model.format || "YYYY.MM.DD");
            } else if (tools.isObject(value) && value.start) {
                //证明传入的是一个对象{start:xxx,end:xxx}
                return this._transValue2Text(value.start) + "-" + this._transValue2Text(value.end);
            } else {
                //moment类型
                return value.format(model.format || "YYYY.MM.DD");
            }
        },
        getValue: function() {
            var model = this.get("model");
            var time = "";
            if (model.isinput) {
                time = this.$(".J-daterange").val();
            } else {
                time = this.$(".J-daterange span").text();
            }
            var temp = time.split("-");
            //兼容firefox
            for (var i in temp) {
                temp[i] = temp[i].replace(/\./g, "-");
                temp[i] = $.trim(temp[i]);
            }
            return {
                start: moment(temp[0]).startOf("days").valueOf(),
                end: temp.length == 2 ? moment(temp[1]).endOf("days").valueOf() : moment(temp[0]).endOf("days").valueOf()
            };
        },
        setValue: function(value) {
            var model = this.get("model");
            if (model.isinput) {
                this.$(".J-daterange").val(this._transValue2Text(value));
            } else {
                this.$(".J-daterange span").text(this._transValue2Text(value));
            }
        },
        getText: function() {
            var model = this.get("model");
            if (model.isinput) {
                return this.$(".J-daterange").val();
            } else {
                return this.$(".J-daterange span").text();
            }
        },
        setText: function(text) {
            //TODO:同步更新组件的值
            var model = this.get("model");
            if (model.isinput) {
                this.$(".J-daterange").val(text);
            } else {
                this.$(".J-daterange span").text(text);
            }
        },
        reset: function() {
            var model = this.get("model");
            if (model.isinput) {
                this.$(".J-daterange").val("");
                this.setReadonly(model.readonly);
                this.setDisabled(model.disabled);
            }
        },
        setDisabled: function(mark) {
            var $el = this.element;
            if (mark) {
                $el.find(".J-daterange").attr("disabled", "disabled");
            } else {
                $el.find(".J-daterange").removeAttr("disabled");
            }
        },
        setReadonly: function(mark) {
            this.$(".J-daterange").data().daterangepicker.isShowing = mark;
        },
        destroy: function() {
            this.$(".J-daterange").daterangepicker("remove");
            Daterange_1_0_0.superclass.destroy.call(this, arguments);
        },
        getInstance: function() {
            return this.$(".J-daterange").data();
        }
    });
    module.exports = Daterange_1_0_0;
});

define("eling/component/ui/daterange/1.0.0/dist/daterange.tpl", [], '{{#if this.isinput}}\n\n<div class="el-daterange-1 {{this.className}}" style="{{this.style}}">\n\n	<input id="{{this.id}}" name="{{this.name}}" class="form-control J-daterange {{this.innerClassName}}" style="{{this.innerStyle}}" \n		placeholder="{{this.placeholder}}" {{this.validate}} readonly="readonly"/>\n	\n</div>\n\n{{else}}\n\n<div class="el-daterange-1 {{this.className}}">\n	<a class="btn btn-theme dropdown-toggle J-daterange" href="javascript:void(0);">\n		<span>{{this.title}}</span>\n		<b class=\'caret\'></b>\n	</a>\n	{{#if this.tip}}\n	<div class="tip">{{this.tip}}</div>\n	{{/if}}\n</div>\n\n{{/if}}');

define("eling/component/ui/daterange/1.0.0/dist/daterange.css", [], function() {
    seajs.importStyle(".el-daterange-1 .btn{color:#fff!important}.el-daterange-1 .caret{border-top-color:#fff}.el-daterange-1 .tip{display:none;position:absolute;white-space:nowrap;top:100%;left:20px;z-index:1000;float:left;padding:5px;margin:2px 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175)}");
});
