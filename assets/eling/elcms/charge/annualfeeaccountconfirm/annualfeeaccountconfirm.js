/**
 * 服务费交纳明细
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
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	var template="<div class='el-annualfeepaymentdetails'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"</div>";
	var annualfeepaymentdetails = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			//title
        			title:"服务费到账确认",
        			//按钮组
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/annualfees/search",
							data:{
								s:str,
								chargeStatusIn:"Receiving,Charged",
								orderString:"endDate:decs",
								properties:
										"endDate," +
										"dueannualfees," +
										"realannualfees," +
										"ChargeStatus," +
										"chargeTime," +
										"confirmTime," +
										"invoiceTime," +
										"payer.memberSigning.room.number," +
										"payer.personalInfo.name," +
										"confirm.name," +
										"payer.personalInfo.mobilePhone," +
										"payer.personalInfo.phone",
								fetchProperties:"*," +
										"payer.memberSigning.room.number," +
										"payer.personalInfo.name," +
										"operator.name," +
										"confirm.name," +
										"invoice.name," +
										"payer.personalInfo.mobilePhone," +
										"payer.personalInfo.phone",
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
						handler:function(){
							widget.show(".J-Grid").hide(".J-Form");
							widget.get("subnav").hide(["return","confirm"]).show(["search","building","time","chargeStatus"]);
							return false;
						}
        				
        			},{
        				id:"confirm",
        				text:"确认",
						show:false,
						handler:function(){
							Dialog.confirm({
								title:"提示",
								content:"是否确认？",
								confirm:function(){
									aw.ajax({
										url:"api/annualfees/accountConfirm",
										data:{
											pkAnnualFees:widget.get("form").getValue("pkAnnualFees"),
											pkUser:activeUser.pkUser,
											version:widget.get("form").getValue("version")
											},
										dataType:"json",
										success:function(data){
											widget.show(".J-Grid").hide(".J-Form");
											widget.get("subnav").hide(["return","confirm"]).show(["search","building","time","chargeStatus"]);
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
											
										}
									});
									
								}
							});
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
        				   id:"chargeStatus",
        				   tip:"收费状态",
        				   items:[{
        					   key:"Receiving",
        					   value:"已到账"  
        				   },{
        					   key:"Charged",
        					   value:"已收费"
        				   },{
        					   key:"Charged,Receiving",
        					   value:"全部"
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
					pkAnnualFees:params?params.AnnualFeesAccount:"",
					"payer.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
					"chargeStatusIn":widget.get("subnav").getValue("chargeStatus"),
					"chargeTime":widget.get("subnav").getValue("time").start,
					"chargeTimeEnd":widget.get("subnav").getValue("time").end,
					fetchProperties:"*," +
						"payer.memberSigning.room.number," +
						"payer.personalInfo.name," +
						"operator.name," +
						"confirm.name," +
						"invoice.name," +
						"payer.personalInfo.mobilePhone," +
						"payer.personalInfo.phone",
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
						key:"phone",
						name:"移动电话/电话",
						format:function(row,value){
							if(!value.payer){
								return "";
							}
							if(value.payer.personalInfo){
								var result = "";
								if (value.payer.personalInfo.mobilePhone != ""){
									result += value.payer.personalInfo.mobilePhone || "";
								}
								if ((value.payer.personalInfo.mobilePhone != "") && (value.payer.personalInfo.phone != "")){
									result += "/";
								}
								if (value.payer.personalInfo.phone != ""){
									result += value.payer.personalInfo.phone || "";
								}
								return result;
							}else{
								return "";
							}
						}
					},{
						key:"endDate",
						name:"到期日期",
						format:"date"
					},{
						key:"dueAnnualFees",
						name:"应收",
						format:"thousands",
						className:"text-right"
					},{
						key:"realAnnualFees",
						name:"实际应收费用",
						format:"thousands",
						className:"text-right"
					},{
						key:"chargeStatus.value",
						name:"状态"
					},{
						key:"chargeTime",
						name:"收费日期",
						format:"date"
					},{
						key:"confirmTime",
						name:"到账日期",
						format:"date"
					},{
						key:"confirm.name",
						name:"确认人",
					},{
						key:"operate",
						name : "操作",
						format:function(row,value){
							if(value.chargeStatus.key=="Receiving"){
								return "已到账";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"detail",
							text:"明细",
							handler:function(index,data,rowEle){
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.show(".J-Form").hide(".J-Grid");
								widget.get("subnav").hide(["search","building","time","chargeStatus"]).show(["return","confirm"]);
							}
						},{
							key:"edit",
							text:"确认",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否确认？",
									confirm:function(){
										aw.ajax({
											url:"api/annualfees/accountConfirm",
											data:{
												pkAnnualFees:data.pkAnnualFees,
												pkUser:activeUser.pkUser,
												version:data.version
												},
											dataType:"json",
											success:function(data){
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
												
											}
										});
										
									}
								});
							}
							
						}
						]
					}]
				}
            });
            this.set("grid",grid);
            
        	var form=new Form({
        		parentNode:".J-Form",
        		model:{
        			id:"annualfeepaymentdetailsForm",
        			items:[{
        				name:"pkAnnualFees",
        				type:"hidden"
        			},{
        				name:"version",
        				type:"hidden"
        			},{
        				name:"payer.memberSigning.room.number",
        				label:"房间"
        			},{
        				name:"payer.personalInfo.name",
        				label:"付款人"
        			},{
        				name:"payer.personalInfo.phone",
        				label:"电话"
        			},{
        				name:"payer.personalInfo.mobliephone",
        				label:"移动电话"
        			},{
        				name:"beginDate",
        				label:"起始日期",
        				type:"date",
						mode:"Y-m-d"
        			},{
        				name:"endDate",
        				label:"到期日期",
        				type:"date",
						mode:"Y-m-d"
        			},{
        				name:"dueAnnualFees",
        				label:"应收服务费"
        			},{
        				name:"realAnnualFees",
        				label:"实收服务费"
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
        				readonly:true
        			},{
        				name:"chargeTime",
        				label:"收费日期",
        				type:"date",
						mode:"Y-m-d"
        			},{
        				name:"operator.name",
        				label:"经手人"
        			},{
        				name:"confirmTime",
        				label:"到账日期",
        				type:"date",
						mode:"Y-m-d"
        			},{
        				name:"confirm.name",
        				label:"确认人"
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
        				readonly:true
        			},{
        				name:"invoiceAmount",
        				label:"开票金额"
        			},{
        				name:"invoiceTime",
        				label:"开票日期",
        				type:"date",
						mode:"Y-m-d"
        			},{
        				name:"invoice.name",
        				label:"开票人"
        			}]
        		}
        	});
        	this.set("form",form);
            
        }
	});
	module.exports = annualfeepaymentdetails;	
});

