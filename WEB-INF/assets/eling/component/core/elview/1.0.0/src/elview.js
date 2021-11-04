define(function(require, exports, module) {
	
	//core
	var Widget = require('widget');
	
	//bootstrap
	require("bootstrap");
	
	//interface
	var Templatable=require('templatable');
	
	//ui
	var Button = require("button-1.0.0");
	
	//工具
	var JSON = require("json");
	var tools = require("tools");
	var Dialog = require("dialog");
	
	var ElView = Widget.extend({
		Implements : [Templatable],
		attrs : {
			parentNode : "#content"
		},
		
		/*************覆写widget的方法*************/
		
		parseElement:function(){
			//重写了widget的方法，在parseElement之前，调用initCustAttr方法，重新处理model属性，保证model是模板需要的模型。
			this._initCustAttr();
			ElView.superclass.parseElement.call(this,arguments);
			
			//TODO：为了widget的query方法能够找到对应的组件实例
			this.element.attr("id", this.get("id"));
		},
		render : function() {

			ElView.superclass.render.call(this);
			
			var params = this.get("params");
			
			this.afterRender(params,this);
			
			this.initComponent(params,this);
			
			if((this.get("isCloseNav")) || (params && params.isCloseNav)){
				if(!$("body").hasClass("main-nav-closed")){
					$(".el-headerbar .toggle-nav").click();
				}
			}
			
			if(params && params.business){
				var business = params.business;
				var businessInterface = this[business];
				if(typeof businessInterface === "function"){
					businessInterface.call(this,params,this);
				}
			}else{
				this.afterInitComponent(params,this);
			}
			
			if(this.get("isAllowBack")){
				var id = location.hash.substring(1);
				var curNode = window.eling.history[id];
				var parent = window.eling.history[curNode.parent];
				
				var goBackContainer = $("<div></div>").addClass("btn-group").addClass("ex-btn-group").addClass("dropdown");
				$(".el-subnav .el-pull-right").append(goBackContainer);
				
				var button = new Button({
					parentNode : goBackContainer,
					model : {
						id : "goBack",
						text : parent.title,
						handler : function(){
							history.go(-1);
						}
					}
				});
			}
			return this;
		},
		setup:function(){
			var autoRender=this.get("autoRender");
			if(autoRender==true){
				this.render();
			}
		},
		destroy:function(){
			seajs.emit("view-destroy-event");
			var attrs=this.attrs;
			for(var i in attrs){
				if(attrs[i].value && typeof attrs[i].value.destroy === "function" && i !== "parentWidget" && i !== "grandParentWidget"){
					attrs[i].value.destroy();
				}
			}
			ElView.superclass.destroy.call(this,arguments);
		},
		
		/*************供子类覆写的方法*************/
		
		//供子类覆盖，组织合适的数据模型
		_initCustAttr:function(){},
		afterRender : function(){},
		initComponent:function(){},
		afterInitComponent:function(){},
		
		
		/*************提供的工具方法*************/
		hide:function(selector){
			var str="";
			if(selector.constructor===Array){
				for(var i=0;i<selector.length;i++){
					str+=selector[i]+",";
				}
				selector=str.substring(0,str.length-1);
			}
			$(selector).addClass("hidden");
			return this;
		},
		show:function(selector){
			var str="";
			if(selector.constructor===Array){
				for(var i=0;i<selector.length;i++){
					str+=selector[i]+",";
				}
				selector=str.substring(0,str.length-1);
			}
			$(selector).removeClass("hidden");
			return this;
		},
		
		setParentParams : function(key,value){
			var parent = this.get("parentWidget");
			if(parent){
				parent.set(key,value);
			}
		},
		getParentParams : function(key){
			var parent = this.get("parentWidget");
			if(parent){
				return parent.get(key);
			}
			return null;
		},
		openView : function(config){
			if(!config.url || config.id == location.hash.substring(1)){
				return false;
			}
			$(window).scrollTop(0);
			Dialog.loading(true);
			
			//1.为新打开的节点设置id(config.id代表的是系统节点，即通过左侧菜单点击的节点。node*****代表节点中手动调用openView打开的节点)
			config.id = config.id || "node" + new Date().getTime();
			
			//2获取当前节点的id作为即将打开节点的parent，以便以后做回退。
			var instance = window.eling.instance;
			config.parent = instance ? instance.get("id") : "";
			
			//3.缓存配置
			window.eling.history[config.id] = config;
			
			//4.打开新节点（在mainframe.js中绑定了onhashchange事件）
			location.hash = "#" + config.id;
		},
		_destroyNode : function(){
			var instance = window.eling.instance;
			//1.销毁当前节点
			if(instance){
				var oid = instance.get("id");
				var oldConfig = window.eling.history[oid];
				oldConfig.title = instance.element.find(".J-subnav-title").text();
				
				//做墓碑（将页面销毁时需要缓存的参数覆盖原来的params参数）
				oldConfig.params = typeof instance.setEpitaph === "function" ? instance.setEpitaph() : "";
				
				//销毁当前实例
				instance.destroy();
			}
			
			//2.异常处理,销毁父节点后如果J-el-content下还有其余节点，则说明系统中历史管理出现了问题
			$(".J-el-content").children().each(function(){
				var id = $(this).attr("id");
				var errInstance = Widget.query("#"+id);
				if(errInstance){
					errInstance.destroy();
				}
			});
			
			//3.销毁内存泄露的东东，早期的组件在引用插件后，没有销毁
			$(".select2-drop,.select2-drop-mask,.select2-sizer,.daterangepicker,.J-tip").remove();
		},
		_openView : function(config){
			this._destroyNode();
			
			if(config){
				var params = config.params;
				if(tools.isString(params)){
					try{
						config.params = JSON.parse(params);
					}catch(e){
						config.params = "";
					}
				}
				
				require.async(config.url, function(View){
					var view=new View({
			    		id : config.id,
						parentNode : "#content",
						params : config.params,
						forward : config.forward,
						isAllowBack : config.isAllowBack
					});
					window.eling.instance = view;
					view.render();
					Dialog.loading(false);
					return;
				});
			}else{
				Dialog.loading(false);
			}
		}
	});
	
	module.exports = ElView;
});