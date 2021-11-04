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
	var enmu = require("enums");
	require("./checkoutroomapply.css");
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 " <div class='J-memberGrid hidden' ></div>"+
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-PrintForm hidden'style='border:0 none;height:280px;' ></div>" +
	 "<div class='J-approvalUI hidden'style='border:0 none;margin:10px 0px 0px 0px'></div>";
	var checkoutroomapply = ELView.extend({
		_showCheckOutRoomForm : function (widget, data){
			var form = widget.get("form");
			form.reset();
			form.setValue("roomNumber",data.room.number);
			form.setValue("memberSigning",data.pkMemberSigning);
			form.setValue("cardName",data.card.name);
			var name="";
			var checkOutFlag = true;
			for(var i=0;i<data.members.length;i++){
				if(i<data.members.length-1){
					name+= data.members[i].personalInfo.name+"("+data.members[i].status.value+"),";
				}else{
					name+= data.members[i].personalInfo.name+"("+data.members[i].status.value+")";
				}
			}
			var userSelect=form.getData("user","");
			userSelect.push(activeUser);
			form.setData("user",userSelect);
			form.setValue("user",activeUser); 
			form.setValue("memberNames",name);
			form.setAttribute("user","readonly","readonly");
			form.setValue("annualFee1",data.annualFee);
			form.setValue("checkOutBoolean","false");
			form.load("personalInfo");
			form.hide("annualCheckOutFee");
		},
		_setCheckOutRoomForm : function (widget, data){
			var form = widget.get("form");
			form.reset();
			form.setData(data);
			form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
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
			form.load("personalInfo",{
				callback:function(){
					var personalInfo=form.getData("personalInfo","");
					personalInfo.push(data.personalInfo);
					form.setData("personalInfo",personalInfo);
					form.setValue("personalInfo",data.personalInfo);
				}
			});
			form.load("user",{
				callback:function(){
					var user=form.getData("user","");
					user.push(data.user);
					form.setData("user",user);
					form.setValue("user",data.user);
				}
			});
			form.setAttribute("user","readonly","readonly");
			form.setValue("checkOutBoolean",data.checkOutBoolean);
			form.setValue("memberNames",dataname);
			form.setValue("version",data.version);
			form.setValue("pkCheckOutRoomApply",data.pkCheckOutRoomApply);
			form.setValue("checkOutReason",data.checkOutReason);
			form.setValue("checkOutReasonType",data.checkOutReasonType);
			form.setValue("checkOutDate",data.checkOutDate);
			form.setValue("roomNumber",data.memberSigning.room.number);
			form.setValue("cardName",data.memberSigning.card.name);
			form.setValue("annualFee1",data.memberSigning.annualFee);
			form.setValue("personalInfo",data.personalInfo.pkPersonalInfo);
			if(data.checkOutBoolean == "true"){
				form.setValue("annualCheckOutFee",data.annualCheckOutFee);
			}else{
				form.hide(["annualCheckOutFee"]);
			}
		},
		events : {
			"change .J-form-checkoutroomapply-select-checkOutBoolean ":function(e){
				var form=this.get("form");
				var checkout = form.getValue("checkOutBoolean");
				if(checkout == "true"){
					form.show("annualCheckOutFee");
				}else{
					form.setValue("annualCheckOutFee",0);
					form.hide("annualCheckOutFee");
				}
			},
//			"change .J-form-checkoutroomapply-date-checkOutDate ":function(e){
//				var form=this.get("form");
//				var checkoutDate = form.getValue("checkOutDate");
//				if(checkoutDate < moment()._i){
//					Dialog.alert({
//						content:"退房日期必须是当前日期之后！"
//					});
//					form.setValue("checkOutDate","");
//				}
//			}
			"click .J-print":function(e){
				var widget =this;
				var grid=widget.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				widget.show([".J-PrintForm",".J-approvalUI"]).hide([".J-grid"]);
				widget.get("subnav").hide(["building","time","flowStatus","add","search"]);
				var form = widget.get("printform");
				form.setData(data);
				form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
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
				form.setValue("personalInfo",data.personalInfo.name);
				form.setValue("user",data.user.name);
				if(data.checkOutBoolean=="true"){
					form.setValue("checkOutBoolean","是");
				}else{
					form.setValue("checkOutBoolean","否");
				}
				form.setValue("memberNames",dataname);
				form.setValue("checkOutReason",data.checkOutReason);
				form.setValue("checkOutReasonType",data.checkOutReasonType.value);
				form.setValue("checkOutDate",moment(data.checkOutDate).format("YYYY-MM-DD"));
				form.setValue("roomNumber",data.memberSigning.room.number);
				form.setValue("cardName",data.memberSigning.card.name);
				form.setValue("annualFee1",data.memberSigning.annualFee);
				if(data.checkOutBoolean == "true"){
					form.setValue("annualCheckOutFee",data.annualCheckOutFee);
				}else{
					form.hide(["annualCheckOutFee"]);
				}
				
				var approvalUI  = widget.get("approvalUI");
				approvalUI.set("param",{
					modelId:data.pkCheckOutRoomApply,
					serviceType:"CheckOutRoomApply",
					hideButton:true,
				});
			
				approvalUI.get("appgrid").refresh(null,function(data){
					window.print();
					widget.hide([".J-PrintForm",".J-approvalUI"]).show([".J-grid"]);
					widget.get("subnav").show(["building","time","flowStatus","add","search"]);
                });

		}
	
		},
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			
		var subnav=new Subnav({
			parentNode:".J-subnav",
			model:{
				title:"退房申请",
				search : function(str) {
					if($(".J-grid").hasClass("hidden")){
						var g=widget.get("memberGrid");
						g.loading();
						aw.ajax({
							url : "api/membersign/searchcheckouandchange",
							data : {
								s : str,
								//TODO cjf 2015年12月15日15:07:23 针对C卡会籍房间回收的功能，查询时增加一个房间状态为“不住”，用于选房不住的会员签约进行退房
								"room.statusIn":"InUse,NotLive",
								//TODO cjf 2015年12月15日15:09:44 针对C卡会籍房间回收的功能，查询时增加一个会员签约状态为“选房不住”，用于选房不住的会员签约进行退房
								"status" : "Normal",
								"houseingNotIn" : false,
								properties : "room.number,card.name,members.personalInfo.name,annualFee,checkInDate,members.status",
								fetchProperties : "*,members.personalInfo.name,"+
										"room.number," +
										"annualFee,"+
										"checkInDate,card.name,"+
										"members.status," +
										"pkMemberSigning"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					}else{
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/checkoutroomapply/search",
							data : {
								s : str,
								properties : "memberSigning.card.name,memberSigning.room.number,"+
								"memberSigning.members.personalInfo.name,personalInfo.name,"+
								"memberSigning.checkInDate,"+
								"memberSigning.annualFee," +
								"memberSigning.members.status," +
								"flowStatus.value," +
								"checkOutReason",
								fetchProperties : "*,pkCheckOutRoomApply," +
								"memberSigning.members," +
								"memberSigning.annualFee," +
								"memberSigning.members.status," +
								"memberSigning.members.personalInfo.name," +
								"memberSigning.card.name," +
								"memberSigning.room.number," +
								"memberSigning.room.pkRoom," +
								"memberSigning.checkInDate," +
								"personalInfo.name,flowStatus.value," +
								"memberSigning.pkMemberSigning,checkOutReason," +
								"checkOutReasonType",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					}
					
				},
				buttonGroup:[{
					id:"building",
					showAll:true,
					handler:function(key,element){
						widget.get("grid").refresh();
						widget.get("memberGrid").refresh();
					}
				
				},{
	   			 id:"flowStatus",
	   			 tip:"审批状态",
					items:[{
						key :"Initial",
						value:"初始"
					},{
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
				time:{
					tip :"申请时间",
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
				buttons:[{
					id:"add",
					text:"新增",
					type:"button",
					handler:function(){
						widget.get("subnav").hide(["time","flowStatus","add"]).show(["return"]);
						widget.get("subnav").setValue("search","");
						widget.hide([".J-grid"]).show([".J-memberGrid"]);
						widget.get("memberGrid").refresh();
						return false;
					}
				},{
					id:"return",
					text:"返回",
					show:false,
					type:"button",
					handler:function(){
						widget.get("subnav").show(["time","flowStatus","add","building","search"]).hide(["return"]);
						widget.get("subnav").setValue("search","");
						widget.show([".J-grid"]).hide([".J-memberGrid",".J-form",".J-approvalUI"]);
						return false;
					}
				},{
					id:"return1",
					text:"返回",
					show:false,
					type:"button",
					handler:function(){
						widget.get("subnav").show(["building","search","return"]).hide(["return1"]);
						widget.show([".J-memberGrid"]).hide([".J-form"]);
					}
				}
				]
			}
		})
		 this.set("subnav",subnav);
		var grid=new Grid({
			parentNode:".J-grid",
			url : "api/checkoutroomapply/query",
			fetchProperties:"*,pkCheckOutRoomApply," +
					"user.pkUser,"+
					"user.name,"+
					"memberSigning.members," +
					"memberSigning.annualFee," +
					"memberSigning.members.personalInfo.name," +
					"memberSigning.card.name," +
					"memberSigning.members.status," +
					"memberSigning.room.number," +
					"memberSigning.room.pkRoom," +
					"memberSigning.checkInDate," +
					"personalInfo.name,flowStatus.value," +
					"memberSigning.pkMemberSigning,checkOutReason,checkOutReasonType",
			params:function(){
				var subnav=widget.get("subnav");
				return {
					createDate:widget.get("subnav").getValue("time").start,
					createDateEnd:widget.get("subnav").getValue("time").end,
					"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
					flowStatus:subnav.getValue("flowStatus")
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
							widget.get("subnav").hide(["building","time","flowStatus","add","search"]).show(["return"]);
							widget._setCheckOutRoomForm(widget, data);
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
						if(row.flowStatus.key=="Initial"){
							return "button";
						}else if(row.flowStatus.key=="Approved"){
							return "<pre><a style='margin-left:5px;color:white;background:#f34541' class='J-print btn btn-xs ' href='javascript:void(0);''>打印</a></pre>";
						}else{
							return "";
						}   
						},
					formatparams:[{
						key:"detil",
						icon:"edit",
						handler:function(index,data,rowEle){
							widget.show([".J-form"]).hide([".J-grid"]);
							widget.get("subnav").hide(["building","time","flowStatus","add","search"]).show(["return"]);
							widget._setCheckOutRoomForm(widget, data);
						}
					},{
						key:"delete",
						icon:"remove",
						handler:function(index,data,rowEle){
							if (data.checkOutReasonType.key == "ChangeRoom" && data.user == null){
								Dialog.alert({
	                				content:"本条退房申请记录为换房时系统自动生成，无法删除！"
	                			});
	                			return false;
							}
							aw.del("api/checkoutroomapply/" + data.pkCheckOutRoomApply + "/delete",function(data) {
								  widget.get("grid").refresh();
							});
						}
					},{
						key:"edit",
						text:"提交",
						handler:function(index,data,rowEle){
							Dialog.confirm({
								setStyle:function(){},
								content:"确认提交？",
								confirm:function(){
									Dialog.alert({
										title:"提示",
										showBtn:false,
										content:"正在处理，请稍后……"
									});
									aw.ajax({
										url:"api/checkoutroomapply/submit",
										data:{
											pkCheckOutRoomApply:data.pkCheckOutRoomApply,
										},
										dataType:"json",
										success:function(data){
						                	Dialog.close();
											widget.get("grid").refresh({
												pkCheckOutRoomApply:data.pkCheckOutRoomApply,
												fetchProperties:"*,pkCheckOutRoomApply," +
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
										},
						                error: function (data){
						                	Dialog.close();
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
		var memberGrid=new Grid({
			parentNode:".J-memberGrid",
			autoRender : false,
			url:"api/membersign/querycheckout",
			params:function(){
				return {
					"room.building.pkBuilding":widget.get("subnav").getValue("building"), 
					//TODO cjf 2015年12月15日15:07:23 针对C卡会籍房间回收的功能，查询时增加一个房间状态为“不住”，用于选房不住的会员签约进行退房
					"room.statusIn":"InUse,NotLive",
					//TODO cjf 2015年12月15日15:09:44 针对C卡会籍房间回收的功能，查询时增加一个会员签约状态为“选房不住”，用于选房不住的会员签约进行退房
					"status" : "Normal",
					fetchProperties:"*,members.personalInfo.name,members.status,room.number,annualFee,checkInDate,card.name,pkMemberSigning"
				};
				
			},
			model:{ 
			columns:[{
				key:"card.name",
				name: i18ns.get("sale_card_name","会籍卡"),
			},{
				key : "room.number",
				name :"房间号"
			},{
				key:"members",
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
				key:"checkInDate",
				name:"入住日期",
				format:"date"
			},{
				key:"annualFee",
				name:"服务费"
			},{
				key:"operate",
				name:"操作",
				format:function(row,value){
					return "button"
 			},
				formatparams:[{
					key:"edit",
					text:"退房",
					handler:function(index,data,rowEle){
						var checkOutFlag = true;
						for(var i=0;i<data.members.length;i++){
							if(data.members[i].status.key != "CheckOut"){
								checkOutFlag = false;
							}
						}
						//如果有会员没有退住，查看会员是否存在没有完成的退住申请单
						if (!checkOutFlag){
							Dialog.alert({
								title:"提示",
								showBtn:false,
								content:"正在处理，请稍后……"
							});
							aw.ajax({
								url:"api/checkoutlivingapply/query",
								data:{
									memberSigning:data.pkMemberSigning,
								},
								dataType:"json",
								success:function(checkOutList){
				                	Dialog.close();
				                	for(var i=0;i<checkOutList.length;i++){
				                		if (checkOutList[i].flowStatus.key != 'Approved'){				                			
				                			Dialog.alert({
				                				content:"该房间"+i18ns.get("sale_ship_owner","会员")+"存在未完成的退住申请，无法退房！"
				                			});
				                			return false;
				                		}
				                	}
				                	widget._showCheckOutRoomForm(widget, data);
				                	widget.get("subnav").hide(["building","search","return"]).show(["return1"]);
				                	widget.show([".J-form"]).hide([".J-memberGrid"]);
				                },
				                error: function (checkOutList){
				                	Dialog.close();
			                    }
							});
						}else{
		                	widget._showCheckOutRoomForm(widget, data);
		                	widget.get("subnav").hide(["building","search","return"]).show(["return1"]);
		                	widget.show([".J-form"]).hide([".J-memberGrid"]);
						}						
					}
				}]
			}]
		},
		})
		this.set("memberGrid",memberGrid);
		
		var form = new Form({
			parentNode:".J-form",
			saveaction:function(){
				if(widget.get("form").getValue("checkOutBoolean") == "true"){
					if(isNaN(widget.get("form").getValue("annualCheckOutFee"))){
	     				Dialog.alert({
								content : "请输入有效的退款金额"
							 });
	     				return false;
	     			}
					if(Number(widget.get("form").getValue("annualCheckOutFee")) > Number(widget.get("form").getValue("annualFee1"))){
						Dialog.alert({
							content : "退款金额不能大于服务费！"
						 });
						return false;
					}
				}
				aw.saveOrUpdate("api/checkoutroomapply/save",$("#checkoutroomapply").serialize(),function(data){
					widget.get("subnav").show(["building","time","flowStatus","add"]).hide(["return1"]);
					widget.show([".J-grid"]).hide([".J-form"]);
					widget.get("grid").refresh();
				});
				
			},
			cancelaction:function(){
				widget.get("subnav").show(["building","search","return"]).hide(["return1"]);
				widget.show([".J-memberGrid"]).hide([".J-form"]);
			},
			model:{
				id:"checkoutroomapply",
				items:[{
					name:"pkCheckOutRoomApply",
					type:"hidden"
				},{
					name:"memberSigning",
					type:"hidden"
				},{

					name:"checkOutConfrim",
					type:"hidden",
					defaultValue:false
				
				},{
					name:"createDate",
					type:"hidden",
				},{
					name:"version",
					type:"hidden",
					defaultValue:"0"
				},
				{
					name:"flowStatus",
					type:"hidden",
					defaultValue:"Initial"
				},{
					name:"roomNumber",
					label:"房间号",
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"checkOutDate",
					label:"退房日期",
					type:"date",
					mode:"Y-m-d",
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				
				},{
					name:"cardName",
					label: i18ns.get("sale_card_name","会籍卡"),
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"personalInfo",
					label:"申请人",
					type:"select",
					url:"api/personalinfo/queryPersonalInfoByMemberSigning",
					key:"pkPersonalInfo",
					value:"name",
					lazy:true,
					params:function(){
						return {
							"memberSigning":widget.get("form").getValue("memberSigning"),
							fetchProperties:"pkPersonalInfo,name"
						};
						
					},
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"memberNames",
					label: i18ns.get("sale_ship_owner","会员"),
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
    				lazy:true,
    				params:{
						fetchProperties:"pkUser,name"
					},
					value:"name",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
					validate:["required"],
    			
				},{
					name:"annualFee1",
					label:"服务费",
					readonly:true,
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
    				validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
				},{
					name:"annualCheckOutFee",
					label:"退费金额",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
					defaultValue:"0",
					validate:["required"],
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
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				}]
			}
		})
		this.set("form",form);
		var printform = new Form({
			parentNode:".J-PrintForm",
			model:{
				id:"checkoutroomapply",
				defaultButton:false,
				items:[{
					name:"pkCheckOutRoomApply",
					type:"hidden"
				},{
					name:"memberSigning",
					type:"hidden"
				},{

					name:"checkOutConfrim",
					type:"hidden",
					defaultValue:false
				
				},{
					name:"createDate",
					type:"hidden",
				},{
					name:"version",
					type:"hidden",
					defaultValue:"0"
				},
				{
					name:"flowStatus",
					type:"hidden",
					defaultValue:"Initial"
				},{
					name:"roomNumber",
					label:"房间号",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"checkOutDate",
					label:"退房日期",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				
				},{
					name:"cardName",
					label: i18ns.get("sale_card_name","会籍卡"),
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"personalInfo",
					label:"申请人",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"memberNames",
					label: i18ns.get("sale_ship_owner","会员"),
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
    				name:"user",
    				label:"经手人",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"annualFee1",
					label:"服务费",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"checkOutBoolean",
					label:"是否退服务费",
    				style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"annualCheckOutFee",
					label:"退费金额",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"checkOutReason",
					label:"退房原因",
					type :"textarea",
					style:{
						container:"width:100%;height:100px;",
						label:"width:40%;float:left;",
						value:"width:82%;height:80px;float:right;margin:-30px 0px 0px -10px; "
					}
				},{
					name:"checkOutReasonType",
					label:"退房原因类型",
    				style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				}]
			}
		})
		this.set("printform",printform);
		var  approvalUI = new ApprovalUI({
			parentNode : ".J-approvalUI",
		});
		approvalUI.render();
		this.set("approvalUI",approvalUI);
		},
	});
	module.exports = checkoutroomapply;
});
