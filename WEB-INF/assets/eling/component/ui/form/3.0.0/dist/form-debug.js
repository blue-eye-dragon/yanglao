/**
 * @name form
 * @version 3.0.0
 * @description 表单
 * @dependencies []
 */
define("eling/component/ui/form/3.0.0/dist/form-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/dialog/2.0.0/dist/dialog", "gallery/handlebars/2.0.0/handlebars-seajs", "jquery/jquery-plugins/toastr/toastr.min", "eling/component/utils/tools/tools", "eling/component/ui/text/1.0.0/dist/text", "eling/component/ui/textarea/1.0.0/dist/textarea", "jquery/jquery-plugins/autosize/jquery.autosize", "eling/component/ui/select/1.0.0/dist/select", "jquery/jquery-plugins/select2/select2", "eling/component/ui/checkradio/1.0.0/dist/checkradio", "eling/component/ui/date/1.0.0/dist/date", "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker", "eling/component/ui/file/1.0.0/dist/file", "eling/component/utils/loadimgage/loadimage-debug", "jquery/jquery-plugins/ajaxfileupload/ajaxfileupload", "eling/component/ui/number/1.0.0/dist/number", "eling/component/ui/place/1.0.0/dist/place", "eling/component/ui/admindivision/1.0.0/dist/admindivision", "eling/component/ui/autocomplete/1.0.0/dist/autocomplete", "jquery/jquery-plugins/autocomplete/autocomplete", "eling/component/ui/daterange/1.0.0/dist/daterange", "bootstrap/bootstrap-plugins/daterangepicker/daterangepicker", "./form.tpl", "eling/component/ui/richtexteditor/1.0.0/dist/richtexteditor", "baidu/ueditor/ueditor.config", "baidu/ueditor/ueditor.all.min", "eling/component/ui/colorpicker/1.0.0/dist/colorpicker", "jquery/jquery-plugins/spectrum/spectrum", "jquery", "./form.css", "jquery/jquery-plugins/validate/jquery.validate" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var Dialog = require("eling/component/utils/dialog/2.0.0/dist/dialog");
    var HandlerBars = require("gallery/handlebars/2.0.0/handlebars-seajs");
    var tools = require("eling/component/utils/tools/tools");
    var Text = require("eling/component/ui/text/1.0.0/dist/text");
    var TextArea = require("eling/component/ui/textarea/1.0.0/dist/textarea");
    var Select = require("eling/component/ui/select/1.0.0/dist/select");
    var CheckRadio = require("eling/component/ui/checkradio/1.0.0/dist/checkradio");
    var Date = require("eling/component/ui/date/1.0.0/dist/date");
    var File = require("eling/component/ui/file/1.0.0/dist/file");
    var Number = require("eling/component/ui/number/1.0.0/dist/number");
    var Place = require("eling/component/ui/place/1.0.0/dist/place");
    var Autocomplete = require("eling/component/ui/autocomplete/1.0.0/dist/autocomplete");
    var DateRange = require("eling/component/ui/daterange/1.0.0/dist/daterange");
    var tpl = require("./form.tpl");
    var RichTextEditor = require("eling/component/ui/richtexteditor/1.0.0/dist/richtexteditor");
    var ColorPicker = require("eling/component/ui/colorpicker/1.0.0/dist/colorpicker");
    var LoadImage = require("eling/component/utils/loadimgage/loadimage-debug");
    require("./form.css");
    require("jquery/jquery-plugins/validate/jquery.validate");
    var plugin = {
        text: Text,
        hidden: Text,
        textarea: TextArea,
        select: Select,
        checkbox: CheckRadio,
        radio: CheckRadio,
        date: Date,
        daterange: DateRange,
        autocomplete: Autocomplete,
        file: File,
        number: Number,
        richtexteditor: RichTextEditor,
        colorpicker: ColorPicker,
        place: Place
    };
    /**
	 * @Component(name=form, description=表单, version=3.0.0)
	 */
    var Form_3_0_0 = UIComponent.extend({
        attrs: {
            template: tpl,
            autoRender: true,
            itemConfigs: {},
            itemPlugins: {},
            itemValidates: {},
            model: {
                saveaction: null,
                cancelaction: null,
                defaultButton: true,
                saveText: "保存",
                cancelText: "取消",
                validate: {
                    position: "right"
                },
                items: []
            }
        },
        initCustAttr: function() {
            var model = this.get("model");
            var id = model.id;
            //判断类型
            if (model.type == "profile") {
                model.isProfile = true;
            }
            var items = model.items || [];
            var itemConfigs = this.get("itemConfigs");
            if (model.isProfile) {
                for (var i in items) {
                    var children = items[i].children;
                    for (var j in children) {
                        itemConfigs[children[j].name] = this._initCustItem(children[j]);
                    }
                }
            } else {
                for (var i in items) {
                    itemConfigs[items[i].name] = this._initCustItem(items[i]);
                }
            }
        },
        _initCustItem: function(item) {
            var id = this.get("model").id;
            var itemValidates = this.get("itemValidates");
            //设置默认类型
            item.type = item.type ? item.type : "text";
            if (item.type == "date" || item.type == "place" || item.type == "daterange") {
                item.triggerType = "form";
            }
            if (item.type == "hidden" || item.show === true) {
                item.show = "hidden";
            }
            //根据规则设置表单元素的唯一标识符
            item.fid = "J-form-" + id + "-" + (typeof item.type === "string" ? item.type : "exType") + "-" + item.name.replace(/\./g, "-");
            var validates = item.validate || "";
            if (validates.indexOf("required") != -1) {
                item.isRequired = true;
            }
            //设置placeholder
            item.placeholder = item.placeholder || "请输入" + item.label;
            //设置校验
            var validates = item.validate || [];
            var exValidate = item.exValidate;
            if (typeof exValidate === "function") {
                var validateID = id + "-customer-valid-" + item.name.replace(/\./g, "-");
                validates.push(validateID);
                itemValidates[validateID] = exValidate;
            }
            item.validate = tools.geneValidate(validates);
            if (item.type == "checkbox" || item.type == "radio") {
                var list = item.list || [];
                for (var i in list) {
                    list[i].validate = item.validate;
                }
            }
            return item;
        },
        parseElement: function() {
            var model = this.get("model");
            var layout = model.layout;
            if (layout && layout.indexOf("_1") != -1) {
                //2_1 or 3_1
                model.layout = this._getN1Template(layout.split("_")[0]);
            }
            Form_3_0_0.superclass.parseElement.call(this, arguments);
            if (typeof layout === "string") {
                var itemConfigs = this.get("itemConfigs");
                this.$("[el-data-component]").each(function(i, el) {
                    var name = $(el).attr("el-data-component");
                    $(el).find("label").addClass("J-form-label-" + name);
                    $(el).find("div").addClass(itemConfigs[name].fid);
                    if (itemConfigs[name].placeholder == "请输入undefined") {
                        itemConfigs[name].placeholder = "请输入" + $(el).find("label").text();
                    }
                });
                model.validate.position = "bottom";
            }
        },
        _getN1Template: function(n) {
            n = parseInt(n);
            var ret = "", index = 0, hiddenStr = "";
            var labelClass, valueClass;
            if (n == 2) {
                labelClass = "1";
                valueClass = "4";
            } else {
                labelClass = "1";
                valueClass = "3";
            }
            var itemConfigs = this.get("model").items;
            for (var i in itemConfigs) {
                if (itemConfigs[i].type == "hidden") {
                    hiddenStr += '<div class="form-group hidden">';
                    hiddenStr += '<div el-data-component="' + itemConfigs[i].name + '">';
                    hiddenStr += '<div class="col-md-10"></div>';
                    hiddenStr += "</div>";
                    hiddenStr += "</div>";
                    continue;
                }
                if (index == 0 && itemConfigs[i]["break"] === true) {
                    //第一个表单元素占一行
                    ret += '<div class="form-group">';
                    ret += '<div el-data-component="' + itemConfigs[i].name + '">';
                    ret += '<label class="col-md-' + labelClass + ' control-label">' + itemConfigs[i].label + "</label>";
                    ret += '<div class="col-md-10"></div>';
                    ret += "</div>";
                    ret += "</div>";
                } else if (index == 0) {
                    //第一个元素不占一行
                    ret += '<div class="form-group">';
                    ret += '<div el-data-component="' + itemConfigs[i].name + '">';
                    ret += '<label class="col-md-' + labelClass + ' control-label">' + itemConfigs[i].label + "</label>";
                    ret += '<div class="col-md-' + valueClass + '"></div>';
                    ret += "</div>";
                    index++;
                } else if (itemConfigs[i].break === true) {
                    //某一个元素占一行
                    ret += "</div>";
                    ret += '<div class="form-group">';
                    ret += '<div el-data-component="' + itemConfigs[i].name + '">';
                    ret += '<label class="col-md-' + labelClass + ' control-label">' + itemConfigs[i].label + "</label>";
                    ret += '<div class="col-md-10"></div>';
                    ret += "</div>";
                    ret += "</div>";
                    index = 0;
                } else if (index % n == 0) {
                    //另起一行
                    ret += "</div>";
                    ret += '<div class="form-group">';
                    ret += '<div el-data-component="' + itemConfigs[i].name + '">';
                    ret += '<label class="col-md-' + labelClass + ' control-label">' + itemConfigs[i].label + "</label>";
                    ret += '<div class="col-md-' + valueClass + '"></div>';
                    ret += "</div>";
                    index++;
                } else {
                    ret += '<div el-data-component="' + itemConfigs[i].name + '">';
                    ret += '<label class="col-md-' + labelClass + ' control-label">' + itemConfigs[i].label + "</label>";
                    ret += '<div class="col-md-' + valueClass + '"></div>';
                    ret += "</div>";
                    index++;
                }
            }
            return hiddenStr + ret;
        },
        events: function() {
            var that = this;
            var events = {};
            var model = this.get("model");
            var id = model.id;
            events["click .J-form-" + id + "-save"] = function() {
                //进行预置校验
                if ($("#" + id).valid()) {
                    var saveaction = model.saveaction || that.get("saveaction") || function() {};
                    saveaction();
                }
                return false;
            };
            events["click .J-form-" + id + "-cancel"] = model.cancelaction || that.get("cancelaction") || function() {};
            //绑定切换图片事件
            var isUpload = this.get("isUpload");
            if (isUpload !== false && model.type === "profile") {
                events["click .J-profile-fileupload"] = function(e) {
                    that.$("#J-form-emulation-profile-img").click();
                };
                events["change #J-form-emulation-profile-img"] = function(e) {
                    var filesize;
                    if (e.target.files && e.target.files.length != 0) {
                        //chrome等支持html5的浏览器
                        filesize = e.target.files[0].size;
                    } else {
                        //ie
                        var imgEL = $(".J-profile-fileupload").attr("src", $("#J-form-emulation-profile-img").val());
                        filesize = imgEL.fileSize;
                    }
                    if (filesize >= 2048 * 1024) {
                        Dialog.alert({
                            content: "上传文件大小不能超过2M"
                        });
                        return;
                    } else {
                        var img = loadImage(e.target.files[0]);
                        $(".J-profile-fileupload").attr("src", img.src);
                    }
                };
            }
            return events;
        },
        afterRender: function() {
            var itemPlugins = this.get("itemPlugins");
            var model = this.get("model");
            var items = this.get("itemConfigs") || model.items || [];
            for (var i in items) {
                var type = items[i].type;
                var Plugin = typeof type === "string" ? plugin[type] : type;
                itemPlugins[items[i].name] = new Plugin({
                    parentNode: this.$("." + items[i].fid),
                    model: items[i]
                });
            }
            this._initValidate();
        },
        _initValidate: function() {
            var model = this.get("model");
            var validatePos = model.validate.position;
            this.$("form").validate({
                errorElement: "span",
                errorClass: "help-block has-error",
                errorPlacement: function(e, t) {
                    if (validatePos == "right") {
                        return t.parents(".form-group").first().append(e);
                    } else {
                        e.css({
                            position: "absolute"
                        });
                        $("#" + model.id + " .form-group").css({
                            "margin-bottom": "30px"
                        });
                        if (t.is("input[type='radio']") || t.is("input[type='checkbox']")) {
                            return t.parent().after(e);
                        } else {
                            return t.after(e);
                        }
                    }
                },
                highlight: function(e) {
                    if (model.layout) {
                        //如果是自定义布局，则需要找到最近的el-data-component
                        return $(e).closest("div[el-data-component]").removeClass("has-success").addClass("has-error");
                    } else {
                        return $(e).closest(".form-group").removeClass("has-success").addClass("has-error");
                    }
                },
                success: function(e) {
                    var ret;
                    if (model.layout) {
                        ret = e.closest("div[el-data-component]").removeClass("has-error").find(".help-block").remove();
                    } else {
                        ret = e.closest(".form-group").removeClass("has-error").find(".help-block").remove();
                    }
                    if (validatePos == "bottom" && $("#" + model.id + " .help-block").length == 0) {
                        $("#" + model.id + " .form-group").css({
                            "margin-bottom": "15px"
                        });
                    }
                    return ret;
                }
            });
            //增加自定义的校验
            var itemValidates = this.get("itemValidates");
            for (var i in itemValidates) {
                (function(validName, validFunc) {
                    var func = validFunc.toString();
                    var match = func.match(/return ".*"/)[0];
                    var message = match.substring(7, match.length - 1);
                    $.validator.addMethod(validName, function(value) {
                        if (validFunc(value) === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }, message);
                })(i, itemValidates[i]);
            }
        },
        /** @method(name=getItemConfig,description=获取表单某个元素的配置)
		 * 	@params(name=name,description=表单中某个元素的name)
		 */
        getItemConfig: function(name) {
            return this.get("itemConfigs")[name];
        },
        getPlugin: function(name) {
            return this.get("itemPlugins")[name];
        },
        /** @method(name=setLabel,description=设置表单元素的标签名)
		 * 	@params(name=name,description=表单中某个元素的name)
		 *  @params(name=nalabelme,description=将要设置的标签名)
		 */
        setLabel: function(name, label) {
            this.$(".J-form-label-" + name).text(label);
        },
        /** @method(name=getLabel,description=获取表单元素的标签名)
		 * 	@params(name=name,description=表单中某个元素的name)
		 */
        getLabel: function(name) {
            return this.$(".J-form-label-" + name).text();
        },
        /** @method(name=hide,description=隐藏一个或多个表单元素)
		 * 	@params(name=name,type=string | Array,description=表单中一个或多个元素的name)
		 */
        hide: function(name) {
            if (name.constructor === String) {
                name = [ name ];
            }
            for (var i in name) {
                this.$("." + this.getItemConfig(name[i]).fid).parents(".form-group").addClass("hidden");
            }
            return this;
        },
        /** @method(name=show,description=显示一个或多个表单元素)
		 * 	@params(name=name,type=string | Array,description=表单中一个或多个元素的name)
		 */
        show: function(name) {
            if (name.constructor === String) {
                name = [ name ];
            }
            for (var i in name) {
                var item = this.getItemConfig(name[i]);
                if (item.type != "hidden") {
                    this.$("." + item.fid).parents(".form-group").removeClass("hidden");
                }
            }
            return this;
        },
        /** @method(name=setValue,description=设置某个表单元素的值)
		 * 	@params(name=name,description=表单中某个元素的name)
		 *  @params(name=value,description=将要设置的值)
		 */
        setValue: function(name, value) {
            var plugin = this.getPlugin(name);
            return plugin.setValue(value);
        },
        /** @method(name=getValue,description=设置某个表单元素的值)
		 * 	@params(name=name,description=表单中某个元素的name)
		 */
        getValue: function(name) {
            var plugin = this.getPlugin(name);
            return plugin.getValue();
        },
        /** @method(name=getData,description=获取某个下拉框的下拉范围或者获取整个表单的值)
		 * 	@params(name=name,type=undefined | string,description=表单中某个下拉框的name，如果为空，则获取的是整个表单的值)
		 *  @params(name=value,description=将要设置的值)
		 */
        getData: function(name) {
            if (name === undefined) {
                var result = {};
                var model = this.get("model");
                var items = this.get("itemConfigs") || model.items || [];
                for (var i in items) {
                    var plugin = this.getPlugin(items[i].name);
                    result[items[i].name] = plugin.getValue();
                }
                return result;
            } else {
                var plugin = this.getPlugin(name);
                return plugin.getData();
            }
        },
        /** @method(name=setData,description=设置某个下拉框的下拉范围或者设置整个表单的值)
		 * 	@params(name=name,type=undefined | string,description=表单中某个下拉框的name，如果为空，则设置的是整个表单的值)
		 *  @params(name=data,description=将要设置的值)
		 */
        setData: function(name, data) {
            if (name.constructor === String) {
                this.getPlugin(name).setData(data);
            } else {
                //那就证明keyOrIndex=null
                data = name;
                var itemConfigs = this.get("itemConfigs");
                for (var i in data) {
                    for (var j in itemConfigs) {
                        if (itemConfigs[j].id === i || itemConfigs[j].name === i) {
                            var plugin = this.getPlugin(itemConfigs[j].name);
                            if (plugin && typeof plugin.setValue === "function") {
                                plugin.setValue(tools._getValueFromObject(itemConfigs[j].name, data));
                            }
                        }
                    }
                }
            }
        },
        /** @method(name=load,description=重新刷新某个下拉框)
		 * 	@params(name=name,description=表单中某个下拉框的name)
		 *  @params(name=options,type=params{function}&callback{function}&options{Array},description=查询参数)
		 */
        load: function(name, options) {
            this.getPlugin(name).load(options);
        },
        /** @method(name=reset,description=重置表单)
		 */
        reset: function() {
            var model = this.get("model");
            var items = this.get("itemConfigs") || model.items || [];
            for (var i in items) {
                var plugin = this.getPlugin(items[i].name);
                plugin.reset();
                if (items[i].defaultValue !== null && items[i].defaultValue !== undefined) {
                    plugin.setValue(items[i].defaultValue);
                }
            }
            this.setDisabled(false, false);
            //去掉validate信息
            this.element.find(".help-block").remove();
            this.element.find(".has-error").removeClass("has-error");
            //如果是profile布局，还要清空profile的图片
            if (model.type == "profile") {
                this.$(".J-profile-fileupload").attr("src", "assets/eling/resources/nophoto.svg");
                this.$("#J-form-emulation-profile-img").val("");
            }
        },
        /** @method(name=setDisabled,description=设置不可用)
		 * 	@params(name=names,type=Array|string|undefined,description=表单中一个或多个元素的id，如果不穿，则对整个表单进行操作)
		 * 	@params(name=mark,type=boolean,description=是否设置为只读)
		 */
        setDisabled: function(names, mark) {
            if (typeof names === "boolean") {
                //证明没有传递names，将对整个表单进行操作
                var model = this.get("model");
                var items = this.get("itemConfigs") || model.items || [];
                for (var i in items) {
                    this.getPlugin(items[i].name).setDisabled(names);
                }
                if (names === true) {
                    this.$(".J-button-area").addClass("hidden");
                } else {
                    this.$(".J-button-area").removeClass("hidden");
                }
            } else if (typeof names === "string") {
                this.getPlugin(names).setDisabled(mark);
            } else if (typeof names === "object" && names.constructor === Array) {
                for (var i in names) {
                    var plugin = this.getPlugin(names[i]);
                    plugin.setDisabled(mark);
                }
            }
        },
        setReadonly: function(names, mark) {
            if (typeof names === "boolean") {
                //证明没有传递names，将对整个表单进行操作
                var items = this.get("model").items;
                for (var i in items) {
                    this.getPlugin(items[i].name).setReadonly(names);
                }
                if (names === true) {
                    this.$(".J-button-area").addClass("hidden");
                } else {
                    this.$(".J-button-area").removeClass("hidden");
                }
            } else if (typeof names === "string") {
                this.getPlugin(names).setReadonly(mark);
            } else if (typeof names === "object" && names.constructor === Array) {
                for (var i in names) {
                    var plugin = this.getPlugin(names[i]);
                    plugin.setReadonly(mark);
                }
            }
        },
        upload: function(id, url, callback) {
            if (id == "J-form-emulation-profile-img") {
                if (!this.$("#J-form-emulation-profile-img").val()) {
                    return;
                }
                $.ajaxFileUpload({
                    url: url,
                    secureuri: false,
                    fileElementId: "J-form-emulation-profile-img",
                    dataType: "json",
                    success: function(data) {
                        if (callback) {
                            callback(data);
                        }
                    }
                });
            } else {
                this.getPlugin(id).upload(url, callback);
            }
        },
        download: function(id, url) {
            if (id == "J-form-emulation-profile-img") {
                this.$("img.J-profile-fileupload").attr("src", url);
            } else {
                this.getPlugin(id).download(url);
            }
        },
        valid: function() {
            return this.$("form").valid();
        },
        destroy: function() {
            var plugins = this.get("itemPlugins");
            for (var i in plugins) {
                plugins[i].destroy();
            }
            Form_3_0_0.superclass.destroy.call(this, arguments);
        }
    });
    module.exports = Form_3_0_0;
});

