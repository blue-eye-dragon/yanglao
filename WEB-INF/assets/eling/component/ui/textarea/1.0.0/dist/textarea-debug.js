/**
 * @name textarea
 * @version 1.0.0
 * @description 文本域
 * @inherit uicomponent
 * @dependencies ["tools","autosize"]
 */
define("eling/component/ui/textarea/1.0.0/dist/textarea-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./textarea.tpl", "jquery/jquery-plugins/autosize/jquery.autosize" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var template = require("./textarea.tpl");
    require("jquery/jquery-plugins/autosize/jquery.autosize");
    var Textarea_1_0_0 = UIComponent.extend({
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
                defaultValue: null
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
            //设置默认值
            if (model.defaultValue !== null && model.defaultValue !== undefined) {
                model.value = model.defaultValue;
            }
            //设置是否可以编辑
            model.readonly = model.readonly ? "readonly='readonly'" : "";
            model.disabled = model.disabled ? "disabled='disabled'" : "";
            //设置默认高度
            if (model.height) {
                model.innerStyle = "height:" + model.height + "px;";
            }
        },
        afterRender: function() {
            this.$("textarea").autosize();
        },
        /**
		 * @name:setValue
		 * @params:string
		 */
        setValue: function(value) {
            this.$("textarea").val(value);
        },
        /**
		 * @name:setValue
		 */
        getValue: function() {
            return this.$("textarea").val();
        },
        /**
		 * @name:setValue
		 * @params:string
		 */
        setDisabled: function(mark) {
            if (mark) {
                this.$("textarea").attr("disabled", "disabled");
            } else {
                this.$("textarea").removeAttr("disabled");
            }
        },
        /**
		 * @name:setValue
		 * @params:string
		 */
        setReadonly: function(mark) {
            if (mark) {
                this.$("textarea").attr("readonly", "readonly");
            } else {
                this.$("textarea").removeAttr("readonly");
            }
        },
        /**
		 * @name:setValue
		 * @params:string
		 */
        reset: function() {
            var model = this.get("model");
            //如果设置了defaultValue
            if (model.defaultValue !== null && model.defaultValue !== undefined) {
                this.$("textarea").val(model.defaultValue);
            } else {
                this.$("textarea").val("");
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
        setText: function(text) {
            this.$("textarea").val(text);
        },
        getText: function() {
            return this.$("textarea").val();
        }
    });
    module.exports = Textarea_1_0_0;
});

define("eling/component/ui/textarea/1.0.0/dist/textarea.tpl", [], '<div class="el-textarea {{this.className}}" style="{{this.style}}">\n	<textarea id="{{this.id}}" style="{{this.innerStyle}}" name="{{this.name}}" class="form-control {{this.innerClassName}}" \n		placeholder="{{this.placeholder}}" {{this.readonly}} {{this.disabled}} {{this.validate}}>{{this.value}}</textarea>\n</div>\n\n\n\n');
