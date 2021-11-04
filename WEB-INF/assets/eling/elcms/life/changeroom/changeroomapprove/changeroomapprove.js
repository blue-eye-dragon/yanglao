/**
 * 换房审批
 */
define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0"); 
    var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var ChangeRoomApply = BaseView.extend({
		initSubnav:function(widget){
			var buttonGroup=[{
				id:"building",
				handler:function(key,element){
					widget.get("list").refresh();
				}
			},{
				id:"datetime",
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
				items:[{
					key:"Submit",
					value:"未审批"
				},{
					key:"Approval,Reject",
					value:"已审批"
				}],
				handler:function(key,element){
					widget.get("list").refresh();
				}
			}];
			
			return { 
				model:{
					title:"换房审批",
					buttonGroup:buttonGroup,
					buttons:[{
						id:"rebut",
						text:"驳回",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		pks+=old[i].pkChangeRoomApply+",";
                         	}
                            aw.ajax({
                                url : "api/changeroomapply/rebut",
                                type : "POST",
                                data : {
                               	 	pk:pks
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
						text:"审批",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		pks+=old[i].pkChangeRoomApply+",";
                         	}
                            aw.ajax({
                                url : "api/changeroomapply/approval",
                                type : "POST",
                                data : {
                               	 	pk:pks
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
					}]
				}
			};
		},
				
		initList:function(widget){
			return{
				url:"api/changeroomapply/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"member.memberSigning.room.building":subnav.getValue("building"),
						datetime:subnav.getValue("datetime"),
						flowStatusIn:subnav.getValue("flowStatusIn"),
						fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,newRoom.number,creator.name"
					};
				},
				model:{ 
					isCheckbox:true,
					columns:[{
						key:"newRoom.number",
						name:"新房间号"
					},{
						key:"member.memberSigning.room.number",
						name:"原房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"createTime",
						name:"申请时间",
						format:"date"
					},{
						key:"changeRoomDate",
						name:"换房时间",
						format:"date"
					},{
						key:"creator.name",
						name:"创建人"
					},{
						key:"description",
						name:"备注"
					},{
						key:"flowStatus.value",
						name:"审批状态"
					}]
				}
			};
		}
	});
	module.exports = ChangeRoomApply;
});
