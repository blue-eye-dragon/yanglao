/**
 * 入住费开票
 * ELVIEW
 * subnav 
 * grid 
 * form
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog");
	var Form =require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	var template="<div class='el-annualfeepayment'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"</div>";
	var annualfeepayment = ELView.extend({
		
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			
        			title:"入住费开票",
        			
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/annualfees/search",
							data:{
								s:str,
								chargeStatus:"Receiving",
								orderString:"endDate:decs",
								properties:
										"payer.memberSigning.room.number," +
										"payer.personalInfo.name",
								fetchProperties:"*," +
										"payer.memberSigning.room.number," +
										"payer.personalInfo.name," +
										"operator.name," +
										"confirm.name," +
										"invoice.name",
										
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					},
        			buttons:[{
        				id:"return",
        				text:"返回",
						show:false,
						frist:true,
						handler:function(){
							widget.show(".J-Grid").hide(".J-Form");
							widget.get("subnav").hide(["return","invoice"]).show(["search","building","invoiceStatus"]);
							return false;
						}
        				
        			},{
     				   id:"invoice",
    				   text:"开票",
    				   show:false,
    				   handler:function(key,element){
    					   var form = widget.get("form");
    					   form.setDisabled(false);
    					   form.setAttribute("chargeStatus","readonly",true);
    					   form.setValue("invoiceAmount", form.getValue("realannualfees"));
    					   form.setValue("invoiceTime",moment());
    					 //当前用户是管理员时，让operator可用
							var userSelect=form.getData("invoice","");
							var flag = false;
							for(var  i =  0 ; i<userSelect.length;i++ ){
								if(userSelect[i].pkUser == activeUser.pkUser){
									flag= true;
									break;
								}
							}
							if(flag){
								form.setValue("invoice",activeUser.pkUser);
							}
    				   }  
    			   }],
        			
        			buttonGroup:[{
        				   id:"building",
        				   showAll:true,
        				   showAllFirst:true,
        				   handler:function(key,element){
   							   widget.get("grid").refresh();
   						   }  
        			   },{
        				   id:"invoiceStatus",
        				   tip:"开票状态",
        				   items:[{
        					   key:"UnInvoice",
        					   value:"未开票"
        				   },{
        					   key:"Invoiced",
        					   value:"已开票"  
        				   }],
        				   handler:function(key,element){
   							   widget.get("grid").refresh();
        				   }
        			   }],
        			   time:{
        				   tip:"收费日期",
        				   click:function(time){
        					   widget.get("grid").refresh();
        				   },
        			   }
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
				url:"api/annualfees/query",
				params:function(){
					return {
					"payer.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
					"chargeStatus":"Receiving",
					"invoiceStatus":widget.get("subnav").getValue("invoiceStatus"),
					"chargeTime":widget.get("subnav").getValue("time").start,
					"chargeTimeEnd":widget.get("subnav").getValue("time").end,
					fetchProperties:"*," +
						"payer.memberSigning.room.pkRoom," +
						"payer.memberSigning.room.number," +
						"payer.personalInfo.name," +
						"operator.pkUser," +
						"operator.name," +
						"confirm.pkUser," +
						"confirm.name," +
						"invoice.pkUser," +
						"invoice.name," +
						"payer.pkPayer",
					};
				},
				model:{
					columns:[{
						key:"payer.memberSigning.room.number",
						name:"房间号"
					},{
						key:"payer.personalInfo.name",
						name:"付款人"
					},{
						key:"chargeTime",
						name:"收费日期",
						format:"date"
					},{
						key:"beginDate",
						name:"起始日期",
						format:"date"
					},{
						key:"endDate",
						name:"到期日期",
						format:"date"
					},{
						key:"invoiceAmount",
						name:"开票金额"
					},{
						key:"invoiceTime",
						name:"开票日期",
						format:"date"
					},{
						key:"invoice.name",
						name:"开票人"
					},{
						key:"operate",
						name : "操作",
						format:function(row,value){
							if(value.invoiceStatus.key=="Invoiced"){
								return "已开票";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"detail",
							text:"明细",
							handler:function(index,data,rowEle){
								var form  = widget.get("form");
								form.reset();
								data.roomNumber= data.payer.memberSigning.room.number;
								data.payerName=data.payer.personalInfo.name;
								data.phone=data.payer.personalInfo.phone;
								data.mobliePhone=data.payer.personalInfo.mobliePhone;
								data.begindate= moment(data.beginDate).format("YYYY-MM-DD");
								data.enddate= moment(data.endDate).format("YYYY-MM-DD");
								data.chargetime= moment(data.chargeTime).format("YYYY-MM-DD");
								data.dueannualfees=data.dueAnnualFees;
								data.realannualfees=data.realAnnualFees;
								data.operatorName=data.operator.name;
								data.confirmtime=moment(data.confirmTime).format("YYYY-MM-DD");
								data.confirmName=data.confirm.name;
								form.setData(data);
								form.setDisabled(true);
								widget.show(".J-Form").hide(".J-Grid");
								widget.get("subnav").hide(["search","building","invoiceStatus"]).show(["return","invoice"]);
							}
						},{
							key:"edit",
							text:"开票",
							handler:function(index,data,rowEle){
								var form  = widget.get("form");
								form.reset();
								data.roomNumber= data.payer.memberSigning.room.number;
								data.payerName=data.payer.personalInfo.name;
								data.phone=data.payer.personalInfo.phone;
								data.mobliePhone=data.payer.personalInfo.mobliePhone;
								data.begindate= moment(data.beginDate).format("YYYY-MM-DD");
								data.enddate= moment(data.endDate).format("YYYY-MM-DD");
								data.chargetime= moment(data.chargeTime).format("YYYY-MM-DD");
								data.dueannualfees=data.dueAnnualFees;
								data.realannualfees=data.realAnnualFees;
								data.operatorName=data.operator.name;
								data.confirmtime=moment(data.confirmTime).format("YYYY-MM-DD");
								data.confirmName=data.confirm.name;
								form.setData(data);
								widget.show(".J-Form").hide(".J-Grid");
								widget.get("subnav").hide(["search","building","invoiceStatus","invoice"]).show(["return"]);
								form.setAttribute("chargeStatus","readonly",true);
								//当前用户是管理员时，让operator可用
								var userSelect=form.getData("invoice","");
								var flag = false;
								for(var  i =  0 ; i<userSelect.length;i++ ){
									if(userSelect[i].pkUser == activeUser.pkUser){
										flag= true;
										break;
									}
								}
								if(flag){
									form.setValue("invoice",activeUser.pkUser);
								}
								form.setValue("invoiceStatus","Invoiced");
								form.setAttribute("invoiceStatus","readonly",true);
								form.setValue("invoiceTime",moment());
								form.setValue("invoiceAmount",data.realAnnualFees);
							}
							
						}
						]
					}]
				}
            });
            this.set("grid",grid);
        	var form=new Form({
        		parentNode:".J-Form",
        		saveaction:function(){
        			var form =widget.get("form");
        			var realannualfees=form.getValue("realannualfees");
        			var invoiceAmount= form.getValue("invoiceAmount");
        			if(invoiceAmount>realannualfees){
        				Dialog.alert({
							content:"开票金额不能大于实收服务费金额！"
						});
        				return;
        			}
        			if(form .getValue("invoiceStatus")=="UnInvoice"){
        				Dialog.alert({
							content:"请修改开票状态！"
						});
        				return;
        			}	
        			aw.saveOrUpdate("api/annualfees/invoice",{
        				pkAnnualFees:form.getValue("pkAnnualFees"),
        				invoiceAmount:form.getValue("invoiceAmount"),
        				invoiceTime:form.getValue("invoiceTime"),
        				pkUser:form.getValue("invoice"),
        				version:form.getValue("version")
        			},function(data){
        				widget.show(".J-Grid").hide(".J-Form");
        				widget.get("subnav").hide(["return","invoice"]).show(["search","building","invoiceStatus"]);
        				widget.get("grid").refresh({
        					pkAnnualFees:data.pkAnnualFees,
        					fetchProperties:"*," +
    						"payer.memberSigning.room.pkRoom," +
    						"payer.memberSigning.room.number," +
    						"payer.personalInfo.name," +
    						"operator.pkUser," +
    						"operator.name," +
    						"confirm.pkUser," +
    						"confirm.name," +
    						"invoice.pkUser," +
    						"invoice.name," +
    						"payer.personalInfo.mobilePhone," +
    						"payer.personalInfo.phone," +
    						"payer.pkPayer",
        				});
					});
					return false;
        			
        		},
        		cancelaction:function(){
        			widget.show(".J-Grid").hide(".J-Form");
    				widget.get("subnav").hide(["return","invoice"]).show(["search","building","invoiceStatus"]);
					return false;
				},
        		model:{
        			id:"annualfeevoiceForm",
        			items:[{
        				name:"pkAnnualFees",
        				type:"hidden"	
        			},{
        				name:"version",
        				type:"hidden"
        			},{
        				name:"roomNumber",
        				label:"房间",
        				readonly:true,
        			},{
        				name:"payerName",
        				label:"付款人",
        				readonly:true,
        			},{
        				name:"phone",
        				label:"电话",
        				readonly:true
        			},{
        				name:"mobliePhone",
        				label:"移动电话",
        				readonly:true
        			},{
        				name:"begindate",
        				label:"起始日期",
        				readonly:true
        			},{
        				name:"enddate",
        				label:"到期日期",
        				readonly:true
        			},{
        				name:"dueannualfees",
        				label:"应收服务费",
        				readonly:true
        			},{
        				name:"realannualfees",
        				label:"实收服务费",
        				readonly:true
        			},{
        				name:"chargeStatus",
        				label:"收费状态",
        				type:"select",
        				options:[{
        					key:"UnCharge",
        					value:"未收费"
        				},{
        					key:"Charged",
            				value:"已收费"
        				},{
        					key:"Receiving",
            				value:"已到账"
        				}],
        			},{
        				name:"chargetime",
        				label:"收费日期",
        				readonly:true
        			},{
        				name:"operatorName",
        				label:"经手人",
        				readonly:true
        			},{
        				name:"confirmtime",
        				label:"到账日期",
						readonly:true
        			},{
        				name:"confirmName",
        				label:"确认人",
        				readonly:true
        			},{
        				name:"invoiceStatus",
        				label:"开票状态",
        				type:"select",
        				options:[{
        					key:"UnInvoice",
        					value:"未开票"
        				},{
        					key:"Invoiced",
            				value:"已开票"
        				}],
        				validate:["required"]
        			},{
        				name:"invoiceAmount",
        				label:"开票金额",
        				validate:["required"]
        			},{
        				name:"invoiceTime",
        				label:"开票日期",
        				type:"date",
						mode:"Y-m-d",
        				validate:["required"]
        			},{
        				name:"invoice",
        				label:"开票人",
        				key:"pkUser",
        				type:"select",
        				url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
        				value:"name",
        				validate:["required"]	
        			}
        			]
        		}
        	});
        	this.set("form",form);
        },
	});
	module.exports = annualfeepayment;	
});

