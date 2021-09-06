define(function(require, exports, module) {
	var BaseView=require("baseview");
    var Dialog=require("dialog-1.0.0");
    var aw = require("ajaxwrapper");
	var Activity = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"公告审核",
					buttonGroup:[{
						id:"datatime",
						tip:"创建时间",
						items:[{
		                    key:"0",
		                    value:"本月"
						},{
		                    key:"1",
		                    value:"三月内"
						},{
							key:"2",
		                    value:"半年内"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"flowStatusIn",
						tip:"状态",
						items:[{
							key:"Submit",
							value:"未审核"
						},{
							key:"Approval,Reject,Lose",
							value:"已审核"
						},{
							key:"Approval",
							value:"发布中"
						},{
							key:"Submit,Approval,Reject,Lose",
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					buttons:[{
						id:"rebut",
						text:"驳回",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		pks+=old[i].pkAnnouncement+",";
                         	}
                            aw.ajax({
                            	url : "api/announcement/rebut",
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
                                	widget.get("list").refresh();
                                }
                            });
						}
					},{
						id:"approval",
						text:"审核",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		pks+=old[i].pkAnnouncement+",";
                         	}
                            aw.ajax({
                                url : "api/announcement/approval",
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
                                	widget.get("list").refresh();
                                }
                            });
						}
					}],
				}
			};
		},
				
		initList:function(widget){
			return{
				url:"api/announcement/query",
				fetchProperties:"*,creator.name,approver.name",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						datatime:subnav.getValue("datatime"),
						flowStatusIn:subnav.getValue("flowStatusIn")
					};
				},
				model:{
					isCheckbox:true,
					columns:[{
						key:"title",
						name:"标题"
					},{
						key:"creator.name",
						name:"发布人"
					},{
						key:"createTime",
						name:"创建时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"loseDate",
						name:"失效时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"content",
						name:"内容"
					},{
 						key:"inscribe",
 						name:"落款",
					},{
						key:"approver.name",
						name:"审批人"
					},{
						key:"flowStatus.value",
						name:"审批状态"
					}]
				}
			};
		}
	});
	module.exports = Activity;
});