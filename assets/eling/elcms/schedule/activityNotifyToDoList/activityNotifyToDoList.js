define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
	var Todolist=require("todolist");
	var Dialog = require("dialog-1.0.0");
	var fetchString = "*," +
				"building.name," +
				"building.version," +
				"member.memberSigning.room.number," +
				"member.personalInfo.name," +
				"activity.theme," +
				"activity.activityStartTime";
	
	var activityNotifyToDoList=ELView.extend({
		attrs:{
			template: "<div class='J-subnav'></div><div class='J-todolist'></div>"
		},
		events:{
			"click .J-todolist-edit" : function(e){
				var todolist=this.get("todolist");
				if(todolist.getData(e,"member.pkMember")){
					var room = todolist.getData(e,"member.memberSigning.room.number");
					var member = todolist.getData(e,"member.personalInfo.name")
					this.openView({
						url:"eling/elcms/happiness/activitysignup/activitysignup",
						params:{
							pkMember : todolist.getData(e,"member.pkMember"),
							name : room + " " + member,
							date : moment().valueOf(),
							fatherNode:"eling/elcms/schedule/activityNotifyTodoList/activityNotifyTodoList"
						},
						isAllowBack:true
					});
				}
		        return false;
			},
//			"click .J-todolist-check" : function(e){
//				var todolist=this.get("todolist");
//				var data=todolist.getRowData(e);
//				if(data){
//					if($(e.target).parents("li").hasClass("done")){							
//						data.finishDate = moment().valueOf()();
//					}else{
//						data.finishDate = null;
//					}
//					aw.ajax({
//						url : "api/action/activity/save",
//						type : "POST",
//						contentType:"application/json",
//						data:JSON.stringify(data),
//						dataType : "json",
//						success : function(result){
//							if("超期" == result.msg){									
//								Dialog.alert({
//									content:"任务已超期，不能进行操作"
//								});
//								$(e.target).parents("li").removeClass("done");
//								$(e.target).attr("checked",false);
//							}
//						}
//					});		
//				}
//		        return false;					
//			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"活动发布通知",
				}
			});
			this.set("subnav",subnav);
			//渲染todolist
			var todolist = new Todolist({
			     parentNode:".J-todolist",
			     url:"api/action/queryByType",
			     fetchProperties:fetchString,
			     params:params,
			     model:{
			    	 event:{
				    	important:function(e){
				    		var data=widget.get("todolist").getRowData(e);
							if(data){
								data.important = $(e.target).parents("li").hasClass("important");
								aw.ajax({
									url : "api/action/activity/save",
									type : "POST",
									contentType:"application/json",
									data:JSON.stringify(data),
									dataType : "json",
									success : function(result){
										if("超期" == result.msg){									
											Dialog.alert({
												content:"任务已超期，不能进行操作"
											});
											$(e.target).parents("li").removeClass("important");
										}
									}
								});		
							}
					        return false;	
				    	},
				    	remark:function(e){
				    		var data=widget.get("todolist").getRowData(e);
							if(data){
								var parent=$(e.target).parent().next();
								data.workHour = parseFloat(parent.find("input").val());
								//查看取数字后和之前的字符串是否一致
								if (data.workHour.toString() != parent.find("input").val().trim()){
									Dialog.alert({
										content:"工时请输入数字"
									});
									return false;
								}
								data.description = parent.find("textarea").val();
								aw.ajax({
									url : "api/action/activity/save",
									type : "POST",
									contentType:"application/json",
									data:JSON.stringify(data),
									dataType : "json",
									success : function(result){
										if("超期" == result.msg){									
											Dialog.alert({
												content:"任务已超期，不能进行操作"
											});
										}else{
											Dialog.alert({
												content:"保存成功"
											});
										}
									}
								});
							}
					        return false;	
				    	},
				    	checkbox:function(e){
				    		var todolist=widget.get("todolist");
							var data=todolist.getRowData(e);
							if(data){
								if($(e.target).parents("li").hasClass("done")){							
									data.finishDate = moment().valueOf();
								}else{
									data.finishDate = null;
								}
								aw.ajax({
									url : "api/action/activity/save",
									type : "POST",
									contentType:"application/json",
									data:JSON.stringify(data),
									dataType : "json",
									success : function(result){
										if("超期" == result.msg){									
											Dialog.alert({
												content:"任务已超期，不能进行操作"
											});
											$(e.target).parents("li").removeClass("done");
											$(e.target).attr("checked",false);
										}
									}
								});		
							}
					        return false;	
				    	}
				     },
					  buttons:[{
						  id:"edit",
						  text:"活动报名",
						  show:true
					  }],
					  mapping:{
						  group:[{
							  key:"activity.pkActivity"
						  }],
						  title:[{      
							  key:"activity.activityStartTime",
							  format:function(value){
								  return moment(value).format("YYYY-MM-DD HH:mm")
							  }
						  },{      
							  key:"activity.theme"
						  }],
						  content:[{
							  key:"member.memberSigning.room.number"
						  },{
							  key:"member.personalInfo.name"
						  }],
						  done:"finishDate",
						  important:"important",
						  input:"workHour",
						  remark:"description"
					  }
				  }
			});
			this.set("todolist",todolist);

		},
		setEpitaph:function(){
			var params = this.get("params");
			params.type="ActivityNotify";
			params.fetchProperties=fetchString;
			return params;
		}
	});
	
	module.exports = activityNotifyToDoList;
});