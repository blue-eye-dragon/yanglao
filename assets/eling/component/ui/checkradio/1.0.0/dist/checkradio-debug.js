/**
 * @name checklist
 * @version 1.0.0
 * @description 多个checkbox列表
 * @inherit uicomponent
 * @dependencies ["tools"]
 */
define("eling/component/ui/checkradio/1.0.0/dist/checkradio-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./checkradio.tpl" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var template = require("./checkradio.tpl");
    var Checkradio_1_0_0 = UIComponent.extend({
        attrs: {
            template: template,
            autoRender: true,
            model: {
                /*UI组件的基本参数*/
                id: null,
                style: null,
                className: null,
                /*表单基本元素的参数*/
                name: null,
                placeholder: null,
                readonly: null,
                disabled: null,
                defaultValue: null,
                /*自身的参数*/
                list: []
            }
        },
        events: function() {
            var that = this;
            var model = this.get("model");
            var results = {};
            var events = this.get("model").events;
            for (var i in events) {
                if (i == "click") {
                    results["click input"] = function(e) {
                        if (that.get("curEditable") === false) {
                            e.preventDefault();
                            return false;
                        } else {
                            events[i].call(that, e);
                        }
                    };
                } else {
                    results[i + " input"] = events[i];
                }
            }
            if (results["click input"] === undefined) {
                results["click input"] = function(e) {
                    if (that.get("curEditable") === false) {
                        e.preventDefault();
                        return false;
                    }
                };
            }
            return results;
        },
        initCustAttr: function() {
            var model = this.get("model");
            if (model.defaultValue === null || model.defaultValue === undefined) {
                model.defaultValue = [];
            }
            //设置默认值
            var list = model.list;
            for (var i in list) {
                list[i].name = model.name;
                list[i].type = list[i].type || model.type;
                if (list[i].isDefault || list[i].key === model.defaultValue || model.defaultValue.indexOf(list[i].key) != -1) {
                    list[i].checked = "checked='checked'";
                }
            }
        },
        afterRender: function() {
            this._setEditable();
        },
        /**
		 * @name:setValue
		 * @params:string | number | object | Array[string | number | object]
		 */
        setValue: function(value) {
            //清空原数据
            this.$("input").removeAttr("checked");
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                value = [ value ];
            }
            for (var i in value) {
                var val = null;
                if (tools.isObject(value[i])) {
                    val = tools._getValueFromObject("key", value[i]);
                } else {
                    val = value[i];
                }
                this.$("input[value='" + val + "']").prop("checked", true);
            }
        },
        /**
		 * @name:getValue
		 */
        getValue: function() {
            var results = [];
            var model = this.get("model");
            var list = model.list;
            this.$("input[type='checkbox'],input[type='radio']").each(function(i, el) {
                if (el.checked) {
                    results.push(list[i].key);
                }
            });
            return model.type == "checkbox" ? results : results[0];
        },
        /**
		 * @name:reset
		 */
        reset: function() {
            this.$("input").removeAttr("checked");
            var model = this.get("model");
            var list = model.list;
            //设置默认值
            for (var i in list) {
                if (list[i].isDefault || list[i].key === model.defaultValue) {
                    this.setValue(list[i].key);
                }
            }
            this._setEditable();
        },
        /**
		 * @name:setReadonly
		 * @params:boolean
		 */
        setReadonly: function(mark) {
            this.set("curEditable", !mark);
        },
        /**
		 * @name:setDisabled
		 * @params:boolean
		 */
        setDisabled: function(mark) {
            this.set("curEditable", !mark);
            if (mark) {
                this.$("input").attr("disabled", "disabled");
            } else {
                this.$("input").removeAttr("disabled");
            }
        },
        _setEditable: function() {
            var model = this.get("model");
            if (model.readonly) {
                this.setReadonly(true);
            } else if (model.disabled) {
                this.setDisabled(true);
            } else {
                this.set("curEditable", true);
                this.setReadonly(false);
                this.setDisabled(false);
            }
        }
    });
    module.exports = Checkradio_1_0_0;
});

define("eling/component/ui/checkradio/1.0.0/dist/checkradio.tpl", [], '<div id="{{this.id}}" class="el-checkradio {{this.className}}" style="{{this.style}}">\n	{{#each this.list}}\n		<label class="{{this.type}}-inline">\n			<input name="{{this.name}}" value="{{this.key}}" type="{{this.type}}" {{this.checked}} {{this.disabled}} {{this.validate}}>{{{this.value}}}\n		</label>\n	{{/each}}\n</div>');
