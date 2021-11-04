define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog = require("dialog-1.0.0");
	
	var ServiceIndicator = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"服务指标定义"
				}
			};
		},
		initList:function(widget){
			return{
				url:"api/svcIndicator/query",
				model:{
					columns:[{
						key:"code",
						name:"指标编码",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"name",
						name:"指标名称"
					},{
						key:"indCondition",
						name:"指标内容"
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
								if (data.pkServiceIndicator <= 2){
									Dialog.alert({
										content:"系统预置服务指标，不能删除"
									});
								}else{
									widget.del("api/svcIndicator/" + data.pkServiceIndicator + "/delete");
								}
								return false;
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
					var data=$("#serviceindicator").serializeArray();
					if (""!=data[0].value && data[0].value <= 2){
						Dialog.alert({
							content:"系统预置服务指标，不能修改"
						});
					}else{
						widget.save("api/svcIndicator/add",$("#serviceindicator").serialize());
					}
				},
				model:{
					id:"serviceindicator",
					items:[{
						name:"pkServiceIndicator",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"code",
						label:"指标编码",
						validate:["required"]
					},{
						name:"name",
						label:"指标名称",
						validate:["required"]
					},{
						name:"field",
						label:"指标字段",
						validate:["required"]
					},{
						name:"operation",
						label:"指标操作",
						validate:["required"]
					},{
						name:"conditions",
						label:"指标条件",
						validate:["required"]
					},{
						name:"description",
						label:"描述",
						type:"textarea",
					}]
				}
			};
		}
	});
	module.exports = ServiceIndicator;
});