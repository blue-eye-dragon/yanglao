define(function(require, exports, module) {
	var BaseView=require("baseview");
    var aw = require("ajaxwrapper");
  //多语
	var i18ns = require("i18n");
    var bu=[];
	
	aw.ajax({
		url:"api/housekeepinger/query",
		type:"POST",
		dataType:"json",
		async:false,
		success:function(data){
			bu=data;
			bu.push({pkHousekeepinger:"",name:"全部"});
		}
	});
    
	var HouseKeepingAppointment = BaseView.extend({
		events:function(){},
		
		initSubnav:function(widget){
			var buttonGroup=[{
				id:"flowStatus",
				items:[{
                    key:"Unconfirmed",
                    value:"待确认"
				},{
                    key:"Unarrange",
                    value:"待安排"
				},{
					key:"Unfinished",
                    value:"待结束"
				},{
					key:"Finish",
					value:"结束"
				}],
				handler:function(key,element){
					widget.get("list").refresh();
				}
			}];
					
			buttonGroup.splice(0,0,{
				id:"housekeepingers",
				key:"pkHousekeepinger",
				value:"name",
				items: bu || [],	
				handler:function(key,element){
					widget.get("list").refresh();
				}
			});
					
			return {
				model:{
					title:"保洁员安排查询",
					buttonGroup:buttonGroup,
					buttons:[],
					time:{
						tip:"保洁日期",
						click:function(time){
							widget.get("list").refresh();
						},
					}
				}
			};
		},
		initList:function(widget){
			return{
				url:"api/housekeepingappointed/query",
				params:function(){
					var subnav=widget.get("subnav");
					var pkHousekeepinger=subnav.getValue("housekeepingers");
					if(pkHousekeepinger===""){
						return {
							finishDate:subnav.getValue("time").start,
							finishDateEnd:subnav.getValue("time").end,
							flowStatus:subnav.getValue("flowStatus"),
							fetchProperties:"*,housekeepingers.name,housekeepingers.phone,member.personalInfo.name," +
								"housekeepingType.name,member.memberSigning.room.number,member.memberSigning.room.pkRoom"
						};
					}
					return {
						finishDate:subnav.getValue("time").start,
						finishDateEnd:subnav.getValue("time").end,
						housekeepingers:subnav.getValue("housekeepingers"),
						flowStatus:subnav.getValue("flowStatus"),
						fetchProperties:"*,housekeepingers.name,housekeepingers.phone,member.personalInfo.name," +
							"housekeepingType.name,member.memberSigning.room.number,member.memberSigning.room.pkRoom"
					};
				},
				model:{
					columns:[{
						key:"housekeepingers",
						name:"保洁员",
						format:function(value,row){
							var names= "";
							for ( var i in value) {
								names +=value[i].name + ",";
							}
							return names.substring(0, names.length-1);
						}
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"appointedDate",
						name:"预约日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"housekeepingers",
						name:"电话",
						format:function(value,row){
							var phones= "";
							for ( var i in value) {
								phones +=value[i].phone + ",";
							}
							return phones.substring(0, phones.length-1);
						}
					},{
						key:"flowStatus.value",
						name:"状态"
					}]
				}
			};
		}
	});
	module.exports = HouseKeepingAppointment;
});