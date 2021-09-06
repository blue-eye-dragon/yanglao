/**
 * @name button
 * @version 1.0.0
 * @description 按钮
 */
define("eling/component/ui/button/1.0.0/dist/button-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "./button.tpl" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var template = require("./button.tpl");
    var Button_1_0_0 = UIComponent.extend({
        attrs: {
            template: template,
            autoRender: true,
            model: {
                id: null,
                text: null,
                className: "",
                handler: function() {}
            }
        },
        events: function() {
            var model = this.get("model");
            var events = {};
            events["click #" + model.id] = function(e) {
                model.handler(model, e);
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            return events;
        },
        setValue: function(value) {
            this.get("model").value = value;
        },
        getValue: function() {
            return this.get("model").value;
        },
        setText: function(text) {
            this.get("model").text = text;
            this.$("button").text(text);
        },
        getText: function() {
            return this.get("model").text;
        }
    });
    module.exports = Button_1_0_0;
});

define("eling/component/ui/button/1.0.0/dist/button.tpl", [], '<div class="el-button {{this.className}}" style="{{this.style}}">\n	<button id="{{this.id}}" class="btn btn-theme">\n		{{this.text}}\n	</button>\n</div>');
