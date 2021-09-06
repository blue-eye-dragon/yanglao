define("eling/component/ui/form/2.0.0/dist/form-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/handlebars/2.0.0/handlebars-seajs", "./formutils", "jquery/jquery-plugins/validate/jquery.validate", "./formvalidate", "./form.css", "./plugins/date", "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker", "./plugins/date.tpl", "./plugins/place", "jquery/jquery-plugins/select2/select2", "eling/component/utils/ajaxwrapper", "dialog", "store", "./plugins/place1", "./plugins/place1.tpl", "eling/component/ui/admindivision/1.0.0/dist/admindivision", "./plugins/select", "./plugins/select.tpl", "./plugins/text", "./plugins/text.tpl", "./plugins/textarea", "./plugins/textarea.tpl", "./plugins/checkradio", "./plugins/checkradio.tpl", "./plugins/autocomplete", "jquery/jquery-plugins/autocomplete/autocomplete", "./form.tpl" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var utils = require("./formutils");
    require("jquery/jquery-plugins/validate/jquery.validate");
    require("./formvalidate");
    require("./form.css");
    //plugins
    var Date = require("./plugins/date");
    var Place = require("./plugins/place");
    var Place1 = require("./plugins/place1");
    var Select = require("./plugins/select");
    var Text = require("./plugins/text");
    var TextArea = require("./plugins/textarea");
    var Check_Radio = require("./plugins/checkradio");
    var Autocomplete = require("./plugins/autocomplete");
    var plugin = {
        hidden: Text,
        password: Text,
        text: Text,
        textarea: TextArea,
        checklist: Check_Radio,
        radiolist: Check_Radio,
        select: Select,
        date: Date,
        place: Place,
        place1: Place1,
        autocomplete: Autocomplete
    };
    handlebars.registerHelper("form_2_0_0", function(context, option) {
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
    var Form = UIComponent.extend({
        attrs: {
            template: require("./form.tpl"),
            autoRender: true,
            saveaction: function() {
                return false;
            },
            itemValidates: {},
            model: {
                defaultButton: true,
                saveText: "保存",
                cancelText: "取消",
                validate: {
                    position: "right"
                }
            }
        },
        initCustAttr: function(itemParams) {
            var model = this.get("model") || {};
            var id = model.id;
            var items = itemParams || model.items || [];
            var itemValidates = this.get("itemValidates");
            for (var i = 0; i < items.length; i++) {
                items[i].form = id;
                var fid = items[i].name ? items[i].name.replace(/\./g, "-") : "";
                if (!items[i].type) {
                    items[i].type = "text";
                }
                items[i].show = items[i].type == "hidden" || items[i].show === false ? "hidden" : "";
                items[i].fid = "J-form-" + model.id + "-" + items[i].type + "-" + fid;
                var validate = items[i].validate || [];
                var exValidate = items[i].exValidate;
                if (typeof exValidate === "function") {
                    var validateID = id + "-customer-valid-" + items[i].name.replace(/\./g, "-");
                    validate.push(validateID);
                    itemValidates[validateID] = exValidate;
                }
                for (var j = 0; j < validate.length; j++) {
                    if (validate[j] == "required") {
                        items[i].isRequired = true;
                    }
                }
            }
        },
        events: function(itemsParams) {
            var events = {};
            var model = this.get("model");
            var items = itemsParams || model.items || [];
            for (var i = 0; i < items.length; i++) {
                var type = items[i].type;
                if (typeof plugin[type].events === "function") {
                    events = $.extend(true, events, plugin[type].events(items[i], this));
                }
            }
            events["click .J-form-" + model.id + "-cancel"] = this.get("cancelaction") || function() {
                return false;
            };
            return events;
        },
        _initValidate: function() {
            var model = this.get("model");
            var id = model.id;
            var saveaction = this.get("saveaction");
            var validatePos = model.validate.position;
            //增加自定义的校验
            var itemValidates = this.get("itemValidates");
            for (var i in itemValidates) {
                (function(validName, validFunc) {
                    var func = validFunc.toString();
                    var match = func.match(/return ".*"/)[0];
                    var message = match.substring(7, match.length - 1);
                    $.validator.addMethod(validName, function(value) {
                        if (validFunc(value) === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }, message);
                })(i, itemValidates[i]);
            }
            if ($().validate) {
                this.element.find("form").validate({
                    submitHandler: function(form) {
                        saveaction();
                        return false;
                    },
                    errorElement: "span",
                    errorClass: "help-block has-error",
                    errorPlacement: function(e, t) {
                        if (validatePos == "right") {
                            return t.parents(".form-group").first().append(e);
                        } else {
                            e.css({
                                position: "absolute"
                            });
                            $("#" + id + " .form-group").css({
                                "margin-bottom": "30px"
                            });
                            return t.after(e);
                        }
                    },
                    highlight: function(e) {
                        return $(e).closest(".form-group").removeClass("has-error has-success").addClass("has-error");
                    },
                    success: function(e) {
                        var ret = e.closest(".form-group").removeClass("has-error").find(".help-block").remove();
                        if (validatePos == "bottom" && $("#" + id + " .help-block").length == 0) {
                            $("#" + id + " .form-group").css({
                                "margin-bottom": "15px"
                            });
                        }
                        return ret;
                    }
                });
            }
        },
        _initPlugins: function(itemsParams, el) {
            var model = this.get("model") || {};
            var items = itemsParams || model.items || [];
            for (var i = 0; i < items.length; i++) {
                (function(element, items, index) {
                    var type = items[index].type;
                    if (typeof plugin[type].initPlugin === "function") {
                        plugin[type].initPlugin(element, items, items[index]);
                    }
                })(el || this.element, items, i);
            }
        },
        afterRender: function() {
            this._initValidate();
            this._initPlugins();
        },
        getItemConfig: function(keyOrIndex, itemParams) {
            var model = this.get("model") || {};
            var items = itemParams || model.items || [];
            if (typeof keyOrIndex === "string") {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].name == keyOrIndex) {
                        return items[i];
                    }
                }
            } else {
                //传递的是索引
                return items[keyOrIndex];
            }
        },
        getValue: function(keyOrIndex) {
            var item = this.getItemConfig(keyOrIndex);
            return plugin[item.type].getValue(item, this.element);
        },
        setValue: function(keyOrIndex, value) {
            var item = this.getItemConfig(keyOrIndex);
            return plugin[item.type].setValue(value, item, this.element);
        },
        getData: function(keyOrIndex, params) {
            if (!keyOrIndex) {
                var result = {};
                var model = this.get("model");
                var items = model.items;
                for (var i = 0; i < items.length; i++) {
                    var name = items[i].name;
                    var type = items[i].type || "text";
                    var value = plugin[type].getValue(this.getItemConfig(name), this.element);
                    result[name] = value;
                }
                return result;
            } else {
                var config = this.getItemConfig(keyOrIndex);
                var type = config.type || "text";
                return plugin[type].getData(params, config, this.element);
            }
        },
        setLabel: function(keyOrIndex, name) {
            var item = this.getItemConfig(keyOrIndex);
            this.$(".J-form-label-" + item.name).text(name);
        },
        getLabel: function(keyOrIndex) {
            var item = this.getItemConfig(keyOrIndex);
            return this.$(".J-form-label-" + item.name).text();
        },
        setData: function(keyOrIndex, data, itemsParams) {
            if (keyOrIndex.constructor === String) {
                var item = this.getItemConfig(keyOrIndex);
                var type = item.type;
                if (typeof plugin[type].setData === "function") {
                    plugin[type].setData(data, item, this.element);
                }
            } else {
                //那就证明keyOrIndex=null
                itemsParams = data;
                data = keyOrIndex;
                var model = this.get("model") || {};
                var items = itemsParams || model.items || [];
                for (var i = 0; i < items.length; i++) {
                    plugin[items[i].type].setValue(utils._getValue(items[i].name, data), items[i], this.element);
                }
            }
        },
        load: function(name, params) {
            var config = this.getItemConfig(name);
            var type = config.type || "text";
            if (typeof plugin[type].load === "function") {
                plugin[type].load(params, config, this.element);
            }
        },
        reset: function(itemsParams) {
            var model = this.get("model") || {};
            var items = itemsParams || model.items || [];
            for (var i = 0; i < items.length; i++) {
                var type = items[i].type || "text";
                if (typeof plugin[type].reset === "function") {
                    plugin[type].reset(items[i], this.element);
                }
                //恢复是否显示
                if (items[i].show) {
                    this.hide(items[i].name);
                } else {
                    this.show(items[i].name);
                }
            }
            this.setDisabled(false);
            //去掉validate信息
            this.element.find(".help-block").remove();
            this.element.find(".has-error").removeClass("has-error");
        },
        setAttribute: function(name, attr, value) {
            var config = this.getItemConfig(name);
            var type = config.type || "text";
            if (typeof plugin[type].setAttribute === "function") {
                plugin[type].setAttribute(config, attr, value);
            } else {
                this.$("." + config.fid).attr(attr, value);
            }
        },
        removeAttribute: function(name, attr) {
            var config = this.getItemConfig(name);
            var type = config.type || "text";
            if (typeof plugin[type].removeAttribute === "function") {
                plugin[type].removeAttribute(config, attr);
            } else {
                this.$("." + config.fid).removeAttr(attr);
            }
        },
        setDisabled: function(mark) {
            if (mark) {
                this.$("#" + this.get("model").id).find("input,select,radio,checkbox,textarea").attr("disabled", "disabled");
                this.$(".J-button-area,.input-group-addon").addClass("hidden");
            } else {
                this.$("#" + this.get("model").id).find("input,select,radio,checkbox,textarea").removeAttr("disabled");
                this.$(".J-button-area,.input-group-addon").removeClass("hidden");
            }
        },
        destroy: function(itemsParams) {
            var model = this.get("model") || {};
            var items = itemsParams || model.items || [];
            for (var i = 0; i < items.length; i++) {
                var type = items[i].type || "text";
                if (typeof plugin[type].destroy === "function") {
                    plugin[type].destroy(items[i], model);
                }
            }
        },
        hide: function(keyOrIndex) {
            if (keyOrIndex.constructor === String) {
                keyOrIndex = [ keyOrIndex ];
            }
            for (var i = 0; i < keyOrIndex.length; i++) {
                var item = this.getItemConfig(keyOrIndex[i]);
                this.$("." + item.fid).parents(".form-group").addClass("hidden");
            }
            return this;
        },
        show: function(keyOrIndex) {
            if (keyOrIndex.constructor === String) {
                keyOrIndex = [ keyOrIndex ];
            }
            for (var i = 0; i < keyOrIndex.length; i++) {
                var item = this.getItemConfig(keyOrIndex[i]);
                this.$("." + item.fid).parents(".form-group").removeClass("hidden");
            }
            return this;
        },
        trigger: function(keyOrIndex, eventName) {
            var item = this.getItemConfig(keyOrIndex);
            if (item.type == "select") {
                this.$("select." + item.fid).trigger(eventName);
            } else {
                this.$("." + item.fid).trigger(eventName);
            }
        },
        valid: function() {
            return this.$("form").valid();
        }
    });
    module.exports = Form;
});

