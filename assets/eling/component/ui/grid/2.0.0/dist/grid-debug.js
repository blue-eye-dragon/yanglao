/**
 * @name grid
 * @version 2.0.0
 * @description 列表
 * @dependencies ["uicomponent-2.0.0","handlebars","tools","pagination"]
 */
define("eling/component/ui/grid/2.0.0/dist/grid-debug", [ "jquery/jquery-plugins/pagination/pagination", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/utils/tools/tools", "./grid.tpl", "eling/component/utils/ajaxwrapper", "dialog", "store", "./grid.css" ], function(require, exports, module) {
    require("jquery/jquery-plugins/pagination/pagination");
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var HandlerBars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var tools = require("eling/component/utils/tools/tools");
    var tpl = require("./grid.tpl");
    var aw = require("eling/component/utils/ajaxwrapper");
    require("./grid.css");
    HandlerBars.registerHelper("grid_2", function(context, option) {
        var records = context.data;
        var columns = context.columns;
        var ret = "";
        for (var i in records) {
            var idAttribute = context.idAttribute;
            if (idAttribute) {
                ret += "<tr class='J-" + tools._getValueFromObject(idAttribute, records[i]) + "'>";
            } else {
                ret += "<tr>";
            }
            if (context.isCheckbox) {
                if (tools.isFunction(context.hasChecked)) {
                    var mark = context.hasChecked(records[i], i);
                    if (mark) {
                        ret += "<td><input class='J-grid-checkbox J-grid-" + context.id + "-checkbox' type='checkbox'></td>";
                    } else {
                        ret += "<td></td>";
                    }
                } else {
                    ret += "<td><input class='J-grid-checkbox J-grid-" + context.id + "-checkbox' type='checkbox'></td>";
                }
            }
            if (context.isRadiobox) {
                if (tools.isFunction(context.hasChecked)) {
                    var mark = context.hasChecked(records[i], i);
                    if (mark) {
                        ret += "<td><input class='J-grid-radiobox J-grid-" + context.id + "-radiobox' type='radio' name='grid-" + context.id + "-radiobox'></td>";
                    } else {
                        ret += "<td></td>";
                    }
                } else {
                    ret += "<td><input class='J-grid-radiobox J-grid-" + context.id + "-radiobox' type='radio' name='grid-" + context.id + "-radiobox'></td>";
                }
            }
            for (var j in columns) {
                var value = tools._getValueFromObject(columns[j].name, records[i]);
                if (value === null || value === undefined) {
                    value = records[i];
                }
                ret += "<td class='J-grid-columns-" + columns[j].id + " " + (columns[j].className || " ") + "'><pre>";
                var format = columns[j].format;
                if (typeof format === "string" && tools["gridformat_" + format]) {
                    value = tools["gridformat_" + format](columns[j].formatparams, value, records[i], context);
                } else if (typeof format === "function") {
                    value = format(value, records[i]);
                }
                ret += value;
                ret += "</pre></td>";
            }
            ret += "</tr>";
        }
        return ret;
    });
    /**
	 * @Component(name=grid, description=列表, version=2.0.0)
	 */
    var Grid = UIComponent.extend({
        editors: {},
        _firstServerPage: true,
        attrs: {
            template: tpl,
            autoRender: true,
            model: {
                id: null,
                personalization: "",
                head: {
                    buttons: []
                },
                isInitPageBar: true,
                lazyPage: false,
                items_per_page: 15,
                columns: [],
                url: null,
                params: null,
                data: [],
                isCheckbox: false,
                isRadiobox: false
            },
            //用于存放总数据，此数据是第一次发送请求查回来的数据，不随着数据的分页而修改
            data: []
        },
        _loadData: function(url, params, callback) {
            var that = this;
            var model = this.get("model");
            var queryParams = params || model.params || {};
            if (typeof queryParams === "function") {
                queryParams = queryParams();
            }
            if (model.lazyPage == true) {
                queryParams.firstResult = 0;
                queryParams.maxResults = model.items_per_page;
                queryParams.queryCount = true;
            }
            var isInitPageBar = model.isInitPageBar;
            this.loading();
            aw.ajax({
                url: url,
                data: queryParams,
                success: function(data) {
                    //缓存全局查询结果
                    that.set("data", data);
                    //设置显示查询结果（分页）
                    that._setData(data, isInitPageBar);
                    //执行回掉
                    if (typeof callback === "function") {
                        callback(data);
                    }
                },
                error: function(data) {
                    that._setData([], isInitPageBar);
                }
            });
        },
        //getPersonalizationConfig : function(columns,custConfig){
        //	var custColumns = [];
        //	for(var i in columns){
        //		var name = columns[i].name;
        //		var config = custConfig[name];
        //		if(config.show != false){
        //			custColumns.push(columns[i]);
        //		}
        //	}
        //	return custColumns;
        //},
        initCustAttr: function(custConfig) {
            var model = this.get("model");
            if (!model.url && this.get("url")) {
                model.url = this.get("url");
            }
            if (!model.params && this.get("params")) {
                model.params = this.get("params");
            }
            var columns = /*custConfig ? this.getPersonalizationConfig(columns,custConfig) : */ model.columns;
            var length = model.columns.length;
            if (model.isCheckbox || model.isRadiobox) {
                length = length + 1;
            }
            model.length = length;
            var columnsConfig = {};
            for (var i in columns) {
                if (columns[i].key && columns[i].name) {
                    //兼容旧版本的配置
                    //{key:"",name:""}->{name:"",label:""}
                    columns[i].label = columns[i].name;
                    columns[i].name = columns[i].key;
                }
                var key = columns[i].name || "";
                var id = key.replace(/\./g, "-");
                columns[i].id = id;
                columnsConfig[id] = columns[i];
            }
            this.set("columnsConfig", columnsConfig);
        },
        events: function() {
            var events = {};
            var model = this.get("model");
            var that = this;
            var el = this.element;
            //绑定列表中列的事件
            var columns = model.columns;
            var isSort = false;
            for (var i in columns) {
                (function(i_index) {
                    //判断是否有分页字段
                    if (columns[i_index].issort) {
                        isSort = true;
                    }
                    var formatparams = columns[i_index].formatparams;
                    if (formatparams && formatparams.constructor !== Array) {
                        formatparams = [ formatparams ];
                    }
                    for (var j in formatparams) {
                        (function(j_index) {
                            events["click .J-grid-" + model.id + "-" + (formatparams[j_index].id || formatparams[j_index].key)] = function(e) {
                                var num = this.getIndex(e.target);
                                var data = this.getData(num);
                                var rowEle = $(e.currentTarget).parents("tr");
                                var handler = formatparams[j_index].handler || function() {};
                                handler(num, data, rowEle, e);
                            };
                        })(j);
                    }
                })(i);
            }
            //绑定头部事件J-grid-(grid的id)-head-(对应button的id)
            var buttons = model.head.buttons;
            for (var m in buttons) {
                (function(index) {
                    events["click .J-grid-" + model.id + "-head-" + buttons[index].id] = function() {
                        if (buttons[index].handler) {
                            buttons[index].handler();
                        }
                    };
                })(m);
            }
            //绑定checkbox全选事件
            if (model.isCheckbox) {
                events["click .J-grid-" + model.id + "-selectAll"] = function(e) {
                    if ($(e.target).prop("checked")) {
                        el.find("tbody input[type='checkbox']").prop("checked", true);
                    } else {
                        el.find("tbody input[type='checkbox']").prop("checked", false);
                    }
                    if (typeof model.clickSelectAll == "function") {
                        model.clickSelectAll();
                    }
                };
                events["click .J-grid-checkbox"] = model.clickCheckbox || function() {
                    return false;
                };
            }
            if (model.isRadiobox) {
                events["click .J-grid-radiobox"] = model.clickRadiobox || function() {
                    return false;
                };
            }
            //绑定排序事件
            if (isSort) {
                events["click .text-sort-header"] = function(e) {
                    $(".J-sort", el).children().hide();
                    $(".icon-sort", el).css("display", "inline");
                    $(".J-sort", e.currentTarget).children().hide();
                    if (that.sort == "up") {
                        that.sort = "down";
                        $(".icon-sort-down", e.currentTarget).css("display", "inline");
                    } else {
                        that.sort = "up";
                        $(".icon-sort-up", e.currentTarget).css("display", "inline");
                    }
                    this.updateBySort($(e.currentTarget).attr("data-name"));
                };
            }
            return events;
        },
        afterRender: function() {
            var that = this;
            var model = this.get("model");
            var head = model.head;
            if (head && this.get("_headPluginInit") !== true) {
                var items = head.items || [];
                for (var i in items) {
                    var type = items[i].type || "text";
                    items[i].triggerType = items[i].triggerType || "form";
                    items[i].style = items[i].style || "float:right;margin-right:10px;width:180px;";
                    (function(item) {
                        tools.loadModule(item.component || item.type, function(Component) {
                            var comp = new Component({
                                parentNode: that.$(".J-grid-head-formel"),
                                model: item
                            });
                            that.editors[item.id || item.name] = comp;
                        });
                    })(items[i]);
                }
            }
            this.set("_headPluginInit", true);
        },
        updateBySort: function(sortKey) {
            var sort = this.sort;
            var tData = this.get("data").sort(function(value1, value2) {
                var v1 = tools._getValueFromObject(sortKey, value1);
                var v2 = tools._getValueFromObject(sortKey, value2);
                if (sort == "up") {
                    if (v1 > v2) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else {
                    if (v1 < v2) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
            this.setData(tData);
        },
        setup: function() {
            this.render();
            var autoRender = this.get("autoRender");
            var url = this.get("model").url;
            if (url && autoRender) {
                this._loadData(url);
            }
        },
        _setData: function(data, isInitPageBar) {
            var model = this.get("model");
            model.data = data;
            //设置grid总页数和总记录数
            this.$(".J-grid-total-info").text(this._getTotalInfo());
            if (isInitPageBar) {
                var lazyPage = model.lazyPage;
                var datas = this.get("data");
                var length = datas.length == 0 ? 0 : lazyPage ? datas[0].countResults : model.data.length;
                this._initPageBar(length);
            } else {
                this._renderBody();
            }
        },
        _getTotalInfo: function() {
            var model = this.get("model");
            var lazyPage = model.lazyPage;
            var datas = this.get("data");
            var length = datas.length == 0 ? 0 : lazyPage ? datas[0].countResults : datas.length;
            return "共" + (model.isInitPageBar ? Math.ceil(length / model.items_per_page) + "页，" + length + "条记录" : length + "条记录");
        },
        _initPageBar: function(length) {
            var that = this;
            var model = this.get("model");
            var modelData = model.data || [];
            this.$(".J-pagination").pagination(length, {
                callback: function(index, jq) {
                    if (model.lazyPage) {
                        //后台分页
                        if (that._firstServerPage == true) {
                            that._setData(that.get("data"), false);
                            that._firstServerPage, false;
                        } else {
                            that.loading();
                            var queryParams = model.params;
                            if (typeof queryParams == "function") {
                                queryParams = queryParams();
                            }
                            queryParams.firstResult = index * model.items_per_page;
                            queryParams.maxResults = model.items_per_page;
                            queryParams.queryCount = false;
                            aw.ajax({
                                url: model.url,
                                data: queryParams,
                                success: function(data) {
                                    that.set("data", data);
                                    model.data = data;
                                    that._renderBody();
                                }
                            });
                        }
                    } else {
                        //前台分页
                        var items_per_page = model.items_per_page;
                        var start = index * items_per_page;
                        var end = Math.min((index + 1) * items_per_page, length);
                        var showData = modelData.slice(start, end);
                        that._setData(showData, false);
                    }
                },
                link_to: "javascript:void(0);",
                items_per_page: model.items_per_page,
                next_text: "下一页",
                prev_text: "上一页",
                num_display_entries: 10,
                num_edge_entries: 2
            });
        },
        /** @method(name=setData,description=设置列表的数据集)
		 * 	@params(name=data,type=Array,description=数据集，要求是一个数组)
		 */
        setData: function(data) {
            this.set("data", data || []);
            this._setData(data, this.get("model").isInitPageBar);
        },
        /** @method(name=getData,description=获取列表的数据集)
		 *  @params(name=index,type=integer,description=行数)
		 */
        getData: function(index) {
            //index是指整个数据集的索引
            if (index !== undefined && !isNaN(index)) {
                return this.get("data")[index];
            } else {
                return this.get("data");
            }
        },
        /** @method(name=save,description=更新（新增或修改一行）)
		 *  @params(name=data,type=object,description=要更新的数据)
		 */
        save: function(index, data) {
            if (arguments.length == 2) {
                if (index == -1) {
                    //新增
                    this.insert(0, data);
                } else {
                    //修改
                    this.update(index, data);
                }
            } else {
                var idValue = tools._getValueFromObject(this.get("model").idAttribute, index);
                var tr = this.$("tr.J-" + idValue);
                if (tr.length == 0) {
                    //新增
                    this.insert(0, index);
                } else {
                    //修改
                    this.update(this.getIndex(tr), index);
                }
            }
        },
        insert: function(index, data) {
            this.get("data").splice(index, 0, data);
            //因为insert要改变数据数，所以要重新分页
            this._setData(this.get("data"), this.get("model").isInitPageBar);
        },
        update: function(index, data) {
            var datas = this.get("data");
            if (index > datas.length) {
                return;
            } else {
                index = index % this.get("model").items_per_page;
                this.$("tbody tr").eq(index).replaceWith(this._geneRow(data));
                datas.splice(index, 1, data);
            }
        },
        /** @method(name=remove,description=删除一行数据)
		 *  @params(name=data,type=object,description=要删除的数据)
		 */
        remove: function(el) {
            var index = null;
            if (typeof el === "number") {
                index = el;
            } else {
                index = this.getIndex(el);
            }
            this.get("data").splice(index, 1);
            this._setData(this.get("data"), this.get("model").isInitPageBar);
        },
        _geneRow: function(data) {
            var model = this.get("model");
            return HandlerBars.compile("{{#grid_2 this}}{{/grid_2}}")({
                id: model.id,
                idAttribute: model.idAttribute,
                data: [ data ],
                columns: model.columns,
                isCheckbox: model.isCheckbox,
                isRadiobox: model.isRadiobox
            });
        },
        /** @method(name=refresh,description=重新刷新列表)
		 * 	@params(name=params,type=object | Array,description=查询参数，可以是一个查询参数对象，或者是一个返回查询参数的方法)
		 *  @params(name=callback,type=function,description=刷新成功后的回掉方法)
		 */
        refresh: function(params, callback) {
            this._firstServerPage = true;
            this._loadData(this.get("model").url, params, callback);
        },
        /** @method(name=getSelectedData,description=获取列表中选中的行)
		 */
        getSelectedData: function() {
            var model = this.get("model");
            var data = this.get("data");
            if (!data) {
                return null;
            }
            var that = this;
            var results = [];
            //如果没有传递参数，则默认去取当前列表选中的checkbox的数据
            if (model.isCheckbox === true) {
                this.$("tbody input.J-grid-checkbox:checked").each(function() {
                    var checkIndex = that.getIndex($(this));
                    results.push(data[checkIndex]);
                });
            } else if (model.isRadiobox === true) {
                this.$("tbody input.J-grid-radiobox:checked").each(function() {
                    var checkIndex = that.getIndex($(this));
                    results.push(data[checkIndex]);
                });
            }
            return results;
        },
        /** @method(name=getIndex,description=获取当前触发事件时所在行的索引)
		 * 	@params(name=el,type=js事件中的e.target,description=触发事件的元素)
		 */
        getIndex: function(el) {
            var model = this.get("model");
            var currentPage = parseInt(this.$(".J-pagination span[class='current']").text()) || 0;
            var currentPage = currentPage > 0 ? currentPage - 1 : 0;
            var viewIndex;
            if ($(el).is("tr")) {
                viewIndex = this.$(el).prevAll().size();
            } else {
                viewIndex = this.$(el).parents("tr").prevAll().size();
            }
            return model.lazyPage ? viewIndex : viewIndex + currentPage * model.items_per_page;
        },
        /** @method(name=setTitle,description=设置列表的标题)
		 * 	@params(name=title,description=列表的标题)
		 */
        setTitle: function(title) {
            this.$(".J-grid-title").text(title);
        },
        /** @method(name=getTitle,description=获取列表的标题)
		 */
        getTitle: function() {
            return this.$(".J-grid-title").text();
        },
        /** @method(name=loading,description=使列表进入刷新状态)
		 */
        loading: function() {
            var template = "" + "<tr><td colspan=" + this.get("model").length + ">" + '<div class="loading">' + "{{#each this}}" + '<div class="item item-{{@index}}"></div>' + "{{/each}}" + "</div>" + "</td></tr>";
            this.$(".J-grid-table").html(HandlerBars.compile(template)(new Array(8)));
            this.get("model").data = [];
        },
        /** @method(name=hide,description=隐藏列表头部按钮)
		 *  @params(name=id,type=string | Array,description=列表头部按钮的id)
		 */
        hideButton: function(id) {
            var model = this.get("model");
            if (id.constructor === String) {
                id = [ id ];
            }
            for (var i in id) {
                this.$(".J-grid-" + model.id + "-head-" + id[i]).addClass("hidden");
            }
            return this;
        },
        /** @method(name=show,description=显示列表头部按钮)
		 *  @params(name=id,type=string | Array,description=列表头部按钮的id)
		 */
        showButton: function(id) {
            var model = this.get("model");
            if (id.constructor === String) {
                id = [ id ];
            }
            for (var i in id) {
                this.$(".J-grid-" + model.id + "-head-" + id[i]).removeClass("hidden");
            }
            return this;
        },
        /** @method(name=getValue,description=获取单元格的值)
		 *  @params(name=rowIndex,type=integer,description=行数（0开始）)
		 *  @params(name=colIndex,type=integer,description=列数（0开始）)
		 */
        getValue: function(rowIndex, colIndex) {
            var data = this.get("model").data;
            return data[rowIndex][colIndex];
        },
        getColumnConfig: function(el) {
            if (typeof el === "number") {
                //按照索引
                return this.get("model").columns[el];
            } else if (typeof el === "string") {
                //按照column的name
                return this.get("columnsConfig")[el];
            } else {
                var className = null;
                if ($(el).is("td")) {
                    className = $(el).attr("class").match(new RegExp("columns-[^ ]*"))[0];
                } else {
                    className = $(el).parents("td").attr("class").match(new RegExp("columns-[^ ]*"))[0];
                }
                return this.get("columnsConfig")[className.substring(8, className.length)];
            }
        },
        getColumnIndex: function(el) {
            if ($(el).is("td")) {
                return $(el).prevAll().size();
            } else {
                return $(el).parents("td").prevAll().size();
            }
        },
        _renderBody: function() {
            this.$(".J-grid-table").html(HandlerBars.compile("{{#grid_2 this}}{{/grid_2}}")(this.get("model")));
        },
        getheaderPlugins: function() {
            return this.editors;
        },
        destroy: function() {
            for (var i in this.editors) {
                this.editors[i].destroy();
            }
            Grid.superclass.destroy.call(this, arguments);
        }
    });
    module.exports = Grid;
});

define("eling/component/ui/grid/2.0.0/dist/grid.tpl", [], "<div id=\"{{this.id}}\" class='container el-grid el-grid-2'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n				<div class='col-sm-12'>\n					<div class='box' style='margin-bottom:0;'>\n						<div class='box-header'>\n							<div class='title J-grid-title'>{{this.head.title}}</div>\n							<div class='actions'>\n								{{#each this.head.buttons}}\n								<div class=\"J-grid-{{../this.id}}-head-{{this.id}} btn btn-theme\">\n									{{this.text}}\n									<i class=\"{{this.icon}}\"></i>\n								</div>\n								{{/each}}\n							</div>\n							<div class='actions J-grid-head-formel'></div>\n						</div>\n						<div class='box-content box-no-padding'>\n							<table style='border:0 none;margin-bottom:0;' class='data-table-column-filter table table-bordered table-striped'>\n								<thead>\n    								<tr>\n    									{{#if this.isCheckbox}}\n    										<th style='width: 5%;'><input class='J-grid-{{this.id}}-selectAll' type='checkbox'></th>\n    									{{/if}}\n    									{{#if this.isRadiobox}}\n    										<th style='width: 5%;'></th>\n    									{{/if}}\n	    								{{#each this.columns}}\n	    									<th class=\"text-center {{this.className}} {{#if this.issort}}text-sort-header{{/if}}\" data-name=\"{{this.name}}\">{{this.label}}\n	    										{{#if this.issort}}\n												<div class=\"J-sort\">\n													<div class=\"icon-sort sort-show\"></div>\n    												<div class=\"icon-sort-up sort-hide\"></div>\n    												<div class=\"icon-sort-down sort-hide\"></div>\n												</div>\n												{{/if}}\n	    									</th>\n	    								{{/each}}\n    								</tr>\n  									</thead>\n  									<tbody class=\"J-grid-table\">\n	    								{{#grid_2 this}}\n	    								{{/grid_2}}\n	                				</tbody>\n               					<tfoot class=\"J-grid-footer\">\n                					<tr style=\"display: table-row !important;\">\n               							<th colspan='{{this.length}}'>\n               								<div class=\"J-grid-total-info\" style=\"float: left;margin-top: 5px;\"></div>\n               								<div class=\"J-pagination pagination\" style=\"float: right;margin: 0;\"></div>\n               							</th>\n                					</tr>\n                				</tfoot>\n                			</table>\n		                </div>\n		            </div>\n		        </div>\n		    </div>\n		</div>\n	</div>\n</div>");

define("eling/component/ui/grid/2.0.0/dist/grid.css", [], function() {
    seajs.importStyle(".el-grid.el-grid-2 .loading{position:relative;width:32px;height:40px;left:50%;margin-left:-32px}.el-grid.el-grid-2 .loading .item{position:absolute;background-color:#FFF;width:5px;height:12px;-moz-border-radius:5px 5px 0 0;-moz-transform:scale(0.4);-moz-animation-name:fadeG;-moz-animation-duration:1.04s;-moz-animation-iteration-count:infinite;-moz-animation-direction:normal;-webkit-border-radius:5px 5px 0 0;-webkit-transform:scale(0.4);-webkit-animation-name:fadeG;-webkit-animation-duration:1.04s;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:normal;-ms-border-radius:5px 5px 0 0;-ms-transform:scale(0.4);-ms-animation-name:fadeG;-ms-animation-duration:1.04s;-ms-animation-iteration-count:infinite;-ms-animation-direction:normal;-o-border-radius:5px 5px 0 0;-o-transform:scale(0.4);-o-animation-name:fadeG;-o-animation-duration:1.04s;-o-animation-iteration-count:infinite;-o-animation-direction:normal;border-radius:5px 5px 0 0;transform:scale(0.4);animation-name:fadeG;animation-duration:1.04s;animation-iteration-count:infinite;animation-direction:normal}.el-grid.el-grid-2 .loading .item-0{left:0;top:15px;-moz-animation-delay:.39s;-moz-transform:rotate(-90deg);-webkit-animation-delay:.39s;-webkit-transform:rotate(-90deg);-ms-animation-delay:.39s;-ms-transform:rotate(-90deg);-o-animation-delay:.39s;-o-transform:rotate(-90deg);animation-delay:.39s;transform:rotate(-90deg)}.el-grid.el-grid-2 .loading .item-1{left:4px;top:5px;-moz-animation-delay:.52s;-moz-transform:rotate(-45deg);-webkit-animation-delay:.52s;-webkit-transform:rotate(-45deg);-ms-animation-delay:.52s;-ms-transform:rotate(-45deg);-o-animation-delay:.52s;-o-transform:rotate(-45deg);animation-delay:.52s;transform:rotate(-45deg)}.el-grid.el-grid-2 .loading .item-2{left:13px;top:2px;-moz-animation-delay:.65s;-moz-transform:rotate(0deg);-webkit-animation-delay:.65s;-webkit-transform:rotate(0deg);-ms-animation-delay:.65s;-ms-transform:rotate(0deg);-o-animation-delay:.65s;-o-transform:rotate(0deg);animation-delay:.65s;transform:rotate(0deg)}.el-grid.el-grid-2 .loading .item-3{right:4px;top:5px;-moz-animation-delay:.78s;-moz-transform:rotate(45deg);-webkit-animation-delay:.78s;-webkit-transform:rotate(45deg);-ms-animation-delay:.78s;-ms-transform:rotate(45deg);-o-animation-delay:.78s;-o-transform:rotate(45deg);animation-delay:.78s;transform:rotate(45deg)}.el-grid.el-grid-2 .loading .item-4{right:0;top:15px;-moz-animation-delay:.91s;-moz-transform:rotate(90deg);-webkit-animation-delay:.91s;-webkit-transform:rotate(90deg);-ms-animation-delay:.91s;-ms-transform:rotate(90deg);-o-animation-delay:.91s;-o-transform:rotate(90deg);animation-delay:.91s;transform:rotate(90deg)}.el-grid.el-grid-2 .loading .item-5{right:4px;bottom:4px;-moz-animation-delay:1.04s;-moz-transform:rotate(135deg);-webkit-animation-delay:1.04s;-webkit-transform:rotate(135deg);-ms-animation-delay:1.04s;-ms-transform:rotate(135deg);-o-animation-delay:1.04s;-o-transform:rotate(135deg);animation-delay:1.04s;transform:rotate(135deg)}.el-grid.el-grid-2 .loading .item-6{bottom:0;left:13px;-moz-animation-delay:1.17s;-moz-transform:rotate(180deg);-webkit-animation-delay:1.17s;-webkit-transform:rotate(180deg);-ms-animation-delay:1.17s;-ms-transform:rotate(180deg);-o-animation-delay:1.17s;-o-transform:rotate(180deg);animation-delay:1.17s;transform:rotate(180deg)}.el-grid.el-grid-2 .loading .item-7{left:4px;bottom:4px;-moz-animation-delay:1.3s;-moz-transform:rotate(-135deg);-webkit-animation-delay:1.3s;-webkit-transform:rotate(-135deg);-ms-animation-delay:1.3s;-ms-transform:rotate(-135deg);-o-animation-delay:1.3s;-o-transform:rotate(-135deg);animation-delay:1.3s;transform:rotate(-135deg)}@-moz-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-webkit-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-ms-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-o-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}.el-grid.el-grid-2 tbody td{vertical-align:middle!important;word-break:break-word!important;position:relative}.el-grid.el-grid-2 td pre{background:inherit;border:0 none;padding:0;margin:0;word-wrap:break-word}.el-grid.el-grid-2 th{border-bottom:0!important}.text-sort-header{cursor:pointer}.J-sort{display:inline}.sort-hide{display:none}.sort-show{display:inline}@media print{.el-grid.el-grid-2 td{padding:0 2px!important}}");
});
