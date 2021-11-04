define("eling/component/ui/multirowgrid/1.0.0/dist/multirowgrid-debug", [ "eling/component/ui/grid/1.0.0/dist/grid", "jquery/jquery-plugins/pagination/pagination", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/utils/ajaxwrapper", "dialog", "store", "eling/component/utils/gridformat/gridformat", "./multirowgrid.tpl" ], function(require, exports, module) {
    var Grid = require("eling/component/ui/grid/1.0.0/dist/grid");
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var GridFormat = require("eling/component/utils/gridformat/gridformat");
    function geneTR(data, rowIndex, model) {
        var ret = "";
        var field = model.multiField;
        var multiData = data[field].length != 0 ? data[field] : [ {} ];
        for (var i = 0; i < multiData.length; i++) {
            ret += "<tr data-index='" + rowIndex + "'>";
            if (i == 0) {
                ret += geneTD(data, i, model, true);
            } else {
                ret += geneTD(data, i, model, false);
            }
            ret += "</tr>";
        }
        return ret;
    }
    //mark表示是否生成不分行的单元格
    function geneTD(data, multiIndex, model, mark) {
        var ret = "";
        var columns = model.columns;
        var field = model.multiField;
        var multiData = data[field].length != 0 ? data[field] : [ {} ];
        var rowspan = multiData.length || 1;
        if (mark) {
            if (model.isCheckbox) {
                ret += "<td rowspan='" + rowspan + "'><input class='J-checked J-checkbox' type='checkbox'></td>";
            }
            if (model.isRadiobox) {
                ret += "<td rowspan='" + rowspan + "'><input class='J-checked J-radiobox' type='radio'></td>";
            }
        }
        for (var j = 0; j < columns.length; j++) {
            var key = columns[j].isMulti ? columns[j].multiKey : columns[j].key;
            var value = columns[j].isMulti ? multiData[multiIndex] : data;
            if (value) {
                value = GridFormat.getValue(key, value) || "";
            }
            if (!columns[j].isMulti && mark) {
                ret += "<td class='" + (columns[j].className || "") + "' rowspan='" + rowspan + "'>";
            } else if (columns[j].isMulti) {
                ret += "<td class='" + (columns[j].className || "") + "'>";
            } else {
                continue;
            }
            ret += "<pre>";
            var format = columns[j].format;
            var formatName = "";
            if (typeof format === "function") {
                formatName = format(value, data, multiIndex);
            }
            if (GridFormat[format] || GridFormat[formatName]) {
                ret += GridFormat[format] ? GridFormat[format](columns[j].formatparams, value, data, model) : GridFormat[formatName](columns[j].formatparams, value, data, model);
            } else if (typeof format === "function") {
                ret += format(value, data, multiIndex);
            } else {
                ret += value;
            }
            ret += "</pre></td>";
        }
        return ret;
    }
    handlebars.registerHelper("multirowgrid", function(context, option) {
        var records = context.data || [];
        var ret = "";
        for (var i = 0; i < records.length; i++) {
            ret += geneTR(records[i], i, context);
        }
        return ret;
    });
    var MultiRowGrid = Grid.extend({
        attrs: {
            template: require("./multirowgrid.tpl")
        }
    });
    module.exports = MultiRowGrid;
});

define("eling/component/ui/multirowgrid/1.0.0/dist/multirowgrid.tpl", [], "<div class='container el-grid'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n				<div class='col-sm-12'>\n					<div class='box' style='margin-bottom:0;'>\n						{{#if this.head}}\n							<div class='box-header'>\n								<div class='title J-grid-title'>{{this.head.title}}</div>\n								<div class='actions'>\n									{{#each this.head.buttons}}\n									<div class=\"J-grid-head-{{this.id}} btn btn-theme\">\n										<i class=\"{{this.icon}}\"></i>\n									</div>\n									{{/each}}\n									{{#if this.head.input}}\n										<input class=\"J-grid-title-input-{{this.id}} form-control margin_top_3\" type=\"text\" style=\"width: 80%;display: inline;\">\n									{{/if}}\n								</div>\n							</div>\n						{{/if}}\n						<div class='box-content box-no-padding'>\n								<div>\n									<table style='border:0 none;margin-bottom:0;' class='data-table-column-filter table table-bordered table-striped'>\n										<thead>\n											{{#each this.exColumns}}\n												<tr>\n													{{#each this}}\n													<th style='border-bottom-width:0;' colspan=\"{{this.colspan}}\">{{this.name}}</th>\n													{{/each}}\n												</tr>\n											{{/each}}\n		    								<tr>\n		    									{{#if this.isCheckbox}}\n		    										<th style='border-bottom-width:0;width: 5%;'><input class='J-grid-all-checkbox' type='checkbox'></th>\n		    									{{/if}}\n		    									{{#if this.isRadiobox}}\n		    										<th style='border-bottom-width:0;width: 5%;'></th>\n		    									{{/if}}\n			    								{{#each this.columns}}\n			    									<th style='border-bottom-width:0;' class=\"col-md-{{this.col}} {{this.className}}\">{{this.name}}</th>\n			    								{{/each}}\n		    								</tr>\n    									</thead>\n    									<tbody class=\"J-grid-table\">\n		    								{{#multirowgrid this}}\n		    								{{/multirowgrid}}\n		                				</tbody>\n	                					<tfoot class=\"J-grid-footer\">\n	                						{{#if this.footer}}\n	                							<tr>\n	                							{{#each this.footer.columns}}\n			                						<th>{{this.value}}</th>\n			                					{{/each}}\n			                					</tr>\n	                						{{/if}}\n	                						{{#if this.isInitPageBar}}\n			                					<tr class=\"pagination\" style=\"display: table-row !important;\">\n		                							<th colspan='{{this.length}}' style=\"border-bottom: 0;\">\n		                								<div class=\"J-grid-total-info\" style=\"float: left;margin-top: 5px;\">\n		                									共{{this.totalPage}}页，{{totalCount}}条记录\n		                								</div>\n		                								<div class=\"J-pagination\" style=\"float: right;\"></div>\n		                							</th>\n			                					</tr>\n			                				{{/if}}\n		                				</tfoot>\n		                			</table>\n		                		</div>\n		                </div>\n		            </div>\n		        </div>\n		    </div>\n		</div>\n	</div>\n</div>");
