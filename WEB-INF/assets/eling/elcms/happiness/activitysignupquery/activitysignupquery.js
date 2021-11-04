define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
	var Grid = require("grid-1.0.0");
	var Subnav = require("subnav-1.0.0");
	var Panel = require("panel");
	var enmu = require("enums");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
				 "<div class='J-panel'></div>"+
	  			 "<div class='J-list'></div>"+
	  			 "<div class='J-gridPrint'></div>";
	var Activitysignupquery = require('elview').extend({
		attrs : {
			template : template 
		},
		setPrintGridTitle:function(){
			var length = this.get("gridPrint").getData().length;
			var title="活动报名人数合计"+length+"人";
			this.get("gridPrint").setTitle(title);
		}, 
		setGridTitle:function(){
			var length = this.get("grid").getData().length;
			var title="活动报名人数合计"+length+"人";
			this.get("grid").setTitle(title);
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"活动报名查询",
					buttons:[{
						id:"print",
						text:"打印",
						handler:function(){
							var subnav=widget.get("subnav");
							subnav.setTitle(subnav.getText("act"));
							subnav.hide(["act","print","building","order","describing","toexcel","activityStatus"]);
							widget.hide([".J-list"]).show([".J-gridPrint"]);
							var data=widget.get("grid").getData();
							widget.get("gridPrint").setData(data);
							widget.setPrintGridTitle();
							window.print();
							subnav.setTitle("活动报名查询");
							var params = widget.get("params");
							if(params && params.pkActivity){
								subnav.hide(["act","describing","activityStatus","building","order"]).show(["print","toexcel"]);	
							}else{								
								subnav.show(["act","print","building","order","describing","toexcel","activityStatus"]);
							}
							widget.hide([".J-gridPrint"]).show([".J-list"]);
						}
					},{
						id:"toexcel",
 						text:"导出",
 						handler:function(){
 							var params = widget.get("params");
 							var activity = (params && params.pkActivity ? params.pkActivity : widget.get("subnav").getValue("act"));
 							window.open("api/activitysignup/toexcel?orderString="+
 									widget.get("subnav").getValue("order")+"&activityStatus="+
 									widget.get("subnav").getValue("activityStatus")+"&member.memberSigning.room.building="+
 									widget.get("subnav").getValue("building")+"&activity="+activity);
 							return false;
 	 					}
					}],
					buttonGroup:[{
						id:"order",
						tip:"排序",
						items:[{
		                    key:"member.memberSigning.room.number",
		                    value:"房间号"
						},{
		                    key:"registrationTime",
		                    value:"报名时间"
						},{
		                    key:"activityStatus:desc",
		                    value:"报名状态"
						}],
						handler:function(key,element){
							aw.ajax({
								url:"api/activitysignup/queryNormal",
								dataType:"json",
								data : {
									orderString:key,
									"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
									"activityStatus":widget.get("subnav").getValue("activityStatus"),
									"activity":subnav.getValue("act"),
									"member":widget.get("params") ? widget.get("params").pkMember : "",
									fetchProperties:"*,member.personalInfo.name," +
											"member.personalInfo.sex," +
											"member.personalInfo.idNumber," +
											"member.personalInfo.phone," +
											"member.personalInfo.mobilePhone," +
											"member.memberSigning.room.number," +
											"activity.mostActivityNumber" 
								},
								success:function(data){
									grid.setData(data);
									widget.setGridTitle();
									widget.setPrintGridTitle();
								}
							});
						}
					},{
						id:"building",
						key:"pkBuilding",
						value:"name",
						url:"api/building/query",
						showAll:true,
						showAllFirst:true,
						tip:"楼宇",
						items:[],
						handler:function(key,element){
							widget.get("grid").refresh({
								orderString:widget.get("subnav").getValue("order"),
								"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
								"activityStatus":widget.get("subnav").getValue("activityStatus"),
								"activity":widget.get("subnav").getValue("act"),
								"member":widget.get("params") ? widget.get("params").pkMember : "",
								fetchProperties:"*,member.personalInfo.name," +
										"member.personalInfo.sex," +
										"member.personalInfo.idNumber," +
										"member.personalInfo.phone," +
										"member.personalInfo.mobilePhone," +
										"member.memberSigning.room.number," +
										"activity.mostActivityNumber" 
							},function(){
								widget.setGridTitle();
								widget.setPrintGridTitle();
							});
						}
					},{
						id:"describing",
						tip:"活动状态",
						items:[{
							key:1,
							value:"未开始"
						},{
							key:3,
							value:"已结束（3个月内）"
						}],	
						handler:function(key,element){
							var subnav=widget.get("subnav");
							subnav.load({
								id:"act",
								url:"api/activity/queryBydescribing",
								params:{
									type:widget.get("params") ? widget.get("params").activitysignupqueryType : "",
									describing:subnav.getValue("describing"),
									fetchProperties:"*,users.name,members.personalInfo.name,interestGroups.description"
								},
								callback:function(data){
									widget.get("grid").refresh({
										orderString:widget.get("subnav").getValue("order"),
										"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
										"activityStatus":widget.get("subnav").getValue("activityStatus"),
										"activity":subnav.getValue("act"),
										"member":widget.get("params") ? widget.get("params").pkMember : "",
										fetchProperties:"*,member.personalInfo.name," +
												"member.personalInfo.sex," +
												"member.personalInfo.idNumber," +
												"member.personalInfo.phone," +
												"member.personalInfo.mobilePhone," +
												"member.memberSigning.room.number," +
												"activity.mostActivityNumber" 
									},function(){
										widget.setGridTitle();
										widget.setPrintGridTitle();
									});
									widget.get("panel").refresh({
										pkActivity:subnav.getValue("act"),
										fetchProperties:"*,users.name,members.personalInfo.name,interestGroups.description,interestGroups.name"
									});
								}
							});
						}
					},{
						id:"activityStatus",
						tip:"活动报名状态",
						showAll:true,
						showAllFirst:true,
						items:enmu["com.eling.elcms.happiness.model.Activitysignup.ActivityStatus"],	
						handler:function(key,element){
							widget.get("grid").refresh({
								orderString:widget.get("subnav").getValue("order"),
								"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
								"activityStatus":key,
								"activity":widget.get("subnav").getValue("act"),
								"member":widget.get("params") ? widget.get("params").pkMember : "",
								fetchProperties:"*,member.personalInfo.name," +
										"member.personalInfo.sex," +
										"member.personalInfo.idNumber," +
										"member.personalInfo.phone," +
										"member.personalInfo.mobilePhone," +
										"member.memberSigning.room.number," +
										"activity.mostActivityNumber" 
							},function(){
								widget.setGridTitle();
								widget.setPrintGridTitle();
							});
						}
					},{
						id:"act",
						key:"pkActivity",
						tip:"活动主题",
						format:function(data){
							if(data){
								return moment(data.activityStartTime).format("YYYY-MM-DD")+" "+data.theme
							}else{
								return "";
							}
						},
						handler:function(key,element){
							widget.get("panel").refresh({
								pkActivity:key,
								fetchProperties:"*,users.name,members.personalInfo.name,interestGroups.description,interestGroups.name"
							});
							widget.get("grid").refresh({
								orderString:widget.get("subnav").getValue("order"),
								"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
								"activityStatus":widget.get("subnav").getValue("activityStatus"),
								"activity":subnav.getValue("act"),
								"member":widget.get("params") ? widget.get("params").pkMember : "",
								fetchProperties:"*,member.personalInfo.name," +
										"member.personalInfo.sex," +
										"member.personalInfo.idNumber," +
										"member.personalInfo.phone," +
										"member.personalInfo.mobilePhone," +
										"member.memberSigning.room.number," +
										"activity.mostActivityNumber" 
							},function(){
								widget.setGridTitle();
								widget.setPrintGridTitle();
							});
						}
					}]
		        }
			});
			this.set("subnav",subnav);
			var panel=new Panel({
				parentNode:".J-panel",
				url:"api/activity/queryPkActivity",
				autoRender:false,
				model:{
					img:{
						show:true,
						idAttribute:"pkActivity",
						url:"api/attachment/activityphoto/"
					}, 
					items:[{
						name:"theme",
						label:"主题"
					},{
						name:"activitySite",
						label:"活动地点"
					},{
						name:"interestGroups",
						label:"活动类型",
						format:function(value,row){
							var interestGroups = "";
							for(var i=0;i<value.length;i++){
								interestGroups += value[i].name+" ";
							}
							return interestGroups;
						}
					},{
						name:"mostActivityNumber",
						label:"人数上限"
					},{
						name:"contactInformation",
						label:"联系方式"
					},{
						name:"scope",
						label:"活动范围",
						format:function(value,row){
							return value ? value.value : " ";
						}
					},{
						name:"sportIntensity",
						label:"活动强度",
						format:function(value,row){
							
							if(value=="High"){
								return "高";
							}
							else if(value == "Centre"){
								return "中";
							}
							else if(value == "Low"){
								return "低";
							}
							else{
								return " ";
							}
						}
					},{
						name:"members",
						label:i18ns.get("sale_ship_owner","会员")+"负责人",
						format:function(value,row){
							var members = "";
							for(var i=0;i<value.length;i++){
								members += value[i].personalInfo.name+" ";
							}
							return members;
						}
					}]
				}
			});
			
			panel.refresh({
				fetchProperties:"*,users.name,members.personalInfo.name,interestGroups.description",
				pkActivity:subnav.getValue("act")
			},function(data){
				panel.loadPicture("api/attachment/activityphoto/"+data.pkActivity);
			});
			this.set("panel",panel);
				
			var grid=new Grid({
				parentNode:".J-list",
				url:"api/activitysignup/queryNormal",
				autoRender:false,
				params:function(){
					return {
						orderString:widget.get("subnav").getValue("order"),
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
						"activity":subnav.getValue("act"),
						"member":widget.get("params") ? widget.get("params").pkMember : "",
						fetchProperties:"*,member.personalInfo.name," +
								"member.personalInfo.sex," +
								"member.personalInfo.idNumber," +
								"member.personalInfo.phone," +
								"member.personalInfo.mobilePhone," +
								"member.memberSigning.room.number," +
								"activity.mostActivityNumber" 
					};
				},
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")+"姓名"
					},{
						key:"member.personalInfo.sex.value",
						name:i18ns.get("sale_ship_owner","会员")+"姓别"
					},{
						key:"member.personalInfo.idNumber",
						name:"身份证号"
					},{
						key:"member.personalInfo.mobilePhone",
						name:"联系方式",
						format:function(value,row){
							var phone = row.member.personalInfo.phone;
							var mobile = row.member.personalInfo.mobilePhone;
							var str = "";
							if(phone!=""){
								str += phone;
							}
							if (phone!="" && mobile!=""){
								str += "/";
							}
							if(mobile!=""){
								str += mobile;
							}	
							return str;
						}
					},{
						key:"registrationTime",
						name:"报名时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm:ss"
						}
					},{
						key:"activityStatus.value",
						name:"状态"
					}]
				}
			});
			this.set("grid",grid);
			
			var gridPrint=new Grid({
				parentNode:".J-gridPrint",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")+"姓名"
					},{
						key:"member.personalInfo.sex.value",
						name:i18ns.get("sale_ship_owner","会员")+"姓别"
					},{
						key:"member.personalInfo.idNumber",
						name:"身份证号"
					},{
						key:"member.personalInfo.mobilePhone",
						name:"联系方式",
						format:function(value,row){
							var phone = row.member.personalInfo.phone;
							var mobile = row.member.personalInfo.mobilePhone;
							var str = "";
							if(phone!=""){
								str += phone;
							}
							if (phone!="" && mobile!=""){
								str += "/";
							}
							if(mobile!=""){
								str += mobile;
							}	
							return str;
						}
					},{
						key:"registrationTime",
						name:"报名时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm:ss"
						}
					},{
						key:"status",
						name:"状态",
						format:function(value,row){
							if(value){
								return "报名成功";
							}else{
								return "排队";
							}
						}
					}]
				}
			});
			this.set("gridPrint",gridPrint);
						
		},afterInitComponent:function(params,widget){
			var subnav=this.get("subnav");
			widget.hide([".J-gridPrint"]);
			var grid=widget.get("grid");
			grid.loading();
			var params = widget.get("params");
			if(params && params.pkActivity){
				widget.get("grid").refresh({
					orderString:widget.get("subnav").getValue("order"),
					"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
					"activityStatus":widget.get("subnav").getValue("activityStatus"),
					"activity":params.pkActivity,
					fetchProperties:"*,member.personalInfo.name," +
							"member.personalInfo.sex," +
							"member.personalInfo.idNumber," +
							"member.personalInfo.phone," +
							"member.personalInfo.mobilePhone," +
							"member.memberSigning.room.number," +
							"activity.mostActivityNumber" 
				},function(){
					widget.setGridTitle();
					widget.setPrintGridTitle();
				});
				widget.get("panel").refresh({
					fetchProperties:"*,users.name,members.personalInfo.name,interestGroups.description,interestGroups.name",
					pkActivity:params.pkActivity,
					member:widget.get("params") ? widget.get("params").pkMember : ""
				},function(data){
					widget.get("panel").loadPicture("api/attachment/activityphoto/"+params.pkActivity);
				});
				subnav.setValue("act", params.pkActivity);
				subnav.hide(["act","describing","activityStatus","building","order"]).show(["print","toexcel"]);				
			}else{
				subnav.load({
					id:"building",
					callback:function(data){
						grid.refresh({
							orderString:widget.get("subnav").getValue("order"),
							"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
							"activityStatus":widget.get("subnav").getValue("activityStatus"),
							"activity":params && params.pkActivity ? params.pkActivity : subnav.getValue("act"),
							"member":params&&params.pkMember ? params.pkMember : "",
							fetchProperties:"*,member.personalInfo.name," +
									"member.personalInfo.sex," +
									"member.personalInfo.idNumber," +
									"member.personalInfo.phone," +
									"member.personalInfo.mobilePhone," +
									"member.memberSigning.room.number," +
									"activity.mostActivityNumber" 
						},function(){
							widget.setGridTitle();
							widget.setPrintGridTitle();
						});
					}
				});
				subnav.load({
					id:"act",
					url:"api/activity/queryBydescribing",
					params:{
						type : widget.get("params") ? widget.get("params").activitysignupqueryType : "",
						describing : subnav.getValue("describing"),
						fetchProperties:"*,users.name,members.personalInfo.name,interestGroups.description"
					},
					callback:function(data){
						widget.get("grid").refresh({
							orderString:widget.get("subnav").getValue("order"),
							"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
							"activityStatus":widget.get("subnav").getValue("activityStatus"),
							"activity":subnav.getValue("act"),
							"member":widget.get("params") ? widget.get("params").pkMember : "",
							fetchProperties:"*,member.personalInfo.name," +
									"member.personalInfo.sex," +
									"member.personalInfo.idNumber," +
									"member.personalInfo.phone," +
									"member.personalInfo.mobilePhone," +
									"member.memberSigning.room.number," +
									"activity.mostActivityNumber" 
						},function(){
							widget.setGridTitle();
							widget.setPrintGridTitle();
						});
						widget.get("panel").refresh({
							fetchProperties:"*,users.name,members.personalInfo.name,interestGroups.description,interestGroups.name",
							pkActivity:subnav.getValue("act"),
							member:widget.get("params") ? widget.get("params").pkMember : ""
						},function(data){
							widget.get("panel").loadPicture("api/attachment/activityphoto/"+subnav.getValue("act"));
						});
					}
				});
			}
		}
	});
	
	module.exports = Activitysignupquery;
});