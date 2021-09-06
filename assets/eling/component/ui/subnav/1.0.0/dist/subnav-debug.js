define("eling/component/ui/subnav/1.0.0/dist/subnav-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/ajaxwrapper", "dialog", "store", "gallery/handlebars/2.0.0/handlebars-seajs", "./subnav.css", "gallery/store/1.3.14/store-seajs", "json", "./plugins/button", "eling/component/utils/fullscreen/fullscreen", "./plugins/buttongroup", "./plugins/buttongroup.tpl", "./plugins/buttongroup_member.tpl", "./plugins/time", "bootstrap/bootstrap-plugins/daterangepicker/daterangepicker", "./plugins/search", "./plugins/date", "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker", "./subnav.tpl" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var aw = require("eling/component/utils/ajaxwrapper");
    var HandlerBars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    require("./subnav.css");
    var store = require("gallery/store/1.3.14/store-seajs");
    //plugins
    var Button = require("./plugins/button");
    var Buttongroup = require("./plugins/buttongroup");
    var Time = require("./plugins/time");
    var Search = require("./plugins/search");
    var DateTime = require("./plugins/date");
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var plugin = {
        button: Button,
        buttongroup: Buttongroup,
        time: Time,
        date: DateTime,
        search: Search
    };
    handlebars.registerHelper("subnav", function(context, option) {
        var item = context;
        var ret = "";
        var type = item.type || "text";
        if (item.format) {
            ret += item.format();
        } else {
            ret += plugin[type].getTemplate(item);
        }
        return ret;
    });
    var Subnav = UIComponent.extend({
        attrs: {
            template: require("./subnav.tpl"),
            autoRender: true
        },
        initCustAttr: function() {
            var that = this;
            var model = this.get("model");
            //设置主题
            var items = model.items || this.transConfig(model);
            for (var i = 0; i < items.length; i++) {
                var type = items[i].type;
                if (typeof plugin[items[i].type]._initCustAttr === "function") {
                    items[i] = plugin[type]._initCustAttr(items[i], model);
                }
                items[i].type = type;
            }
            model.items = items;
        },
        events: function() {
            var that = this;
            var events = {};
            var model = this.get("model");
            var items = model.items || [];
            for (var i = 0; i < items.length; i++) {
                if (typeof plugin[items[i].type].events === "function") {
                    events = $.extend(true, events, plugin[items[i].type].events(items[i], that));
                }
            }
            return events;
        },
        afterRender: function() {
            var model = this.get("model");
            var items = model.items || [];
            for (var i = 0; i < items.length; i++) {
                if (typeof plugin[items[i].type].initPlugins === "function") {
                    plugin[items[i].type].initPlugins(items[i], model);
                }
            }
        },
        transConfig: function(model) {
            var items = [];
            //按照search，buttongroup，button，time的顺序来显示参数，如果想打乱这个顺序，请使用items参数配置
            if (model.search) {
                items.push({
                    id: "search",
                    type: "search",
                    handler: model.search.handler || model.search,
                    placeholder: model.search.placeholder
                });
            }
            if (model.buttonGroup) {
                var buttonGroups = model.buttonGroup;
                for (var bp = 0; bp < buttonGroups.length; bp++) {
                    buttonGroups[bp].type = "buttongroup";
                    items.push(buttonGroups[bp]);
                }
            }
            if (model.date) {
                var date = model.date;
                date.handler = date.click;
                date.id = "date";
                date.type = "date";
                var item = {};
                items.push(date);
            }
            if (model.time) {
                var time = model.time;
                time.handler = time.click;
                time.id = "time";
                time.type = "time";
                var item = {};
                items.push(time);
            }
            if (model.buttons) {
                var buttons = model.buttons;
                for (var b = 0; b < buttons.length; b++) {
                    buttons[b].type = "button";
                    items.push(buttons[b]);
                }
            }
            return items;
        },
        setTitle: function(title) {
            this.$(".J-subnav-title").text(title);
        },
        getTitle: function() {
            return $(".J-subnav-title").text();
        },
        getItemConfig: function(keyOrIndex) {
            var model = this.get("model") || {};
            var items = model.items || [];
            if (typeof keyOrIndex === "string") {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id == keyOrIndex) {
                        return items[i];
                    }
                }
            } else {
                //传递的是索引
                return items[keyOrIndex];
            }
        },
        hide: function(keyOrIndex) {
            if (keyOrIndex.constructor === String) {
                keyOrIndex = [ keyOrIndex ];
            }
            for (var i = 0; i < keyOrIndex.length; i++) {
                var item = this.getItemConfig(keyOrIndex[i]);
                this.$(".J-subnav-" + item.type + "-" + item.id).addClass("hidden");
            }
            return this;
        },
        show: function(keyOrIndex) {
            if (keyOrIndex.constructor === String) {
                keyOrIndex = [ keyOrIndex ];
            }
            for (var i = 0; i < keyOrIndex.length; i++) {
                var item = this.getItemConfig(keyOrIndex[i]);
                this.$(".J-subnav-" + item.type + "-" + item.id).removeClass("hidden");
            }
            return this;
        },
        getValue: function(keyOrIndex) {
            var model = this.get("model");
            var item = this.getItemConfig(keyOrIndex);
            return plugin[item.type].getValue(item, model);
        },
        setValue: function(keyOrIndex, data) {
            var model = this.get("model");
            var item = this.getItemConfig(keyOrIndex);
            plugin[item.type].setValue(item, model, data);
        },
        getText: function(keyOrIndex) {
            var model = this.get("model");
            var item = this.getItemConfig(keyOrIndex);
            return plugin[item.type].getText(item, model);
        },
        setData: function(keyOrIndex, data) {
            var model = this.get("model");
            var item = this.getItemConfig(keyOrIndex);
            var type = item.type;
            plugin[type].setData(item, model, data);
        },
        getData: function(keyOrIndex, subIndex) {
            var model = this.get("model");
            var item = this.getItemConfig(keyOrIndex);
            var type = item.type;
            return plugin[type].getData(item, model, {
                subIndex: subIndex
            });
        },
        load: function(options) {
            var model = this.get("model");
            var item = this.getItemConfig(options.id);
            var type = item.type;
            plugin[type].load(item, model, options);
        },
        loading: function(keyOrIndex) {
            var model = this.get("model");
            var item = this.getItemConfig(keyOrIndex);
            var type = item.type;
            return plugin[type].loading(item, model);
        },
        destroy: function() {
            var model = this.get("model") || {};
            var items = model.items || [];
            for (var i = 0; i < items.length; i++) {
                var type = items[i].type || "text";
                if (typeof plugin[type].destroy === "function") {
                    plugin[type].destroy(items[i], model);
                }
            }
            Subnav.superclass.destroy.call(this, arguments);
        }
    });
    module.exports = Subnav;
});

