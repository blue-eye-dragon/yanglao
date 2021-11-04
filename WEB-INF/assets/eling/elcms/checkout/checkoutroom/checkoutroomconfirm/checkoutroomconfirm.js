define(function(require, exports, module) {
    var Dialog=require("dialog-1.0.0");
    var aw = require("ajaxwrapper"); 
    var Form =require("form-2.0.0")
    var ELView=require("elview");
    var ApprovalUI = require("approvalUI");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var store = require("store");
	var activeUser = store.get("user");
	var enmu = require("enums");
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-approvalUI hidden'></div>";
	var checkoutroomconfirm = ELView.extend({
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				
				model:{
					title:"退房确认",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/checkoutroomapply/search",
							data : {
								s : str,
								flowStatus:"Approved",
								properties : "memberSigning.card.name,memberSigning.room.number,memberSigning.members.personalInfo.name,personalInfo.name",
								fetchProperties : "*,pkCheckoutroomapply," +
								"memberSigning.members," +
								"memberSigning.annualFee," +
								"memberSigning.members.status," +
								"memberSigning.members.personalInfo.name," +
								"memberSigning.card.name," +
								"memberSigning.room.number," +
								"memberSigning.room.pkRoom," +
								"memberSigning.checkInDate," +
								"personalInfo.name,flowStatus.value," +
								"memberSigning.pkMemberSigning,checkOutReason,checkOutReasonType",
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
		   			 id:"checkOutConfrim",
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
							widget.get("subnav").show(["building","time","checkOutConfrim","search"]).hide(["return"]);
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
				url : "api/checkoutroomapply/query",
				fetchProperties:"*,pkCheckoutroomapply," +
						"memberSigning.members," +
						"memberSigning.annualFee," +
						"memberSigning.members.personalInfo.name," +
						"memberSigning.members.status," +
						"memberSigning.card.name," +
						"memberSigning.room.number," +
						"memberSigning.checkInDate," +
						"personalInfo.name,"+
						"memberSigning.membershipContract.pkMembershipContract,"+
						"memberSigning.membershipContract.membershipCard.name,"+
						"memberSigning.membershipContract.room.number,checkOutReasonType",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						pkCheckOutRoomApply:params?params.modelId:"",
						pkCheckOutRoomApply:params?params.CheckOutRoomApply:"",
						createDate:widget.get("subnav").getValue("time").start,
						createDateEnd:widget.get("subnav").getValue("time").end,
						checkOutConfrim:widget.get("subnav").getValue("checkOutConfrim"),
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						flowStatus:"Approved"
					};
				},
				model:{
					columns:[{
						key:"memberSigning.card.name",
						name: i18ns.get("sale_card_name","会籍卡"),
					},{
						key:"memberSigning.room.number",
						name:"房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){

								widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
								widget.get("subnav").hide(["building","time","checkOutConfrim","search"]).show(["return"]);
								var form = widget.get("form");
								form.setData(data);
								var member = data.memberSigning.members; 
								var dataname = "";
								if(member.length>0){
									for(var i=0;i<member.length;i++){
										if(i<member.length-1){
											dataname+=member[i].personalInfo.name+"("+member[i].status.value+"),";
										}else{
											dataname+=member[i].personalInfo.name+"("+member[i].status.value+")";
										}
									}
								}
								form.setValue("user",data.user);
								form.setValue("memberNames",dataname);
								if(data.checkOutBoolean == "true"){
									form.setValue("annualCheckOutFee",data.annualCheckOutFee);
								}else{
									form.hide(["annualCheckOutFee"]);
								}
								form.setDisabled(true);
								var approvalUI  = widget.get("approvalUI");
								approvalUI.set("param",{
									modelId:data.pkCheckOutRoomApply,
									serviceType:"CheckOutRoomApply",
									hideButton:true,
								});
								approvalUI.get("appgrid").refresh();
							}
						}]	
					},{
						key:"memberSigning.members",
						name: i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
						var name="";
						for(var i=0;i<value.length;i++){
							if(i<value.length-1){
								name+=value[i].personalInfo.name+"("+value[i].status.value+"),";
							}else{
								name+=value[i].personalInfo.name+"("+value[i].status.value+")";
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
						name:"服务费"
					},{
						key:"createDate",
						name:"申请日期 ",
						format:"date"
					},{
						key:"checkOutDate",
						name:"退房日期 ",
						format:"date"
					},{
						key:"annualCheckOutFee",
						name:"服务费退款额 "
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
							if(row.checkOutConfrim == false){
								return "button";
							}else{
								return "";
							}   
							},
						formatparams:[{
							key:"edit",
							text:"确认", 
							handler:function(index,data,rowEle){
								if(data.user.pkUser != activeUser.pkUser ){
									Dialog.alert({
		                        		title:"提示",
		                        		content:"您无权限确认！"
		                        	});
									return false;
								}
								Dialog.confirm({
									setStyle:function(){},
									content:"退房确认？",
									confirm:function(){
										Dialog.alert({
			                        		title:"提示",
			                        		showBtn:false,
			                        		content:"正在处理，请稍后……"
			                        	});
										aw.ajax({
											url:"api/checkoutroomapply/confim",
											data:{
												pkCheckOutRoomApply:data.pkCheckOutRoomApply,
												fetchProperties:"memberSigning.card.name," +
														"memberSigning.room.number," +
														"memberSigning.membershipContract.pkMembershipContract,checkOutReasonType"
											},
											dataType:"json",
											error:function(){
												Dialog.close();	
											},
											success:function(data){
												//Dialog.close();	
												widget.get("grid").refresh({
													pkCheckOutRoomApply:data.pkCheckOutRoomApply,
													fetchProperties:"*,pkCheckoutroomapply," +
													"memberSigning.members," +
													"memberSigning.annualFee," +
													"memberSigning.members.personalInfo.name," +
													"memberSigning.card.name," +
													"memberSigning.room.number," +
													"memberSigning.room.pkRoom," +
													"memberSigning.checkInDate," +
													"personalInfo.name," +
													"memberSigning.pkMemberSigning,checkOutReason,checkOutReasonType",
												});
												if (data.checkOutReasonType.key != "ChangeRoom") {
													Dialog.confirm({
														title:"提示",
														content:"是否退"+i18ns.get("sale_card_name","会籍卡")+"？",
														confirm:function(){
																widget.openView({
																	url:"eling/elcms/sale/bowoutmembershipcontract/bowoutmembershipcontractapply/bowoutmembershipcontractapply",
																	params:{
																		father:"checkoutroomconfirm",
																		room:data.memberSigning.room.number,
																		card:data.memberSigning.card.name,
																		pkMe:data.memberSigning.membershipContract.pkMembershipContract
																	}
																});
															}
													});
												} else {
													Dialog.close();	
												}
											}
										});
										return "NotClosed";
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
				saveaction:function(){
					
					aw.saveOrUpdate("api/checkoutroomapply/save",$("#checkoutroomapply").serialize(),function(data){
						widget.get("subnav").show(["building","time","checkOutConfrim","add"]).hide(["return"]);
						widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("grid").refresh();
					});
					
				},
				cancelaction:function(){
					widget.get("subnav").show(["building","time","checkOutConfrim","add"]).hide(["return"]);
					widget.show([".J-grid"]).hide([".J-form"]);
				},
				model:{
					id:"checkoutroomapply",
					items:[{
						name:"memberSigning.room.number",
						label:"房间号",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"checkOutDate",
						label:"退房日期",
						type:"date",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					
					},{
						name:"memberSigning.card.name",
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
						name:"memberNames",
						label: i18ns.get("sale_ship_owner","会员"),
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
	    				name:"user",
	    				label:"经手人",
	    				type:"select",
	    				key:"pkUser",
	    				url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
						value:"name",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
	    			
					},{
						name:"memberSigning.annualFee",
						label:"服务费",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"checkOutBoolean",
						label:"是否退服务费",
						type:"select",
	    				options:[{
	    					key:"false",
	    					value:"否"
	    				},{
	    					key:"true",
	        				value:"是"
	    				}],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
					},{
						name:"checkOutReasonType",
						label:"退房原因类型",
						type :"select",
						options : enmu["com.eling.elcms.checkout.model.CheckOutRoomApply.CheckOutReasonType"],
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"checkOutReason",
						label:"退房原因",
						type :"textarea",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"annualCheckOutFee",
						label:"退费金额",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
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
					 widget.get("grid").refresh();
				}
			},
	});
	module.exports = checkoutroomconfirm;
});
