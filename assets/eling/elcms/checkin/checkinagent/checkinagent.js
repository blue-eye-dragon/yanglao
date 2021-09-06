define(function(require, exports, module) {
	var BaseView=require("baseview");
	var checkinagent = BaseView.extend({
		initSubnav:function(widget){
			var titleStr = (widget.get("params") && ("life" == widget.get("params").checkinagentType)) ? "生活" : "健康";
			return {
				model:{
					title:"入住后"+titleStr+"指引设置",
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/checkinagent/query",
				params:{
					type:widget.get("params") ? widget.get("params").checkinagentType : "",
				},
				model:{
					columns:[{
						key:"day",
						name:"执行结束时间",
						format:function(value,row){
							return value?"第"+value+"天":"当天";
						}
					},{
						key:"matter",
						name:"入住代办事项"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/checkinagent/" + data.pkCheckInAgent + "/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/checkinagent/save",$("#checkinagent").serialize());
				},
				model:{
					id:"checkinagent",
					items:[{
						name:"pkCheckInAgent",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"type",
						defaultValue:widget.get("params") ? widget.get("params").checkinagentType : "",
						type:"hidden"
					},{
						name:"dayType",
						label:"时间类型",
						type:"hidden",
						defaultValue:"After",
						
					},{
						name:"day",
						label:"执行时间（入住天数）",
						validate:["required","zeronumber"]
					},{
						name:"matter",
						label:"入住代办事项",
						type:"textarea"
					}]
				}
			};
		},
	});
	module.exports = checkinagent;
});
