define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var AgentConfig={
			
	/**
	 * 获取标题
	 */
	getSubnavTitle:function(type) {
		if(type =="apply") {
			return "代办申请";
		} else if(type =="collect") {
			return "代办资料收取";
		} else if(type =="handle") {
			return "代办办理完成";
		} else if(type == "return") {
			return "代办资料返还";
		}
	},
	/**
	 * 获取状态
	 */
	getSubnavStatus:function(type) {
		var result = [];	
		if(type =="apply") {
			result.push({
				key:"WillCollect",
				value:"待收取资料"
			},{
				key:"WillHandle",
				value:"待办理"
			},{
				key:"WillReturn",
				value:"待资料返还"
			},{
				key:"Completed",
				value:"已完成"
			})
		}
		if(type =="collect") {
			result.push({
				key:"WillCollect",
				value:"待收取资料"
			},{
				key:"WillHandle",
				value:"待办理"
			})
		}
		if(type =="handle") {
			result.push({
				key:"WillHandle",
				value:"待办理"
			},{
				key:"WillReturn",
				value:"待资料返还"
			})
		}
		if(type =="return") {
			result.push({
				key:"WillReturn",
				value:"待资料返还"
			},{
				key:"Completed",
				value:"已完成"
			})
		}
		return result;
	},
	/**
	 * 获取标题按钮
	 */
	getSubnavButton:function(type,that) {
		var result = [{
				id : "return",
				text : "返回",
				show : false,
				handler : function() {
					that.list2Card(false);
				}
			}];					
		if(type =="apply") {
			result.push({
				id : "add",
				text : "新增",
				handler : function() {
					that.get("card").reset();
					that.list2Card(true);
					return false;
				}
			} )			
		} 
		return result;
	},
	
	/**
	 * 获取form
	 */
	getFormsParams:function(type,widget){
		var result=[{
			name:"pkAgentApply",
			type:"hidden",
		},{
			name:"version",
			defaultValue:"0",
			type:"hidden"
		},{
			name:"agentStatus",
			label:"状态",						
			type:"select",
			options:[{
				key:"WillCollect",
				value:"待收取资料"
			},{
				key:"WillHandle",
				value:"待办理"
			},{
				key:"WillReturn",
				value:"待资料返还"
			},{
				key:"Completed",
				value:"已完成"
			}],
			defaultValue:"WillCollect",
			type:"hidden"

		},{
			name:"member",
			label:"会员",
			url:"api/member/query",
			key:"pkMember",
			value:"memberSigning.room.number,personalInfo.name",
			params:function(){
				return {
					"memberSigning.room.building":widget.get("subnav").getValue("building"),
					fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
				};
			},
			type:"select",
			validate:["required"]
		},{
			name:"serviceCategory",
			key:"pkServiceCategory",
			value:"name",
			label:"服务分类",
			url:"api/servicecategory/query",
			params:{
				fetchProperties:"name,pkServiceCategory"
			},
			type:"select",
			validate:["required"]
			
		},{
			name:"paperType",
			key:"pkPaperType",
			value:"name",
			label:"资料列表",
			url:"api/papertype/query",
			params:{
				fetchProperties:"name,pkPaperType"
			},
			type:"select",
			multi:true,
			validate:["required"]
			
		}];
		
		if(type=="collect"){
			result.push({
				name:"materialCollected",
				key:"pkPaperType",
				value:"name",
				label:"已收取证件",
				url:"api/papertype/query",
				params:{
					fetchProperties:"name,pkPaperType"
				},
				type:"select",
				multi:true,
				validate:["required"]
				
			});
		}
		result.push({
			name:"status",
			defaultValue:"待收取资料",
			label:"状态",
			readonly:true
		},{
			name:"description",
			label:"备注",
			type:"textarea"
	    });

		return result;
	},
	/**
	 * 获取列
	 */
	getColumnsParams:function(type,that){
			var result=[{
				key:"member.personalInfo.name",
				name:"会员",
				format:"detail",
				formatparams:[{
					key:"detail",
					handler:function(index,data,rowEle){								
						that.get("card").reset();					
						that.get("card").setData(data);
						that.get("card").setDisabled(true);	
						that.list2Card(true);
						return false;
					}
				}]
			},{
				key:"member.memberSigning.room.number",
				name:"房间号"
			},{
				key:"createDate",
				name:"创建日期",	
				format:"date"	
			},{
				key:"serviceCategory",
				name:"服务分类",
				format:function(value,row){ 							
					return value ? value.name: "";														
				}
			},{
				key:"paperType",
				name:"资料列表",
				format:function(value,row){ 
					var val="";							
					for (var int = 0; int < value.length; int++) {
					val=val+"、"+value[int].name; 
				 }	
					return val.substr(1) ;
				}
			}];
			if(type=="collect"){
				result.push({
					key:"materialCollected",
					name:"已收取证件",
					format:function(value,row){ 
						var val="";							
						for (var int = 0; int < value.length; int++) {
						val=val+"、"+value[int].name; 
					 }	
						return value ? val.substr(1) : "" ;
					}
				});
			}
			result.push({
				key:"agentStatus.value",
				name:"状态",						
			});
		  if(type=="apply"){
			  result.push({
						key:"operate",
						name:"操作", 	
						format:function(value,row){
							if(row.agentStatus.key=="WillCollect"){
								return "button";
							}else{
								return "";
							}   
 						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								that.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								that.del("api/agentapply/" + data.pkAgentApply + "/delete");
							}
						}]
					})
		  }
		  if(type =="collect"){

			  result.push({
						key:"operate",
						name:"操作", 	
						format:function(value,row){
							if(row.agentStatus.key=="WillCollect"){
								return "button";
							}else{
								return "";
							}   
 						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var form=that.get("card");
								form.reset();	
								form.setAttribute("member","readonly","readonly");
								form.setAttribute("serviceCategory","readonly","readonly");
								form.setAttribute("paperType","readonly","readonly");
								form.setAttribute("status","readonly","readonly");
								form.setAttribute("description","readonly","readonly");
						
								var material=data.paperType;
								var materialCollected=[];
								for(var i=0;i<material.length;i++){
									materialCollected.push(that.get("card").getData("paperType",{
										pk:material[i].pkPaperType
									}));
								}
								that.get("card").load("materialCollected",{
									options:materialCollected
								});
								form.setData(data);
								that.list2Card(true);

								return false;
							}
						}]
					})
		  
		  }
		  if(type =="handle") {
			  result.push({
					key:"operate",
					name:"操作", 	
					format:function(value,row){
						if(row.agentStatus.key=="WillHandle"){
							return "button";
						}else{
							return "";
						}   
					},
					formatparams:[{
						key:"handlecompleted",
						text:"完成",
						handler:function(index,data,rowEle){
							aw.ajax({
								url : "api/agentapply/statusedit",
								type : "POST",
								data : {
									pkAgentApply:data.pkAgentApply
								},
								success : function(data){
									that.get("list").refresh();
								}	
							});
						}
					}]
				})
		  }
		  if(type =="return") {
			  result.push({
					key:"operate",
					name:"操作", 	
					format:function(value,row){
						if(row.agentStatus.key=="WillReturn"){
							return "button";
						}else{
							return "";
						}   
					},
					formatparams:[{
						key:"materialreturn",
						text:"资料返还",
						handler:function(index,data,rowEle){
							aw.ajax({
								url : "api/agentapply/statusedit",
								type : "POST",
								data : {
									pkAgentApply:data.pkAgentApply
								},
								success : function(data){
									that.get("list").refresh();
								}	
							});
						}
					}]
				})
		  }
			return result;
		}
		


	};
	module.exports=AgentConfig;
});
