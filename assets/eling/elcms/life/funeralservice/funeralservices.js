/**
 * 生命关怀(殡葬服务)
 * 
 */
define(function(require, exports, module) {
	var ELView = require("elview");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var Form = require("form");
	var aw = require("ajaxwrapper");
	var enmu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	var template = "<div class='el-funeralservice'>"+ 
	"<div class='J-subnav'></div>" + 
	"<div class='J-grid'></div>"+ 
	"<div class='J-form hidden'></div>" + 
	"</div>"
	var funeralService = ELView.extend({
		  events:{
			  "click .J-forShort-detail":function(ele){
				  var widget = this;
				  var grid =this.get("grid");
				  var subnav= this.get("subnav");
  				  var index = grid.getIndex(ele.target);
  				  var data = grid.getData(index);
  				  var form1= this.get("form");
  				  form1.setData(data);
				  form1.setDisabled(true);
				  subnav.show([ "return" ]).hide(["search","add","time","building","status" ]);
				  this.hide(".J-grid").show(".J-form");
				    form1.setValue("sex",data.member.personalInfo.sex.key);
					form1.setValue("age",moment().diff(data.member.personalInfo.birthday,'years'));
					form1.setValue("phone",data.member.personalInfo.phone);
					
					form1.setValue("idNumber",data.member.personalInfo.idNumber);
					form1.setValue("description",data.description);
					if(data.deceasedRegister!=null){
						form1.setValue("deceased",data.deceasedRegister.deceasedDate);
						 }
			  },			  
		  },
		attrs : {
			template : template,
		},
                 initComponent : function(params, widget) {
					var subnav = new Subnav({
						parentNode : ".J-subnav",
						model : {
							title : "生命关怀(殡葬)",
							items : [{
								id : "search",
								type : "search",
								placeholder : "会员/房间号",
								handler : function(str) {
									var g = widget.get("grid");
									var subnav = widget.get("subnav");
									g.loading();
									aw.ajax({
										url : "api/funeralService/search",
										data : {
											s : str,
											searchProperties : "member.personalInfo.name,member.memberSigning.room.number",
											fetchProperties : "pkFuneralService,"+ 
											"member.personalInfo.name,"+ 
											"member.memberSigning.room.number,"+ 
											"member.personalInfo.sex,"+ 
											"member.personalInfo.birthday,"+ 
											"member.personalInfo.phone,"+ 
											"member.memberSigning.room.number,"+ 
											"status,"+ 
											"consultateDate,"+ 
											"member.pkMember,"+ 
											"deceasedRegister.deceasedDate,"+
											"deceasedRegister.FlowStatus"+ 
											"version"
										},
										dataType : "json",
										success : function(data) {
											g.setData(data);
										}
									});
								}
							},{
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
								
							},{
								id : "status",
								type : "buttongroup",
								tip : "状态",
								items : [
								         {
								        	 key : "Consult,Submitted,Handled,Finish",
								        	 value : "全部"
								         }, {
								        	 key : "Consult",
								        	 value : "咨询"
								         }, {
								        	 key : "Submitted",
								        	 value : "已提交"
								         }, {
								        	 key : "Handled",
								        	 value : "已办理"
								         }, {
								        	 key : "Finish",
								        	 value : "结束"
								         } ],
								         
								         handler : function(key, element) {
								        	 widget.get("grid")
								        	 .refresh();
								         }
							},{
								tip : "时间",
								id : "time",
								type : "daterange",
								ranges : {
									"今天" : [moment().startOf("days"),
									        moment().endOf("days") ],
									        "本周" : [moment().startOf("week"),
									                moment().endOf("week") ],
									                "本月" : [moment().startOf("month"),
									                        moment().endOf("month") ],
								},
								defaultRange : "本月",
								minDate : "1930-05-31",
								maxDate : "2020-12-31",
								handler : function(time) {
									widget.get("grid").refresh();
								}
							},{
								id : "add",
								text : "新增",
								type : "button",
								show : true,
								handler : function() {
									var subnav = widget.get("subnav");
									var form = widget.get("form");
									
									widget.show([ ".J-form" ]).hide([ ".J-grid" ]);
									subnav.hide([ "add", "time","status","building","search" ]).show([ "return" ]);
									form.reset();
								}
							},{
								id : "return",
								text : "返回",
								type : "button",
								show : false,
								handler : function() {
									var subnav = widget.get("subnav");
									widget.hide([ ".J-form" ]).show([ ".J-grid" ]);
									subnav.hide([ "return" ]).show(["add","time","status","building","search" ]);
								}
							} ]
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
											"processor.pkUser,"+
											"processor.name,"+
											"version"
										};
									},
									columns : [
									           {
									        	   name : "member",
									        	   label : "姓名",
									        	   format : function(row, value) {
									        		   return "<a href='javascript:void(0);' style='color:red;' class='J-forShort-detail'  >" +value.member.memberSigning.room.number+ "  "+ value.member.personalInfo.name+"</a>";
									        	   }
									           },{
									        	   name : "member.personalInfo.sex.value",
									        	   label : "性别",
									        	   
									           },{
									        	   name : "member.personalInfo.birthday",
									        	   label : "年龄",
									        	   format : "age",
									        	   
									           },{
									        	   name : "member.personalInfo.phone",
									        	   label : "联系电话",
									           },{
									        	   name : "status.value",
									        	   label : "状态",
									        	   // type:"select",
									           },{
									        	   name : "consultateDate",
									        	   label : "咨询日期",
									        	   format : "date",
									           },{
									        	   name : "deceasedRegister.deceasedDate",
									        	   label : "过世日期",
									        	   format : "date",
									           },{
									        	   name : "operate",
									        	   label : "操作",
									        	   format : "button",
									        	   formatparams : [
									        	                   {
									        	                	   id : "edit",
									        	                	   text : "修改",
									        	                	   show : function(value, row) {
									        	                		   if (row.status.key == 'Consult') {
									        	                			   return true;
									        	                		   } else {
									        	                			   return false;
									        	                		   }
									        	                	   },
									        	                	   handler : function(index,data,rowEle) {
									        	                		   var form = widget.get("form");
									        	                		   
									        	                		   form.reset();
									        	                		   form.setData(data);
									        	                		   form.setValue("edit","yes");
									        	                		   form.setValue("sex",data.member.personalInfo.sex.key);
									        	                		   form.setValue("age",moment().diff(data.member.personalInfo.birthday,'years'));
									        	                		   form.setValue("phone",data.member.personalInfo.phone);
																		   form.setValue("idNumber",data.member.personalInfo.idNumber);
									        	                		   form.setValue("description",data.description);
									        	                		   if(data.deceasedRegister!=null){
																			form.setValue("deceased",data.deceasedRegister.deceasedDate);
																			form.setValue("deceasedRegister",data.deceasedRegister.pkDeceasedMemberRegistration);
																				}
									        	                		   widget.hide(".J-grid").show(".J-form");
									        	                		   widget.get(	"subnav").show([ "return" ]).hide(["search","add","time","building","status" ]);
									        	                	   }
									        	                   },{
									        	                	   id : "delete",
									        	                	   text : "删除",
									        	                	   show : function(value, row) {
									        	                		   if (row.status.key == 'Consult') {
									        	                			   return true;
									        	                		   } else {
									        	                			   return false;
									        	                		   }
									        	                	   },
									        	                	   handler : function(index,data,rowEle) {
									        	                		   aw.del("api/funeralService/"+ data.pkFuneralService+ "/delete",
									        	                				   function() {
									        	                			   widget.get("grid").refresh();
									        	                		   });
									        	                	   }
									        	                   },{
									        	                	   id : "commit",
									        	                	   text : "提交",
									        	                	   show : function(value, row) {
									        	                		   if (row.status.key == 'Consult') {
									        	                			   return true;
									        	                		   } else {
									        	                			   return false;
									        	                		   }
									        	                	   },
									        	                	   handler : function(index,data,rowEle) {
									        	                		   Dialog.confirm({
									        	                			   title : "提示",
									        	                			   content : "是否提交？",
									        	                			   confirm : function() {
									        	                				   aw.ajax({
									        	                					   url : "api/funeralService/save",
									        	                					   data : {
									        	                						   status : "Submitted",
									        	                						   pkFuneralService : data.pkFuneralService,
									        	                						   version : data.version
									        	                					   },
									        	                					   dataType : "json",
									        	                					   success : function(data) {
									        	                						   widget.get("grid").refresh();
									        	                					   }
									        	                				   });
									        	                			   }
									        	                		   })
									        	                	   }
									        	                   },{
									        	                	   id : "withdraw",
									        	                	   text : "收回",
									        	                	   show : function(value, row) {
									        	                		   if (row.status.key == 'Submitted'
									        	                			   || row.status.key == 'Handled') {
									        	                			   return true;
									        	                		   } else {
									        	                			   return false;
									        	                		   }
									        	                	   },
									        	                	   handler : function(index,data,rowEle) {
									        	                		   Dialog.confirm({
									        	                			   title : "提示",
									        	                			   content : "是否收回？",
									        	                			   confirm : function() {
									        	                				   aw.ajax({
									        	                					   url : "api/funeralService/save",
									        	                					   data : {
									        	                						   status : "Consult",
									        	                						   pkFuneralService : data.pkFuneralService,
									        	                						   version : data.version
									        	                					   },
									        	                					   dataType : "json",
									        	                					   success : function(data) {
									        	                						   widget.get("grid").refresh();
									        	                					   }
									        	                				   });
									        	                			   }
									        	                		   })
									        	                	   }
									        	                   },
									        	                   {
									        	                	   id : "handle",
									        	                	   text : "办理",
									        	                	   show : function(value, row) {
									        	                		   
									        	                		   if (row.status.key == 'Submitted') {
									        	                			   return true;
									        	                		   } else {
									        	                			   return false;
									        	                		   }
									        	                	   },
									        	                	   handler : function(index,data,rowEle) {
									        	                		   Dialog.confirm({
									        	                			   title : "提示",
									        	                			   content : "是否办理？",
									        	                			   confirm : function() {
									        	                				   aw.ajax({
									        	                					   url : "api/funeralService/save",
									        	                					   data : {
									        	                						   status : "Handled",
									        	                						   pkFuneralService : data.pkFuneralService,
									        	                						   version : data.version
									        	                					   },
									        	                					   dataType : "json",
									        	                					   success : function(data) {
									        	                						   widget.get("grid").refresh();
									        	                					   }
									        	                				   });
									        	                			   }
									        	                		   })
									        	                	   }
									        	                	   
									        	                   },{
									        	                	   id : "finish",
									        	                	   text : "结束",
									        	                	   show : function(value, row) {
									        	                		   if (row.status.key == 'Handled') {
									        	                			   return true;
									        	                		   } else {
									        	                			   return false;
									        	                		   }
									        	                	   },
									        	                	   handler : function(index,data,rowEle) {
									        	                		   if (data.deceasedRegister!=null) {
									        	                			   Dialog.confirm({
									        	                				   title : "提示",
									        	                				   content : "是否结束？",
									        	                				   confirm : function() {
									        	                					   aw.ajax({
									        	                						   url : "api/funeralService/save",
									        	                						   data : {
									        	                							   status : "Finish",
									        	                							   pkFuneralService : data.pkFuneralService,
									        	                							   version : data.version
									        	                						   },
									        	                						   dataType : "json",
									        	                						   success : function(data) {
									        	                							   widget.get("grid").refresh();
									        	                						   }
									        	                					   });
									        	                				   }
									        	                			   });
									        	                		   }else  {
									        	                			   Dialog.alert({
									        	                				   title : "提示",
									        	                				   content : "未过世的会员不能执行此操作",
									        	                				   confirm : function() {
									        	                				   }
									        	                			   
									        	                			   });
									        	                		   }
									        	                		   
									        	                		   
									        	                	   }
									        	                   } ]
									           } ]
								}
							});
					this.set("grid", grid);
					
					var form = new Form(
							{
								parentNode : ".J-form",
								saveaction : function() {
									var member = form.getValue("member");
									if(member){
										aw.saveOrUpdate("api/funeralService/save",aw.customParam(form.getData()),function(data){
											widget.show([".J-grid"]).hide([".J-form"]);
											widget.get("subnav").hide(["return"]).show(["search","add","building","status","time"]);
											widget.get("grid").refresh();
										});
									}else{
										Dialog.alert({
											content : "请选择会员！！",
										});
					    				return false;
									}
									
								},
								cancelaction : function() {
									widget.get("subnav").hide([ "return" ]).show([ "time", "status","building", "add","search" ]);
									widget.hide(".J-form").show(".J-grid");
								},
								model : {
									id : "form",
									items : [
									         {
									        	 name : "pkFuneralService",
									        	 type : "hidden",
									         },{
									        	 name : "version",
									        	 type : "hidden",
									        	 defaultValue : 0
									        	 
									         },{
									        	 name : "member",
									        	 label : "姓名",
									        	 type : "autocomplete",
									        	 url : "api/member/searchByName",
									        	 keyField : "pkMember",
									        	 queryParamName : "s",
									        	 useCache : false,
									        	 maxItemsToShow : 10,
									        	 params : function() {
									        		 return {
									        			 "memberSigning.status":"Normal",
									        			 searchProperties : "personalInfo.name",
									        			 fetchProperties : "personalInfo.pkPersonalInfo,"+ 
									        			 "personalInfo.name,"+
									        			 "personalInfo.sex,"+ 
									        			 "personalInfo.birthdayString,"+ 
									        			 "personalInfo.idNumber,"+ 
									        			 "personalInfo.phone,"+
									        			 "pkMember,"+ 
									        			 "memberSigning.room.number,"+
									        			//新增查询会员签约pk
									        			 "memberSigning.status."
									        		 }
									        	 },
									        	 format : function(data) {//格式化返回的结果
									        		 if (data != null) {
									        			 return data.memberSigning.room.number+ "  "+ data.personalInfo.name;
									        		 }
									        	 },
									        	 onItemSelect : function(data) {//选择结果后的触发事件
									        		 if (data) {
									        			 form.setValue("sex",data.personalInfo.sex.key);
									        			 form.setValue("age",moment().diff(data.personalInfo.birthdayString,'years'));
									        			 form.setValue("idNumber",data.personalInfo.idNumber);
									        			 form.setValue("phone",data.personalInfo.phone);
									        			 form.setValue("description",data.description);
									        		 }
									        		 aw.ajax({
									        			 url : "api/memberDeceases/query",
									        			 data : {
									        				 "member.pkMember" : data.pkMember,
									        				 flowStatus : "Confirm",
									        				 fetchProperties : "member.pkMember,"+ 
									        				 "deceasedDate,"+ 
									        				 "pkDeceasedMemberRegistration"
									        			 },
									        			 dataType : "json",
									        			 success : function(data) {
									        				 if (data.length !== 0) {
									        					 form.setValue("deceased",data[0].deceasedDate);
									        					 form.setValue("deceasedRegister",data[0].pkDeceasedMemberRegistration);
									        				 }
									        			 }
									        		 });
									        	 },
									        	 validate : [ "required" ],
									         },{
									        	 name : "sex",
									        	 label : "性别",
									        	 type : "select",
									        	 options : [ {
									        		 key : "MALE",
									        		 value : "男"
									        	 }, {
									        		 key : "FEMALE",
									        		 value : "女"
									        	 } ],
									        	 readonly : "true"
									         },{
									        	 name : "age",
									        	 label : "年龄",
									        	 readonly : "true"
									        		 //format:"age"
									         },{
									        	 name : "idNumber",
									        	 label : "证件号",
									        	 readonly : "true"
									         },{
									        	 name : "phone",
									        	 label : "联系电话",
									        	 readonly : "true"
									         },{
									        	 name : "status",
									        	 label : "状态",
									        	 defaultValue : "Consult",
									        	 type : "select",
									        	 options : [ {
									        		 key : "Consult",
									        		 value : "咨询"
									        	 }, {
									        		 key : "Submitted",
									        		 value : "已提交"
									        	 }, {
									        		 key : "Handled",
									        		 value : "已办理"
									        	 }, {
									        		 key : "Finish",
									        		 value : "结束"
									        	 } ],
									        	 readonly : "true"
									         },{
									        	 name : "consultateDate",
									        	 label : "咨询日期",
									        	 type : "date",
									        	 defaultDate : new Date()
									         },{
									        	 name : "deceasedRegister",
									        	 label : "过世日期",
									        	 type : "hidden"
									         },{
									        	 name : "edit",
									        	 type : "hidden"
									         },
									         
									         {
									        	 name : "deceased",
									        	 label : "过世日期",
									        	 type : "date",
									        	 mode : "YYYY-MM-DD",
									        	 readonly : "true"
									         },{
									        	 name : "processor",
									        	 label : "处理人",
									        	 type : "select",
									        	 keyField : "pkUser",
									        	 valueField : "name",
									        	 options : [ activeUser ],
									        	 defaultValue : activeUser.pkUser
									        	 + "",
									        	 readonly : "true"
									        		 
									         }, {
									        	 name : "processDate",
									        	 label : "处理时间",
									        	 readonly : true,
									        	 type : "date",
									        	 defaultDate : new Date(),
									        	 readonly : "true"
									        		 //defaultValue:moment()
									         }, {
									        	 name : "description",
									        	 label : "备注",
									        	 type : "textarea",
									         } ]
								}
							});
					this.set("form", form);
				},
			});
	module.exports = funeralService;
});