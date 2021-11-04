define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var RepairClassify = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"维修分类",
					buttons:[{
						id:"adds",
						text:"新增",
						handler:function(){
							widget.get("card").reset();
							widget.get("subnav").show("return").hide("adds");
							widget.show(".J-card").hide(".J-list,.J-search");
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-list,.J-search").hide(".J-card");
							widget.get("subnav").show(["adds"]).hide(["return"]);
							return false;
						}
					}],
					search:function(str) {
			         	   widget.get("list").loading();
								aw.ajax({
									url:"api/repairclassify/search",
									data:{
										s:str,
										properties:"name,standardDuration,card,description",
									    fetchProperties:"*,card.value"     
									},
									dataType:"json",
									success:function(data){
										widget.get("list").setData(data);
									}
					       });
		           }
			},
			search:function(str) {
         	   widget.get("list").loading();
					aw.ajax({
						url:"api/repairclassify/search",
						data:{
							s:str,
							properties:"name,standardDuration,description",
						    fetchProperties:"*"   
						},
						dataType:"json",
						success:function(data){
							widget.get("list").setData(data);
						}
					});
		         }
	         };
         },
	
		initList:function(widget){
			return {
				url : "api/repairclassify/query",
				model:{
					columns:[{
						key:"name",
						name:"分类名称",
					},{
						key:"standardDuration",
						name:"标准用时（小时）"
					},{
						//key:"card",
						name:"是否必选资产卡片",
						format:function(value,row){
							return row.card==true ? "是" : "否"
						}
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
								widget.get("card").reset();
								widget.edit("edit",data);
								widget.get("subnav").hide("adds");
								widget.show(".J-card").hide(".J-list,.J-search");
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/repairclassify/" + data.pkRepairClassify + "/delete");
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
					widget.save("api/repairclassify/save",$("#repairclassify").serialize());
					widget.get("subnav").show("adds");
					widget.show(".J-search");
				},
  				cancelaction:function(){
  					widget.list2Card(false);
  					widget.get("subnav").show("adds");
  					widget.show(".J-search");
  				},
				model:{
					id:"repairclassify",
					items:[{
						name:"pkRepairClassify",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"分类名称",
						validate:["required"]
					},{
						name:"standardDuration",
						label:"标准用时（小时）",
						validate:["area","required"]
					},{
						name:"card",
						label:"是否必选资产卡片",
						validate:["required"],
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = RepairClassify;
});