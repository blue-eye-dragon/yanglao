define(function(require, exports, module) {
	var BaseView=require("baseview");
    var Dialog=require("dialog-1.0.0");
    var store=require("store");
	var buildings=store.get("user").buildings || [];

	var Place = BaseView.extend({
		events:{
			"change .J-room":function(e){
				var card=this.get("card");
				var pkRoom=card.getValue("room");
				if(pkRoom){
					card.setAttribute("name","readonly","readonly");
					var current = card.getData("room",{pk:pkRoom});
					card.setValue("name",current.number);
				}else{
					card.removeAttribute("name","readonly");
					card.setValue("name","");
				}
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"位置档案",
					buttonGroup:[{
						id:"buildings",
						items:buildings,
						key:"pkBuilding",
						value:"name",
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("room");
						}
					},{
						id:"check",
						items:[{
							key:"0",
		                    value:"房间"
						},{
		                    key:"1",
		                    value:"公共区"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/place/querylist",
				fetchProperties:"*,building.name,room.number",
				params:function(){
					var subnav = widget.get("subnav");
					return {
						check:subnav.getValue("check"),
						building:subnav.getValue("buildings")
					};
				},
				model:{
					columns:[{
						key:"name",
						name:"位置名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"building.name",
						name:"楼号"
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
								var card=widget.get("card");
								if(data.room){
									card.setAttribute("name","readonly","readonly");
								}else{
									card.removeAttribute("name","readonly");
								}
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/place/" + data.pkPlace + "/delete");
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
					var card=widget.get("card");
					var roomName = card.getValue("room");
					var places = card.getValue("name");
					if(roomName=="" && places==""){
						Dialog.tip({
							title:"房间和位置名称不能同时为空"
						});
					}else{
						widget.save("api/place/save","building="+widget.get("subnav").getValue("buildings")+"&"+$("#place").serialize());
					}
				},
				model:{
					id:"place",
					items:[{
						name:"pkPlace",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"room",
						label:"房间",
						url:"api/room/query",
						params:function(){
							return {
								building:widget.get("subnav").getValue("buildings")
							};
						},
						key:"pkRoom",
						value:"number",
						type:"select"
					},{
						name:"name",
						label:"位置名称"
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = Place;
});