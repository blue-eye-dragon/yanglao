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
					title:"换房审批",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/changeroomapply/search",
							data : {
								s : str,
								properties : "memberSigning.card.name,memberSigning.room.number,memberSigning.members.personalInfo.name,",
								fetchProperties:"*,pkChangeRoomApply," +
								"memberSigning.members," +
								"memberSigning.annualFee," +
								"memberSigning.members.personalInfo.name," +
								"memberSigning.card.name," +
								"memberSigning.room.number," +
								"memberSigning.members.status," +
								"memberSigningNew.members.status," +
								"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
								"memberSigning.room.pkRoom," +
								"memberSigning.checkInDate,room.number," +
								"personalInfo.name",
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
    			autoRender:false,
				url:"api/changeroomapply/query",
				fetchProperties:"*,pkChangeRoomApply," +
				"memberSigning.members," +
				"memberSigning.annualFee," +
				"memberSigning.members.personalInfo.name," +
				"memberSigning.card.name," +
				"memberSigning.room.number," +
				"memberSigning.members.status," +
				"memberSigningNew.members.status," +
				"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
				"memberSigning.room.pkRoom," +
				"memberSigning.checkInDate,room.number," +
				"personalInfo.name," +
				"user.name",
				params:function(){
					return {
						pkChangeRoomApply:params?params.modelId:"",
						createDate:widget.get("subnav").getValue("time").start,
						createDateEnd:widget.get("subnav").getValue("time").end,
						"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
						flowStatus:widget.get("subnav").getValue("flowStatus")
					};
				},
				model:{
					columns:[{
						key:"memberSigning.card.name",
						name:  i18ns.get("sale_card_name","会籍卡")
					},{
						key:"memberSigning.room.number",
						name:"原房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
								widget.get("subnav").hide(["building","time","flowStatus","search"]).show(["return"]);
								var form = widget.get("form");
								form.setData(data);
								form.setValue("user.name",data.user.name);
								var member = data.memberSigning.members; 
								var dataname = "";
								if(member.length != 0){
									for(var i=0;i<member.length;i++){
										if(i<member.length-1){
											dataname+=member[i].personalInfo.name+"("+member[i].status.value+"),";
										}else{
											dataname+=member[i].personalInfo.name+"("+member[i].status.value+")";
										}
									}
								}else{
									for(var i=0;i<data.memberSigningNew.members.length;i++){
										if(i<data.memberSigningNew.members.length-1){
											dataname+= data.memberSigningNew.members[i].personalInfo.name+"("+data.memberSigningNew.members[i].status.value+"),";
										}else{
											dataname+= data.memberSigningNew.members[i].personalInfo.name+"("+data.memberSigningNew.members[i].status.value+")";
										}
									}
								}
								form.setValue("memberNames",dataname);
								form.setDisabled(true);
								var approvalUI  = widget.get("approvalUI");
								approvalUI.set("param",{
									modelId:data.pkChangeRoomApply,
									serviceType:"ChangeRoomApply", 
									hideButton:true,
								});
								approvalUI.get("appgrid").refresh();
							}
						}]
					},{
						key:"room.number",
						name:"新房间号",
					},{
						key:"memberSigning.members",
						name:  i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
							var name="";
							if(row.memberSigning.members.length != 0){
								for(var i=0;i<value.length;i++){
									if(i<value.length-1){
										name+=value[i].personalInfo.name+"("+value[i].status.value+"),";
									}else{
										name+=value[i].personalInfo.name+"("+value[i].status.value+")";
									}
								}
							}else{
								for(var i=0;i<row.memberSigningNew.members.length;i++){
									if(i<row.memberSigningNew.members.length-1){
										name+= row.memberSigningNew.members[i].personalInfo.name+"("+row.memberSigningNew.members[i].status.value+"),";
									}else{
										name+= row.memberSigningNew.members[i].personalInfo.name+"("+row.memberSigningNew.members[i].status.value+")";
									}
								}
							}
							return name;
							},	
					},{
							key:"memberSigning.checkInDate",
							name:"入住日期 ",
							format:"date"
						},{
							key:"personalInfo.name",
							name:"申请人"
						},{
							key:"memberSigning.annualFee",
						name:"原房间服务费"
						},{
							key:"annualFeeNew",
							name:"新房间服务费"
							},{
						key:"createDate",
						name:"申请日期 ",
						format:"date"
					},{
						key:"changeDate",
						name:"换房日期 ",
						format:"date"
					},{
							key:"flowStatus.value",
							name:"审批状态"
						},{
							key:"changeConfrim",
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
 												modelId:data.pkChangeRoomApply,
 												serviceType:"ChangeRoomApply",
 												hideButton:false,
 												callBack:function(data){
 													if(data){
 														var pkChangeRoomApplyN = data.pkChangeRoomApply;
 														aw.ajax({
 															url:"api/changeroomapply/query",
 															data:{
 																pkChangeRoomApply:data.pkChangeRoomApply,
 																fetchProperties:"flowStatus"
 															},
 															dataType:"json",
 															success:function(data){
 																if(data[0]){
 																	if(data[0].flowStatus.key=="Approved" ){
 																		widget.get("form").setValue("flowStatus.value","已通过");
 																		aw.ajax({
 				 															url:"api/changeroomapply/sendMsg",
 				 															data:{
 				 																pkChangeRoomApply:pkChangeRoomApplyN,
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
 											var name="";
 											var value = data.memberSigning.members;
 											for(var i=0;i<value.length;i++){
 												if(i<value.length-1){
 													name+= value[i].personalInfo.name+",";
 												}else{
 													name+= value[i].personalInfo.name;
 												}
 											}
 											widget.get("form").setValue("memberNames",name);
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
    					name:"memberSigning.room.number",
    					label:"当前房间号",
    					readonly:true,
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"room.number",
    					label:"新房间号",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"memberSigning.card.name",
    					label:  i18ns.get("sale_card_name","会籍卡"),
    					readonly:true,
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
        				name:"user.name",
        				label:"经手人",
//        				type:"select",
//        				key:"pkUser",
//        				url:"api/users",//TODO 用户角色：wulina
//        				params:{
//    						fetchProperties:"pkUser,name"
//    					},
//    					value:"name",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					},
        			
    				},{
    					name:"memberNames",
    					label: i18ns.get("sale_ship_owner","会员"),
    					readonly:true,
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
         				name:"personalInfo.name",
         				label:"申请人",
         				type:"text",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
    					name:"memberSigning.annualFee",
    					label:"原房间服务费",
    					readonly:true,
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"annualFeeNew",
    					label:"新房间服务费",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"changeDate",
    					label:"换房日期",
    					type:"date",
    					mode:"Y-m-d",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"annualFeeDate",
    					label:"服务费生效日期",
    					type:"date",
    					mode:"Y-m-d",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name : "transferFees",
    					label : "结转金额",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4" 
    					}
    				},{
         				name:"flowStatus.value",
         				label:"换房状态",
         				type:"text",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
    					name:"changeReason",
    					label:"换房原因",
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
					 	pkChangeRoomApply:params?params.modelId:"",
						fetchProperties:"*,pkChangeRoomApply," +
						"memberSigning.members," +
						"memberSigning.annualFee," +
						"memberSigning.members.personalInfo.name," +
						"memberSigning.card.name," +
						"memberSigning.room.number," +
						"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
						"memberSigning.room.pkRoom," +
						"memberSigning.checkInDate,room.number," +
						"personalInfo.name",
					});
			}
		},
        afterInitComponent:function(params,widget){
        	if(params && params.father == "changeroomannualsummary"){
				widget.get("grid").refresh({
					"createDate":params.start,
					"createDateEnd":params.end,
					"memberSigning.card.cardType.pkMemberShipCardType":params.cardType,
					"memberSigning.room.type.pkRoomType":params.roomType,
					"flowStatus":params.flowStatus,
					fetchProperties:"*,pkChangeRoomApply," +
					"memberSigning.members," +
					"memberSigning.annualFee," +
					"memberSigning.members.personalInfo.name," +
					"memberSigning.card.name," +
					"memberSigning.room.number," +
					"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
					"memberSigning.room.pkRoom," +
					"memberSigning.checkInDate,room.number," +
					"personalInfo.name",
				});
				widget.get("subnav").setValue("flowStatus",params.flowStatus);
				widget.get("subnav").setValue("time",params);
			}else{
				widget.get("grid").refresh();
			}
		}
	});
	module.exports = changeroomapproval;
});