define("eling/component/ui/form/2.0.0/dist/formutils", [ "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var formutils = {
        _getValue: function(key, data) {
            //key可以是一个点语法
            if (key && typeof data === "object") {
                var keyArray = key.split(".");
                for (var i = 0; i < keyArray.length; i++) {
                    if (data[keyArray[i]] === 0) {
                        data[keyArray[i]] = "0";
                    } else if (data[keyArray[i]] === true || data[keyArray[i]] === false) {
                        data[keyArray[i]] = data[keyArray[i]] + "";
                    }
                    if (data[keyArray[i]]) {
                        data = data[keyArray[i]];
                    } else {
                        data = "";
                    }
                }
            }
            if (data) {
                return data;
            } else {
                if (data === 0) {
                    return "0";
                } else if (data === true || data === false) {
                    return data + "";
                } else {
                    return "";
                }
            }
            return data;
        },
        geneValidate: function(validates) {
            var validateStr = "";
            var validate = validates || [];
            for (var j = 0; j < validate.length; j++) {
                validateStr += "data-rule-" + validate[j] + "=true ";
            }
            return validateStr;
        },
        compile: function(tpl, item) {
            return handlebars.compile(tpl)(item);
        }
    };
    module.exports = formutils;
});

define("eling/component/ui/form/2.0.0/dist/formvalidate", [], function(require, exports, module) {
    //自定义的校验规则
    //只允许字母，数字，下划线
    jQuery.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^\w+$/i.test(value);
    }, "只允许输入字母、数字、下划线");
    //只允许正确的金额
    jQuery.validator.addMethod("money", function(value, element) {
        return this.optional(element) || /(^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$)/i.test(value);
    }, "只能输入数字");
    //只允许字母
    jQuery.validator.addMethod("lettersonly", function(value, element) {
        return true;
    }, "只允许输入字母");
    //不允许空格
    jQuery.validator.addMethod("nowhitespace", function(value, element) {
        return this.optional(element) || /^\S+$/i.test(value);
    }, "请不要输入空格");
    //校验会员上限
    jQuery.validator.addMethod("number", function(value, element) {
        return this.optional(element) || /(^[1-9]{1}[0-9]{0,6}$)/i.test(value);
    }, "请输入1-9999999之间的有效数字");
    //校验楼宇的楼层
    jQuery.validator.addMethod("floor", function(value, element) {
        return this.optional(element) || /(^[1-9]{1}[0-9]{0,1}$)/i.test(value);
    }, "请输入1-99之间的有效数字");
    //校验房型的面积
    jQuery.validator.addMethod("area", function(value, element) {
        return this.optional(element) || /(^[1-9]{1}[0-9]{0,2}$)/i.test(value);
    }, "请输入1-999之间的有效数字");
    //校验身高
    jQuery.validator.addMethod("stature", function(value, element) {
        return this.optional(element) || /(^[1-3]{1}[0-9]{2}$)/i.test(value);
    }, "请输入1-300之间的有效数字");
    //校验体重
    jQuery.validator.addMethod("weight", function(value, element) {
        var text = jQuery(element).val();
        if (text.length == 2 && /(^[2-9]{1}[0-9]{1}$)/i.test(text)) {
            //校验20-99
            return true;
        } else if (text.length == 3 && /(^[1-5]{1}[0-9]{2}$)/i.test(text)) {
            //校验100-500
            return true;
        } else if (text.length == 0) {
            return true;
        } else {
            return false;
        }
    }, "请输入20-500之间的数字");
    //校验腰围
    jQuery.validator.addMethod("waistline", function(value, element) {
        var text = jQuery(element).val();
        if (text.length == 2 && /(^[3-9]{1}[0-9]{1}$)/i.test(text)) {
            //校验20-99
            return true;
        } else if (text.length == 3 && /(^[1-2]{1}[0-9]{2}$)/i.test(text)) {
            //校验100-500
            return true;
        } else if (text.length == 0) {
            return true;
        } else {
            return false;
        }
    }, "请输入30-200之间的有效数字");
    //校验BMI
    jQuery.validator.addMethod("BMI", function(value, element) {
        return this.optional(element) || /(^[1-5]{1}[0-9]{0,1}$)/i.test(value);
    }, "请输入10-50之间的有效数字");
    //校验腰围
    jQuery.validator.addMethod("eye", function(value, element) {
        return this.optional(element) || /(^[4-5]{1}[.]?[0-3]?$)/i.test(value);
    }, "请输入4.0-5.3之间的有效数字");
    //电话
    jQuery.validator.addMethod("phone", function(value, element) {
        return true;
    }, "请输入一个有效的电话号码.");
    //移动电话
    jQuery.validator.addMethod("mobile", function(value, element) {
        return true;
    }, "请输入一个有效的移动电话号码");
    //邮政编码(只有6位数字)
    jQuery.validator.addMethod("postalcode", function(value, element) {
        return this.optional(element) || /^[1-9]\d{5}$/.test(value);
    }, "请输入6位有效数字，具体请查询中国邮政编码");
    jQuery.validator.addMethod("physicaldata", function(value, element) {
        if (value.length == 0) {
            return true;
        }
        return this.optional(element) || /(^[-]?[0-9]{1,2}\.?[0-9]{0,13}?$)/i.test(value);
    }, "请输入15位以内的有效数字");
    //校验食物偏好和食物禁忌，中间用，隔开，并且每个不能超过5个字
    jQuery.validator.addMethod("comma_split_5", function(value, element, params) {
        var mark = true;
        var mark2 = true;
        var text = jQuery(element).val().split("，");
        for (var i = 0; i < text.length; i++) {
            var str = text[i];
            for (var j = 0; j < str.length; j++) {
                if (str[j] == "、") {
                    text2 = str.split("、");
                    for (var z = 0; z < text2.length; z++) {
                        if (text2[z].length > 5) {
                            mark = false;
                            break;
                        } else if (z == text2.length - 1) {
                            mark2 = false;
                        }
                    }
                }
            }
            if (mark2 == false) {
                mark2 = true;
                continue;
            }
            if (text[i].length > 5) {
                mark = false;
                break;
            }
        }
        return mark;
    }, jQuery.validator.format("请将食物之间用中文逗号或顿号隔开，并且每个食物名称不能超过5个字"));
    //校验录入健康数据的合法性
    var tips = "";
    jQuery.validator.addMethod("healthData", function(value, element, params) {
        var type = jQuery(element).parents(".form-group").prev().prev().find("option:selected").attr("value");
        tips = "";
        if (type == "BloodPressureV1") {
            tips = "请按照 高压值(0-250)/低压值(0-250) 的格式输入血压";
            var text = jQuery(element).val().split("/");
            if (text.length < 2) {
                return false;
            }
            var mark = true;
            for (var i = 0; i < text.length; i++) {
                var tt = text[i];
                if (tt.length == 2 && /(^[0-9]{1}[0-9]{1}$)/i.test(tt)) {
                    //校验0-99
                    mark = true;
                } else if (tt.length == 3 && /(^[1-2]{1}[0-9]{2}$)/i.test(tt)) {
                    if (/(^[2]{1}[6-9]{2}$)/i.test(tt)) {
                        mark = false;
                    }
                } else {
                    mark = false;
                    break;
                }
            }
            return mark;
        } else if (type == "BGDataV1") {
            tips = "请输入1-7.9之间的有效数字";
            return this.optional(element) || /(^[1-7][.]?[0-9]?$)/i.test(value);
        } else if (type == "FatDataV1") {
            tips = "请输入1-49.9之间的有效数字";
            return this.optional(element) || /(^[1-4]{1}[0-9]{0,1}[.]?[0-9]?$)/i.test(value);
        } else if (type == "PulseData") {
            tips = "请输入30-200之间的有效数字";
            var text = jQuery(element).val();
            if (text.length == 2 && /(^[3-9]{1}[0-9]{1}$)/i.test(text)) {
                //校验50-99
                return true;
            } else if (text.length == 3 && /(^[1-2]{1}[0-9]{2}$)/i.test(text)) {
                //校验100-200
                return true;
            } else if (text.length == 0) {
                return true;
            } else {
                return false;
            }
        } else if (type == "Spo2DataV1") {
            tips = "请输入1-99.9之间的有效数字";
            return this.optional(element) || /(^[1-9]{1}[0-9]{0,1}[.]?[0-9]?$)/i.test(value);
        } else if (type == "TemperatureData") {
            tips = "请输入30-49.9之间的有效数字";
            return this.optional(element) || /(^[3-4]{1}[0-9]{0,1}[.]?[0-9]?$)/i.test(value);
        } else if (type == "StepDataV1") {
            tips = "请输入1-99999之间的有效数字";
            return this.optional(element) || /(^[1-9]{1}[0-9]{0,4}$)/i.test(value);
        }
        return true;
    }, function() {
        return tips;
    });
    //	//校验健康巡检待办中选取会员后服务必填
    //    jQuery.validator.addMethod("memSvcRequired", function(value, element, params) {
    //    	var mem = jQuery(element).parents(".form-group").prev().find("option:selected").attr("value");
    //    	if ((null != mem) && ("" != mem) && (0 != mem)){
    //    		var svc = jQuery(element).find("option:selected").attr("value");
    //    		if ((null == svc) || ("" == svc) && (0 == svc)){
    //    			return false;
    //    		}
    //		}
    //    	return true;
    //    }, "请选取服务");
    //校验楼层，中间用,隔开
    jQuery.validator.addMethod("number_split", function(value, element, params) {
        var text = jQuery(element).val().split(",");
        var mark = true;
        for (var i = 0; i < text.length; i++) {
            var tt = text[i];
            if (tt.length == 1 && /(^[0-9]{0,1}$)/i.test(tt)) {
                mark = true;
            } else if (tt.length == 2 && /(^[1]{1}[0-9]{0,1}$)/i.test(tt)) {
                mark = true;
            } else if (tt.length > 2) {
                mark = false;
                break;
            } else if (tt.length == 0) {
                mark = false;
                break;
            } else {
                mark = false;
                break;
            }
        }
        return mark;
    }, jQuery.validator.format("请使用英文逗号分割楼层，且楼层是1~19之间的数字"));
    //校验数字0~99
    jQuery.validator.addMethod("zeronumber", function(value, element) {
        return this.optional(element) || /(^[0-9]{1}[0-9]{0,1}$)/i.test(value);
    }, "请输入0-99之间的有效数字");
    //校验正浮点数\
    jQuery.validator.addMethod("positivenumber", function(value, element) {
        return !isNaN(value) && parseFloat(value) >= 0;
    }, "请输入一个正浮点数");
});

