define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	
	var Room = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"房间信息维护",
					search:function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/room/search",
							data:{
								s:str,
								properties:"number,level,type.name,building.name,useType,status,description",
								fetchProperties:"*,type.name,building.name",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.list2Card(false);
							}
						});
					},
					buttonGroup:[{
						id:"buildings",
						key:"pkBuilding",
						value:"name",
						url:"api/building/query",
						lazy:true,
						items:[],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				autoRender:false,
				url : "api/room/query",
				params:function(){
					return {
						fetchProperties:"*,type.name,building.name",
						pkBuilding:widget.get("subnav").getValue("buildings")
					};
				},
				model:{
					columns:[{
						key:"number",
						name:"房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"level",
						name:"楼层"
					},{
						key:"type.name",
						name:"房型"
					},{
						key:"telnumber",
						name:"房间电话"
						
					},{
						key:"building.name",
						name:"楼宇"
					},{
						key:"useType.value",
						name:"用途"
					},{
						key:"status.value",
						name:"状态"
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
								var card=widget.get("card");
								widget.edit("edit",data);
								//判断当前房间状态不为空  则让房间状态在下列情况下不可编辑
								if(data.status != null && 
										(data.status.key == 'InUse' || data.status.key == 'Appoint' || data.status.key == 'NotLive')){
									card.setValue("status",data.status.key);
									card.setAttribute("status","readonly","readonly");
								}else{
									card.setData("status",[{key:"Empty",value:"空房"},{key:"Occupy",value:"占用"}]);
									card.setValue("status",data.status.key);
								}
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/room/" + data.pkRoom + "/delete");
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
					widget.save("api/room/add",$("#room").serialize());
				},
				model:{
					id:"room",
					items:[{
						name:"pkRoom",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"building",
						label:"楼宇",
						type:"select",
						url:"api/building/query",
						key:"pkBuilding",
						value:"name",
						validate:["required"]
					},{
						name:"type",
						label:"房型",
						type:"select",
						url:"api/roomType/query",
						key:"pkRoomType",
						value:"name",
						validate:["required"]
					},{
						name:"telnumber",
						label:"房间电话",
						validate:["required"]
					},{
						name:"level",
						label:"楼层",
						validate:["required"]
					},{
						name:"number",
						label:"房间号",
						validate:["required"]
					},{
						name:"grossArea",
						label:"建筑面积(M2)"
					},{
						name:"useArea",
						label:"使用面积(M2)"
					},{
						name:"useType",
						label:"用途",
						type:"select",
						options:[{
							key:"Apartment",
							value:"公寓"
						},{
							key:"Hotel",
							value:"酒店"
						},{
							key:"ActivityRoom",
							value:"活动室"
						},{
							key:"Lounge",
							value:"休息室"
						},{
							key:"Office",
							value:"办公"
						},{
							key:"Storehouse",
							value:"仓库"
						},{
							key:"TryToLive",
							value:"试住"
						},{
							key:"RrototypeRoom",
							value:"样板间"
						}],
						validate:["required"]
					},{
						name:"status",
						label:"状态",
						options:[{
							key:"Empty",value:"空房"
						},{
							key:"InUse",value:"使用中"
						},{
							key:"Occupy",value:"占用"
						},{
							key:"Appoint",value:"已预约"
						},{
							key:"NotLive",value:"选房不住"
						}],
						type:"select",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		},
		afterInitComponent:function(params){
			var subnav=this.get("subnav");
			var grid=this.get("list");
			grid.loading();
			subnav.load({
				id:"buildings",
				callback:function(data){
					grid.refresh();
				}
			});
		}
	});
	module.exports = Room;
});