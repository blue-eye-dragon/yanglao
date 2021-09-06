/**
 * 服务费分摊
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid"); 
	var Dialog=require("dialog-1.0.0");
	var store = require("store");
	var activeUser = store.get("user");
	var template="<div class='el-annualfeeapportion'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"</div>";
	var annualfeeapportion = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			//title
        			title:"服务费分摊",
        			//按钮组
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/annualfeeapportion/search",
							data:{
								s:str,
								"annualFees.chargeStatus":"Receiving",
								properties:
								"annualFees.payer.memberSigning.room.number," +
								"annualFees.payer.personalInfo.name",
								fetchProperties:"*," +
								"annualFees.payer.memberSigning.room.number," +
								"annualFees.realAnnualFees," +
								"annualFees.payer.personalInfo.phone," +
								"annualFees.payer.personalInfo.mobliephone," +
								"annualFees.beginDate," +
								"annualFees.endDate," +
								"annualFees.payer.personalInfo.name," +
								"annualFees.operator.name," +
								"annualFees.chargeTime," +
								"annualFees.confirm.name," +
								"annualFees.chargeStatus," +
								"annualFees.dueAnnualFees," +
								"annualFees.confirmTime," +
								"annualFees.invoiceStatus," +
								"annualFees.invoiceAmount," +
								"annualFees.invoiceTime," +
								"annualFees.invoice.name," +
								"annualFeesRefund.annualCheckOutFee," +
								"annualFeesRefund.createDate"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
        			
        			buttons:[{
        				id:"apportion",
        				text:"分摊",
        				handler:function(){
        					widget.get("subnav").setValue("search","");
        					widget.openView({
								url:"eling/elcms/charge/annualfeeapportion/annualfeesearch",
								params:{
										father:"annualfeeapportion"
								},isAllowBack:true
							});
						}
        			}],
        			
        			buttonGroup:[{
        				   id:"building",
        				   showAll:true,
        				   showAllFirst:true,
        				   handler:function(key,element){
        					   widget.get("subnav").setValue("search","");
   							   widget.get("grid").refresh();
   						   }  
        			   }],
        			   time:{
        				   tip:"收费日期或退费日期",
        				   click:function(time){
        					   widget.get("subnav").setValue("search","");
        					   widget.get("grid").refresh();
        				   },
        			   }
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
            	autoRender:false,
				model:{
					url:"api/annualfeeapportion/query",
					params:function(){
						return {
						"annualFees.chargeStatus":"Receiving",
						"annualFees.payer.memberSigning.room.building":widget.get("subnav").getValue("building"),
						"annualFees.chargeTime":widget.get("subnav").getValue("time").start,
						"annualFees.chargeTimeEnd":widget.get("subnav").getValue("time").end,
						"createDate":widget.get("subnav").getValue("time").start,
						"createDateEnd":widget.get("subnav").getValue("time").end,
						fetchProperties:"*," +
							"annualFees.payer.memberSigning.room.number," +
							"annualFees.realAnnualFees," +
							"annualFees.payer.personalInfo.phone," +
							"annualFees.payer.personalInfo.mobliephone," +
							"annualFees.beginDate," +
							"annualFees.endDate," +
							"annualFees.payer.personalInfo.name," +
							"annualFees.operator.name," +
							"annualFees.chargeTime," +
							"annualFees.confirm.name," +
							"annualFees.chargeStatus," +
							"annualFees.dueAnnualFees," +
							"annualFees.confirmTime," +
							"annualFees.invoiceStatus," +
							"annualFees.invoiceAmount," +
							"annualFees.invoiceTime," +
							"annualFees.invoice.name," +
							"annualFeesRefund.annualCheckOutFee," +
							"annualFeesRefund.createDate"
						};
					},
					columns:[{
						name:"annualFees.payer.memberSigning.room.number",
						label:"房间号",
						issort: true,
						format:"detail",
 						formatparams:{
 							key:"detail",
							handler:function(index,data,rowEle){
								widget.openView({
									url:"eling/elcms/charge/annualfeeapportion/annualfeesearch",
									params:{
										father:"annualfeeapportiondetail",
										annualFeesApportion:data,
									},
									isAllowBack:true
								});
							}
 						}
					},{
						name:"annualFees.payer.personalInfo.name",
						label:"付款人"
					},{
						name:"annualFees.endDate",
						label:"到期日期",
						issort: true,
						format:"date"
					},{
						name:"annualFees.realAnnualFees",
						label:"实收服务费",
						className: "text-right",
						format:function(value,row){
							if(value){
								return Number(value).toFixed(2);
							}else{
								return Number(0).toFixed(2);  
							}
						},
					},{
						name:"annualFees.chargeTime",
						label:"收费日期",
						format:"date"
					},{
						name:"annualFeesRefund.annualCheckOutFee",
						label:"实退服务费",
						className: "text-right",
						format:function(value,row){
							if(value){
								return Number(value).toFixed(2);
							}else{
								return Number(0).toFixed(2);  
							}
						},
					},{
						name:"annualFeesRefund.createDate",
						label:"退费日期",
						format:"date"
					},{
						name:"apportionFrequency",
						label:"分摊次数"
					},{
						name:"beginDate",
						label:"分摊开始月份",
						format:"date",
						formatparams:{
		                    mode:"YYYY-MM"
		                }
					},{
						name:"endDate",
						label:"分摊结束月份",
						format:"date",
						formatparams:{
		                    mode:"YYYY-MM"
		                }
					},{
						name:"operate",
						label : "操作",
						format:"button",
						formatparams:[{
							id:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								widget.openView({
									url:"eling/elcms/charge/annualfeeapportion/annualfeesearch",
									params:{
										father:"annualfeeapportionedit",
										annualFeesApportion:data,
									},
									isAllowBack:true
								});
							}
						},{
							id:"delete",
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/annualfeeapportion/" + data.pkAnnualFeesApportion + "/delete",function(){
		 	 						widget.get("grid").refresh();
		 	 					});
							}						
						}]
 					}]
				}
            });
            this.set("grid",grid);
            
            
        },
        setEpitaph:function(){
			var subnav=this.get("subnav");
			return {
				start:subnav.getValue("time").start,
				end :subnav.getValue("time").end,
				pkBuilding :subnav.getValue("building"),
			};
		},
		afterInitComponent:function(params,widget){
			if(params&&params.father=="annualfeeapportionstatistics"){
				widget.get("grid").refresh({
					pkAnnualFeesApportion:params.pkAnnualFeesApportion,
					fetchProperties:"*," +
					"annualFees.payer.memberSigning.room.number," +
					"annualFees.realAnnualFees," +
					"annualFees.payer.personalInfo.phone," +
					"annualFees.payer.personalInfo.mobliephone," +
					"annualFees.beginDate," +
					"annualFees.endDate," +
					"annualFees.payer.personalInfo.name," +
					"annualFees.operator.name," +
					"annualFees.chargeTime," +
					"annualFees.confirm.name," +
					"annualFees.chargeStatus," +
					"annualFees.dueAnnualFees," +
					"annualFees.confirmTime," +
					"annualFees.invoiceStatus," +
					"annualFees.invoiceAmount," +
					"annualFees.invoiceTime," +
					"annualFees.invoice.name," +
					"annualFeesRefund.annualCheckOutFee," +
							"annualFeesRefund.createDate"
				});
			}else if(params&&params.start){
				widget.get("subnav").setValue("time",{
					start:params.start,
					end:params.end,
				});
				widget.get("subnav").setValue("building",params.pkBuilding);
				widget.get("grid").refresh();
			}else{
				widget.get("grid").refresh();
			}
		}
	});
	module.exports = annualfeeapportion;	
});
