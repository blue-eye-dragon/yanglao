define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	
	var healthstatuschange = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"健康状态变更审批",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"date",
						items:[{
		                    key:"0",
		                    value:"本月"
						},{
		                    key:"1",
		                    value:"三月内"
						},{
							key:"2",
		                    value:"半年内"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"check",
						items:[{
		                    key:"0",
		                    value:"未审批"
						},{
		                    key:"1",
		                    value:"已审批"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					buttons:[{
						id:"rebut",
						text:"驳回",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		pks+=old[i].pkHealthStatusChange+",";
                         	}
                            aw.ajax({
                                url : "api/healthstatuschange/rebut",
                                type : "POST",
                                data : {
                               	 	pk:pks
                                },
                               success : function(data){
                            	   if(data.msg == "驳回失败"){
                            		   Dialog.tip({
											title:"该申请单已审批过"
										});
                            	   }else if(data.msg == "请选择一条申请单进行驳回"){
                            		   Dialog.tip({
											title:"请选择一条申请单进行驳回"
										});
                            	   }else{
                            		   Dialog.tip({
											title:data.msg
										});
                            	   }
                            	   widget.get("list").refresh();
                               }
                            });
						}
					},{
						id:"approval",
						text:"审批",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		pks+=old[i].pkHealthStatusChange+",";
                         	}
                            aw.ajax({
                                url : "api/healthstatuschange/approval",
                                type : "POST",
                                data : {
                               	 	pk:pks
                                },
                                success : function(data){
                            	   if(data.msg){
                            		   Dialog.tip({
                            			   title:data.msg
                            		   });
                            	   }
                            	   widget.get("list").refresh();
                                }
                            });
						}
					}]
               }
			};
		},
		initList:function(widget){
			return {
				url:"api/healthstatuschange/statusquery",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						fetchProperties:"*," +
							"healthdata.member.memberSigning.room.number," +
							"healthdata.member.personalInfo.name," +
							"creator.name",
						pkBuilding:subnav.getValue("building"),
						date:subnav.getValue("date"),
						check:subnav.getValue("check")
					};
				},
				model:{
					isCheckbox:true,
					columns:[{
						key:"healthdata.member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"healthdata.member.personalInfo.name",
						name:"姓名"
					},{
						key:"beforeNurseLevel",
						name:"巡检等级",
						format:function(value,row){
							if(value == "" || value == null){
								if(row.nurseLevel == 1){
									var ret = "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>"+row.nurseLevel+"</span>";
									return ret;
								}
								else if(row.nurseLevel == 2){
									var ret = "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>"+row.nurseLevel+"</span>";
									return ret;
								}
								else if(row.nurseLevel == 3){
									var ret = "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>"+row.nurseLevel+"</span>";
									return ret;
								}
								else{
									return "";
								}
							}
							else if(value == 1 && row.nurseLevel == 2 || value == 1 && row.nurseLevel == 3){
								var ret = "从"+"<span style='color:red'>"+value+"</span>"+"到"+"<span style='color:red'>"+row.nurseLevel+"</span>";
								return ret;
							}
							else if(value == 2 && row.nurseLevel == 1 || value == 2 && row.nurseLevel == 3){
								var ret = "从"+"<span style='color:red'>"+value+"</span>"+"到"+"<span style='color:red'>"+row.nurseLevel+"</span>";
								return ret;
							}
							else if(value == 3 && row.nurseLevel == 1 || value == 3 && row.nurseLevel == 2){
								var ret = "从"+"<span style='color:red'>"+value+"</span>"+"到"+"<span style='color:red'>"+row.nurseLevel+"</span>";
								return ret;
							}
							else{
								return "";
							}
						}
					},{
						key:"beforeSportIntensity",
						name:"运动强度",
						format:function(value,row){
							if(value == "" || value == null){
								if(row.sportIntensity == "High"){
									var ret = "从"+"<span style='color:red'>"+"无"+"</span>"+"到"+"<span style='color:red'>"+"高"+"</span>";
									return ret;
								}
								if(row.sportIntensity == "Centre"){
									var ret = "从"+"<span style='color:red'>"+"无"+"</span>"+"到"+"<span style='color:red'>"+"中"+"</span>";
									return ret;
								}
								if(row.sportIntensity == "Low"){
									var ret = "从"+"<span style='color:red'>"+"无"+"</span>"+"到"+"<span style='color:red'>"+"低"+"</span>";
									return ret;
								}
								else{
									return "";
								}
							}
							if(value == "High" && row.sportIntensity == "Centre"){
								var ret = "从"+"<span style='color:red'>"+"高"+"</span>"+"到"+"<span style='color:red'>"+"中"+"</span>";
								return ret;
							}
							else if(value == "High" && row.sportIntensity == "Low"){
								var ret = "从"+"<span style='color:red'>"+"高"+"</span>"+"到"+"<span style='color:red'>"+"低"+"</span>";
								return ret;
							}
							else if(value == "Centre" && row.sportIntensity == "High"){
								var ret = "从"+"<span style='color:red'>"+"中"+"</span>"+"到"+"<span style='color:red'>"+"高"+"</span>";
								return ret;
							}
							else if(value == "Centre" && row.sportIntensity == "Low"){
								var ret = "从"+"<span style='color:red'>"+"中"+"</span>"+"到"+"<span style='color:red'>"+"底"+"</span>";
								return ret;
							}
							else if(value == "Low" && row.sportIntensity == "High"){
								var ret = "从"+"<span style='color:red'>"+"低"+"</span>"+"到"+"<span style='color:red'>"+"高"+"</span>";
								return ret;
							}
							else if(value == "Low" && row.sportIntensity == "Centre"){
								var ret = "从"+"<span style='color:red'>"+"低"+"</span>"+"到"+"<span style='color:red'>"+"中"+"</span>";
								return ret;
							}
							else{
								return "";
							}
						}
					},{
						key:"beforeGoOut",
						name:"外出建议",
						format:function(value,row){
							if(row.beforeGoOut == row.goOut){
								return "";
							}
							if(row.beforeGoOut == "" || row.beforeGoOut == null){
								if(row.goOut == true){
									var ret = "从"+"<span style='color:red'>"+"无"+"</span>"+"到"+"<span style='color:red'>"+"外出"+"</span>";
									return ret;
								}
								if(row.goOut == false){
									var ret = "从"+"<span style='color:red'>"+"无"+"</span>"+"到"+"<span style='color:red'>"+"不外出"+"</span>";
									return ret;
								}
								else{
									return "";
								}
							}
							else if(row.beforeGoOut == true && row.goOut == false){
								var ret = "从"+"<span style='color:red'>"+"外出"+"</span>"+"到"+"<span style='color:red'>"+"不外出"+"</span>";
								return ret;
							}
							else if(row.beforeGoOut == false && row.goOut == true){
								var ret = "从"+"<span style='color:red'>"+"不外出"+"</span>"+"到"+"<span style='color:red'>"+"外出"+"</span>";
								return ret;
							}
						}
					},{
						key:"creator.name",
						name:"提交人"
					},{
						key:"cause",
						name:"原因"
					},{
						key:"flowStatus.value",
						name:"审批状态"
					}]
				}
			};
		}
	});
	module.exports = healthstatuschange;
});