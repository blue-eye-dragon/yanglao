define("eling/component/utils/dialog/1.0.0/dist/dialog-debug", [ "./dialog.tpl", "gallery/handlebars/2.0.0/handlebars-seajs", "./dialog.css" ], function(require, exports, module) {
    var dialogtpl = require("./dialog.tpl");
    var HandlerBars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    require("./dialog.css");
    var Dialog = {
        bindEvent: function(events) {
            for (var i in events) {
                var eventAndSelector = i.split(" ");
                $(".el-dialog").on(eventAndSelector[0], eventAndSelector[1], events[i]);
            }
        },
        show: function(options) {
            this.close();
            var html = HandlerBars.compile(dialogtpl)(options);
            $("body").append(html);
            if (typeof options.setStyle === "function") {
                options.setStyle();
            }
            if (options.events) {
                this.bindEvent(options.events);
            }
        },
        close: function() {
            $(".el-dialog").remove();
            $(".modal-backdrop").remove();
        },
        confirm: function(options) {
            var that = this;
            options.isConfirm = true;
            this.show(options);
            $(".J-dialog-confirm").off().on("click", function() {
                var confirm = options.confirm || function() {};
                var result = confirm();
                //TODO：后续要将NotClosed换成false
                if (result !== "NotClosed") {
                    that.close();
                }
            });
            $(".J-dialog-cancel").off().on("click", function() {
                var cancel = options.cancel || function() {};
                cancel();
                that.close();
            });
        },
        alert: function(options) {
            var that = this;
            options.title = "提示";
            options.showBtn = options.showBtn === false ? false : true;
            this.show(options);
            $(".J-dialog-confirm").off().on("click", function() {
                var confirm = options.confirm || function() {};
                confirm();
                that.close();
            });
        },
        loading: function() {
            this.show({
                isLoading: true,
                items: new Array(8)
            });
        },
        tip: function(options) {
            $(".J-tip").remove();
            var html = '<div class="container" style="margin-top: 15px;"><div class="alert alert-info alert-dismissable"><a class="J-close close" data-dismiss="alert" href="javascript:void(0);">×</a>' + options.title + "</div></div>";
            var div = $("<div></div>").addClass("J-tip").html(html);
            $(".J-tip-container").prepend(div);
            $(".J-close").off().on("click", function() {
                $(".J-tip").remove();
            });
        },
        showComponent: function(options, compnent) {
            options.isComponent = true;
            if (!options.setStyle) {
                options.setStyle = function() {
                    $(".el-dialog .modal").css({
                        width: "70%",
                        left: "15%",
                        "min-height": "360px"
                    });
                    $(".el-dialog .modal.fade.in").css({
                        top: "5%"
                    });
                    $(".el-dialog.modal-scrollable").css({
                        position: "absolute"
                    });
                };
            }
            this.confirm(options);
            if (options.isSearch) {
                var input = $("<input/>").addClass("input-sm").addClass("form-control").addClass("J-dialog-search").css({
                    position: "absolute",
                    "z-index": "100",
                    width: "200px",
                    right: "30px",
                    top: "15px"
                }).attr("placeholder", "搜索");
                $(".el-dialog-content-conponent").append(input);
                input.on("keydown", function(e) {
                    var keyCode;
                    //要进行完整的兼容性校验
                    if (window.event) {
                        // 兼容IE8
                        keyCode = e.keyCode;
                    } else {
                        keyCode = e.which;
                    }
                    if (13 == keyCode) {
                        // enter键搜索
                        var s = $("input.J-dialog-search").val();
                        options.search(s);
                    }
                });
            }
            $(".el-dialog-content-conponent").append(compnent.element);
        },
        setText: function(text) {
            $(".J-dialog-text").text(text);
        }
    };
    module.exports = Dialog;
});