define("eling/component/ui/subnav/1.0.0/dist/subnav.css", [], function() {
    seajs.importStyle(".el-subnav-1 .el-page-header{margin:0 0 5px;overflow:inherit}.el-subnav-1 .el-pull-right{margin-right:6%}.el-subnav-1 .btn-group button{color:#fff}.el-subnav-1 .btn-group button span{border-top-color:#fff}.el-subnav-1 .ex-btn-group a b{border-top-color:#fff;margin-left:10px}.el-subnav-1 .ex-btn-group .tip{display:none;position:absolute;white-space:nowrap;top:100%;left:20px;z-index:1000;float:left;padding:5px;margin:2px 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175)}.el-subnav-1 .dropdown-menu li a{margin-right:30px}");
});

define("eling/component/ui/subnav/1.0.0/dist/plugins/button", [ "eling/component/utils/fullscreen/fullscreen", "gallery/store/1.3.14/store-seajs", "json" ], function(require, exports, module) {
    var fullscreen = require("eling/component/utils/fullscreen/fullscreen");
    var store = require("gallery/store/1.3.14/store-seajs");
    var format = {
        fullscreen: function(param) {
            return {
                id: "fullscreen",
                text: "全屏",
                show: param.show || true,
                handler: function() {
                    $("header").addClass("hidden");
                    $("nav").addClass("hidden");
                    $(".J-el-content").removeAttr("id");
                    $(".J-fullscreen").addClass("hidden");
                    $(".J-returnfullscreen").removeClass("hidden");
                    fullscreen.requestFullscreen();
                    if (param.callback) {
                        param.callback();
                    }
                    return false;
                }
            };
        },
        returnfullscreen: function(param) {
            return {
                id: "returnfullscreen",
                text: "退出全屏",
                show: param.show || false,
                handler: function() {
                    $("header").removeClass("hidden");
                    $("nav").removeClass("hidden");
                    $(".J-el-content").attr("id", "content");
                    $(".J-fullscreen").removeClass("hidden");
                    $(".J-returnfullscreen").addClass("hidden");
                    fullscreen.exitFullscreen();
                    if (param.callback) {
                        param.callback();
                    }
                    return false;
                }
            };
        }
    };
    var Button = {
        getTemplate: function(item) {
            return "<input class='btn btn-theme J-btn-" + item.id + "' value='" + item.text + "' type='button'>";
        },
        _initCustAttr: function(item, model) {
            //处理buttons
            if (format[item.id]) {
                item = format[item.id](item);
            }
            item.show = item.show == false ? "hidden" : "";
            return item;
        },
        events: function(item, widget) {
            var events = {};
            events["click .J-btn-" + item.id] = function() {
                if (item.handler) {
                    item.handler.call(widget);
                }
            };
            return events;
        },
        getValue: function(item, model) {
            return;
        },
        setValue: function() {
            return;
        }
    };
    module.exports = Button;
});

