define("eling/component/ui/grid/1.0.0/dist/grid-debug", [ "jquery/jquery-plugins/pagination/pagination", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/utils/ajaxwrapper", "dialog", "store", "eling/component/utils/gridformat/gridformat", "./grid.css", "./grid.tpl" ], function(require, exports, module) {
    require("jquery/jquery-plugins/pagination/pagination");
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var aw = require("eling/component/utils/ajaxwrapper");
    var GridFormat = require("eling/component/utils/gridformat/gridformat");
    require("./grid.css");
    handlebars.registerHelper("grid", function(context, option) {
        var records;
        if (context.data && context.data.records) {
            records = context.data.records;
        } else if (context.data) {
            records = context.data;
        } else {
            records = {};
        }
        var columns = context.columns || [];
        var ret = "";
        var index = context.newIndex || 0;
        var idAttribute = context.idAttribute;
        for (var i = 0; i < records.length; i++) {
            var data_idAttribute = GridFormat.getValue(idAttribute, records[i]);
            ret += "<tr data-index='" + index + "' data-idAttribute='" + data_idAttribute + "'>";
            if (context.isCheckbox) {
                ret += "<td><input class='J-checked J-checkbox' type='checkbox'></td>";
            }
            if (context.isRadiobox) {
                ret += "<td><input class='J-checked J-radiobox' type='radio' name='grid-radiobox'></td>";
            }
            for (var j = 0; j < columns.length; j++) {
                var key = columns[j].key || "";
                var id = key.replace(".", "_");
                var value = records[i] || "";
                if (value) {
                    value = GridFormat.getValue(key, records[i]) || records[i][j] || "";
                }
                if (columns[j].textAlign || context.textAlign) {
                    ret += "<td style='text-align:" + (columns[j].textAlign || context.textAlign || "") + ";' class='J-" + id + " " + (columns[j].className || "") + "'><pre>";
                } else {
                    ret += "<td class='J-" + id + " " + (columns[j].className || "") + "'><pre>";
                }
                var format = columns[j].format;
                var formatName = "";
                if (typeof format === "function") {
                    formatName = format(value, records[i]);
                }
                if (GridFormat[format] || GridFormat[formatName]) {
                    ret += GridFormat[format] ? GridFormat[format](columns[j].formatparams, value, records[i], context) : GridFormat[formatName](columns[j].formatparams, value, records[i], context);
                } else if (typeof format === "function") {
                    ret += format(value, records[i]);
                } else {
                    ret += value;
                }
                ret += "</pre></td>";
            }
            ret += "</tr>";
            index++;
        }
        return ret;
    });
    var Grid = UIComponent.extend({
        attrs: {
            template: require("./grid.tpl"),
            parentNode: ".J-list",
            isInitPageBar: true,
            fetchProperties: "",
            //用于存放总数据，此数据是第一次发送请求查回来的数据，不随着数据的分页而修改
            data: []
        },
        _loadData: function(url, params, callback) {
            var that = this;
            var autoRender = this.get("autoRender");
            if (autoRender != false) {
                var queryParams = params || that.get("params") || "";
                if (typeof queryParams === "function") {
                    queryParams = queryParams();
                }
                if (this.get("fetchProperties")) {
                    queryParams = $.extend(true, queryParams, {
                        fetchProperties: this.get("fetchProperties")
                    });
                }
                var isInitPageBar = this.get("isInitPageBar") == false ? false : true;
                this.loading();
                var params = aw.customParam(queryParams) || "";
                aw.ajax({
                    url: url,
                    dataType: "json",
                    type: "GET",
                    data: params.substring(0, params.length - 1),
                    success: function(data) {
                        that.set("data", data);
                        that._setData(data, isInitPageBar);
                        that.element.find(".ajaxloader").parents("tr").remove();
                        if (typeof callback === "function") {
                            callback(data);
                        }
                    },
                    error: function(data) {
                        that._setData([], isInitPageBar);
                    }
                });
            }
        },
        initCustAttr: function() {
            var model = this.get("model") || {};
            //是否显示分页
            if (this.get("isInitPageBar") == false) {
                model.isInitPageBar = false;
            } else {
                model.isInitPageBar = true;
            }
            var columns = model.columns;
            var length = model.columns.length;
            if (model.isCheckbox || model.isRadiobox) {
                length = length + 1;
            }
            model.length = length;
        },
        events: function() {
            var that = this;
            var events = {};
            var model = this.get("model") || {};
            var columns = model.columns || [];
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].formatparams) {
                    (function(i_index) {
                        var formatparams = columns[i_index].formatparams || [];
                        for (var j = 0; j < formatparams.length; j++) {
                            (function(j_index) {
                                events["click .J-" + (formatparams[j_index].id || formatparams[j_index].key)] = function(e) {
                                    var num = this.getIndex(e.target);
                                    var data = this.getSelectedData(num);
                                    var rowEle = this.element.find("tbody tr").eq(num);
                                    var handler = formatparams[j_index].handler || function() {};
                                    handler.apply(that, [ num, data, rowEle, e ]);
                                };
                            })(j);
                        }
                    })(i);
                }
            }
            if (model.head) {
                var buttons = model.head.buttons || [];
                for (var m = 0; m < buttons.length; m++) {
                    (function(index) {
                        events["click .J-grid-head-" + buttons[index].id] = function() {
                            if (buttons[index].handler) {
                                buttons[index].handler.call(that);
                            }
                        };
                    })(m);
                }
            }
            //绑定checkbox全选事件
            if (model.isCheckbox) {
                events["click .J-grid-all-checkbox"] = function(e) {
                    if ($(e.target).prop("checked")) {
                        that.$(".J-checked").prop("checked", true);
                    } else {
                        that.$(".J-checked").prop("checked", false);
                    }
                };
            }
            return events;
        },
        setup: function() {
            this.render();
            var url = this.get("url");
            if (url) {
                this._loadData(url);
            }
        },
        setData: function(data) {
            data = data || [];
            this.set("data", data);
            this._setData(data, this.get("isInitPageBar"));
        },
        getData: function() {
            return this.get("data");
        },
        _setData: function(data, isInitPageBar) {
            //data存放的只是当前页的数据
            var model = this.get("model");
            model.data = data;
            this.renderPartial(".J-grid-table");
            //设置grid总页数和总记录数
            var totalData = this.get("data");
            var totalText = "共" + (this.get("isInitPageBar") ? Math.ceil(totalData.length / (this.get("items_per_page") || 15)) + "页，" + totalData.length + "条记录" : totalData.length + "条记录");
            this.$(".J-grid-total-info").text(totalText);
            if (isInitPageBar) {
                this._initPageBar(model.data.length);
            }
        },
        _initPageBar: function(length) {
            var that = this;
            //分页类型，0 为前端分页，1为后端分页
            var model = this.get("model");
            var data = model.data || [];
            this.element.find(".J-pagination").pagination(length, {
                callback: function(index, jq) {
                    var items_per_page = that.get("items_per_page") || 15;
                    var start = index * items_per_page;
                    var end = Math.min((index + 1) * items_per_page, length);
                    var showData = data.slice(start, end);
                    that._setData(showData, false);
                },
                link_to: "javascript:void(0);",
                items_per_page: that.get("items_per_page") || 15,
                next_text: "下一页",
                prev_text: "上一页",
                num_display_entries: 10,
                num_edge_entries: 2
            });
        },
        refresh: function(params, callback) {
            this.set("autoRender", true);
            this._loadData(this.get("url"), params, callback);
        },
        getSelectedData: function(index) {
            var model = this.get("model");
            var data = model.data;
            if (data) {
                if (!index && index != 0) {
                    var results = [];
                    //如果没有传递参数，则默认去取当前列表选中的checkbox的数据
                    this.element.find(".J-checked:checked").each(function() {
                        var checkIndex = $(this).parents("tr").attr("data-index");
                        var result = data[checkIndex];
                        results.push(result);
                    });
                    return results;
                }
                return data[index];
            } else {
                return {};
            }
        },
        //type=1：获取所点击行在视图中的位置；type=0：获取所点击行的模型的位置，默认是0
        getIndex: function(ele, type) {
            if (type == "1") {
                return $(ele).parents("tr").prevAll().size();
            } else {
                return $(ele).parents("tr").attr("data-index");
            }
        },
        setTitle: function(title) {
            this.element.find(".J-grid-title").text(title);
        },
        getTitle: function(title) {
            return this.element.find(".J-grid-title").text();
        },
        loading: function() {
            this.element.find(".J-grid-table").html("<tr><td class='ajaxloader' colspan='" + this.get("model").length + "'></td></tr>");
            this.get("model").data = [];
        },
        hide: function(keyOrIndex) {
            if (keyOrIndex.constructor === String) {
                keyOrIndex = [ keyOrIndex ];
            }
            for (var i = 0; i < keyOrIndex.length; i++) {
                this.$(".J-grid-head-" + keyOrIndex[i]).addClass("hidden");
            }
            return this;
        },
        show: function(keyOrIndex) {
            if (keyOrIndex.constructor === String) {
                keyOrIndex = [ keyOrIndex ];
            }
            for (var i = 0; i < keyOrIndex.length; i++) {
                this.$(".J-grid-head-" + keyOrIndex[i]).removeClass("hidden");
            }
            return this;
        }
    });
    module.exports = Grid;
});

