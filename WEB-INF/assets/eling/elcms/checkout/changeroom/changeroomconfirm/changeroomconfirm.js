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
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-approvalUI hidden'></div>";
	var changeroomconfirm = ELView.extend({
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"换房确认",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/changeroomapply/search",
							data : {
								s : str,
								flowStatus:"Approved",
								properties : "memberSigning.card.name,memberSigning.room.number,memberSigning.members.personalInfo.name,room",
								fetchProperties:"*,pkChangeRoomApply," +
								"memberSigning.members," +
								"memberSigning.members.status," +
								"memberSigningNew.members.status," +
								"memberSigning.annualFee," +
								"memberSigning.members.personalInfo.name," +
								"memberSigning.card.name," +
								"memberSigning.room.number," +
								"memberSigning.checkInDate,room.number," +
								"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
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
		   			 id:"changeConfrim",
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
							widget.get("subnav").show(["building","time","changeConfrim","search"]).hide(["return"]);
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
				url : "api/changeroomapply/query",
				fetchProperties:"*,pkChangeRoomApply," +
						"memberSigning.members," +
						"memberSigning.annualFee," +
						"memberSigning.members.personalInfo.name," +
						"memberSigning.card.name," +
						"memberSigning.members.status," +
						"memberSigningNew.members.status," +
						"memberSigning.room.number," +
						"memberSigning.checkInDate,room.number," +
						"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
						"personalInfo.name",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						pkChangeRoomApply:params?params.modelId:"",
						createDate:widget.get("subnav").getValue("time").start,
						createDateEnd:widget.get("subnav").getValue("time").end,
						changeConfrim:widget.get("subnav").getValue("changeConfrim"),
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
						name:"原房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
								widget.get("subnav").hide(["building","time","changeConfrim","search"]).show(["return"]);
								var form = widget.get("form");
								form.setData(data);
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
							name: i18ns.get("sale_ship_owner","会员"),
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
							if(row.changeConfrim == false){
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
									content:"换房确认？",
									confirm:function(){
										
										aw.ajax({
											url:"api/changeroomapply/checkconfrim",
											data:{
												pkChangeRoomApply:data.pkChangeRoomApply,
											},
											dataType:"json",
											success:function(datas){
												
												if(datas.msg == "OK"){
													Dialog.alert({
						                        		title:"提示",
						                        		showBtn:false,
						                        		content:"正在处理，请稍后……"
						                        	});
													aw.ajax({
														url:"api/changeroomapply/confim",
														data:{
															pkChangeRoomApply:data.pkChangeRoomApply,
														},
														dataType:"json",
														success:function(data){
															Dialog.close();
															widget.get("grid").refresh({
																pkChangeRoomApply:data.pkChangeRoomApply,
																fetchProperties:"*,pkChangeRoomApply," +
																"memberSigning.members," +
																"memberSigning.annualFee," +
																"memberSigning.members.personalInfo.name," +
																"memberSigning.card.name," +
																"memberSigning.room.number," +
																"memberSigning.room.pkRoom," +
																"memberSigning.checkInDate," +
																"personalInfo.name," +
																"memberSigning.pkMemberSigning,checkOutReason",
															});
														}
													});
												}else{
													Dialog.alert({
					        							content : datas.msg
					        						 });
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
        		model:{
    				id:"changeroomapply",
    				items:[{
    					name:"memberSigning.room.number",
    					label:"原房间号",
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
    					label: i18ns.get("sale_card_name","会籍卡"),
    					readonly:true,
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
    					name:"memberNames",
    					label:i18ns.get("sale_ship_owner","会员"),
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
    					name:"changeReason",
    					label:"换房原因",
    					type :"textarea",
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
						key:"changeConfrim",
						name:"确认状态",
						format:function(value,row){
							if(value == true){
								return "已确认";
							}else{
								return "未确认";
							}
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
	});
	module.exports = changeroomconfirm;
});
