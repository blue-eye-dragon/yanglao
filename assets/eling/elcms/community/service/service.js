define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var Dialog = require("dialog-1.0.0");
	
	var Service = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"服务定义",
					search:function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/service/search",
							data:{
								s:str,
								properties:"code,name,type.name,serviceGroup",
								fetchProperties:"*,type.name",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.list2Card(false);
							}
						});
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/service/query",
				params:{
					fetchProperties:"*,type.name",
				},
				model:{
					columns:[{
						key:"code",
						name:"服务编码"
					},{
						key:"name",
						name:"服务名称",
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
						key:"type.name",
						name:"服务类型"
					},{
						key:"serviceGroup",
						name:"服务分组"
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
								if (data.pkService <= 3){
									Dialog.alert({
										content:"系统预置服务，不能删除"
									});
								}else{									
									widget.del("api/service/" + data.pkService + "/delete");
								}
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
					var data=$("#service").serializeArray();
					if (""!=data[0].value && data[0].value <= 3){
						Dialog.alert({
							content:"系统预置服务，不能修改"
						});
					}else{
						widget.save("api/service/add",$("#service").serialize());
					}
				},
				model:{
					id:"service",
					items:[{
						name:"pkService",
						type:"hidden"
					},{
						name:"code",
						label:"服务编码",
						validate:["required"]
					},{
						name:"name",
						label:"服务名称",
						validate:["required"]
					},{
						name:"type",
						label:"服务类型",
						type:"select",
						url:"api/servicetype/query",
						params:{
							fetchProperties:"pkServiceType,name"
						},
						key:"pkServiceType",
						value:"name",
						validate:["required"]
					},{
						name:"serviceGroup",
						label:"服务分组"
					},{
						name:"priority",
						label:"服务优先级",
						type:"select",
						options:[{
							key:"I",
							value:"一级"
						},{
							key:"II",
							value:"二级"
						},{
							key:"III",
							value:"三级"
						}]
					},{
						name:"duration",
						label:"服务时长(分钟)",
						validate:["required","number"]
					},{
						name:"description",
						label:"描述",
						type:"textarea",
					}]
				}
			};
		}
	});
	module.exports = Service;
});
