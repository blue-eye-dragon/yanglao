define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
	var Todolist=require("todolist");
	var Form = require("form-1.0.0");
	var fetchString = "*," +
				"building.name," +
				"building.version," +
				"member.memberSigning.room.number," +
				"member.personalInfo.name";
	
	var healthRoutTodoList=ELView.extend({
		attrs:{
			template: "<div class='J-subnav'></div>"+
			"<div class='J-todolist'></div>"+
			"<div class='J-todocard hidden'></div>"
		},
		events:{
			//会员的查询
			"change .J-building" : function(a){
				var pk=$(a.target).find("option:selected").attr("value");
				if(pk){
					this.get("todoGrid").load("member",{
						params:{
							"memberSigning.room.building":pk,
							fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
						}
					});
				}
			},
			//责任人的查询
			"change .J-role" : function(a){
				var pkB = $("select.J-building").find("option:selected").attr("value");
				var pk=$(a.target).find("option:selected").attr("value");
				if(pk && pkB){
					this.get("todoGrid").load("pkUser",{
						params:{
							pkBuilding:pkB,
							pkRole:pk,
							fetchProperties:"pkUser,name"
						}
					});
				}
			},
			//服务的查询
			"change .J-member" : function(a){
				var pk=$(a.target).find("option:selected").attr("value");
				if(pk){
					this.get("todoGrid").load("service",{
						params:{
							pkMember:pk,
							type:"HealthRoutIns",
							fetchProperties:"pkService,name"
						}
					});
				}
			},
			"click .J-todolist-itemedit" : function(e){
				var data = this.get("todolist").getRowData(e);
				if(data.member.pkMember){
					var room = data.member.memberSigning.room.number;
					var member = data.member.personalInfo.name;
					this.openView({
						url:"eling/elcms/health/healthDailyRecord/healthDailyRecord",
						params:{
							pkMember : data.member.pkMember,
							name : room + " " + member,
							date : moment().valueOf(),
							fatherNode:"eling/elcms/schedule/healthRoutToDoList/healthRoutToDoList"
						},
						isAllowBack:true
					});
				}
		        return false;
			},
//			"click .J-todolist-check" : function(e){
//				var data=this.get("todolist").getRowData(e);
//				if(data){
//					if($(e.target).parents("li").hasClass("done")){							
//						data.finishDate = moment().valueOf();
//					}else{
//						data.finishDate = null;
//					}
//					aw.ajax({
//						url : "api/action/save",
//						type : "POST",
//						contentType:"application/json",
//						data:JSON.stringify(data),
//						dataType : "json",
//						success : function(result){
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
					title:"健康巡检待办任务",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide([".J-todocard",".J-return"]).show([".J-todolist",".J-add"]);
							return false;
						}
					},{
						id:"add",
						text:"新增",
						handler:function(){							
							widget.get("todoGrid").reset();
							widget.hide([".J-todolist",".J-add"]).show([".J-todocard",".J-return"]);
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
			     fetchProperties:fetchString,
			     params:params,
			     model:{
			    	 event:{
				    	important:function(e){
							var data=widget.get("todolist").getRowData(e);
							if(data){
								data.important = $(e.target).parents("li").hasClass("important");
								aw.ajax({
									url : "api/action/save",
									type : "POST",
									contentType:"application/json",
									data:JSON.stringify(data),
									dataType : "json",
									success : function(result){}
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
									url : "api/action/save",
									type : "POST",
									contentType:"application/json",
									data:JSON.stringify(data),
									dataType : "json",
									success : function(result){}
								});		
							}
					        return false;	
				    	},
				    	checkbox:function(e){
				    		var data=widget.get("todolist").getRowData(e);
							if(data){
								if($(e.target).parents("li").hasClass("done")){							
									data.finishDate = moment().valueOf();
								}else{
									data.finishDate = null;
								}
								aw.ajax({
									url : "api/action/save",
									type : "POST",
									contentType:"application/json",
									data:JSON.stringify(data),
									dataType : "json",
									success : function(result){
									}
								});		
							}
					        return false;	
				    	}
				     },
				     itemButtons:[{
						  id:"itemedit",
						  text:"健康日志",
						  show:true
					  }],
					  mapping:{
						  content:[{
							  key:"date",
							  format:function(value){
								  return moment(value).format("YYYY-MM-DD HH:mm");
							  }
						  },{
							  key:"longTitle"
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
			var todoGrid=new Form({
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
						defaultValue:"HealthRoutIns",
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
						name:"deadline",
						label:"截止日期",
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
						label:i18ns.get("sale_ship_owner","会员"),
						value:"memberSigning.room.number,personalInfo.name",
						url:"api/member/query",
						type:"select",
						lazy:true,
						validate:["required"]
					},{
						name:"service",
						key:"pkService",
						label:"服务",
						value:"name",
						url:"api/service/query/type",
						type:"select",
						lazy:true,
						validate:["required"]
					}]
				}
			});
			this.set("todoGrid",todoGrid);
		},
		setEpitaph:function(){
			var params = this.get("params");
			params.type="HealthRoutIns";
			params.fetchProperties=fetchString;
			return params;
		}
	});
	
	module.exports = healthRoutTodoList;
});