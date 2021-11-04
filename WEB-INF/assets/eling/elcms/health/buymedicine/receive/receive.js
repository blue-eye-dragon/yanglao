define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var MultiRowGrid = require("multirowgrid");
	var Subnav = require("subnav-1.0.0");	
    var Dialog=require("dialog-1.0.0");
	var template=require("./receive.tpl");
	var receive = ELView.extend({
        attrs:{
                template:template
        },
        initComponent:function(params,widget){
        	
        	var subnav=new Subnav({
            	parentNode:".J-subnav",
                   model:{
                	  title:"代配药发放",
  					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide(".J-receiveGrid").show(".J-grid");
							widget.get("subnav").show(["building","flowStatus","receivemedicine"]).hide(["return","receive"]);
						}
  					},{
   						id:"receivemedicine",
						text:"发放药品",
						handler:function(){
							widget.hide(".J-grid").show(".J-receiveGrid");
							widget.get("subnav").hide(["building","flowStatus","receivemedicine"]).show(["return","receive"]);
						}
					},{
						id:"receive",
						text:"确定发放",
						show:false,
						handler:function(){
							var flag=true;
							var arr=widget.get("grid3").getSelectedData();
							var pkTypes="";
							for(var i=0;i<arr.length;i++){
								pkTypes+=arr[i].pkBuyMedicineApplication+",";
//								if(arr[i].items[0].actualQuantity==null||arr[i].money==null||arr[i].buyMedicinePapers!=null){
//								for(var j=0;j<arr.length;j++){
//									if(arr[i].items[j].actualQuantity==null||arr[i].money==null||arr[i].buyMedicinePapers!=null){	
//										flag=false;
//											Dialog.alert({
//				    							content:"请先核对完申请单，再进行发放"
//				    			    		});
//											break;
//											return false;
//										}
//								}
								
							}
							
                         	if(pkTypes==""){
                        		 Dialog.tip({
									title:"请选中原药品!"
                        		 });
                         	}else{
                         			aw.ajax({
                                        url : "api/buymedicineapplication/receice", 	
                                        type : "POST",
                                        data : {
                                       	 pkTypes:pkTypes
                                        },
                                        success : function(data){
                                       	 widget.hide(".J-receiveGrid").show(".J-grid");
                                       	 widget.get("subnav").show(["building","flowStatus","receivemedicine"]).hide(["return","receive"]);
                                       	 widget.get("grid").refresh();
                                       	 widget.get("grid3").refresh();
                                        }
                                    });
                         		
                                 
                         	}
						}
					}],
   					buttonGroup:[{
   						id:"building",
   						showAll:true,
   						handler:function(key,element){
   							widget.get("grid").refresh();
   							widget.get("grid3").refresh();
   						}
   					},{
   						id:"flowStatus",
   						items:[{
   		                    key:"Bought",
   		                    value:"未发放"
   						},{
   							key:"Closed",
   							value:"已发放"
   						},{
   							key:"",
   							value:"全部"
   						}],
   						handler:function(key,element){
   							widget.get("grid").refresh();
   							widget.get("grid3").refresh();
   						}
   					}]
                }
			});
			this.set("subnav",subnav);
			
			var grid=new MultiRowGrid({	                        
               	parentNode:".J-grid",
                   url:"api/buymedicineapplication/receivequery",
                   fetchProperties:"*,"+
					    "member.memberSigning.room.number,"+
						"member.personalInfo.name,"+
						"buyMedicinePapers.checked,"+
						"ticket,"+
						"pkBuyMedicineApplication,"+
						"buyMedicinePapers.papertype.name,"+
						"items.pkBuyMedicineItem,"+
						"items.actualQuantity,items.quantity,"+
						"receivePerson.name,"+
						"ticketPerson.name,"+
						"items.medicine.name,items.medicine.generalName",
						
                   params:function(){
                	   return {
                		   pkBuilding:widget.get("subnav").getValue("building"),
                		   flowStatus:widget.get("subnav").getValue("flowStatus")
                	   };
                   },
                   model:{
                	   multiField:"items",
                	   columns:[{
                		   key : "member.personalInfo.name",
                		   name : "姓名"
                       },{
                    	   key:"member.memberSigning.room.number",
                    	   name : "房号"
                       },{
                    	   key :"buyMedicinePapers",
                    	   name : "证件",
                    	   format:function(value,row){
                    		   var names = "";
                    		   for (var i=0;i<value.length;i++) {
                    			   names += value[i].papertype.name+" ";
                    		   }
                    		   return names;
                    	   }
                       },{
                    	   key:"items",
                    	   name:"药品名称",
                    	   multiKey:"medicine",
                    	   isMulti:true,
                    	   format:function(value,row){
                    		   return value.name+(value.generalName || "");
                    	   }
                       },{
	   						key:"items",
							name:"数量",
							multiKey:"quantity",
							isMulti:true
					},{
                    	   key : "money",
                    	   name : "支付金额(元)",
                       },{
                    	   key : "ticket",
                    	   name : "发票",
                       },{
                    	   key : "receiveTime",
                    	   name : "发放时间",
                    	   format:"date",
                    	   formatparams:{
                    		   mode:"YYYY-MM-DD HH:mm"
                    	   }
                       },{
                    	   key:"receivePerson.name",
                    	   name:"确认人"
                       },{
                    	   key:"flowStatus.key",
                    	   name : "状态",
                    	   format:function(value,row){
                    		   if(value=="Closed"){
                    			   return "已发放";
                    		   }else if (value=="Bought"){
                    			   return "未发放";
                    		   }
                    	   }	
                       }]
                   	}
				});
				this.set("grid",grid);
				
				//药品发放
    			var grid3=new MultiRowGrid({
    				parentNode:".J-receiveGrid",
    				url:"api/buymedicineapplication/receivequery",
    				fetchProperties:"*,"+
					    "member.memberSigning.room.number,"+
						"member.personalInfo.name,"+
						"buyMedicinePapers.pkBuyMedicinePaer,buyMedicinePapers.checked,"+
						"ticket,"+
						"pkBuyMedicineApplication,"+
						"buyMedicinePapers.papertype.name,"+
						"items.pkBuyMedicineItem,"+
						"items.actualQuantity,items.quantity,"+
						"receivePerson.name,"+
						"ticketPerson.name,"+
						"items.medicine.name,items.medicine.generalName",
    				params:function(){
                 	   return {
                 		   pkBuilding:widget.get("subnav").getValue("building"),
                 		   flowStatus:widget.get("subnav").getValue("flowStatus")
                 	   };
                    },
    				model:{
    					isCheckbox:true,
    					multiField:"items",
    					columns:[{
                            key : "member.personalInfo.name",
                            name : "姓名"
    					},{
    						key:"items",
    						name:"药品名称",
    						multiKey:"medicine",
							isMulti:true,
    						format:function(value,row){
    							return value.name+(value.generalName || "");
    						}
    					},{
    						key:"items",
    						name:"数量",
							multiKey:"quantity",
							isMulti:true
    					},{
    						key:"items",
    						name:"实际购买数量",
							multiKey:"actualQuantity",
							isMulti:true
    					},{
    						key : "money",
    						name : "金额(元)",
    					},{
    						key : "ticket",
    						name : "发票",
    					}]
    				}
    			});
    			this.set("grid3",grid3);
        	}
        });
        module.exports = receive;	
});