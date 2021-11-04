define("eling/component/ui/reportgrid/1.0.0/dist/reportgrid-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "./reportgrid.tpl", "eling/component/utils/ajaxwrapper", "dialog", "store", "eling/component/utils/gridformat/gridformat" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var template = require("./reportgrid.tpl");
    var aw = require("eling/component/utils/ajaxwrapper");
    var Format = require("eling/component/utils/gridformat/gridformat");
    require("../css/reportgrid.css");
    var ReportGrid = UIComponent.extend({
        attrs: {
            template: template,
            autoRender: true
        },
        events: {
            "click .J-reportgrid-datas-td": function(e) {
                var colIndex = $(e.target).parents().prevAll("td[data-type='datas']").size();
                var rowIndex = $(e.target).parents("tr").prevAll().size();
                var model = this.get("model");
                var data = this.get("data") ? this.get("data").data : null;
                if (data) {
                    var datas = model.datas || {};
                    var click = datas.click || function() {};
                    click(data[rowIndex][colIndex]);
                }
                return false;
            }
        },
        setup: function() {
            this.render();
            var autoRender = this.get("autoRender");
            if (autoRender) {
                this._loadData(this.get("url"));
            }
        },
        _loadData: function(url, params, callback) {
            var that = this;
            var queryParams = params || this.get("params") || "";
            if (typeof queryParams === "function") {
                queryParams = queryParams();
            }
            var params = aw.customParam(queryParams) || "";
            aw.ajax({
                url: url,
                dataType: "json",
                type: "GET",
                data: params.substring(0, params.length - 1),
                success: function(data) {
                    that._setData(data);
                    if (typeof callback === "function") {
                        callback(data);
                    }
                }
            });
        },
        _calColspan: function(data, colspan) {
            if (data.subHeaders) {
                colspan = colspan || 1;
                colspan = colspan * data.subHeaders.length;
                return this._calColspan(data.subHeaders[0], colspan);
            } else {
                return colspan;
            }
        },
        _handleCols: function(headers, level, results) {
            var model = this.get("model") || {};
            var headConfig = model.colHeaders || {};
            var headFormat = headConfig.format;
            results = results || {};
            level = level || 0;
            if (!results[level]) {
                results[level] = [];
            }
            for (var i = 0; i < headers.length; i++) {
                var value = null;
                if (typeof headFormat === "function") {
                    value = headFormat(headers[i].name, level);
                }
                if (headers[i].subHeaders) {
                    results[level].push({
                        value: value || headers[i].name,
                        colspan: this._calColspan(headers[i])
                    });
                    var newLevel = level + 1;
                    results[newLevel] = results[newLevel] || [];
                    this._handleCols(headers[i].subHeaders, newLevel, results);
                } else {
                    results[level].push({
                        value: value || headers[i].name
                    });
                }
            }
            results[0].rowdeep = this._getDeep(headers);
            results[0].coldeep = this._getDeep(this.get("data").rowHeaders);
            results[0].isCollapse = true;
            return results;
        },
        _getDeep: function(rows, deep) {
            deep = deep || 0;
            if (rows.length) {
                var row = rows[0];
                deep += 1;
                if (row.subHeaders) {
                    return this._getDeep(row.subHeaders, deep);
                }
            }
            return deep;
        },
        _getRows: function(rows, level, results) {
            var model = this.get("model") || {};
            var headConfig = model.rowHeaders || {};
            var headFormat = headConfig.format;
            results = results || [];
            level = level || 0;
            for (var i = 0; i < rows.length; i++) {
                var value = null;
                if (typeof headFormat === "function") {
                    value = headFormat(rows[i].name, level);
                }
                var row = {
                    name: value || rows[i].name,
                    rowspan: this._calColspan(rows[i])
                };
                results.push(row);
                if (rows[i].subHeaders) {
                    level++;
                    this._getRows(rows[i].subHeaders, level, results);
                }
            }
            return results;
        },
        _setData: function(data) {
            this.set("data", data);
            var model = this.get("model");
            model.head = this._handleCols(data.colHeaders || []);
            model.data = this._handleDatas(data.rowHeaders, data.data);
            this.renderPartial(".J-reportgrid-table");
        },
        _flattenRows: function(rows) {
            //服务查询回来的rows是一个树形结构，要将其扁平化一个数组，然后与datas拼接成一行
            if (!rows || rows.length == 0) {
                return false;
            }
            //现将行配置拍平，然后在与与数据一一对应
            var rowResult = this._getRows(rows);
            var results = {};
            var level = 0;
            if (rowResult.length == 1) {
                results["0"] = [ {
                    value: rowResult[0].name,
                    belong: "rows",
                    rowspan: rowResult[0].rowspan,
                    className: "text-center"
                } ];
            }
            for (var i = 1; i < rowResult.length; i++) {
                if (!results[level]) {
                    results[level] = [];
                }
                results[level].push({
                    value: rowResult[i - 1].name,
                    rowspan: rowResult[i - 1].rowspan,
                    belong: "rows",
                    className: "text-center"
                });
                if (!rowResult[i - 1].rowspan) {
                    level = level + 1;
                }
                //处理最后一条
                if (i == rowResult.length - 1) {
                    if (rowResult[i].rowspan === undefined && rowResult[i - 1].rowspan != 1) {
                        results[level] = [];
                    }
                    results[level].push({
                        value: rowResult[i].name,
                        data: rowResult[i],
                        rowspan: rowResult[i].rowspan,
                        belong: "rows",
                        className: "text-center"
                    });
                }
            }
            return results;
        },
        _handleDatas: function(rows, datas) {
            var results = this._flattenRows(rows);
            if (results) {
                var model = this.get("model");
                var dataConfig = model.datas || {};
                var dataColsConfig = dataConfig.cols || [];
                var id = dataConfig.id || "";
                for (var i in results) {
                    var dataRow = [], subData = datas[i];
                    var k = 0;
                    for (var j = 0; j < subData.length; j++) {
                        var value = subData[j] ? subData[j][id] : subData[j] || 0;
                        dataRow.push({
                            value: this._formatValue(value, subData[j], k, dataColsConfig, dataConfig),
                            className: dataColsConfig[k] && dataColsConfig[k].className ? dataColsConfig[k].className : dataConfig.className || "text-center",
                            belong: "datas",
                            isClick: dataConfig && dataConfig.click ? true : false
                        });
                        k++;
                        k = k == dataColsConfig.length ? 0 : k;
                    }
                    results[i] = results[i].concat(dataRow);
                }
            }
            return results;
        },
        _formatValue: function(value, data, index, colConfig, dataConfig) {
            //1.首先查询cols参数是否配置了format,如果没有，则查看是否在datas参数中配置了config
            var format = colConfig[index] && colConfig[index].format ? colConfig[index].format : dataConfig.format || null;
            var formatparams = colConfig[index] && colConfig[index].formatparams ? colConfig[index].formatparams : dataConfig.formatparams || null;
            if (format && typeof format === "string") {
                format = Format[format];
            }
            return typeof format === "function" ? format(formatparams, value, data) : value;
        },
        refresh: function(params, callback) {
            this._loadData(this.get("url"), params, callback);
        }
    });
    module.exports = ReportGrid;
});

