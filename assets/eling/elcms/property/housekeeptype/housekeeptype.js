define(function(require, exports, module) {
	var BaseView=require("baseview");
	var HousekeepingType = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"保洁类型"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/housekeepingtype/query",
				model:{
					columns:[{
						key:"name",
						name:"类型名称",
					},{
						key:"content",
						name:"保洁内容"
					},{
						key:"duration",
						name:"标准用时"
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
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/housekeepingtype/" + data.pkHousekeepingType + "/delete");
								return false;
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
					widget.save("api/housekeepingtype/save",$("#housekeepingtype").serialize());
				},
				model:{
					id:"housekeepingtype",
					items:[{
						name:"pkHousekeepingType",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"类型名称",
						validate:["required"]
					},{
						name:"content",
						label:"保洁内容",
						type:"textarea",
						validate:["required"]
					},{
						name:"duration",
						label:"标准用时",
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
	module.exports = HousekeepingType;
});