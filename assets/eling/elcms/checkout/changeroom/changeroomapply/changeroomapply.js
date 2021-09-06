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
    var template="<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 " <div class='J-memberGrid hidden' ></div>"+
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-PrintForm hidden' style='border:0 none;' ></div>" +
	 "<div class='J-approvalUI hidden'></div>";
	var changeroomapply = ELView.extend({
		events : {
			"click .J-print":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var widget=this;
				widget.show([".J-PrintForm",".J-approvalUI"]).hide([".J-grid"]);
				widget.get("subnav").hide(["building","time","flowStatus","add","search"]);
				var form = widget.get("printform");
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
				}else{
					for(var i=0;i<data.memberSigningNew.members.length;i++){
						if(i<data.memberSigningNew.members.length-1){
							dataname+= data.memberSigningNew.members[i].personalInfo.name+"("+data.memberSigningNew.members[i].status.value+"),";
						}else{
							dataname+= data.memberSigningNew.members[i].personalInfo.name+"("+data.memberSigningNew.members[i].status.value+")";
						}
					}
				}
				form.setValue("user",data.user.name);
				form.setValue("memberNames",dataname);
				form.setValue("changeReason",data.changeReason);
				form.setValue("changeDate",moment(data.changeDate).format("YYYY-MM-DD"));
				form.setValue("annualFeeDate",moment(data.annualFeeDate).format("YYYY-MM-DD"));
				form.setValue("roomNumber",data.memberSigning.room.number);
				var room=form.getData("room","");
				room.push(data.room);
				form.setData("room",room);
				form.setValue("room",data.room);
				form.setValue("cardName",data.memberSigning.card.name);
				form.setValue("annualFee1",data.memberSigning.annualFee);
				form.setValue("personalInfo",data.personalInfo.name);
				form.setDisabled(true);
				var approvalUI  = widget.get("approvalUI");
				approvalUI.set("param",{
					modelId:data.pkChangeRoomApply,
					serviceType:"ChangeRoomApply", 
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
				title:"换房申请",
				search : function(str) {
					if($(".J-grid").hasClass("hidden")){
						var g=widget.get("memberGrid");
						g.loading();
						aw.ajax({
							url : "api/membersign/searchcheckouandchange",
							data : {
								s : str,
								properties : "room.number,card.name",
								"houseingNotIn" : false,
								"status" : "Normal",
								fetchProperties : "*,members.personalInfo.name,"+
								        "user.pkUser,"+
										"user.name," +
										"room.number," +
										"members.status," +
										"annualFee,"+
										"checkInDate,card.name,"+
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
							url : "api/changeroomapply/search",
							data : {
								s : str,
								properties : "memberSigning.card.name,memberSigning.room.number,memberSigning.members.personalInfo.name,",
								fetchProperties : "*,pkChangeRoomApply," +
								"user.pkUser,"+
								"user.name," +
								"memberSigning.members," +
								"memberSigning.annualFee," +
								"memberSigning.members.personalInfo.name," +
								"memberSigning.card.name," +
								"memberSigning.members.status," +
								"memberSigningNew.members.status," +
								"memberSigning.room.number," +
								"memberSigning.room.pkRoom," +
								"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
								"memberSigning.checkInDate," +
								"personalInfo.name,room.number," +
								"memberSigning.pkMemberSigning,changeReason",
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
						widget.show([".J-grid"]).hide([".J-memberGrid",".J-form",".J-approvalUI"]);
						return false;
					}
				},{
					id:"returnmembergrid",
					text:"返回",
					show:false,
					type:"button",
					handler:function(){
						widget.get("subnav").hide(["time","flowStatus","add","returnmembergrid"]).show(["return","building","search"]);
						widget.hide([".J-grid",".J-form"]).show([".J-memberGrid"]);
					}
				}]
			}
		})
		 this.set("subnav",subnav);
		var grid=new Grid({
			parentNode:".J-grid",
			url : "api/changeroomapply/query",
			fetchProperties:"*,pkChangeRoomApply," +
					"user.pkUser," +
					"user.name," +
					"memberSigning.members," +
					"memberSigning.annualFee," +
					"memberSigning.members.personalInfo.name," +
					"memberSigning.card.name," +
					"memberSigning.room.number," +
					"memberSigning.room.pkRoom," +
					"memberSigning.members.status," +
					"memberSigningNew.members.status," +
					"memberSigning.checkInDate," +
					"personalInfo.name,room.number," +
					"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
					"memberSigning.pkMemberSigning,changeReason",
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
					name: i18ns.get("sale_card_name","会籍卡")
				},{
					key:"memberSigning.room.number",
					name:"原房间号",
					format:"detail",
					formatparams:[{
						key:"detail",
						handler:function(index,data,rowEle){

							widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
							widget.get("subnav").hide(["building","time","flowStatus","add","search"]).show(["return"]);
							var form = widget.get("form");
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
							}else{
								for(var i=0;i<data.memberSigningNew.members.length;i++){
									if(i<data.memberSigningNew.members.length-1){
										dataname+= data.memberSigningNew.members[i].personalInfo.name+"("+data.memberSigningNew.members[i].status.value+"),";
									}else{
										dataname+= data.memberSigningNew.members[i].personalInfo.name+"("+data.memberSigningNew.members[i].status.value+")";
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
							form.setValue("memberNames",dataname);
							form.setValue("changeReason",data.changeReason);
							form.setValue("changeDate",data.changeDate);
							form.setValue("roomNumber",data.memberSigning.room.number);
							var room=form.getData("room","");
							room.push(data.room);
							form.setData("room",room);
							form.setValue("room",data.room);
							form.setValue("cardName",data.memberSigning.card.name);
							form.setValue("annualFee1",data.memberSigning.annualFee);
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
							widget.show([".J-form"]).hide([".J-form-changeroomapply-cancel"]);
							var form = widget.get("form");
							form.reset();
							form.setData(data);
							var member = data.memberSigning.members; 
							form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
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
									form.setValue("personalInfo",data.personalInfo.pkPersonalInfo);
								}
							});
							var userSelect=form.getData("user","");
							userSelect.push(activeUser);
							form.setData("user",userSelect);
							form.setValue("user",data.user);
							form.setAttribute("user","readonly","readonly");
							form.setValue("memberNames",dataname);
							form.setValue("version",data.version);
							form.setValue("roomNumber",data.memberSigning.room.number);
							form.setValue("cardName",data.memberSigning.card.name);
							form.setValue("annualFee1",data.memberSigning.annualFee);
						}
					},{
						key:"delete",
						icon:"remove",
						handler:function(index,data,rowEle){
							aw.del("api/changeroomapply/" + data.pkChangeRoomApply + "/delete",function(data) {
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
										url:"api/changeroomapply/submit",
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
					"room.status":"InUse",
					"houseingNotIn" : false,
					"status" : "Normal",
					fetchProperties:"*,members.personalInfo.name,"+
									"members.status," +
									"room.number," +
									"annualFee,"+
									"checkInDate,card.name,"+
									"pkMemberSigning"
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
				name:i18ns.get("sale_ship_owner","会员"),
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
					text:"换房",
					handler:function(index,data,rowEle){
						aw.ajax({
							url:"api/annualfees/checkoutroom",
							data:{
								"memberSigning.pkMemberSigning":data.pkMemberSigning,
								chargeStatus:"Receiving"
							},
							dataType:"json",
							success:function(datas){
								if(datas.chargeStatus.key == "Receiving"){
									var form = widget.get("form");
									form.reset();
									widget.show([".J-form"]).show([".J-form-changeroomapply-cancel"]);
									form.setValue("roomNumber",data.room.number);
									form.setValue("memberSigning",data.pkMemberSigning);
									form.setValue("cardName",data.card.name);
									var name="";
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
									form.setValue("annualFee1",data.annualFee);
									form.setAttribute("user","readonly","readonly");
									form.load("personalInfo");
									form.load("room");
									widget.get("subnav").hide(["search","building","return"]).show(["returnmembergrid"]);
									widget.show([".J-form"]).hide([".J-memberGrid"]);
								}else{
									Dialog.alert({
										content:"房间"+data.room.number+"的当前服务费未缴纳，请进行服务费缴纳并财务确认到账后再申请换房。"
									});
									return false;
								}
							}
						});
					}
				}]
			}]
		},
		})
		this.set("memberGrid",memberGrid);
		
		var form = new Form({
			parentNode:".J-form",
			saveaction:function(){
				if(isNaN(widget.get("form").getValue("annualFeeNew"))){
     				Dialog.alert({
							content : "请输入有效的服务费金额"
						 });
     				return false;
     			}
				var transferFees = widget.get("form").getValue("transferFees");
				var annualFee1= widget.get("form").getValue("annualFee1");
				if (Number(transferFees) > Number(annualFee1)) {
					Dialog.alert({
						content : "结转金额应该小于原房间服务费！"
					 });
					return false;
				}
				aw.saveOrUpdate("api/changeroomapply/save",$("#changeroomapply").serialize(),function(data){
					widget.get("subnav").show(["building","time","flowStatus","add","search"]).hide(["return","returnmembergrid"]);
					widget.show([".J-grid"]).hide([".J-form"]);
					widget.get("grid").refresh();
				});
				
			},
			cancelaction:function(){
				widget.get("subnav").hide(["time","flowStatus","add","returnmembergrid"]).show(["return","building","search"]);
				widget.hide([".J-grid",".J-form"]).show([".J-memberGrid"]);
			},
			model:{
				id:"changeroomapply",
				items:[{
					name:"pkChangeRoomApply",
					type:"hidden"
				},{
					name:"memberSigning",
					type:"hidden"
				},{
					name:"changeConfrim",
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
					label:"当前房间号",
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"room",
					label:"新房间号",
					type:"select",
					url:"api/room/queryChange",
					key:"pkRoom",
					value:"number",
					params:{
							status:"Empty",
							useType:"Apartment",
							fetchProperties:"pkRoom,number"
					},
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
    				name:"user",
    				label:"经手人",
    				type:"select",
    				key:"pkUser",
    				url:"api/users",//TODO 用户角色：wulina
    				params:{
						fetchProperties:"pkUser,name"
					},
					value:"name",
					lazy:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
					validate:["required"],
    			
				},{
					name:"memberNames",
					label: i18ns.get("sale_ship_owner","会员"),
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"personalInfo",
					label:"申请人",
					type:"select",
					url:"api/personalinfo/queryPersonalInfoByMemberSigningRemoceDie",
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
					name:"annualFee1",
					label:"原房间服务费",
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"annualFeeNew",
					label:"新房间服务费",
					validate:["required"],
					exValidate : function(value){
						//校验金额
						var reg=/^[1-9]{1}\d*(\.\d{1,2})?$/;
						if (!reg.test(value)) {
							return "请输入正确的金额！";
						} else {
							return true;
						}
					},
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"changeDate",
					label:"换房日期",
					type:"date",
					mode:"Y-m-d",
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				
				},{
					name:"annualFeeDate",
					label:"服务费生效日期",
					type:"date",
					mode:"Y-m-d",
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name : "transferFees",
					label : "结转金额",
					validate:["required"],
					exValidate : function(value){
						//校验金额
						var reg=/^[1-9]{1}\d*(\.\d{1,2})?$/;
						if (!reg.test(value)) {
							return "请输入正确的金额！";
						} else {
							return true;
						}
					},
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"changeReason",
					label:"换房原因",
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
				id:"changeroomapply",
				defaultButton:false,
				items:[{
					name:"roomNumber",
					label:"当前房间号",
					readonly:true,
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"room",
					label:"新房间号",
					type:"select",
					url:"api/room/queryChange",
					key:"pkRoom",
					value:"number",
					params:{
							status:"Empty",
							useType:"Apartment",
							fetchProperties:"pkRoom,number"
					},
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"cardName",
					label:  i18ns.get("sale_card_name","会籍卡"),
					readonly:true,
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
					name:"memberNames",
					label:  i18ns.get("sale_ship_owner","会员"),
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
					name:"annualFee1",
					label:"原房间服务费",
					readonly:true,
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"annualFeeNew",
					label:"新房间服务费",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"changeDate",
					label:"换房日期",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				
				},{
					name:"annualFeeDate",
					label:"服务费生效日期",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"changeReason",
					label:"换房原因",
					type :"textarea",
					style:{
						container:"width:100%;height:100px;",
						label:"width:40%;float:left;",
						value:"width:82%;height:100px;float:right;margin:-30px 0px 0px -10px; "
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
	module.exports = changeroomapply;
});