define("eling/component/ui/subnav/1.0.0/dist/plugins/buttongroup", [ "eling/component/utils/ajaxwrapper", "dialog", "store", "gallery/store/1.3.14/store-seajs", "json", "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var aw = require("eling/component/utils/ajaxwrapper");
    var store = require("gallery/store/1.3.14/store-seajs");
    var HandlerBars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var buttonGroupTpl = require("eling/component/ui/subnav/1.0.0/dist/plugins/buttongroup.tpl");
    var subnav_btngroup_member = require("eling/component/ui/subnav/1.0.0/dist/plugins/buttongroup_member.tpl");
    var utils = {
        _getValueWithPoint: function(key, data) {
            var result = "";
            var tempData = data;
            //key可以是一个点语法
            if (key) {
                var spiltComma = key.split(",");
                if (spiltComma.length > 1) {
                    for (var comma = 0; comma < spiltComma.length; comma++) {
                        result += this._getValueWithPoint(spiltComma[comma], tempData) + " ";
                    }
                } else {
                    var keyArray = key.split(".");
                    for (var i = 0; i < keyArray.length; i++) {
                        if (tempData[keyArray[i]] || tempData[keyArray[i]] == 0) {
                            tempData = tempData[keyArray[i]];
                        } else {
                            tempData = "";
                        }
                    }
                    return tempData;
                }
            }
            return result;
        },
        transButtonGroup: function(item) {
            delete item.main;
            delete item.sub;
            var items = item.items || [];
            var keyField = item.key || "key";
            var valueField = item.value || "value";
            var format = item.format;
            var all = {
                key: "",
                text: "全部" + (item.showAllText || "")
            };
            if (items && items[0]) {
                var zero;
                if (typeof format === "function") {
                    zero = format(items[0]);
                } else {
                    zero = utils._getValueWithPoint(valueField, items[0]);
                }
                var main = item.showAll && item.showAllFirst ? all : {
                    key: utils._getValueWithPoint(keyField, items[0]),
                    text: zero
                };
                var sub = [];
                for (var j = 0; j < items.length; j++) {
                    var text;
                    if (typeof format === "function") {
                        text = format(items[j]);
                    } else {
                        text = utils._getValueWithPoint(valueField, items[j]);
                    }
                    sub.push({
                        key: utils._getValueWithPoint(keyField, items[j]),
                        text: text
                    });
                }
                if (item.showAll && item.showAllFirst) {
                    sub = [ all ].concat(sub);
                } else if (item.showAll) {
                    sub.push(all);
                }
                item.main = main;
                item.sub = sub;
            } else if (item.showAll) {
                item.items = [];
                item.main = all;
                item.sub = [ all ];
            } else {
                item.items = [];
            }
            return item;
        }
    };
    var format = {
        building: function(param) {
            var buildings = store.get("user").buildings || [];
            var apartment = [];
            for (var i = 0; i < buildings.length; i++) {
                if (buildings[i].useType.key == "Apartment") {
                    apartment.push(buildings[i]);
                }
            }
            return {
                id: "building",
                type: "buttongroup",
                key: "pkBuilding",
                value: "name",
                items: apartment,
                show: param.show,
                showAll: param.showAll,
                showAllFirst: param.showAllFirst,
                tip: param.tip || "楼宇",
                handler: param.handler
            };
        },
        defaultMembers: function(param) {
            return {
                id: "defaultMembers",
                type: "buttongroup",
                key: "pkMember",
                value: "memberSigning.room.number,personalInfo.name",
                url: "api/member/query",
                lazy: true,
                tpl: subnav_btngroup_member,
                show: param.show,
                showAll: param.showAll,
                showAllFirst: param.showAllFirst,
                tip: param.tip || "会员",
                handler: param.handler
            };
        }
    };
    var Buttongroup = {
        getTemplate: function(item) {
            var ret = "";
            if (item.items.length != 0) {
                var mainKey = item.main ? item.main.key : "";
                var mainText = item.main ? item.main.text : "";
                ret += "<button class='btn btn-theme J-btngroup-" + item.id + " J-main-" + item.id + "' data-key='" + mainKey + "'>" + mainText + "</button>";
                ret += "<button class='btn btn-theme J-btngroup-dropdown-" + item.id + " dropdown-toggle' data-toggle='dropdown'>";
                ret += "<span class='caret' style='border-top-color: white;'></span>";
                ret += "</button>";
                ret += "<ul class='dropdown-menu'>";
                var sub = item.sub || [];
                for (var i = 0; i < sub.length; i++) {
                    ret += "<li><a class='J-btngroup-" + item.id + "' data-key='" + sub[i].key + "' href='javascript:void(0);'>" + sub[i].text + "</a></li>";
                }
                ret += "</ul>";
                if (item.tip) {
                    ret += "<div class='tip'>" + item.tip + "</div>";
                }
            }
            return ret;
        },
        _initCustAttr: function(item, model) {
            var id = item.id;
            if (typeof format[id] === "function") {
                item = format[id](item);
            }
            if (item) {
                item.show = item.show == false ? "hidden" : "";
                item = utils.transButtonGroup(item);
                if (item.url && item.lazy != true) {
                    aw.ajax({
                        url: item.url,
                        data: item.params,
                        dataType: "json",
                        success: function(data) {
                            Buttongroup.setData(item, model, data || []);
                        }
                    });
                }
            }
            return item;
        },
        events: function(item, widget) {
            var events = {};
            events["click .J-btngroup-" + item.id] = function(e) {
                var handler = item.handler || function() {};
                var key = $(e.target).is("a") || $(e.target).is("button") ? $(e.target).attr("data-key") : $(e.target).parent().attr("data-key");
                var text = $(e.target).is("a") || $(e.target).is("button") ? $(e.target).text() : $(e.target).parent().text();
                $(".J-main-" + item.id).attr("data-key", key).text(text);
                handler.apply(widget, [ key, $(e.target), text ]);
                return false;
            };
            events["mouseover .J-main-" + item.id] = function(e) {
                $(e.target).parents(".J-subnav-buttongroup-" + item.id).find(".tip").css({
                    display: "block"
                });
                return false;
            };
            events["mouseout .J-main-" + item.id] = function(e) {
                $(e.target).parents(".J-subnav-buttongroup-" + item.id).find(".tip").css({
                    display: "none"
                });
                return false;
            };
            return events;
        },
        getValue: function(item, model) {
            return $(".J-main-" + item.id).attr("data-key") || "";
        },
        getText: function(item, model) {
            return $(".J-main-" + item.id).text() || "";
        },
        setValue: function(item, model, data) {
            if (data) {
                var value = $(".dropdown-menu .J-btngroup-" + item.id + "[data-key='" + data + "']").text();
                $(".J-main-" + item.id).attr("data-key", data).html(value);
            } else {
                if (item.showAll) {
                    $(".J-main-" + item.id).attr("data-key", "").html("全部" + (item.showAllText || ""));
                }
            }
        },
        load: function(item, model, option) {
            this.loading(item.id);
            var url = option.url || item.url;
            var params = option.params || item.params;
            if (typeof params === "function") {
                params = params();
            }
            aw.ajax({
                url: url,
                data: params,
                dataType: "json",
                success: function(data) {
                    Buttongroup.setData(item, model, data);
                    var callback = option.callback || function() {};
                    callback(data);
                }
            });
        },
        loading: function(item, model) {
            var button = $("<button></button>").css({
                "background-image": "url('assets/eling/resources/ajaxloader/ajaxloader.gif')",
                "background-repeat": "no-repeat",
                height: "33px",
                "background-position": "50%",
                width: "68px",
                "background-color": "whitesmoke",
                "border-color": "rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)",
                "-webkit-box-shadow": "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)",
                "-moz-box-shadow": "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)",
                "box-shadow": "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgb(233, 231, 231)"
            });
            $(".J-subnav-buttongroup-" + item.id).html(button);
        },
        setData: function(item, model, data) {
            item.items = data;
            item = utils.transButtonGroup(item);
            var tpl = item.tpl || buttonGroupTpl;
            var html = HandlerBars.compile(tpl)(item);
            $(".dropdown.J-subnav-buttongroup-" + item.id).html(html);
        },
        getData: function(item, model, option) {
            var items = item.items;
            var subIndex = option.subIndex;
            if (subIndex !== undefined) {
                if (typeof subIndex == "number") {
                    return items[subIndex];
                } else {
                    for (var i in items) {
                        if (items[i][item.key] == subIndex) {
                            return items[i];
                        }
                    }
                }
            } else {
                return items;
            }
        }
    };
    module.exports = Buttongroup;
});