define("eling/component/utils/dialog/1.0.0/dist/dialog.tpl", [], '<div class="modal-scrollable el-dialog" style="z-index: 1050;">\n	{{#if this.isLoading}}\n	<div class="modal fade in loading" style="display: block;">\n		<div class="ajaxloader">\n			<div class="el-dialog-loading-img">\n				{{#each this.items}}\n					<div class="el-dialog-loading-item el-dialog-loading-item-{{@index}}"></div>\n				{{/each}}\n			</div>\n			<div class="el-dialog-loading-text">请稍后</div>\n		</div>\n	</div>\n</div>\n<div class="modal-backdrop fade in loading" style="z-index: 1040;"></div>\n	{{else}}\n	<div class="modal fade in" style="display: block;">\n		<div class="modal-header" style="padding: 0 15px;">\n			<h3>{{this.title}}</h3>\n		</div>\n		<div class="modal-body">\n			<pre class="J-dialog-text">{{this.content}}</pre>\n			{{#if isComponent}}\n			<div class="el-dialog-content-conponent"></div>\n			{{/if}}\n		</div>\n		<div class="modal-footer">\n			{{#if this.isConfirm}}\n				<button class="btn btn-primary J-dialog-confirm">确定</button>\n				<button class="btn J-dialog-cancel" data-dismiss="modal">取消</button>\n			{{else}}\n				{{#if this.showBtn}}\n				<button class="btn J-dialog-confirm" data-dismiss="modal">确定</button>\n				{{/if}}\n			{{/if}}\n		</div>\n	</div>\n</div>\n<div class="modal-backdrop fade in" style="z-index: 1040;"></div>\n	{{/if}}\n\n\n\n');

