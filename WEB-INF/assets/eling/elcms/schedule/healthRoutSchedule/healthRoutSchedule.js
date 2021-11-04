define(function(require,exports,module){
	var ELView=require("elview");
	var Calendar=require("calendar");
	var Subnav=require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Verform = require("form-1.0.0");
	var aw=require("ajaxwrapper");
	var Dialog = require("dialog-1.0.0");
	var store=require("store");
	var fetchString = "*,member.personalInfo.name,member.memberSigning.room.number,building.version,user.version";
	
	var healthRoutSchedule=ELView.extend({
		_setBuildingSelect:function(widget){
			var buildings=store.get("user").buildings || [];
			var ret="<option value=''>请选择</option>";
			for(var i=0;i<buildings.length;i++){
				if ("Apartment" == buildings[i].useType.key){
					ret+="<option value='"+buildings[i].pkBuilding+"'>"+buildings[i].name+"</option>";
				}
			}
			return ret;
		},
		attrs:{
			template:"<div class='J-subnav'></div>"
				+ "<div class='J-calendar'></div>"
				+ "<div class='J-doctorList hidden'></div>" 
				+ "<div class='J-doctorCard hidden'></div>"
				+ "<div class='J-memNumber hidden' data-key='1' ></div>"
				+ "<div class='J-doctor hidden'></div>"
				+ "<div class='J-calendarMonth hidden'></div>"
		},
		events:{
//			//医生的查询
//			"change .J-building" : function(a){
//				var pk=$(a.target).find("option:selected").attr("value");
//				if(pk){
//					aw.ajax({
//						url : "api/user/role",//TODO 用户角色：wulina 家庭医生
//						type : "POST",
//						data : {
//							roleIn:"8,12,20",
//							fetchProperties:"pkUser,name"
//						},
//						success : function(result){
//							//设置相关用户选择项
//							var retUser="<option value=''>请选择</option>";
//							for(var i=0;i<result.length;i++){
//								retUser+="<option value='"+result[i].pkUser+"'>"+result[i].name+"</option>";
//							}
//							$("select.J-doctor").html(retUser);								
//						}
//					});
//				}
//			},
			//向前按钮的操作
			"click .fc-button-prev" : function(a){
				var monthButton =$(".fc-button-month").hasClass("fc-state-active");
				var time = this.get("calendar").getInstance().fullCalendar('getDate').getTime();
				var month = this.get("calendar").getInstance().fullCalendar('getDate').getMonth();
				var oldMonth = parseInt($(".J-calendarMonth").attr("data-key"));
				if(monthButton || month != oldMonth){
					$(".J-calendarMonth").attr("data-key", month);
					this.get("calendar").refresh({
						pkBuilding:this.get("subnav").getValue("building"),
						date:time,
						fetchProperties:fetchString
					});
				}
			},
			//向后按钮的操作
			"click .fc-button-next" : function(a){
				var monthButton =$(".fc-button-month").hasClass("fc-state-active");
				var month = this.get("calendar").getInstance().fullCalendar('getDate').getMonth();
				var oldMonth = parseInt($(".J-calendarMonth").attr("data-key"));
				if(monthButton || month != oldMonth){
					$(".J-calendarMonth").attr("data-key", month);
					this.get("calendar").refresh({
						pkBuilding:this.get("subnav").getValue("building"),
						date:this.get("calendar").getInstance().fullCalendar('getDate').getTime(),
						fetchProperties:fetchString
					});
				}
			}
		},
		initComponent:function(params,widget){
			var buildings=store.get("user").buildings || [];
			var pkBuildings=[];
			for(var i=0,j=0; j<buildings.length; j++){
				if ("Apartment" == buildings[j].useType.key){			
					pkBuildings[i] = buildings[j].pkBuilding;
					i++;
				}
			}
			var buttonGroups=[];
			buttonGroups.push({
				id:"building",
				handler:function(key,element){
					widget.get("calendar").refresh({
						pkBuilding:key,
						date:widget.get("calendar").getInstance().fullCalendar('getDate').getTime(),
						fetchProperties:fetchString
					});
				}
			});
			buttonGroups.push({
				id:"number",
				key:"number",
				value:"text",
				items:[{
					number:"1",
					text:"每天1人"
				},{
					number:"2",
					text:"每天2人"
				},{
					number:"3",
					text:"每天3人"
				},{
					number:"4",
					text:"每天4人"
				},{
					number:"5",
					text:"每天5人"
				},{
					number:"6",
					text:"每天6人"
				},{
					number:"7",
					text:"每天7人"
				},{
					number:"8",
					text:"每天8人"
				},{
					number:"9",
					text:"每天9人"
				},{
					number:"10",
					text:"每天10人"
				}],
				handler:function(key,element){
					$(".J-memNumber").attr("data-key",key);
				}
			});	
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"健康巡检计划",
					buttons:[{
						id:"buildingSchedule",
						text:"生成秘书计划",
						handler:function(key,element){
							var data = widget.get("calendar").getData();
							var hasFinished = false;
							//判断当前月是否有已完成的巡检计划，如果有，则不能重新生成计划
							if(data){
								var month = calendar.getInstance().fullCalendar('getDate').getMonth();
								var building = parseInt(widget.get("subnav").getValue("building"));
								for (var i=0; i<data.length; i++){
									var planMonth = moment(data[i].date).month();
									if(data[i].building.pkBuilding == building && null != data[i].finishDate && month == planMonth){
										hasFinished = true;
										Dialog.alert({
											content:"本月有巡检任务已完成，不能重新生成秘书巡检计划"
										});
									}
								}
							}
							if (!hasFinished){
								aw.ajax({
									url:"api/routinspectionplan/create/building/"+widget.get("subnav").getValue("building")+"/memNumber/"+$(".J-memNumber").attr("data-key"),
									data:{
										date:calendar.getInstance().fullCalendar('getDate').getTime(),
										fetchProperties:fetchString
									},
									dataType:"json",
									success:function(data){
										widget.get("calendar").refresh({
											pkBuilding:widget.get("subnav").getValue("building"),
											date:widget.get("calendar").getInstance().fullCalendar('getDate').getTime(),
											fetchProperties:fetchString
										});
									}
								});	
							}
						}
					},{
						id:"doctorSchedule",
						text:"生成医生计划",
						handler:function(key,element){
							widget.hide([".J-calendar",".J-doctorCard",".J-buildingSchedule",".J-doctorSchedule",".J-moveToNextDoctor",".J-subnav-button-save",".J-number"]);
							widget.show([".J-doctorList",".J-return"]);
							widget.get("doctorGrid").refresh({
								building:pkBuildings,
								fetchProperties:"*,building.name,doctor.name"});
						}
					},{
						id:"moveToNextDoctor",
						text:"移至下一次医生巡检",
						handler:function(key,element){
							aw.ajax({
								url:"api/doctorHealthRoutPlan/next",
								data:{
									pkBuilding:widget.get("subnav").getValue("building"),
									fetchProperties:fetchString
								},
								dataType:"json",
								success:function(data){
									widget.get("calendar").refresh({
										pkBuilding:widget.get("subnav").getValue("building"),
										date:widget.get("calendar").getInstance().fullCalendar('getDate').getTime(),
										fetchProperties:fetchString
									});
								}
							});
						}
					},{
						id:"save",
						text:"保存",
						handler:function(){
							aw.ajax({
								url:"api/routinspectionplan/saves",
								type:"POST",
								contentType:"application/json",
								data:JSON.stringify({
									pkBuilding:widget.get("subnav").getValue("building"),
									date:calendar.getInstance().fullCalendar('getDate').getTime(),
									routPlans:widget.get("calendar").getData()
								}),
								dataType:"json",
								success:function(data){
									widget.get("calendar").refresh({
										pkBuilding:widget.get("subnav").getValue("building"),
										date:widget.get("calendar").getInstance().fullCalendar('getDate').getTime(),
										fetchProperties:fetchString
									});
									Dialog.alert({
										content:"保存成功"
									});
								}
							});
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							if($(".J-doctorCard").hasClass("hidden")){
								widget.hide([".J-doctorList",".J-doctorCard",".J-return"]).show([".J-calendar",".J-buildingSchedule",".J-doctorSchedule",".J-moveToNextDoctor",".J-subnav-button-save",".J-number"]);
								widget.get("calendar").refresh({
									pkBuilding:widget.get("subnav").getValue("building"),
									date:widget.get("calendar").getInstance().fullCalendar('getDate').getTime(),
									fetchProperties:fetchString
								});
							}else{
								widget.hide([".J-calendar",".J-doctorCard"]).show([".J-doctorList",".J-return"]);
								widget.get("doctorGrid").refresh({
									building:pkBuildings,
									fetchProperties:"*,building.name,doctor.name"});
							}
						}
					}],
					buttonGroup:buttonGroups
				}
			});
			widget.set("subnav",subnav);
			
			var calendar=new Calendar({
				parentNode:".J-calendar",
				url:"api/routinspectionplan/month/query",
				model:{
					calendar:{
						//打开健康日志
						click:function(data, jsEvent, view){
							if(!data.pkRoutInspectionPlan){
								return false;
							}
							var room = data.member.memberSigning.room.number;
							var member = data.member.personalInfo.name;
							widget.openView({
								url:"eling/elcms/health/healthDailyRecord/healthDailyRecord",
								params:{
									pkMember : data.member.pkMember,
									name : room + " " + member,
									date : data.date,
									fatherNode : "eling/elcms/schedule/healthRoutSchedule/healthRoutSchedule"
								},
								isAllowBack:true
							});
							return false;
						}
					}
				},	
				translate:{
					title:"title",
					start:"date",
					className:function(data){
						var user = data.userType;
						var level = data.routLevel;
						//已完成的均显示为绿色
						if(data.finishDate != null && data.finishDate != ""){
							return "event-green J-green";
						}
						if("Doctor"==user){
							return "event-blue J-blue";
						}
						if("Building"==user){
							if("ONE"==level){
								return "event-red J-red";
							}
							return "event-orange J-orange";
						}
					}
				},
				events:{

				}
			});
			calendar.refresh({
				pkBuilding:widget.get("subnav").getValue("building"),
				date:moment().valueOf(),
				fetchProperties:fetchString
			});
			//记录日历当前的月份
			$(".J-calendarMonth").attr("data-key", moment().month().valueOf());
			this.set("calendar",calendar);
			
			var doctorForm=new Verform({
				parentNode:".J-doctorCard",
				autoRender:false,
				saveaction:function(){
					//获取记录中的原医生巡检日
					var oldBuilding = parseInt($(".J-doctor").attr("data-value"));
					var oldDate = moment(parseInt($(".J-doctor").attr("data-key")));
					var oldMonth =moment(oldDate).month();
					var oldDay = moment(oldDate).date();
					var data = widget.get("calendar").getData();
					var hasFinished = false;
					//判断当前月是否有已完成的巡检计划，如果有，则不能重新生成计划
					if(data){
						for (var i=0; i<data.length; i++){
							var date = moment(data[i].date);
							var planMonth = moment(date).month();
							var planDay = moment(date).date();
							if(data[i].building.pkBuilding == oldBuilding 
								&& null != data[i].finishDate && data[i].userType == "Doctor" 
								&& oldMonth == planMonth && oldDay == planDay){
								hasFinished = true;
								Dialog.alert({
									content:"本日有医生巡检任务已完成，不能重新生成医生巡检计划"
								});
							}
						}
					}
					if (!hasFinished){
						aw.saveOrUpdate("api/doctorHealthRoutPlan/save",$("#doctorPlanView").serialize(),function(){
							widget.hide([".J-calendar",".J-doctorCard"]).show([".J-doctorList",".J-return"]);
							widget.get("doctorGrid").refresh({
								building:pkBuildings,
								fetchProperties:"*,building.name,doctor.name"});
						});	
					}
				},
				cancelaction:function(){
					widget.hide([".J-calendar",".J-doctorCard"]).show([".J-doctorList",".J-return"]);
				},
				model:{
					id:"doctorPlanView",
					items:[{
						name:"pkDoctorRoutInsPlan",
						type:"hidden",
						show:false
					},{
						name:"building",
						key:"pkBuilding",
						label:"巡检楼栋",
						value:"name",
						type:"select",
//						url:"api/building/query",
//						params:{
//							fetchProperties: "pkBuilding,name"
//						},
						validate:["required"]
					},{
						name:"doctor",
						key:"pkUser",
						label:"巡检医生",
						value:"name",
						type:"select",
						url : "api/user/role",//TODO 用户角色：wulina 家庭医生
//						params:{
//							roleIn:"8,12,20",
//							fetchProperties: "pkUser,name"
//						},
						lazy:true,
						validate:["required"]
					},{
						name:"date",
						label:"巡检日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"floors",
						label:"楼层",
						validate:["number_split"]
					}]
				}
			});
			this.set("doctorForm",doctorForm);
			
			var doctorGrid=new Grid({
				parentNode:".J-doctorList",
				url:"api/doctorHealthRoutPlan/buildings",
				autoRender:false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								widget.get("doctorForm").render();
								widget.get("doctorForm").reset();
								//设置待巡检楼栋选择项
								$("select.J-building").html(widget._setBuildingSelect(widget));
								widget.get("doctorForm").load("doctor",{
									params:{
										roleIn:"8,12,20",
										fetchProperties: "pkUser,name"
									}
								});
								$("input.J-floors").attr("placeholder","可按照  数字,数字  的格式指定多个楼层");
								widget.hide([".J-calendar",".J-doctorList"]).show([".J-doctorCard",".J-return"]);
							}
						}]
					},
					columns:[{
						key:"building.name",
						name:"巡检楼栋"
					},{
						key:"floors",
						name:"楼层"
					},{
						key:"date",
						name:"巡检日期",
						format:"date"
					},{
						key:"doctor.name",
						name:"家庭医生"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("doctorForm").load("doctor",{
									params:{
										roleIn:"8,12,20",
										fetchProperties: "pkUser,name"
									},
									callback:function(){
										widget.get("doctorForm").render();
										//设置待巡检楼栋选择项
										$("select.J-building").html(widget._setBuildingSelect(widget));
										$("input.J-floors").attr("placeholder","可按照  数字,数字  的格式指定多个楼层");
										$(".J-doctor").attr("data-key", data.date);//用于判断是否有巡检计划已完成
										$(".J-doctor").attr("data-value",data.building.pkBuilding);
										widget.get("doctorForm").setData(data);
										widget.hide([".J-calendar",".J-doctorList"]).show([".J-doctorCard",".J-return"]);
									}
								})
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/doctorHealthRoutPlan/"+data.pkDoctorRoutInsPlan+"/delete",function(){
									widget.get("doctorGrid").refresh({
										building:pkBuildings,
										fetchProperties:"*,building.name,doctor.name"});
									widget.hide([".J-calendar",".J-doctorCard"]).show([".J-doctorList",".J-return"]);
								});
							}
						}]
					}]
				}
			});
			this.set("doctorGrid",doctorGrid);
		}
	});
	module.exports=healthRoutSchedule;
});
