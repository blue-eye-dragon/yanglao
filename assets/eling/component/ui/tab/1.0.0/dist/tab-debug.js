define("eling/component/ui/tab/1.0.0/dist/tab-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "./tab.tpl" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var Tab = UIComponent.extend({
        attrs: {
            template: require("./tab.tpl"),
            autoRender: true
        },
        initCustAttr: function() {
            var contents = [];
            var model = this.get("model") || {};
            var items = model.items || [];
            for (var i = 0; i < items.length; i++) {
                if (typeof items[i].content === "string") {
                    contents.push({
                        id: items[i].id,
                        content: items[i].content
                    });
                } else {
                    contents.push({
                        id: items[i].id
                    });
                }
            }
            model.contents = contents;
            if (model.layout == "left") {
                model.isLeft = true;
            }
        },
        afterRender: function() {
            this.$("li:first").addClass("active");
            this.$(".tab-pane:first").addClass("active");
        },
        setActive: function(index) {
            this.$("li").removeClass("active");
            this.$("li").eq(index).addClass("active");
            this.$(".tab-pane").removeClass("active");
            this.$(".tab-pane").eq(index).addClass("active");
        },
        getActive: function() {
            return this.$("li.active").prevAll().size();
        },
        addItem: function(item) {
            //增加内容页签
            var li = $("<li></li>");
            var a = $("<a></a>").attr("data-toggle", "tab").attr("href", "#" + item.id).text(item.title);
            li.append(a);
            this.$("ul.nav-tabs").append(li);
            //增加内容区域
            var div = $("<div></div>").addClass("tab-pane").attr("id", item.id);
            $(".tab-content").append(div);
        },
        removeItem: function(index) {
            this.$("li").eq(index).remove();
            this.$(".tab-content").children().eq(index).remove();
        },
        removeItems: function(start, end) {
            //根据开始和结束的坐标清除页签
            var contents = this.$(".tab-content").children();
            end = end || this.$("ul.nav-tabs").find("li").size() - 1;
            this.$("ul.nav-tabs li").each(function(i, el) {
                if (i >= start && i <= end) {
                    el.remove();
                    contents.eq(i).remove();
                }
            });
        }
    });
    module.exports = Tab;
});

define("eling/component/ui/tab/1.0.0/dist/tab.tpl", [], "<div class='container el-tab'>\n	{{#if this.isLeft}}\n	<div class=\"row\">\n		<div class=\"col-sm-12 box\">\n			<div class='box-content'>\n				<div class=\"tabbable tabs-left\">\n					<ul class=\"nav nav-tabs\">\n						{{#each this.items}}\n							<li>\n								<a data-toggle='tab' href='#{{this.id}}'>\n									{{this.title}}\n								</a>\n	                        </li>\n                        {{/each}}\n                    </ul>\n                    <div class=\"tab-content\">\n                    	{{#each this.contents}}\n                    		<div id=\"{{this.id}}\" class=\"tab-pane\">\n                    			<p>{{this.content}}</p>\n                    		</div>\n                    	{{/each}}\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n	{{else}}\n	<div class='row'>\n		<div class='col-sm-12 box'>\n			<div class='box-content'>\n				<div class='tabbable'>\n					<ul class='nav nav-responsive nav-tabs'>\n						{{#each this.items}}\n						<li>\n							<a data-toggle='tab' href='#{{this.id}}'>\n								{{this.title}}\n							</a>\n                        </li>\n                        {{/each}}\n                    </ul>\n                    <div class='tab-content'>\n                    	{{#each this.contents}}\n                    		<div id=\"{{this.id}}\" class=\"tab-pane\">\n                    			<p>{{this.content}}</p>\n                    		</div>\n                    	{{/each}}\n                	</div>\n            	</div>\n       		</div>\n       	</div>\n    </div>\n	{{/if}}\n</div>");
