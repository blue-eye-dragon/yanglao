define(function(require,exports,module){
	var Grid = require("grid-1.0.0");
	var aw = require("ajaxwrapper");
	var utils={
		init:function(params,widget){
			return new Grid({	                        
            	parentNode:".J-grid",
                url:"api/buymedicineapplication/buildingquery",
                params:function(){
                	var subnav=widget.get("subnav");
                	return {
                		pkBuilding:subnav.getValue("building"),
					 	datatype:subnav.getValue("datatype"),
					 	fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,buyMedicinePapers.checked,"+
							"ticket,pkBuyMedicineApplication,ticketPerson.name,ticketPerson.pkUser,buyMedicinePapers.pkBuyMedicinePaer,"+
							"buyMedicinePapers.name,buyMedicinePapers.checkPerson.pkUser,buyMedicinePapers.checkPerson.name,"+
							"items.pkBuyMedicineItem,items.quantity,items.actualQuantity,items.medicine.name,"+
							"items.medicine.specification,items.medicine.manufacturer"
                	};
                },
                model:{
                	idAttribute:"pkBuyMedicineApplication",
                	head:{
                		title:""
                	},
                    columns:[{
                    	key : "member.personalInfo.name",
						name : "姓名"
                    },{
						key:"member.memberSigning.room.number",
						name : "房号"
                    },{
						key:"money",
						name:"总金额(元)",
						format:function(value,row){
							return value ? "￥"+value : "";
						}
					},{
                        key:"items",
                        name : "核对药品",
                        format:function(value,row){
                        	for(var i=0;i<value.length;i++){
                        		if(value[i].actualQuantity == null){
                        			return "未核对完成 ";
                        		}
                        	}
                        	return "核对完成"; 
                        }
                    },{
                        key:"ticket",
                        name : "核对票款",
                        format:function(value,row){
                        	if(value || value===0){
                        		return "核对完成";
                        	}else{
                        		return "未核对完成 ";
                        	}
                        }	
                    },{
                        key:"buyMedicinePapers",
                        name : "核对证件",
                        format:function(value,row){
                        	for(var i=0;i<value.length;i++){
                        		if(!value[i].checked){
                        			return "未核对完成 ";
                        		}
                        	}
                        	return "核对完成"; 
                        }
                    },{
						key:"operate",
						name:"操作",
						//format:"button",
						format:function(value,row){
							var flag1=true;
							var flag2=true;
							for(var i=0;i<row.buyMedicinePapers.length;i++){
								if(row.buyMedicinePapers[i].checked==false){
									flag1=false;
									break;
								}
							}
							for(var j=0;j<row.items.length;j++){
								if(row.items[j].actualQuantity==null){
									flag2=false;
									break;
								}
							}
							if(row.flowStatus.key=="Bought"&&row.money!=null||flag1||flag2){
								return "button";
							}else{
								return "";
							}   
 						},
						formatparams:[{
							key:"cancel",
							text:"取消核对",
							handler:function(index,data,rowEle){
		                            aw.ajax({
		                                url : "api/buymedicineapplication/cancelcheck",
		                                type : "POST",
		                                data : {
		                                	pkBuyMedicineApplication:data.pkBuyMedicineApplication
		                                },
		                               success : function(data){
		                            	   widget.get("grid").refresh();
		                            	   widget.get("grid1").refresh();
		                            	   widget.get("grid2").refresh();
		                            	   widget.get("grid3").refresh();
		                                }
		                            });
							}
						}]
					}]
                }
            });
		}
	};
	
	module.exports=utils;
});