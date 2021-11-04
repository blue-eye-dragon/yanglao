define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	
	var routineworkdefine = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"例行工作定义"
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/routineworkdefine/query",
				model:{
					columns:[{
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
						key:"content",
						name:"例行工作内容"
					},{
						key:"time",
						name:"要求时间",
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
								widget.get("card").reset();
								widget.edit("edit",data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/routineworkdefine/" + data.pkRoutineWorkDefine + "/delete");
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
					var params=$("#routineworkdefine").serializeArray();
					params[3].value=moment().format("YYYY-MM-DD")+" "+params[3].value+":00";
					widget.save("api/routineworkdefine/save",aw.customParam(params));
				},
				model:{
					id:"routineworkdefine",
					items:[{
						name:"pkRoutineWorkDefine",
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
						name:"time",
						label:"要求时间",
						type:"date",
						mode:"H:i"
					},{
						name:"content",
						label:"例行工作内容",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = routineworkdefine;
});