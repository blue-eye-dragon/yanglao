define("eling/component/utils/dialog/2.0.0/dist/dialog-debug", [ "gallery/handlebars/2.0.0/handlebars-seajs", "./dialog.css", "./plugins/loading/loading", "./plugins/loading/loading.tpl", "./plugins/mask/mask", "./plugins/modal/modal", "./plugins/modal/modal.tpl", "./plugins/tip/tip", "jquery/jquery-plugins/toastr/toastr.min" ], function(require, exports, module) {
    var HandlerBars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    require("./dialog.css");
    var loading = require("./plugins/loading/loading");
    var mask = require("./plugins/mask/mask");
    var modal = require("./plugins/modal/modal");
    var tip = require("./plugins/tip/tip");
    require("jquery/jquery-plugins/toastr/toastr.min");
    require("toastr.css");
    /**
	 * @Component(name=dialog, description=对话框, version=2.0.0)
	 */
    var Dialog = {
        /** @method(name=loading,description=加载框)
		 * 	@params(name=mark,type=boolean,description=true为进入加载状态，false为取消加载状态)
		 */
        loading: function(mark) {
            if (mark) {
                mask.render();
                loading.render();
            } else {
                mask.destroy();
                loading.destroy();
            }
        },
        /** @method(name=mask,description=为全屏增加一个蒙版)
		 * 	@params(name=mark,type=boolean,description=true为显示蒙版，false为销毁蒙版)
		 */
        mask: function(mark) {
            mark ? mask.render() : mask.destroy();
        },
        /** @method(name=alert,description=一个简单的提示框)
		 * 	@params(name=options,type=title&content&confirm{function}&defaultButton{boolean}&buttons{Array},description=true为显示提示框，false为销毁提示框)
		 */
        alert: function(options) {
            mask.render();
            options = options || {};
            modal.render({
                id: options.id,
                title: options.title || "提示",
                content: options.content || "",
                setStyle: options.setStyle,
                buttons: options.defaultButton !== false ? [ {
                    id: "ok",
                    text: "确定",
                    className: "primary",
                    handler: function() {
                        var mark = true;
                        if (typeof options.confirm === "function") {
                            mark = options.confirm();
                        }
                        if (mark !== false) {
                            Dialog.close();
                        }
                    }
                } ] : options.buttons || []
            });
        },
        /** @method(name=confirm,description=一个简单的确认框)
		 * 	@params(name=options,type=title&content&confirm{function}&cancel{function}&defaultButton{boolean}&buttons{Array},description=true为显示提示框，false为销毁提示框)
		 */
        confirm: function(options) {
            mask.render();
            options = options || {};
            modal.render({
                id: options.id,
                title: options.title || "提示",
                content: options.content || "",
                setStyle: options.setStyle,
                template: options.template,
                buttons: options.defaultButton !== false ? [ {
                    id: "confirm",
                    className: "btn-primary",
                    text: "确定",
                    handler: function() {
                        var mark = true;
                        if (typeof options.confirm === "function") {
                            mark = options.confirm();
                        }
                        if (mark !== false) {
                            Dialog.close();
                        }
                    }
                }, {
                    id: "cancel",
                    text: "取消",
                    handler: function() {
                        var mark = true;
                        if (typeof options.cancel === "function") {
                            mark = options.cancel();
                        }
                        if (mark !== false) {
                            Dialog.close();
                        }
                    }
                } ] : options.buttons || []
            });
        },
        /** @method(name=close,description=关闭提示框和确认框)
		 */
        close: function(id) {
            modal.destroy(id);
            this.mask(false);
            //如果没有传递id,或者传递的id==初始化该组件的dialog的id,则直接销毁
            if (this.component && (!id || id == this.componentBelong)) {
                this.component.destroy();
            }
        },
        /** @method(name=tip,description=显示一个提示条)
		 *  @params(name=content,description=提示内容)
		 */
        tip: function(content) {
            tip.render(content);
        },
        /**
		 * 消息提示框
		 */
        notice: function(map) {
            var opt = {
                closeButton: true,
                debug: false,
                positionClass: "toast-top-right",
                showDuration: "300",
                hideDuration: "2000",
                timeOut: "5000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            opt = $.extend(opt, map.option);
            toastr.options = opt;
            if (!map.title) {
                toastr[map.type](map.text);
            } else {
                toastr[map.type](map.text, map.title);
            }
        },
        /** @method(name=showComponent,description=显示一个带有组件的对话框)
		 *  @params(name=options,type=title&content&setStyle{function}&events{object}&confirm{function}&cancel{function}&defaultButton{boolean}&buttons{Array})
		 */
        showComponent: function(component, options) {
            if (!options.setStyle) {
                options.setStyle = function() {
                    $(".el-dialog-modal .modal").css({
                        width: "70%",
                        left: "15%",
                        top: "10%"
                    });
                };
            }
            this.confirm(options);
            component.set("parentNode", ".J-dialog-conponent");
            if (!options.isRendered) {
                component.render();
            }
            this.component = component;
            this.componentBelong = options.id;
        }
    };
    module.exports = Dialog;
});

define("eling/component/utils/dialog/2.0.0/dist/dialog.css", [], function() {
    seajs.importStyle(".el-dialog-loading{position:absolute;top:45%;left:50%;margin-left:-50px;margin-top:-50px;background-color:#000;border-radius:15px;border:2px solid #a1a1a1;width:100px;height:100px;opacity:.7;text-align:center;color:whitesmoke}.el-dialog-loading-img{position:relative;width:32px;height:40px;left:33%;top:12%}.el-dialog-loading-text{margin-top:17px;font-size:18px}.el-dialog-modal .modal-footer{margin-top:0}.el-dialog-loading-item{position:absolute;background-color:#FFF;width:5px;height:12px;-moz-border-radius:5px 5px 0 0;-moz-transform:scale(0.4);-moz-animation-name:fadeG;-moz-animation-duration:1.04s;-moz-animation-iteration-count:infinite;-moz-animation-direction:normal;-webkit-border-radius:5px 5px 0 0;-webkit-transform:scale(0.4);-webkit-animation-name:fadeG;-webkit-animation-duration:1.04s;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:normal;-ms-border-radius:5px 5px 0 0;-ms-transform:scale(0.4);-ms-animation-name:fadeG;-ms-animation-duration:1.04s;-ms-animation-iteration-count:infinite;-ms-animation-direction:normal;-o-border-radius:5px 5px 0 0;-o-transform:scale(0.4);-o-animation-name:fadeG;-o-animation-duration:1.04s;-o-animation-iteration-count:infinite;-o-animation-direction:normal;border-radius:5px 5px 0 0;transform:scale(0.4);animation-name:fadeG;animation-duration:1.04s;animation-iteration-count:infinite;animation-direction:normal}.el-dialog-loading-item-0{left:0;top:15px;-moz-animation-delay:.39s;-moz-transform:rotate(-90deg);-webkit-animation-delay:.39s;-webkit-transform:rotate(-90deg);-ms-animation-delay:.39s;-ms-transform:rotate(-90deg);-o-animation-delay:.39s;-o-transform:rotate(-90deg);animation-delay:.39s;transform:rotate(-90deg)}.el-dialog-loading-item-1{left:4px;top:5px;-moz-animation-delay:.52s;-moz-transform:rotate(-45deg);-webkit-animation-delay:.52s;-webkit-transform:rotate(-45deg);-ms-animation-delay:.52s;-ms-transform:rotate(-45deg);-o-animation-delay:.52s;-o-transform:rotate(-45deg);animation-delay:.52s;transform:rotate(-45deg)}.el-dialog-loading-item-2{left:13px;top:2px;-moz-animation-delay:.65s;-moz-transform:rotate(0deg);-webkit-animation-delay:.65s;-webkit-transform:rotate(0deg);-ms-animation-delay:.65s;-ms-transform:rotate(0deg);-o-animation-delay:.65s;-o-transform:rotate(0deg);animation-delay:.65s;transform:rotate(0deg)}.el-dialog-loading-item-3{right:4px;top:5px;-moz-animation-delay:.78s;-moz-transform:rotate(45deg);-webkit-animation-delay:.78s;-webkit-transform:rotate(45deg);-ms-animation-delay:.78s;-ms-transform:rotate(45deg);-o-animation-delay:.78s;-o-transform:rotate(45deg);animation-delay:.78s;transform:rotate(45deg)}.el-dialog-loading-item-4{right:0;top:15px;-moz-animation-delay:.91s;-moz-transform:rotate(90deg);-webkit-animation-delay:.91s;-webkit-transform:rotate(90deg);-ms-animation-delay:.91s;-ms-transform:rotate(90deg);-o-animation-delay:.91s;-o-transform:rotate(90deg);animation-delay:.91s;transform:rotate(90deg)}.el-dialog-loading-item-5{right:4px;bottom:4px;-moz-animation-delay:1.04s;-moz-transform:rotate(135deg);-webkit-animation-delay:1.04s;-webkit-transform:rotate(135deg);-ms-animation-delay:1.04s;-ms-transform:rotate(135deg);-o-animation-delay:1.04s;-o-transform:rotate(135deg);animation-delay:1.04s;transform:rotate(135deg)}.el-dialog-loading-item-6{bottom:0;left:13px;-moz-animation-delay:1.17s;-moz-transform:rotate(180deg);-webkit-animation-delay:1.17s;-webkit-transform:rotate(180deg);-ms-animation-delay:1.17s;-ms-transform:rotate(180deg);-o-animation-delay:1.17s;-o-transform:rotate(180deg);animation-delay:1.17s;transform:rotate(180deg)}.el-dialog-loading-item-7{left:4px;bottom:4px;-moz-animation-delay:1.3s;-moz-transform:rotate(-135deg);-webkit-animation-delay:1.3s;-webkit-transform:rotate(-135deg);-ms-animation-delay:1.3s;-ms-transform:rotate(-135deg);-o-animation-delay:1.3s;-o-transform:rotate(-135deg);animation-delay:1.3s;transform:rotate(-135deg)}@-moz-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-webkit-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-ms-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-o-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}.el-dialog-mask{background:#000;opacity:.2;width:100%;height:100%;position:absolute;z-index:100;top:0;left:0}.el-dialog-modal{position:fixed;top:0;bottom:0;left:0;right:0;overflow:visible;z-index:101}.el-dialog-modal pre{background:inherit;border:0 none}.el-dialog-modal .modal{left:35%;bottom:auto;right:auto;padding:0;background-color:#fff;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5);background-clip:padding-box;outline:0;position:absolute;margin-top:0;top:40%;overflow:visible;width:30%}.el-dialog-modal .modal p{margin:10px;!important}.el-dialog-modal .modal-body{max-height:none;overflow:visible;padding:0!important}");
});

define("eling/component/utils/dialog/2.0.0/dist/plugins/loading/loading", [ "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var tpl = require("eling/component/utils/dialog/2.0.0/dist/plugins/loading/loading.tpl");
    module.exports = {
        render: function() {
            $(window.top.document.body).append(handlebars.compile(tpl)(new Array(8)));
        },
        destroy: function() {
            $(".el-dialog-loading", window.top.document.body).remove();
        }
    };
});

define("eling/component/utils/dialog/2.0.0/dist/plugins/loading/loading.tpl", [], '<div class="el-dialog-loading">\n	<div class="el-dialog-loading-img">\n		{{#each this}}\n			<div class="el-dialog-loading-item el-dialog-loading-item-{{@index}}"></div>\n		{{/each}}\n	</div>\n	<div class="el-dialog-loading-text">请稍后</div>\n</div>');

define("eling/component/utils/dialog/2.0.0/dist/plugins/mask/mask", [ "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var tpl = '<div class="el-dialog-mask"></div>';
    module.exports = {
        render: function() {
            $(window.top.document.body).append(handlebars.compile(tpl));
        },
        destroy: function() {
            $(window.top.document.body).find(".el-dialog-mask").first().remove();
        }
    };
});

define("eling/component/utils/dialog/2.0.0/dist/plugins/modal/modal", [ "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var tpl = require("eling/component/utils/dialog/2.0.0/dist/plugins/modal/modal.tpl");
    module.exports = {
        render: function(options) {
            if (!options.id) {
                options.id = new Date().getTime();
            }
            $(window.top.document.body).append(handlebars.compile(tpl)(options));
            if (typeof options.setStyle === "function") {
                options.setStyle();
            }
            //绑定事件
            var buttons = options.buttons || [];
            for (var i in buttons) {
                $(".J-dialog-" + buttons[i].id, window.top.document.body).off().on("click", buttons[i].handler);
            }
        },
        destroy: function(id) {
            if (id) {
                $("#el-dialog-modal-" + id, window.top.document.body).remove();
            } else {
                $(".el-dialog-modal", window.top.document.body).remove();
            }
        }
    };
});

define("eling/component/utils/dialog/2.0.0/dist/plugins/modal/modal.tpl", [], '<div id="el-dialog-modal-{{this.id}}" class="el-dialog-modal">\n	<div class="modal" style="display: block;">\n		<div class="modal-header" style="padding: 0 15px;">\n			<h3>{{this.title}}</h3>\n		</div>\n		<div class="modal-body">\n			<pre class="J-dialog-text">{{{this.content}}}</pre>\n			{{#if this.template}}\n				{{{this.template}}}\n			{{else}}\n				<div class="J-dialog-conponent"></div>\n			{{/if}}\n		</div>\n		<div class="modal-footer">\n			{{#each this.buttons}}\n			<button class="btn {{this.className}} J-dialog-{{this.id}}">{{this.text}}</button>\n			{{/each}}\n		</div>\n	</div>\n</div>\n\n');

define("eling/component/utils/dialog/2.0.0/dist/plugins/tip/tip", [ "gallery/handlebars/2.0.0/handlebars-seajs" ], function(require, exports, module) {
    var handlebars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var tpl = "" + '<div class="container el-dialog-tip" style="margin-top: 15px;">' + '<div class="alert alert-info alert-dismissable">' + '<a class="J-close close" data-dismiss="alert" href="javascript:void(0);">×</a>{{this}}' + "</div>" + "</div>";
    module.exports = {
        render: function(content) {
            var div = $("<div></div>").addClass("J-tip").html(handlebars.compile(tpl)(content));
            $(".J-tip-container", window.top.document.body).prepend(div);
            $(".J-close", window.top.document.body).off().on("click", function() {
                $(".J-tip", window.top.document.body).remove();
                return false;
            });
        }
    };
});
