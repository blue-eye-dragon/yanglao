define(function(require, exports, module) {
    var Dialog=require("dialog-1.0.0");
    var aw = require("ajaxwrapper"); 
    var Form =require("form-2.0.0")
    var ELView=require("elview");
    var ApprovalUI = require("approvalUI");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
    var template="<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-approvalUI hidden'></div>";
	var annualfeesrefundconfirm = ELView.extend({
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"服务费退款确认",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/annualfeesrefund/search",
							data : {
								s : str,
								flowStatus:"Approved",
								properties : "annualFees.memberSigning.room.pkRoom",
								fetchProperties:"*," +
								"annualFees.memberSigning.room.pkRoom," +
								"annualFees.memberSigning.room.number," +
								"annualFees.payer.personalInfo.name," +
								"annualFees.memberSigning.pkMemberSigning," +
								"user.name," +
								"annualFees.payer.personalInfo.mobilePhone," +
								"annualFees.payer.personalInfo.phone," +
								"annualFees.dueAnnualFees," +
								"annualFees.realAnnualFees," +
								"annualFees.chargeTime," +
								"personalInfo.name"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					
					},{
		   			 id:"refundConfrim",
		   			tip : "是否确认",
						items:[{
							key:"false",
							value:"未确认"
						},{
							key:"true",
							value:"已确认"
						},{
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
					time:{
						tip : "申请时间",
					 	ranges:{
					 		"本月": [moment().startOf("month"), moment().endOf("month")],
					 		"三月内": [moment().subtract(3,"month").startOf("days"),moment().endOf("days")],
							"半年内": [moment().subtract(6,"month").startOf("days"),moment().endOf("days")],
							},
						defaultTime:"本月",
        				click:function(time){
        					widget.get("grid").refresh();
						}
					},
					buttons:[
					{
						id:"return",
						text:"返回",
						show:false,
						type:"button",
						handler:function(){
							widget.hide([".J-form",".J-approvalUI"]).show([".J-grid"]);
							widget.get("subnav").show(["building","time","refundConfrim","search"]).hide(["return"]);
							widget.get("form").reset();
							return false;
						}
					}
					]
				}
				})
			this.set("subnav",subnav);
			var grid=new Grid({
				parentNode:".J-grid",
    			url:"api/annualfeesrefund/query",
    			params:function(){
    				return {
    				pkAnnualFeesRefund:params?params.modelId:"",
    				"annualFees.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
    				"flowStatus":"Approved",
    				"createDate":widget.get("subnav").getValue("time").start,
    				"createDateEnd":widget.get("subnav").getValue("time").end,
    				"refundConfrim":widget.get("subnav").getValue("refundConfrim"),
    				fetchProperties:"*," +
    					"annualFees.memberSigning.room.pkRoom," +
    					"annualFees.memberSigning.room.number," +
    					"annualFees.payer.personalInfo.name," +
    					"user.name," +
    					"annualFees.payer.personalInfo.mobilePhone," +
    					"annualFees.payer.personalInfo.phone," +
    					"annualFees.dueAnnualFees," +
    					"annualFees.realAnnualFees," +
    					"annualFees.chargeTime," +
    					"personalInfo.name"
    				};
    			},
    			model:{
    				columns:[{
    					key:"annualFees.memberSigning.room.number",
    					name:"房间号",
    					format:"detail",
    					formatparams:[{
    						key:"detail",
    						handler:function(index,data,rowEle){
    							widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
    							widget.get("subnav").hide(["building","time","refundConfrim","search"]).show(["return"]);
    							var form = widget.get("form");
    							form.setData(data);
    							form.setValue("annualFees.chargeTime",moment(data.annualFees.chargeTime).format("YYYY-MM-DD"));
    							form.setDisabled(true);
    							var approvalUI  = widget.get("approvalUI");
    							approvalUI.set("param",{
    								modelId:data.pkAnnualFeesRefund,
    								serviceType:"AnnualFeesRefund",
    								hideButton:true,
    							});
    							approvalUI.get("appgrid").refresh();
    						}
    					}]
    				},{
    					key:"annualFees.payer.personalInfo.name",
    					name:"付款人"
    				},{
    					key:"phone",
    					name:"移动电话/电话",
    					format:function(row,value){
    						var mobilePhone = value.annualFees.payer.personalInfo.mobilePhone==null?"无":value.annualFees.payer.personalInfo.mobilePhone;
    						var phone = value.annualFees.payer.personalInfo.phone==null?"无":value.annualFees.payer.personalInfo.phone;
    						if(value.annualFees.payer.personalInfo){
    							return  mobilePhone+"/"+ phone;
    						}else{
    							return "";
    						}
    					}
    				},{
    					key:"annualFees.dueAnnualFees",
    					name:"应收服务费"
    				},{
    					key:"annualFees.realAnnualFees",
    					name:"实收服务费"
    				},{
    					key:"annualFees.chargeTime",
    					name:"收费日期",
    					format:"date"
    				},{
    					key:"createDate",
    					name:"申请时间",
    					format:"date"
    				},{
    					key:"personalInfo.name",
    					name:"申请人"
    				},{
    					key:"user.name",
    					name:"经手人",
    				},{
    					key:"annualFeesRefundFrom.value",
    					name:"退费来源",
    				},{
    					key:"refundConfrim",
    					name:"确认状态",
    					format:function(value,row){
    						if(value == true){
    							return "已确认";
    						}else{
    							return "未确认";
    						}
    					}
    				},{
    					key:"flowStatus.value",
    					name:"审批状态"
    				},{
						key:"operate",
						name:"操作",
						format:function(value,row){
							if(row.refundConfrim == false){
								return "button";
							}else{
								return "";
							}   
							},
						formatparams:[{
							key:"edit",
							text:"确认", 
							handler:function(index,data,rowEle){

								Dialog.confirm({
									setStyle:function(){},
									content:"服务费退款确认？",
									confirm:function(){
										aw.ajax({
											url:"api/annualfeesrefund/confirm",
											data:{
												pkAnnualFeesRefund:data.pkAnnualFeesRefund,
											},
											dataType:"json",
											success:function(data){
												widget.get("grid").refresh({
													pkAnnualFeesRefund:data.pkAnnualFeesRefund,
													fetchProperties:"*," +
							    					"annualFees.memberSigning.room.pkRoom," +
							    					"annualFees.memberSigning.room.number," +
							    					"annualFees.payer.personalInfo.name," +
							    					"user.name," +
							    					"annualFees.payer.personalInfo.mobilePhone," +
							    					"annualFees.payer.personalInfo.phone," +
							    					"annualFees.dueAnnualFees," +
							    					"annualFees.realAnnualFees," +
							    					"annualFees.chargeTime," +
							    					"personalInfo.name"
												});
											}
										});
									}
								});
							}
						}]
					
						}]
				}
			})
			this.set("grid",grid);
			var form = new Form({
        		parentNode:".J-form",
        		model:{
    				id:"annualfeesrefundconfirm",
    				items:[{
    					name:"annualFees.memberSigning.room.number",
    					label:"房间号",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"personalInfo.name",
    					label:"申请人",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"annualFees.chargeTime",
    					label:"交款日期",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
        				name:"user.name",
        				label:"经手人",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					},
        			
    				},{
    					name:"annualFees.realAnnualFees",
    					label:"实收服务费",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"annualCheckOutFee",
    					label:"服务费退款额",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"refundReason",
    					label:"退款原因",
    					type :"textarea",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"flowStatus.value",
    					label:"退款原因",
    					type :"textarea",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				}]
    			}
        	})
			this.set("form",form);
			var  approvalUI = new ApprovalUI({
				parentNode : ".J-approvalUI",
			});
			approvalUI.render();
			this.set("approvalUI",approvalUI);
		},
		approval : function(params,widget){
			if(params&&params.modelId){
				 widget.get("grid").refresh({
					 pkAnnualFeesRefund:params?params.modelId:"",
					 			fetchProperties:"*," +
								"annualFees.memberSigning.room.pkRoom," +
								"annualFees.memberSigning.room.number," +
								"annualFees.payer.personalInfo.name," +
								"annualFees.memberSigning.pkMemberSigning," +
								"user.name," +
								"annualFees.payer.personalInfo.mobilePhone," +
								"annualFees.payer.personalInfo.phone," +
								"annualFees.dueAnnualFees," +
								"annualFees.realAnnualFees," +
								"annualFees.chargeTime," +
								"personalInfo.name"
					});
			}
		},
	});
	module.exports = annualfeesrefundconfirm;
});
