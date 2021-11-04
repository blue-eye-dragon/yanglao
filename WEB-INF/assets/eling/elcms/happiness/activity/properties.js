define(function(require,exports,module){
	var enmu = require("enums");
	//多语
	var i18ns = require("i18n");
	var Properties={
		activity_subnav_buttons:function(widget){
			return [{
				id:"adds",
				text:"新增",
				handler:function(){
					var profile=widget.get("profile");
					var subnav =widget.get("subnav");
					profile.reset();
					profile.loadPicture("api/attachment/activityphoto/"+0);
					if(widget.get("params")&&widget.get("params").isCycle==false){
						subnav.hide(["describing"]);
					}
					subnav.hide(["adds","search"]).show("return");
					widget.show(".J-profile").hide(".J-grid");
					return false;
				}
			},{
				id:"return",
				text:"返回",
				show:false,
				handler:function(){
					var subnav =widget.get("subnav");
					if(widget.get("params")&&widget.get("params").isCycle==false){
						subnav.show(["describing"]);
					}
					subnav.hide("return").show(["adds","search"]);
					widget.show(".J-grid").hide(".J-profile");
				}
			}];
		},	
		
		
		
		activity_subnav_buttonGroup:function(widget){
			return[{
				id:"describing",
				tip:"状态",
				items: [{
					key:1,
					value:"未开始"
				},{
					key:2,
					value:"进行中"
				},{
					key:3,
					value:"已结束（3个月内）"
				},{
					key:4,
					value:"全部"
				}],	
				handler:function(key,element){
					widget.get("grid").refresh();
				}
			}] 
		},
		
		getActivityForm:function(widget){
			var items ={}
			if(widget.get("params")&&widget.get("params").isCycle){
				items=this.activity_profile_items(widget).concat(this.activity_profile_cycleitems);
				//调整字段顺序
				items.splice(4,0,items[15]);
				items.splice(16,1);
				items.splice(6,0,items[18]);
				items.splice(19,1);
				items.splice(7,0,items[19]);
				items.splice(20,1);
				items.splice(8,0,items[20]);
				items.splice(21,1);
			}else{
				items=this.activity_profile_items(widget).concat(this.activity_profile_onceitems);
				//调整字段顺序
				items.splice(5,0,items[16]);
				items.splice(17,1);
				items.splice(6,0,items[17]);
				items.splice(18,1);
			}
			return items;
		},
		
		activity_profile_onceitems:[{
			name:"pkActivity",
			type:"hidden",
			validate:["required"]
		},{
			name:"activityStartTime",
			label:"活动开始时间",
			type:"date",
			mode:"Y-m-d H:i",
			step:30,
			validate:["required"]
		},{
			name:"activityEndTime",
			label:"活动结束时间",
			type:"date",
			mode:"Y-m-d H:i",
			step:30,
			validate:["required"]
		},{
			name:"registrationStartTimen",
			label:"报名开始时间",
			type:"date",
			mode:"Y-m-d H:i",
			step:30,
			validate:["required"]
		},{
			name:"registrationEndTimen",
			label:"报名结束时间",
			type:"date",
			mode:"Y-m-d H:i",
			step:30,
			validate:["required"]
		}],
		
		
		activity_profile_cycleitems:[{	
			name:"activityType",
			label:"活动类型(周期)",
			type:"select",
			url:"api/enum/com.eling.elcms.happiness.model.ActivityCycle.ActivityType",
			validate:["required"]
		},{
			name:"pkActivityCycle",
			type:"hidden"
		},{
			name:"update",
			type:"hidden"
		},{
			name:"week",
			label:"星期",
			type:"select",
			options:[{
				key:"one",
				value:"星期一"
			},{
				key:"two",
				value:"星期二"
			},{
				key:"three",
				value:"星期三"
			},{
				key:"four",
				value:"星期四"
			},{
				key:"five",
				value:"星期五"
			},{
				key:"six",
				value:"星期六"
			},{
				key:"seven",
				value:"星期日"
			}],
			validate:["required"]
		},{
			name:"activityStart",
			label:"活动开始时间",
			type:"date",
			mode:"H:i",
			step:30,
			validate:["required"]
		},{
			name:"activityEnd",
			label:"活动结束时间",
			type:"date",
			mode:"H:i",
			step:30,
			validate:["required"]
		},{
			name:"beginDate",
			label:"有效开始日期",
			type:"date",
			defaultValue:moment(),
			validate:["required"]
		},{
			name:"endDate",
			label:"有效结束时间",
			type:"date",
			defaultValue:moment().add("year",1),
			validate:["required"]
		}],
		
		
		activity_profile_items:function(widget){
			return[{
				name:"version",
				defaultValue:"0",
			  	type:"hidden"
			},{
				name:"type",
				defaultValue:widget.get("params") ? widget.get("params").activityType : "",
				type:"hidden"
			},{
				name:"activityRoom",
				type:"hidden"
			},{
				name:"theme",
				label:"主题",
				validate:["required"]
			},{
				name:"activityDescription",
				label:"活动描述",
				type:"textarea"
			},{
				name:"scope",
				label:"活动范围",
				type:"select",
				options:[{
					key:"Inner",
					value:"社区内"
				},{
					key:"Outer",
					value:"社区外"
				}],
				validate:["required"]
			},{
				name:"activityRoomName",
				readonly:true,
				label:"活动室"
			},{
				name:"activitySite",
				label:"活动地点"
				
			},{
				name:"users",
				key:"pkUser",
				value:"name",
				url:"api/user/role",//TODO 用户角色：wulina 秘书
				params:{
					roleIn:"6,11,12,18,19,20,21",
					fetchProperties:"pkUser,name"
				},
				label:"秘书负责人",
				type:"select",
				multi:true,
				validate:["required"]
			},{
				name:"members",
				key:"pkMember",
				value:"personalInfo.name",
				url:"api/member/query",
				params:{
					fetchProperties:"pkMember,personalInfo.name",
				},
				label:i18ns.get("sale_ship_owner","会员")+"负责人",
				type:"select",
				multi:true
			},{
				name:"interestGroups",
				key:"pkInterestGroup",
				value:"name",
				url:"api/interestgroup/queryBydescription",
				params:{
					fetchProperties:"pkInterestGroup,name",
				},
				label:"活动类型",
				type:"select",
				multi:true,
				validate:["required"]
			},{
				name:"mostActivityNumber",
				label:"最多活动人数",
				validate:["required"]
			},{
				name:"mostQueueNumber",
				label:"最多排队人数",
				validate:["required"]
			},{
				name:"contactInformation",
				label:"联系方式",
				validate:["required"]
			},{
			name:"cycle",
			label:"活动类型",
			type:"hidden"
			}]
		},
	};

	module.exports=Properties;
});