define("eling/component/ui/form/2.0.0/dist/form.css", [], function() {
    seajs.importStyle(".el-form .required{color:red;line-height:30px;font-size:20px;float:left;margin-top:3px;margin-right:10px}.el-form .form-group{min-height:34px}.el-form .el-form-buttons{background-color:#f4f4f4;padding:20px;border-top:1px solid #e5e5e5;margin-top:20px}.el-form .clear{clear:both}@media (min-width:768px){.el-form .el-form-buttons{padding:20px 0}}");
});

define("eling/component/ui/form/2.0.0/dist/plugins/date", [ "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker", "eling/component/ui/form/2.0.0/dist/formutils", "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    require("jquery/jquery-plugins/datetimepicker/jquery.datetimepicker");
    var utils = require("eling/component/ui/form/2.0.0/dist/formutils");
    var tpl = require("eling/component/ui/form/2.0.0/dist/plugins/date.tpl");
    var FormDate = {
        _transMode: function(mode) {
            if (mode) {
                return mode.replace("Y", "YYYY").replace("m", "MM").replace("d", "DD").replace("H", "HH").replace("i", "mm");
            } else {
                return "YYYY-MM-DD";
            }
        },
        _getDefaultValue: function(item) {
            var defaultValue = item.defaultValue || "";
            if (defaultValue) {
                return moment(defaultValue).valueOf();
            }
            return "";
        },
        getTemplate: function(item) {
            var defaultValue = this._getDefaultValue(item);
            return utils.compile(tpl, {
                name: item.name,
                fid: item.fid,
                value: defaultValue ? moment(defaultValue).format(this._transMode(item.mode)) : "",
                placeholder: item.placeholder || "请输入" + item.label,
                validate: utils.geneValidate(item.validate),
                style: item.style,
                className: item.className
            });
        },
        initPlugin: function(el, items, item) {
            var mode = item.mode || "Y-m-d";
            el.find("." + item.fid).datetimepicker({
                format: mode,
                closeOnDateSelect: true,
                datepicker: mode.indexOf("Y") != -1 ? true : false,
                timepicker: mode.indexOf("H") != -1 ? true : false,
                lang: "zh",
                scrollInput: false,
                yearStart: "1900",
                scrollMonth: false,
                step: item.step || 60
            });
        },
        getText: function(item, el) {
            return el.find("." + item.fid).val();
        },
        getValue: function(item, el) {
            var value = el.find("." + item.fid).val();
            return value ? moment(value).valueOf() : "";
        },
        setValue: function(value, item, el) {
            value = utils._getValue(item.value, value) || value || /*this._getDefaultValue(item) ||*/ "";
            if (typeof value === "date") {
                //支持Date类型
                value = value.getTime();
            } else if (typeof value === "object") {
                //支持moment类型
                value = value.valueOf();
            } else if (value) {
                //默认支持毫秒数
                value = Number(value);
            }
            var mode = this._transMode(item.mode);
            if (value < -1325491557e3) {
                value = value + 357e3;
            }
            el.find("." + item.fid).val(value ? moment(value).format(mode) : "");
        },
        reset: function(item, el) {
            var defaultValue = this._getDefaultValue(item);
            if (defaultValue) {
                el.find("." + item.fid).val(moment(defaultValue).format(this._transMode(item.mode)));
            } else {
                el.find("." + item.fid).val("");
            }
        },
        destroy: function(item, model) {
            $("." + item.fid).datetimepicker("destroy");
        }
    };
    module.exports = FormDate;
});

