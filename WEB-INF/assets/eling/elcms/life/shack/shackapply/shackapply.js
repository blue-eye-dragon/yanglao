define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
	
	var ShackApply = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"暂住申请",
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){ 
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					},{
		   			 id:"flowStatusIn",
						items:[{
							value:"全部"
						},{
							key:"Init",
							value:"初始状态"
						},{
							key:"Submit",
							value:"提交"
						},{
							key:"Approvaling",
							value:"审批中"
						},{
							key:"Approval",
							value:"通过"
						},{
							key:"Reject",
							value:"驳回"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						
						}
					}],
					 time:{
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
			return {
				autoRender:false,
				url : "api/shackapply/query",
				fetchProperties:"*,member.personalInfo.name,member.personalInfo.pkPersonalInfo,member.memberSigning.room.number",
				params:function(){
					var subnav=widget.get("subnav");
					var time = subnav.getValue("time");
					return {
						flowStatusIn:subnav.getValue("flowStatusIn"),
						nowDate:time.start,
    					nowDateEnd:time.end,
						"member.memberSigning.room.building":subnav.getValue("building")
					};
				},
				model:{
					columns:[{
 						key:"member.personalInfo.name",
 						name:"会员",
 						format:"detail",
 						formatparams:[{
 							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
							}
 						}]
 					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"date",
						name:"开始日期 ",
						format:"date"
					},{
						key:"endDate",
						name:"结束日期 ",
						format:"date"
					},{
						key:"nowDate",
						name:"申请日期 ",
						format:"date"
					},{
						key:"number",
						name:"人数"
					},{
						key:"nexus",
						name:"与会员关系",
						
					},{
						key:"description",
						name:"备注"
					},{
 						key:"flowStatus.value",
 						name:"状态"
 					},{

						key:"operate",
						name:"操作",
						format:function(value,row){
							if(row.flowStatus.key=="Init"){
								return "button";
							}else{
								return "";
							}   
 						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								data.roomnumber=data.member.memberSigning.room.number;
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/shackapply/" + data.pkShackApply + "/delete");
							}
						},{
							key:"submit",
							text:"提交",
							handler:function(index,data,rowEle){
		                            aw.ajax({
		                                url : "api/shackapply/submit",
		                                type : "POST",
		                                data : {
		                                	pkShackApply:data.pkShackApply, 
		                                    version:data.version
		                                },
		                               success : function(data){
		                            	   widget.get("list").refresh({
		                            		   pkShackApply:data.pkShackApply
		                            		   });
		                                }
		                            });
							}
						}]
					
 					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					var data=$("#shackapply").serializeArray();
					var Date2 = moment(data[4].value).valueOf();
					var Date1 = moment(data[5].value).valueOf();
					var nowDate = moment.valueOf()-86400000;
					if(Date2>Date1){
           			 	Dialog.tip({
							title:"开始日期必须小于或等于结束日期"
						});
           		 	}else if(Date2<nowDate){
						Dialog.tip({
							title:"开始日期不能小于当前日期"
						});
					}else{
						widget.save("api/shackapply/save",$("#shackapply").serialize(),function(data){
							if(data.msg == "该会员已有未完成的申请单"){
	                   		   Dialog.tip({
  									title:"该会员已有未完成的申请单"
	                   		   });
	                   	    }else{
	                   		   widget.get("list").refresh();
	                   	    }
							widget.list2Card(false);
						});
					}
					
				},
				model:{
					id:"shackapply",
					items:[{
						name:"pkShackApply",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"flowStatus",
						type:"hidden", 
						defaultValue:"Init"
					},{
						name:"member",
						label:"会员",
						type:"select",
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						validate:["required"]
					},{
						name:"date",
						label:"开始日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"endDate",
						label:"结束日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"number",
						label:"人数",
						validate:["floor"],
						validate:["required"]
					},{
						name:"nexus",
						label:"与会员关系",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
					}]
				}
			};
		},
		afterInitComponent:function(params){
			this.get("list").refresh(params);
		}
	});
	module.exports = ShackApply;
});