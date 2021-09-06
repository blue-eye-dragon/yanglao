/**
 * @name uicomponent
 * @version 2.0.0
 * @description ui组建基类
 * @dependencies ["base","tools","bootstrap"]
 */
define(function(require,exports,module){
	var Base = require("base");
	var tools = require("tools");
	var handlebars = require("handlebars");
	var Templatable = require('templatable');
	require("bootstrap");
	
	var UIComponent = Base.extend({
		Implements : [Templatable],
		propsInAttrs: ["element", "events"],
		handlebars : handlebars,
        element: null,
        events: null,
        attrs: {
        	parentNode: "body",
            template: "<div></div>",
            personalization : null,
            model: {}
        },
        initialize: function(config) {
        	//1.初始化属性(不支持data-*这种属性的解析)
        	UIComponent.superclass.initialize.call(this,config);
            //2.解析模板
            this.parseElement();
            //3.初始化 events
            this.delegateEvents();
            //4.子类自定义的初始化
            this.setup();
        },
        // 构建 this.element
        parseElement: function() {

            var that = this;

        	var model = this.get("model");
        	if(!model.id){
        		model.id = new Date().getTime();
        	}
        	
        	var personalization = this.get("personalization");

            if(personalization){
                $.ajax({
                    url : "api/datastorage/queryvalue",
                    dataType : "json",
                    data : {
                        key : model.id + "_" + personalization.viewCode,
                        type : "template"
                    },
                    async : false,
                    success : function(data){
                    	that._parseElement(data ? JSON.parse(data) : {})
                    },
                    error : function(){
                    	that._parseElement({})
                    }
                });
            }else{
                this._parseElement();
            }
        },

        _parseElement : function(data){
            this.initCustAttr(data);

            var element = handlebars.compile(this.get("template"))(this.get("model"));

            this.element = $(element);
        },

        // 注册事件代理
        delegateEvents: function() {
        	if (tools.isFunction(this.events)) {
                this.events = this.events();
            }
        	
            // key 为 'event selector'
            for (var key in this.events) {
                var args = key.split(" ");
                var eventType = args[0];
                var selector = args[1];
                (function(handler, widget) {
                    $(widget.element).on(eventType, selector, function(e){
                    	if (tools.isFunction(handler)) {
                            handler.call(widget, e);
                        } else {
                            widget[handler](e);
                        }
                    });
                })(this.events[key], this);
            }
            return this;
        },
        // 卸载事件代理
        undelegateEvents: function() {
            this.element && this.element.off();
            return this;
        },
        // 渲染（子类覆盖时，需保持 `return this`）
        render: function() {
            this.element.appendTo(this.get("parentNode"));
            this.afterRender();
            return this;
        },
        // 在 this.element 内寻找匹配节点
        $: function(selector) {
            return this.element.find(selector);
        },
        destroy: function() {
            this.undelegateEvents();
            // For memory leak
            if (this.element) {
                this.element.off();
                this.element.remove();
            }
            this.element = null;
            UIComponent.superclass.destroy.call(this);
        },
        initCustAttr : function(){},
        setup: function(){
        	var autoRender=this.get("autoRender");
			if(autoRender==true){
				this.render();
			}
        },
        afterRender : function(){},
        hide : function(){
        	this.element.addClass("hidden");
        },
        show : function(){
        	this.element.removeClass("hidden");
        }
	});
	module.exports = UIComponent;
});