define("eling/component/ui/form/2.0.0/dist/plugins/date.tpl", [], '<div class="datetimepicker input-group" style=\'width:100%;\'>\n	<input name="{{this.name}}" class="form-control {{this.fid}} {{this.className.value}}" value="{{this.value}}" \n		type="text" placeholder="{{this.placeholder}}" {{this.validate}} style="{{this.style.value}}"/>\n</div>');

define("eling/component/ui/form/2.0.0/dist/plugins/place", [ "jquery/jquery-plugins/select2/select2", "eling/component/utils/ajaxwrapper", "dialog", "store" ], function(require, exports, module) {
    require("jquery/jquery-plugins/select2/select2");
    var aw = require("eling/component/utils/ajaxwrapper");
    var Select = {
        getTemplate: function(param) {
            var ret = "";
            ret += "<select style='display:inline-block;width:20%;' class='J-province form-control'></select>";
            ret += "&nbsp;省&nbsp;";
            ret += "<select style='display:inline-block;width:20%;' class='J-city form-control'></select>";
            ret += "&nbsp;市&nbsp;";
            ret += "<select style='display:inline-block;width:20%;' class='J-place form-control'></select>";
            ret += "&nbsp;县&nbsp;";
            ret += "<input id='" + param.id + "' name='" + param.name + "' class='J-" + param.name + " J-hidden-pkPlace' type='hidden'/>";
            return ret;
        },
        events: function() {
            return {
                "change .J-province": function(e) {
                    var parent = $(e.target).parent("div");
                    var province = $(e.target);
                    var city = parent.find("select.J-city");
                    var place = parent.find("select.J-place");
                    var hidden = parent.find(".J-hidden-pkPlace");
                    //取到省的值得时候，就要给提交字段赋值
                    var pkProvince = province.find("option:selected").attr("id");
                    hidden.val(pkProvince);
                    //根据code查询市
                    var codeProvince = province.find("option:selected").attr("value");
                    if (codeProvince) {
                        aw.ajax({
                            url: "api/admindivision",
                            data: {
                                parentCode: codeProvince
                            },
                            dataType: "json",
                            success: function(data) {
                                var cityStr = "";
                                cityStr += "<option value=''>请选择</option>";
                                for (var d = 0; d < data.length; d++) {
                                    cityStr += "<option id='" + data[d].id + "'value='" + data[d].code + "'>" + data[d].name + "</option>";
                                }
                                city.html(cityStr);
                                city.select2({});
                                place.html("<option value=''>请选择</option>");
                                place.select2("val", [ "" ]);
                            }
                        });
                    } else {
                        //市和县要切换回空
                        city.html("<option value=''>请选择</option>");
                        place.html("<option value=''>请选择</option>");
                        city.select2({});
                        place.select2({});
                    }
                },
                "change .J-city": function(e) {
                    var parent = $(e.target).parent("div");
                    var city = parent.find("select.J-city");
                    var place = parent.find("select.J-place");
                    var hidden = parent.find(".J-hidden-pkPlace");
                    //取到市的值得时候，就要给提交字段赋值
                    var pkCity = city.find("option:selected").attr("id");
                    hidden.val(pkCity);
                    //根据code查询县
                    var codeCity = city.find("option:selected").attr("value");
                    if (codeCity) {
                        aw.ajax({
                            url: "api/admindivision",
                            data: {
                                parentCode: codeCity
                            },
                            dataType: "json",
                            success: function(data) {
                                var nativePlaceStr = "";
                                nativePlaceStr += "<option value=''>请选择</option>";
                                for (var e = 0; e < data.length; e++) {
                                    nativePlaceStr += "<option id='" + data[e].id + "'value='" + data[e].code + "'>" + data[e].name + "</option>";
                                }
                                place.html(nativePlaceStr);
                                place.select2({});
                            }
                        });
                    } else {
                        place.html("<option value=''>请选择</option>");
                        place.select2({});
                    }
                },
                "change .J-place": function(e) {
                    var parent = $(e.target).parent("div");
                    var place = parent.find("select.J-place");
                    var hidden = parent.find(".J-hidden-pkPlace");
                    //取到市的值得时候，就要给提交字段赋值
                    var pkPlace = place.find("option:selected").attr("id");
                    hidden.val(pkPlace);
                }
            };
        },
        setValue: function(value, config, el) {
            //先为隐藏域赋值，保证值不丢失
            var id = value ? value.id : "";
            var input = el.find(".J-hidden-pkPlace");
            input.val(id);
            //为下拉框赋值
            var code = value ? value.code : "";
            var provinceCode = code.substring(0, 2);
            var parent = input.parent("div");
            //为省赋值
            parent.find(".J-province").select2("val", [ provinceCode ]);
            //为市赋值
            var cityCode = code.length >= 4 ? code.substring(0, 4) : "";
            var city = parent.find("select.J-city");
            aw.ajax({
                url: "api/admindivision",
                data: {
                    parentCode: provinceCode
                },
                dataType: "json",
                success: function(data) {
                    var cityStr = "";
                    cityStr += "<option value=''>请选择</option>";
                    for (var d = 0; d < data.length; d++) {
                        cityStr += "<option id='" + data[d].id + "' value='" + data[d].code + "'>" + data[d].name + "</option>";
                    }
                    city.html(cityStr);
                    city.select2({});
                    city.select2("val", [ cityCode ]);
                }
            });
            //为县赋值
            var place = parent.find("select.J-place");
            var placeCode = code.length == 6 ? code : "";
            if (cityCode.length == 4) {
                aw.ajax({
                    url: "api/admindivision",
                    data: {
                        parentCode: cityCode
                    },
                    dataType: "json",
                    success: function(data) {
                        var nativePlaceStr = "";
                        nativePlaceStr += "<option value=''>请选择</option>";
                        for (var e = 0; e < data.length; e++) {
                            nativePlaceStr += "<option id='" + data[e].id + "' value='" + data[e].code + "'>" + data[e].name + "</option>";
                        }
                        place.html(nativePlaceStr);
                        place.select2({});
                        place.select2("val", [ placeCode ]);
                    }
                });
            } else if (cityCode.length == 4) {
                place.select2("val", [ placeCode ]);
            } else {
                place.select2("val", [ "" ]);
            }
        },
        getValue: function(item, el) {
            return el.find("." + item.fid).val();
        },
        initPlugin: function(el, items, item) {
            aw.ajax({
                url: "api/admindivision",
                dataType: "json",
                success: function(data) {
                    var ret = "";
                    ret += "<option value=''>请选择</option>";
                    for (var c = 0; c < data.length; c++) {
                        ret += "<option id='" + data[c].id + "' value='" + data[c].code + "'>" + data[c].name + "</option>";
                    }
                    el.find(".J-province").html(ret);
                    el.find(".J-province").select2({});
                    el.find(".J-city").html("<option value=''>请选择</option>").select2({});
                    el.find(".J-place").html("<option value=''>请选择</option>").select2({});
                }
            });
        },
        reset: function(item, el) {
            el.find(".J-province").select2("val", [ "" ]);
            el.find(".J-city").select2("val", [ "" ]);
            el.find(".J-place").select2("val", [ "" ]);
            el.find(".J-hidden-pkPlace." + item.fid).val("");
        }
    };
    module.exports = Select;
});

