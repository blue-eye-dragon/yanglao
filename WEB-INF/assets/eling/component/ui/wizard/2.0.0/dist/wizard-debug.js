/**
 * @name wizard
 * @version 2.0.0
 * @description 向导式
 * @dependencies [UIComponent,handlebars,template]
 */
define("eling/component/ui/wizard/2.0.0/dist/wizard-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/handlebars/2.0.0/handlebars-seajs", "./wizard.tpl", "./wizard.css" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var HandlerBars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var tpl = require("./wizard.tpl");
    require("./wizard.css");
    module.exports = UIComponent.extend({
        attrs: {
            template: tpl,
            autoRender: true,
            model: {
                items: []
            }
        },
        events: {
            "click .J-wizard-next": function() {
                this.next();
                return false;
            },
            "click .J-wizard-prev": function() {
                this.prev();
                return false;
            }
        },
        initCustAttr: function() {
            var items = this.get("model").items;
            for (var i in items) {
                items[i].index = parseInt(i) + 1;
            }
        },
        afterRender: function() {
            this.$(".steps li:first,.step-pane:first").addClass("active");
            this.setTitle(this.get("model").items[0].title);
        },
        setTitle: function(title) {
            this.$(".J-title").text(title);
        },
        getTitle: function() {
            return this.$(".J-title").text();
        },
        switchTo: function(index) {
            if (index < 0 || index >= this.get("model").items.length) {
                return;
            }
            //处理跳转内容
            this.$(".step-pane").removeClass("active");
            this.$(".step-pane").eq(index).addClass("active");
            //处理页签
            this.$("li").each(function(i, el) {
                if (i < index) {
                    $(el).addClass("complete").removeClass("active");
                } else if (i == index) {
                    $(el).addClass("active").removeClass("complete");
                } else {
                    $(el).removeClass("active").removeClass("complete");
                }
            });
            //处理向前按钮
            if (index == 0) {
                this.$(".J-wizard-prev").removeClass("btn-success");
            } else {
                this.$(".J-wizard-prev").addClass("btn-success");
            }
            //处理向后按钮
            if (index == this.get("model").items.length - 1) {
                this.$(".J-wizard-next").removeClass("btn-success");
            } else {
                this.$(".J-wizard-next").addClass("btn-success");
            }
            //设置标题
            this.setTitle(this.get("model").items[index].title);
        },
        prev: function() {
            this.switchTo(this.getActive() - 1);
        },
        next: function() {
            this.switchTo(this.getActive() + 1);
        },
        first: function() {
            this.switchTo(0);
        },
        last: function() {
            this.switchTo(this.get("model").items.length - 1);
        },
        getActive: function() {
            return this.$("li.active").prevAll().size();
        },
        reset: function() {
            this.first();
            this.$(".J-wizard-content").removeClass("hidden");
        }
    });
});

define("eling/component/ui/wizard/2.0.0/dist/wizard.tpl", [], "<div class='container el-wizard-2'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n                <div class='col-sm-12'>\n                	<div class='box'>\n                		<div class=\"box-header J-title\"></div>\n                		<div class='box-content box-padding'>\n                			<div class='fuelux'>\n                				<div class='wizard J-wizard-content'>\n                					<div class=\"prevContainer\">\n                						<button class=\"btn btn-prev J-wizard-prev\">\n	                						<i class=\"icon-chevron-left\"></i>\n	                					</button>\n                					</div>\n                					<ul class='steps stepsContainer'>\n                						{{#each this.items}}\n               								<li><span class='step'>{{this.index}}</span></li>\n                						{{/each}}\n                					</ul>\n                					<div class=\"nextContainer\">\n	                					<button class=\"btn btn-success btn-next J-wizard-next\">\n	                						<i class=\"icon-chevron-right\"></i>\n	                					</button>\n	                				</div>\n                				</div>\n                				<div class='step-content'>\n               						{{#each this.items}}\n               							<div class='step-pane' id='{{this.id}}'></div>\n               						{{/each}}\n                        		</div>\n                      		</div>\n                    	</div>\n                  	</div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n                      	");