define("eling/component/ui/subnav/1.0.0/dist/plugins/buttongroup.tpl", [], '{{#if this.main}}\n	<button class="btn btn-theme J-btngroup-{{this.id}} J-main-{{this.id}}" data-key="{{this.main.key}}">{{this.main.text}}</button>\n	<button class="btn btn-theme J-btngroup-dropdown-{{this.id}} dropdown-toggle" data-toggle="dropdown">\n		<span class="caret" style="border-top-color: white;"></span>\n	</button>\n	<ul class="dropdown-menu">\n		{{#each this.sub}}\n			<li><a class="J-btngroup-{{../this.id}}" data-key="{{this.key}}" href="javascript:void(0);">{{this.text}}</a></li>\n		{{/each}}\n	</ul>\n	{{#if this.tip}}\n	<div class="tip">{{this.tip}}</div>\n	{{/if}}\n{{/if}}\n');

define("eling/component/ui/subnav/1.0.0/dist/plugins/buttongroup_member.tpl", [], '{{#if this.items}}\n<button class="btn btn-theme J-btngroup-defaultMembers J-main-defaultMembers" data-key="{{this.main.key}}">{{this.main.text}}</button>\n<button class="btn btn-theme J-btngroup-dropdown-defaultMembers dropdown-toggle" data-toggle="dropdown">\n	<span class="caret" style="border-top-color: white;"></span>\n</button>\n<ul class="dropdown-menu" style="overflow: auto;max-height: 310px;">\n	{{#each this.sub}}\n		<li>\n			<a class="J-btngroup-defaultMembers" data-key="{{this.key}}" href="javascript:void(0);">{{this.text}}</a>\n		</li>\n	{{/each}}\n</ul>\n<div class="tip">{{this.tip}}</div>\n{{/if}}\n');

