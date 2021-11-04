/**
 * @name text
 * @version 1.0.0
 * @description input
 * @dependencies ["uicomponent-2.0.0","tools"]
 */
define("eling/component/ui/number/1.0.0/dist/number-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./number.tpl" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var template = require("./number.tpl");
    var Number_1_0_0 = UIComponent.extend({
        attrs: {
            autoRender: true,
            template: template,
            model: {
                id: null,
                className: null,
                style: "width:100%;",
                name: null,
                placeholder: null,
                readonly: false,
                disabled: false,
                defaultValue: null,
                step: 1,
                min: 0,
                max: Infinity,
                layout: "right"
            }
        },
        events: function() {
            var that = this;
            var model = this.get("model");
            var results = {};
            var events = model.events;
            for (var i in events) {
                results[i + " #" + model.id] = events[i];
            }
            results["click .J-number-plus"] = function(e) {
                var current = parseInt(that.getValue());
                var nextValue = current + model.step;
                if (nextValue <= model.max) {
                    that.setValue(nextValue);
                } else {
                    that.setValue(model.max);
                }
            };
            results["click .J-number-minus"] = function(e) {
                var current = parseInt(that.getValue());
                var prevValue = current - model.step;
                if (prevValue >= model.min) {
                    that.setValue(prevValue);
                } else {
                    that.setValue(model.min);
                }
            };
            results["blur input"] = function(e) {
                var value = $(e.currentTarget).val();
                if (isNaN(value)) {
                    that.reset();
                }
            };
            return results;
        },
        initCustAttr: function() {
            var model = this.get("model");
            model.readonly = model.readonly ? "readonly='readonly'" : "";
            model.disabled = model.disabled ? "disabled='disabled'" : "";
            if (model.defaultValue !== null && model.defaultValue !== undefined) {
                model.value = model.defaultValue;
            }
            if (model.layout == "left") {
                model.isLeft = true;
            } else if (model.layout == "ltr") {
                model.isLTR = true;
            } else {
                model.isRight = true;
            }
        },
        afterRender: function() {
            var model = this.get("model");
            this.setReadonly(model.readonly);
            this.setDisabled(model.disabled);
        },
        setValue: function(value) {
            var model = this.get("model");
            if (!isNaN(value) && value <= model.max && value >= model.min) {
                this.$("input").val(value);
            }
        },
        getValue: function() {
            return this.$("input").val();
        },
        setDisabled: function(mark) {
            if (mark) {
                this.$("input").attr("disabled", "disabled");
                this.$(".btn").addClass("hidden");
            } else {
                this.$("input").removeAttr("disabled");
                this.$(".btn").removeClass("hidden");
            }
        },
        setReadonly: function(mark) {
            if (mark) {
                this.$("input").attr("readonly", "readonly");
                this.$(".btn").addClass("hidden");
            } else {
                this.$("input").removeAttr("readonly");
                this.$(".btn").removeClass("hidden");
            }
        },
        reset: function() {
            var model = this.get("model");
            this.$("input").val(model.min);
            this.setReadonly(model.readonly);
            this.setDisabled(model.disabled);
        }
    });
    module.exports = Number_1_0_0;
});

define("eling/component/ui/number/1.0.0/dist/number.tpl", [], '<div class="el-number input-group {{this.className}}" style="{{this.style}}">\n	{{#if this.isRight}}\n		<input id="{{this.id}}" name="{{this.name}}" type="text" \n			class="form-control" value="{{this.min}}" {{this.validate}} placeholder="{{this.placeholder}}"/>\n		{{#unless this.readonly}}\n		<span class="btn btn-danger input-group-addon J-number-minus">\n			<span class="icon-minus"></span>\n		</span>\n		<span class="btn btn-danger input-group-addon J-number-plus">\n			<span class="icon-plus"></span>\n		</span>\n		{{/unless}}\n	{{/if}}\n	{{#if this.isLeft}}\n		{{#unless this.readonly}}\n		<span class="btn btn-danger input-group-addon J-number-minus">\n			<span class="icon-minus"></span>\n		</span>\n		<span class="btn btn-danger input-group-addon J-number-plus">\n			<span class="icon-plus"></span>\n		</span>\n		{{/unless}}\n		<input id="{{this.id}}" name="{{this.name}}" type="text" \n			class="form-control" value="{{this.min}}" {{this.validate}} placeholder="{{this.placeholder}}"/>\n	{{/if}}\n	{{#if this.isLTR}}\n		{{#unless this.readonly}}\n		<span class="btn btn-danger input-group-addon J-number-minus">\n			<span class="icon-minus"></span>\n		</span>\n		{{/unless}}\n		<input id="{{this.id}}" name="{{this.name}}" type="text" \n			class="form-control" value="{{this.min}}" {{this.validate}} placeholder="{{this.placeholder}}"/>\n		{{#unless this.readonly}}\n		<span class="btn btn-danger input-group-addon J-number-plus">\n			<span class="icon-plus"></span>\n		</span>\n		{{/unless}}\n	{{/if}}\n</div>\n');
