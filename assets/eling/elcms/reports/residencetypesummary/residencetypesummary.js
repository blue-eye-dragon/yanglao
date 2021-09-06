/**
 * 老年公寓集体户口和独立户口名单
 * wulina
 */
define(function(require,exports,module){
	var ELView =require("elview");
	var aw = require("ajaxwrapper");
	var Subnav=require("subnav");
	var Grid = require("grid");
	var enums  = require("enums");

	require("../../grid_css.css");
	
	var template="<div class = 'el-residencetypesummary'>"+
	 "<div class = 'J-subnav'></div>"+
	 "<div class = 'J-grid'></div>"+
	 "</div>";
	var residencetypesummary=ELView.extend({
		attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"老年公寓集体户口和独立户口名单",
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
						id : "type",
						type : "buttongroup",
						tip : "户口类型",
						showAll : true,
						items : [{
							key : "true",
							value : "独立户口"
						},{
							key : "false",
							value : "集体户口"
						}],
						handler : function(time){
							widget.get("grid").refresh();
						},
					},{
						id : "toExcel",
						type : "button",
						text : "导出",
						handler : function(time){
							var subnav=widget.get("subnav");
 							window.open("api/residencetypesummary/toexcel?building="+subnav.getValue("building")+
 									"&type="+subnav.getValue("type")+
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
					url : "api/residencetypesummary/query",
					params:function(){
						 var subnav=widget.get("subnav");
						 return { 
							 "type" : subnav.getValue("type"),
							 "building" : subnav.getValue("building"),
							 "memberState" : subnav.getValue("memberState"),
						 }
					},
					columns : [{
						name : "building",
                        label : "楼号",
                        className : "oneColumn",
					},{
						name : "roomNumber",
                        label : "房间号",
                        className : "oneColumn",
					},{
						name : "name",
                        label : "会员姓名",
                        className : "oneColumn",
					},{
						name : "memberState",
                        label : "会员状态",
                        className : "oneColumn",
					},{
						name : "residenceType",
                        label : "户口类型",
                        className : "oneColumn",
					},{
						name : "sex",
                        label : "性别",
                        className : "halfColumn",
					},{
						name : "age",
                        label : "年龄",
                        className : "halfColumn",
					},{
						name : "idNumber",
                        label : "证件号码",
                        className : "oneHalfColumn",
					},{
						name : "checkInDate",
                        label : "登记日期",
                        format : "date",
                        className : "oneColumn",
					},{
						name : "contact",
                        label : "联系人",
                        className : "oneColumn",
					},{
						name : "relation",
                        label : "关系",
                        className : "oneColumn",
					},{
						name : "telephone",
                        label : "电话",
                        className : "oneHalfColumn",
					}]
				}
        	});
        	this.set("grid",grid);
        }
	});
	module.exports = residencetypesummary;
})