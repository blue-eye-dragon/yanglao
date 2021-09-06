/**
 * @name place
 * @version 1.0.0
 * @description input
 * @dependencies ["uicomponent-2.0.0","tools"]
 */
define("eling/component/ui/place/1.0.0/dist/place-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "eling/component/ui/admindivision/1.0.0/dist/admindivision", "./place.tpl" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var Admindivision = require("eling/component/ui/admindivision/1.0.0/dist/admindivision");
    var template = require("./place.tpl");
    var Place_1_0_0 = UIComponent.extend({
        attrs: {
            autoRender: true,
            template: template,
            model: {
                triggerType: "button",
                style: "position:relative;"
            }
        },
        initCustAttr: function() {
            var that = this;
            var model = this.get("model");
            if (model.triggerType == "button") {
                model.innerClassName = "btn btn-theme";
                model.innerStyle = "width:100%;";
                model.value = "省/市/区（县）";
                model.style = "position:relative;min-width:122px;";
            } else {
                model.innerClassName = "form-control";
                model.placeholder = "省/市/区（县）";
                model.innerStyle = "cursor:pointer;";
                model.isIcon = true;
            }
            model.itemSelected = function(data, type) {
                that.setValue(data);
                if (typeof model.onItemSelect === "function") {
                    model.onItemSelect(data, type);
                }
            };
            model.reset = function() {
                that.reset();
                if (typeof model.onReset === "function") {
                    model.onReset();
                }
            };
            model.close = function() {
                if (typeof model.onClose === "function") {
                    model.onClose();
                }
            };
        },
        events: function() {
            var that = this;
            var model = this.get("model");
            model.style = "right:0px;top:33px;";
            var results = {};
            var events = this.get("model").events;
            for (var i in events) {
                results[i + " #" + model.id] = events[i];
            }
            results["click #" + model.id] = function(e) {
                if (this.$(".J-admindivision-tab-province").length != 0) {
                    //如果已经存在，则不初始化
                    return;
                }
                if (this.get("disabeld")) {
                    //如果是不能编辑状态，则不初始化
                    return;
                }
                var admindivision = new Admindivision({
                    parentNode: this.element,
                    model: model
                });
            };
            return results;
        },
        afterRender: function() {
            var model = this.get("model");
            this.setReadonly(model.readonly);
            this.setDisabled(model.disabled);
        },
        setValue: function(obj) {
            this.$("input").eq(0).val(obj.fullName);
            this.$("input").eq(1).val(obj.id);
        },
        getValue: function() {
            return this.$("input").eq(1).val();
        },
        reset: function() {
            var model = this.get("model");
            if (model.triggerType == "button") {
                this.$("input").eq(0).val(model.value);
                this.$("input").eq(1).val("");
            } else {
                this.$("input").val("");
            }
        },
        setReadonly: function(mark) {
            this.set("disabled", mark);
            if (mark) {
                this.$("input").attr("readonly", "readonly");
            } else {
                this.$("input").removeAttr("readonly");
            }
        },
        setDisabled: function(mark) {
            this.set("disabled", mark);
            if (mark) {
                this.$("input").attr("disabled", "disabled");
            } else {
                this.$("input").removeAttr("disabled");
            }
        }
    });
    module.exports = Place_1_0_0;
});

define("eling/component/ui/place/1.0.0/dist/place.tpl", [], '<div class="el-place {{this.className}}" style="{{this.style}}">\n	<input id="{{this.id}}" class="{{this.innerClassName}}" style="{{this.innerStyle}}" readonly="readonly" \n		type="{{this.triggerType}}" placeholder="{{this.placeholder}}" value="{{this.value}}"/>\n	<input name="{{this.name}}" type="hidden" {{this.validate}}/>\n</div>');
