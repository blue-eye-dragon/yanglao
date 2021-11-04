define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var GreenChannelRecord = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"绿色通道服务登记",
					buttonGroup:[{
						id:"date",
						items:[{
		                    key:"0",
		                    value:"本周"
						},{
		                    key:"1",
		                    value:"本月"
						},{
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/greenchannelrecord/query",
				fetchProperties:"*,member.personalInfo.name,member.personalInfo.pkPersonalInfo,member.memberSigning.room.number,hospital.name,recorder.name",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						date:subnav.getValue("date"),
						pkBuilding:subnav.getValue("building")
					};
				},
				model:{
					columns:[{
 						key:"member.personalInfo.name",
 						name:"会员",
 						format:"detail",
 						formatparams:[{
 							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
 						}]
 					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"date",
						name:"陪同就医日期",
						format:"date"
					},{
						key:"matter",
						name:"解决事项"
					},{
						key:"recorder.name",
						name:"记录人"
					},{
						key:"hospital.name",
						name:"医院"
					},{
						key:"remark",
						name:"备注"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								data.number=data.member.memberSigning.room.number;
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/greenchannelrecord/" + data.pkGreenChannelRecord + "/delete");
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
					widget.save("api/greenchannelrecord/save",$("#greenchannelrecord").serialize());
				},
				model:{
					id:"greenchannelrecord",
					items:[{
						name:"pkGreenChannelRecord",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"member",
						label:"会员",
						type:"select",
						url:"api/member/query",
						key:"pkMember",
						value:"personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						validate:["required"]
					},{
						name:"date",
						label:"陪同就医日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					
					},{
						name:"matter",
						label:"解决事项",
						validate:["required"]
					},{
						name:"hospital",
						label:"医院",
						type:"select",
						url:"api/hospital/query",
						key:"pkHospital",
						value:"name",
						validate:["required"]
					},{
						name:"remark",
						label:"备注",
						type:"textarea"
						
					}]
				}
			};
		}
	});
	module.exports = GreenChannelRecord;
});