define("eling/component/ui/form/2.0.0/dist/plugins/place1", [ "eling/component/ui/form/2.0.0/dist/formutils", "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/utils/ajaxwrapper", "dialog", "store", "eling/component/ui/admindivision/1.0.0/dist/admindivision", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap" ], function(require, exports, module) {
    var utils = require("eling/component/ui/form/2.0.0/dist/formutils");
    var tpl = require("eling/component/ui/form/2.0.0/dist/plugins/place1.tpl");
    var aw = require("eling/component/utils/ajaxwrapper");
    var Admindivision = require("eling/component/ui/admindivision/1.0.0/dist/admindivision");
    var Place1 = {
        getTemplate: function(item) {
            return utils.compile(tpl, {
                name: item.name,
                fid: item.fid,
                placeholder: item.placeholder || "请输入" + item.label,
                validate: utils.geneValidate(item.validate),
                style: item.style,
                className: item.className
            });
        },
        events: function(item, form) {
            var that = this;
            var events = {};
            events["click ." + item.fid + "-value"] = function(e) {
                item.itemSelected = function(data, type) {
                    that.setValue(data, item, form.element);
                    if (typeof item.onItemSelect === "function") {
                        item.onItemSelect(data, type);
                    }
                };
                item.reset = function() {
                    that.reset();
                    if (typeof item.onReset === "function") {
                        item.onReset();
                    }
                };
                item.close = function() {
                    if (typeof item.onClose === "function") {
                        item.onClose();
                    }
                };
                var admindivision = new Admindivision({
                    parentNode: form.element.find("." + item.fid + "-admindivision"),
                    model: item
                });
                $("." + item.fid + "-admindivision").removeClass("hidden");
            };
            return events;
        },
        setValue: function(value, config, el) {
            el.find("." + config.fid).val(value.id);
            el.find("." + config.fid + "-value").val(value.fullName);
        },
        getValue: function(item, el) {
            return el.find("." + item.fid).val();
        },
        initPlugin: function(el, items, item) {},
        reset: function(item, el) {
            el.find("." + item.fid).val("");
            el.find("." + item.fid + "-value").val("");
        }
    };
    module.exports = Place1;
});

