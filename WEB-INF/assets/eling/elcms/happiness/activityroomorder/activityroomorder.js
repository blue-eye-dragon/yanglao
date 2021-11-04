define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Form=require("form")
	var Dialog=require("dialog");
	var Grid = require("grid");
	var MultiRowGrid=require("multirowgrid");
	var emnu = require("enums");
	var template="<div class='el-activityroomorder'>"+
		 "<div class='J-subnav'></div>"+
		"<div class='J-form' hidden></div>"+
	 	"<div class='J-grid'></div>"+
	 	"<div class='J-canclegrid' hidden></div>"+
	 	"</div>";
	require("./assets/activityroomorder.css");
	//将页面组件，自定义函数进行分离
	var ComponentProperties = require("./assets/componentproperties");
	var FunctionProperties = require("./assets/functionproperties");
	
	var activityroomorder = ELView.extend({
		attrs:{
			template:template
		},
		events : {
			"click .J-cancle":function(e){
				var widget = this;pkActivityRoomReserveCycle
				var pkActivityRoomReserve = $(e.currentTarget).attr("data-pkActivityRoomReserve");
				var pkActivityRoomReserveCycle = $(e.currentTarget).attr("data-pkActivityRoomReserveCycle");
				var cycle =  $(e.currentTarget).attr("data-cycle");
				if(cycle=="true"){
					Dialog.alert({
						title : "提示",
						content : "该活动室预定为周期预定，您想取消所有未开始的预定还是只取消本次预定?",
						defaultButton : false,
						buttons : [{
							id : "cycle",
							text : "取消所有",
							className : "btn-primary",
							handler : function(){
								aw.ajax({
									url : "api/activityroomreservecycle/cancle",
									data : {
										pkActivityRoomReserveCycle : pkActivityRoomReserveCycle
									},
									dataType:"json",
									type : "POST",
									success : function(result){
										FunctionProperties.refreshActivitySelect(widget);
										widget.get("canclegrid").refresh();
									}
								});
								Dialog.close();
								Dialog.alert({
									title : "提示",
									content : "取消成功",
									confirm : function(){
										
									}
								})
							}
						},{
							id : "single",
							text : "取消本次",
							handler : function(){
								aw.ajax({
									url : "api/activityroomreserve/" + pkActivityRoomReserve + "/delete",
									data : {
										pkActivityRoomReserve:pkActivityRoomReserve,
		                             },
									dataType:"json",
									type : "POST",
									success : function(result){
										FunctionProperties.refreshActivitySelect(widget);
										widget.get("canclegrid").refresh();
									}
								});
								Dialog.close();
								Dialog.alert({
									title : "提示",
									content : "取消成功",
									confirm : function(){
										
									}
								})
							}
						},{
							id : "return",
							text : "返回",
							handler : function(){
								Dialog.close();
							}
						}]
					});
				}else{
					Dialog.confirm({
						title:"提示",
						content:"取消活动室的预定?",
							confirm:function(){
								//是
								aw.ajax({
									url : "api/activityroomreserve/" + pkActivityRoomReserve + "/delete",
									data : {
										pkActivityRoomReserve:pkActivityRoomReserve,
		                             },
									dataType:"json",
									type : "POST",
									success : function(result){
										FunctionProperties.refreshActivitySelect(widget);
										widget.get("canclegrid").refresh();
										Dialog.alert({
											title : "提示",
											content : "取消成功",
											confirm : function(){
												
											}
										})
									}
								});
							},
					});
				}
			},
			"click .J-edit":function(e){
				var widget = this;
				var form = widget.get("form");
				var pkActivityRoomReserve = $(e.currentTarget).attr("data-pkActivityRoomReserve");
				aw.ajax({
					url : "api/activityroomreserve/query",
					data : {
						pkActivityRoomReserve:pkActivityRoomReserve,
						fetchProperties:"pkActivityRoomReserve,"+
										"activityRoom.pkActivityRoom,"+
										"activityRoom.name,"+
										"activity.pkActivity,"+
										"activity.theme,"+
										"theme,"+
										"description,"+
										"startTime,"+
										"endTime,"+
										"activity.activityStartTime,"+
										"activity.activityEndTime,"+
										"activity.theme,"+
										"activity.activityDescription,"+
										"activity.users.pkUser,"+
										"activity.users.pkUser.name,"+
										"activity.mostActivityNumber,"+
										"activity.contactInformation,"+
										"users.pkUser,"+
										"users.pkUser.name,"+
										"contactInformation,"+
										"participants,"+
										"version," +
										"cycle," +
										"activityRoomReserveCycle.pkActivityRoomReserveCycle," +
										"particulars",
                     },
					dataType:"json",
					type : "POST",
					success : function(result){
						widget.get("form").reset();
						var data = result[0];
						if(data.activityRoomReserveCycle&&data.activityRoomReserveCycle.pkActivityRoomReserveCycle){
							widget.get("form").hide(["activity"]).show(["cycleType","week"]);
							//周期活动室预定
							if(data.startTime){
								form.setValue("week",FunctionProperties.getWeek(data.startTime));
							}else{
								form.setValue("week",null);
							}
						}
						if(data.activity){
							//关联活动
							form.setValue("activity",data.activity);
							form.setValue("theme",data.activity.theme);
							form.setDisabled("theme",true);
							form.setValue("description",data.activity.activityDescription);
							form.setDisabled("description",true);
							form.setValue("startTime",data.activity.activityStartTime);
							form.setDisabled("startTime",true);
							form.setValue("endTime",data.activity.activityEndTime);
							form.setDisabled("endTime",true);
							form.setValue("users",data.activity.users);
							form.setDisabled("users",true);
							form.setValue("contactInformation",data.activity.contactInformation);
							form.setDisabled("contactInformation",true);
							form.setValue("participants",data.activity.mostActivityNumber);
							form.setDisabled("participants",true);
							form.setValue("version",data.version);
							form.setValue("pkActivityRoomReserve",data.pkActivityRoomReserve);
							form.setValue("activityRoom",data.activityRoom.pkActivityRoom);
							form.setValue("activityRoomName",data.activityRoom.name);
							form.setValue("particulars",data.particulars);
							form.setValue("cycle",data.cycle);
							form.setDisabled("cycle",true);
						}else{
							//不关联活动
							form.setValue("theme",data.theme);
							form.setValue("description",data.description);
							form.setValue("startTime",data.startTime);
							form.setValue("endTime",data.endTime);
							form.setValue("users",data.users);
							form.setValue("contactInformation",data.contactInformation);
							form.setValue("participants",data.participants);
							form.setValue("version",data.version);
							form.setValue("pkActivityRoomReserve",data.pkActivityRoomReserve);
							form.setValue("activityRoom",data.activityRoom.pkActivityRoom);
							form.setValue("activityRoomName",data.activityRoom.name);
							form.setValue("particulars",data.particulars);
							form.setValue("cycle",data.cycle);
							form.setDisabled("cycle",true);
							//如果存在pkActivityRoomReserveCycle，则表示周期的活动室预定在进行编辑操作
							if(data.activityRoomReserveCycle&&data.activityRoomReserveCycle.pkActivityRoomReserveCycle){
								form.setValue("pkActivityRoomReserveCycle",data.activityRoomReserveCycle.pkActivityRoomReserveCycle);
							}
						}
						widget.hide([".J-grid"]).show([".J-form"]);
						$(".J-form").show();
						widget.get("subnav").hide(["date","choose","cancle"]).show(["return"]);
					}
				});
			},
			"change .J-form-form-select-activity":function(e){
				//TODO 活动下拉框
				var form = this.get("form");
				var pkActivity = form.getValue("activity");
				if(pkActivity){
					aw.ajax({
						url:"api/activity/query",
						data:{
							pkActivity : pkActivity,
							fetchProperties:"pkActivity,theme,activityStartTime,activityEndTime,users.pkUser,users.name,contactInformation,activityDescription,mostActivityNumber,cycle",
						},
						dataType:"json",
						success:function(result){
							//重置表单
//							form.reset();
							//选择一个活动，带出属性并未表单对应的字段赋值,并只读
							var data = result[0];
							//设置主题
							form.setValue("theme",data.theme);
							form.setDisabled("theme",true);
							//设置活动描述
							form.setValue("description",data.description);
							form.setDisabled("description",true);
							//设置是否周期活动 //TODO 暂时写死为false
							form.setValue("cycle",false);
							form.setDisabled("cycle",true);
							//隐藏周期类型，星期
							form.hide(["cycleType","week"]);
							//设置开始时间
							form.setValue("startTime",data.activityStartTime);
							form.setDisabled("startTime",true);
							//设置结束时间
							form.setValue("endTime",data.activityEndTime);
							form.setDisabled("endTime",true);
							//设置秘书负责人
							form.setValue("users",data.users);
							form.setDisabled("users",true);
							//设置最多活动人数
							form.setValue("participants",data.mostActivityNumber);
							form.setDisabled("participants",true);
							//设置联系方式
							form.setValue("contactInformation",data.contactInformation);
							form.setDisabled("contactInformation",true);
						}
					});
				}else{
					if(form.getValue("pkActivityRoomReserve")){
						//删掉活动的时候，如果存在pkActivityRoomReserve则表示当前正在编辑
						var activityRoom = form.getValue("activityRoom");
						var activityRoomName = form.getValue("activityRoomName");
						var pkActivityRoomReserve = form.getValue("pkActivityRoomReserve");
						var version = form.getValue("version");
						form.reset();
						form.setValue("pkActivityRoomReserve",pkActivityRoomReserve);
						form.setValue("version",version);
						form.setValue("activityRoom",activityRoom);
						form.setValue("activityRoomName",activityRoomName);
					}else{
						form.reset();
					}
				}
			},
			"click .J-theme-detail" : function(e){
				var pkActivity = $(e.currentTarget).attr("data-pkActivity");
				var type = $(e.currentTarget).attr("data-type");
				//活动的开始时间和结束时间
				var activityStartTime = $(e.currentTarget).attr("data-activityStartTime");
				var activityEndTime = $(e.currentTarget).attr("data-activityEndTime");
				var isCycle = false;
				this.openView({
					url:"eling/elcms/happiness/activity/activity",
					params:{
						//活动的类型（健康、快乐、生活）
						activityType : type,
						//活动的pk
						pkActivity : pkActivity,
						//开始时候和结束时间
						activityStartTime : activityStartTime,
						activityEndTime : activityEndTime,
						isCycle : isCycle
					},
					isAllowBack:true
				});
			},
			
			//开始时间和结束时间的校验
			"change .J-form-form-date-startTime":function(e){
				var form = this.get("form");
				var startTime = form.getValue("startTime");
				var endTime = form.getValue("endTime");
				if (moment(startTime).diff(moment(),"days") > 13 ) {
					Dialog.alert({
                		title:"提示",
                		content:"开始日期请选择在两周以内，请重新选择开始日期和结束日期！"
                	});
					form.setValue("startTime",null);
					form.setValue("endTime",null);
            		return;
				}
				//周期活动室预定
				if(startTime){
					form.setValue("week",FunctionProperties.getWeek(startTime));
				}else{
					form.setValue("week",null);
				}
//				if(startTime<moment().valueOf()){
//					Dialog.alert({
//                		title:"提示",
//                		content:"(活动)开始时间不能早于当前时间!"
//                	});
//				}
				if(endTime){
					if(startTime>endTime){
						Dialog.alert({
                    		title:"提示",
                    		content:"(活动)开始时间不能晚于(活动)结束时间!"
                    	});
						form.setValue("startTime",moment().valueOf());
                		return;
					}
				}
				var activityroom = form.getValue("activityRoomName");
				if(activityroom){
					form.setValue("activityRoomName",null);
				}
			},
			"change .J-form-form-date-endTime":function(e){
				var form = this.get("form");
				var startTime = form.getValue("startTime");
				var endTime = form.getValue("endTime");
				if (moment(endTime).diff(moment(),"days") > 13 ) {
					Dialog.alert({
                		title:"提示",
                		content:"结束日期请选择在两周以内，请重新选择开始日期和结束日期！"
                	});
					form.setValue("startTime",null);
					form.setValue("endTime",null);
            		return;
				}
//				if(endTime<moment().valueOf()){
//					Dialog.alert({
//                		title:"提示",
//                		content:"(活动)结束时间不能早于当前时间!"
//                	});
//				}
				if(startTime){
					if(endTime<startTime){
						Dialog.alert({
                    		title:"提示",
                    		content:"(活动)结束时间不能早于(活动)开始时间!"
                    	});
						form.setValue("endTime",moment().valueOf());
                		return;
					}
				}
				var activityroom = form.getValue("activityRoomName");
				if(activityroom){
					form.setValue("activityRoomName",null);
				}
			},
			"click .J-form-form-text-activityRoomName" : function(e){
				var widget =this;
				var form = widget.get("form");
				start = form.getValue("startTime");
				end = form.getValue("endTime");
				if(!start){
					Dialog.alert({
                		title:"提示",
                		content:"请先输入活动开始时间！"
                	});
            		return;
				}
				if(!end){
					Dialog.alert({
                		title:"提示",
                		content:"请先输入活动结束时间！"
                	});
            		return;
				}
				var activityroomgrid =FunctionProperties.activityRoomGrid(widget);
				FunctionProperties.queryActRoom([start],[end],activityroomgrid);
				Dialog.showComponent(activityroomgrid,{ 
					title : "活动室预订",
					defaultButton : false,
					buttons : [{
						id : "activityreset",
                        text : "清空",
                        handler : function(){
                        	form.setValue("activityRoom","");
                        	form.setValue("activityRoomName","");
                        	Dialog.close();
                        	Dialog.close();
                        }
					},{
                        id : "activityreturn",
                        text : "返回",
                        handler : function(){
                        	Dialog.close();
                        }
                    }],
					setStyle:function(){
						$(".modal").css({
							"overflow": "visible",
							"height":" 500px",
						    "width": "80%",
							"margin-left":" -20%",
							"top":" 15%",
						});
						$(".modal-body").css({
							"overflow": "overlay",
							"height":" 350px",
						});
					}
				});
			},
			"change .J-form-form-radio-cycle" : function(e){
				var form = this.get("form");
				var cycle = form.getValue("cycle");
				if(cycle==true){
					form.show(["cycleType","week"]).hide("activity");
				}else{
					form.hide(["cycleType","week"]).show("activity");
				}
			}
		},
		initComponent:function(params,widget){		
			var subnav = ComponentProperties.getSubnav(widget);
			this.set("subnav",subnav);
			
			var list = ComponentProperties.getList(widget);
			this.set("list",list);
			
			var form = ComponentProperties.getForm(widget);
			this.set("form",form);
			
			var canclegrid = ComponentProperties.getCancleGrid(widget);
			this.set("canclegrid",canclegrid);
		},
		setEpitaph:function(){
			var subnav = this.get("subnav");
			return {
				startTimeButton:subnav.getValue("date"),
			};
		},
		afterInitComponent:function(params,widget){
			if(params.startTimeButton){
				widget.get("subnav").setValue("date",params.startTimeButton);
				widget.get("list").refresh();
			}
			var form = widget.get("form");
			form.hide(["cycleType","week"]);
		}
	});
	module.exports = activityroomorder;
});
