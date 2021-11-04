define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0");
    var aw = require("ajaxwrapper");
	var Activity = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"暂住审批",
					buttonGroup:[{
						id:"building",
						tip:"楼宇",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"flowStatusIn",
						tip:"状态",
						items:[{
							key:"Submit,Approvaling,Approval,Reject",
							value:"全部"
						},{
							key:"Submit,Approvaling",
							value:"审批中"
						},{
							key:"Approval,Reject",
							value:"已审批"
						}],
						handler:function(key,element){
							widget.get("params");
							widget.get("list").refresh();
						}
					}],
					buttons:[{
						id:"rebut",
						text:"驳回",
						handler:function(){
							var approveStatus=widget.get("subnav").getValue("flowStatusIn");
							if(approveStatus=="Approval,Reject"){
								Dialog.alert({
									content:"已审批的申请不能修改！"
								});
								widget.get("list").refresh();
							}else{
								var old=widget.get("list").getSelectedData();
								var pks="";
	                         	for(var i=0; i<old.length;i++){
	                         		pks+=old[i].pkShackApply+",";
	                         	}
	                            aw.ajax({
	                            	url : "api/shackapply/rebut",
	                                type : "POST",
	                                data : {
	                               	 	pk:pks,
	                                },
	                               success : function(data){
	                            	   if(data.msg){
	                            		   Dialog.tip({
	                            			   title:data.msg
	                            		   });
	                            	   }
	                            	   widget.get("list").refresh({
	                            		   pkShackApplyIn:pks,
	                            	   });
	                                }
	                            });
							}
					
						
						}
					},{
						id:"approval",
						text:"审批",
						handler:function(){
							var approveStatus=widget.get("subnav").getValue("flowStatusIn");
							if(approveStatus=="Approval,Reject"){
								Dialog.alert({
									content:"已审批的申请不能修改！"
								});
								 widget.get("list").refresh();
							}else{
								var old=widget.get("list").getSelectedData();
								var pks="";
	                         	for(var i=0; i<old.length;i++){
	                         		pks+=old[i].pkShackApply+",";
	                         	}
	                            aw.ajax({
	                                url : "api/shackapply/approval",
	                                type : "POST",
	                                data : {
	                               	 	pk:pks,
	                                },
	                               success : function(data){
	                            	   if(data.msg){
	                            		   Dialog.tip({
	                            			   title:data.msg
											});
	                            	   }
	                            	   widget.get("list").refresh({
	                            		   pkShackApplyIn:pks,
	                            	   });
	                                }
	                            });
							}
						}
					}],
					 time:{
						 	tip:"开始日期",
						 	ranges:{
						 		"本月": [moment().startOf("month"), moment().endOf("month")],
						 		"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
								"半年内": [moment().subtract("month", 6).startOf("days"),moment().endOf("days")],
								},
							defaultTime:"本月",
	        				click:function(time){
	        					widget.get("list").refresh();
							}
						}
				}
			};
		},
		initList:function(widget){
			return{
				url:"api/shackapply/query",
				fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name",
				params:function(){
					var subnav=widget.get("subnav");
					var time = subnav.getValue("time");
					return {
						"member.memberSigning.room.building":subnav.getValue("building"),
						//datetime:subnav.getValue("datetime"),
						nowDate:time.start,
    					nowDateEnd:time.end,
						flowStatusIn:subnav.getValue("flowStatusIn"),
						//pkShackApply:pkShackApply
					};
					
				},
				autoRender:false,
				model:{
					isCheckbox:true,
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"date",
						name:"开始日期",
						format:"date"
					},{
						key:"endDate",
						name:"结束日期",
						format:"date"
					},{
						key:"number",
						name:"人数",
					},{
						key:"nexus",
						name:"与"+i18ns.get("sale_ship_owner","会员")+"关系"
					},{
						key:"description",
						name:"备注"
					},{
						key:"status",
						name:"暂住状态",
						format:function(value,row){
							if(value.key == 'Postpone'){
								return value.value;
							}else if(value.key == 'Finish'){
								return value.value;
							}else if(value.key == 'Approval'){
								return "暂住";
							}else{
								return "";
							}
						}
					},{
						key:"flowStatus.value",
						name:"审批状态"
					}]
				}
			};
		},
		 afterInitComponent:function(params,widget){
			// var params=widget.get("params");
				var pkShackApply =null;
				if(params!=null){
					pkShackApply=params.shackapply;
				}	
			 var subnav=widget.get("subnav");
			 var time = subnav.getValue("time");
			 widget.get("list").refresh({
				 	"member.memberSigning.room.building":subnav.getValue("building"),
//					datetime:subnav.getValue("datetime"),
				 	nowDate:time.start,
					nowDateEnd:time.end,
					flowStatusIn:subnav.getValue("flowStatusIn"),
					pkShackApply:pkShackApply
			 })
    	 }
	});
	module.exports = Activity;
});