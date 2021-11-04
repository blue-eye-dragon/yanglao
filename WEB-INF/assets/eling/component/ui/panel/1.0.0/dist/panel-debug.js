define("eling/component/ui/panel/1.0.0/dist/panel-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/ajaxwrapper", "dialog", "store", "gallery/handlebars/2.0.0/handlebars-seajs", "./panel.css", "eling/component/utils/tools/tools", "./panel.tpl" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var aw = require("eling/component/utils/ajaxwrapper");
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    require("./panel.css");
    var tools = require("eling/component/utils/tools/tools");
    var Panel = UIComponent.extend({
        attrs: {
            template: require("./panel.tpl"),
            autoRender: true,
            model: {
                col: 4
            }
        },
        _loadData: function(url, params) {
            var that = this;
            var queryParams = params || this.get("params") || "";
            if (typeof queryParams === "function") {
                queryParams = queryParams();
            }
            var autoRender = this.get("autoRender");
            if (autoRender != false) {
                this.loading();
                aw.ajax({
                    url: url,
                    dataType: "json",
                    type: "GET",
                    data: queryParams,
                    success: function(data) {
                        that.setData(data);
                        that.element.find(".ajaxloader").remove();
                    },
                    error: function(data) {}
                });
            }
        },
        refresh: function(params) {
            this.set("autoRender", true);
            var url = this.get("url");
            this._loadData(url, params);
        },
        setup: function() {
            this.render();
            var url = this.get("url");
            if (url) {
                this._loadData(url);
            }
        },
        setData: function(data) {
            var model = this.get("model");
            model.data = data;
            var labelWidth = model.labelWidth;
            var valueWidth = model.valueWidth;
            var items = model.items || [];
            var col = model.col;
            for (var i = 0; i < items.length; i++) {
                var name = items[i].name;
                var value = tools._getValueWithPoint(name, data);
                var format = items[i].format;
                if (format) {
                    value = format(value, data);
                }
                items[i].value = value;
                if (i % col == 0 && i != 0) {
                    items[i].n = true;
                }
                items[i].labelWidth = labelWidth + "%";
                items[i].valueWidth = valueWidth + "%";
                items[i].colWidth = 100 / col - 1 + "%";
            }
            this.renderPartial(".J-panel-content");
            this.loadPicture(data);
        },
        loadPicture: function(data) {
            var img = this.get("model").img;
            if (img) {
                this.$("img.J-panel-img").attr("src", img.url + (data[img.idAttribute] || "0"));
            }
        },
        loading: function() {
            this.element.find(".J-panel-content").html("<div class='ajaxloader'></div>");
            this.get("model").data = [];
        }
    });
    module.exports = Panel;
});

define("eling/component/ui/panel/1.0.0/dist/panel.css", [], function() {
    seajs.importStyle(".el-panel .ajaxloader{background:url(assets/eling/resources/ajaxloader/ajaxloader.gif) no-repeat;height:50px;background-position:50%}.el-panel .form-control{border:0 none;box-shadow:none;-webkit-box-shadow:none;-molliza-box-shadow:none}.el-panel .el-panel-row{font-size:14px;line-height:1.42857;color:#555;margin-left:0;margin-right:0;padding:15px 0;border-bottom:1px solid #ddd;margin-bottom:0}.el-panel .el-panel-row:nth-child(even){background-color:#f4f4f4}.el-panel .item,.el-panel .item span,.el-panel .item label{display:inline-block}.el-panel .item span{text-align:left}.el-panel .item label{text-align:right}@media print{.el-panel .el-panel-row{padding:0!important;border-bottom:0 none!important}}");
});

define("eling/component/ui/panel/1.0.0/dist/panel.tpl", [], '<div class=\'container el-panel\'>\n	<div class="row">\n		{{#if this.img.show}}\n		<div class=\'col-lg-2\'>\n			<div class=\'box\'>\n				<div class=\'box-content\'>\n					<img class="J-panel-img img-responsive"/>\n				</div>\n			</div>\n		</div>\n		{{/if}}\n		{{#if this.img.show}}\n			<div class=\'col-lg-10\'>\n		{{else}}\n			<div class=\'col-lg-12\'>\n		{{/if}}\n		<div class="box">\n			<div class="box-content">\n				<div class="J-panel-content">\n					<div class="el-panel-row">\n					{{#each this.items}}\n						{{#if this.n}}\n							</div>\n							<div class="el-panel-row">\n								<div style="width: {{this.colWidth}};" class="item">\n									<label style="width:{{this.labelWidth}};">{{this.label}}：</label>\n									<span style="width:{{this.valueWidth}};" class="J-panel-{{this.id}}">{{this.value}}</span>\n								</div>\n						{{else}}\n								<div style="width: {{this.colWidth}};" class="item">\n									<label style="width:{{this.labelWidth}};">{{this.label}}：</label>\n									<span style="width:{{this.valueWidth}};" class="J-panel-{{this.id}}">{{this.value}}</span>\n								</div>\n						{{/if}}\n					{{/each}}\n					</div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n</div>\n                      	');
