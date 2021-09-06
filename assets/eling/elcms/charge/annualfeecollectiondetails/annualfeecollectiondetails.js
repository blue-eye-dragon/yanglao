/**
 * 服务费收取明细
 * ELVIEW
 * subnav 
 * Grid 
 * Form
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog");
	var Form =require("form-2.0.0")
	var template="<div class='el-annualfeepaymentdetails'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"
		"</div>";
	var annualfeecollectiondetails = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			//title
        			title:"服务费收取明细",
        			//按钮组
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/annualfees/search",
							data:{
								s:str,
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
							widget.get("subnav").hide(["return"]).show(["search","building","chargeStatus","invoiceStatus"]);
							return false;
						}
        				
        			}],
        			
        			buttonGroup:[{
        				   id:"building",
        				   showAllFirst:true,
        				   showAll:true,
        				   handler:function(key,element){
   							   widget.get("grid").refresh();
   						   }  
        			   },{
        				   id:"chargeStatus",
        				   tip:"收费状态",
   						   items:[{
   									key:"UnCharge",
   									value:"未收费"
   								},{
   									key:"Charged",
   									value:"已收费"
   								},{
   									key:"Receiving",
   									value:"已到账"
   								}],
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
					"chargeStatus":widget.get("subnav").getValue("chargeStatus"),
					"invoiceStatus":widget.get("subnav").getValue("invoiceStatus"),
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
						name:"电话",
						format:function(row,value){
							if(!value.payer){
								return "";
							}
							if(value.payer.personalInfo){
								return  value.payer.personalInfo.mobilePhone||""+"/"+ value.payer.personalInfo.phone||"";
							}else{
								return "";
							}
						}
					},{
						key:"beginDate",
						name:"起始日期",
						format:"date"
					},{
						key:"endDate",
						name:"到期日期",
						format:"date"
					},{
						key:"dueAnnualFees",
						name:"应收服务费"
					},{
						key:"realAnnualFees",
						name:"实收服务费"
					},{
						key:"chargeTime",
						name:"收费日期",
						format:"date"
					},{
						key:"operator.name",
						name:"经手人",
					},{
						key:"confirmTime",
						name:"到账日期",
						format:"date"
					},{
						key:"invoiceAmount",
						name:"开票金额",
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
						format:"button",
						formatparams:[{
							key:"detail",
							text:"明细",
							handler:function(index,data,rowEle){
								widget.get("form").reset();
								data.beginDate=data.beginDate?moment(data.beginDate).format("YYYY-MM-DD"):"";
								data.endDate=data.endDate?moment(data.endDate).format("YYYY-MM-DD"):"";
								data.chargeTime=data.chargeTime?moment(data.chargeTime).format("YYYY-MM-DD"):"";
								data.confirmTime=data.confirmTime?moment(data.confirmTime).format("YYYY-MM-DD"):"";
								data.invoiceTime=data.invoiceTime?moment(data.invoiceTime).format("YYYY-MM-DD"):"";
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								widget.show(".J-Form").hide(".J-Grid");
								widget.get("subnav").hide(["search","building","chargeStatus","invoiceStatus"]).show(["return"]);
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
        			id:"annualfeecollectiondetails",
        			items:[{
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
        				label:"起始日期"
         			},{
        				name:"endDate",
        				label:"到期日期"
        			},{
        				name:"dueAnnualFees",
        				label:"应收服务费"
        			},{
        				name:"realAnnualFees",
        				label:"实收服务费"
        			},{
        				name:"chargeStatus.value",
        				label:"收费状态"
        			},{
        				name:"chargeTime",
        				label:"收费日期"
        			},{
        				name:"operator.name",
        				label:"经手人"
        			},{
        				name:"confirmTime",
        				label:"到账日期"
        			},{
        				name:"confirm.name",
        				label:"确认人"
        			},{
        				name:"invoiceAmount",
        				label:"开票金额"
        			},{
        				name:"invoiceTime",
        				label:"开票日期"
        			},{
        				name:"invoice.name",
        				label:"开票人"
        			},{
        				name:"invoiceStatus.value",
        				label:"开票状态"
        			}]
        		}
        	});
        	this.set("form",form);
            
        }
	});
	module.exports = annualfeecollectiondetails;	
});

