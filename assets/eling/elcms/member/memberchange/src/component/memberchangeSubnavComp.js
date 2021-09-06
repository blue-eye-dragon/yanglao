
define(function(require, exports, module) {
	var Subnav = require("subnav");
	var aw = require("ajaxwrapper");
	var props = require("../constant/memberchangeProps");
	var enums  = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog=require("dialog");
	var memsleepsensor_subnav = {
			init:function(params,widget){
					var subnav=new Subnav({
						parentNode:".J-subnav",
						model : {
								title:"会员变更管理",
								items : [{
									id : "search",
									type : "search",						
									placeholder : "会籍卡/房间/身份证",
									handler : function(data){
										var grid = widget.get("grid");
										aw.ajax({
											url:"api/memberchange/search",
											data:{
												str:data,
												searchProperties:props.getProperties("searchProperties"),
												fetchProperties:props.getProperties("fetchProperties")
											},
											dataType:"json",
											success:function(data){									
												grid.setData(data);
											}
										});						
									}
								},{
									id:"status",
									type:"buttongroup",
									all:{
										show:true,
										first:true
									},
									tip:"状态",
									items:enums["com.eling.elcms.member.model.ChangeMember.Status"],
									handler:function(key,element){
										widget.get("grid").refresh();
									}
								},{
						            id: "time",
						            type: "daterange",
						            tip: "变更日期",
						            ranges: {
						                "一年内": [moment().subtract(1, 'year').startOf("day"), moment().endOf("days")],
						                "一月内": [moment().subtract(1, 'month').startOf("day"), moment().endOf("days")]
						            },
						            defaultRange: "一年内",
						            minDate: "1930-05-31",
						            maxDate: "2020-12-31",
						            handler: function(time) {
						            	widget.get("grid").refresh();
						            },
								},{
									id:"save",
									type:"button",
									text:"保存",
									show:false,
									handler:function(key,element){
										var data ={};
										var form =  widget.get("form");
										data=form.getData();
										var membergrid = widget.get("membergrid");
										var list = membergrid.getData();
										var memberFlag =true;
										var changeFlag = true;
										//校验
										for ( var i in list) {
											var  item =list[i];
											if(item.member){
												item.member=item.member.pkMember;
												memberFlag = false;
											}
											
											if(item.assessmentDetail){
												item.assessmentDetail = item.assessmentDetail.pkMemberAssessmentDetail;
												changeFlag = false;
											}
										}
										if(changeFlag){
											Dialog.alert({
												content:"没有要变更的会员！"
											})
											return
										}
										if(!form.getValue("newCheckInDate")){
											Dialog.alert({
												content:"请输入新入住时间！"
											})
											return
										}
										data.list = list;
										
										Dialog.alert({
    										title:"提示",
    										showBtn:false,
    										content:"正在处理，请稍后……"
    									});
										
										aw.ajax({
											url:"api/changemember/saveall",
											data:aw.customParam(data),
											dataType:"json",
											success:function(data){									
												props.list2Card(widget,false);
												 widget.get("grid").refresh();
												 Dialog.close();
											},
											error:function(data){									
												 Dialog.close();
											}
										})
										
									}
								},{
									id:"return",
									type:"button",
									text:"返回",
									show:false,
									handler:function(key,element){
										props.list2Card(widget,false);
									}
								},{
									id:"add",
									type:"button",
									text:"新增",
									handler:function(key,element){
										widget.get("form").reset();
										widget.get("membergrid").get("model").allowEdit=true;
										widget.get("membergrid").setData([]);
										props.list2Card(widget,true);
									}
								}]
						}
					});
					return subnav;
			 }
	}
	module.exports = memsleepsensor_subnav;
});