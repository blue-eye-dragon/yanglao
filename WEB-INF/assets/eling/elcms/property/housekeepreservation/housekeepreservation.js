define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var BaseView=require("baseview");
	var Housekeepreservation = BaseView.extend({
		initSubnav:function(widget){
			var buttonGroup=[{
				id:"building",
				showAll:true,
				showAllFirst:true,
				handler:function(key,element){
					widget.get("list").refresh();
				}
			},{
				id:"flowStatus",
				items: [{
					key:"Unarrange",
					value:"待安排"
				},{
					key:"Unfinished",
					value:"待结束"
				}],
				handler:function(key,element){
					widget.get("list").refresh();
				}
			}];
			return {
				model:{
					title:"保洁预约处理",
					buttonGroup:buttonGroup,
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
						}
					}]
				}
			};
		},
		initList:function(widget){
			return{
				url:"api/housekeepingappointed/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"member.memberSigning.room.building":subnav.getValue("building"),
						flowStatus:subnav.getValue("flowStatus"),
						fetchProperties:"*,member.personalInfo.name,housekeepingType.name," +
							"member.memberSigning.room.number,member.memberSigning.room.pkRoom,housekeepingers.name,"+
							"housekeepingers.phone,confirmPerson.name"
					};
				},
				model:{
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("detail",data);
								widget.list2Card(true);
								return false;
							}
						}]
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"housekeepingers",
						name:"保洁员电话",
						format:function(value,row){
							var phones= "";
							for ( var i in value) {
								phones +=value[i].phone + ",";
							}
							return phones.substring(0, phones.length-1);
						}
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
						key:"description",
						name:"备注"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("edit",data);
								widget.get("card").setValue("beginDate",data.appointedDate);
								widget.list2Card(true)
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return{
				compType:"form-1.0.0",
				saveaction:function(){
				
					widget.save("api/housekeepingappointed/addhousekeepinger",$("#housekeepingAppointed").serialize(),function(data){
						widget.get("list").refresh();
					});
				},
				model:{
					id:"housekeepingAppointed",
					items:[{
						name:"pkHousekeepingAppointed",
						type:"hidden"
					},{
						name:"housekeepingers",
						key:"pkHousekeepinger",
						value:"name",
						url:"api/housekeepinger/query",
						label:"保洁工",
						params:{
							fetchProperties:"pkHousekeepinger,name",
						},
						type:"select",
						multi:true,
						validate:["required"]
					},{
						name:"beginDate",
						label:"保洁服务开始时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = Housekeepreservation;
});