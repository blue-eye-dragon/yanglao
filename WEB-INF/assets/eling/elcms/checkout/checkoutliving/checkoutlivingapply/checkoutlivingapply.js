define(function(require, exports, module) {
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
    var Form =require("form-2.0.0")
    var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var store = require("store");
	var emnu = require("enums");
	var ApprovalUI = require("approvalUI");
	var activeUser = store.get("user");
	require("./checkoutlivingapply.css");
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 " <div class='J-memberGrid hidden' ></div>"+
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-PrintForm hidden' ></div>" +
	 "<div class='J-approvalUI hidden'></div>";
	var checkoutlivingapply = ELView.extend({
		events : {
			"click .J-print":function(e){
				var widget =this;
				var grid=widget.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				widget.show([".J-PrintForm",".J-approvalUI"]).hide([".J-grid"]);
				widget.get("subnav").hide(["building","time","flowStatus","add","search"]);
				var form = widget.get("printform");
				form.setData(data);
				form.setValue("memberSigning",data.member.memberSigning.pkMemberSigning);
				form.setValue("personalInfo",data.personalInfo.name);	
				form.setValue("user",data.user.name);
				form.setValue("memberNames",data.member.personalInfo.name);
				form.setValue("roomNumber",data.member.memberSigning.room.number);
				form.setValue("cardName",data.member.memberSigning.membershipContract.membershipCard.name);
				form.setValue("annualFee1",data.member.memberSigning.annualFee);
				form.setValue("checkOutReason",data.checkOutReason.value);
				form.setValue("checkOutDate",moment(data.checkOutDate).format("YYYY-MM-DD"));
				form.setDisabled(true);
				var approvalUI  = widget.get("approvalUI");
				approvalUI.set("param",{
					modelId:data.pkCheckOutLiving,
					serviceType:"CheckOutLiving", 
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
				title:"退住申请",
				search : function(str) {
					if($(".J-grid").hasClass("hidden")){
						var g=widget.get("memberGrid");
						g.loading();
						aw.ajax({
							url : "api/member/search",
							data : {
								s : str,
								"statusIn" : "Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
								properties : "memberSigning.room.number,memberSigning.membershipContract.membershipCard.name",
								fetchProperties : "*,personalInfo.name,"+
								"user.name," +
								"memberSigning.room.number," +
								"memberSigning.annualFee,"+
								"memberSigning.checkInDate," +
								"memberSigning.membershipContract.membershipCard.name,"+
								"memberSigning.pkMemberSigning"
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
							url : "api/checkoutlivingapply/search",
							data : {
								s : str,
								properties : "member.memberSigning.membershipContract.membershipCard.name,member.memberSigning.room.number,member.personalInfo.name,",
								fetchProperties : "*,pkCheckOutLiving,CheckOutReason,CheckOutReason.value," +
								"user.name," +
								"member.memberSigning.annualFee," +
								"member.memberSigning.pkMemberSigning," +
								"member.personalInfo.name," +
								"member.memberSigning.membershipContract.membershipCard.name," +
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
			url : "api/checkoutlivingapply/query",
			fetchProperties:"*,pkCheckOutLiving,CheckOutReason,CheckOutReason.value," +
					"user.pkUser," +
					"user.name," +
					"member.memberSigning.annualFee," +
					"member.memberSigning.pkMemberSigning," +
					"member.personalInfo.name," +
					"member.memberSigning.membershipContract.membershipCard.name," +
					"member.memberSigning.room.number," +
					"member.memberSigning.room.pkRoom," +
					"member.memberSigning.checkInDate," +
					"personalInfo.name," +
					"member.memberSigning.pkMemberSigning",
			params:function(){
				var subnav=widget.get("subnav");
				return {
					createDate:widget.get("subnav").getValue("time").start,
					createDateEnd:widget.get("subnav").getValue("time").end,
					"member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
					flowStatus:subnav.getValue("flowStatus")
				};
			},
			model:{
				columns:[{
					key:"member.memberSigning.membershipContract.membershipCard.name",
					name:  i18ns.get("sale_card_name","会籍卡"),
				},{
					key:"member.memberSigning.room.number",
					name:"房间号",
					format:"detail",
					formatparams:[{
						key:"detail",
						handler:function(index,data,rowEle){

							widget.show([".J-form",".J-approvalUI"]).hide([".J-grid"]);
							widget.get("subnav").hide(["building","time","flowStatus","add","search"]).show(["return"]);
							var form = widget.get("form");
							form.setData(data);
							form.setValue("memberSigning",data.member.memberSigning.pkMemberSigning);
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
							form.setValue("user",data.user);
							form.setValue("memberNames",data.member.personalInfo.name);
							form.setValue("roomNumber",data.member.memberSigning.room.number);
							form.setValue("cardName",data.member.memberSigning.membershipContract.membershipCard.name);
							form.setValue("annualFee1",data.member.memberSigning.annualFee);
							form.setDisabled(true);
							var approvalUI  = widget.get("approvalUI");
							approvalUI.set("param",{
								modelId:data.pkCheckOutLiving,
								serviceType:"CheckOutLiving", 
								hideButton:true,
								lastUndoShow:data.checkOutConfrim?false:true
							});
							approvalUI.get("appgrid").refresh();
						}
					}]
				},{
					key:"member.personalInfo.name",
					name:  i18ns.get("sale_ship_owner","会员"),
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
					name:"退住原因"
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
							var form = widget.get("form");
							form.reset();
							form.setData(data);
							form.setValue("memberSigning",data.member.memberSigning.pkMemberSigning);
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
							form.setAttribute("user","readonly","readonly");
							form.setValue("memberNames",data.personalInfo.name);
							form.setValue("version",data.version);
							form.setValue("member",data.member.pkMember);
							form.setValue("roomNumber",data.member.memberSigning.room.number);
							form.setValue("cardName",data.member.memberSigning.membershipContract.membershipCard.name);
							form.setValue("annualFee1",data.member.memberSigning.annualFee);
						}
					},{
						key:"delete",
						icon:"remove",
						handler:function(index,data,rowEle){
							aw.del("api/checkoutlivingapply/" + data.pkCheckOutLiving + "/delete",function(data) {
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
										url:"api/checkoutlivingapply/submit",
										data:{
											pkCheckOutLiving:data.pkCheckOutLiving,
										},
										dataType:"json",
										success:function(data){
											Dialog.close();
											widget.get("grid").refresh({
												pkCheckOutLiving:data.pkCheckOutLiving,
												fetchProperties:"*,pkCheckOutLiving," +
												"member.memberSigning.members," +
												"member.memberSigning.annualFee," +
												"member.personalInfo.name," +
												"member.memberSigning.membershipContract.membershipCard.name," +
												"member.memberSigning.room.number," +
												"member.memberSigning.room.pkRoom," +
												"member.memberSigning.checkInDate," +
												"personalInfo.name," +
												"member.memberSigning.pkMemberSigning,checkOutReason",
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
			url:"api/member/querycheckout",
			params:function(){
				return {
					"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"), 
					"statusIn" : "Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized,Died,Waitting",
					fetchProperties:"*,personalInfo.name,"+
										"memberSigning.room.number," +
										"memberSigning.annualFee,"+
									"memberSigning.checkInDate," +
									"memberSigning.membershipContract.membershipCard.name,"+
									"memberSigning.pkMemberSigning"
				};
				
			},
			model:{ 
			columns:[{
				key:"memberSigning.membershipContract.membershipCard.name",
				name: i18ns.get("sale_card_name","会籍卡"),
			},{
				key : "memberSigning.room.number",
				name :"房间号"
			},{
				key:"personalInfo.name",
				name:  i18ns.get("sale_ship_owner","会员"),
			},{
				key:"memberSigning.checkInDate",
				name:"入住日期",
				format:"date"
			},{
				key:"memberSigning.annualFee",
				name:"服务费"
			},{
				key:"operate",
				name:"操作",
				format:function(row,value){
					return "button"
				},
				formatparams:[{
					key:"edit",
					text:"退住", 
					handler:function(index,data,rowEle){
						var form = widget.get("form");
						form.reset();
						form.setValue("roomNumber",data.memberSigning.room.number);
						form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
						form.setValue("cardName",data.memberSigning.membershipContract.membershipCard.name);
						var userSelect=form.getData("user","");
						userSelect.push(activeUser);
						form.setData("user",userSelect);
    					form.setValue("user",activeUser); 
    					form.setAttribute("user","readonly","readonly");
						form.setValue("memberNames",data.personalInfo.name);
						form.setValue("annualFee1",data.memberSigning.annualFee);
						form.setValue("member",data.pkMember);
						form.setValue("checkOutReason","CheckOutLiving");
						form.load("personalInfo");
						widget.get("subnav").hide(["building","search"]);
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
				aw.saveOrUpdate("api/checkoutlivingapply/save",$("#checkoutliving").serialize(),function(data){
					widget.get("subnav").show(["building","time","flowStatus","add"]).hide(["return"]);
					widget.show([".J-grid"]).hide([".J-form"]);
					widget.get("grid").refresh();
				});
				
			},
			cancelaction:function(){
				widget.get("subnav").show(["building","time","flowStatus","add"]).hide(["return"]);
				widget.show([".J-grid"]).hide([".J-form",".J-approvalUI"]);
			},
			model:{
				id:"checkoutliving",
				items:[{
					name:"pkCheckOutLiving",
					type:"hidden"
				},{
					name:"memberSigning",
					type:"hidden"
				},{
					name:"member",
					type:"hidden"
				},{
					name:"createDate",
					type:"hidden",
				},{
					name:"version",
					type:"hidden",
					defaultValue:"0"
				},{
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
					lazy:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
					validate:["required"],
    			
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
					name:"checkOutDate",
					label:"退住日期",
					type:"date",
					mode:"Y-m-d",
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
					name:"checkOutReason",
					label:"退住原因",
					type:"select",
					options:emnu["com.eling.elcms.checkout.model.CheckOutLiving.CheckOutReason"],
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
				id:"checkoutliving",
				defaultButton:false,
				items:[{
					name:"pkCheckOutLiving",
					type:"hidden"
				},{
					name:"memberSigning",
					type:"hidden"
				},{
					name:"member",
					type:"hidden"
				},{
					name:"createDate",
					type:"hidden",
				},{
					name:"version",
					type:"hidden",
					defaultValue:"0"
				},{
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
					},
				},{
    				name:"user",
    				label:"经手人",
    				style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
    			
				},{
					name:"cardName",
					label:  i18ns.get("sale_card_name","会籍卡"),
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
					name:"checkOutDate",
					label:"退住日期",
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
					name:"checkOutReason",
					label:"退住原因",
					style:{
						container:"width:50%;float:right;",
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
	module.exports = checkoutlivingapply;
});
