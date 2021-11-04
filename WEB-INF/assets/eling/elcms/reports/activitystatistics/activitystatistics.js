/**
 *	活动统计
 * 
 */
define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	var selecttype;
	var ActivityStatistics = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"
				+"<div class='J-activityTitle hidden' style='font-size:20px;margin-left:2%;margin-top:10px;'></div>"
				+"<div class='J-list'></div>"
				+"<div class='J-activityList hidden'></div>"
				+"<div class='J-memberList hidden'></div>"
				+"<div class='J-recordgrid hidden'></div>"
				+"<div class='J-PkActivity hidden'></div>"
		},
		_converseType:function(value){
			if (value=="happiness"){
				return "快乐活动";
			}else if (value=="health"){
				return "健康活动";
			}else if (value=="life"){
				return "生活活动";
			}else{
				return "其他活动";
			}
		},
		events:{
			"click .J-activity-theme":function(ele){
				var activitygrid =this.get("activitygrid");
				var index = activitygrid.getIndex(ele.target);
				var data = activitygrid.getData();
				$(".J-PkActivity").attr("data-key", data[index].activity.pkActivity);
				$(".J-activityTitle").text(moment(data[index].activity.activityStartTime).format("YYYY-MM-DD HH:mm")+" "+data[index].activity.theme);
				this.get("recordgrid").refresh();
				this.show([".J-recordgrid"]).hide([".J-list",".J-activityList"]);
				this.get("subnav").show(["return1"]).hide(["status","return"]);
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"活动统计",
					time:{
        				tip:"最新活动时间筛选",
						click:function(time){
							widget.get("grid").refresh();
						}
					},
					buttons:[{
        				id:"return",
        				text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-list"]).hide([".J-activityList",".J-memberList"]);
							widget.get("subnav").show(["time"]).hide(["return","status"]);
							return false;
						}
        				
        			},{
        				id:"return1",
        				text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-activityList"]).hide([".J-recordgrid"]);
							widget.get("subnav").show(["status","return"]).hide(["return1"]);
							return false;
						}
        			}],
        			buttonGroup:[{
        				id:"status",
						tip:"活动状态",
						show:false,
						showAll:true,
						showAllFirst:true,
						items:[{
							key : "End",
							value : "结束"
						},{
							key : "NotBegin",
							value : "未启动"
						},{
							key : "SigningUp",
							value : "报名中"
						},{
							key : "Beginning",
							value : "进行中"
						}
//						,{
//							key : "End",
//							value : "结束"
//						}
						,{
							key : "Cancel",
							value : "作废"
						}],
						handler:function(){
							widget.get("activitygrid").refresh();
						}
        			}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-list",
				url:"api/report/activitystatistics",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						start: subnav.getValue("time").start,
				    	end:  subnav.getValue("time").end,
					};
				},
				model:{
					columns:[{
						key:"activityType",
						name:"活动类型",
						format:function(value,row){
							return widget._converseType(value);
						}
					},{
						key:"activityCount",
						name:"活动次数",
						format:"detail",
 						formatparams:[{
 							key:"activityDetail",
							handler:function(index,data,rowEle){ 
								widget.get("activitygrid").refresh({
									start:widget.get("subnav").getValue("time").start,
							    	end:widget.get("subnav").getValue("time").end,
							    	"activity.status":"",
							    	type:data.activityType });
								widget.get("subnav").setValue("status",""),
								selecttype = data.activityType;
								widget.show([".J-activityList"]).hide([".J-list",".J-memberList"]);
								widget.get("subnav").show(["return","status"]).hide(["time"]);
							}
 						}]
					},{
						key:"peopleCount",
						name:"参加人次"
					},{
						key:"memberCount",
						name:"参加"+i18ns.get("sale_ship_owner","会员")+"数",
						format:"detail",
 						formatparams:[{
 							key:"memberDetail",
							handler:function(index,data,rowEle){ 
								widget.get("membergrid").refresh({
									start:widget.get("subnav").getValue("time").start,
							    	end:widget.get("subnav").getValue("time").end,
							    	type:data.activityType });
								widget.show([".J-memberList"]).hide([".J-list",".J-activityList"]);
								widget.get("subnav").show(["return"]).hide(["time"]);
							}
 						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var activitygrid = new Grid({
				parentNode:".J-activityList",
				autoRender:false,
				url:"api/report/activitysignup/activity",
				fetchProperties : "activity.pkActivity," +
						"activity.theme," +
						"activity.type," +
						"activity.activityStartTime," +
						"activity.activityEndTime," +
						"activity.users," +
						"activity.users.name," +
						"activity.users.pkUser," +
						"activity.mostActivityNumber," +
						"activity.status," +
						"activity.registrationStartTimen," +
						"activity.registrationEndTimen," +
						"successTotal," +
						"queuingTotal," +
						"enrollIn," + 
						"notEnrollIn," +
						"enrollNotIn," +
						"pendConfirm," +
						"partTotal,"+
						"activitySignup.pkActivitysignup," +
						"activitySignup.member.memberSigning.room.number," +
						"activitySignup.member.personalInfo.name," +
						"activitySignup.member.personalInfo.sex," +
						"activitySignup.member.personalInfo.phone," +
						"activitySignup.member.personalInfo.idNumber," +
						"activitySignup.member.personalInfo.mobilePhone,"+
						"activitySignup.registrationTime," +
						"activitySignup.activityStatus," +
						"activitySignup.type," +
						"activitySignup.partStatus",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						type:selecttype,
						"activity.status":subnav.getValue("status"),
						start: subnav.getValue("time").start,
				    	end:  subnav.getValue("time").end,
					};
				},
				model:{					
					columns:[{
						key:"activity.theme",
						name:"活动名称",
						format:function(row,value){
							return "<a href='javascript:void(0);' style='color:red;' class='J-activity-theme'>"+value.activity.theme+"</a>";
						}
					},{
						key:"activity.activityStartTime",
						name:"活动开始时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"activity.activityEndTime",
						name:"活动结束时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"activity.users.name",
						name:"负责人",
						format:function(value,row){
							var names="";
							var users = row.activity.users;
							for(var i=0; i<users.length; i++){
								if (i < users.length-1){
									names += users[i].name +",";
								}else{
									names += users[i].name;
								}
							}
							return names;
						}
					},{
						key:"activity.type",
						name:"活动类型",
						format:function(value,row){
							return widget._converseType(value);
						}
					},{
						key : "activity.status.value",
						name : "活动状态",
					},{
						key:"successTotal",
						name:"报名人数"
					},{
						key:"queuingTotal",
						name:"排队人数"
					},{
						key:"enrollIn",
						name:"报名参加人数"
					},{
						key:"enrollNotIn",
						name:"报名未参加人数"
					},{
						key:"notEnrollIn",
						name:"未报名参加人数"
					},{
						key:"partTotal",
						name:"活动参加总人数"
					}]
				}
			});
			this.set("activitygrid",activitygrid);
			
			var membergrid = new Grid({
				parentNode:".J-memberList",
				autoRender:false,
				url:"api/report/activitystatistics/member",
				fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,member.personalInfo.sex," +
				"member.personalInfo.birthday",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						start: subnav.getValue("time").start,
				    	end:  subnav.getValue("time").end,
					};
				},
				model:{					
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号",
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")+"姓名"
					},{
						key:"member.personalInfo.sex.value",
						name:"性别"
					},{
						key:"age",
						name:"年龄"
					},{
						key:"activityCount",
						name:"参加活动数"
					}]
				}
			});
			this.set("membergrid",membergrid);
			
			var recordgrid = new Grid({
				parentNode : ".J-recordgrid",
				autoRender : false,
				url : "api/activitysignup/query",
				fetchProperties:"pkActivitysignup," +
						"registrationTime," +
						"activityStatus," +
						"partStatus," +
						"member.pkMember," +
						"member.status," +
						"member.personalInfo.name," +
						"member.personalInfo.sex,"+
						"member.personalInfo.birthday," +
						"member.personalInfo.idType," +
						"member.personalInfo.idNumber," +
						"member.personalInfo.phone," +
						"member.personalInfo.mobilePhone,"+
						"member.memberSigning.room.number",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						activity:$(".J-PkActivity").attr("data-key"),
					};
				},
				model:{
					columns:[{
						key : "member",
						name : "会员",
						format:function(row,value){
							return value.member.memberSigning.room.number+" "+value.member.personalInfo.name;
						},
					},{
						key:"member.personalInfo.sex.value",
						name:"会员姓别"
					},{
						key : "member.personalInfo.idNumber",
						name : "身份证号码",
					},{
						key : "member.personalInfo.mobilePhone",
						name : "联系方式",
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
						key : "registrationTime",
						name : "报名时间",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm:ss"
						},
						format:"date",
					},{
						key : "activityStatus.value",
						name : "报名状态",
					},{
						key : "partStatus.value",
						name : "参加状态",
					}]
				}
			});
			this.set("recordgrid",recordgrid);
		}
	});
	module.exports = ActivityStatistics;
});