
define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var BaseView=require("baseview");
    var Dialog=require("dialog-1.0.0");
	var OtherService = BaseView.extend({

		initSubnav:function(widget){
			return {
				model:{
					title:"其他服务",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					}],
					time:{
						click:function(time){
							widget.get("list").refresh();
						}
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/otherservice/query",
				fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,member.memberSigning.room.building.*",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
						return {
							createDate:time.start,
							createDateEnd:time.end,
							"member.memberSigning.room.building":subnav.getValue("building")
						};
					
				},
				model:{
					columns:[{
						key:"createDate",
						name:"服务日期",	
						format:"date"	
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
							}
						}]
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"workTime",
						name:"工时(小时)",										
					},{
						key:"serviceContent",
						name:"服务事宜",										
					},{
						key:"operate",
						name:"操作", 	
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/otherservice/" + data.pkOtherService + "/delete");
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
					var data=$("#otherservice").serializeArray();	
					widget.save("api/otherservice/save",$("#otherservice").serialize(),function(data){					
           				widget.get("list").refresh();
           				widget.list2Card(false);						
					});
				},
				model:{
					id:"otherservice",
					items:[{
						name:"pkOtherService",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						validate:["required"]
					},{
						name:"createDate",
						label:"服务日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"workTime",
						label:"工时 (小时)",
						validate:["required"]
					},{
						name:"serviceContent",
						label:"服务事宜",
						type:"textarea",
						validate:["required"],
						height:100
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = OtherService;
});