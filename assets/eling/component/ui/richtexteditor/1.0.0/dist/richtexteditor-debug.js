/**
 * @name richtexteditor
 * @version 1.0.0
 * @description Rich Text Editor
 * @dependencies ["uicomponent-2.0.0","tools"]
 */
define("eling/component/ui/richtexteditor/1.0.0/dist/richtexteditor-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/tools/tools", "./richtextedior.tpl", "baidu/ueditor/ueditor.config", "baidu/ueditor/ueditor.all.min" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var tools = require("eling/component/utils/tools/tools");
    var template = require("./richtextedior.tpl");
    require("baidu/ueditor/ueditor.config");
    require("baidu/ueditor/ueditor.all.min");
    var RichTextEditor = UIComponent.extend({
        attrs: {
            autoRender: true,
            template: template,
            model: {
                id: "ue",
                name: null,
                context: null,
                width: "100%",
                height: "500px",
                options: {
                    autoHeightEnabled: false,
                    zIndex: 99,
                    toolbars: null
                }
            }
        },
        initCustAttr: function() {
            var model = this.get("model");
            model.id = model.id + new Date().getTime();
            model.options.toolbars = model.options.toolbars ? model.options.toolbars : UEDITOR_CONFIG.toolbars;
        },
        //编辑器是否准备就绪
        isReady: false,
        afterRender: function() {
            var that = this;
            var model = this.get("model");
            var ue = null;
            ue = UE.getEditor(model.id, model.options);
            this.isReady = false;
            ue.ready(function() {
                that.isReady = true;
                //设置编辑器的内容
                if (model.context != null) {
                    ue.setContent(model.context);
                }
            });
            this.ue = ue;
        },
        /**
		 * 获取内容
		 * @return {[string]}
		 */
        getContent: function() {
            return this.getValue();
        },
        locationHostCtx: "{{location_host_ctx}}",
        getValue: function() {
            var contentHtml = this.ue.getContent();
            contentHtml = this.replaceContent(contentHtml);
            return contentHtml;
        },
        //替换背景图片
        replaceContent: function(contentHtml) {
            var repArr = contentHtml.match(/background-image:url\(([\w\W]*)\)/);
            if (repArr && repArr.length == 2) {
                var repStr = repArr[1];
                var ctx = localStorage.getItem("ctx");
                ctx = location.protocol + "//" + location.host + ctx;
                var endRepStr = repStr.replace(ctx, this.locationHostCtx);
                contentHtml = contentHtml.replace(repStr, endRepStr);
                return contentHtml;
            } else {
                return contentHtml;
            }
        },
        //还原背景图片
        revertContent: function(value) {
            var ctx = localStorage.getItem("ctx");
            ctx = location.protocol + "//" + location.host + ctx;
            var value = value.replace(this.locationHostCtx, ctx);
            return value;
        },
        /**
		 * 设置文本内容
		 */
        setValue: function(value) {
            value = this.revertContent(value);
            var model = this.get("model");
            if (this.isReady != false) {
                this.ue.setContent(value);
            } else {
                model.context = value;
            }
        },
        /**
		 * 重置文本内容
		 */
        reset: function() {
            if (this.isReady != false) {
                this.ue.setContent("");
            } else {
                var model = this.get("model");
                model.context = "";
            }
        },
        /**
		 * 获取纯文本内容
		 * @return {string}
		 */
        getContentTxt: function() {
            return this.ue.getContentTxt();
        },
        /**
		 * 获取带格式的纯文本内容
		 * @return {string}
		 */
        getPlainTxt: function() {
            return this.ue.getPlainTxt();
        },
        /**
		 * 设置文本内容
		 */
        setContent: function(value, isAppendTo) {
            value = this.revertContent(value);
            if (this.isReady != false) {
                this.ue.setContent(value, isAppendTo);
            } else {
                var model = this.get("model");
                model.context = value;
            }
        },
        /**
		 * 禁用富文本编辑器
		 */
        setDisabled: function(mark) {
            if (mark) {
                this.ue.setDisabled("fullscreen");
            } else {
                this.ue.setEnabled();
            }
        },
        /**
		 * 获取鼠标选中内容
		 */
        getSelectText: function() {
            var range = this.ue.selection.getRange();
            range.select();
            return this.ue.selection.getText();
        },
        /**
		 * 获取本地草稿
		 * @return {string}
		 */
        getLocalData: function() {
            return this.ue.execCommand("getlocaldata");
        },
        /**
		 * 清除本地草稿
		 * @return {boolean}
		 */
        clearlocaldata: function() {
            this.ue.execCommand("clearlocaldata");
            return true;
        },
        setHeight: function(value) {
            this.ue.setHeight(value);
        },
        destroy: function() {
            this.ue.destroy();
            RichTextEditor.superclass.destroy.call(this, arguments);
        }
    });
    module.exports = RichTextEditor;
});

define("eling/component/ui/richtexteditor/1.0.0/dist/richtextedior.tpl", [], '<div id="{{this.id}}" name="{{this.name}}" style="width:{{this.width}};height:{{this.height}};" type="text/plain"></div>');
