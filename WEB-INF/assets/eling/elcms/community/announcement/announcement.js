define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	
	var Announcement = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"公告",
					buttonGroup:[{
        				id:"date",
        				items:[{
                            key:"0",
                            value:"本月"
        				},{
                            key:"1",
                            value:"三月内"
        				},{
        					key:"2",
                            value:"半年内"
        				},{
        					value:"全部"
        				}],
        				handler:function(key,element){
        					widget.get("list").refresh();
        				}
        			},{
        				id:"flowStatus",
        				items:[{
        					key:"Submit",
        					value:"提交"
        				},{
        					key:"Approval",
        					value:"通过"
        				},{
        					key:"Reject",
        					value:"驳回"
        				},{
        					value:"全部"
        				}],
        				handler:function(key,element){
        					widget.get("list").refresh();
        				}
        			}],buttons:[{
						id:"add",
						text:"新增",
						type:"button",
						handler:function(){
							widget.show(".J-card").hide(".J-list");
 						    widget.get("subnav").hide(["flowStatus","date","add"]).show(["return"]);
							return false;
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						type:"button",
						handler:function(){
							widget.show(".J-list").hide(".J-card");
                            widget.get("subnav").show(["flowStatus","date","add"]).hide(["return"]);
							return false;
						}
					}]
                }
			};
		},
		initList:function(widget){
			return {
				url : "api/announcement/query",
				fetchProperties:"*,creator.name,approver.name",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						datatime:subnav.getValue("date"),
						flowStatus:subnav.getValue("flowStatus")
					};
				},
                model:{
                    columns:[{
                        key:"title",
                        name:"标题"
                    },{
 						key:"type.value",
 						name:"类型"
 					},{
						key:"createTime",
						name:"创建日期 ",
						format:"date"
					},{
						key:"loseDate",
						name:"失效日期 ",
						format:"date"
					},{
						key:"creator.name",
						name:"发布人"
					},{
						key:"inscribe",
						name:"落款",
					},{
 						key:"flowStatus.value",
 						name:"状态"
 					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								widget.get("subnav").hide(["flowStatus","date"]);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/announcement/" + data.pkAnnouncement + "/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"profile",
				saveaction:function(){
					var Date2 = widget.get("card").getValue("loseDate");
					var nowDate = moment().startOf("days").valueOf();
					if(Date2<nowDate){
						Dialog.tip({ 
							title:"失效日期不能小于当前日期"
						});
					}else{
						widget.save("api/announcement/save",$("#announcement").serialize(),function(data){	
							Dialog.tip({
								title:"保存成功！"
							});
							widget.show(".J-list").hide(".J-card");
							widget.get("list").refresh();
							if(data.pkAnnouncement){
								widget.get("card").upload("api/attachment/announcementphoto/"+data.pkAnnouncement);
								
							}
						});
					}
	          },
	          model:{
					id:"announcement",
					items:[{
						title:"公告",
						img:{
							url:"api/attachment/announcementphoto/",
							idAttribute:"pkAnnouncement"
						},
						children:[{
							name:"pkAnnouncement",
							type:"hidden"
						},{
							name:"version",
							type:"hidden",
							defaultValue:"0"
						},{
							name:"title",
							label:"标题",
							validate:["required"]
						},{
							name:"content",
							label:"内容",
							type:"textarea",
							validate:["required"]
						},{
							name:"inscribe",
							label:"落款",
							validate:["required"]
						},{
							name:"type",
							label:"类型",
							type:"select",
							options:[{
								key:"OnlyWords",
								value:"纯文字"
							},{
								key:"PictureFull",
								value:"图片(全屏)"
							},{
								key:"PictureHalf",
								value:"图片(半屏)"
							}],
							validate:["required"]
						},{
							name:"loseDate",
							label:"失效日期",
							type:"date",
							mode:"Y-m-d",
							validate:["required"]
						},
//						{
//							name:"createTime",
//							type:"hidden",
//						},{
//							name:"creator",
//							type:"hidden",
//						},{
//							name:"approver",
//							type:"hidden",
//						},
						{
							name:"flowStatus",
							type:"hidden",
							defaultValue:"Submit"
						}]
					}]
				}
			};
		}
	});
	module.exports = Announcement;
});