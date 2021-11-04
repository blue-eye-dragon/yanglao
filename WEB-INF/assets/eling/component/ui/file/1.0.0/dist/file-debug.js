/**
 * @name file
 * @version 1.0.0
 * @description input
 * @dependencies ["uicomponent-2.0.0","tools"]
 */
define("eling/component/ui/file/1.0.0/dist/file-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/dialog/2.0.0/dist/dialog", "gallery/handlebars/2.0.0/handlebars-seajs", "jquery/jquery-plugins/toastr/toastr.min", "eling/component/utils/tools/tools", "./file_1.tpl", "./file_2.tpl", "eling/component/utils/loadimgage/loadimage-debug", "jquery/jquery-plugins/ajaxfileupload/ajaxfileupload", "./file.css" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var Dialog = require("eling/component/utils/dialog/2.0.0/dist/dialog");
    var tools = require("eling/component/utils/tools/tools");
    var template1 = require("./file_1.tpl");
    var template2 = require("./file_2.tpl");
    require("eling/component/utils/loadimgage/loadimage-debug");
    require("jquery/jquery-plugins/ajaxfileupload/ajaxfileupload");
    require("./file.css");
    var File_1_0_0 = UIComponent.extend({
        attrs: {
            autoRender: true,
            model: {
                //样式一
                placeholder: "请选择文件",
                style: "cursor:pointer;",
                //样式二
                description: {
                    text: "",
                    style: ""
                },
                button: {
                    text: "上传",
                    style: ""
                },
                preview: {
                    style: ""
                },
                //公用参数
                multiple: "multiple",
                pixel: [],
                maxSize: 2,
                accept: "*",
                isPreview: true
            }
        },
        initCustAttr: function() {
            var model = this.get("model");
            if (model.styleType === undefined) {
                this.set("template", template1);
            } else if (model.styleType === "2") {
                this.set("template", template2);
            }
        },
        events: {
            "click .J-file-btn": function(e) {
                var fileEL = this.$("input[type=file]");
                fileEL.replaceWith(fileEL = fileEL.clone(true));
                fileEL.click();
                e.preventDefault();
                return false;
            },
            "change input[type='file']": function(e) {
                var errors = [];
                var model = this.get("model");
                this.$(".J-preview").empty();
                var files = e.target.files;
                var name = "";
                for (var i = 0; i < files.length; i++) {
                    //校验
                    //（1）校验大小
                    if (files[i].size > model.maxSize * 1024 * 1024) {
                        errors.push(files[i].name + "的大小超过了" + model.maxSize + "M");
                        continue;
                    }
                    //(2)校验格式
                    var extName = files[i].name.substring(files[i].name.lastIndexOf(".") + 1);
                    if (model.accept !== "*" && model.accept.indexOf(extName) == -1) {
                        errors.push(files[i].name + "的格式不正确。要求的格式为：" + model.accept);
                        continue;
                    }
                    //(3)校验分辨率
                    name += files[i].name + "；";
                    if (model.isPreview !== false) {
                        //设置预览
                        var img = window.loadImage(files[i]);
                        $(img).addClass("preview-item").attr("style", model.preview.style);
                        this.$(".J-preview").append(img);
                    }
                }
                this.$("input[type='text']").val(name.substring(0, name.length - 1));
                if (errors.length != 0) {
                    var errMessage = "";
                    for (var i in errors) {
                        errMessage += errors[i] + "\n";
                    }
                    Dialog.alert({
                        id: "el-dialog-validate-fail-tip",
                        title: "提示",
                        content: errMessage,
                        confirm: function() {
                            Dialog.close("el-dialog-validate-fail-tip");
                            return false;
                        }
                    });
                }
            }
        },
        upload: function(url, callback) {
            var id = this.$("input[type='file']").attr("id");
            var value = this.$("input[type='file']").val();
            if (!value) {
                return;
            }
            $.ajaxFileUpload({
                url: url,
                secureuri: false,
                fileElementId: id,
                dataType: "json",
                success: function(data) {
                    if (typeof callback === "function") {
                        callback(data);
                    }
                }
            });
        },
        download: function(url) {
            this.$(".J-preview").empty();
            if (tools.isString(url)) {
                url = [ url ];
            }
            for (var i in url) {
                var img = $("<img>").addClass("preview-item").attr("style", this.get("model").preview.style);
                img.attr("src", url[i]);
                this.$(".J-preview").append(img);
            }
        },
        reset: function() {
            this.$(".J-preview").empty();
            this.$("input[type='text']").val("");
            this.$("input[type='file']").val("");
            this.setDisabled(false);
        },
        setDisabled: function(mark) {
            if (mark) {
                this.$("input").attr("disabled", "disabled");
                this.$(".tip").addClass("hidden");
            } else {
                this.$(".tip").removeClass("hidden");
                this.$("input").removeAttr("disabled");
            }
        },
        setReadonly: function(mark) {
            this.setDisabled(mark);
        },
        getValue: function() {
            //暂不实现
            return;
        },
        setValue: function() {
            //暂不实现
            return;
        },
        getData: function() {
            //暂不实现
            return;
        },
        setData: function() {
            //暂不实现
            return;
        }
    });
    module.exports = File_1_0_0;
});

define("eling/component/ui/file/1.0.0/dist/file_1.tpl", [], '<div class="el-file el-file-tpl-1">\n	<div class="input-group">\n		<input class="form-control" type="text" readonly="readonly" style="{{this.style}}" placeholder="{{this.placeholder}}"/>\n		<button style="{{this.button.style}}" class="btn btn-danger J-file-btn">{{this.button.text}}</button>\n		<div style="{{this.description.style}}">{{{this.description.text}}}</div>\n		<input id="{{this.id}}" name="file" type="file" {{this.multiple}} class="hidden"/>\n	</div>\n	<div class="J-preview preview"></div>\n</div>');

define("eling/component/ui/file/1.0.0/dist/file_2.tpl", [], '<div class="el-file el-file-tpl-2">\n    <div class="J-preview preview"></div>\n    <div class="tip">\n        <div class="description" style="{{this.description.style}}">{{{this.description.text}}}</div>\n        <button style="{{this.button.style}}" class="btn btn-danger J-file-btn">{{this.button.text}}</button>\n    </div>\n\n	<input id="{{this.id}}" name="file" type="file" {{this.multiple}} class="hidden"/>\n</div>');

define("eling/component/ui/file/1.0.0/dist/file.css", [], function() {
    seajs.importStyle(".el-file-tpl-1 .input-group{width:100%}.el-file-tpl-1 .form-control{width:70%}.el-file button{width:80px;border-radius:5px!important}.el-file-tpl-1 button{margin-left:10px;margin-top:-4px}.el-file-tpl-2 button{bottom:0;position:absolute}.el-file-tpl-2 .description{padding-top:20px}.el-file-tpl-2.el-file .tip,.el-file-tpl-2.el-file .preview{display:inline-block;vertical-align:top}.el-file-tpl-2 .tip{position:relative}.el-file-tpl-1 .preview-item,.el-file-tpl-2 .preview-item{margin:5px 10px;cursor:pointer;width:100px;height:100px}");
});
