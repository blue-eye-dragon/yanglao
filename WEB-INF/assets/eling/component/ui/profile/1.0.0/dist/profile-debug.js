define("eling/component/ui/profile/1.0.0/dist/profile-debug", [ "eling/component/ui/form/1.0.0/dist/form", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "gallery/handlebars/2.0.0/handlebars-seajs", "eling/component/utils/ajaxwrapper", "dialog", "store", "jquery/jquery-plugins/validate/jquery.validate", "jquery/jquery-plugins/datetimepicker/jquery.datetimepicker", "jquery/jquery-plugins/select2/select2", "eling/component/ui/admindivision/1.0.0/dist/admindivision", "jquery/jquery-plugins/autocomplete/autocomplete", "jquery/jquery-plugins/ajaxfileupload/ajaxfileupload", "eling/component/utils/dialog/1.0.0/dist/dialog", "eling/component/utils/loadimgage/loadimage-debug", "./profile.tpl" ], function(require, exports, module) {
    var Form = require("eling/component/ui/form/1.0.0/dist/form");
    var aw = require("eling/component/utils/ajaxwrapper");
    require("jquery/jquery-plugins/ajaxfileupload/ajaxfileupload");
    var Dialog = require("eling/component/utils/dialog/1.0.0/dist/dialog");
    var LoadImage = require("eling/component/utils/loadimgage/loadimage-debug");
    var Profile = Form.extend({
        attrs: {
            template: require("./profile.tpl"),
            autoRender: true,
            personalization: "",
            model: {
                saveText: "保存",
                cancelText: ""
            }
        },
        getPersonalizationConfig: function(items, sCustItems) {
            var ret = items;
            var custItems = JSON.parse(sCustItems);
            for (var i in items) {
                var name = columns[i].name;
                var config = custConfig[name];
                if (config.show != false) {
                    custColumns.push(columns[i]);
                }
            }
            return custColumns;
        },
        initCustAttr: function(custConfigs) {
            var model = this.get("model") || {};
            var items = model.items || [];
            var childrens = [];
            for (var i = 0; i < items.length; i++) {
                var children = items[i].children || [];
                for (var j = 0; j < children.length; j++) {
                    var idOrName = children[j].id || children[j].name;
                    if (custConfigs && custConfigs[idOrName]) {
                        children[j].show = custConfigs[idOrName].isShow ? "" : "hidden";
                    }
                    var validate = children[j].validate || [];
                    for (var k = 0; k < validate.length; k++) {
                        if (validate[k] == "required") {
                            children[j].isRequired = true;
                        }
                    }
                    childrens.push(children[j]);
                }
            }
            Profile.superclass.initCustAttr.call(this, childrens);
        },
        events: function() {
            var that = this;
            var itemsParams = [];
            var model = this.get("model") || {};
            var items = model.items || [];
            for (var i = 0; i < items.length; i++) {
                var children = items[i].children || [];
                for (var j = 0; j < children.length; j++) {
                    itemsParams.push(children[j]);
                }
            }
            var parentEvents = Profile.superclass.events.call(this, itemsParams);
            var isUpload = this.get("isUpload");
            if (isUpload !== false) {
                parentEvents["click .J-profile-fileupload"] = function(e) {
                    that.$("#J-profile-fileupload-form").click();
                };
                parentEvents["change #J-profile-fileupload-form"] = function(e) {
                    var filesize;
                    if (e.target.files && e.target.files.length != 0) {
                        //chrome等支持html5的浏览器
                        filesize = e.target.files[0].size;
                    } else {
                        //ie
                        var imgEL = $(".J-profile-fileupload").attr("src", $("#J-profile-fileupload-form").val());
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
            return parentEvents;
        },
        afterRender: function() {
            this._initValidate();
            var itemsParams = [];
            var model = this.get("model") || {};
            var items = model.items || [];
            for (var k = 0; k < items.length; k++) {
                var children = items[k].children || [];
                for (var i = 0; i < children.length; i++) {
                    itemsParams.push(children[i]);
                }
            }
            this._initPlugins(itemsParams, this.element);
            this.loadPicture();
        },
        setData: function(data) {
            var itemsParams = [];
            var model = this.get("model") || {};
            var items = model.items || [];
            for (var i = 0; i < items.length; i++) {
                var children = items[i].children || [];
                for (var j = 0; j < children.length; j++) {
                    itemsParams.push(children[j]);
                }
            }
            Profile.superclass.setData.call(this, data, itemsParams);
            if (items[0] && items[0].img) {
                this.loadPicture();
            }
        },
        reset: function() {
            var itemsParams = [];
            var model = this.get("model") || {};
            var items = model.items || [];
            for (var i = 0; i < items.length; i++) {
                var children = items[i].children || [];
                for (var j = 0; j < children.length; j++) {
                    itemsParams.push(children[j]);
                }
            }
            Profile.superclass.reset.call(this, itemsParams);
            $("#J-profile-fileupload-form").val("");
            this.loadPicture();
        },
        loadPicture: function(urlParams) {
            var items = this.get("model").items;
            if (items && items[0].img) {
                var imgOptions = items[0].img;
                var url = imgOptions.url;
                var idAttribute = imgOptions.idAttribute;
                if ($(".J-" + idAttribute).is("select")) {
                    var pk = $(".J-" + idAttribute).find("option:selected").val();
                    $("img.J-profile-fileupload").attr("src", urlParams || url + (pk || 0));
                } else {
                    $("img.J-profile-fileupload").attr("src", urlParams || url + ($(".J-" + idAttribute).val() || 0));
                }
            }
        },
        upload: function(url, callback) {
            var items = this.get("model").items;
            if (items && items[0].img) {
                var imgOptions = items[0].img;
                if ($("#J-profile-fileupload-form").val()) {
                    $.ajaxFileUpload({
                        url: url ? url : imgOptions.url + $(".J-" + imgOptions.idAttribute).val(),
                        secureuri: false,
                        fileElementId: "J-profile-fileupload-form",
                        dataType: "json",
                        success: function(data) {
                            if (callback) {
                                callback(data);
                            }
                        }
                    });
                } else {
                    if (callback) {
                        callback();
                    }
                }
            }
        },
        getItemConfig: function(keyOrIndex) {
            var itemsParams = [];
            var model = this.get("model") || {};
            var items = model.items || [];
            for (var i = 0; i < items.length; i++) {
                var children = items[i].children || [];
                for (var j = 0; j < children.length; j++) {
                    itemsParams.push(children[j]);
                }
            }
            return Profile.superclass.getItemConfig.call(this, keyOrIndex, itemsParams);
        },
        getSubData: function() {
            var model = this.get("model");
            var datas = $("#" + model.id).serializeArray(), k = 0;
            var items = model.items || [];
            var results = [];
            for (var i = 0; i < items.length; i++) {
                var result = {};
                var children = items[i].children;
                for (j = 0; j < children.length; j++, k++) {
                    result[children[j].name] = datas[k].value;
                }
                results.push(result);
            }
            return results;
        }
    });
    module.exports = Profile;
});

define("eling/component/ui/profile/1.0.0/dist/profile.tpl", [], "<div class='container el-profile'>\n	<div class='row'>\n		<div class='col-sm-12 col-lg-12'>\n        	<div class='box'>\n        		<div class='box-content box-double-padding'>\n        			<form class='form' style='margin-bottom: 0;' id={{this.id}}>\n        			{{#each this.items}}\n        				<fieldset>\n        					{{#if this.title}}\n        						{{#if this.children}}\n        							<div class='col-sm-4'>\n	        					{{else}}\n	        						<div class='col-sm-12'>\n	        					{{/if}}\n			        					<div class='lead'>\n		        							<i class='icon-{{this.icon}} text-contrast'></i>{{this.title}}\n		        						</div>\n		        						{{#if this.remark}}\n		        						<small class='text-muted'>{{this.remark}}</small>\n		        						{{/if}}\n		        						{{#if this.img}}\n		        						<small class='text-muted'>\n		        							<img class=\"img-responsive J-profile-fileupload\"/>\n		        						</small>\n		        						{{/if}}\n		        					</div>\n        					{{/if}}\n        					{{#if this.title}}\n        						<div class='col-sm-7'>\n        					{{else}}\n        						<div class='col-sm-12'>\n        					{{/if}}\n       							{{#each this.children}}\n       								<div class=\"form-group {{this.type}} {{this.show}}\">\n       									<label>{{this.label}}</label>\n       									{{#if this.isRequired}}\n										<span style=\"color: red;\">*</span>\n										{{/if}}\n		        						{{#form_1_0_0 this}}\n		        						{{/form_1_0_0}}\n	        						</div>\n       							{{/each}}\n        					</div>\n        				</fieldset>\n        				<hr class='hr-normal'>\n        			{{/each}}\n        			{{#if this.defaultButton}}\n        			<div class='J-button-area form-actions form-actions-padding' style='margin-bottom: 0;'>\n        				<div class='text-right'>\n        					<button class='J-save J-form-save J-form-{{this.id}}-save btn btn-lg btn-theme' type=\"submit\">\n        						<i class='icon-save'></i>\n        						<span class=\"J-form-{{this.id}}-saveText J-form-saveText\">{{this.saveText}}</span>\n        					</button>\n        					{{#if this.cancelText}}\n        					<a class='J-cancel J-form-cancel J-form-{{this.id}}-cancel btn btn-lg' href=\"javascript:void(0);\">{{this.cancelText}}</a>\n        					{{/if}}\n        				</div>\n        			</div>\n        			{{/if}}\n        			</form>\n        		</div>\n        	</div>\n        </div>\n    </div>\n    <div class=\"hidden\">\n    	<form id=\"photoform\" enctype=\"multipart/form-data\" target=\"hidden_iframe\" method=\"post\">\n			<input name=\"file\" type=\"file\" id=\"J-profile-fileupload-form\" class=\"hidden\"/>\n		</form>\n		<iframe name=\"hidden_iframe\" class=\"J-picframe hidden\"></iframe>\n    </div>\n</div>\n\n");
