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
	var RoomTypes = new Array();
	var BuildingDatas = new Array();
    var template="<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 " <div class='J-memberGrid hidden' ></div>"+
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-approvalUI hidden'></div>";
	var changeroomappointmentapply = ELView.extend({
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			
		var subnav=new Subnav({
			parentNode:".J-subnav",
			model:{
				title:"换房预约",
				search : function(str) {
					if($(".J-grid").hasClass("hidden")){
						var g=widget.get("memberGrid");
						g.loading();
						aw.ajax({
							url : "api/membersign/search",
							data : {
								s : str,
								properties : "room.number,card.name",
								"status" : "Normal",
								"houseingNotIn" : false,
								fetchProperties : "*,members.personalInfo.name,"+
										"room.number," +
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
							url : "api/changeroomappointment/search",
							data : {
								s : str,
								properties : "memberSigning.card.name,memberSigning.room.number,memberSigning.members.personalInfo.name,",
								fetchProperties : "*,pkChangeRoomAppointment," +
								"memberSigning.members," +
								"memberSigning.annualFee," +
								"memberSigning.members.personalInfo.name," +
								"memberSigning.card.name," +
								"memberSigning.room.number," +
								"memberSigning.room.pkRoom," +
								"memberSigning.checkInDate," +
								"personalInfo.name," +
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
				}
				]
			}
		})
		 this.set("subnav",subnav);
		var grid=new Grid({
			parentNode:".J-grid",
			url : "api/changeroomappointment/query",
			fetchProperties:"*,pkChangeRoomAppointment," +
					"memberSigning.members," +
					"memberSigning.annualFee," +
					"memberSigning.members.personalInfo.name," +
					"memberSigning.card.name," +
					"memberSigning.room.number," +
					"memberSigning.room.pkRoom," +
					"memberSigning.checkInDate," +
					"personalInfo.name," +
					"memberSigning.pkMemberSigning," +
					"roomType.name," +
					"building.name,user.pkUser,user.name",
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
					name:"会籍卡"
				},{
					key:"memberSigning.room.number",
					name:"房间号",
					format:"detail",
					formatparams:[{
						key:"detail",
						handler:function(index,data,rowEle){
							widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
							widget.get("subnav").hide(["building","time","flowStatus","add","search"]).show(["return"]);
							var form = widget.get("form");
							form.setData(data);
							form.setData("roomType",RoomTypes);
							form.setData("building",BuildingDatas);
							form.setValue("roomType",data.roomType.pkRoomType);
							form.setValue("building",data.building.pkBuilding);
							form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
							var member = data.memberSigning.members; 
							var dataname = "";
							for(var i=0;i<member.length;i++){
								if(i<member.length-1){
									dataname+=member[i].personalInfo.name+",";
								}else{
									dataname+=member[i].personalInfo.name;
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
							var userSelect=form.getData("user","");
							userSelect.push(data.user);
							form.setData("user",userSelect);
							form.setValue("user",data.user);
							form.setValue("memberNames",dataname);
							form.setValue("roomNumber",data.memberSigning.room.number);
							form.setValue("cardName",data.memberSigning.card.name);
							form.setValue("annualFee1",data.memberSigning.annualFee);
							form.setDisabled(true);
							var approvalUI  = widget.get("approvalUI");
							approvalUI.set("param",{
								modelId:data.pkChangeRoomAppointment,
								serviceType:"changeroomappointment", 
								hideButton:true,
							});
							approvalUI.get("appgrid").refresh();
						}
					}]
				},{
					key:"memberSigning.members",
					name:i18ns.get("sale_ship_owner","会员"),
					format:function(value,row){
					var name="";
						for(var i=0;i<value.length;i++){
							if(i<value.length-1){
								name+= value[i].personalInfo.name+",";
							}else{
								name+= value[i].personalInfo.name;
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
						key:"roomType.name",
						name:"意向房型"
					},{
						key:"building.name",
						name:"意向楼"
					},{
						key:"floors",
						name:"意向楼层"
					},{
					key:"createDate",
					name:"申请日期 ",
					format:"date"
				},{
						key:"flowStatus.value",
						name:"审批状态"
					},{
					key:"operate",
					name:"操作",
					format:function(value,row){
						if(row.flowStatus.key=="Initial"){
							return "button";
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
							var form = widget.get("form");
							form.reset();
							form.setData(data);
							form.setData("roomType",RoomTypes);
							form.setData("building",BuildingDatas);
							var member = data.memberSigning.members; 
							form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
							var dataname = "";
							if(member.length>0){
								for(var i=0;i<member.length;i++){
									if(i<member.length-1){
										dataname+=member[i].personalInfo.name+",";
									}else{
										dataname+=member[i].personalInfo.name;
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
							userSelect.push(data.user);
							form.setData("user",userSelect);
							form.setValue("user",data.user);
	    					
							form.setData("roomType",RoomTypes);
							form.setData("building",BuildingDatas);
							form.setValue("roomType",data.roomType.pkRoomType);
							form.setValue("building",data.building.pkBuilding);
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
							aw.del("api/changeroomappointment/" + data.pkChangeRoomAppointment + "/delete",function(data) {
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
										url:"api/changeroomappointment/submit",
										data:{
											pkChangeRoomAppointment:data.pkChangeRoomAppointment,
										},
										dataType:"json",
										success:function(data){
											Dialog.close();
											widget.get("grid").refresh({
												pkChangeRoomAppointment:data.pkChangeRoomAppointment,
												fetchProperties:"*,pkChangeRoomAppointment," +
												"memberSigning.members," +
												"memberSigning.annualFee," +
												"memberSigning.members.personalInfo.name," +
												"memberSigning.card.name," +
												"memberSigning.room.number," +
												"memberSigning.room.pkRoom," +
												"memberSigning.checkInDate," +
												"personalInfo.name,room.number," +
												"memberSigning.pkMemberSigning," +
												"roomType.name," +
												"building.name",
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
					"status" : "Normal",
					"houseingNotIn" : false,
					fetchProperties:"*,members.personalInfo.name,"+
										"room.number," +
										"annualFee,"+
									"checkInDate,card.name,"+
									"pkMemberSigning"
				};
				
			},
			model:{ 
			columns:[{
				key:"card.name",
				name:"会籍卡"
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
							name+= value[i].personalInfo.name+",";
						}else{
							name+= value[i].personalInfo.name;
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
					text:"换房预约",
					handler:function(index,data,rowEle){
						var form = widget.get("form");
						form.reset();
						form.setData("roomType",RoomTypes);
						form.setData("building",BuildingDatas);
						form.setValue("roomNumber",data.room.number);
						form.setValue("memberSigning",data.pkMemberSigning);
						form.setValue("cardName",data.card.name);
						var name="";
						for(var i=0;i<data.members.length;i++){
							if(i<data.members.length-1){
								name+= data.members[i].personalInfo.name+",";
							}else{
								name+= data.members[i].personalInfo.name;
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
						widget.get("subnav").hide(["search","building"]);
						widget.show([".J-form"]).hide([".J-memberGrid"]);
					}
				}]
			}]
		},
		})
		this.set("memberGrid",memberGrid);
		
		var form = new Form({
			parentNode:".J-form",
			saveaction:function(){
				var form = widget.get("form");
				var floors = form.getValue("floors");
				if(floors != null && floors != undefined){
					aw.ajax({
						url:"api/building/query",
						data:{
							pkBuilding:form.getValue("building"),
						},
						dataType:"json",
						success:function(data){
							if(isNaN(floors)){
			     				Dialog.alert({
										content : "请输入有效的楼层！"
									 });
			     				return false;
			     			}
							if(data[0].floors <= Number(floors)){
								Dialog.alert({
									content : "意向楼"+data[0].name+"最高为 "+data[0].floors+" 层！"
								 });
								return false;
							}
							aw.saveOrUpdate("api/changeroomappointment/save",$("#changeroomappointment").serialize(),function(data){
								widget.get("subnav").show(["building","time","flowStatus","add"]).hide(["return"]);
								widget.show([".J-grid"]).hide([".J-form"]);
								widget.get("grid").refresh();
							});
							
						}
					});
				}else{
					aw.saveOrUpdate("api/changeroomappointment/save",$("#changeroomappointment").serialize(),function(data){
						widget.get("subnav").show(["building","time","flowStatus","add"]).hide(["return"]);
						widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("grid").refresh();
					});
				}
				
			},
			cancelaction:function(){
				widget.get("subnav").show(["building","time","flowStatus","add"]).hide(["return"]);
				widget.show([".J-grid"]).hide([".J-form",".J-approvalUI"]);
			},
			model:{
				id:"changeroomappointment",
				items:[{
					name:"pkChangeRoomAppointment",
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
					label:"房间号",
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"roomType",
					label:"意向房型",
					type:"select",
					key:"type.pkRoomType",
					value:"type.name",
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"cardName",
					label:"会籍卡",
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
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
					validate:["required"],
    			
				},{
					name:"memberNames",
					label:i18ns.get("sale_ship_owner","会员"),
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
					name:"annualFee1",
					label:"服务费",
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"building",
					label:"意向楼",
					type:"select",
					key:"building.pkBuilding",
					value:"building.name",
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
				},{
					name:"floors",
					label:"意向楼层",
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
		afterInitComponent : function(params,widget) {
			aw.ajax({
				url : "api/room/query",
				data : {
					useType:"Apartment",
					fetchProperties : "type.pkRoomType,type.name,building.pkBuilding,building.name",
				},
				dataType:"json",
				success:function(data){
					var roomTypeData = new Array();
					for(var i = 0 ; i <data.length ; i++){
						var flangRoomType = "ok";
						for(var j = i+1 ; j < data.length; j ++){
							if(data[i].type.pkRoomType == data[j].type.pkRoomType){
								flangRoomType = "no";
								continue;
							}
						}
						if(flangRoomType == "ok"){
							roomTypeData[roomTypeData.length] = data[i];
						}
					}
					RoomTypes = roomTypeData;
					
					var buildingData = new Array();
					for(var i = 0 ; i <data.length ; i++){
						var flangBuilding = "ok";
						for(var j = i+1 ; j < data.length; j ++){
							if(data[i].building.pkBuilding == data[j].building.pkBuilding){
								flangBuilding = "no";
								continue;
							}
						}
						if(flangBuilding == "ok"){
							buildingData[buildingData.length] = data[i];
						}
					}
					BuildingDatas = buildingData;
				}
			});
		}
	});
	module.exports = changeroomappointmentapply;
});
