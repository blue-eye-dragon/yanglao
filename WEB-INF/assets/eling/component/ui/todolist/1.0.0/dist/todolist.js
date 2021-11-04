define("eling/component/ui/todolist/1.0.0/dist/todolist", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "./todolist.tpl", "eling/component/utils/ajaxwrapper", "dialog", "store", "./todolist.css", "eling/component/utils/tools/tools" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var template = require("./todolist.tpl");
    var aw = require("eling/component/utils/ajaxwrapper");
    require("./todolist.css");
    var tools = require("eling/component/utils/tools/tools");
    var Todolist = UIComponent.extend({
        attrs: {
            template: template,
            autoRender: true
        },
        events: function() {
            var that = this;
            var model = that.get("model") || {};
            var eventsConfig = model.event || {};
            return {
                "click .J-todolist-check": function(e) {
                    if ($(e.target).is("pre")) {
                        return true;
                    }
                    var checkbox = $(e.target).parents(".J-todolist-check").find("input[type='checkbox']");
                    if (checkbox.is(":checked")) {
                        $(e.target).parents("li").addClass("done");
                    } else {
                        $(e.target).parents("li").removeClass("done");
                    }
                    var checkboxClick = eventsConfig.checkbox || function() {};
                    checkboxClick(e);
                },
                "click .J-todoitem-btn": function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    aw.ajax({
                        url: that.get("save").url,
                        dataType: "json",
                        data: $.extend(true, that.get("save").params, {
                            todoitem: that.$(".J-todoitem").val()
                        }),
                        success: function(data) {
                            var callback = that.get("save").callback || function() {};
                            callback(data);
                        }
                    });
                    return false;
                },
                "click .J-todolist-collapse": function(e) {
                    var ul = $(e.target).parents(".J-todolist-title").next();
                    if (ul.hasClass("down")) {
                        ul.addClass("hidden");
                        $(e.target).removeClass("icon-chevron-up").addClass("icon-chevron-down");
                        ul.addClass("up").removeClass("down");
                    } else {
                        ul.removeClass("hidden");
                        $(e.target).removeClass("icon-chevron-down").addClass("icon-chevron-up");
                        ul.addClass("down").removeClass("up");
                    }
                    return false;
                },
                "click .J-todolist-important": function(e) {
                    var importantClick = eventsConfig.important || function() {};
                    importantClick(e);
                    $(e.target).parents("li").toggleClass("important");
                },
                "click .J-todolist-remark": function(e) {
                    var parent = $(e.target).parent();
                    parent.next().toggleClass("hidden");
                    parent.find(".J-todolist-remark-save,.J-todolist-remark-cancel,.J-todolist-remark").toggleClass("hidden");
                },
                "click .J-todolist-remark-save": function(e) {
                    var remarkClick = eventsConfig.remark || function() {};
                    remarkClick(e);
                },
                "click .J-todolist-remark-cancel": function(e) {
                    var parent = $(e.target).parent();
                    parent.next().toggleClass("hidden");
                    parent.find(".J-todolist-remark-save,.J-todolist-remark-cancel,.J-todolist-remark").toggleClass("hidden");
                }
            };
        },
        _loadData: function(params) {
            var that = this;
            var url = this.get("url");
            var queryParams = params || that.get("params") || "";
            if (this.get("fetchProperties")) {
                queryParams = $.extend(true, queryParams, {
                    fetchProperties: this.get("fetchProperties")
                });
            }
            if (this.get("autoRender") && this.get("url")) {
                aw.ajax({
                    url: url,
                    data: queryParams,
                    dataType: "json",
                    success: function(data) {
                        that.setData(data);
                    }
                });
            }
        },
        setData: function(data) {
            var map = {};
            var results = [];
            var model = this.get("model") || {};
            var itemButtons = model.itemButtons || [];
            var mapping = model.mapping;
            if (!mapping) {
                //				alert("todolist必须配置mapping参数以指定对应关系");
                return;
            }
            var group = mapping.group || [];
            if (!group || group.length == 0) {
                model.isGroup = false;
            } else {
                model.isGroup = true;
            }
            var title = mapping.title || [];
            var content = mapping.content || [];
            var isImportant = mapping.important;
            var done = mapping.done;
            var input = mapping.input;
            var remark = mapping.remark;
            data = data || [];
            for (var i = 0; i < data.length; i++) {
                //分组条件group
                var groupValue = "";
                for (var g = 0; g < group.length; g++) {
                    var key = group[g].key;
                    var value = tools._getValueWithPoint(key, data[i]);
                    var format = group[g].format;
                    var temp = format ? format(value, data[i]) : value;
                    groupValue += temp;
                }
                groupValue = groupValue || "nogroup";
                var item = {};
                //内容
                var contentValue = "";
                for (var c = 0; c < content.length; c++) {
                    var key = content[c].key;
                    var value = tools._getValueWithPoint(key, data[i]);
                    var format = content[c].format;
                    var temp = format ? format(value, data[i]) : value;
                    contentValue += temp ? temp + "," : "";
                }
                contentValue = contentValue.substring(0, contentValue.length - 1);
                item.group = groupValue;
                item.content = contentValue;
                item.data = data[i];
                //设置状态
                item.className = "";
                item.isChecked = data[i][done];
                item.isImportant = data[i][isImportant];
                item.input = data[i][input];
                item.remark = data[i][remark];
                if (item.isChecked) {
                    item.className += "done ";
                }
                if (item.isImportant) {
                    item.className += "important";
                }
                //设置按钮是否显示
                var tempItemButtons = [];
                for (var j = 0; j < itemButtons.length; j++) {
                    var itemButton = {};
                    for (var k in itemButtons[j]) {
                        itemButton[k] = itemButtons[j][k];
                    }
                    if (typeof itemButtons[j].show === "string") {
                        //根据字段指定是否显示按钮
                        if (data[i][itemButtons[j].show]) {
                            itemButton.show = "";
                        } else {
                            itemButton.show = "hidden";
                        }
                    } else {
                        itemButton.show = itemButton.show == false ? "hidden" : "";
                    }
                    tempItemButtons.push(itemButton);
                }
                item.itemButtons = tempItemButtons;
                //分组数据
                if (map[groupValue]) {
                    //已经存在的组
                    map[groupValue].items.push(item);
                } else {
                    //如果是一个新的组
                    //					//标题
                    var titleValue = "";
                    for (var t = 0; t < title.length; t++) {
                        var key = title[t].key;
                        var value = tools._getValueWithPoint(key, data[i]);
                        var format = title[t].format;
                        var temp = format ? format(value, data[i]) : value;
                        titleValue += temp + "  ";
                    }
                    item.title = titleValue;
                    item.items = [ item ];
                    map[groupValue] = item;
                }
            }
            model.data = map;
            this.renderPartial(".J-todolist-content");
        },
        setup: function() {
            this.render();
            var url = this.get("url");
            if (url) {
                this._loadData();
            }
        },
        refresh: function(params) {
            this.set("autoRender", true);
            this._loadData(params);
        },
        getData: function(e, field) {
            var data = this.get("model").data || {};
            var group = "";
            if (typeof e === "object") {
                var el = $(e.target);
                group = $(el).parents(".J-todolist-title").attr("data-key");
            } else {
                group = this.$(".J-todolist-title").eq(e).attr("data-key");
            }
            var object = data[group].data;
            return tools._getValueWithPoint(field, object);
        },
        getRowData: function(e) {
            var data = this.get("model").data || {};
            var rowIndex, index;
            if (arguments.length == 1) {
                //传入的参数是e
                var el = $(e.target);
                rowIndex = $(el).parents("li.item").prevAll().size();
                index = $(el).parents("ul").prevAll("ul").size();
            } else {
                //传入的参数时第几行，第几条
                rowIndex = arguments[1];
                index = arguments[0];
            }
            var group = this.$(".J-todolist-title").eq(index).attr("data-key") || "nogroup";
            var items = data[group].items;
            return items[rowIndex].data;
        }
    });
    module.exports = Todolist;
});

