define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var MemberShipCardType = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"休闲娱乐方式"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/amusement/query",
				model:{
					columns:[{
						key:"name",
						name:"休闲娱乐方式",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"description",
						name:"描述"
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
								widget.del("api/amusement/" + data.pkAmusementType + "/delete");
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
					widget.save("api/amusement/save",$("#amusement").serialize());
				},
				model:{
					id:"amusement",
					items:[{
						name:"pkAmusementType",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"休闲娱乐方式",
						validate:["required"]	
					},{
						name:"description",
						label:"描述",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = MemberShipCardType;
});