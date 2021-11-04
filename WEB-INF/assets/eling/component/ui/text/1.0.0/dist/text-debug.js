/**
 * @name text
 * @version 1.0.0
 * @description 普通文本框
 * @inherit uicomponent-2.0.0
 * @dependencies ["tools"]
 */
define("eling/component/ui/text/1.0.0/dist/text-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./text.tpl" ], function(require, exports, module) {
    //基类
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    //工具
    var tools = require("eling/component/utils/tools/tools");
    var template = require("./text.tpl");
    var Text_1_0_0 = UIComponent.extend({
        attrs: {
            autoRender: true,
            template: template,
            model: {
                /*UI组件的基本参数*/
                id: null,
                className: null,
                style: null,
                /*表单基本元素的参数*/
                name: null,
                placeholder: null,
                readonly: false,
                disabled: false,
                defaultValue: null,
                /*自身的参数*/
                type: "text"
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
        initCustAttr: function() {
            var model = this.get("model");
            //设置是否可以编辑
            model.readonly = model.readonly ? "readonly=readonly" : "";
            model.disabled = model.disabled ? "disabled=disabled" : "";
            //设置默认值
            if (model.defaultValue !== null && model.defaultValue !== undefined) {
                model.value = model.defaultValue;
            }
        },
        /**
		 * @name:setValue
		 * @params:string
		 */
        setValue: function(value) {
            this.$("input").val(value);
        },
        /**
		 * @name:getValue
		 */
        getValue: function() {
            return this.$("input").val();
        },
        /**
		 * @name:reset
		 */
        reset: function() {
            var model = this.get("model");
            //如果设置了defaultValue
            if (model.defaultValue !== null && model.defaultValue !== undefined) {
                this.$("input").val(model.defaultValue);
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
        /**
		 * @name:setReadonly
		 * @params:boolean
		 */
        setReadonly: function(mark) {
            if (mark) {
                this.$("input").attr("readonly", "readonly");
            } else {
                this.$("input").removeAttr("readonly");
            }
        },
        /**
		 * @name:setDisabled
		 * @params:boolean
		 */
        setDisabled: function(mark) {
            if (mark) {
                this.$("input").attr("disabled", "disabled");
            } else {
                this.$("input").removeAttr("disabled");
            }
        },
        /**
		 * @name:setText
		 * @params:string
		 */
        setText: function(text) {
            this.$("input").val(text);
        },
        /**
		 * @name:getText
		 */
        getText: function() {
            return this.$("input").val();
        }
    });
    module.exports = Text_1_0_0;
});

define("eling/component/ui/text/1.0.0/dist/text.tpl", [], '<div class="el-text {{this.className}}" style="{{this.style}}">\n	<input id="{{this.id}}" name="{{this.name}}" type="{{this.type}}" placeholder="{{this.placeholder}}" \n		class="form-control" value="{{this.value}}" {{this.readonly}} {{this.disabled}} {{this.validate}}/>\n</div>\n');
