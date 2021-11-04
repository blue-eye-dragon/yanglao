define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var ActivityRoom = BaseView.extend({

		initSubnav:function(widget){
			return {
				model:{
					title:"活动室"
				}
			};
		},
		initList:function(widget){
			return{
				url:"api/activityroom/query",
				fetchProperties:"*,locator,room.number,room.type.pkRoomType",
				model:{
					columns:[{
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
						key:"room.number",
						name:"房间号 "
					},{
						key:"locator",
						name:"有无定位探头",
						format:function(value,row){
							if(row.locator){
								return '有';
							}else{
								return '无';
							}
                        },
					},{
						key:"galleryful",
						name:"可容纳人数"
					},{
						key:"theme",
						name:"主题"
					},{
						key:"openingTime",
						name:"开放时间",
						format:"date",
						formatparams:{
							mode:"HH:mm"
						}
					},{
						key:"endingTime",
						name:"结束时间",
						format:"date",
						formatparams:{
							mode:"HH:mm"
						}
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
								widget.del("api/activityroom/" + data.pkActivityRoom + "/delete");
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
					var params=$("#activityroom").serializeArray();
					params[9].value=moment().format("YYYY-MM-DD")+" "+params[9].value+":00";
					params[10].value=moment().format("YYYY-MM-DD")+" "+params[10].value+":00";
					widget.save("api/activityroom/save",aw.customParam(params));
				},
				model:{
					id:"activityroom",
					items:[{
						name:"pkActivityRoom",
						type:"hidden",
						show:false
					},{
						name:"innerEquipmentId",
						type:"hidden"
					},{
						name:"outerEquipmentId",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"room",
						key:"pkRoom",
						value:"number",
						url:"api/room/query",
						params:{
							fetchProperties:"pkRoom,number",
						},
						label:"房间号",
						type:"select",
						validate:["required"]
					},{
						name:"locator",
						type:"radiolist",
						label:"有无定位探头",
						list : [ {
							key : true,
							value : "有"
						}, {
							key : false,
							value : "无"
						} ],
						validate:["required"]
					},{
						name:"galleryful",
						label:"可容纳人数",
						validate:["required"]
					},{
						name:"theme",
						label:"主题",
						validate:["required"]
					},{
						name:"openingTime",
						label:"开放时间",
						type:"date",
						mode:"H:i",
						step : 30,
						validate:["required"]
					},{
						name:"endingTime",
						label:"结束时间",
						type:"date",
						mode:"H:i",
						step : 30,
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = ActivityRoom;
});