define("eling/component/ui/form/2.0.0/dist/plugins/place1.tpl", [], '<input  class="form-control {{this.fid}}-value {{this.className.value}}" \n	placeholder="{{this.placeholder}}" {{this.validate}} readonly="readonly" style="cursor:pointer;{{this.style.value}}"/>\n<input name="{{this.name}}" type="hidden" class="{{this.fid}}"/>\n<div class="hidden {{this.fid}}-admindivision"></div>\n');

define("eling/component/ui/form/2.0.0/dist/plugins/select", [ "jquery/jquery-plugins/select2/select2", "eling/component/utils/ajaxwrapper", "dialog", "store", "eling/component/ui/form/2.0.0/dist/formutils", "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    require("jquery/jquery-plugins/select2/select2");
    var aw = require("eling/component/utils/ajaxwrapper");
    var utils = require("eling/component/ui/form/2.0.0/dist/formutils");
    var tpl = require("eling/component/ui/form/2.0.0/dist/plugins/select.tpl");
    var cache = {};
    var Select = {
        _geneOptions: function(options, config) {
            var ret = "";
            var key = config.key || "key";
            var value = config.value || "value";
            var valueFormat = config.valueFormat;
            if (!config.multi) {
                var emptyText = config.emptyText || "请选择";
                ret += "<option value=''>" + emptyText + "</option>";
            }
            for (var i = 0; i < options.length; i++) {
                var valueField = value.split(",");
                var valueStr = "";
                for (var j = 0; j < valueField.length; j++) {
                    valueStr += utils._getValue(valueField[j], options[i]) + " ";
                }
                if (typeof valueFormat === "function") {
                    valueStr = valueFormat(valueStr);
                }
                ret += "<option value='" + utils._getValue(key, options[i]) + "'>" + valueStr + "</option>";
            }
            return ret;
        },
        getTemplate: function(item) {
            return utils.compile(tpl, {
                name: item.name,
                fid: item.fid,
                validate: utils.geneValidate(item.validate),
                multi: item.multi ? "multiple" : "",
                style: item.style,
                className: item.className
            });
        },
        getValue: function(item, el) {
            return el.find("." + item.fid).select2("val");
        },
        setValue: function(value, item, el) {
            var keyField = item.key || "key";
            if (value && typeof value == "object" && value.constructor == Array) {} else if (value) {
                value = [ value ];
            } else {
                value = [];
            }
            var result = [];
            for (var i = 0; i < value.length; i++) {
                if (typeof value[i] === "object") {
                    result.push(utils._getValue(keyField, value[i]));
                } else {
                    result.push(value[i]);
                }
            }
            if (result.length != 0) {
                el.find("select." + item.fid).select2("val", result);
            } else {
                el.find("select." + item.fid).select2("val", item.defaultValue || "");
            }
        },
        reset: function(item, el) {
            this.setAttribute(item, "readonly", false);
            this.load({
                options: cache[item.name] || []
            }, item, el);
        },
        initPlugin: function(el, items, item) {
            var that = this;
            var select = el.find("select." + item.fid);
            if (item.url && item.lazy !== true) {
                var params = item.params;
                if (typeof params === "function") {
                    params = params();
                }
                aw.ajax({
                    url: item.url,
                    dataType: "json",
                    data: params,
                    success: function(data) {
                        cache[item.name] = data;
                        select.html(that._geneOptions(data, item));
                        select.select2({});
                        select.select2("val", item.defaultValue || "");
                    }
                });
            } else if (item.options) {
                cache[item.name] = item.options;
                select.html(this._geneOptions(item.options, item));
                select.select2({});
                select.select2("val", item.defaultValue || "");
            } else {
                select.select2({});
                select.select2("val", item.defaultValue || "");
            }
        },
        load: function(param, item, el) {
            var that = this;
            var select = el.find("select." + item.fid);
            if (param && param.options) {
                if (!param.notCache) {
                    cache[item.name] = param.options;
                }
                select.html(that._geneOptions(param.options, item));
                select.select2({});
                select.select2("val", item.defaultValue || "");
                if (param.callback) {
                    param.callback(param.options);
                }
            } else {
                var params = param && param.params ? param.params : item.params;
                if (typeof params === "function") {
                    params = params();
                }
                aw.ajax({
                    url: item.url,
                    dataType: "json",
                    data: params,
                    success: function(data) {
                        if (!param || !param.notCache) {
                            cache[item.name] = data;
                        }
                        select.html(that._geneOptions(data, item));
                        select.select2({});
                        select.select2("val", item.defaultValue || "");
                        if (param && param.callback) {
                            param.callback(data);
                        }
                    }
                });
            }
        },
        setData: function(data, item, el) {
            this.load({
                options: data,
                notCache: true
            }, item, el);
        },
        getData: function(param, config, el) {
            var pks = param ? param.pk : "";
            var copyCache = (cache[config.name] || []).slice();
            if (!pks) {
                //返回所有的数据
                return copyCache || [];
            } else if (pks.constructor == Array) {
                var results = [];
                for (var j = 0; j < pks.length; j++) {
                    var tempParam = param;
                    tempParam.pk = pks[j];
                    results.push(this.getData(tempParam, config, el));
                }
                return results;
            } else {
                var key = config.key;
                var data = copyCache || [];
                for (var i = 0; i < data.length; i++) {
                    if (utils._getValue(key, data[i]) == param.pk) {
                        if (param.field) {
                            return utils._getValue(param.field, data[i]);
                        } else {
                            return data[i];
                        }
                    }
                }
            }
        },
        setAttribute: function(config, attr, value) {
            if (attr == "readonly") {
                $("." + config.fid).select2(attr, value);
            }
        },
        removeAttribute: function(config, attr) {
            if (attr == "readonly") {
                $("." + config.fid).select2("readonly", false);
            } else {
                $("." + config.fid).removeAttr(attr);
            }
        }
    };
    module.exports = Select;
});