define("eling/component/ui/subnav/1.0.0/dist/plugins/time", [ "bootstrap/bootstrap-plugins/daterangepicker/daterangepicker" ], function(require, exports, module) {
    require("bootstrap/bootstrap-plugins/daterangepicker/daterangepicker");
    var Time = {
        getTemplate: function(item) {
            var ret = "";
            ret += "<a class='btn btn-theme dropdown-toggle J-daterange' href='javascript:void(0);'>";
            ret += "<span>请选择时间</span>";
            ret += "<b class='caret'></b>";
            ret += "</a>";
            if (item.tip) {
                ret += "<div class='tip'>" + item.tip + "</div>";
            }
            return ret;
        },
        initPlugins: function(item, model) {
            var time = item;
            var ranges = time.ranges || {
                "今天": [ moment().startOf("days"), moment().endOf("days") ],
                "昨天": [ moment().subtract(1, "days").startOf("days"), moment().subtract(1, "days").endOf("days") ],
                "本月": [ moment().startOf("month"), moment().endOf("month") ]
            };
            if (typeof ranges === "function") {
                ranges = ranges();
            }
            var defaultTime = time.defaultTime || {};
            var startDate = ranges[defaultTime] ? ranges[defaultTime][0] : moment().startOf("month");
            var endDate = ranges[defaultTime] ? ranges[defaultTime][1] : moment().endOf("month");
            var rangesConfig = {};
            //处理一下ranges，将ranges中的每一个moment对象换成字符串
            for (var r in ranges) {
                var items = ranges[r];
                rangesConfig[r] = [];
                for (var i = 0; i < items.length; i++) {
                    rangesConfig[r].push(items[i].valueOf());
                }
            }
            $(".J-daterange").daterangepicker({
                format: "YYYY.MM.DD",
                ranges: rangesConfig,
                showDropdowns: true,
                minDate: item.minDate || "1900",
                maxDate: item.maxDate,
                singleDatePicker: item.singleDatePicker,
                locale: {
                    applyLabel: "确定",
                    cancelLabel: "取消",
                    fromLabel: "从",
                    toLabel: "到",
                    customRangeLabel: "自定义",
                    daysOfWeek: [ "日", "一", "二", "三", "四", "五", "六" ],
                    monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
                    firstDay: 1
                },
                startDate: startDate.format("YYYY.MM.DD"),
                endDate: endDate.format("YYYY.MM.DD"),
                opens: "left",
                buttonClasses: [ "btn", "btn-sm" ]
            }, function(start, end) {
                var startTime = start.format("YYYY.MM.DD");
                var endTime = end.format("YYYY.MM.DD");
                if (startTime == endTime) {
                    $(".J-daterange span").html(startTime);
                } else {
                    $(".J-daterange span").html(startTime + "-" + endTime);
                }
                if (typeof item.handler === "function") {
                    item.handler({
                        start: start.valueOf(),
                        end: end.valueOf()
                    });
                }
            });
            if (startDate.format("YYYY.MM.DD") == endDate.format("YYYY.MM.DD")) {
                $(".J-daterange span").html(startDate.format("YYYY.MM.DD"));
            } else {
                $(".J-daterange span").html(startDate.format("YYYY.MM.DD") + "-" + endDate.format("YYYY.MM.DD"));
            }
        },
        events: function(item, widget) {
            var events = {};
            events["mouseover .J-subnav-time-" + item.id] = function(e) {
                $(e.target).parents(".J-subnav-time-" + item.id).find(".tip").css({
                    display: "block"
                });
                return false;
            };
            events["mouseout .J-subnav-time-" + item.id] = function(e) {
                $(e.target).parents(".J-subnav-time-" + item.id).find(".tip").css({
                    display: "none"
                });
                return false;
            };
            return events;
        },
        getValue: function() {
            var time = $(".J-daterange span").text();
            var temp = time.split("-");
            //兼容firefox
            for (var i in temp) {
                temp[i] = temp[i].replace(/\./g, "-");
            }
            return {
                start: moment(temp[0]).startOf("days").valueOf(),
                end: temp.length == 2 ? moment(temp[1]).endOf("days").valueOf() : moment(temp[0]).endOf("days").valueOf()
            };
        },
        setValue: function(item, model, data) {
            var start = data.start;
            var end = data.end;
            var startText = moment(start).format("YYYY.MM.DD");
            var endText = moment(end).format("YYYY.MM.DD");
            if (startText == endText) {
                $(".J-daterange span").text(startText);
            } else {
                $(".J-daterange span").text(startText + "-" + endText);
            }
        }
    };
    module.exports = Time;
});

