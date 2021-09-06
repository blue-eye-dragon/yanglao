define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var MultiRowGrid = require("multirowgrid");
	var Subnav = require("subnav-1.0.0");	
    var Dialog=require("dialog-1.0.0");
    var Grid = require("grid-1.0.0");
	//多语
	var i18ns = require("i18n");
	var template = "<div class='J-subnav'></div>"+
				   "<div class='J-grid'></div>"+
				   "<div class='J-receiveGrid hidden'></div>";
	var receive = ELView.extend({
        attrs:{
                template:template
        },
        initComponent:function(params,widget){
        	
        	var subnav=new Subnav({
            	parentNode:".J-subnav",
                   model:{
                	  title:"集体陪同就医发放",
  					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide(".J-receiveGrid").show(".J-grid");
							widget.get("subnav").show(["building","PapersStatus","receiveCertificate"]).hide(["return","receive"]);
						}
  					},{
   						id:"receiveCertificate",
						text:"发放证件",
						handler:function(){
							widget.hide(".J-grid").show(".J-receiveGrid");
							widget.get("subnav").hide(["building","PapersStatus","receiveCertificate"]).show(["return","receive"]);
						}
					},{
						id:"receive",
						text:"确定发放",
						show:false,
						handler:function(){
							var flag=true;
							var arr=widget.get("receiveGrid").getSelectedData();
							var pkTypes="";
							for(var i=0;i<arr.length;i++){
								pkTypes+=arr[i].pkAccompanyHospitalize+",";
							}
							
                         	if(pkTypes==""){
                        		 Dialog.tip({
									title:"请选中要发证件的"+i18ns.get("sale_ship_owner","会员")+"!"
                        		 });
                         	}else{
                         			aw.ajax({
                                        url : "api/accompanyhospitalize/receice", 	
                                        type : "POST",
                                        data : {
                                       	 pkTypes:pkTypes
                                        },
                                        success : function(data){
                                       	 widget.hide(".J-receiveGrid").show(".J-grid");
                                       	 widget.get("subnav").show(["building","PapersStatus","receiveCertificate"]).hide(["return","receive"]);
                                       	 widget.get("grid").refresh();
                                       	 widget.get("receiveGrid").refresh();
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
   							widget.get("receiveGrid").refresh();
   						}
   					},{
   						id:"PapersStatus",
   						items:[{
   							key:"Receive",
   							value:"已收取"
   						},{
   		                    key:"NotReceive",
   		                    value:"未收取"
   						},{
   							key:"Restore",
   							value:"已返还"
   						},{
   							key:"",
   							value:"全部"
   						}],
   						handler:function(key,element){
   							widget.get("grid").refresh();
   							widget.get("receiveGrid").refresh();
   						}
   					}]
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({	                        
               	parentNode:".J-grid",
               	url:"api/accompanyhospitalizemanager/query",
				parentNode:".J-grid",
				params:function(){
					var subnav=widget.get("subnav");
					return {
//						datatype:subnav.getValue("datatype"),
//						date: subnav.getValue("time").start,
//				    	dateEnd:  subnav.getValue("time").end,
						papersStatus:subnav.getValue("PapersStatus"),
						flowStatus:"Printed",
						"member.memberSigning.room.building":subnav.getValue("building"),
						fetchProperties:"*,member.personalInfo.name,handoverPerson.name,handoverPerson.pkUser,papers.pkPaperType,papers.name," +
							"member.memberSigning.room.building.name,papers.name,hospital.name,receivePeople.*,receivePeople.receive_pkUser,"+
							"member.memberSigning.room.number,member.personalInfo.sex,member.personalInfo.birthday"
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
                    		   for (var i=0;i<row.papers.length;i++) {
                    			   names += row.papers[i].name+" ";
                    		   }
                    		   return names;
                    	   }
                       },{
                    	   key : "money",
                    	   name : "支付金额(元)",
                       },{
                    	   key : "invoiceAmount",
                    	   name : "票款 ",
                       },{
                    	   key : "receiveTime",
                    	   name : "发放时间",
                    	   format:"date",
                    	   formatparams:{
                    		   mode:"YYYY-MM-DD HH:mm"
                    	   }
                       },{
                    	   key:"receivePeople.name",
                    	   name:"确认人"
                       },{
                    	   key:"PapersStatus",
                    	   name : "状态",
                    	   format:function(value,row){
                    		   if(row.papersStatus=="Receive"){
                    			   return "已收取";
                    		   }else if (row.papersStatus=="NotReceive"){
                    			   return "未收取";
          						}else if(row.papersStatus=="Restore"){
          							return "已返还";
                    		   }
                    	   }	
                       }]
                   	}
				});
				this.set("grid",grid);
				
				//集体陪同就医发放
    			var receiveGrid=new Grid({
    				parentNode:".J-receiveGrid",
    				url:"api/accompanyhospitalizemanager/query",
    				parentNode:".J-receiveGrid",
    				params:function(){
    					var subnav=widget.get("subnav");
    					return {
//    						datatype:subnav.getValue("datatype"),
//    						date: subnav.getValue("time").start,
//    				    	dateEnd:  subnav.getValue("time").end,
    						papersStatus:"Receive",
    						flowStatus:"Printed",
    						"member.memberSigning.room.building":subnav.getValue("building"),
    						fetchProperties:"*,member.personalInfo.name,handoverPerson.name,handoverPerson.pkUser,papers.pkPaperType,papers.name," +
    							"member.memberSigning.room.building.name,papers.name,hospital.name,receivePeople.*,receivePeople.receive_pkUser,"+
    							"member.memberSigning.room.number,member.personalInfo.sex,member.personalInfo.birthday"
    					};
    				},
    				model:{
    					isCheckbox:true,
    					multiField:"items",
    					columns:[{
                            key : "member.personalInfo.name",
                            name : "姓名"
    					},{
    					   key :"buyMedicinePapers",
                    	   name : "证件",
                    	   format:function(value,row){
                    		   var names = "";
                    		   for (var i=0;i<row.papers.length;i++) {
                    			   names += row.papers[i].name+" ";
                    		   }
                    		   return names;
                    	   }
    					},{
    						key : "money",
    						name : "支付金额(元)",
    					},{
    						key : "invoiceAmount",
    						name : "票款",
    					}]
    				}
    			});
    			this.set("receiveGrid",receiveGrid);
        	}
        });
        module.exports = receive;	
});