define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var FeedBackProcess=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"反馈处理",
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
				url:"api/feedback/feedBackQuery",
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
						name:"功能名称 "
					},{
						key:"description",
						col:"4",
						name:"现象描述"
					},{
						key:"creator.name",
						name:"提交人"
					},{
						key:"createDate",
						col:"1",
						name:"提交时间",
						format:"date",
	                    formatparams:{
	                    	mode:"YYYY-MM-DD"
	                    }
					},{
						key:"dealResult",
						col:"1",
						name:"处理结果"
					},{
						key:"dealer.name",
						name:"处理人"
					},{
						key:"dealDate", 
						col:"1",
						name:"处理时间",
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
							}else{
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
								var card=widget.get("card");
								widget.edit("edit",data);
								//点处理，只显示三个状态（共四个）
								var statusThree = card.getData("status");
								for(var  i= 0;i<statusThree.length;i++){
									if(statusThree[i].key=="Commited"){ 
										statusThree.splice(i,1); 
									}
								}
								card.setData("status",statusThree);
								if(data.dealResult!=null){ 
									card.setValue("status",data.status);
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
						name:"status",
						label:"处理状态",
						type:"select",
						options:[{
							key:"Commited",
							value:"已提交"
						},{
							key:"NoDeal",
							value:"不处理"
						},{
							key:"Turnneed",
							value:"转需求"
						},{
							key:"Closed",
							value:"已处理"
						}],
					    validate:["required"]
					},{
						label:"处理结果",
						name:"dealResult",  
						type:"textarea",
						validate:["required"] 
					},{
						name:"pkFeedback",
						type:"hidden"
					},{
						name:"creator.pkUser",
						type:"hidden"
					},{
						name:"createDate",
						type:"hidden" 
					},{
						name:"functionName.pkMenuItem", 
						type:"hidden" 
					},{
						name:"description",
						type:"hidden"
					}]
				}
			};
		}
	});
	
	module.exports=FeedBackProcess;
});