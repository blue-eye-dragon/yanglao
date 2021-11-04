define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	
	var Disease = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"疾病档案",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/disease/search",
							data:{
								s:str,
								properties:"name,description"
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
				url : "api/disease/query",
				model:{
					columns:[{
						key:"name",
						name:"名称",
						col:"1",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"critical",
						name:"重大疾病",
						col:"1",
						format:function(value,row){
							if(value){
								return "是"
							}else{
								return "否"
							}
						}
					},{
						key:"description",
						name:"描述",
						col:"8",
						type:"textarea"
					},{
						key:"operate",
						name:"操作",
						col:"2",
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
								widget.del("api/disease/" + data.pkDisease + "/delete");
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
					widget.save("api/disease/add",$("#disease").serialize());
				},
				model:{
					id:"disease",
					items:[{
						name:"pkDisease",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
        				name:"critical",
        				label:"重大疾病",
        				type:"checklist",
        				list:[{
        					key:true,
        					value:"是"
        				}]
        			},{
						name:"description",
						label:"描述",
						height:"500",
						type:"textarea",
					}]
				}
			};
		}
	});
	module.exports = Disease;
});