define("eling/component/ui/subnav/1.0.0/dist/plugins/search", [], function(require, exports, module) {
    var Search = {
        getTemplate: function(item) {
            return "<input style='width: 160px; ' class='form-control input-sm J-subnav-search-" + item.id + "' placeholder='" + (item.placeholder || "搜索") + "'>";
        },
        events: function(item) {
            var events = {};
            events["keydown input.J-subnav-search-" + item.id] = function(e) {
                var keyCode;
                //要进行完整的兼容性校验
                if (window.event) {
                    // 兼容IE8
                    keyCode = e.keyCode;
                } else {
                    keyCode = e.which;
                }
                if (13 == keyCode) {
                    // enter键搜索
                    var s = $("input.J-subnav-search-" + item.id).val();
                    if (s) {
                        item.handler(s);
                    }
                }
            };
            return events;
        },
        getValue: function(item, model) {
            return $("input.J-subnav-search-" + item.id).val();
        },
        setValue: function(item, model, data) {
            $("input.J-subnav-search-" + item.id).val(data);
        }
    };
    module.exports = Search;
});

define("eling/component/ui/subnav/1.0.0/dist/plugins/date", [ "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker" ], function(require, exports, module) {
    require("jquery/jquery-plugins/datetimepicker/jquery.datetimepicker");
    var SubnavDate = {
        _transMode: function(mode) {
            if (mode) {
                return mode.replace("Y", "yyyy").replace("m", "MM").replace("d", "dd").replace("H", "hh").replace("i", "mm");
            } else {
                return "yyyy-MM-dd";
            }
        },
        getTemplate: function(param) {
            var defaultDate = param.defaultDate || moment().format("YYYY-MM-DD");
            return "<input class='btn btn-theme J-subnav-date-" + param.id + "' value='" + defaultDate + "' type='button'>";
        },
        initPlugins: function(item, model) {
            var params = {
                format: "Y-m-d",
                lang: "zh",
                timepicker: false,
                closeOnDateSelect: true,
                onSelectDate: function(ct, $i) {
                    if (typeof item.handler === "function") {
                        var start = moment(ct).startOf("days").valueOf();
                        var end = moment(ct).add("days", 1).startOf("days").valueOf() - 1;
                        item.handler(start, end);
                    }
                }
            };
            if (item.startDate) {
                params.startDate = item.startDate;
            }
            if (item.maxDate) {
                params.maxDate = item.maxDate;
            }
            if (item.minDate) {
                params.minDate = item.minDate;
            }
            $("input.J-subnav-date-" + item.id).datetimepicker(params);
        },
        getValue: function(item, model) {
            var value = $("input.J-subnav-date-" + item.id).val();
            return {
                start: moment(value).startOf("days").valueOf(),
                end: moment(value).add("days", 1).startOf("days").valueOf() - 1
            };
        },
        setValue: function(item, model, data) {
            $("input.J-subnav-date-" + item.id).val(moment(data).format("YYYY-MM-DD"));
        },
        destroy: function(item, model) {
            $("input.J-subnav-date-" + item.id).datetimepicker("destroy");
        }
    };
    module.exports = SubnavDate;
});

define("eling/component/ui/subnav/1.0.0/dist/subnav.tpl", [], "<div id=\"{{this.id}}\" class=\"container el-subnav el-subnav-1\">\n	<div class='row'>\n		<div class='col-sm-12'>\n			<div class='page-header el-page-header J-subnav-head'>\n				<h1 class='pull-left'>\n					<i class='icon-comments'></i>\n					<span class=\"J-subnav-title\">{{this.title}}</span>\n				</h1>\n				<div class='pull-right el-pull-right'>\n				{{#each this.items}}\n					<div class=\"btn-group ex-btn-group dropdown J-{{this.id}} J-subnav-{{this.type}}-{{this.id}} {{this.show}}\">\n						{{#subnav this}}\n						{{/subnav}}\n					</div>\n				{{/each}}\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n");
