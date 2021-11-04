define("eling/component/ui/calendar/1.0.0/dist/calendar-debug", [ "jquery/jquery.ui/1.11.4/jquery-ui.min", "jquery/jquery-plugins/fullcalendar/fullcalendar", "eling/component/core/uicomponent/2.0.0/src/uicomponent", "base", "tools", "handlebars", "templatable", "bootstrap", "eling/component/utils/ajaxwrapper", "dialog", "store", "./calendar.css", "./calendar.tpl" ], function(require, exports, module) {
    require("jquery/jquery.ui/1.11.4/jquery-ui.min");
    var fullCalendar = require("jquery/jquery-plugins/fullcalendar/fullcalendar");
    var UIComponent = require("eling/component/core/uicomponent/2.0.0/src/uicomponent");
    var aw = require("eling/component/utils/ajaxwrapper");
    require("./calendar.css");
    var Calendar = UIComponent.extend({
        attrs: {
            template: require("./calendar.tpl"),
            instance: null,
            relation: null,
            model: {}
        },
        initCustAttr: function() {
            var that = this;
            var defaultOptions = {
                header: {
                    left: "prev,today,next",
                    center: "title",
                    right: "basicDay,basicWeek,month"
                },
                buttonText: {
                    basicDay: "今天",
                    agendaWeek: "今天",
                    basicWeek: "本周",
                    agendaWeek: "本周",
                    month: "本月",
                    prev: '<span class="icon-chevron-left"></span>',
                    next: '<span class="icon-chevron-right"></span>',
                    today: "今天"
                },
                defaultView: "month",
                titleFormat: {
                    month: "yyyy-MM",
                    week: "MM.dd[ yyyy]{ '&#8212;'[ MM].dd}",
                    day: "MM-dd"
                },
                columnFormat: {
                    month: "dddd",
                    week: "MM-dd",
                    day: "MM-dd"
                },
                minTime: 8,
                maxTime: 19,
                allDaySlot: true,
                allDayText: "多天活动",
                axisFormat: "h(:mm)tt",
                dayNames: [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ],
                contentHeight: 550,
                aspectRatio: 1.25
            };
            var calendar = this.get("model") ? this.get("model").calendar : {};
            calendar = $.extend(true, defaultOptions, calendar);
            calendar = $.extend(true, calendar, {
                editable: true,
                eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
                    var drop = calendar && calendar.drop ? calendar.drop : function() {
                        return false;
                    };
                    drop(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view);
                    //更新data
                    var id = event.id;
                    var start = that.get("translate").start;
                    var end = that.get("translate").end;
                    var relation = that.get("relation");
                    var data = relation[id];
                    data[start] = event.start.getTime();
                    if (end) {
                        data[end] = event.end ? event.end.getTime() : "";
                    }
                    return false;
                },
                eventClick: function(calEvent, jsEvent, view) {
                    var click = calendar && calendar.click ? calendar.click : function() {
                        return false;
                    };
                    var eventid = calEvent.id;
                    var relation = that.get("relation");
                    var data = relation[eventid];
                    click(data, calEvent, jsEvent, view);
                    return false;
                }
            });
            this.get("model").calendar = calendar;
        },
        _loadData: function(url, params, callback) {
            var that = this;
            var url = this.get("url");
            var data = params || this.get("params");
            if (this.get("autoRender")) {
                aw.ajax({
                    url: url,
                    dataType: "json",
                    data: data,
                    success: function(data) {
                        that.setData(data);
                        if (callback) {
                            callback(data);
                        }
                    }
                });
            }
        },
        setup: function() {
            this.render();
            var url = this.get("url");
            if (url) {
                this._loadData(url);
            }
        },
        getInstance: function() {
            return this.get("instance");
        },
        refresh: function(params, callback) {
            this.set("autoRender", true);
            this._loadData(this.get("url"), params, callback);
        },
        getData: function() {
            var results = [];
            var relation = this.get("relation") || {};
            for (var i in relation) {
                results.push(relation[i]);
            }
            return results;
        },
        setData: function(data) {
            var instance = this.get("instance") || $(".J-calendar-content").fullCalendar(this.get("model").calendar);
            this.set("instance", instance);
            instance.fullCalendar("removeEventSource", this.get("cacheEvents"));
            instance.fullCalendar("addEventSource", this._transData2Event(data));
            this._dataRelaEvents(data);
        },
        _transData2Event: function(data) {
            var events = [];
            var translate = this.get("translate") || {};
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var temp = data[i];
                    var event = {};
                    //生成id
                    var id = "el-event-" + i;
                    event.id = id;
                    for (var j in translate) {
                        var field = translate[j];
                        if (typeof field === "function") {
                            event[j] = field(temp);
                        } else if (j == "start" || j == "end") {
                            if (temp[field]) {
                                event[j] = new Date(temp[field]);
                            }
                        } else {
                            event[j] = temp[field];
                        }
                    }
                    events.push(event);
                }
            }
            this.set("cacheEvents", events);
            return events;
        },
        //构建数据和视图模型的关系
        _dataRelaEvents: function(data) {
            var map = {};
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    map["el-event-" + i] = data[i];
                }
            }
            this.set("relation", map);
        }
    });
    module.exports = Calendar;
});

define("eling/component/ui/calendar/1.0.0/dist/calendar.css", [], function() {
    seajs.importStyle(".fc-event{font-size:16px!important}.fc-header-left{text-align:left!important;left:10px}.fc-header-center{text-align:center!important}.fc-header-right{text-align:right!important}");
});

define("eling/component/ui/calendar/1.0.0/dist/calendar.tpl", [], '<div class="el-calendar container">\n	<div class="row">\n		<div class="col-sm-12">\n			<div class="box">\n				{{#if this.title}}\n				<div class="box-header">{{this.title}}</div>\n				{{/if}}\n				<div class="box-content">\n					<div class="J-calendar-content">\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>');
