/**
 * @name buttongroup
 * @version 1.0.0
 * @description 按钮组
 * @dependencies []
 */
define("eling/component/ui/buttongroup/1.0.0/dist/buttongroup-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./buttongroup.tpl", "./buttongroup.css" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var tpl = require("./buttongroup.tpl");
    require("./buttongroup.css");
    var Buttongroup_1_0_0 = UIComponent.extend({
        attrs: {
            autoRender: true,
            template: tpl,
            model: {
                items: [],
                all: {
                    show: false,
                    text: "全部",
                    position: "top"
                }
            }
        },
        events: function() {
            var that = this;
            var model = this.get("model");
            var events = {};
            events["click .J-buttongroup"] = function(e) {
                var handler = model.handler;
                var key = $(e.currentTarget).attr("data-key");
                var text = $(e.currentTarget).text();
                that.setValue(key);
                that.setText(text);
                if (tools.isFunction(handler)) {
                    handler(key, text);
                }
                return false;
            };
            events["mouseover .J-buttongroup.main"] = function(e) {
                that.element.find(".tip").css({
                    display: "block"
                });
                return false;
            };
            events["mouseout .J-buttongroup.main"] = function(e) {
                that.element.find(".tip").css({
                    display: "none"
                });
                return false;
            };
            return events;
        },
        _geneViewModel: function() {
            var model = this.get("model");
            var items = model.items;
            var keyField = model.keyField || "key";
            var valueField = model.valueField || "value";
            var format = model.format;
            //全部选项
            var all = model.all;
            var allItem = {
                key: "",
                text: all.text || "全部"
            };
            //设置主按钮
            var main = {};
            if (all.show && all.position == "top") {
                main = allItem;
            } else if (items[0]) {
                main = {
                    key: tools._getValueFromObject(keyField, items[0]),
                    text: tools.isFunction(format) ? format(items[0], model) : tools._getValueFromObject(valueField, items[0])
                };
            } else {
                main = null;
                return false;
            }
            //设置子
            var sub = [];
            for (var i in items) {
                sub.push({
                    key: tools._getValueFromObject(keyField, items[i]),
                    text: tools.isFunction(format) ? format(items[i], model) : tools._getValueFromObject(valueField, items[i])
                });
            }
            if (all.show && all.position == "top") {
                sub.splice(0, 0, allItem);
            } else if (all.show) {
                sub.push(allItem);
            }
            model.main = main;
            model.sub = sub;
        },
        initCustAttr: function() {
            this._geneViewModel();
        },
        afterRender: function() {
            var that = this;
            var model = this.get("model");
            if (model.url && model.lazy !== true) {
                this.load();
            }
        },
        setValue: function(value) {
            var item = this.$(".J-buttongroup.sub[data-key='" + value + "']");
            this.$(".J-buttongroup.main").attr("data-key", value).text(item.text());
        },
        getValue: function() {
            return this.$(".J-buttongroup.main").attr("data-key");
        },
        setText: function(text) {
            this.$(".J-buttongroup.main").text(text);
        },
        getText: function() {
            return this.$(".J-buttongroup.main").text();
        },
        setData: function(data) {
            this.get("model").items = data;
            this._geneViewModel();
            var tpl = $(this.get("template")).html();
            this.element.html(this.handlebars.compile(tpl)(this.get("model")));
        },
        getData: function() {
            return this.get("model").items;
        },
        loading: function() {
            this.$(".btn-group").html($("<button></button>").addClass("btn").addClass("btn-danger").text("正在加载"));
        },
        load: function(options) {
            this.loading();
            var that = this, options = options || {};
            var url = options.url;
            var params = options.params;
            var callback = options.callback;
            var model = this.get("model");
            var queryParams = params || model.params;
            if (tools.isFunction(queryParams)) {
                queryParams = queryParams();
            }
            $.ajax({
                url: url || model.url,
                data: queryParams,
                datatType: "json",
                success: function(data) {
                    that.setData(data);
                    if (tools.isFunction(callback)) {
                        callback(data);
                    }
                }
            });
        },
        hide: function() {
            this.$(".btn").addClass("hidden");
        },
        show: function() {
            this.$(".btn").removeClass("hidden");
        }
    });
    module.exports = Buttongroup_1_0_0;
});

define("eling/component/ui/buttongroup/1.0.0/dist/buttongroup.tpl", [], '<div id="{{this.id}}" class="el-buttongroup-1">\n	<div class="btn-group">\n		{{#if this.main}}\n			<button class="btn btn-theme J-buttongroup main {{this.className}}" data-key="{{this.main.key}}">{{this.main.text}}</button>\n			<button class="btn btn-theme dropdown-toggle {{this.className}}" data-toggle="dropdown">\n				<span class="caret"></span>\n			</button>\n			<ul class="dropdown-menu">\n				{{#each this.sub}}\n					<li><a class="J-buttongroup sub" data-key="{{this.key}}" href="javascript:void(0);">{{this.text}}</a></li>\n				{{/each}}\n			</ul>\n			{{#if this.tip}}\n			<div class="tip">{{this.tip}}</div>\n			{{/if}}\n		{{/if}}\n	</div>\n</div>');

define("eling/component/ui/buttongroup/1.0.0/dist/buttongroup.css", [], function() {
    seajs.importStyle(".el-buttongroup-1 .btn{color:#fff!important}.el-buttongroup-1 .caret{border-top-color:#fff}.el-buttongroup-1 .tip{display:none;position:absolute;white-space:nowrap;top:100%;left:20px;z-index:1000;float:left;padding:5px;margin:2px 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175)}.el-buttongroup-1 .dropdown-menu li a{margin-right:30px}");
});
