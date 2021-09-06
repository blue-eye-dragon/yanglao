define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var RoomType = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"房型信息维护",
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/roomType/query",
				fetchProperties:"*,community.name",
				model:{
					columns:[{
						key:"community.name",
						name:"所属社区"
					},{
						key:"name",
						name:"名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"area",
						name:"面积"
					},{
						key:"direction",
						name:"朝向"
					},{
						key:"level",
						name:"楼层"
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
								widget.edit("edit",data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/roomType/" + data.pkRoomType + "/delete");
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
					widget.save("api/roomType/add",$("#roomType").serialize());
				},
				model:{
					id:"roomType",
					items:[{
						name:"pkRoomType",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"community",
						label:"所属社区",
						type:"select",
						url:"api/community/query",
						key:"pkCommunity",
						value:"name",
						validate:["required"]
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"area",
						label:"面积",
						validate:["area"]
					},{
						name:"direction",
						label:"朝向"
					},{
						name:"level",
						label:"楼层",
						validate:["floor"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = RoomType;
});