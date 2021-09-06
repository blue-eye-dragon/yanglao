define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
	var Todolist=require("todolist");
	var Form = require("form-1.0.0");
	var Dialog = require("dialog-1.0.0");
	var worktaskConfig=require("./worktask_config");
	
	var workTaskTodoList=ELView.extend({
		attrs:{
			template: "<div class='J-subnav'></div>"+
				"<div class='J-todolist'></div>"+
				"<div class='J-todocard hidden'></div>"
		},
		events:{
			//会员的查询
			"change .J-building" : function(a){
				var pk=this.get("form").getValue("building");
				if(pk){
					this.get("form").load("member",{
						params:{
							"memberSigning.room.building":pk,
							fetchProperties:"pkMember,memberSigning.room.number,personalInfo.name"
						}
					});
				}
			},
			//责任人的查询
			"change .J-role" : function(a){
				var pkB = $("select.J-building").find("option:selected").attr("value");
				var pk=$(a.target).find("option:selected").attr("value");
				if(pk && pkB){
					this.get("form").load("pkUser",{
						params:{
							pkBuilding:pkB,
							pkRole:pk,
							fetchProperties:"pkUser,name"
						}
					});
				}
			},
			"click .J-todolist-itemedit" : function(e){
				var data=this.get("todolist").getRowData(e);					
				if(data.pageLink){
					if(data.pageParameter){
						this.openView({
							url:data.pageLink,
							params:data.pageParameter,
							isAllowBack:true
						});
					}else{
						var nameStr = ((data.member)? data.member.memberSigning.room.number+" "+data.member.personalInfo.name : null)
						this.openView({
							url:data.pageLink,
							params:{
								pkBuilding : data.building.pkBuilding,
								pkMember : ((data.member)? data.member.pkMember : null),
								name : nameStr,
								date : moment().valueOf(),
								pkFather : data.pkFather
							},
							isAllowBack:true
						});
					}
				}
		        return false;
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:worktaskConfig.typeString[params.id]+"待办任务",
					buttons:[{
						id:"add",
						text:"新增",
						show:worktaskConfig.addShowFlag[params.id],
						handler:function(){							
							widget.get("form").reset();
							widget.hide([".J-todolist",".J-add"]).show([".J-todocard",".J-return"]);
							return false;
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide([".J-todocard",".J-return"]).show([".J-todolist",".J-add"]);
							widget.get("todolist").refresh();
							return false;
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			//渲染todolist
			var todolist = new Todolist({
			     parentNode:".J-todolist",
			     url:"api/action/queryByType",
			     params:params,
			     fetchProperties:worktaskConfig.fetchProperties,
			     model:{
			    	 event:{
				    	important:function(e){
				    		var data=widget.get("todolist").getRowData(e);
							if(data){
								data.important = $(e.target).parents("li").hasClass("important");
								aw.ajax({
									url : worktaskConfig.saveUrl[data.type.key],
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
									url : worktaskConfig.saveUrl[data.type.key],
									type : "POST",
									contentType:"application/json",
									data:JSON.stringify(data),
									dataType: "json",
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
				    	},
				    	checkbox:function(e){
				    		var data=widget.get("todolist").getRowData(e);
							if(worktaskConfig.isGoto[data.type.key]==false){
								if(data){
									if($(e.target).parents("li").hasClass("done")){							
										data.finishDate = moment().valueOf();
									}else{
										data.finishDate = null;
									}
									aw.ajax({
										url : worktaskConfig.saveUrl[data.type.key],
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
							}else{
								var nameStr = ((data.member)? data.member.memberSigning.room.number+" "+data.member.personalInfo.name : null)
								widget.openView({
									url:data.pageLink,
									params:{
										pkBuilding : data.building.pkBuilding,
										pkMember : ((data.member)? data.member.pkMember : null),
										name : nameStr,
										date : moment().valueOf(),
										pkFather : data.pkFather
									},
									isAllowBack:true
								});
								
						        return false;	
							}
				    	}
				     },
			    	 itemButtons:[{
			    		 id:"itemedit",
			    		 text:"详细信息",
			    		 show:"pageLink"
			    	 }],
			    	 mapping:{
						  content:[{
							  key:"date",
							  format:function(value){
								  if(params.id=="NightRoutIns"){
									  return moment(value).format("HH:mm");
								  }
								  var str = "";
								  if (value){									  
									  var date=moment(value);
									  if (date){										  
										  str = date.format("YYYY-MM-DD");
										  if(worktaskConfig.dateShowFlag[params.id] && value){
											  if (date.hours() != 0){
												  str = date.format("YYYY-MM-DD HH:mm");
											  }
										  }
									  }
								  }
								  return str;
							  }
						  },{
							  key:"title"
						  }],
						  done:"finishDate",
						  important:"important",
						  input:"workHour",
						  remark:"description"
					  }
				  }
			});
			this.set("todolist",todolist);
			//渲染待办事项grid
			var form=new Form({
				parentNode : ".J-todocard",
				saveaction:function(){
					aw.saveOrUpdate("api/action/add",$("#action").serialize(),function(){
						widget.get("todolist").refresh();
						widget.hide([".J-todocard",".J-return"]).show([".J-todolist",".J-add"]);
					});	
				},
				cancelaction:function(){
					widget.hide([".J-todocard",".J-return"]).show([".J-todolist",".J-add"]);
					return false;
				},
				model:{
					id:"action",
					items:[{
						name:"pkAction",
						type:"hidden"
					},{
						name:"type",
						defaultValue:params.id,
						type:"hidden"
					},{
						name:"title",
						label:"任务描述",
						validate:["required"]
					},{
						name:"date",
						label:"日期",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"duration",
						label:"预计工时(分钟)",
						validate:["number"]
					},{
						name:"important",
						label:"重要",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}]
					},{
						name:"building",
						key:"pkBuilding",
						label:"楼",
						value:"name",
						type:"select",
						url:"api/building/query",
						params:{
							useType:"Apartment",
							fetchProperties: "pkBuilding,name"
						},
						validate:["required"]
					},{
						label:"角色",
						name:"role",
						type:"select",
						url:"api/role/dropdown",
						params:{
							fetchProperties:"pkRole,name"
						},
						key:"pkRole",
						value:"name"
					},{
						name:"pkUser",
						key:"pkUser",
						label:"责任人",
						value:"name",
						url:"api/user/building",
						type:"select",
						lazy:true
					},{
						name:"member",
						key:"pkMember",
						label:"会员",
						value:"memberSigning.room.number,personalInfo.name",
						url:"api/member/query",
						params:function(){
							return {
								
							};
						},
						type:"select",
						lazy:true
					}]
				}
			});
			this.set("form",form);
		},
		setEpitaph:function(){
			var params = this.get("params");
			params.fetchProperties=worktaskConfig.fetchProperties;
			return params;
		}
	});
	
	module.exports = workTaskTodoList;
});