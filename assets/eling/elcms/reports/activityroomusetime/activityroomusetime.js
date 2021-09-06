/*
 * 活动室使用情况统计
 */
define(function(require, exports, module) {
	var ELView = require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav");
	var Wizard = require("wizard");
	var Grid = require("grid");
	var Form = require("form");
	var Dialog = require("dialog");
	var enmu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Tab = require("tab");
	require("echarts");
	var template = require("./assets/activityroomusetime.tpl");
//	var template = "<div class='J-subnav'></div>"+
//		"<div class = 'actRUse_echart'>"+
//		"<div id='actRUse_tab'></div>"+	
//		"</div>";
	
	var UseTimeView = require("./assets/usetime_echart");
	
	var years=[];
	for(var i=-5;i<=0;i++){
		years.push({
			key:moment().add(i,'year').year(),
			value:moment().add(i,'year').year()
		});
	}
	for(var i=1;i<=5;i++){
		years.push({
			key:moment().add(i,'year').year(),
			value:moment().add(i,'year').year()
		});
	}
	var months=[{
		key:01,value:"一月"
	},{
		key:02,value:"二月"
	},{
		key:03,value:"三月"
	},{
		key:04,value:"四月"
	},{
		key:05,value:"五月"
	},{
		key:06,value:"六月"
	},{
		key:07,value:"七月"
	},{
		key:08,value:"八月"
	},{
		key:09,value:"九月"
	},{
		key:10,value:"十月"
	},{
		key:11,value:"十一月"
	},{
		key:12,value:"十二月"
	}];

	var activityroomusetime = ELView.extend({
		attrs : {
			template : template
		},
		events:{
		},
		initComponent : function(params,widget) {
			var subnav = new Subnav({
        		parentNode:".J-subnav",
				model : {
					title:"活动室使用情况统计",
					items : [{
						id:"timey",
						type:"buttongroup",
						tip:"年份",
						items : years,
						handler:function(key,element){
							widget.get("usetime").refreshData(widget);
						}
					},{
						id:"timem",
						type:"buttongroup",
						tip:"月份",
						items : months,
						handler:function(key,element){
							widget.get("usetime").refreshData(widget);
						}
					}]
				}

        	});
			this.set("subnav", subnav);
			
			
			
			var usetime = new UseTimeView({
				parentNode : ".actRUse_echart",
			});
			usetime.render();
			this.set("usetime",usetime);
		},
		
		afterInitComponent:function(params,widget){
			$("body").addClass("main-nav-closed").removeClass("main-nav-opened");
			widget.get("subnav").setValue("timey",moment().year());
			widget.get("subnav").setValue("timem",moment().month()+1);
			widget.get("usetime").refreshData(widget);
        },
	});
	module.exports = activityroomusetime;
});
