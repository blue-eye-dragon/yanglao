/**
 * @Component(name=editgrid, description=行编辑grid, version=2.0.0, inherit=grid-2.0.0)
 */
define("eling/component/ui/editgrid/2.0.0/dist/editgrid-debug", [ "eling/component/ui/grid/2.0.0/dist/grid", "jquery/jquery-plugins/pagination/pagination", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/utils/tools/tools", "eling/component/utils/ajaxwrapper", "dialog", "store" ], function(require, exports, module) {
    var Grid = require("eling/component/ui/grid/2.0.0/dist/grid");
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var tools = require("eling/component/utils/tools/tools");
    var EditGrid = Grid.extend({
        attrs: {
            autoRender: true,
            //用于存放当前正处于编辑状态的组件
            editor: null,
            //用于存放新增行的组件
            editors: {},
            model: {
                isInitPageBar: false,
                editable: true,
                allowAdd: true,
                allowEdit: true,
                allowFoot: true
            }
        },
        initCustAttr: function() {
            EditGrid.superclass.initCustAttr.call(this, arguments);
            var columns = this.get("model").columns;
            for (var i in columns) {
                if (columns[i].editor && columns[i].editor.type) {
                    if (tools.isString(columns[i].className)) {
                        columns[i].className += " J-editgrid-edit-td";
                    } else {
                        columns[i].className = " J-editgrid-edit-td";
                    }
                }
            }
        },
        afterRender: function() {
            this._geneFormELParams();
            var model = this.get("model");
            if (model.editable) {
                this._addEmptyRow();
            }
            if (model.allowAdd === false) {
                this.$("tfoot tr").eq(0).addClass("hidden");
            }
            if (model.allowFoot === false) {
                this.$("tfoot tr").eq(1).addClass("hidden").css({
                    display: "block"
                });
            }
        },
        _addEmptyRow: function() {
            var that = this;
            var tr = $("<tr></tr>");
            this.$("tfoot tr").before(tr);
            var model = this.get("model");
            var columns = model.columns;
            for (var i in columns) {
                (function(column) {
                    var td = $("<td></td>").addClass("J-editgrid-edit-td").css({
                        "vertical-align": "middle"
                    }).html($("<pre></pre>"));
                    if (column.editor && column.editor.type) {
                        var div = $("<div></div>");
                        td.append(div);
                        that._initEditElement(column, div, "add");
                    }
                    tr.append(td);
                })(columns[i]);
            }
        },
        _initEditElement: function(column, parentNode, className) {
            var that = this;
            var model = this.get("model");
            tools.loadModule(column.editor.type, function(Plugin) {
                var plugin = new Plugin({
                    parentNode: parentNode,
                    model: className == "edit" ? column.editParams : column.addParams
                });
                if (className == "edit") {
                    that.set("editor", plugin);
                } else {
                    that.get("editors")[column.name] = plugin;
                }
            });
        },
        _beforeEdit: function(plugin, column) {
            if (column.editor && column.editor.type == "select" && column.editor.url && plugin) {
                var datas = this.get("editors")[column.name].getData();
                plugin.setData(datas);
            }
        },
        _afterEdit: function(plugin, column) {
            if (column.editor && column.editor.type == "select") {
                plugin.open();
            }
        },
        _geneFormELParams: function() {
            var model = this.get("model");
            var columns = model.columns;
            for (var i in columns) {
                (function(column, widget) {
                    if (column.editor && column.editor.type) {
                        var type = column.editor.type;
                        type = type.substring(0, 1).toUpperCase() + type.substring(1);
                        var funcName = "_gene" + type + "Params";
                        widget[funcName].call(widget, column, widget);
                    }
                })(columns[i], this);
            }
        },
        _geneTextParams: function(column, widget) {
            column.editor.placeholder = column.editor.placeholder || "请选择" + column.label;
            var addParams = $.extend(true, {}, column.editor);
            addParams.events = {
                change: function(e) {
                    var model = widget.get("model");
                    var onAdd = model.onAdd || column.editor.onAdd;
                    if (tools.isFunction(onAdd)) {
                        var ret = onAdd(widget.get("editors"));
                        if (ret !== false) {
                            var editors = widget.get("editors");
                            for (var i in editors) {
                                editors[i].reset();
                            }
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            };
            column.addParams = addParams;
            var editParams = $.extend(true, {}, column.editor);
            editParams.events = {
                change: function(e) {
                    if (tools.isFunction(column.editor.onChange)) {
                        var rowIndex = widget.getIndex(e.currentTarget);
                        var datas = widget.get("data");
                        var data = datas[rowIndex];
                        column.editor.onChange(widget.get("editor"), rowIndex, data);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            };
            column.editParams = editParams;
        },
        _geneTextareaParams: function(column, widget) {
            this._geneTextParams(column, widget);
        },
        _geneDateParams: function(column, widget) {
            column.editor.triggerType = "form";
            this._geneTextParams(column, widget);
        },
        _geneSelectParams: function(column, widget) {
            this._geneTextParams(column, widget);
            if (column.editor.url) {
                column.editParams.lazy = true;
            }
        },
        _geneAutocompleteParams: function(column, widget) {
            column.editor.placeholder = column.editor.placeholder || "请选择" + column.label;
            var addParams = $.extend(true, {}, column.editor);
            addParams.onItemSelect = function(data) {
                var model = widget.get("model");
                var onAdd = model.onAdd || column.editor.onAdd;
                if (tools.isFunction(onAdd)) {
                    var ret = onAdd(widget.get("editors"));
                    if (ret !== false) {
                        var editors = widget.get("editors");
                        for (var i in editors) {
                            editors[i].reset();
                        }
                    }
                }
            };
            column.addParams = addParams;
            var editParams = $.extend(true, {}, column.editor);
            editParams.onItemSelect = function(data) {
                if (tools.isFunction(column.editor.onChange)) {
                    var rowIndex = widget.getIndex(widget.$(".editing"));
                    var datas = widget.get("data");
                    var data = datas[rowIndex];
                    column.editor.onChange(widget.get("editor"), rowIndex, data);
                }
            };
            column.editParams = editParams;
        },
        _genePlaceParams: function(column, widget) {
            column.editor.placeholder = column.editor.placeholder || "请选择" + column.label;
            var addParams = $.extend(true, {}, column.editor);
            addParams.onItemSelect = function(data) {
                var model = widget.get("model");
                var onAdd = model.onAdd || column.editor.onAdd;
                if (tools.isFunction(onAdd)) {
                    var ret = onAdd(widget.get("editors"));
                    if (ret !== false) {
                        var editors = widget.get("editors");
                        for (var i in editors) {
                            editors[i].reset();
                        }
                    }
                }
            };
            addParams.triggerType = "form";
            column.addParams = addParams;
            var editParams = $.extend(true, {}, column.editor);
            editParams.onItemSelect = function(data) {
                if (tools.isFunction(column.editor.onChange)) {
                    var rowIndex = widget.getIndex(widget.$(".editing"));
                    var datas = widget.get("data");
                    var data = datas[rowIndex];
                    column.editor.onChange(widget.get("editor"), rowIndex, data);
                }
            };
            editParams.triggerType = "form";
            column.editParams = editParams;
        },
        events: function() {
            var events = EditGrid.superclass.events.call(this, arguments);
            var model = this.get("model");
            //单元格点击时，生成对应的编辑框
            events["click td"] = function(e) {
                if (model.editable && model.allowEdit) {
                    var el = $(e.currentTarget);
                    var curIndex = this.getIndex(el);
                    var curClassName = $(e.currentTarget).attr("class");
                    if (el.hasClass("editing")) {
                        //证明当前点击的是正在编辑的单元格，不做任何处理
                        return false;
                    } else {
                        //销毁老的编辑框
                        var oldTd = this.$(".editing");
                        if (oldTd.length) {
                            oldTd.removeClass("editing");
                            oldTd.find("pre").removeClass("hidden");
                            this.get("editor").destroy();
                            this.set("editor", null);
                        }
                    }
                    //生成新的编辑框
                    if (curClassName.indexOf("J-editgrid-edit-td")) {
                        var curTd = this.$("." + curClassName.split(" ")[0]).eq(curIndex);
                        var curPre = curTd.find("pre");
                        var column = this.getColumnConfig(curTd);
                        var rowIndex = this.getIndex(curTd);
                        var datas = this.get("data");
                        var data = datas[rowIndex];
                        var mark = true;
                        if (column.editor && column.editor.type) {
                            if (tools.isFunction(column.editor.onBeforeEdit)) {
                                mark = column.editor.onBeforeEdit(data);
                            }
                            if (mark) {
                                curTd.addClass("editing");
                                curPre.addClass("hidden");
                                var div = $("<div></div>");
                                curTd.append(div);
                                this._initEditElement(column, div, "edit");
                                this._beforeEdit(this.get("editor"), column);
                                if (column.editor.onEdit) {
                                    column.editor.onEdit(this.get("editor"), rowIndex, data);
                                } else {
                                    var curValue = curPre.text();
                                    this.get("editor").setValue(curValue);
                                }
                                this._afterEdit(this.get("editor"), column);
                            }
                        }
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            return events;
        },
        add: function(data) {
            var datas = this.get("data");
            this.insert(datas.length, data);
        },
        update: function(index, data) {
            //更新模型
            var datas = this.get("data");
            datas[index] = data;
            //更新视图
            var tr = this.$("tbody tr").eq(index);
            var model = this.get("model");
            var columns = model.columns;
            for (var j in columns) {
                var name = columns[j].name;
                var pre = tr.find("td.J-grid-columns-" + name.replace(/\./g, "-")).find("pre");
                var value = tools._getValueFromObject(columns[j].name, data);
                var format = columns[j].format;
                if (typeof format === "string" && tools["gridformat_" + format]) {
                    value = tools["gridformat_" + format](columns[j].formatparams, value, data, model);
                } else if (typeof format === "function") {
                    value = format(value, data);
                }
                pre.html(value);
            }
        },
        setText: function(rowIndex, colName, text) {
            var splits = colName.split(":");
            var name = splits[0];
            var index = splits[1] || 0;
            this.$("tbody tr").eq(rowIndex).find("td.J-grid-columns-" + name.replace(/\./g, "-")).eq(index).find("pre").text(text);
        },
        getText: function(rowIndex, colName) {
            var splits = colName.split(":");
            var name = splits[0];
            var index = splits[1] || 0;
            this.$("tbody tr").eq(rowIndex).find("td.J-grid-columns-" + name.replace(/\./g, "-")).eq(index).find("pre").text();
        },
        setDisabled: function(mark) {
            var model = this.get("model");
            model.editable = !mark;
            if (mark) {
                this.$("tfoot tr").eq(0).addClass("hidden");
            } else if (!mark && model.allowAdd === true) {
                this.$("tfoot tr").eq(0).removeClass("hidden");
            }
        },
        getPlugins: function() {
            return this.get("editors");
        },
        destroy: function() {
            this.set("editor", null);
            var editors = this.get("editors");
            for (var i in editors) {
                if (editors[i]) {
                    editors[i].destroy();
                }
            }
            this.set("editors", {});
            EditGrid.superclass.destroy.call(this, arguments);
        }
    });
    module.exports = EditGrid;
});
