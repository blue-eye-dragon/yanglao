define(function(require, exports, module) {
	 var Dialog=require("dialog-1.0.0");
	    var aw = require("ajaxwrapper");
	    var Form =require("form-2.0.0")
	    var ELView=require("elview");
		var Subnav = require("subnav-1.0.0"); 
		var Grid = require("grid-1.0.0");
		var store = require("store");
		var ApprovalUI = require("approvalUI");
		var activeUser = store.get("user");
		//多语
		var i18ns = require("i18n");
	    var template="<div class='J-subnav'></div>"+
		 "<div class='J-grid'></div>"+
		 "<div class='J-form hidden'></div>"+
		 "<div class='J-approvalUI hidden'></div>";
	var changeroomapproval = ELView.extend({
		attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"退住审批",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/checkoutlivingapply/search",
							data : {
								s : str,
								createDate:widget.get("subnav").getValue("time").start,
								createDateEnd:widget.get("subnav").getValue("time").end,
								"member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
								flowStatus:subnav.getValue("flowStatus"),
								properties : "member.memberSigning.card.name,member.memberSigning.room.number,member.personalInfo.name,",
								fetchProperties : "*,pkCheckOutLiving,CheckOutReason,CheckOutReason.value," +
								"member.memberSigning.annualFee," +
								"member.memberSigning.pkMemberSigning," +
								"member.personalInfo.name," +
								"member.memberSigning.card.name," +
								"member.memberSigning.room.number," +
								"member.memberSigning.room.pkRoom," +
								"member.memberSigning.checkInDate," +
								"personalInfo.name,user.name," +
								"member.memberSigning.pkMemberSigning",
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
						id:"flowStatus",
						tip : "审批状态",
						items:[{
							key:"Approvaling",
							value:"审批中"
						},{
							key:"Approved",
							value:"通过"
						},{
							key:"NotApproved",
							value:"未通过"
						},{
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
					buttons:[{
						id:"return",
        				text:"返回",
						show:false,
						handler:function(){
							$(".J-test").addClass("hidden");
							widget.show([".J-grid"]).hide([".J-form",".J-approvalUI"]);
							widget.get("subnav").hide(["return"]).show(["building","flowStatus","time","search"]);
							return false;
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
				}
        	});
        	this.set("subnav",subnav);
        	var grid=new Grid({
        		parentNode:".J-grid",
    			url : "api/checkoutlivingapply/query",
    			fetchProperties:"*,pkCheckOutLiving,CheckOutReason,CheckOutReason.value," +
    					"member.memberSigning.annualFee," +
    					"member.memberSigning.pkMemberSigning," +
    					"member.personalInfo.name," +
    					"member.memberSigning.card.name," +
    					"member.memberSigning.room.number," +
    					"member.memberSigning.room.pkRoom," +
    					"member.memberSigning.checkInDate," +
    					"personalInfo.name,user.name," +
    					"member.memberSigning.pkMemberSigning",
    			params:function(){
    				var subnav=widget.get("subnav");
    				return {
    					pkCheckOutLiving:params?params.modelId:"",
    					createDate:widget.get("subnav").getValue("time").start,
    					createDateEnd:widget.get("subnav").getValue("time").end,
    					"member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
    					flowStatus:subnav.getValue("flowStatus")
    				};
    			},
    			model:{
    				columns:[{
    					key:"member.memberSigning.card.name",
    					name: i18ns.get("sale_card_name","会籍卡"),
    				},{
    					key:"member.memberSigning.room.number",
    					name:"房间号",
    					format:"detail",
    					formatparams:[{
    						key:"detail",
    						handler:function(index,data,rowEle){

    							widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
    							widget.get("subnav").hide(["building","time","flowStatus","search"]).show(["return"]);
    							var form = widget.get("form");
    							form.setData(data);
    							form.setValue("user.name",data.user.name);
    							form.setDisabled(true);
    							var approvalUI  = widget.get("approvalUI");
    							approvalUI.set("param",{
    								modelId:data.pkCheckOutLiving,
    								serviceType:"CheckOutLiving", 
    								hideButton:true,
    							});
    							approvalUI.get("appgrid").refresh();
    						}
    					}]
    				},{
    					key:"member.personalInfo.name",
    					name: i18ns.get("sale_ship_owner","会员"),
    				},{
    						key:"member.memberSigning.checkInDate",
    						name:"入住日期 ",
    						format:"date"
    					},{
    						key:"personalInfo.name",
    						name:"申请人"
    					},{
    						key:"member.memberSigning.annualFee",
    					name:"服务费"
    					},{
    					key:"createDate",
    					name:"申请日期 ",
    					format:"date"
    				},{
    					key:"checkOutDate",
    					name:"退住日期 ",
    					format:"date"
    				},{
    					key:"checkOutReason.value",
    					name:"退住原因",
    				},{
    					key:"flowStatus.value",
    					name:"审批状态"
    				},{
    					key:"checkOutConfrim",
    					name:"确认状态",
    					format:function(value,row){
    						if(value == true){
    							return "已确认";
    						}else{
    							return "未确认";
    						}
    					}
    				},{
    					key:"operate",
    					name:"操作",
    					format:function(value,row){
    						if(row.flowStatus.key=="Approvaling"){
    							return "button";
    						}else{
    							return "";
    						}   
    					},
    					formatparams:[{
    						key:"approval", 
    						text:"审核",
    						handler:function(index,data,rowEle){
    							var approvalUI  = widget.get("approvalUI");
    							approvalUI.set("param",{
    								modelId:data.pkCheckOutLiving,
    								serviceType:"CheckOutLiving",
    								hideButton:false,
    								callBack:function(data){
    									if(data){
    										var pkCheckOutLivingN = data.pkCheckOutLiving;
    										aw.ajax({
    											url:"api/checkoutlivingapply/query",
    											data:{
    												pkCheckOutLiving:data.pkCheckOutLiving,
    												fetchProperties:"flowStatus"
    											},
    											dataType:"json",
    											success:function(data){
    												if(data[0]){
    													if(data[0].flowStatus.key=="Approved" ){
    														widget.get("form").setValue("flowStatus.value","已通过");
    														aw.ajax({
    															url:"api/checkoutlivingapply/sendMsg",
    															data:{
    																pkCheckOutLiving:pkCheckOutLivingN,
    																fetchProperties:"flowStatus"
    															},
    															dataType:"json",
    														});
    													}
    												}
    												widget.get("grid").refresh()
    											}
    										});
    									}
    								}
    							});
    							approvalUI.get("appgrid").refresh();
    							widget.get("form").setData(data);
    							widget.get("form").setDisabled(true);
    							widget.hide([".J-grid"]).show([".J-form",".J-approvalUI"]);
    							widget.get("subnav").show(["return"]).hide(["building","flowStatus","time","search"]);
    						}
    					}]
    				}]
				}
        	});
        	this.set("grid",grid);
        	
        	var form = new Form({
        		parentNode:".J-form",
        		model:{
    				id:"changeroomapply",
    				items:[{
    					name:"member.memberSigning.room.number",
    					label:"房间号",
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
    					name:"member.memberSigning.card.name",
    					label: i18ns.get("sale_card_name","会籍卡"),
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
    					name:"member.personalInfo.name",
    					label: i18ns.get("sale_ship_owner","会员"),
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"checkOutDate",
    					label:"退住日期",
    					type:"date",
    					mode:"Y-m-d",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"member.memberSigning.annualFee",
    					label:"服务费",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
         				name:"flowStatus.value",
         				label:"退住状态",
         				type:"text",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
    					name:"checkOutReason.value",
    					label:"退住原因",
    					type :"textarea"
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
					 	pkCheckOutLiving:params?params.modelId:"",
					 	fetchProperties : "*,pkCheckOutLiving," +
						"member.memberSigning.annualFee," +
						"member.memberSigning.pkMemberSigning," +
						"member.personalInfo.name," +
						"member.memberSigning.card.name," +
						"member.memberSigning.room.number," +
						"member.memberSigning.room.pkRoom," +
						"member.memberSigning.checkInDate," +
						"personalInfo.name,user.name," +
						"member.memberSigning.pkMemberSigning",
					});
			}
		},
	});
	module.exports = changeroomapproval;
});
