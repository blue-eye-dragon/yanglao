/**
 * @name subnav
 * @version 2.0.0
 * @description 导航条
 * @dependencies ["uicomponent-2.0.0","ajaxwrapper","handlebars","button","buttongroup","date","daterange","text"]
 */
define("eling/component/ui/subnav/2.0.0/dist/subnav-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/store/1.3.14/store-seajs", "json", "eling/component/utils/ajaxwrapper", "dialog", "store", "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/ui/button/1.0.0/dist/button", "eling/component/ui/buttongroup/1.0.0/dist/buttongroup", "eling/component/utils/tools/tools", "eling/component/ui/date/1.0.0/dist/date", "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker", "eling/component/ui/daterange/1.0.0/dist/daterange", "bootstrap/bootstrap-plugins/daterangepicker/daterangepicker", "eling/component/ui/text/1.0.0/dist/text", "eling/component/ui/place/1.0.0/dist/place", "eling/component/ui/admindivision/1.0.0/dist/admindivision", "./subnav.tpl", "./subnav.css" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var store = require("gallery/store/1.3.14/store-seajs");
    var aw = require("eling/component/utils/ajaxwrapper");
    var HandlerBars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var Button = require("eling/component/ui/button/1.0.0/dist/button");
    var Buttongroup = require("eling/component/ui/buttongroup/1.0.0/dist/buttongroup");
    var Date = require("eling/component/ui/date/1.0.0/dist/date");
    var Daterange = require("eling/component/ui/daterange/1.0.0/dist/daterange");
    var Text = require("eling/component/ui/text/1.0.0/dist/text");
    var Place = require("eling/component/ui/place/1.0.0/dist/place");
    var tpl = require("./subnav.tpl");
    require("./subnav.css");
    var plugin = {
        button: Button,
        buttongroup: Buttongroup,
        daterange: Daterange,
        date: Date,
        search: Text,
        place: Place
    };
    /**
	 * @Component(name=subnav, description=导航条, version=2.0.0)
	 */
    var Subnav_2_0_0 = UIComponent.extend({
        attrs: {
            template: tpl,
            autoRender: true,
            itemConfigs: {},
            itemPlugins: {},
            model: {
                items: []
            }
        },
        initCustAttr: function() {
            var model = this.get("model");
            var items = model.items;
            var itemConfigs = this.get("itemConfigs");
            for (var i in items) {
                (function(item, that) {
                    if (item.type == "search") {
                        item.events = {
                            keydown: function(e) {
                                var keyCode = window.event ? e.keyCode : e.which;
                                if (13 == keyCode) {
                                    var s = that.$("." + item.id).find("input").val();
                                    if (s) {
                                        item.handler(s);
                                    }
                                }
                            }
                        };
                    }
                    if (item.type == "place") {
                        item.triggerType = "button";
                    }
                    if (item.type == "buttongroup") {
                        //兼容老版本的全部配置
                        if (item.showAll && item.all === undefined) {
                            item.all = {
                                show: true,
                                text: item.showAllText || "全部",
                                position: item.showAllFirst ? "top" : "bottom"
                            };
                        }
                    }
                    item.id = "J-subnav-" + model.id + "-items-" + item.id;
                    if (item.show === false) {
                        item.className = "hidden";
                    }
                    //缓存
                    itemConfigs[item.id] = item;
                })(items[i], this);
            }
        },
        _initMessage: function() {},
        afterRender: function() {
            this._initMessage();
            //初始化其他插件
            var items = this.get("model").items;
            var itemPlugins = this.get("itemPlugins");
            for (var i in items) {
                var id = items[i].id;
                var type = items[i].type;
                var Plugin = plugin[type];
                itemPlugins[id] = new Plugin({
                    parentNode: this.$("." + id),
                    model: items[i]
                });
            }
        },
        /** @method(name=getItemConfig,description=获取导航条某个元素的配置)
		 * 	@params(name=id,description=导航条上某个元素的id)
		 */
        getItemConfig: function(id) {
            return this.get("itemConfigs")["J-subnav-" + this.get("model").id + "-items-" + id];
        },
        /** @method(name=getItemConfig,description=获取导航条某个元素的配置)
		 * 	@params(name=id,description=导航条上某个元素的id)
		 */
        getPlugin: function(id) {
            return this.get("itemPlugins")["J-subnav-" + this.get("model").id + "-items-" + id];
        },
        /** @method(name=setTitle,description=设置导航条标题)
		 * 	@params(name=title,description=将要设置的导航条标题)
		 */
        setTitle: function(title) {
            this.$(".J-subnav-title").text(title);
        },
        /** @method(name=getTitle,description=获取导航条标题)
		 */
        getTitle: function() {
            return this.$(".J-subnav-title").text();
        },
        /** @method(name=hide,description=隐藏导航条上的元素)
		 *  @params(name=id,type=string|Array,description=导航条上某个或某几个元素的id)
		 */
        hide: function(id) {
            var model = this.get("model");
            var plugins = this.get("itemPlugins");
            if (id.constructor === String) {
                id = [ id ];
            }
            for (var i in id) {
                var selector = "J-subnav-" + model.id + "-items-" + id[i];
                this.$("." + selector).addClass("hidden");
                plugins[selector].hide();
            }
            return this;
        },
        /** @method(name=show,description=显示导航条上的元素)
		 *  @params(name=id,type=string|Array,description=导航条上某个或某几个元素的id)
		 */
        show: function(id) {
            var model = this.get("model");
            var plugins = this.get("itemPlugins");
            if (id.constructor === String) {
                id = [ id ];
            }
            for (var i in id) {
                var selector = "J-subnav-" + model.id + "-items-" + id[i];
                this.$("." + selector).removeClass("hidden");
                plugins[selector].show();
            }
            return this;
        },
        /** @method(name=getValue,description=获取导航条上的元素的值)
		 *  @params(name=id,description=导航条上某个元素的id)
		 */
        getValue: function(id) {
            return this.getPlugin(id).getValue();
        },
        /** @method(name=setValue,description=设置导航条上的元素的值)
		 *  @params(name=id,description=导航条上某个元素的id)
		 *  @params(name=value,description=将要设置的值)
		 */
        setValue: function(id, value) {
            this.getPlugin(id).setValue(value);
        },
        getText: function(id) {
            return this.getPlugin(id).getText();
        },
        setText: function(id, text) {
            this.getPlugin(id).setText(text);
        },
        /** @method(name=getData,description=获取导航条上buttongroup元素的数据集)
		 *  @params(name=id,description=导航条上某个元素的id)
		 *  @params(name=subIndex,type=string|integer,description=需要获取buttongroup数据集中的哪个选项。如果传递的是一个字符串，则进行keyField匹配，如果传递的是一个数字，则进行索引匹配)
		 */
        getData: function(id, options) {
            return this.getPlugin(id).getData(options);
        },
        /** @method(name=setData,description=设置导航条上buttongroup元素的数据集)
		 *  @params(name=id,description=导航条上某个元素的id)
		 *  @params(name=data,description=需要设置的数据集)
		 */
        setData: function(id, data) {
            this.getPlugin(id).setData(data);
        },
        /** @method(name=load,description=加载导航条上buttongroup元素的数据集)
		 *  @params(name=id,description=导航条上某个元素的id)
		 *  @params(name=options,type=url&params{function}&callback{function},description=buttongroup加载参数)
		 */
        load: function(id, options) {
            this.getPlugin(id).load(options);
        },
        /** @method(name=loading,description=设置导航条上buttongroup为加载状态)
		 *  @params(name=id,description=导航条上某个元素的id)
		 */
        loading: function(id) {
            this.getPlugin(id).loading();
        },
        destroy: function() {
            var plugins = this.get("itemPlugins");
            for (var i in plugins) {
                plugins[i].destroy();
            }
            Subnav_2_0_0.superclass.destroy.call(this, arguments);
        }
    });
    module.exports = Subnav_2_0_0;
});

define("eling/component/ui/subnav/2.0.0/dist/subnav.tpl", [], "<div id=\"{{this.id}}\" class=\"container el-subnav el-subnav-2\">\n	<div class='row'>\n		<div class='col-sm-12'>\n			<div class='page-header el-page-header J-subnav-head'>\n				<h1 class='pull-left'>\n					<i class='icon-comments'></i>\n					<span class=\"J-subnav-title\">{{this.title}}</span>\n				</h1>\n				<div class='pull-right el-pull-right'>\n				{{#each this.items}}\n					<div class=\"btn-group ex-btn-group dropdown {{this.id}} {{this.className}}\"></div>\n				{{/each}}\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n");

define("eling/component/ui/subnav/2.0.0/dist/subnav.css", [], function() {
    seajs.importStyle(".el-subnav-2 .el-page-header{margin:0 0 5px;overflow:inherit}.el-subnav-2 .el-pull-right{margin-right:6%}");
});
