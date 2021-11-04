define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	
	var routineworkdefine = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"夜间巡检工作定义"
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/nightinspectiondefine/query",
				model:{
					columns:[{
						col:2,
						key:"code",
						name:"编码",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						col:6,
						key:"content",
						name:"巡检内容"
					},{
						col:2,
						key:"workTime",
						name:"要求时间",
						format:"date",
						formatparams:{
							mode:"HH:mm"
						}
					},{
						col:2,
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
								widget.del("api/nightinspectiondefine/" + data.pkNightInspectionDefine + "/delete");
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
					var params=$("#nightinspectiondefine").serializeArray();
					params[3].value=moment().format("YYYY-MM-DD")+" "+params[3].value+":00";
					widget.save("api/nightinspectiondefine/save",aw.customParam(params));
				},
				model:{
					id:"nightinspectiondefine",
					items:[{
						name:"pkNightInspectionDefine",
						type:"hidden",
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"code",
						label:"编码",
						validate:["required"]
					},{
						name:"workTime",
						label:"要求时间",
						type:"date",
						mode:"H:i",				
						validate:["required"]
					},{
						name:"content",
						label:"巡检内容",
						type:"textarea",
						height:120,
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = routineworkdefine;
});