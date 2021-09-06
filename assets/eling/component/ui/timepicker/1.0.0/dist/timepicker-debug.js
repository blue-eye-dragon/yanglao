define("eling/component/ui/timepicker/1.0.0/dist/timepicker-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "./timepicker.tpl", "eling/component/utils/tools/tools", "jquery/jquery-plugins/timepicker-addon/jquery-ui-timepicker-addon", "$", "jquery.ui" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var template = require("./timepicker.tpl");
    var tools = require("eling/component/utils/tools/tools");
    require("jquery/jquery-plugins/timepicker-addon/jquery-ui-timepicker-addon");
    var TimepickerAddon = UIComponent.extend({
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
        initCustAttr: function() {
            var model = this.get("model");
            //设置默认值
            if (model.defaultValue !== null && model.defaultValue !== undefined) {
                model.value = model.defaultValue;
            }
            //设置是否可以编辑
            model.readonly = model.readonly ? "readonly='readonly'" : "";
            model.disabled = model.disabled ? "disabled='disabled'" : "";
        },
        afterRender: function() {
            var model = this.get("model");
            this.plugin = this.$("input").datetimepicker1(model.pluginConfig || {
                timeFormat: "HH:mm:ss",
                dateFormat: "yy-mm-dd"
            });
        },
        /**
		 * @name:setValue
		 * @params:string
		 */
        setValue: function(value) {
            var result = null;
            if (value === null || value === undefined || value === "") {
                return;
            } else if (tools.isString(value)) {
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
            this.plugin.datetimepicker("setDate", new Date(moment(result).valueOf()));
        },
        /**
		 * @name:setValue
		 */
        getValue: function() {
            return moment(this.plugin.datetimepicker("getDate")).valueOf();
        },
        /**
		 * @name:setValue
		 * @params:string
		 */
        setDisabled: function(mark) {
            if (mark) {
                this.$("input").attr("disabled", "disabled");
            } else {
                this.$("input").removeAttr("disabled");
            }
        },
        /**
		 * @name:setValue
		 * @params:string
		 */
        setReadonly: function(mark) {
            if (mark) {
                this.$("input").attr("disabled", "disabled");
            } else {
                this.$("input").removeAttr("disabled");
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
        }
    });
    module.exports = TimepickerAddon;
});

define("eling/component/ui/timepicker/1.0.0/dist/timepicker.tpl", [], '<div class="el-timepicker-addon {{this.className}}" style="{{this.style}}">\n	<input id="{{this.id}}" name="{{this.name}}" type="text" placeholder="{{this.placeholder}}"\n		class="form-control" value="{{this.value}}" {{this.readonly}} {{this.disabled}} {{this.validate}}/>\n</div>\n');