define("eling/component/ui/wizard/2.0.0/dist/wizard.css", [], function() {
    seajs.importStyle('.el-wizard-2 .stepsContainer{margin-left:30px!important;display:inline-block;vertical-align:middle}.el-wizard-2 .prevContainer,.el-wizard-2 .nextContainer{display:inline-block;vertical-align:middle}.el-wizard-2 .step-content{margin-top:20px!important}.el-wizard-2 .fuelux .wizard{background-color:#f9f9f9;border:1px solid #d4d4d4;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;*zoom:1;-webkit-box-shadow:0 1px 4px rgba(0,0,0,.065);-moz-box-shadow:0 1px 4px rgba(0,0,0,.065);box-shadow:0 1px 4px rgba(0,0,0,.065)}.el-wizard-2 .fuelux .wizard:before,.el-wizard-2 .fuelux .wizard:after{display:table;line-height:0;content:""}.el-wizard-2 .fuelux .wizard:after{clear:both}.el-wizard-2 .fuelux .wizard ul{padding:0;margin:0;list-style:none outside none}.el-wizard-2 .fuelux .wizard ul li{position:relative;float:left;height:46px;padding:0 20px 0 30px;margin:0;font-size:16px;line-height:46px;color:#999;cursor:default;background:#ededed}.el-wizard-2 .fuelux .wizard ul li .chevron{position:absolute;top:0;right:-14px;display:block;border:24px solid transparent;border-right:0;border-left:14px solid #d4d4d4}.el-wizard-2 .fuelux .wizard ul li .chevron:before{position:absolute;top:-24px;right:1px;display:block;border:24px solid transparent;border-right:0;border-left:14px solid #ededed;content:""}.el-wizard-2 .fuelux .wizard ul li.complete{color:#468847;background:#f3f4f5}.el-wizard-2 .fuelux .wizard ul li.complete:hover{cursor:pointer;background:#e7eff8}.el-wizard-2 .fuelux .wizard ul li.complete:hover .chevron:before{border-left:14px solid #e7eff8}.el-wizard-2 .fuelux .wizard ul li.complete .chevron:before{border-left:14px solid #f3f4f5}.el-wizard-2 .fuelux .wizard ul li.active{color:#3a87ad;background:#f1f6fc}.el-wizard-2 .fuelux .wizard ul li.active .chevron:before{border-left:14px solid #f1f6fc}.el-wizard-2 .fuelux .wizard ul li .badge{margin-right:8px}.el-wizard-2 .fuelux .wizard ul li:nth-child(1){z-index:10;padding-left:20px;border-radius:4px 0 0 4px}.el-wizard-2 .fuelux .wizard ul li:nth-child(2){z-index:9}.el-wizard-2 .fuelux .wizard ul li:nth-child(3){z-index:8}.el-wizard-2 .fuelux .wizard ul li:nth-child(4){z-index:7}.el-wizard-2 .fuelux .wizard ul li:nth-child(5){z-index:6}.el-wizard-2 .fuelux .wizard ul li:nth-child(6){z-index:5}.el-wizard-2 .fuelux .wizard ul li:nth-child(7){z-index:4}.el-wizard-2 .fuelux .wizard ul li:nth-child(8){z-index:3}.el-wizard-2 .fuelux .wizard ul li:nth-child(9){z-index:2}.el-wizard-2 .fuelux .wizard ul li:nth-child(10){z-index:1}.el-wizard-2 .fuelux .wizard .actions{float:right;padding-right:15px;line-height:44px;vertical-align:middle}.el-wizard-2 .fuelux .wizard .actions a{margin-right:8px;font-size:12px;line-height:45px}.el-wizard-2 .fuelux .wizard .actions .btn-prev i{margin-right:5px}.el-wizard-2 .fuelux .wizard .actions .btn-next i{margin-left:5px}.el-wizard-2 .fuelux .step-content .step-pane{display:none}.el-wizard-2 .fuelux .step-content .active{display:block}.el-wizard-2 .fuelux .wizard{-webkit-border-radius:0;-moz-border-radius:0;-ms-border-radius:0;-o-border-radius:0;border-radius:0;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:transparent;border:0}.el-wizard-2 .fuelux .wizard .actions{padding:0}.el-wizard-2 .fuelux .wizard ul li{background-color:#ddd;margin-right:30px;padding:0 20px;color:#424242;font-family:Microsoft YaHei;font-size:20px;position:relative;-webkit-border-radius:0!important;-moz-border-radius:0!important;-ms-border-radius:0!important;-o-border-radius:0!important;border-radius:0!important}.el-wizard-2 .fuelux .wizard ul li.active{background-color:#f34541;color:#fff}.el-wizard-2 .fuelux .wizard ul li.complete{background-color:#49bf67;color:#fff}.el-wizard-2 .fuelux .wizard ul li.complete:hover{background-color:#3eb05b}.el-wizard-2 .fuelux .wizard ul li.complete:before{background-color:#49bf67}.el-wizard-2 .fuelux .wizard ul li:before{content:"";width:30px;height:4px;background-color:#ddd;display:block;position:absolute;top:50%;margin-top:-2px;left:-30px}.el-wizard-2 .fuelux .wizard ul li:first-child:before{display:none}@media print{.el-wizard-2 .fuelux .step-content .step-pane{display:block!important;opacity:1!important}}');
});