define("eling/component/utils/dialog/1.0.0/dist/dialog.css", [], function() {
    seajs.importStyle(".el-dialog .modal{border:0 none!important;width:30%}.el-dialog .loading.modal{width:50px!important;box-shadow:none!important;margin-left:0!important;background:none!important}.el-dialog .ajaxloader{position:absolute;top:45%;left:50%;margin-left:-50px;margin-top:-50px;background-color:#000;border-radius:15px;border:2px solid #a1a1a1;width:100px;height:100px;opacity:.7;text-align:center;color:whitesmoke}.el-dialog-loading-img{position:relative;width:32px;height:40px;left:33%;top:12%}.el-dialog-loading-text{margin-top:17px;font-size:18px}.el-dialog-loading-item{position:absolute;background-color:#FFF;width:5px;height:12px;-moz-border-radius:5px 5px 0 0;-moz-transform:scale(0.4);-moz-animation-name:fadeG;-moz-animation-duration:1.04s;-moz-animation-iteration-count:infinite;-moz-animation-direction:normal;-webkit-border-radius:5px 5px 0 0;-webkit-transform:scale(0.4);-webkit-animation-name:fadeG;-webkit-animation-duration:1.04s;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:normal;-ms-border-radius:5px 5px 0 0;-ms-transform:scale(0.4);-ms-animation-name:fadeG;-ms-animation-duration:1.04s;-ms-animation-iteration-count:infinite;-ms-animation-direction:normal;-o-border-radius:5px 5px 0 0;-o-transform:scale(0.4);-o-animation-name:fadeG;-o-animation-duration:1.04s;-o-animation-iteration-count:infinite;-o-animation-direction:normal;border-radius:5px 5px 0 0;transform:scale(0.4);animation-name:fadeG;animation-duration:1.04s;animation-iteration-count:infinite;animation-direction:normal}.el-dialog-loading-item-0{left:0;top:15px;-moz-animation-delay:.39s;-moz-transform:rotate(-90deg);-webkit-animation-delay:.39s;-webkit-transform:rotate(-90deg);-ms-animation-delay:.39s;-ms-transform:rotate(-90deg);-o-animation-delay:.39s;-o-transform:rotate(-90deg);animation-delay:.39s;transform:rotate(-90deg)}.el-dialog-loading-item-1{left:4px;top:5px;-moz-animation-delay:.52s;-moz-transform:rotate(-45deg);-webkit-animation-delay:.52s;-webkit-transform:rotate(-45deg);-ms-animation-delay:.52s;-ms-transform:rotate(-45deg);-o-animation-delay:.52s;-o-transform:rotate(-45deg);animation-delay:.52s;transform:rotate(-45deg)}.el-dialog-loading-item-2{left:13px;top:2px;-moz-animation-delay:.65s;-moz-transform:rotate(0deg);-webkit-animation-delay:.65s;-webkit-transform:rotate(0deg);-ms-animation-delay:.65s;-ms-transform:rotate(0deg);-o-animation-delay:.65s;-o-transform:rotate(0deg);animation-delay:.65s;transform:rotate(0deg)}.el-dialog-loading-item-3{right:4px;top:5px;-moz-animation-delay:.78s;-moz-transform:rotate(45deg);-webkit-animation-delay:.78s;-webkit-transform:rotate(45deg);-ms-animation-delay:.78s;-ms-transform:rotate(45deg);-o-animation-delay:.78s;-o-transform:rotate(45deg);animation-delay:.78s;transform:rotate(45deg)}.el-dialog-loading-item-4{right:0;top:15px;-moz-animation-delay:.91s;-moz-transform:rotate(90deg);-webkit-animation-delay:.91s;-webkit-transform:rotate(90deg);-ms-animation-delay:.91s;-ms-transform:rotate(90deg);-o-animation-delay:.91s;-o-transform:rotate(90deg);animation-delay:.91s;transform:rotate(90deg)}.el-dialog-loading-item-5{right:4px;bottom:4px;-moz-animation-delay:1.04s;-moz-transform:rotate(135deg);-webkit-animation-delay:1.04s;-webkit-transform:rotate(135deg);-ms-animation-delay:1.04s;-ms-transform:rotate(135deg);-o-animation-delay:1.04s;-o-transform:rotate(135deg);animation-delay:1.04s;transform:rotate(135deg)}.el-dialog-loading-item-6{bottom:0;left:13px;-moz-animation-delay:1.17s;-moz-transform:rotate(180deg);-webkit-animation-delay:1.17s;-webkit-transform:rotate(180deg);-ms-animation-delay:1.17s;-ms-transform:rotate(180deg);-o-animation-delay:1.17s;-o-transform:rotate(180deg);animation-delay:1.17s;transform:rotate(180deg)}.el-dialog-loading-item-7{left:4px;bottom:4px;-moz-animation-delay:1.3s;-moz-transform:rotate(-135deg);-webkit-animation-delay:1.3s;-webkit-transform:rotate(-135deg);-ms-animation-delay:1.3s;-ms-transform:rotate(-135deg);-o-animation-delay:1.3s;-o-transform:rotate(-135deg);animation-delay:1.3s;transform:rotate(-135deg)}@-moz-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-webkit-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-ms-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@-o-keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}@keyframes fadeG{0%{background-color:#000}100%{background-color:#FFF}}.el-dialog.modal-scrollable{position:fixed;top:0;bottom:0;left:0;right:0;overflow:visible}.el-dialog .modal.loading{left:50%}.el-dialog .modal{left:35%;bottom:auto;right:auto;padding:0;background-color:#fff;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5);background-clip:padding-box;outline:0;position:absolute;margin-top:0;top:15%;overflow:visible}.el-dialog .modal p{margin:10px;!important}.el-dialog .modal.fade{top:-100%;-webkit-transition:opacity .3s linear,top .3s ease-out,bottom .3s ease-out,margin-top .3s ease-out;-moz-transition:opacity .3s linear,top .3s ease-out,bottom .3s ease-out,margin-top .3s ease-out;-o-transition:opacity .3s linear,top .3s ease-out,bottom .3s ease-out,margin-top .3s ease-out;transition:opacity .3s linear,top .3s ease-out,bottom .3s ease-out,margin-top .3s ease-out}.el-dialog .modal.fade.in{top:40%}.el-dialog .modal-body{max-height:none;overflow:visible;padding:0!important}body .modal-backdrop.loading{background:none!important}.el-dialog .modal-backdrop,.el-dialog .modal-backdrop.fade.in{opacity:.7;filter:alpha(opacity=70)}.el-dialog pre{background:inherit;border:0 none}@media (max-width:979px){.modal.fade.in{top:1%;bottom:auto}.modal-body{position:static;margin:0;height:auto!important;max-height:none!important;overflow:visible!important}.modal-footer{position:static}}");
});
