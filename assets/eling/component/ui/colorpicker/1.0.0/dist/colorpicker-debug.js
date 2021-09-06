/**
 * 颜色选择控件
 */
define("eling/component/ui/colorpicker/1.0.0/dist/colorpicker-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./colorpicker.tpl", "jquery/jquery-plugins/spectrum/spectrum", "jquery" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var template = require("./colorpicker.tpl");
    require("jquery/jquery-plugins/spectrum/spectrum");
    (function($) {
        var localization = $.spectrum.localization["zh-cn"] = {
            cancelText: "取消",
            chooseText: "选择",
            clearText: "清除",
            togglePaletteMoreText: "更多选项",
            togglePaletteLessText: "隐藏",
            noColorSelectedText: "尚未选择任何颜色"
        };
        $.extend($.fn.spectrum.defaults, localization);
    })(jQuery);
    var ColorPicker = UIComponent.extend({
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
                options: {
                    showInput: true,
                    showPaletteOnly: true,
                    togglePaletteOnly: true,
                    preferredFormat: "hex",
                    color: "#ffffff",
                    palette: [ [ "#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff" ], [ "#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f" ], [ "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc" ], [ "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd" ], [ "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0" ], [ "#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79" ], [ "#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47" ], [ "#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130" ] ]
                },
                /*自身的参数*/
                type: "colorpicker"
            }
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
        afterRender: function() {
            var model = this.get("model");
            var el = this.element;
            var events = {
                change: function(color) {
                    var colorValue = color.toHexString();
                    $("span i", el).css("background-color", colorValue);
                    $("input", el).val(colorValue);
                },
                move: function(color) {
                    var colorValue = color.toHexString();
                    $("span i", el).css("background-color", colorValue);
                    $("input", el).val(colorValue);
                }
            };
            model.options = $.extend({}, events, model.options);
            model.options.disabled = model.disabled;
            $("input", el).spectrum(model.options);
            $("input", el).spectrum("set", model.value);
        },
        /**
         * @name:setValue
         * @params:string
         */
        setValue: function(value) {
            var el = this.element;
            $("span i", el).css("background-color", value);
            $("input", el).val(value);
            $("input", el).spectrum("set", value);
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
            var el = this.element;
            //如果设置了defaultValue
            if (model.defaultValue !== null && model.defaultValue !== undefined) {
                this.$("span i").css("background-color", model.defaultValue);
                $("input", el).val(model.defaultValue);
                $("input", el).spectrum("set", model.defaultValue);
            } else {
                this.$("span i").css("background-color", "");
                $("input", el).val("");
                $("input", el).spectrum("set", "");
            }
            //如果设置了readonly
            if (model.readonly) {
                this.setReadonly(true);
            }
            //如果设置了disabled
            if (model.disabled) {
                this.setDisabled(true);
            }
        },
        /**
         * @name:setReadonly
         * @params:boolean
         */
        setReadonly: function(mark) {
            if (mark) {
                this.$("input").attr("readonly", "readonly");
                this.$("input").spectrum("disable");
            } else {
                this.$("input").removeAttr("readonly");
                this.$("input").spectrum("enable");
            }
        },
        /**
         * @name:setDisabled
         * @params:boolean
         */
        setDisabled: function(mark) {
            if (mark) {
                this.$("input").spectrum("disable");
            } else {
                this.$("input").spectrum("enable");
            }
        },
        /**
         * @name:setText
         * @params:string
         */
        setText: function(text) {
            var el = this.element;
            this.$("span i").css("background-color", text);
            this.$("input").val(text);
            $("input", el).spectrum("set", text);
        },
        /**
         * @name:getText
         */
        getText: function() {
            return this.$("input").val();
        }
    });
    module.exports = ColorPicker;
});

define("eling/component/ui/colorpicker/1.0.0/dist/colorpicker.tpl", [], '<div class="el-colorpicker input-append color input-group {{this.className}}" style="{{this.style}}" >\n	<input id="{{this.id}}" name="{{this.name}}" type="{{this.type}}" placeholder="{{this.placeholder}}"\n		class="form-control colorpicker-hex" value="{{this.value}}" {{this.readonly}} {{this.disabled}} {{this.validate}}/>\n</div>\n\n\n');
