define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var agentConfig=require("./agent_config");	
	
	var AgentApply = BaseView.extend({
		events:{
			"change .J-serviceCategory":function(e){
				var card=this.get("card");
				var pk=this.get("card").getValue("serviceCategory");
				if(pk){
					aw.ajax({
						url : "api/agentapply/querymaterial",
						type : "POST",
						data : {
							pkServiceCategory:pk,
							fetchProperties:"*,paperType.name"
						},
						success:function(data){
							if(data.length==0){
								$(".J-paperType").val(" ");
								return false;
							}
						
							card.setValue("paperType",data[0].paperType);
							
						}
					});
				}
			}
		},
		initSubnav:function(widget){
			var params=widget.get("params");
			return {
				model:{
					title:agentConfig.getSubnavTitle(params.agentType),
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();	
							widget.get("card").load("member");
						}
					},{
			   			id:"agentStatus",
			   				items:agentConfig.getSubnavStatus(params.agentType),
							handler:function(key,element){								
								widget.get("list").refresh();
							}
						}],
					time:{
						click:function(time){
							widget.get("list").refresh();
						}
					},
					buttons:agentConfig.getSubnavButton(params.agentType,widget)
				}
			};
		},
		initList:function(widget){
			var params=widget.get("params");
			return {
				url:"api/agentapply/query",
				fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,member.memberSigning.room.building.*,serviceCategory.*,paperType.*,materialCollected.*",
				params:function(){
					return {
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
						agentStatus:widget.get("subnav").getValue("agentStatus"),
						createDate:widget.get("subnav").getValue("time").start,
						createDateEnd:widget.get("subnav").getValue("time").end
					};
				},
				model:{
					columns:agentConfig.getColumnsParams(params.agentType,widget)
				}
			};
		},
		initCard:function(widget){
			var params=widget.get("params");
			return {
				compType:"form-1.0.0",
			   	saveaction:function(){
			   		widget.save("api/agentapply/save",$("#agentapply").serialize());
				},
				model:{
					id:"agentapply",
					items:agentConfig.getFormsParams(params.agentType,widget)
				}
		
			};
		}
	});
	module.exports = AgentApply;
});