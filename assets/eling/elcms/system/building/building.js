define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var Building = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"楼宇信息维护"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/buildings",				
				params:function(){
					return {
						fetchProperties:"*,community.name",
					};
				},
				model:{
					columns:[{
						key:"name",
						name:"楼号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"floors",
						name:"层数"
					},{
						key:"community.name",
						name:"所属社区"
					},{
						key:"useType.value",
						name:"用途"
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
								widget.del("api/building/" + data.pkBuilding + "/delete");
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
					widget.save("api/building/add",$("#building").serialize());
					return false;
				},
				model:{
					id:"building",
					items:[{
						name:"pkBuilding",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"name",
						label:"楼号",
						validate:["required"]
					},{
						name:"floors",
						label:"层数",
						validate:["required","floor"]
					},{
						name:"community",
						label:"所属社区",
						key:"pkCommunity",
						value:"name",
						type:"select",
						url:"api/community/query",
						validate:["required"]
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
							key:"Hospital",
							value:"医院"
						},{
							key:"Office",
							value:"办公"
						}],
						validate:["required"]
					},{
						name:"orderCode",
						label:"序号",
						validate:["required","number"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = Building;
});