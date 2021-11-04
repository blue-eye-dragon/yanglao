define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw  = require("ajaxwrapper");
	
	var visitorrecord = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"来访记录",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/visitorrecord/search",
							data:{
								s:str,
								properties:"member.memberSigning.room.number,member.personalInfo.name,visitorTime,numberOfPeople,relationship,creator.name",
								fetchProperties:"*,member.personalInfo.name,member.personalInfo.pkPersonalInfo,member.memberSigning.room.number,creator.name,creator.pkUser",
								
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					},
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();	
							widget.get("card").load("member");
						}
					},{
						id:"date",
						items:[{
		                    key:"0",
		                    value:"本月"
						},{
		                    key:"1",
		                    value:"本周"
						},{
		                    key:"2",
		                    value:"三个月内"
						},{
		                    key:"3",
		                    value:"半年内"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/visitorrecord/queryByDate",
				fetchProperties:"*,member.personalInfo.name,member.personalInfo.pkPersonalInfo,member.memberSigning.room.number,creator.name,creator.pkUser",
				params:function(){
					return {
						date:widget.get("subnav").getValue("date"),
						pkBuilding:widget.get("subnav").getValue("building")
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
								widget.edit("detail",data);
							}
 						}]
 					},{
						key:"member.personalInfo.name",
						name:"会员姓名"
					},{
						key:"visitorTime",
						name:"来访时间",
						format:"date"
					},{
						key:"numberOfPeople",
						name:"人数"
					},{
						key:"relationship",
						name:"与会员关系",
					},{
						key:"creator.name",
						name:"记录人"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								 data.membernumber=data.member.memberSigning.room.number;
								 widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/visitorrecord/" + data.pkVisitorRecord + "/delete");
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
					widget.save("api/visitorrecord/save",$("#visitorrecord").serialize());
				},
				model:{
					id:"visitorrecord",
					items:[{
						name:"pkVisitorRecord",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"creator",
						value:"pkUser",
						type:"hidden"
					},{
						name:"member",
						label:"会员",
						type:"select",
						url:"api/member/query",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name"
					},{
						name:"visitorTime",
						label:"来访日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					
					},{
						name:"numberOfPeople",
						label:"人数",
						validate:["floor"]
					},{
						name:"relationship",
						label:"与会员关系  "
					}]
				}
			};
		}
	});
	module.exports = visitorrecord;
});