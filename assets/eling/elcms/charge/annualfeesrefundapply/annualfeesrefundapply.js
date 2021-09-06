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
	require("./annualfeesrefundapply.css");
    var template="<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 " <div class='J-memberGrid hidden' ></div>"+
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-PrintForm hidden'  ></div>" +
	 "<div class='J-approvalUI hidden'></div>";
	var annualfeesrefundapply = ELView.extend({
		events : {
			"click .J-print":function(e){
				var widget =this;
				var grid=widget.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var form = widget.get("printform");
				widget.show([".J-PrintForm",".J-approvalUI"]).hide([".J-grid"]);
				widget.get("subnav").hide(["building","time","flowStatus","add","search"]);
				var form = widget.get("printform");
				form.setData(data);
				form.setValue("memberSigning",data.annualFees.memberSigning.pkMemberSigning);
				form.setValue("personalInfo",data.personalInfo.name);
				form.setValue("user",data.user.name);
				form.setValue("memberSigning.room.number",data.annualFees.memberSigning.room.number);
				form.setValue("realAnnualFees",data.annualFees.realAnnualFees);
				form.setValue("annualFees",data.annualFees.pkAnnualFees);
				form.setValue("chargeTime",moment(data.annualFees.chargeTime).format("YYYY-MM-DD"));
				var approvalUI  = widget.get("approvalUI");
				approvalUI.set("param",{
					modelId:data.pkAnnualFeesRefund,
					serviceType:"AnnualFeesRefund",
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
				title:"服务费退款申请",
				search : function(str) {
					if($(".J-grid").hasClass("hidden")){
						var g=widget.get("memberGrid");
						g.loading();
						aw.ajax({
							url : "api/annualfees/searchrefund",
							data : {
								s : str,
								properties : "memberSigning.room.pkRoom",
								fetchProperties:"*," +
								"memberSigning.room.pkRoom," +
								"memberSigning.room.number," +
								"payer.personalInfo.name," +
								"operator.pkUser," +
								"operator.name," +
								"confirm.pkUser," +
								"confirm.name," +
								"invoice.pkUser," +
								"invoice.name," +
								"payer.personalInfo.mobilePhone," +
								"payer.personalInfo.phone," +
								"payer.pkPayer,"+
								"payer.memberSigning.card.name"
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
							url : "api/annualfeesrefund/search",
							data : {
								s : str,
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
			url:"api/annualfeesrefund/query",
			params:function(){
				return {
				"annualFees.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
				"flowStatus":widget.get("subnav").getValue("flowStatus"),
				"createDate":widget.get("subnav").getValue("time").start,
				"createDateEnd":widget.get("subnav").getValue("time").end,
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
							widget.get("subnav").hide(["building","time","flowStatus","add","search"]).show(["return"]);
							var form = widget.get("form");
							form.setData(data);
							form.setValue("memberSigning",data.annualFees.memberSigning.pkMemberSigning);
							form.load("personalInfo",{
								callback:function(){
									var personalInfo=form.getData("personalInfo","");
									personalInfo.push(data.personalInfo);
									form.setData("personalInfo",personalInfo);
									form.setValue("personalInfo",data.personalInfo);
								}
							});
							var userSelect=form.getData("user","");
							userSelect.push(activeUser);
							userSelect.push(data.user);
							form.setData("user",userSelect);
							form.setValue("user",data.user);
							form.setValue("memberSigning.room.number",data.annualFees.memberSigning.room.number);
							form.setValue("realAnnualFees",data.annualFees.realAnnualFees);
							form.setValue("annualFees",data.annualFees.pkAnnualFees);
							form.setValue("chargeTime",moment(data.annualFees.chargeTime).format("YYYY-MM-DD"));
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
					name : "操作",
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
						key:"edit",
						icon:"edit",
						handler:function(index,data,rowEle){

							widget.show([".J-form"]).hide([".J-grid"]);
							widget.get("subnav").hide(["building","time","flowStatus","add","search"]).show(["return"]);
							var form = widget.get("form");
							form.reset();
							form.setData(data);
							form.setValue("memberSigning",data.annualFees.memberSigning.pkMemberSigning);
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
							form.setValue("memberSigning.room.number",data.annualFees.memberSigning.room.number);
							form.setValue("realAnnualFees",data.annualFees.realAnnualFees);
							form.setValue("annualFees",data.annualFees.pkAnnualFees);
							form.setValue("chargeTime",moment(data.annualFees.chargeTime).format("YYYY-MM-DD"));
							form.setData("user",userSelect);
							form.setValue("user",data.user);
							form.setAttribute("user","readonly","readonly");
						
						}
					},{
						key:"delete",
						icon:"remove",
						handler:function(index,data,rowEle){
							if(data.annualFeesRefundFrom.key == "Manual"){
								aw.del("api/annualfeesrefund/"+ data.pkAnnualFeesRefund + "/delete",function() {
									  widget.get("grid").refresh();
									}
								);
							}else{
								Dialog.alert({
									content:"系统自动推送数据不允许删除！"
								});
							}
							
						}
					},{
						key:"submit",
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
										url:"api/annualfeesrefund/submit",
										data:{
											pkAnnualFeesRefund:data.pkAnnualFeesRefund,
										},
										dataType:"json",
										success:function(data){
											Dialog.close();
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
			url:"api/annualfees/annualfeesrefund",
			params:function(){
				return {
					"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"), 
					fetchProperties:"*," +
					"memberSigning.room.pkRoom," +
					"memberSigning.room.number," +
					"payer.personalInfo.name," +
					"operator.pkUser," +
					"operator.name," +
					"confirm.pkUser," +
					"confirm.name," +
					"invoice.pkUser," +
					"invoice.name," +
					"payer.personalInfo.mobilePhone," +
					"payer.personalInfo.phone," +
					"payer.pkPayer,"+
					"payer.memberSigning.card.name"
				};
				
			},
			model:{ 
				columns:[{
					key:"payer.memberSigning.room.number",
					name:"房间号"
				},{
					key:"payer.personalInfo.name",
					name:"付款人"
				},{
					key:"phone",
					name:"移动电话/电话",
					format:function(row,value){
						var mobilePhone = value.payer.personalInfo.mobilePhone==null?"无":value.payer.personalInfo.mobilePhone;
						var phone = value.payer.personalInfo.phone==null?"无":value.payer.personalInfo.phone;
						if(value.payer.personalInfo){
							return  mobilePhone+"/"+ phone;
						}else{
							return "";
						}
					}
				},{
					key:"beginDate",
					name:"起始日期",
					format:"date"
				},{
					key:"endDate",
					name:"到期日期",
					format:"date"
				},{
					key:"dueAnnualFees",
					name:"应收服务费"
				},{
					key:"realAnnualFees",
					name:"实收服务费"
				},{
					key:"chargeStatus.value",
					name:"收费状态"
				},{
					key:"chargeTime",
					name:"收费日期",
					format:"date"
				},{
					key:"operator.name",
					name:"经手人",
				},{
				key:"operate",
				name:"操作",
				format:function(row,value){
					return "button"
				},
				formatparams:[{
					key:"edit",
					text:"退款",
					handler:function(index,data,rowEle){
						aw.ajax({
							url:"api/changeroomapply/query",
							data:{
								"memberSigning.pkMemberSigning":data.memberSigning.pkMemberSigning,
								fetchProperties:"pkChangeRoomApply" 
							},
							success:function(result){
								if (result.length>0) {
									// 根据pkMemberSigning去查询是否已经申请换房
									Dialog.alert({
										content:"该房间已经提交换房申请，不能直接申请服务费退款，需要走服务费结转流程完成退款！"
									});
									return false;
								}else {
									var form = widget.get("form");
									form.reset();
									form.setData(data);
									
									form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
									form.setValue("annualFees",data.pkAnnualFees);
									var userSelect=form.getData("user","");
									userSelect.push(activeUser);
									form.setData("user",userSelect);
			    					form.setValue("user",activeUser); 
			    					form.setValue("chargeTime",moment(data.chargeTime).format("YYYY-MM-DD"));
									form.setAttribute("user","readonly","readonly");
									form.load("personalInfo");
									widget.get("subnav").hide(["search","building"]);
									widget.show([".J-form"]).hide([".J-memberGrid"]);
								}
							}
						})
					}
				}]
			}]
		},
		})
		this.set("memberGrid",memberGrid);
		
		var form = new Form({
			parentNode:".J-form",
			saveaction:function(){
				if(isNaN(widget.get("form").getValue("annualCheckOutFee"))){
     				Dialog.alert({
							content : "请输入有效的服务费退款额！"
						 });
     				return false;
     			}
				if(Number(widget.get("form").getValue("annualCheckOutFee"))>= Number(widget.get("form").getValue("realAnnualFees"))){
					Dialog.alert({
						content : "服务费退款额不能大于实收服务费！"
					 });
 				return false;
				}
				aw.saveOrUpdate("api/annualfeesrefund/save",$("#annualfeesrefundapply").serialize(),function(data){
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
				id:"annualfeesrefundapply",
				items:[{
					name:"pkAnnualFeesRefund",
					type:"hidden"
				},{
					name:"memberSigning",
					type:"hidden"
				},{
					name:"annualFees",
					type:"hidden"
				},{
					name:"refundConfrim",
					type:"hidden",
					defaultValue:false	
				},{
					name:"createDate",
					type:"hidden",
				},{
					name:"annualFeesRefundFrom",
					type:"hidden",
					defaultValue:"Manual"	
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
					name:"memberSigning.room.number",
					label:"房间号",
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
					name:"chargeTime",
					label:"交款日期",
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
					name:"realAnnualFees",
					label:"实收服务费",
					readonly:true,
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"annualCheckOutFee",
					label:"服务费退款额",
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"refundReason",
					label:"退款原因",
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
				id:"annualfeesrefundapply",
				defaultButton:false,
				items:[{
					name:"pkAnnualFeesRefund",
					type:"hidden"
				},{
					name:"memberSigning",
					type:"hidden"
				},{
					name:"annualFees",
					type:"hidden"
				},{
					name:"refundConfrim",
					type:"hidden",
					defaultValue:false	
				},{
					name:"createDate",
					type:"hidden",
				},{
					name:"annualFeesRefundFrom",
					type:"hidden",
					defaultValue:"Manual"	
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
					name:"memberSigning.room.number",
					label:"房间号",
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
					name:"chargeTime",
					label:"交款日期",
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
					name:"realAnnualFees",
					label:"实收服务费",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"annualCheckOutFee",
					label:"服务费退款额",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"refundReason",
					label:"退款原因",
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
	module.exports = annualfeesrefundapply;
});
