/**
 * 生命关怀统计
 * 
 */
define(function(require, exports, module) {
	var ELView = require("elview");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var aw = require("ajaxwrapper");
	var enmu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	require("../../grid_css.css");
	var template = "<div class='el-funeralservice'>"+
			"<div class='J-subnav'></div>"+
			"<div class='J-grid'></div>" +
			  "</div>"
	var funeralService = ELView
			.extend({
				attrs : {
					template : template,
				},
				initComponent : function(params, widget) {
					var subnav = new Subnav(
							{
								parentNode : ".J-subnav",
								model : {
									title : "生命关怀统计",
									items : [
									         {
									        	 id : "building",
									        	 type : "buttongroup",
									        	 tip : "楼号",
									        	 keyField : "pkBuilding",
									        	 valueField : "name",
									        	 showAll : true,
									        	 showAllFirst : true,
									        	 url : "api/building/query",
									        	 params : function() {
									        		 return {
									        			 "useType" : "Apartment",
									        			 fecthProperties : "pkBuilding,name"
									        		 };
									        	 },
									        	 handler : function(key, element) {
									        		 widget.get("grid")
									        		 .refresh();
									        	 }
									        	 
									         },
									         {
									        	 id : "status",
									        	 type : "buttongroup",
									        	 tip : "状态",
									        	 items : [
									        	          {
									        	        	  key : "Finish",
									        	        	  value : "结束"
									        	          },{
									        	        	  key : "Consult",
									        	        	  value : "咨询"
									        	          },{
									        	        	  key : "Submitted",
									        	        	  value : "已提交"
									        	          },{
									        	        	  key : "Handled",
									        	        	  value : "已办理"
									        	          },{
									        	        	  key : "Consult,Submitted,Handled,Finish",
									        	        	  value : "全部"
									        	          }],
									        	          
									        	          handler : function(key, element) {
									        	        	  widget.get("grid")
									        	        	  .refresh();
									        	          }
									         },{
									        	 id : "time",
									        	 type : "daterange",
									        	 ranges : {
									        		 "本年": [moment().startOf("year"), moment().endOf("year")],
									        		 "去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
									        	 },
									        	 defaultRange : "本年",
									        	 minDate: "1930-05-31",
									        	 maxDate: "2020-12-31",
									        	 handler : function(time){
									        		 widget.get("grid").refresh();
									        	 },
									        	 tip : "咨询日期"
									         },{
									        	 id:"toexcel",
									        	 text:"导出",
									        	 type:"button",
									        	 handler:function(){
									        		 var subnav=widget.get("subnav");
									        		 window.open("api/funeralService/toexcel?member.memberSigning.room.building.pkBuilding="+subnav.getValue("building")+
									        				 "&statusIn="+subnav.getValue("status")+
									        				 "&consultateDate="+subnav.getValue("time").start+
									        				 "&consultateDateEnd="+subnav.getValue("time").end
									        		 );
									        		 return false;
									        	 }
									         }
									         ]
								}
							});
					this.set("subnav", subnav);
					
					var grid = new Grid(
							{
								// autoRender : false,
								parentNode : ".J-grid",
								model : {
									url : "api/funeralService/query",
									params : function() {
										var subnav = widget.get("subnav");
										return {
											"member.memberSigning.room.building.pkBuilding" : subnav.getValue("building"),
											"statusIn" : widget.get("subnav").getValue("status"),
											"consultateDate" : subnav.getValue("time").start,
											"consultateDateEnd" : subnav.getValue("time").end,
											fetchProperties : "pkFuneralService,"+ 
											"member.personalInfo.name,"+ 
											"member.personalInfo.sex,"+ 
											"member.personalInfo.birthday,"+ 
											"member.personalInfo.phone,"+
											"member.memberSigning.room.number,"+ 
											"member.personalInfo.idNumber,"+ 
											"status.value,"+ 
											"consultateDate,"+
											"description,"+ 
											"member.pkMember,"+ 
											"deceasedRegister.deceasedDate,"+ 
											"version"
										};
									},
									isInitPageBar : false,
									columns : [
									           {
									        	   name : "member",
									        	   label : "会员姓名",
									        	   format : function(row, value) {
									        		   return value.member.memberSigning.room.number
									        		   + "  "
									        		   + value.member.personalInfo.name;
									        	   },
									        	   className:"oneHalfColumn",
									           
									           },{
									        	   name : "member.personalInfo.sex.value",
									        	   label : "性别",
									        	   className:"oneColumn",
									           },{
									        	   name : "member.personalInfo.birthday",
									        	   label : "年龄",
									        	   format : "age",
									        	   className:"oneColumn",
									           },{
									        	   name : "consultateDate",
									        	   label : "咨询日期",
									        	   format : "date",
									        	   className:"oneHalfColumn",
									           },{
									        	   name : "deceasedRegister.deceasedDate",
									        	   label : "过世日期",
									        	   format : "date",
									        	   className:"oneHalfColumn",
									           },{
									        	   name : "status.value",
									        	   label : "状态",
								        		   className:"oneHalfColumn",
									           },{
									        	   name : "description",
									        	   label : "备注",
									        	   className:"twoColumn",
									           }
									           ]
								}
							});
					this.set("grid", grid);
					
					
				},

			});
	module.exports = funeralService;
});