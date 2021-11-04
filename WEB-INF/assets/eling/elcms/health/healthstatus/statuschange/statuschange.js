define(function(require, exports, module) {
	 var BaseView=require("baseview");
     var aw = require("ajaxwrapper");
 	 var Dialog=require("dialog-1.0.0");
 	 //多语
 	 var i18ns = require("i18n");
     var HealthGradeChang = BaseView.extend({
    	 events:{
			"change .J-healthdata" : function(e){
				var card=this.get("card");
				var pk=card.getValue("healthdata");
				if(pk){
					aw.ajax({
						url : "api/healthdata/query",
						type : "POST",
						data : {
							pkHealthData:pk,
							fetchProperties:"nurseLevel,sportIntensity,goOut"
						},
						success : function(data){
							card.setValue("beforeNurseLevel1",data[0].nurseLevel);
							card.setValue("beforeNurseLevel",data[0].nurseLevel);
							card.setValue("beforeSportIntensity",data[0].sportIntensity);
							card.setValue("beforeGoOut",data[0].goOut);
							if(data[0].sportIntensity=="High"){
								card.setValue("beforeSportIntensity1","高");
							}else if(data[0].sportIntensity=="Centre"){
								card.setValue("beforeSportIntensity1","中");
							}else if(data[0].sportIntensity=="Low"){
								card.setValue("beforeSportIntensity1","低");
							}else{
								card.setValue("beforeSportIntensity1","无");
							}
							if(data[0].goOut==true){
								card.setValue("beforeGoOut1","是");
							}else if(data[0].goOut==false){
								card.setValue("beforeGoOut1","否");
							}else{
								card.setValue("beforeGoOut1","无");
							}
							
						}	
					});
				}
			}
    	 },
    	 initSubnav:function(widget){
    		 return {
    			 model:{
  					title:"健康状态变更申请",
  					buttonGroup:[{
  						id:"building",
  						handler:function(key,element){
  							widget.get("list").refresh();
  							widget.get("card").load("healthdata");
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
  						},{
  							value:"全部"
  						}],
  						handler:function(key,element){
  							widget.get("list").refresh();
  						}
  					},{
  		    			id:"flowStatus",
  		 				items:[{
  		 					key:"Submit",
  		 					value:"提交"
  		 				},{
  		 					key:"Approval",
  		 					value:"已审批"
  		 				},{
  		 					key:"Cancel",
  		 					value:"作废"
  		 				},{
  		 					key:"Reject",
  		 					value:"驳回"
  		 				},{
  							value:"全部"
  						}],
  		 				handler:function(key,element){
  		 					widget.get("list").refresh();
  		 				}
  		    		}]
    			 }
    		 };
    	 },
    	 initList:function(widget){
    		 return {
    			 url : "api/healthstatuschange/tremquery",
                 params:function(){
                	 var subnav=widget.get("subnav");
                	 return {
                		 fetchProperties:"*,healthdata.member.personalInfo.pkPersonalInfo,healthdata.member.personalInfo.name,creator.name,healthdata.member.memberSigning.room.number",
                		 pkBuilding1:subnav.getValue("building"),
                    	 flowStatus:subnav.getValue("flowStatus"),
                    	 date:subnav.getValue("date")
                	 };
                 },
 				model:{
                	 columns:[{
 						key:"healthdata.member.personalInfo.name",
 						name:i18ns.get("sale_ship_owner","会员"),
 						format:"detail",
 						formatparams:[{
 							key:"detail",
 							handler:function(index,data,rowEle){
 								widget.list2Card(true);
 	 							var ret="<option value='"+data.healthdata.member.pkMember+"'>"+data.healthdata.member.personalInfo.name+"</option>";
 	 							$(".J-card select.J-member").html(ret);
 	 							widget.get("card").setData(data);
 	 							widget.get("card").setDisabled(true);
 								return false;
 							 }
 						}]
 					},{
						key:"number",
						name:"申请编号"
					},{
						key:"healthdata.member.memberSigning.room.number",
						name:"房间号"
					},{
 						key:"nurseLevel",
 						name:"巡检等级",
 						format:function(value,row){
 							if(row.beforeNurseLevel==row.nurseLevel){
 								return "";
 							}
 							else if(row.beforeNurseLevel==null){
 								return "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>"+row.nurseLevel+"</span>";
 							}
 							else if(row.nurseLevel==null){
 								return "从"+"<span style='color:red'>"+row.beforeNurseLevel+"</span>"+"到"+"<span style='color:red'>无</span>";
 							}
 							else{
 								return "从"+"<span style='color:red'>"+row.beforeNurseLevel+"</span>"+"到"+"<span style='color:red'>"+row.nurseLevel+"</span>";
 							}
 						}
 					},{
 						key:"sportIntensity",
 						name:"运动强度",
 						format:function(value,row){
 							if(row.beforeSportIntensity==row.sportIntensity){
 								return "";
 							}
 							else if(row.beforeSportIntensity=='High'){
 								if(row.sportIntensity=='Centre'){
 									return "从"+"<span style='color:red'>高</span>"+"到"+"<span style='color:red'>中</span>";
 								}
 								else if(row.sportIntensity=='Low'){
 									return "从"+"<span style='color:red'>高</span>"+"到"+"<span style='color:red'>低</span>";
 								}
 								else{
 									return "从"+"<span style='color:red'>高</span>"+"到"+"<span style='color:red'>无</span>";
 								}
							}
							else if(row.beforeSportIntensity=='Centre'){
								if(row.sportIntensity=='High'){
									return "从"+"<span style='color:red'>中</span>"+"到"+"<span style='color:red'>高</span>";
 								}
 								else if(row.sportIntensity=='Low'){
 									return "从"+"<span style='color:red'>中</span>"+"到"+"<span style='color:red'>低</span>";
 								}
 								else{
 									return "从"+"<span style='color:red'>中</span>"+"到"+"<span style='color:red'>无</span>";
 								}
							}
							else if(row.beforeSportIntensity=='Low'){
								if(row.sportIntensity=='High'){
									return "从"+"<span style='color:red'>低</span>"+"到"+"<span style='color:red'>高</span>";
 								}
 								else if(row.sportIntensity=='Centre'){
 									return "从"+"<span style='color:red'>低</span>"+"到"+"<span style='color:red'>中</span>";
 								}
 								else{
 									return "从"+"<span style='color:red'>低</span>"+"到"+"<span style='color:red'>无</span>";
 								}
							}
							else{
								if(row.sportIntensity=='High'){
									return "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>高</span>";
 								}
 								else if(row.sportIntensity=='Centre'){
 									return "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>中</span>";
 								}
 								else if(row.sportIntensity=='Low'){
 									return "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>低</span>";
 								}
							}
 						}
 					},{
 						key:"goOut",
 						name:"出行建议",
 						format:function(value,row){
 							if(row.beforeGoOut==row.goOut){
 								return "";
 							}
 							else if(row.beforeGoOut==true){
 								if(row.goOut==false){
 									return "从"+"<span style='color:red'>建议</span>"+"到"+"<span style='color:red'>不建议</span>";
 								}else{
 									return "从"+"<span style='color:red'>建议</span>"+"到"+"<span style='color:red'>无</span>";
 								}
 							}else if(row.beforeGoOut==false){
 								if(row.goOut==true){
 									return "从"+"<span style='color:red'>不建议</span>"+"到"+"<span style='color:red'>建议</span>";
 								}else{
 									return "从"+"<span style='color:red'>不建议</span>"+"到"+"<span style='color:red'>无</span>";
 								}
 							}
 							else{
 								if(row.goOut==true){
 									return "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>建议</span>";
 								}else{
 									return "从"+"<span style='color:red'>无</span>"+"到"+"<span style='color:red'>不建议</span>";
 								}
 							}
 						}
 					},{
						key:"cause",
						name:"原因"
					},{
						key:"creator.name",
						name:"申请人"
					},{
 						key:"flowStatus.value",
 						name:"状态"
 					},{
						key:"sealed",
						name:"操作",
						format:function(value,row){
							if(row.flowStatus.key=="Submit"){
								return "button";
							}else{
								return "";
							}   
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEL){
								widget.get("card").reset();
								data.beforeNurseLevel1=data.beforeNurseLevel;
								if(data.beforeSportIntensity=="High"){
									data.beforeSportIntensity1="高";
								}else if(data.beforeSportIntensity=="Centre"){
									data.beforeSportIntensity1="中";
								}else if(data.beforeSportIntensity=="Low"){
									data.beforeSportIntensity1="低";
								}else{
									data.beforeSportIntensity1="无";
								}
								if(data.beforeGoOut==true){
									data.beforeGoOut1="是";
								}else if(data.beforeGoOut==false){
									data.beforeGoOut1="否";
								}else{
									data.beforeGoOut1="无";
								}
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEL){
								widget.del("api/healthstatuschange/" + data.pkHealthStatusChange + "/delete");
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
    				 var card=widget.get("card");
    				 var beforeSportIntensity=card.getValue("beforeSportIntensity");
    				 var beforeNurseLevel=card.getValue("beforeNurseLevel");
    				 var beforeGoOut=card.getValue("beforeGoOut");
    				 var sportIntensity=card.getValue("sportIntensity");
    				 var nurseLevel=card.getValue("nurseLevel");
    				 var goOut=card.getValue("goOut")!==undefined?card.getValue("goOut").toString():"";
            		 if(!((sportIntensity!="" && sportIntensity!=beforeSportIntensity) 
            				 || (nurseLevel!="" && nurseLevel!=beforeNurseLevel)
            				 ||(goOut!="" && goOut!=beforeGoOut))){
            			 Dialog.tip({
            				 title:"运动强度、出行建议、健康巡检等级中必须修改一个"
            			 });
            			 return false;
            		 }
            		 widget.save("api/healthstatuschange/save",$("#healthstatuschange").serialize());
                 },
                 model:{
                	 id:"healthstatuschange",
                	 items:[{
                		 name:"pkHealthStatusChange",
                		 type:"hidden"
    				},{
    					name:"flowStatus",
    					type:"hidden",
    					defaultValue:"Submit"
    				},{
    					name:"version",
    					type:"hidden",
    					defaultValue:"0"
    				},{
    					name:"healthdata",
    					label:i18ns.get("sale_ship_owner","会员"),
    					type:"select",
    					url:"api/healthdata/query",
    					key:"pkHealthData",
    					value:"member.memberSigning.room.number,member.personalInfo.name",
    					params:function(){
    						return {
    							"pkBuilding":widget.get("subnav").getValue("building"),
    							fetchProperties:"pkHealthData,member.memberSigning.room.number,member.personalInfo.name"
    						};
    					},
    					validate:["required"]
    				},{
    					name:"beforeNurseLevel1",
    					label:"当前巡检等级",
    					readonly:true
    				},{
    					name:"beforeNurseLevel",
    					type:"hidden",
    				},{
    					name:"nurseLevel",
    					label:"变更巡检等级",
    					type:"select",
    					options:[{
    						key:"1",
    						value:"1"
    					},{
    						key:"2",
    						value:"2"
    					},{
    						key:"3",
    						value:"3"
    					}]
    				},{
    					name:"beforeSportIntensity1",
    					label:"当前运动强度建议",
    					readonly:true
    				},{
    					name:"beforeSportIntensity",
    					type:"hidden",
    				},{
    					name:"sportIntensity",
    					label:"变更运动强度",
    					type:"select",
    					options:[{
    						key:"High",
    						value:"高"
    					},{
    						key:"Centre",
    						value:"中"
    					},{
    						key:"Low",
    						value:"低"
    					}]
    				},{
    					name:"beforeGoOut1",
    					label:"当前出行建议",
    					readonly:true
    				},{
    					name:"beforeGoOut",
    					type:"hidden",
    				},{
    					name:"goOut",
    					label:"变更出行建议",
    					type:"radiolist",
    					list:[{
    						key:true,
    						value:"是"
    					},{
    						key:false,
    						value:"否"
    					}]
    				},{
    					name:"cause",
    					label:"申请原因",
    					type:"textarea"
    				},{
    					name:"number",
    					type:"hidden",
    				}]
    			}
    		 };
    	 }
     });
     module.exports = HealthGradeChang;
	
});