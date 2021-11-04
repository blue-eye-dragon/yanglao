define("eling/component/ui/admindivision/1.0.0/dist/admindivision-debug", [ "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "./admindivision.tpl", "./admindivision.css" ], function(require, exports, module) {
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var template = require("./admindivision.tpl");
    require("./admindivision.css");
    var provinces = null;
    var cities = null;
    var places = null;
    var Admindivision_1_0_0 = UIComponent.extend({
        curProvince: null,
        curCity: null,
        curPlace: null,
        attrs: {
            autoRender: true,
            template: template,
            model: {}
        },
        events: {
            "click .J-admindivision-tab-province": function() {
                this.switchTo(0);
            },
            "click .J-admindivision-tab-city": function() {
                this.switchTo(1);
            },
            "click .J-admindivision-tab-place": function() {
                this.switchTo(2);
            },
            "click .J-admindivision-province-item": function(e) {
                //设置当前所选省
                this.curProvince = provinces[$(e.currentTarget).attr("data-index")];
                //根据所选省加载市
                this.getCities(this.curProvince.id);
                //执行自定义回掉
                var model = this.get("model");
                if (typeof model.itemSelected === "function") {
                    model.itemSelected(this.curProvince, "province");
                }
            },
            "click .J-admindivision-city-item": function(e) {
                //设置当前所选市
                this.curCity = cities[this.curProvince.id][$(e.currentTarget).attr("data-index")];
                //根据所选省加载市
                this.getPlaces(this.curCity.id);
                //执行自定义回掉
                var model = this.get("model");
                if (typeof model.itemSelected === "function") {
                    model.itemSelected(this.curCity, "city");
                }
            },
            "click .J-admindivision-place-item": function(e) {
                //设置当前所选县
                this.curPlace = places[this.curCity.id][$(e.currentTarget).attr("data-index")];
                //执行自定义回掉
                var model = this.get("model");
                if (typeof model.itemSelected === "function") {
                    model.itemSelected(this.curPlace, "place");
                }
                this.destroy();
            },
            "click .J-admindivision-close": function() {
                var model = this.get("model");
                if (typeof model.close === "function") {
                    model.close();
                }
                this.destroy();
            },
            "click .J-admindivision-reset": function() {
                var model = this.get("model");
                if (typeof model.reset === "function") {
                    model.reset();
                }
            }
        },
        afterRender: function() {
            this.getProvince();
        },
        _loadData: function(code, callback) {
            $.ajax({
                url: "api/admindivision",
                data: {
                    parentCode: code
                },
                dataType: "json",
                success: function(data) {
                    if (typeof callback === "function") {
                        callback(data);
                    }
                }
            });
        },
        switchTo: function(index) {
            this.$(".nav-tabs li").removeClass("active");
            this.$(".nav-tabs li").eq(index).addClass("active");
            this.$(".tab-pane").removeClass("active");
            this.$(".tab-pane").eq(index).addClass("active");
        },
        getProvince: function() {
            var that = this;
            var model = this.get("model");
            if (provinces) {
                model.provinces = provinces;
                this.renderPartial(".J-admindivision-content-province");
            } else {
                this._loadData(null, function(data) {
                    provinces = data;
                    model.provinces = data;
                    that.renderPartial(".J-admindivision-content-province");
                });
            }
        },
        getCities: function(province) {
            console.log('getCities', province)
            var that = this;
            var model = this.get("model");
            if (cities && cities[province]) {
                model.cities = cities[province];
                this.renderPartial(".J-admindivision-content-city");
                this.switchTo(1);
            } else {
                this._loadData(province, function(data) {
                    if (!cities) {
                        cities = {};
                    }
                    cities[province] = data;
                    model.cities = data;
                    that.renderPartial(".J-admindivision-content-city");
                    that.switchTo(1);
                });
            }
        },
        getPlaces: function(city) {
            var that = this;
            var model = this.get("model");
            if (places && places[city]) {
                model.places = places[city];
                this.renderPartial(".J-admindivision-content-place");
                this.switchTo(2);
            } else {
                this._loadData(city, function(data) {
                    if (!places) {
                        places = {};
                    }
                    places[city] = data;
                    model.places = data;
                    that.renderPartial(".J-admindivision-content-place");
                    that.switchTo(2);
                });
            }
        }
    });
    module.exports = Admindivision_1_0_0;
});

define("eling/component/ui/admindivision/1.0.0/dist/admindivision.tpl", [], '<div class="tabbable el-admindivision-1-0-0" style="{{this.style}}">\n	<ul class="nav nav-tabs">\n		<li class="active">\n			<a href="javascript:void(0);" class="J-admindivision-tab-province">省份</a>\n		</li>\n		<li>\n			<a href="javascript:void(0);" class="J-admindivision-tab-city">城市</a>\n		</li>\n		<li>\n			<a href="javascript:void(0);" class="J-admindivision-tab-place">县区</a>\n		</li>\n		<li>\n			<a href="javascript:void(0);" class="J-admindivision-reset"><i class="icon-mail-reply"></i></a>\n		</li>\n		<li>\n			<a href="javascript:void(0);" class="J-admindivision-close"><i class="icon-remove"></i></a>\n		</li>\n	</ul>\n	<div class="tab-content" style="min-height: 100px;">\n		<div class="tab-pane active J-admindivision-content-province">\n			<ul>\n				{{#each this.provinces}}\n				<li class="admindivision-item">\n					<a href="javascript:void(0);" data-index="{{@index}}" \n						class="J-admindivision-province-item">{{this.name}}</a>\n				</li>\n				{{/each}}\n			</ul>\n		</div>\n		<div class="tab-pane J-admindivision-content-city">\n			{{#each this.cities}}\n				<li class="admindivision-item">\n					<a href="javascript:void(0);" data-index="{{@index}}" \n						class="J-admindivision-city-item">{{this.name}}</a>\n				</li>\n			{{/each}}\n		</div>\n		<div class="tab-pane J-admindivision-content-place">\n			{{#each this.places}}\n				<li class="admindivision-item">\n					<a href="javascript:void(0);" data-index="{{@index}}"\n						 class="J-admindivision-place-item">{{this.name}}</a>\n				</li>\n			{{/each}}\n		</div>\n	</div>\n</div>');

define("eling/component/ui/admindivision/1.0.0/dist/admindivision.css", [], function() {
    seajs.importStyle(".el-admindivision-1-0-0{position:absolute;border:1px #ccc solid;padding:10px 15px;width:320px;background:#fff;z-index:2}.el-admindivision-1-0-0 ul{margin:0;padding:0}.el-admindivision-1-0-0 .admindivision-item{float:left;list-style:none;padding:5px}.el-admindivision-1-0-0 .admindivision-item a:hover{background:#f34541;color:#fff;text-decoration:none}");
});
