define(function(require, exports, module) {
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
    var Form =require("form-2.0.0")
    var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var store = require("store");
	var activeUser = store.get("user");
	require("../bowoutmembershipcontractapply/bowoutmembershipcontractapply.css");
	var ApprovalUI = require("approvalUI");
	var activeUser = store.get("user");
	//多语
	var i18ns = require("i18n");
	var template="<div class='el-bowoutmembershipcontractapply'>"+
	"<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 "<div class='J-form2 hidden' ></div>" +
	 "<div class='J-approvalUI hidden'></div></div>";
	var bowoutmembershipcontractconfirm = ELView.extend({
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
		var subnav=new Subnav({
			parentNode:".J-subnav",
			model:{
				title:"退会籍确认",
				search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/bowoutmembershipcontractapply/search",
							data : {
								s : str,
								properties : "membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name,personalCardowner.personalInfo.name",
								flowStatus:"Approved",
								fetchProperties:"*,membershipContract.signDate,operator.pkUser,operator.name,membershipContract.memberShipFees,membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
				},
				buttonGroup:[{
		   			id:"bowOutConfrim",
		   			tip:"确认状态",
		   			showAll:true,
					items:[{
						key:false,
						value:"未确认"
					},{
						key:true,
						value:"已确认"
					}],
					handler:function(key,element){
						widget.get("grid").refresh();
					}
				}],
				time:{
					tip :"申请日期",
					ranges:{
				 		"今年": [moment().startOf("year"), moment().endOf("year")] ,
				 		"去年":[moment().subtract(1,"year").startOf("year"), moment().subtract(1,"year").endOf("year")],
						},
					defaultTime:"今年",
    				click:function(time){
    					widget.get("grid").refresh();
					}
				},
				buttons:[{
					id:"return",
					text:"返回",
					show:false,
					type:"button",
					handler:function(){
						widget.get("subnav").show(["time","search","bowOutConfrim"]).hide(["return","confirm"]);
						widget.show([".J-grid"]).hide([".J-approvalUI",".J-form2"]);
						return false;
					}
				},{
					id:"confirm",
					text:"确认",
					show:false,
					type:"button",
					handler:function(){
						Dialog.confirm({
							title:"提示",
							content:"是否确认退会籍？",
							confirm:function(){
								aw.ajax({
									url:"api/bowoutmembershipcontractapply/confirm",
									data:{
										pkBowOutMembershipContract:widget.get("form2").getValue("pkBowOutMembershipContract"),
									},
									dataType:"json",
									success:function(data){
										widget.get("grid").refresh({
											pkBowOutMembershipContract:data.pkBowOutMembershipContract,
											fetchProperties:"*,membershipContract.operator.pkUser,membershipContract.operator.name,membershipContract.room.pkRoom,membershipContract.room.number,membershipContract.checkInType,membershipContract.signDate,operator.pkUser,operator.name,membershipContract.memberShipFees,membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name",
										});
									}
								});
							}
						});
						widget.get("subnav").show(["time","search","bowOutConfrim"]).hide(["return","confirm"]);
						widget.show([".J-grid"]).hide([".J-approvalUI",".J-form2"]);
					}
				}]
			}
		})
		 this.set("subnav",subnav);
		var grid=new Grid({
			parentNode:".J-grid",
			url : "api/bowoutmembershipcontractapply/query",
			params:function(){
				var subnav=widget.get("subnav");
				return {
					applyDate:widget.get("subnav").getValue("time").start,
					applyDateEnd:widget.get("subnav").getValue("time").end,
					flowStatus:"Approved",
					bowOutConfrim:widget.get("subnav").getValue("bowOutConfrim"),
					fetchProperties:"*,membershipContract.operator.pkUser,membershipContract.operator.name,membershipContract.room.pkRoom,membershipContract.room.number,membershipContract.checkInType,membershipContract.signDate,operator.pkUser,operator.name,membershipContract.memberShipFees,membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name",
				};
			},
			model:{
				columns:[{
					key:"membershipContract.membershipCard.name",
					name: i18ns.get("sale_card_name","卡号"),
					format:"detail",
					formatparams:[{
						key:"detail",
						handler:function(index,data,rowEle){
							widget.show([".J-form2",".J-approvalUI"]).hide([".J-grid"]);
							widget.get("subnav").hide(["time","bowOutConfrim","search"]).show(["return"]);
							if(data.bowOutConfrim=="false"||data.bowOutConfrim==false){
								widget.get("subnav").show(["confirm"]);
							}else{
								widget.get("subnav").hide(["confirm"]);
							}
							var form = widget.get("form2");
							form.reset();
							form.setData(data);
							form.setDisabled(true);
							var approvalTest  = widget.get("approvalUI");
							approvalTest.set("param",{
								modelId:data.pkBowOutMembershipContract,
								serviceType:"BowOutMembershipContract",
								hideButton:true,
							});
							approvalTest.get("appgrid").refresh();
							form.load("personalCardowner",{
								params:{
									"pkMembershipContract":data.membershipContract.pkMembershipContract,
		    						"fetchProperties":"personalInfo.name,pkPersonalCardowner"
								},
								callback:function(dat){
									form.setValue("personalCardowner",data.personalCardowner);
								}
							});
							form.load("membershipContract",{
								params:{
									pkMembershipContract:data.membershipContract.pkMembershipContract,
									status:"Normal",//查询条件
									fetchProperties:"*,membershipCard.*,membershipCard.name,membershipCard.cardType.name"
								},
								callback:function(dat){
									form.setValue("membershipContract",data.membershipContract.pkMembershipContract);
								}
							});
							var value=data.membershipContract.personalCardowners;
							var name="";
							for(var i=0;i<value.length;i++){
								if(i<value.length-1){
									name+= value[i].personalInfo.name+",";
								}else{
									name+= value[i].personalInfo.name;
								}
							}
							form.setValue("name",name);
							form.setAttribute("membershipContract","readonly","readonly");
							form.setAttribute("checkInType","readonly","readonly");
							form.setAttribute("signDate","disabled","disabled");
							form.setAttribute("room","readonly","readonly");
							form.setAttribute("operators","readonly","readonly");
							form.load("operators",{
								callback:function(){
									var oldData=form.getData("operators");
									oldData.push(data.membershipContract.operator);
									oldData.push(data.operator);
									form.setData("operators",oldData);
									form.setValue("operators",data.membershipContract.operator);
									form.load("operator",{
										options:oldData
									});
									form.setValue("operator",data.operator);
								}
							});
							form.setValue("checkInType",data.membershipContract.checkInType);
							form.setValue("signDate",data.membershipContract.signDate);
							form.setValue("memberShipFees",data.membershipContract.memberShipFees);
							form.load("room",{
								callback:function(dat){
									form.setValue("room",data.membershipContract.room);
								}
							});
						}
					}]
				},{
					key:"membershipContract.personalCardowners",
					name:"权益人",
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
					}
				},{
					key:"membershipContract.signDate",
					name:"签约日期",
					format:"date",
					formatparams:{
						mode:"YYYY-MM-DD"
					}
				},{
					key:"membershipContract.memberShipFees",
					name:"会籍费",
					className: "text-right",
					format:"thousands"
				},{
					key:"applyDate",
					name:"申请日期",
					format:"date",
					formatparams:{
						mode:"YYYY-MM-DD"
					}
				},{
					key:"personalCardowner.personalInfo.name",
					name:"申请人"
				},{
					key:"bowOutDate",
					name:"退会籍日期",
					format:"date",
					formatparams:{
						mode:"YYYY-MM-DD"
					}
				},{
					key:"bowOutFees",
					name:"退费金额",
					className: "text-right",
					format:"thousands"
				},{
					key:"bowOutConfrim",
					name:"确认状态",
					format:function(value,row){
						if(value==true){
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
					name:"操作",
					format:function(value,row){
						if(row.bowOutConfrim==false){
							return "button";
						}else{
							return "";
						}   
					},
					formatparams:[{
						key:"confrim",
						text:"确认",
						handler:function(index,data,rowEle){
							if(data.operator.pkUser != activeUser.pkUser ){
								Dialog.alert({
	                        		title:"提示",
	                        		content:"您无权限确认！" 
	                        	});
								return false;
							}
							Dialog.confirm({
								title:"提示",
								content:"是否确认退会籍？",
								confirm:function(){
									aw.ajax({
										url:"api/bowoutmembershipcontractapply/confirm",
										data:{
											pkBowOutMembershipContract:data.pkBowOutMembershipContract,
										},
										dataType:"json",
										success:function(data){
											widget.get("grid").refresh({
												pkBowOutMembershipContract:data.pkBowOutMembershipContract,
												fetchProperties:"*,membershipContract.operator.pkUser,membershipContract.operator.name,membershipContract.room.pkRoom,membershipContract.room.number,membershipContract.checkInType,membershipContract.signDate,operator.pkUser,operator.name,membershipContract.memberShipFees,membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name",
											});
										}
									});
								}
							});
							widget.get("subnav").show(["time","search","bowOutConfrim"]).hide(["return","confirm"]);
							widget.show([".J-grid"]).hide([".J-approvalUI",".J-form2"]);
						}
					}]
				}]
			}
		})
		this.set("grid",grid);
		
		var form2 = new Form({
			parentNode:".J-form2",
			model:{
				id:"bowoutmembershipcontractapply2",
				items:[{
					name:"pkBowOutMembershipContract",
					type:"hidden"
				},{
					name:"version",
					type:"hidden",
					defaultValue:"0"
				},{
					name:"bowOutConfrim",
					type:"hidden",
					defaultValue:"false"
				},{
					name:"membershipContract",
					label:"会籍卡",
					readonly:true,
					lazy:true,
					type:"select",
					key:"pkMembershipContract",
					value:"membershipCard.name",
					url:"api/membershipcontract/queryNormal",
					params:{
						status:"Normal",//查询条件
						fetchProperties:"*,membershipCard.*,membershipCard.name,membershipCard.cardType.name"
					},
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"checkInType",
					readonly:true,
					label:"入住类型",
					type:"select",
					url:"api/enum/com.eling.elcms.sale.model.MembershipContract.CheckInType",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"signDate",
					readonly:true,
					label:"签约日期",
					type:"date",
					mode:"Y-m-d",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"room",
					label:"房间号",
					readonly:true,
					lazy:true,
					key:"pkRoom",
    				type:"select",
    				url:"api/room/query",
    				params:function(){
    					return{
        					fetchProperties:"pkRoom,number,type.pkRoomType",
    					};
    				},
    				value:"number",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"memberShipFees",
					label:"会籍费",
					readonly:true,
					type:"text",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
					defaultValue:"0",
				},{
    				name:"operators",
    				readonly:true,
    				lazy:true,
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
					name:"name",
					readonly:true,
					type:"text",
					label:"权益人",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
				},{
					name:"flowStatus",
					label:"状态",
					type:"select",
					url:"api/enum/com.eling.elcms.fp.model.FlowStatus",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
					defaultValue:"Initial"
				},{
					name:"bowOutDate",
					label:"退卡日期",
					type:"date",
					mode:"Y-m-d",
					defaultValue:moment().valueOf(),
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				
				},{
					name:"applyDate",
					label:"申请日期",
					type:"date",
					mode:"Y-m-d",
					defaultValue:moment().valueOf(),
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"personalCardowner",
					label:"申请人",
					key:"pkPersonalCardowner",
    				type:"select",
    				value:"personalInfo.name",
    				url:"api/personalCardowner/querybymembershipcontract",
    				lazy:true,
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"operator",
					lazy:true,
					label:"经手人",
					type:"select",
    				key:"pkUser",
    				url:"api/users",//TODO 用户角色：wulina
    				params:{
						fetchProperties:"pkUser,name"
					},
					value:"name",
					defaultValue:activeUser,
					validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"bowOutShipFees",
					label:"是否退会籍费",
					type:"radiolist",
					list:[{
						key:"true",
						value:"是"
					},{
						key:"false",
						value:"否"
					}],
    				validate:["required"],
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
				},{
					name:"bowOutFees",
					label:"退会籍费金额",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"bowOutReason",
					label:"退会籍原因",
					type :"textarea",
					style:{
						value:"width:85%"
					}
				}]
			}
		})
		this.set("form2",form2);
		var  approvalUI = new ApprovalUI({
			parentNode : ".J-approvalUI",
		});
		approvalUI.render();
		this.set("approvalUI",approvalUI);
		},
	});
	module.exports = bowoutmembershipcontractconfirm;
});