define("eling/component/ui/editgrid/1.0.0/dist/editgrid-debug", [ "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/ui/grid/1.0.0/dist/grid", "jquery/jquery-plugins/pagination/pagination", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/ajaxwrapper", "dialog", "store", "eling/component/utils/gridformat/gridformat", "./editgrid.tpl", "eling/component/utils/tools/tools" ], function(require, exports, module) {
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var Grid = require("eling/component/ui/grid/1.0.0/dist/grid");
    var GridFormat = require("eling/component/utils/gridformat/gridformat");
    var template = require("./editgrid.tpl");
    var tools = require("eling/component/utils/tools/tools");
    handlebars.registerHelper("editgrid", function(model, option) {
        var datas = model.data || [];
        var columns = model.columns || [];
        var index = model.newIndex || 0;
        var ret = "";
        for (var i = 0; i < datas.length; i++) {
            var data_idAttribute = GridFormat.getValue(model.idAttribute, datas[i]);
            ret += "<tr data-index='" + index + "' data-idAttribute='" + data_idAttribute + "'>";
            //J-checked只是为了兼容父类，后续要处理掉
            if (model.isCheckbox) {
                ret += "<td><input class='J-checked J-grid-checkbox' type='checkbox'></td>";
            }
            if (model.isRadiobox) {
                ret += "<td><input class='J-checked J-grid-radiobox' type='radio'></td>";
            }
            for (var j = 0; j < columns.length; j++) {
                var key = columns[j].key || "";
                var id = key.replace(".", "-");
                var value = datas[i] || "";
                if (value) {
                    value = GridFormat.getValue(key, datas[i]);
                }
                ret += "<td class='J-grid-td-" + id + " " + (columns[j].className || "") + "'>";
                ret += "<pre>";
                var format = columns[j].format;
                var formatName = "";
                if (typeof format === "function") {
                    formatName = datas[i] ? format(value, datas[i]) : "";
                }
                if (GridFormat[format] || GridFormat[formatName]) {
                    ret += GridFormat[format] ? GridFormat[format](columns[j].formatparams, value, datas[i], model) : GridFormat[formatName](columns[j].formatparams, value, datas[i], model);
                } else if (typeof format === "function") {
                    ret += format(value, datas[i]) || "";
                } else {
                    //编辑单元格
                    if (columns[j].type == "text") {
                        ret += "<input class='form-control J-grid-td-input-" + id + "' type='text' value='" + (formatName || value) + "'>";
                    } else {
                        ret += formatName || value;
                    }
                }
                ret += "</pre>";
                ret += "</td>";
            }
            ret += "</tr>";
            index++;
        }
        return ret;
    });
    var EditGrid = Grid.extend({
        attrs: {
            template: template,
            isInitPageBar: false,
            data: []
        },
        addRow: function(addData, callback) {
            var model = this.get("model");
            var newIndex = this.$("tbody tr").size() != 0 ? parseInt(this.$("tbody tr").last().attr("data-index")) + 1 : 0;
            var html = handlebars.compile("{{#editgrid this}}{{/editgrid}}")({
                columns: model.columns,
                idAttribute: model.idAttribute,
                data: addData || new Array(1),
                newIndex: newIndex
            });
            this.$("tbody").append(html);
            if (callback) {
                callback();
            }
        },
        getRow: function(index) {
            if (index) {
                return this.$("tbody tr[data-index='" + index + "']");
            } else {
                return this.$("tbody tr");
            }
        },
        delRow: function(index) {
            this.getRow(index).remove();
        },
        editRow: function(rowIndex, colIndex) {
            var row = this.getRow(rowIndex);
            if (colIndex) {
                for (var i = 0; i < colIndex.length; i++) {
                    row.find("input").eq(colIndex[i]).removeAttr("disabled").removeClass("disabledrow");
                }
            } else {
                row.find("input").removeAttr("disabled").removeClass("disabledrow");
            }
        },
        disabledRow: function(rowIndex, colIndex) {
            var row = this.getRow(rowIndex);
            row.each(function(index, el) {
                if (colIndex) {
                    for (var i = 0; i < colIndex.length; i++) {
                        $(el).find("input").eq(colIndex[i]).attr("disabled", "disabled").addClass("disabledrow");
                    }
                } else {
                    $(el).find("input").attr("disabled", "disabled").addClass("disabledrow");
                }
            });
        },
        getEditData: function() {
            var columns = this.get("model").columns;
            var datas = [];
            this.element.find("tbody tr").each(function(i, rowel) {
                var data = {};
                $(rowel).find("td").each(function(j, colel) {
                    var value = $(colel).find(".J-grid-td-input-" + columns[j].key.replace(".", "-")).val();
                    data[columns[j].key] = value;
                });
                datas.push(data);
            });
            return datas;
        },
        getColumnsData: function(column) {
            var results = [];
            var model = this.get("model") || {};
            var data = model.data || [];
            for (var i = 0; i < data.length; i++) {
                var value = tools._getValueWithPoint(column, data[i]);
                results.push(value);
            }
            return results;
        },
        getIDAttribute: function(index) {
            return this.$("tbody tr").eq(index).attr("data-idAttribute");
        }
    });
    module.exports = EditGrid;
});

define("eling/component/ui/editgrid/1.0.0/dist/editgrid.tpl", [], "<div class='container el-grid'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n				<div class='col-sm-12'>\n					<div class='box' style='margin-bottom:0;'>\n						{{#if this.head}}\n							<div class='box-header'>\n								<div class='title J-grid-title'>{{this.head.title}}</div>\n								<div class='actions'>\n									{{#each this.head.buttons}}\n									<div class=\"J-grid-head-{{this.id}} btn btn-theme\">\n										<i class=\"{{this.icon}}\"></i>\n									</div>\n									{{/each}}\n									{{#if this.head.input}}\n										<input class=\"J-grid-title-input-{{this.id}} form-control margin_top_3\" type=\"text\" style=\"width: 80%;display: inline;\">\n									{{/if}}\n								</div>\n							</div>\n						{{/if}}\n						<div class='box-content box-no-padding'>\n							<table style='border:0 none;margin-bottom:0;' class='data-table-column-filter table table-bordered table-striped'>\n								<thead>\n    								<tr>\n   									{{#if this.isCheckbox}}\n   										<th style='border-bottom-width:0;width: 5%;'><input class='J-grid-all-checkbox' type='checkbox'></th>\n   									{{/if}}\n   									{{#if this.isRadiobox}}\n   										<th style='border-bottom-width:0;width: 5%;'></th>\n   									{{/if}}\n    								{{#each this.columns}}\n    									<th style='border-bottom-width:0;' class=\"col-md-{{this.col}}\">{{this.name}}</th>\n    								{{/each}}\n   								</tr>\n 								</thead>\n								<tbody class=\"J-grid-table\">\n    								{{#editgrid this}}\n    								{{/editgrid}}\n                				</tbody>\n                				<tfoot class=\"J-grid-footer\">\n               						{{#if this.isInitPageBar}}\n	                					<tr class=\"pagination\" style=\"display: table-row !important;\">\n                							<th colspan='{{this.length}}' style=\"border-bottom: 0;\">\n                								<div class=\"J-pagination\" style=\"float: right;\"></div>\n                							</th>\n	                					</tr>\n	                				{{/if}}\n                				</tfoot>\n                			</table>\n		                </div>\n		            </div>\n		        </div>\n		    </div>\n		</div>\n	</div>\n</div>");
