/**
 * @name text
 * @version 1.0.0
 * @description input
 * @dependencies ["uicomponent-2.0.0","tools"]
 */
define("eling/component/ui/select/1.0.0/dist/select-debug", [ "jquery/jquery-plugins/select2/select2", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./select.tpl" ], function(require, exports, module) {
    require("jquery/jquery-plugins/select2/select2");
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var template = require("./select.tpl");
    var Select_1_0_0 = UIComponent.extend({
        attrs: {
            template: template,
            autoRender: true,
            optionsMap: {},
            model: {
                id: null,
                className: null,
                style: null,
                name: null,
                placeholder: "请选择",
                readonly: false,
                disabled: false,
                defaultValue: null,
                multi: false,
                options: [],
                url: null,
                params: null,
                keyField: "key",
                valueField: "value"
            }
        },
        initCustAttr: function() {
            var model = this.get("model");
            if (model.multi === true) {
                model.multi = "multiple";
            }
            //为了兼容早期版本的form的select，所以将key配置转换成keyField，将value配置转换成valueField
            if (model.key) {
                model.keyField = model.key;
            }
            if (model.value) {
                model.valueField = model.value;
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
            this.initPlugin(this.get("model"));
        },
        initPlugin: function(config) {
            if (config.url && config.lazy !== true) {
                this._loadData(config);
            } else {
                this.$("select").html(this._geneOptions(config.options, config)).select2({
                    placeholder: config.placeholder,
                    allowClear: true
                });
                this._setDefaultValue();
                this._setReadonly();
            }
        },
        _setDefaultValue: function() {
            var model = this.get("model");
            if (model.defaultValue === true) {
                //设置第一个作为默认值
                this.$("select").select2("val", tools._getValueFromObject(model.keyField, model.options[0]));
            }
            if (typeof model.defaultValue === "number") {
                //按索引设置
                this.$("select").select2("val", tools._getValueFromObject(model.keyField, model.options[model.defaultValue]));
            }
            if (tools.isString(model.defaultValue)) {
                //按key设置
                this.setValue(model.defaultValue);
            }
            if (model.defaultText) {
                //按value设置
                this.setText(model.defaultText);
            }
        },
        _setReadonly: function() {
            var model = this.get("model");
            this.setReadonly(model.readonly);
            this.setDisabled(model.disabled);
        },
        _loadData: function(config, callback) {
            var that = this;
            var params = config.params;
            if (tools.isFunction(params)) {
                params = params();
            }
            $.ajax({
                url: config.url,
                data: params,
                dataType: "json",
                success: function(data) {
                    config.options = data;
                    that.$("select").html(that._geneOptions(data, config)).select2({
                        placeholder: config.placeholder,
                        allowClear: true
                    });
                    that._setDefaultValue();
                    that._setReadonly();
                }
            });
        },
        _geneOptions: function(options, config) {
            var ret = "";
            var keyField = config.keyField;
            var valueField = config.valueField;
            if (!config.multi) {
                ret += "<option></option>";
            }
            var optionsMap = this.get("optionsMap");
            optionsMap = {};
            for (var i in options) {
                var key = tools._getValueFromObject(keyField, options[i]);
                var value = "";
                if (config.format) {
                    value = config.format(options[i]);
                } else {
                    value = tools._getValueFromObject(valueField, options[i]);
                }
                ret += "<option value='" + key + "'>" + value + "</option>";
                optionsMap[key] = options[i];
            }
            this.set("optionsMap", optionsMap, {
                override: true
            });
            return ret;
        },
        getValue: function() {
            return this.$("select").select2("val");
        },
        setValue: function(key) {
            var model = this.get("model");
            var optionsMap = this.get("optionsMap");
            if (!key) {
                return;
            }
            if (key.constructor !== Array) {
                key = [ key ];
            }
            var results = [];
            for (var i in key) {
                var val = "";
                if (typeof key[i] == "object") {
                    val = tools._getValueFromObject(model.keyField, key[i]);
                } else {
                    val = key[i];
                }
                if (!(val in optionsMap) && val !== "" && val !== null && val !== undefined) {
                    //生成一个option的html
                    var value = tools.isFunction(model.format) ? model.format(key[i]) : tools._getValueFromObject(model.valueField, key[i]);
                    var html = "<option value='" + val + "'>" + value + "</option>";
                    this.$("select").append(html);
                }
                results.push(val);
            }
            this.$("select").select2("val", results);
        },
        setText: function(text) {
            var keys = [];
            var model = this.get("model");
            var options = model.options;
            if (text.constructor !== Array) {
                text = [ text ];
            }
            for (var i in text) {
                for (var j in options) {
                    var value = tools._getValueFromObject(model.valueField, options[j]);
                    if (value == text[i]) {
                        var key = tools._getValueFromObject(model.keyField, options[j]);
                        keys.push(key);
                    }
                }
            }
            this.setValue(keys);
        },
        getText: function() {
            return this.$("select").find("option:selected").text();
        },
        setData: function(data) {
            this.load({
                options: data
            });
        },
        load: function(params) {
            var that = this;
            var model = this.get("model");
            var select = this.$("select");
            if (params && params.options) {
                //重写缓存
                model.options = params.options;
                select.html(this._geneOptions(model.options, model));
                select.select2({
                    placeholder: model.placeholder,
                    allowClear: true
                });
                if (params.callback) {
                    params.callback(params.options);
                }
            } else {
                var queryParams = params && params.params ? params.params : model.params;
                if (tools.isFunction(queryParams)) {
                    queryParams = queryParams();
                }
                $.ajax({
                    url: model.url,
                    data: queryParams,
                    dataType: "json",
                    success: function(data) {
                        //重写缓存
                        model.options = data;
                        select.html(that._geneOptions(data, model));
                        select.select2({
                            placeholder: model.placeholder,
                            allowClear: true
                        });
                        if (params && params.callback) {
                            params.callback(data);
                        }
                    }
                });
            }
        },
        reset: function() {
            this.load({
                options: this.get("model").options
            });
            this._setDefaultValue();
            this._setReadonly();
        },
        getData: function(value) {
            var model = this.get("model");
            var options = model.options;
            if (value) {
                for (var i in options) {
                    if (tools._getValueFromObject(model.keyField, options[i]) == value) {
                        return options[i];
                    }
                }
            } else {
                return options;
            }
        },
        open: function() {
            this.$("select").select2("open");
        },
        destroy: function() {
            this.$("select").select2("destroy");
            Select_1_0_0.superclass.destroy.call(this, arguments);
        },
        setReadonly: function(mark) {
            if (mark) {
                this.$("select").select2("readonly", true);
            } else {
                this.$("select").select2("readonly", false);
            }
        },
        setDisabled: function(mark) {
            this.$("select").prop("disabled", mark);
        }
    });
    module.exports = Select_1_0_0;
});

define("eling/component/ui/select/1.0.0/dist/select.tpl", [], '<div class="el-select {{this.className}}" style="{{this.style}}">\n	<select id="{{this.id}}" name="{{this.name}}" class="form-control" {{this.multi}} {{this.validate}}></select>\n</div>');
