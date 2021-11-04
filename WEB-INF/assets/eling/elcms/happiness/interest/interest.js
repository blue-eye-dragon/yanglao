define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Interest = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"兴趣爱好"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/interest/query",
				model:{
					columns:[{
						key:"name",
						name:"名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
							} 
						}]
					},{
						key:"interesttype.value",
						name:"兴趣爱好类型"
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
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/interest/" + data.pkInterest + "/delete");
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
					widget.save("api/interest/save",$("#interest").serialize());
				},
				model:{
					id:"interest",
					items:[{
						name:"pkInterest",
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
						name:"interesttype",
						label:"兴趣爱好类型",
						type:"select",
						options:[{key:"LITERATUREANDART",value:"文学艺术类"},{key:"SPORT",value:"体育运动类"},{key:"OTHER",value:"其他类"}]
					},{
						name:"description",
						label:"说明",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = Interest;
});