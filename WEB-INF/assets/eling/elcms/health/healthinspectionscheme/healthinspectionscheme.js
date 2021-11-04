define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
	var BaseView=require("baseview");
	
	var healthinspectionscheme = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"健康巡检档案",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/healthinspectionscheme/search",
							data:{
								s:str,
								properties:"member.memberSigning.room.number," +
										"member.memberSigning.room.number," +
										"member.personalInfo.name," +
										"targetRecord," +
										"sportSuggestion," +
										"lifeRemind," +
										"regularService," +
										"user.name",
								fetchProperties:"*," +
										"member.pkMember," +
										"member.memberSigning.room.number," +
										"member.personalInfo.name," +
										"user.name"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("subnav").load({
								id:"defaultMembers",
								params:{
									"memberSigning.room.building.pkBuilding":key,
									fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number",
								},
								callback : function(data) {
									widget.get("list").refresh();
								}
							});
						}
					},{
						id:"defaultMembers",
						show:true,
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/healthinspectionscheme/query",
				fetchProperties:"*," +
						"member.pkMember," +
						"member.memberSigning.room.number," +
						"member.personalInfo.name," +
						"user.name",
				params:function(){
					return {
						"orderString":"setDate:desc",
						member:widget.get("subnav").getValue("defaultMembers")
					};
				},
				model:{
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:"会员",
					},{
						key:"setDate",
						name:"制定日期",
						format:"date"
					},{
						key:"targetRecord",
						name:"指标记录"
					},{
						key:"sportSuggestion",
						name:"运动建议"
					},{
						key:"lifeRemind",
						name:"生活提醒"
					},{
						key:"regularService",
						name:"定期健康服务 "
					},{
						key:"user.name",
						name:"制定人"
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/healthinspectionscheme/save","member="+widget.get("subnav").getValue("defaultMembers")+
							"&"+$("#healthInspectionSchemeForm").serialize(),function(data){
						widget.get("list").refresh();
						widget.list2Card(false);
					});
					
				},
				canelaction:function(){
					widget.get("card").reset();
					widget.list2Card(false);
				},
				model:{
					id:"healthInspectionSchemeForm",
					items:[
					{
						name:"pkHealthInspectionScheme",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"targetRecord",
						label:"指标记录",
						type:"textarea",
					},{
						name:"sportSuggestion",
						label:"运动建议",
						type:"textarea"
					},{
						name:"lifeRemind",
						label:"生活提醒",
						type:"textarea"
					},{
						name:"regularService",
						label:"定期健康服务",
						type:"textarea"
					}]
				}
			};
		},
		afterInitComponent : function(params,widget) {
			var subnav = this.get("subnav");
				// 从菜单和秘书工作台打开，需要加载会员
			subnav.show(["defaultMembers"]);
			subnav.load({
					id : "defaultMembers",
					params : {
						"memberSigning.room.building" : subnav.getValue("building"),
						fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number",
				},
				callback : function(data) {
					widget.get("list").refresh();
				}
				});
			}
		
	});
	module.exports = healthinspectionscheme;
});