define("eling/component/ui/form/2.0.0/dist/plugins/select.tpl", [], '<select name="{{this.name}}" class="form-control {{this.fid}} {{this.className.value}}" {{this.validate}} {{this.multi}} style="{{this.style.value}}"></select>');

define("eling/component/ui/form/2.0.0/dist/plugins/text", [ "eling/component/ui/form/2.0.0/dist/formutils", "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var utils = require("eling/component/ui/form/2.0.0/dist/formutils");
    var tpl = require("eling/component/ui/form/2.0.0/dist/plugins/text.tpl");
    var Text = {
        _getDefaultValue: function(item) {
            return item.defaultValue || (item.defaultValue == 0 ? 0 : "");
        },
        getTemplate: function(item) {
            return utils.compile(tpl, {
                name: item.name,
                fid: item.fid,
                value: this._getDefaultValue(item),
                type: item.type,
                placeholder: item.placeholder || "请输入" + item.label,
                validate: utils.geneValidate(item.validate),
                readonly: item.readonly ? "readonly=readonly" : "",
                style: item.style,
                className: item.className
            });
        },
        getValue: function(item, el) {
            return el.find("." + item.fid).val();
        },
        setValue: function(value, item, el) {
            el.find("." + item.fid).val(utils._getValue(item.value || "key", value) || value || this._getDefaultValue(item) || "");
        },
        reset: function(item, el) {
            el.find("." + item.fid).val(this._getDefaultValue(item));
        }
    };
    module.exports = Text;
});

define("eling/component/ui/form/2.0.0/dist/plugins/text.tpl", [], '<input name="{{this.name}}" class="form-control {{this.fid}} {{this.className.value}}" value="{{this.value}}" \n	type="{{this.type}}" placeholder="{{this.placeholder}}" {{this.validate}} {{this.readonly}} style="{{this.style.value}}"/>\n');

define("eling/component/ui/form/2.0.0/dist/plugins/textarea", [ "eling/component/ui/form/2.0.0/dist/formutils", "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var utils = require("eling/component/ui/form/2.0.0/dist/formutils");
    var tpl = require("eling/component/ui/form/2.0.0/dist/plugins/textarea.tpl");
    var Textarea = {
        _getDefaultValue: function(item) {
            return item.defaultValue || (item.defaultValue == 0 ? 0 : "");
        },
        getTemplate: function(item) {
            return utils.compile(tpl, {
                name: item.name,
                fid: item.fid,
                value: this._getDefaultValue(item),
                placeholder: item.placeholder || "请输入" + item.label,
                validate: utils.geneValidate(item.validate),
                readonly: item.readonly ? "readonly=readonly" : "",
                style: item.style,
                className: item.className
            });
        },
        initPlugin: function(el, items, item) {
            var textarea = el.find("." + item.fid);
            textarea.on("propertychange", function(e) {
                var height = this.scrollHeight < 50 ? 50 : this.scrollHeight;
                this.style.height = height + "px";
            });
            textarea.on("input", function(e) {
                var height = this.scrollHeight < 50 ? 50 : this.scrollHeight;
                this.style.height = height + "px";
            });
        },
        getValue: function(item, el) {
            return el.find("." + item.fid).val();
        },
        setValue: function(value, item, el) {
            var textarea = el.find("." + item.fid);
            textarea.val(utils._getValue(item.value, value) || value || this._getDefaultValue(item) || "");
            el.removeClass("hidden");
            el.parent().removeClass("hidden");
            textarea.trigger("input");
        },
        reset: function(item, el) {
            el.find("." + item.fid).val(this._getDefaultValue(item));
        }
    };
    module.exports = Textarea;
});

define("eling/component/ui/form/2.0.0/dist/plugins/textarea.tpl", [], '<textarea name="{{this.name}}" class="form-control {{this.fid}} {{this.className.value}}"\n placeholder="{{this.placeholder}}" {{this.validate}} {{this.readonly}} style="{{this.style.value}}">{{this.value}}</textarea>\n');

