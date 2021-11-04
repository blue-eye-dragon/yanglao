define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	
	var RelationalType = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"关系类型设置",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/relationaltype/search",
							data:{
								s:str,
								properties:"name,description",
								fetchProperties:"pkRelationalType,name,description,version",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.list2Card(false);
							}
						});
					},
					buttons:[{
        				id:"all",
        				text:"全部",
						handler:function(){
							widget.get("list").refresh();
						}
        			},{
        				id:"add",
        				text:"新增",
						handler:function(){
							widget.edit("edit",{});
							widget.get("subnav").hide(["all","add","search"]).show("return");
						}
        			
        			},{
        				id:"return",
        				text:"返回",
        				show:false,
						handler:function(){
							widget.list2Card(false);
							widget.get("subnav").show(["all","add","search"]).hide("return");
						}
        			}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/relationaltype/query",
				fetchProperties:"pkRelationalType,name,description,version",
				model:{
					columns:[{
						col:2,
						key:"name",
						name:"名称"
					},{
						col:8,
						key:"description",
						name:"描述"
					},{
						col:2,
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								widget.get("subnav").hide(["all","add","search"]).show("return");
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/relationaltype/" + data.pkRelationalType + "/delete");
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
					widget.save("api/relationaltype/save",$("#relationaltype").serialize());
				},
				model:{
					id:"relationaltype",
					items:[{
						name:"pkRelationalType",
						type:"hidden"
					},{
						name:"version",
						type:"hidden"
					
					},{
						name:"name",
						label:"名称",
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
	module.exports = RelationalType;
});