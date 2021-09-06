define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Organization = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"节日"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/hoilday/query",
				model:{
					columns:[{
						key:"name",
						name:"节日名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"date",
						name:"节日日期",
						format:"date",
						formatparams:{
							mode:"MM-DD"
						}
					},{
						key:"lunar",
						name:"阴历/阳历",
						format:function(value){
							return value ? "阴历" : "阳历";
						}
					},
					{
						key:"description",
						name:"节日描述"
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
								widget.del("api/hoilday/" + data.pkHoilday + "/delete");
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
					widget.save("api/hoilday/save",$("#hoilday").serialize());
				},
				model:{
					id:"hoilday",
					items:[{
						name:"pkHoilday",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"节日名称",
						validate:["names"]
					},{
						name:"lunar",
						label:"请选择",
						type:"radiolist",
						list:[{
							key:true,
							value:"阴历"
						},{
							key:false,
							value:"阳历"
								
						}],
						validate:["required"]
					},
					{
						name:"date",
						label:"节日日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"description",
						label:"描述",
						type:"textarea",
						validate:["description"]
					}]
				}
			};
		}
	});
	module.exports = Organization;
});