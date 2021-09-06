define(function(require, exports, module) {
	var BaseView=require("baseview");
    var Dialog=require("dialog-1.0.0");
    var aw = require("ajaxwrapper");
    var enmu = require("enums");
    var fetchProperties = "pkNewAnnouncement," +
							"title," +
							"createTime," +
							"disabledTime," +
							"creator.pkUser," +
							"creator.name," +
							"approver.pkUser," +
							"approver.name," +
							"content," +
							"displayScreens.pkDisplayScreen," +
							"displayScreens.name," +
							"activityRoom.pkActivityRoom," +
							"activityRoom.name," +
							"flowStatus," +
							"description," +
							"version";
	var Activity = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"公告审核",
					buttonGroup:[{
						id:"flowStatus",
						tip:"状态",
						items:[{
							key:"Submit",
							value:"提交"
						},{
							key:"Approval",
							value:"通过"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					buttons:[{
						id:"rebut",
						text:"不通过",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		if(old[i].flowStatus.key == "Approval"){
                         			Dialog.alert({
            							content:"选择公告中有已通过的公告！"
            						});
                         			return;
                         		}
                         		pks+=old[i].pkNewAnnouncement+",";
                         	}
                            aw.ajax({
                            	url : "api/newannouncement/rebut",
                                type : "POST",
                                data : {
                               	 	pks:pks.substr(0, pks.length-1),
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
						text:"通过",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		if(old[i].flowStatus.key == "Approval"){
                         			Dialog.alert({
            							content:"选择公告中有已通过的公告！"
            						});
                         			return;
                         		}
                         		pks+=old[i].pkNewAnnouncement+",";
                         	}
                            aw.ajax({
                                url : "api/newannouncement/approval",
                                type : "POST",
                                data : {
                               	 	pks:pks.substr(0, pks.length-1),
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
					time:{
	     				   tip:"创建日期",
	    				   click:function(time){
	    					   widget.get("list").refresh();
	    				   },
	    			   }
				}
			};
		},
				
		initList:function(widget){
			return{
				url : "api/newannouncement/query",
        		params : function() {
        			var subnav = widget.get("subnav");
					return {
						flowStatus:subnav.getValue("flowStatus"),
						createTime:subnav.getValue("time").start,
						createTimeEnd:subnav.getValue("time").end,
						fetchProperties:fetchProperties  
					} 
        		},
				model:{
					isCheckbox:true,
					columns:[{
						col:3,
						key:"title",
						name:"主题"
					},{
						col:1,
						key:"creator.name",
						name:"发布人"
					},{
						col:1,
						key:"createTime",
						name:"创建时间",
						format:"date"
					},{
						col:1,
						key:"disabledTime",
						name:"失效时间",
						format:"date"
					},{
						col:3,
						key:"displayScreens",
						name:"显示屏",
						format:function(value,row){
							if(value.length>0){
								var name ="";
								for ( var i in value) {
									name += value[i].name+","
								}
								return name.substr(0, name.length-1);
							}else{
								return ""
							}
						}
					},{
						col:1,
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