define("eling/component/ui/form/2.0.0/dist/plugins/checkradio", [ "eling/component/ui/form/2.0.0/dist/formutils", "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var utils = require("eling/component/ui/form/2.0.0/dist/formutils");
    var tpl = require("eling/component/ui/form/2.0.0/dist/plugins/checkradio.tpl");
    var CheckRadio = {
        _getBooleanValue: function(str) {
            return str === "true" ? true : str === "false" ? false : str;
        },
        getTemplate: function(item) {
            var model = [];
            var list = item.list || [];
            for (var i = 0; i < list.length; i++) {
                var temp = {
                    name: list[i].name || item.name,
                    fid: item.fid,
                    //加一个disabeld参数
                    type: list[i].type || (item.type == "checklist" ? "checkbox" : "radio"),
                    key: list[i].key,
                    value: list[i].value,
                    isDefault: list[i].isDefault ? "checked='checked'" : "",
                    disabled: list[i].disabled ? "disabled='disabled'" : "",
                    validate: utils.geneValidate(item.validate),
                    style: item.style,
                    className: item.className
                };
                model.push(temp);
            }
            return utils.compile(tpl, model);
        },
        getValue: function(item, el) {
            var that = this;
            var fid = item.fid;
            var list = item.list || [];
            var results = [];
            el.find("." + fid).each(function(i, el) {
                if (el.checked) {
                    results.push(that._getBooleanValue(list[i].key));
                }
            });
            return item.type == "checklist" ? results : results[0];
        },
        setValue: function(value, item, el) {
            if (!value) {
                //恢复默认值
                this.reset(item, el);
                return;
            }
            //清空原数据
            el.find("." + item.fid).removeAttr("checked");
            //设置新值
            value = item.type == "checklist" ? value : [ value ];
            for (var i = 0; i < value.length; i++) {
                var temp = utils._getValue(item.value || "key", value[i]) || value[i] || "";
                el.find("." + item.fid + "-" + temp).prop("checked", "checked");
            }
        },
        reset: function(item, el) {
            el.find("." + item.fid).removeAttr("checked");
            var list = item.list || [];
            for (var i = 0; i < list.length; i++) {
                if (list[i].isDefault) {
                    el.find("." + item.fid + "-" + list[i].key).prop("checked", "checked");
                }
            }
        }
    };
    module.exports = CheckRadio;
});

define("eling/component/ui/form/2.0.0/dist/plugins/checkradio.tpl", [], '<div>\n	{{#each this}}\n	<label class="{{this.type}}-inline">\n		<input name="{{this.name}}" value="{{this.key}}" type="{{this.type}}" {{this.validate}} \n			class="{{this.fid}} {{this.fid}}-{{this.key}}" {{this.isDefault}} {{this.disabled}}>{{this.value}}\n	</label>\n	{{/each}}\n</div>\n');

define("eling/component/ui/form/2.0.0/dist/plugins/autocomplete", [ "jquery/jquery-plugins/autocomplete/autocomplete", "eling/component/ui/form/2.0.0/dist/formutils", "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    require("jquery/jquery-plugins/autocomplete/autocomplete");
    var utils = require("eling/component/ui/form/2.0.0/dist/formutils");
    var Check_Radio = {
        getTemplate: function(param) {
            var validate = utils.geneValidate(param.validate);
            return "<input type='hidden' name='" + param.name + "' class='J-" + param.name + "'/>" + "<input class='form-control J-autocomplete-" + param.name + "' placeholder='请输入关键字' " + validate + "/>";
        },
        initPlugin: function(el, items, item) {
            var params = item.params;
            if (typeof params === "function") {
                params = params();
            }
            el.find(".J-autocomplete-" + item.name).autocomplete({
                url: item.url,
                minChars: 1,
                extraParams: params,
                processData: function(data, value) {
                    var results = [];
                    for (var j = 0; j < data.length; j++) {
                        results.push({
                            value: utils._getValue(item.value || "value", data[j]),
                            data: data[j]
                        });
                    }
                    return results;
                },
                showResult: function(value, data) {
                    if (item.showResult) {
                        return item.showResult(value, data);
                    } else {
                        return value;
                    }
                },
                onItemSelect: function(selectData) {
                    var data = selectData.data;
                    var keyField = item.key || "keyField";
                    var valueField = item.value || "valueField";
                    $(".J-" + item.name).val(data[keyField]);
                    var value = utils._getValue(valueField, data);
                    $(".J-autocomplete-" + item.name).val(item.showResult ? item.showResult(value, data) : value);
                },
                mustMatch: true,
                maxItemsToShow: 5,
                selectFirst: false,
                autoFill: false,
                selectOnly: true,
                remoteDataType: "json"
            });
        },
        getValue: function(config, el) {},
        setValue: function(value, config, el, data) {
            var keyField = config.key || "key";
            var key = value[keyField] || "";
            var val = config.showResult ? config.showResult(value, data) : value;
            el.find(".J-" + config.name).val(key);
            el.find(".J-autocomplete-" + config.name).val(val);
        },
        reset: function(param, el) {}
    };
    module.exports = Check_Radio;
});

define("eling/component/ui/form/2.0.0/dist/form.tpl", [], "<div class='container el-form'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n				<div class='col-sm-12'>\n					<div class='box'>\n						<div class='box-content'>\n							<form class=\"form form-horizontal\" id=\"{{this.id}}\">\n								{{#each this.items}}\n									<div class=\"form-group {{this.show}} {{this.className.container}}\" style=\"{{this.style.container}}\">\n										<label class=\"col-md-2 control-label J-form-label-{{this.name}} \n											{{this.className.label}}\" style=\"{{this.style.label}}\">{{this.label}}</label>\n										<div class=\"col-md-6 {{this.className.valueContainer}}\">\n											{{#form_2_0_0 this}}{{/form_2_0_0}}\n										</div>\n										{{#if this.isRequired}}\n										<div class=\"required\">*</div>\n										{{/if}}\n									</div>\n								{{/each}}\n								<div class=\"clear\"></div>\n								{{#if this.defaultButton}}\n								<div class='el-form-buttons J-button-area'>\n									<div class='row'>\n										<div class='col-md-10 col-md-offset-2'>\n											<button class='J-form-save J-form-{{this.id}}-save btn btn-theme' type='submit'>\n												<span class='J-form-saveText J-form-{{this.id}}-saveText'>{{this.saveText}}</span>\n											</button>\n	                            			<a class='J-form-cancel J-form-{{this.id}}-cancel btn' href=\"javascript:void(0);\">{{this.cancelText}}</a>\n	                          			</div>\n	                       			</div>\n                      			</div>\n                      			{{/if}}\n                      		</form>\n                      	</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n                      	");
