define(function(require, exports, module) {
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var HouseKeepingAppointment = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"保洁预约",
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					},{
						id:"flowStatus",
						items:[{
		                    key:"Unarrange",
		                    value:"待安排"
						},{
		                    key:"Unconfirmed",
		                    value:"待确认"
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
					}]
				}
			};
		},
				
		initList:function(widget){
			return{
				url:"api/housekeepingappointed/query",
				fetchProperties:"*," +
						"member.personalInfo.name," +
						"housekeepingType.name," +
						"member.memberSigning.room.number," +
						"member.memberSigning.room.pkRoom",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"member.memberSigning.room.building":subnav.getValue("building"),
						flowStatus:subnav.getValue("flowStatus")
					};
				},
				model:{
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"housekeepingType.name",
						name:"保洁类型"
					},{
						key:"appointedDate",
						name:"预约时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"description",
						name:"备注"
					},{
						key:"flowStatus",
						name:"操作",
						format:function(value,row){
							if(value.key=="Unarrange"){
								return "button";
							}else{
								return "";
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rolEL){
								data.room=data.member.memberSigning.room.number;
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rolEL){
								widget.del("api/housekeepingappointment/" + data.pkHousekeepingAppointed + "/delete",function(){
									widget.get("list").refresh();
								});
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					widget.save("api/housekeepingappointment/save",$("#housekeepingappointment").serialize(),function(data){
						widget.get("list").refresh();
					});
				},
				model:{
					id:"housekeepingappointment",
					items:[{
						name:"pkHousekeepingAppointed",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"flowStatus",
						type:"hidden"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,memberSigning.room.number,personalInfo.name"
							};
						},
						type:"select",
						validate:["required"]
					},{
						name:"housekeepingType",
						label:"保洁类型",
						url:"api/housekeepingtype/query",
						key:"pkHousekeepingType",
						value:"name",
						type:"select",
						validate:["required"]
					},{
						name:"appointedDate",
						label:"预约时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = HouseKeepingAppointment;
});