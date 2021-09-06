/**
 * 会员身份证汇总
 * chenJF
 */
define(function(require,exports,module){
	var ELView =require("elview");
	var aw = require("ajaxwrapper");
	var Subnav=require("subnav");
	var Grid = require("grid");
	var enums  = require("enums");
//	require("././grid.css");
	var template="<div class = 'el-memberidentificationsummary'>"+
	 "<div class = 'J-subnav'></div>"+
	 "<div class = 'J-grid'></div>"+
	 "</div>";
	var memberidentificationsummary=ELView.extend({
		attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员身份证名单汇总",
					items:[{
						id : "building",
						type : "buttongroup",
						tip : "楼宇",
						keyField : "pkBuilding",
						valueField : "name",
						url : "api/building/query",
						showAll : true,
						showAllFirst : true,
						params : function(){
							return {
								"useType":"Apartment",
								fecthProperties:"pkBuilding,name"
							};
						},
						handler:function(){
							widget.get("grid").refresh();
						}
					},{
						id : "memberState",
						type : "buttongroup",
						tip : "会员状态",
						showAll : true,
						items : enums["com.eling.elcms.member.model.Member.Status"],
						handler : function(time){
							widget.get("grid").refresh();
						},
					},{
						id : "checkInDate",
						type : "daterange",
						tip : "入住时间",
						ranges : {
							"本月": [moment().startOf("month"), moment().endOf("month")],
							"最近一年": [moment().subtract(11, 'month').startOf('month'),moment().endOf('month')],
						},
						defaultRange : "最近一年",
						handler : function(time){
							widget.get("grid").refresh();
						},
					},{
						id : "toExcel",
						type : "button",
						text : "导出",
						handler : function(time){
							var subnav=widget.get("subnav");
 							window.open("api/memberidentificationsummary/toexcel?building="+subnav.getValue("building")+
 									"&start="+subnav.getValue("checkInDate").start+
 									"&end="+subnav.getValue("checkInDate").end+
 									"&memberState="+subnav.getValue("memberState")
 							);
 							return false;
						},
					}]
				}
        	});
        	this.set("subnav",subnav);
        	
        	var grid = new Grid({
        		parentNode:".J-grid",
				model : {
					url : "api/memberidentificationsummary/query",
					params:function(){
						 var subnav=widget.get("subnav");
						 return { 
							 "start" : subnav.getValue("checkInDate").start,
							 "end" : subnav.getValue("checkInDate").end,
							 "building" : subnav.getValue("building"),
							 "memberState" : subnav.getValue("memberState"),
						 }
					},
					columns : [{
						name : "building",
                        label : "楼号",
                        className : "grid_10",
					},{
						name : "roomNumber",
                        label : "房间号",
                        className : "grid_10",
					},{
						name : "checkInDate",
                        label : "入住时间",
                        format : "date",
                        className : "grid_10",
					},{
						name : "name",
                        label : "姓名",
                        className : "grid_10",
					},{
						name : "memberState",
                        label : "会员状态",
                        className : "grid_10",
					},{
						name : "sex",
                        label : "性别",
                        className : "grid_10",
					},{
						name : "age",
                        label : "年龄",
                        className : "grid_10",
					},{
						name : "birYear",
                        label : "年",
                        className : "grid_10",
					},{
						name : "birMonth",
                        label : "月",
                        className : "grid_10",
					},{
						name : "birDay",
                        label : "日",
                        className : "grid_10",
					},{
						name : "idNumber",
                        label : "证件号码",
                        className : "grid_20",
					},{
						name : "origin",
                        label : "籍贯",
                        className : "grid_10",
					},{
						name : "shanghaiOrigin",
                        label : "沪籍",
                        className : "grid_10",
					}]
				}
        	});
        	this.set("grid",grid);
        }
	});
	module.exports = memberidentificationsummary;
})