define("eling/component/ui/form/3.0.0/dist/form.tpl", [], "<div class='container el-form el-form-3'>\n	<div class='row'>\n		<div class='col-xs-12'>\n			<div class='row'>\n				<div class='col-sm-12'>\n					<div class='box'>\n						<div class='box-content'>\n							<form class=\"form form-horizontal\" id=\"{{this.id}}\">\n								{{#if this.isProfile}}\n									{{#each this.items}}\n										<fieldset>\n											{{#if this.title}}\n												<div class='col-sm-3'>\n													<div class='lead'>\n														<i class='icon-{{this.icon}} text-contrast'></i>{{this.title}}\n													</div>\n													{{#if this.remark}}\n													<small class='text-muted'>{{this.remark}}</small>\n													{{/if}}\n													{{#if this.img}}\n													<small class='text-muted'>\n														<img class=\"img-responsive J-profile-fileupload\"\n															src=\"assets/eling/resources/nophoto.svg\" width=230 height=230/>\n														<input name=\"file\" type=\"file\" id=\"J-form-emulation-profile-img\" class=\"hidden\"/>\n													</small>\n													{{/if}}\n												</div>\n												<div class='col-sm-8'>\n											{{else}}\n												<div class='col-sm-12'>\n											{{/if}}\n												{{#each this.children}}\n													<div class=\"form-group {{this.show}}\">\n														<label>{{this.label}}</label>\n														{{#if this.isRequired}}\n														<span style=\"color: red;\">*</span>\n														{{/if}}\n														<div class=\"{{this.fid}}\"></div>\n													</div>\n												{{/each}}\n											</div>\n										</fieldset>\n										<hr class='hr-normal'>\n									{{/each}}\n								{{else}}\n									{{#unless this.layout}}\n										{{#each this.items}}\n											<div class=\"form-group {{this.show}} {{this.className.container}}\" style=\"{{this.style.container}}\">\n												<label class=\"col-md-2 control-label J-form-label-{{this.name}}\n												{{this.className.label}}\" style=\"{{this.style.label}}\">{{this.label}}</label>\n												<div class=\"col-md-6 {{this.fid}} {{this.className.value}}\" style=\"{{this.style.value}}\"></div>\n												{{#if this.isRequired}}\n												<div class=\"required\">*</div>\n												{{/if}}\n											</div>\n										{{/each}}\n									{{else}}\n										{{{this.layout}}}\n									{{/unless}}\n									<div class=\"clear\"></div>\n								{{/if}}\n								{{#if this.defaultButton}}\n								<div class='el-form-buttons J-button-area'>\n									<div class='row'>\n										<div class='col-md-10 col-md-offset-2'>\n											<div class=\"J-form-save J-form-{{this.id}}-save btn btn-theme\">\n												<span class='J-form-saveText J-form-{{this.id}}-saveText'>{{this.saveText}}</span>\n											</div>\n	                            			<div class='J-form-cancel J-form-{{this.id}}-cancel btn'>{{this.cancelText}}</div>\n	                          			</div>\n	                       			</div>\n                      			</div>\n                      			{{/if}}\n                      		</form>\n                      	</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n                      	");

define("eling/component/ui/form/3.0.0/dist/form.css", [], function() {
    seajs.importStyle(".el-form-3 .required{color:red;line-height:30px;font-size:20px;float:left;margin-top:3px;margin-right:10px}.el-form-3 .form-group{min-height:34px}.el-form-3 .el-form-buttons{background-color:#f4f4f4;padding:20px;border-top:1px solid #e5e5e5;margin-top:20px}.el-form-3 .clear{clear:both}@media (min-width:768px){.el-form-3 .el-form-buttons{padding:20px 0}}.el-form-3 .select2-container-disabled{border:0 none}.el-form-3 .select2-container-multi{border:1px solid #ddd}.el-profile .control-label{margin-bottom:5px}");
});