define("eling/component/ui/todolist/1.0.0/dist/todolist.tpl", [], '<div class="el-todolist container">\n      <div class=\'row todo-list\'>\n        <div class=\'col-sm-12\'>\n          <div class=\'box\'>\n            <div class=\'box-content box-no-padding\'>\n            	<div class="sortable-container J-todolist-content">\n            		{{#if this.save}}\n            		<form class="new-todo J-todoitem" data-url="{{this.saveurl}}" >\n            			<input class="form-control" class="J-todoitem" type="text" placeholder="请输入待办项">\n            			<button class="btn btn-success J-todoitem-btn" type=\'submit\'>\n            				<i class="icon-plus"></i>\n            			</button>\n            		</form>\n            		{{/if}}\n            		<hr class="hr-normal" style="margin-top: 0;">\n            		{{#each this.data}}\n            			{{#if ../this.isGroup}}\n	                	<div class="date text-contrast J-todolist-title" data-key="{{this.group}}">\n	                		<div class="col-md-8">\n	                			<a class="J-todolist-collapse icon-chevron-down" href="javascript:void(0);" \n	                				style="color: #f34541;padding: 5px;padding-left: 10px;text-decoration: none;"></a>\n	                				<span style="font-size: 1.5em;">{{this.title}}</span>\n	                		</div>\n	                		<div class="col-md-4" style="padding-right: 5%;height:31px;">\n	                			{{#each ../../this.buttons}}\n	                				{{#if this.show}}\n					        			<input class="J-todolist-{{this.id}} btn btn-danger" style="color:white;float: right;" value="{{this.text}}" type="button">\n					        		{{else}}\n					        			<input class="hidden J-todolist-{{this.id}} btn btn-danger" style="color:white;float: right;" value="{{this.text}}" type="button">\n					        		{{/if}}\n	                            {{/each}}\n	                        </div>\n	                	</div>\n	                	<ul class="list-unstyled hidden up">\n	                	{{else}}\n	                	<ul class="list-unstyled up">\n	                	{{/if}}\n               				{{#each this.items}}\n               				{{#if this.isChecked}}\n               					<li class="item {{this.className}}" style="border-bottom: 0 none;padding-left: 60px;">\n               				{{else}}\n               					<li class="item {{this.className}}" style="border-bottom: 0 none;padding-left: 60px;">\n               				{{/if}}\n               					<label class="J-todolist-check check pull-left todo col-md-8">\n               						{{#if this.isChecked}}\n               							<input class="col-md-1" type="checkbox" checked="checked" style="display: inline-block;vertical-align: top;margin-top: 5px;">\n               						{{else}}\n               							<input class="col-md-1" type="checkbox" style="display: inline-block;vertical-align: top;margin-top: 5px;">\n               						{{/if}}\n			                        <pre class="col-md-11" style="font-size: 1.3em;display: inline-block;background: inherit;border: 0;padding: 0;">{{this.content}}</pre>\n		                        </label>\n			                    <!-- <div class="actions pull-right J-worktime"> -->\n			                    <div class="actions pull-right">\n			                    {{#each this.itemButtons}}\n					        		<input class="J-todolist-{{this.id}} btn btn-danger {{this.show}}" value="{{this.text}}" type="button">\n	                            {{/each}}\n	                            	<input class="J-todolist-important btn btn-danger" value="标为重要" type="button">\n	                            	<input class="J-todolist-remark btn btn-danger" value="任务备注" type="button">\n	                            	<input class="J-todolist-remark-save btn btn-danger hidden" value="保存" type="button">\n	                            	<input class="J-todolist-remark-cancel btn btn-danger hidden" value="取消" type="button">\n			                    </div>\n				                <div class="item el-todolist-remark hidden">\n				                	<input class="form-control" placeholder="请输入工时(分钟)" type="text" value="{{this.input}}">\n				                	<textarea placeholder="请输入备注">{{this.remark}}</textarea>\n				                </div>\n			                </li>\n			                {{/each}}\n                		</ul>\n                		<hr class="hr-normal" style="clear: both;margin-bottom: 1px;margin-top: 1px;">\n		            {{/each}}\n              		</div>\n              		<div style="clear: both;"></div>\n            	</div>\n          	</div>\n        </div>\n      </div>\n    </div>\n  \n  \n');

define("eling/component/ui/todolist/1.0.0/dist/todolist.css", [], function() {
    seajs.importStyle(".el-todolist .actions{color:#fff}.el-todolist .el-todolist-remark input{width:94%;display:inline-block;margin:3px 3%}.el-todolist .el-todolist-remark textarea{height:100px;width:94%;margin:0 3% 10px}");
});
