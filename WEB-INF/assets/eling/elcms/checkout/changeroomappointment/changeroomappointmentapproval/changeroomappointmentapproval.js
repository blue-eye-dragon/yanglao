define(function(require, exports, module) {
	 var Dialog=require("dialog-1.0.0");
	    var aw = require("ajaxwrapper");
	    var Form =require("form-2.0.0")
	    var ELView=require("elview");
		var Subnav = require("subnav-1.0.0"); 
		var Grid = require("grid-1.0.0");
		var store = require("store");
		var RoomTypes = new Array();
		var BuildingDatas = new Array();
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
					title:"换房预约审批",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/changeroomappointment/search",
							data : {
								s : str,
								properties : "memberSigning.card.name,memberSigning.room.number,memberSigning.members.personalInfo.name,",
								fetchProperties:"*,pkChangeRoomAppointment," +
								"memberSigning.members," +
								"memberSigning.annualFee," +
								"memberSigning.members.personalInfo.name," +
								"memberSigning.card.name," +
								"memberSigning.room.number," +
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
    							widget.get("subnav").hide(["building","time","flowStatus","search"]).show(["return"]);
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
 												modelId:data.pkChangeRoomAppointment,
 												serviceType:"ChangeRoomAppointment",
 												hideButton:false,
 												callBack:function(data){
 													if(data){
 														var pkChangeRoomAppointmentN = data.pkChangeRoomAppointment;
 														aw.ajax({
 															url:"api/changeroomappointment/query",
 															data:{
 																pkChangeRoomAppointment:data.pkChangeRoomAppointment,
 																fetchProperties:"flowStatus"
 															},
 															dataType:"json",
 															success:function(data){
 																if(data[0]){
 																	if(data[0].flowStatus.key=="Approved" ){
 																		widget.get("form").setValue("flowStatus.value","已通过");
 																	}
 																}
 																widget.get("grid").refresh()
 															}
 														});
 													}
 												}
 											});
 											approvalUI.get("appgrid").refresh();
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
    				id:"changeroomappointment",
    				items:[{
    					name:"memberSigning",
    					type:"hidden"
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
    				},{
    					name:"flowStatus.value",
    					label:"审批状态",
    					validate:["required"],
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				
    				},{
    					name:"changeReason",
    					label:"换房原因",
    					type :"textarea",
    					validate:["required"]
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
        afterInitComponent:function(params,widget){

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
		
//        	if(params && params.father == "changeroomannualsummary"){
//				widget.get("grid").refresh({
//					"createDate":params.start,
//					"createDateEnd":params.end,
//					"flowStatus":params.flowStatus,
//					fetchProperties:"*,pkChangeRoomAppointment," +
//					"memberSigning.members," +
//					"memberSigning.annualFee," +
//					"memberSigning.members.personalInfo.name," +
//					"memberSigning.card.name," +
//					"memberSigning.room.number," +
//					"memberSigningNew.members,memberSigningNew.members.personalInfo.name,"+
//					"memberSigning.room.pkRoom," +
//					"memberSigning.checkInDate,room.number," +
//					"personalInfo.name",
//				});
//				widget.get("subnav").setValue("flowStatus",params.flowStatus);
//				widget.get("subnav").setValue("time",params);
//			}
		}
	});
	module.exports = changeroomapproval;
});
