/**
 * 基本档案视图，实现了以下几个功能：
 * 1、继承自elview
 * 2、指定了默认的模板：一个div放置subnav，一个div放置列表，一个div放置卡片，统一加类名进行控制，方便组件提供默认行为，减少业务js文件的代码量
 * 3、继承自BaseView的页面，其subnav，list，card部分显示的组件，都不要指定parentNode
 * 4、在afterRnder中增加了三个初始化步骤
 * 5、对于subnav,可以直接传递subnav的参数，也可以直接覆盖initSubnav方法，initSubnav方法还支持第二个参数，用来指定是否显示默认按钮
 * 6、对于list,默认会初始化一个grid，可以直接传递grid的参数，也可以覆盖initList方法
 * 7、对于initCard方法，只能直接由子类覆盖，因为无法确定card界面到底是一个什么组件
 */
define(function(require, exports, module) {
	var ElView = require('elview');
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	var EditGrid=require("editgrid-1.0.0");
	var Form_1_0_0 = require("form-1.0.0");
	var Form_2_0_0 =require("form-2.0.0")
	var Profile=require("profile");
	var MultiRowGrid=require("multirowgrid");
	var ReportGrid=require("reportgrid");
	var SimpleReportGrid=require("simplereportgrid");
	
	var cartype={
		profile  :Profile,
		"form-1.0.0" : Form_1_0_0,
		verform : Form_1_0_0,
		
		"form-2.0.0" : Form_2_0_0,
		form1 : Form_2_0_0,
		
		grid:Grid,
		editgrid:EditGrid,
		multirowgrid:MultiRowGrid,
		reportgrid:ReportGrid,
		simplereportgrid:SimpleReportGrid
	};
	
	var BaseView = ElView.extend({
		attrs : {
			template : "<div class='el-baseview-"+moment().valueOf()+"'><div class='J-subnav'></div>"+"<div class='J-list'></div>"+"<div class='J-card hidden'></div></div>"
		},
		afterRender : function(){
			this._initSubnav();
			this._initList();
			this._initCard();
		},
		
		_initSubnav:function(){
			var that=this;
			var parentNode=this.$(".J-subnav");
			var buttons=[{
				id:"add",
				text:"新增",
				type:"button",
				handler:function(){
					that.get("card").reset();
					that.list2Card(true);
					return false;
				}
			},{
				id:"return",
				text:"返回",
				type:"button",
				show:false,
				handler:function(){
					that.list2Card(false);
					return false;
				}
			}];
			
			var options=this.initSubnav(this) || {};
			if(options.model){
				options.parentNode=parentNode;
				if(!options.model.buttons && !options.model.items){
					//如果没有配置buttons，则走默认按钮配置,只支持对象形式的参数
					options.model.buttons=buttons;
				}
				var subnav=new Subnav(options);
				this.set("subnav",subnav);
			}
		},
		_initList:function(){
			var defaultOptions={
				parentNode:this.$(".J-list")	
			};
			var options=this.initList(this);
			if(options){
				var params=$.extend(true,defaultOptions,options);
				var compType=options.compType || "grid";
				var Component=cartype[compType];
				var grid=new Component(params);
				this.set("list",grid);
			}
		},
		_initCard:function(){
			var that=this;
			var defaultOptions={
				parentNode:this.$(".J-card")	
			};
			var options=this.initCard(this);
			if(options && typeof options.cancelaction != "function"){
				options.cancelaction=function(){
					that.list2Card(false);
				};
			}
			if(options){
				var params=$.extend(true,defaultOptions,options);
				var comptype=options.compType || "profile";
				var Comp=cartype[comptype];
				var card=new Comp(params);
				this.set("card",card);
			}
		},
		
		initSubnav:function(){},
		
		initList:function(){},
		
		initCard:function(){},
		
		//列表页面和详情页面的相互切换
		list2Card:function(mark){
			if(mark){
				this.$(".J-list,.J-add").addClass("hidden");
				this.$(".J-card,.J-return").removeClass("hidden");
			}else{
				this.$(".J-list,.J-add").removeClass("hidden");
				this.$(".J-card,.J-return").addClass("hidden");
			}
		},
		
		save:function(url,data,callback){
			var that = this;
			var list = this.get("list");
			aw.saveOrUpdate(url, data, function(serverResult){
				var mark=true;
				if(callback){
					var result = callback(serverResult);
					if(result && result.forward==false){
						mark=false;
					}
				}else{
					list.refresh();
				}
				if(mark){
					that.list2Card(false);
				}
			});
		},
		
		edit:function(type,data,callback){
			if(callback){
				callback(data);
			}
			this.get("card").reset();
			this.get("card").setData(data);
			var mark=type=="detail" ? true : false;
			this.get("card").setDisabled(mark);
			this.list2Card(true);
		},
		
		del:function(url,callback){
			var that=this;
			aw.del(url,function(data){
				if(callback){
					callback(data);
				}else{
					that.get("list").refresh();
				}
			});
		},
		
		reverse:function(){
			$(".J-list").addClass("hidden");
			$(".J-card").removeClass("hidden");
			$(".J-add").addClass("hidden");
			$(".J-return").removeClass("hidden");
		}
	});
	module.exports = BaseView;
});