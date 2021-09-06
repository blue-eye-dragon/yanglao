define(function(require, exports, module) {
	var BaseView=require("baseview");
	var FeedBack = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
 					title:"问题报告",
 					buttonGroup:[{
						id:"statusQuery",
						items:[{
							key:"NoDeal",
							value:"不处理"
						},{
							key:"Turnneed",
							value:"转需求"
						},{
							key:"Closed",
							value:"已处理"
						},{
							key:"Commited",
							value:"已提交" 
						}],
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh(); 
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/feedback/query",   
				params:function(){
					return { 
						fetchProperties:"*,functionName.display,creator.name,dealer.name",
						status:widget.get("subnav").getValue("statusQuery")
					}; 
				},
				model:{
					columns:[{
						key : "functionName.display", 
						col:"1",
						name : "功能名称 "
					},{
						key : "description",
						col:"4",
						name : "现象描述"
					},{
						key : "createDate",
						col:"1", 
						name : "提交时间",
						format:"date",
	                    formatparams:{
		                    mode:"YYYY-MM-DD"
		                }
					},{
						key : "dealResult",
						col:"1",
						name : "处理结果"
					},{
						key : "dealer.name",
						name : "处理人"
					},{
						key : "dealDate", 
						col:"1",
						name : "处理时间",
						format:"date",
	                    formatparams:{
	                    	mode:"YYYY-MM-DD"
	                    }
					},{
						key:"status",
						name:"处理状态",
						col:"1",
						format:function(value,row){
							if(value=="Closed"){
					          return "已处理";  
							}else if(value=="NoDeal"){
								return "不处理"; 
							}else if(value=="Turnneed"){
								return "转需求"; 
							}else if(value =="Commited"){
								return "已提交"; 
							}
						}
					},{
						key:"status",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEL){
								if(data.dealResult){ 
									widget.edit("detail",data);
								}else{
									widget.edit("edit",data);
								}
							}
						},{
							key:"delete",
							icon:"remove",
							show:function(value,row){
								if(value == "Commited"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEL){
								widget.del("api/feedback/" + data.pkFeedback + "/delete");
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
	                widget.save("api/feedback/save",$("#feedbackreply").serialize()); 
 				},
				model:{
					id:"feedbackreply",
					items:[{
						name:"functionName", 
						key:"pkMenuItem",
						value:"code,display", 
						label:"功能名称 ",
						url:"api/menuitem/query", 
						params:{
							fetchProperties:"pkMenuItem,code,display"
						},
						type:"select", 
						validate:["required"] 
					},{
						label:"现象描述",
						name:"description",
						type:"textarea",
						validate:["required"]
					},{
						name:"pkFeedback",
						type:"hidden"
					}]
				}
			};
		}
	});
	module.exports = FeedBack;
});