define("eling/component/ui/reportgrid/1.0.0/dist/reportgrid.tpl", [], "<div class='container el-reportgrid'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n				<div class='col-sm-12'>\n					<div class='box'>\n						<div class='box-content box-no-padding autoscroll'>\n							<table class='J-reportgrid-table table table-bordered table-striped'>\n								<thead>\n									{{#each this.head}}\n    								<tr>\n    									{{#if this.isCollapse}}\n											<th rowspan=\"{{this.rowdeep}}\" colspan=\"{{this.coldeep}}\"></th>\n										{{/if}}\n	    								{{#each this}}\n	    									<th colspan=\"{{this.colspan}}\">{{this.value}}</th>\n	    								{{/each}}\n    								</tr>\n    								{{/each}}\n								</thead>\n								<tbody>\n									{{#each this.data}}\n									<tr>\n										{{#each this}}\n											<td class=\"data-td {{this.className}}\" rowspan=\"{{this.rowspan}}\" data-type = \"{{this.belong}}\">\n												{{#if this.isClick}}\n													<a href=\"javascript:void(0);\" class=\"J-reportgrid-{{this.belong}}-td\">{{this.value}}</a>\n												{{else}}\n													{{this.value}}\n												{{/if}}\n											</td>\n										{{/each}}\n									</tr>\n									{{/each}}\n                				</tbody>\n                			</table>\n		                </div>\n		            </div>\n		        </div>\n		    </div>\n		</div>\n	</div>\n</div>");
