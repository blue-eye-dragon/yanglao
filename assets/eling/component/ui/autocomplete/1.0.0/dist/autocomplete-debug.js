define("eling/component/ui/autocomplete/1.0.0/dist/autocomplete-debug", [ "jquery/jquery-plugins/autocomplete/autocomplete", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./autocomplete.tpl" ], function(require, exports, module) {
    require("jquery/jquery-plugins/autocomplete/autocomplete");
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var template = require("./autocomplete.tpl");
    var Autocomplete_1_0_0 = UIComponent.extend({
        attrs: {
            template: template,
            autoRender: true,
            model: {
                id: null,
                name: null,
                className: null,
                style: null,
                url: null,
                params: null,
                keyField: "key",
                valueField: "value",
                disabled: false,
                readonly: false
            }
        },
        afterRender: function() {
            var model = this.get("model");
            this.initPlugin(model);
            this.setDisabled(model.disabled);
            this.setReadonly(model.readonly);
        },
        initPlugin: function(config) {
            var that = this;
            var el = this.$("input");
            var defaultConfig = {
                minChars: 1,
                processData: function(datas, value) {
                    var results = [];
                    for (var i in datas) {
                        var value = tools._getValueFromObject(config.valueField, datas[i]);
                        results.push({
                            value: config.format ? config.format(datas[i]) : value,
                            data: datas[i]
                        });
                    }
                    return results;
                },
                showResult: function(value, data) {
                    if (config.format) {
                        return config.format(data);
                    } else {
                        return value;
                    }
                },
                mustMatch: true,
                maxItemsToShow: 5,
                selectFirst: true,
                autoFill: false,
                selectOnly: true,
                remoteDataType: "json"
            };
            var pluginConfig = $.extend(true, defaultConfig, config);
            var params = config.params;
            if (typeof params === "function") {
                params = params();
            }
            pluginConfig.extraParams = params;
            pluginConfig.onItemSelect = function(selectData) {
                that.setData(selectData.data);
                if (config.onItemSelect) {
                    config.onItemSelect(selectData.data);
                }
            };
            el.autocomplete(pluginConfig);
        },
        setValue: function(value) {
            var model = this.get("model");
            var ret = null;
            if (model.format) {
                ret = model.format(value);
            } else if (model.valueField) {
                ret = tools._getValueFromObject(model.valueField, value);
            } else {
                ret = value;
            }
            var key = tools._getValueFromObject(model.keyField, value);
            this.$("input").val(ret).attr("data-key", key);
        },
        getValue: function() {
            return this.$("input").attr("data-key");
        },
        setData: function(data) {
            this.set("data", data);
            this.setValue(data);
        },
        getData: function() {
            return this.get("data");
        },
        reset: function() {
            this.$("input").val("").removeAttr("data-key");
            this.set("data", null);
            var model = this.get("model");
            this.setDisabled(model.disabled);
            this.setReadonly(model.readonly);
        },
        setDisabled: function(mark) {
            if (mark) {
                this.$("input").attr("disabled", "disabled");
            } else {
                this.$("input").removeAttr("disabled");
            }
        },
        setReadonly: function(mark) {
            if (mark) {
                this.$("input").attr("readonly", "readonly");
            } else {
                this.$("input").removeAttr("readonly");
            }
        },
        getInstance: function() {
            return this.$("input").data("autocompleter");
        }
    });
    module.exports = Autocomplete_1_0_0;
});

define("eling/component/ui/autocomplete/1.0.0/dist/autocomplete.tpl", [], "<div class=\"el-autocomplete {{this.className}}\" style=\"{{this.style}}\">\n	<input id='{{this.id}}' name='{{this.name}}' type='text' placeholder ='{{this.placeholder}}' \n		class='form-control' value='{{this.value}}'  {{this.validate}}/>\n</div>\n\n");
