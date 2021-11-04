define("eling/component/ui/simplereportgrid/1.0.0/dist/simplereportgrid", [ "eling/component/ui/grid/1.0.0/dist/grid", "jquery/jquery-plugins/pagination/pagination", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/utils/ajaxwrapper", "dialog", "store", "eling/component/utils/gridformat/gridformat", "./simplereportgrid.tpl" ], function(require, exports, module) {
    var Grid = require("eling/component/ui/grid/1.0.0/dist/grid");
    var template = require("./simplereportgrid.tpl");
    var SimpleReportGrid = Grid.extend({
        attrs: {
            template: template,
            model: {
                columns: []
            }
        },
        _setData: function(data, isInitPageBar) {
            var model = this.get("model");
            if (data.constructor === Array) {
                model.data = data;
                this.renderPartial(".J-grid-body");
            } else {
                //格式化头部
                var head = data.head || [];
                var columns = [];
                for (var i = 0; i < head.length; i++) {
                    var obj = {};
                    obj.name = head[i];
                    columns.push(obj);
                }
                model.length = columns.length;
                model.columns = columns;
                this.renderPartial(".J-grid-head");
                //设置数据
                model.data = data.body || [];
                if (isInitPageBar) {
                    //设置底部
                    var foot = data.foot || [];
                    var fColumns = [];
                    for (var i = 0; i < foot.length; i++) {
                        var obj = {};
                        obj.name = foot[i];
                        fColumns.push(obj);
                    }
                    for (var i = 0; i < fColumns.length; i++) {
                        var key = fColumns[i].key;
                        fColumns[i].value = foot[key] || foot[i] || "";
                    }
                    model.footer = {};
                    model.footer.columns = fColumns;
                    //设置grid总页数和总记录数
                    var totalData = this.get("data").body || [];
                    model.totalPage = Math.ceil(totalData.length / (this.get("items_per_page") || 15));
                    model.totalCount = totalData.length;
                    this.renderPartial(".J-grid-footer");
                    this._initPageBar(model.data.length);
                    return;
                }
            }
        }
    });
    module.exports = SimpleReportGrid;
});

define("eling/component/ui/simplereportgrid/1.0.0/dist/simplereportgrid.tpl", [], "<div class='container el-grid'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n				<div class='col-sm-12'>\n					<div class='box' style='margin-bottom:0;'>\n						{{#if this.head}}\n							<div class='box-header'>\n								<div class='title J-grid-title'>{{this.head.title}}</div>\n								<div class='actions'>\n									{{#each this.head.buttons}}\n									<div class=\"J-grid-head-{{this.id}} btn btn-theme\">\n										<i class=\"{{this.icon}}\"></i>\n									</div>\n									{{/each}}\n									{{#if this.head.input}}\n										<input class=\"J-grid-title-input-{{this.id}} form-control margin_top_3\" type=\"text\" style=\"width: 80%;display: inline;\">\n									{{/if}}\n								</div>\n							</div>\n						{{/if}}\n						<div class='box-content box-no-padding' style=\"overflow: scroll;\">\n								<div>\n									<table style='border:0 none;margin-bottom:0;' class='data-table-column-filter table table-bordered table-striped'>\n										<thead class=\"J-grid-head\">\n											<tr>\n											{{#each this.exColumns}}\n												<th style='border-bottom-width:0;' colspan=\"{{this.colspan}}\">{{this.name}}</th>\n											{{/each}}\n											</tr>\n		    								<tr>\n		    									{{#if this.isCheckbox}}\n		    										<th style='border-bottom-width:0;width: 5%;'><input class='J-grid-all-checkbox' type='checkbox'></th>\n		    									{{/if}}\n		    									{{#if this.isRadiobox}}\n		    										<th style='border-bottom-width:0;width: 5%;'></th>\n		    									{{/if}}\n			    								{{#each this.columns}}\n			    									<th style='border-bottom-width:0;' class=\"col-md-{{this.col}}\">{{this.name}}</th>\n			    								{{/each}}\n		    								</tr>\n    									</thead>\n    									<tbody class=\"J-grid-body\">\n		    								{{#grid this}}\n		    								{{/grid}}\n		                				</tbody>\n	                					<tfoot class=\"J-grid-footer\">\n	                						{{#if this.footer}}\n	                							<tr>\n	                							{{#each this.footer.columns}}\n			                						<th>{{this.value}}</th>\n			                					{{/each}}\n			                					</tr>\n	                						{{/if}}\n	                						{{#if this.isInitPageBar}}\n			                					<tr class=\"pagination\" style=\"display: table-row !important;\">\n		                							<th colspan='{{this.length}}' style=\"border-bottom: 0;\">\n		                								<div class=\"J-grid-total-info\" style=\"float: left;margin-top: 5px;\">\n		                									共{{this.totalPage}}页，{{totalCount}}条记录\n		                								</div>\n		                								<div class=\"J-pagination\" style=\"float: right;\"></div>\n		                							</th>\n			                					</tr>\n			                				{{/if}}\n		                				</tfoot>\n		                			</table>\n		                		</div>\n		                </div>\n		            </div>\n		        </div>\n		    </div>\n		</div>\n	</div>\n</div>");