define("eling/component/ui/grid/1.0.0/dist/grid.css", [], function() {
    seajs.importStyle(".el-grid .ajaxloader{background:url(assets/eling/resources/ajaxloader/ajaxloader.gif) no-repeat;height:50px;background-position:50%}.el-grid tbody td{vertical-align:middle!important;word-break:break-word!important}.el-grid-multirow{height:30px;line-height:30px;padding:0 8px}.el-grid-multirow-border{border-bottom:1px solid #ddd}.el-grid .disabledrow{border:0 none;box-shadow:none;background:inherit}.el-grid td pre{background:inherit;border:0 none;padding:0;margin:0;word-wrap:break-word}@media print{.el-grid td{padding:0 2px!important}}");
});

define("eling/component/ui/grid/1.0.0/dist/grid.tpl", [], "<div class='container el-grid {{this.id}}'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n				<div class='col-sm-12'>\n					<div class='box' style='margin-bottom:0;'>\n						{{#if this.head}}\n							<div class='box-header'>\n								<div class='title J-grid-title'>{{this.head.title}}</div>\n								<div class='actions'>\n									{{#each this.head.buttons}}\n									<div class=\"J-grid-head-{{this.id}} btn btn-theme\">\n										{{#if this.text}}\n										<a class=\"btn-theme\" href='javascript:void(0);'>\n											{{this.text}}\n										</a>\n										{{else}}\n										<a class=\"btn-theme\" href='javascript:void(0);'>\n											<i class=\"{{this.icon}}\"></i>\n										</a>\n										{{/if}}\n									</div>\n									{{/each}}\n								</div>\n								<div class='actions'>\n									{{#if this.head.input}}\n										<input class=\"J-grid-title-input-{{this.head.input.id}} form-control\" \n											type=\"text\" placeholder=\"{{this.head.input.placeholder}}\">\n									{{/if}}\n								</div>\n							</div>\n						{{/if}}\n						<div class='box-content box-no-padding'>\n							<table style='border:0 none;margin-bottom:0;' class='data-table-column-filter table table-bordered table-striped'>\n								<thead>\n    								<tr>\n    									{{#if this.isCheckbox}}\n    										<th style='border-bottom-width:0;width: 5%;'><input class='J-grid-all-checkbox' type='checkbox'></th>\n    									{{/if}}\n    									{{#if this.isRadiobox}}\n    										<th style='border-bottom-width:0;width: 5%;'></th>\n    									{{/if}}\n	    								{{#each this.columns}}\n	    									<th style='border-bottom-width:0;' class=\"col-md-{{this.col}} {{this.className}} text-center\">{{this.name}}</th>\n	    								{{/each}}\n    								</tr>\n  									</thead>\n  									<tbody class=\"J-grid-table\">\n    								{{#grid this}}\n    								{{/grid}}\n                				</tbody>\n               					<tfoot class=\"J-grid-footer\">\n                					<tr style=\"display: table-row !important;\">\n               							<th colspan='{{this.length}}' style=\"border-bottom: 0;\">\n               								<div class=\"J-grid-total-info\" style=\"float: left;margin-top: 5px;\"></div>\n               								<div class=\"J-pagination pagination\" style=\"float: right;margin: 0;\"></div>\n               							</th>\n                					</tr>\n                				</tfoot>\n                			</table>\n		                </div>\n		            </div>\n		        </div>\n		    </div>\n		</div>\n	</div>\n</div>");
