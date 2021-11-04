define(function(require, exports, module) {
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
    var Form =require("form");
    var Form2 =require("form-2.0.0");
    var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var store = require("store");
	var position="";
	//多语
	var i18ns = require("i18n");
	require("./bowoutmembershipcontractapply.css");
	var ApprovalUI = require("approvalUI");
	var activeUser = store.get("user");
	var template="<div class='el-bowoutmembershipcontractapply'>"+
	"<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 " <div class='J-memberGrid hidden' ></div>"+
	 "<div class='J-form hidden' ></div>" +
	 "<div class='J-form2 hidden' ></div>"+
	 "<div class='J-PrintForm hidden' style='border:0 none;' ></div>"+
	 "<div class='J-addForm hidden' ></div>" +
	 "<div class='J-approvalUI hidden'></div></div>";
	var pkMembershipContract ;
	var bowoutmembershipcontractapply = ELView.extend({
		events : {
			"blur .J-form-bowoutmembershipcontractapplyadd-text-bowOutFees":function(e){
				var addForm = this.get("addForm");
				var money = addForm.getValue("bowOutFees");
				if(money){
					if(isNaN(money)){
						Dialog.alert({
							content:"请输入合法的金额！"
						});
						addForm.setValue("bowOutFees",0);
						return false;
					}
				}
			},
			"click .J-form-bowoutmembershipcontractapplyadd-radio-bowOutShipFees":function(e){//TODO radio
				var addForm = this.get("addForm");
				var bowOutShipFees = addForm.getValue("bowOutShipFees");
				if(bowOutShipFees=="false"){
					addForm.setDisabled("bowOutFees",true);
					addForm.setValue("bowOutFees",0);
				}else{
					addForm.setDisabled("bowOutFees",false);
					addForm.setValue("bowOutFees","");
				}
			},
			"click .J-print":function(e){
				var widget =this;
				var grid=widget.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var form = widget.get("printform");

				var approvalTest  = widget.get("approvalUI");
				approvalTest.set("param",{
					modelId:data.pkBowOutMembershipContract,
					serviceType:"BowOutMembershipContract",
					hideButton:true,
				});
				approvalTest.get("appgrid").refresh();
				widget.show([".J-PrintForm",".J-approvalUI"]).hide([".J-grid"]);
				widget.get("subnav").hide(["time","flowStatus","add","search","bowOutShipFees"]);
				var form = widget.get("printform");
				form.reset();
				form.setData(data);
				form.setValue("membershipContract",data.membershipContract.membershipCard.name);
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
				form.setValue("operators",data.membershipContract.operator.name);
				form.setValue("operator",data.operator.name);
				form.setValue("personalCardowner",data.personalCardowner.personalInfo.name);
				form.setValue("checkInType",data.membershipContract.checkInType.value);
				form.setValue("signDate",moment(data.signDate).format("YYYY-MM-DD"));
				form.setValue("bowOutDate",moment(data.bowOutDate).format("YYYY-MM-DD"));
				form.setValue("applyDate",moment(data.applyDate).format("YYYY-MM-DD"));
				form.setValue("memberShipFees",data.membershipContract.memberShipFees);
				if(data.membershipContract.room!=null){
					form.setValue("room",data.membershipContract.room.number);
				}
				form.setValue("flowStatus",data.flowStatus.value);
				approvalTest.get("appgrid").refresh(null,function(data){
					window.print();
					widget.hide([".J-PrintForm",".J-approvalUI"]).show([".J-grid"]);
					widget.get("subnav").show(["time","flowStatus","add","search","bowOutShipFees"]);
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
				title:"退会籍申请",
				search : function(str) {
//					if($(".J-grid").hasClass("hidden")){//membergrid
//						if(str.length<4){
//							Dialog.alert({
//								content:"请输入准确的房间号或会籍卡号！"
//							});
//							return false;
//						}
//						var g=widget.get("memberGrid");
//						g.loading();
//						aw.ajax({
//							url : "api/membershipcontract/queryCheckOutCard",
//							data : {
//								s : str,
//								properties : "membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name,room.number",
//								fetchProperties:"*,bmc.flowStatus,bmc.bowOutConfrim," +
//										"ms.room.number,ms.checkInDate,ms.status," +
//										"pkMembershipContract,checkInType," +
//										"status,room.number,signDate,operator.pkUser,operator.name,memberShipFees,membershipCard.name,personalCardowners.personalInfo.name",
//							},
//							dataType:"json",
//							success:function(data){
//								g.setData(data);
//							}
//						});
//					}else{
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/bowoutmembershipcontractapply/search",
							data : {
								s : str,
								properties : "membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name,personalCardowner.personalInfo.name",
								flowStatus:widget.get("subnav").getValue("flowStatus"),
								fetchProperties:"*,membershipContract.operator.pkUser,membershipContract.operator.name,membershipContract.room.pkRoom,membershipContract.room.number,membershipContract.checkInType,membershipContract.signDate,operator.pkUser,operator.name,membershipContract.memberShipFees,membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
//					}
				},
				buttonGroup:[{
		   			id:"flowStatus",
		   			tip:"审批流程状态",
		   			showAll:true,
		   			showAllFirst:true,
					items:[{
						key :"Initial",
						value:"初始"
					},{
						key:"Approvaling",
						value:"审批中"
					},{
						key:"Approved",
						value:"通过"
					}],
					handler:function(key,element){
						widget.get("grid").refresh();
					}
				},{
					id:"bowOutShipFees",
					tip:"是否退费",
					showAll:true,
					showAllFirst:true,
					items:[{
	                     key:"true",
	                     value:"是"
	 				},{
	 					key:"false",
	 					value:"否"
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
					id:"add",
					text:"新增",
					type:"button",
					handler:function(){
						var addForm = widget.get("addForm");
						addForm.reset();
						addForm.setDisabled("bowOutDate",true);//TODO disable
						addForm.setDisabled("applyDate",true);
						addForm.setDisabled("personalCardowner",true);
						addForm.setDisabled("operator",true);
						addForm.setDisabled("bowOutShipFees",true);
						addForm.setDisabled("bowOutFees",true);
						addForm.setDisabled("bowOutReason",true);
						subnav.setValue("search","");
//						$(".J-subnav-search-search").attr("placeholder","房间号/会籍卡号")
						widget.get("memberGrid").setData([]);
						widget.get("subnav").hide(["time","flowStatus","add","bowOutShipFees","search","return"]).show([]);
						widget.show([".J-addForm"]).hide([".J-grid",".J-form",".J-form2",".J-approvalUI"]);
					}
				},{
					id:"return",
					text:"返回",
					show:false,
					type:"button",
					handler:function(){
						var subnav =widget.get("subnav");
						subnav.setValue("search","");
						$(".J-subnav-search-search").attr("placeholder","搜索")
						subnav.show(["time","flowStatus","add","search","bowOutShipFees"]).hide(["return"]);
						widget.show([".J-grid"]).hide([".J-memberGrid",".J-form",".J-approvalUI",".J-form2",".J-addForm"]);
						return false;
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
					flowStatus:subnav.getValue("flowStatus"),
					bowOutShipFees:subnav.getValue("bowOutShipFees"),
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
							var approvalTest  = widget.get("approvalUI");
							approvalTest.set("param",{
								modelId:data.pkBowOutMembershipContract,
								serviceType:"BowOutMembershipContract",
								hideButton:true,
							});
							approvalTest.get("appgrid").refresh();
							widget.show([".J-form2",".J-approvalUI"]).hide([".J-grid",".J-memberGrid",".J-form"]);
							widget.get("subnav").hide(["time","flowStatus","add","search","bowOutShipFees"]).show(["return"]);
							var form = widget.get("form2");
							form.reset();
							form.setData(data);
							form.setDisabled(true);
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
					key:"bowOutShipFees",
					name:"是否退费",
					format:function(value,row){
						if(value==true){
							return "是";
						}else{
							return "否";
						}
					}
				},{
					key:"bowOutFees",
					name:"退费金额",
					className: "text-right",
					format:"thousands"
				},{
					key:"flowStatus.value",
					name:"状态"
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
						key:"edit",
						icon:"edit", //TODO edit
						handler:function(index,data,rowEle){
							var addForm = widget.get("addForm");
							addForm.setDisabled("membershipContractSearch",true);
							widget.show([".J-addForm"]).hide([".J-grid",".J-memberGrid",".J-form2"]);
							widget.get("subnav").hide(["time","flowStatus","add","search","bowOutShipFees"]).show([]);
							addForm.reset();
							addForm.setData(data);
							addForm.setValue("membershipCardName",data.membershipContract.membershipCard.name);
							var value=data.membershipContract.personalCardowners;
							var name="";
							for(var i=0;i<value.length;i++){
								if(i<value.length-1){
									name+= value[i].personalInfo.name+",";
								}else{
									name+= value[i].personalInfo.name;
								}
							}
							addForm.setValue("names",name);
							addForm.setValue("checkInType",data.membershipContract.checkInType.value);
							addForm.setValue("signDate",data.membershipContract.signDate);
							addForm.setValue("operators",data.membershipContract.operator.name);
							addForm.setValue("memberShipFees",data.membershipContract.memberShipFees);
							addForm.setValue("bowOutDate",data.bowOutDate);
							addForm.setValue("applyDate",data.applyDate);
							addForm.setDisabled("membershipContractSearch",true);
							if(data.bowOutShipFees==false){
								addForm.setValue("bowOutShipFees","false");
								addForm.setDisabled("bowOutFees",true);
							}else{
								addForm.setValue("bowOutShipFees","true");
								addForm.setDisabled("bowOutFees",false);
							}
							addForm.setValue("flowStatus",data.flowStatus.key);
							addForm.setValue("bowOutFees",data.bowOutFees);
							addForm.setValue("bowOutReason",data.bowOutReason);
							if(data.membershipContract.room!=null){
								addForm.setValue("roomNumber",data.membershipContract.room.number);
							}
						}
					},{
						key:"delete",
						icon:"remove",
						handler:function(index,data,rowEle){
							aw.del("api/bowoutmembershipcontractapply/" + data.pkBowOutMembershipContract + "/delete",function(data) {
								  widget.get("grid").refresh();
							});
						}
					},{
						key:"submit",
						text:"提交",
						handler:function(index,data,rowEle){
							Dialog.confirm({
								setStyle:function(){},
								content:"你确定要提交当前的退会籍申请？提交后此退会籍申请不允许再修改。",
								confirm:function(){
									Dialog.alert({
										title:"提示",
										showBtn:false,
										content:"正在处理，请稍后……"
									});
									aw.ajax({
										url:"api/bowoutmembershipcontractapply/submit",
										data:{
											pkBowOutMembershipContract:data.pkBowOutMembershipContract,
											version:data.version
										},
										dataType:"json",
										success:function(data){
						                	Dialog.close();
											widget.get("grid").refresh({
												pkBowOutMembershipContract:data.pkBowOutMembershipContract,
												fetchProperties:"*,membershipContract.operator.pkUser,membershipContract.operator.name,membershipContract.room.pkRoom,membershipContract.room.number,membershipContract.checkInType,membershipContract.signDate,operator.pkUser,operator.name,membershipContract.memberShipFees,membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name",
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
		
		var memberGrid=new Grid({ //TODO memberGrid
			parentNode:".J-memberGrid",
			autoRender:false,
			url : "api/membershipcontract/queryCheckOutCard",
			params:function(){
				var subnav=widget.get("subnav");
				return {
					status:"Normal"
				};
			},
			model:{
				columns:[{
					key:"membershipCard.name",
					className:"width_card",
					name: i18ns.get("sale_card_name","卡号"),
				},{
					key:"personalCardowners",
					className:"width_name",
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
					key:"signDate",
					className:"width_sign",
					name:"签约日期",
					format:"date",
					formatparams:{
						mode:"YYYY-MM-DD"
					}
				},{
					key:"memberShipFees",
					className:"width_fee",
					name:"会籍费",
					className: "text-right",
					format:"thousands"
				},{
					key:"checkInType.value",
					className:"width_type",
					name:"入住类型"
				},{
					key:"room.number",
					className:"width_number",
					name:"房间号",
					format:function(value,row){
						if(value==null||value==""){
							if(row.ms&&row.ms.room&&row.ms.room.number!=null){
								return row.ms.room.number;
							}else{
								return "";
							}
						}else{
							return value;
						}
					}
				},{
					key:"ms.checkInDate",
					className:"width_checkin",
					name:"入住日期",
					format:"date",
					formatparams:{
						mode:"YYYY-MM-DD"
					}
				},{
					key:"checkOutDate",
					className:"width_checkout",
					name:"退房日期",
					format:"date",
					formatparams:{
						mode:"YYYY-MM-DD"
					}
				},{
					key:"ms.status.value",
					className:"width_status",
					name:"会员签约状态"
				},{
					key:"operate",
					className:"width_op",
					name:"操作",
					format:function(value,row){
						if(!row.ms||(row.ms&&row.ms.status&&row.ms.status.key=="Termination")){
							return "button";
						}else if(row.bmc!=null&&(row.bmc.flowStatus.key!="Approved"||row.bmc.bowOutConfrim==false)){
							return "button";
						}else{
							return "";
						}
					},
					formatparams:[{
						id:"apply",
						text:"申请",  //TODO apply
						handler:function(index,data,rowEle){
							position="apply";
							if(data.chargeStatus==null){
								Dialog.alert({
									content : "此卡号没有对应的会籍卡收费单！"
								 });
								return false;
							}
							if(data.bmc!=null&&(data.bmc.flowStatus.key!="Approved"||data.bmc.bowOutConfrim==false)){//审批未完成或未确认
								Dialog.alert({
									content : "此卡号已经申请退会籍，不能再次申请！"
								 });
								return false;
							}
							if(data.chargeStatus.key!="Payup"){
								Dialog.alert({
									content : "此卡号的会籍费未完全缴清，不能申请退会籍！"
								 });
								return false;
							}
							widget.show([".J-form"]).hide([".J-grid",".J-memberGrid"]);
							widget.get("subnav").hide(["time","flowStatus","add","search","return","bowOutShipFees"]);
							var form = widget.get("form");
							form.reset();
							form.setData(data);
							form.load("personalCardowner",{
								params:{
									"pkMembershipContract":data.pkMembershipContract,
		    						"fetchProperties":"personalInfo.name,pkPersonalCardowner"
								},
							});
							form.load("room",{
								callback:function(data){
									form.setValue("room",data.room);
								}
							});
							form.load("membershipContract",{
								params:{
									pkMembershipContract:data.pkMembershipContract,
									status:"Normal",//查询条件
									fetchProperties:"*,membershipCard.*,membershipCard.name,membershipCard.cardType.name"
								},
								callback:function(dat){
									form.setValue("membershipContract",data.pkMembershipContract);
								}
							});
							var value=data.personalCardowners;
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
							form.setAttribute("bowOutFees","readonly",true);
							form.setValue("bowOutFees",0);
							form.setAttribute("room","readonly","readonly");
							form.setAttribute("operators","readonly","readonly");
							form.load("operators",{
								callback:function(){
									form.setValue("operators",data.operator);
									var oldData=form.getData("operators");
									form.load("operator",{
										options:oldData
									});
									oldData.push(activeUser);
									form.setData("operator",oldData);
									form.setValue("operator",activeUser);
								}
							});
							form.setValue("bowOutDate",moment());
							form.setValue("applyDate",moment());
							form.setValue("bowOutShipFees","false");
						}
					}]
				}]
			}
		})
		this.set("memberGrid",memberGrid);
		
		var form = new Form2({ 
			parentNode:".J-form",
			saveaction:function(){
				if(widget.get("form").getValue("bowOutShipFees") == true){
					if(Number(widget.get("form").getValue("bowOutFees")) <=0){
						Dialog.alert({
							content : "退会籍费金额必须大于0！"
						 });
						return false;
					}
					if(widget.get("form").getValue("bowOutFees").length<1){
						Dialog.alert({
							content : "请输入退会籍费金额！"
						 });
						return false;
					}
				}
				if(Number(widget.get("form").getValue("bowOutFees"))>Number(widget.get("form").getValue("memberShipFees"))){
					Dialog.alert({
						content : "退会籍费金额必须小于等于会籍费！"
					 });
					return false;
				}
				var bowOutDate = form.getValue("bowOutDate");
				var signDate= form.getValue("signDate");
				var applyDate= form.getValue("applyDate");
				if(bowOutDate <= signDate){
					Dialog.alert({
						content:"退卡日期必须大于签约日期！"
					});
					form.setValue("bowOutDate","");
					return false;
				}
				if(applyDate <= signDate){
					Dialog.alert({
						content:"申请日期必须大于签约日期！"
					});
					form.setValue("applyDate","");
					return false;
				}
				if(applyDate >bowOutDate){
					Dialog.alert({
						content:"申请日期必须小于等于退卡日期！"
					});
					form.setValue("applyDate","");
					return false;
				}
				var datas = widget.get("form").getData();
				datas.membershipContract = pkMembershipContract;
				aw.saveOrUpdate("api/bowoutmembershipcontractapply/save",datas,function(data){
					widget.get("subnav").show(["time","flowStatus","add","search","bowOutShipFees"]).hide(["return"]);
					widget.show([".J-grid"]).hide([".J-memberGrid",".J-form",".J-form2",".J-approvalUI"]);
					widget.get("grid").refresh();
				});
				
			},
			cancelaction:function(){
				if(position=="apply"){
					widget.get("subnav").hide(["time","flowStatus","add","bowOutShipFees"]).show(["search","return"]);
					widget.show([".J-memberGrid"]).hide([".J-grid",".J-form2",".J-form",".J-approvalUI"]);
				}else{
					widget.get("subnav").show(["time","flowStatus","add","search","bowOutShipFees"]).hide(["return"]);
					widget.show([".J-grid"]).hide([".J-memberGrid",".J-form",".J-form2",".J-approvalUI"]);
				}
			},
			model:{//TODO form
				id:"bowoutmembershipcontractapply",
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
//					lazy:true,
					type:"text",
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
					type:"text",
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
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"room",
					label:"房间号",
					readonly:true,
					key:"pkRoom",
    				type:"text",
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
				},{
    				name:"operators",
    				readonly:true,
    				lazy:true,
    				label:"经手人",
    				type:"text",
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
					style:{
						value:"width:85%"
					}
				},{
					name:"flowStatus",
					type:"hidden",
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
//					lazy:true,
					label:"经手人",
					type:"select",
    				key:"pkUser",
    				url:"api/users",//TODO 用户角色：wulina
    				params:{
						fetchProperties:"pkUser,name"
					},
					value:"name",
//					defaultValue:activeUser,
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
					validate:["required"],
					style:{
						value:"width:85%"
					}
				}]
			}
		})
		this.set("form",form);
		
		var addForm = new Form({
			parentNode:".J-addForm",
			
			model:{
				id:"bowoutmembershipcontractapplyadd",
				saveaction:function(){
					if(widget.get("addForm").getValue("bowOutShipFees") == true){
						if(Number(widget.get("addForm").getValue("bowOutFees")) <=0){
							Dialog.alert({
								content : "退会籍费金额必须大于0！"
							 });
							return false;
						}
						if(widget.get("addForm").getValue("bowOutFees").length<1){
							Dialog.alert({
								content : "请输入退会籍费金额！"
							 });
							return false;
						}
					}
					if(Number(widget.get("addForm").getValue("bowOutFees"))>Number(widget.get("addForm").getValue("memberShipFees"))){
						Dialog.alert({
							content : "退会籍费金额必须小于等于会籍费！"
						 });
						return false;
					}
					var bowOutDate = addForm.getValue("bowOutDate");
					var signDate= addForm.getValue("signDate");
					var applyDate= addForm.getValue("applyDate");
					if(bowOutDate <= signDate){
						Dialog.alert({
							content:"退卡日期必须大于签约日期！"
						});
						addForm.setValue("bowOutDate",moment().valueOf());
						return false;
					}
					if(applyDate <= signDate){
						Dialog.alert({
							content:"申请日期必须大于签约日期！"
						});
						addForm.setValue("applyDate",moment().valueOf());
						return false;
					}
					if(applyDate >bowOutDate){
						Dialog.alert({
							content:"申请日期必须小于等于退卡日期！"
						});
						addForm.setValue("applyDate",moment().valueOf());
						return false;
					}
					var datas = widget.get("addForm").getData();
					datas.membershipContract = pkMembershipContract;
					aw.saveOrUpdate("api/bowoutmembershipcontractapply/save",datas,function(data){
						widget.get("subnav").show(["time","flowStatus","add","search","bowOutShipFees"]).hide(["return"]);
						widget.show([".J-grid"]).hide([".J-memberGrid",".J-form",".J-form2",".J-approvalUI",".J-addForm"]);
						widget.get("grid").refresh();
					});
				},
				cancelaction:function(){
						widget.get("subnav").show(["time","flowStatus","add","search","bowOutShipFees"]).hide(["return"]);
						widget.show([".J-grid"]).hide([".J-memberGrid",".J-form",".J-form2",".J-approvalUI",".J-addForm"]);
				},
				items:[{
					name:"pkMembershipContract",
					type:"hidden"
				},{
					name:"membershipContractSearch",
					label:"卡号/房间号",
					type:"autocomplete",
					url:"api/membershipcontract/queryCheckOutCard",
					keyField:"pkMembershipContract",
					queryParamName : "s",
					useCache:false,
					maxItemsToShow:10,
					params:{
						searchProperties : "membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name,room.number",
						fetchProperties:"bmc.flowStatus,bmc.bowOutConfrim," +
								"ms.room.number,ms.checkInDate,ms.status," +
								"pkMembershipContract,checkInType,chargeStatus," +
								"status,room.number,signDate,operator.pkUser,operator.name,memberShipFees,membershipCard.name,personalCardowners.pkPersonalInfo,personalCardowners.personalInfo.name",
					},
					format : function(data,value){
						if(data.ms==null){
							return data.membershipCard.name;
						}else{
							return data.membershipCard.name + "/" + data.ms.room.number;
						}
					},
					onItemSelect : function(data){
						widget.compare(data,widget);
					},
					validate:["required"]
				},{
					name:"membershipCardName",
					label:i18ns.get("sale_card_name","卡号"),
					readonly:true,
					type:"text",
					validate:["required"]
				},{
					name:"names",
					label:"权益人",
					readonly:true,
					type:"text"
				},{
					name:"checkInType",
					readonly:true,
					label:"入住类型",
					type:"text"
				},{
					name:"signDate",
					readonly:true,
					label:"签约日期",
					type:"date"
				},{
    				name:"operators",
    				readonly:true,
    				label:"经手人",
    				type:"text",
					value:"name"
				},{
					name:"roomNumber",
					label:"房间号",
					readonly:true
				},{
					name:"memberShipFees",
					label:"会籍费",
					readonly:true,
					type:"text"
				},{
					name:"checkInDate",
					label:"入住日期",
					type:"date",
					readonly:true
				},{
					name:"checkOutDate",
					label:"退房日期",
					type:"date",
					readonly:true
				},{
					name:"signstatus",
					label:"会员签约状态",
					type:"text",
					readonly:true
				},{
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
					name:"flowStatus",
					type:"hidden",
					defaultValue:"Initial"
				},{
					name:"bowOutDate",
					label:"退卡日期",
					type:"date",
//					defaultValue:moment().valueOf(),
					validate:["required"],
				
				},{
					name:"applyDate",
					label:"申请日期",
					type:"date",
//					defaultValue:moment().valueOf(),
					validate:["required"],
				},{
					name:"personalCardowner",
					label:"申请人",
					keyField:"pkPersonalCardowner",
    				type:"select",
    				valueField:"personalInfo.name",
    				url:"api/personalCardowner/querybymembershipcontract",
    				lazy:true,
					validate:["required"],
				},{
					name:"operator",
//					lazy:true,
					label:"经手人",
					type:"select",
					keyField:"pkUser",
    				url:"api/users",//TODO 用户角色：wulina
    				params:{
						fetchProperties:"pkUser,name"
					},
					valueField:"name",
//					defaultValue:activeUser,
					validate:["required"],
				},{
					name:"bowOutShipFees",
					label:"是否退会籍费",
					type:"radio",
					list:[{
						key:"true",
						value:"是"
					},{
						key:"false",
						value:"否"
					}],
    				validate:["required"],
				},{
					name:"bowOutFees",
					label:"退会籍费金额",
				},{
					name:"bowOutReason",
					label:"退会籍原因",
					type :"textarea",
					validate:["required"],
				}]
			}
		})
		this.set("addForm",addForm);
		
		var form2 = new Form2({
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
			},
		})
		this.set("form2",form2);
		
		var printform = new Form2({
			parentNode:".J-PrintForm",
			model:{
				id:"bowoutmembershipcontractapply2",
				defaultButton:false,
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
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"checkInType",
					label:"入住类型",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"signDate",
					label:"签约日期",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"room",
					label:"房间号",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"memberShipFees",
					label:"会籍费",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
    				name:"operators",
    				label:"经手人",
    				style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"name",
					label:"权益人",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"flowStatus",
					label:"状态",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"bowOutDate",
					label:"退卡日期",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				
				},{
					name:"applyDate",
					label:"申请日期",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"personalCardowner",
					label:"申请人",
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"operator",
					label:"经手人",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
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
					style:{
						container:"width:50%;float:left;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"bowOutFees",
					label:"退会籍费金额",
					style:{
						container:"width:50%;float:right;",
						label:"width:40%;float:left;",
						value:"width:50%;float:left;"
					}
				},{
					name:"bowOutReason",
					label:"退会籍原因",
					type :"textarea",
					style:{
						container:"width:100%;height:100px;",
						label:"width:40%;float:left;",
						value:"width:82%;height:100px;float:right;margin:-30px 0px 0px -10px; "
					}
				}]
			},
		})
		this.set("printform",printform);
		var  approvalUI = new ApprovalUI({
			parentNode : ".J-approvalUI",
		});
		approvalUI.render();
		this.set("approvalUI",approvalUI);
		},
		compare:function(data, widget){//TODO autocomplete
			var addForm = widget.get("addForm");
			if(data.chargeStatus==null){
				Dialog.alert({
					content : "此卡号没有对应的会籍卡收费单！"
				 });
				addForm.reset();
				addForm.setDisabled("bowOutDate",true);
				addForm.setDisabled("applyDate",true);
				addForm.setDisabled("personalCardowner",true);
				addForm.setDisabled("operator",true);
				addForm.setDisabled("bowOutShipFees",true);
				addForm.setDisabled("bowOutFees",true);
				addForm.setDisabled("bowOutReason",true);
				return false;
			}
			if(data.ms!=null && data.ms.status.key != "Termination"){
				Dialog.alert({
					content : "会员签约不是终止状态，不能申请退卡！"
				 });
				addForm.reset();
				addForm.setDisabled("bowOutDate",true);
				addForm.setDisabled("applyDate",true);
				addForm.setDisabled("personalCardowner",true);
				addForm.setDisabled("operator",true);
				addForm.setDisabled("bowOutShipFees",true);
				addForm.setDisabled("bowOutFees",true);
				addForm.setDisabled("bowOutReason",true);
				return false;
			}
			if(data.bmc!=null&&(data.bmc.flowStatus.key!="Approved"||data.bmc.bowOutConfrim==false)){//审批未完成或未确认
				Dialog.alert({
					content : "此卡号已经申请退会籍，不能再次申请！"
				 });
				addForm.reset();
				addForm.setDisabled("bowOutDate",true);
				addForm.setDisabled("applyDate",true);
				addForm.setDisabled("personalCardowner",true);
				addForm.setDisabled("operator",true);
				addForm.setDisabled("bowOutShipFees",true);
				addForm.setDisabled("bowOutFees",true);
				addForm.setDisabled("bowOutReason",true);
				return false;
			}
			if(data.chargeStatus.key!="Payup"){
				Dialog.alert({
					content : "此卡号的会籍费未完全缴清，不能申请退会籍！"
				 });
				addForm.reset();
				addForm.setDisabled("bowOutDate",true);
				addForm.setDisabled("applyDate",true);
				addForm.setDisabled("personalCardowner",true);
				addForm.setDisabled("operator",true);
				addForm.setDisabled("bowOutShipFees",true);
				addForm.setDisabled("bowOutFees",true);
				addForm.setDisabled("bowOutReason",true);
				return false;
			}
			if(data){
				addForm.setDisabled("bowOutDate",false);
				addForm.setDisabled("applyDate",false);
				addForm.setDisabled("personalCardowner",false);
				addForm.setDisabled("operator",false);
				addForm.setDisabled("bowOutShipFees",false);
				addForm.setDisabled("bowOutReason",false);
				addForm.setValue("bowOutDate",moment().valueOf());
				addForm.setValue("applyDate",moment().valueOf());
				addForm.setValue("bowOutShipFees","false");
				addForm.setDisabled("bowOutFees",true);
				addForm.setValue("bowOutFees",0);
				addForm.setValue("pkMembershipContract",data.pkMembershipContract);
				pkMembershipContract = data.pkMembershipContract;
				addForm.setValue("checkInType",data.checkInType.value);
				if(data.signDate!=null){
					addForm.setValue("signDate",data.signDate);
				}
				if(data.memberShipFees!=null){
					addForm.setValue("memberShipFees",data.memberShipFees);
				}else{
					addForm.setValue("memberShipFees",0);
				}
				if(data.ms!=null){
					addForm.setValue("roomNumber",data.ms.room.number);
					addForm.setValue("checkInDate",data.ms.checkInDate);
					addForm.setValue("signstatus",data.ms.status.value);
				}else{
//					addForm.setValue("status"," ");
				}
				if(data.checkOutDate!=null){
					addForm.setValue("checkOutDate",data.checkOutDate);
				}else{
					
				}
				var name = "";
				for(var i=0;i<data.personalCardowners.length;i++){
					if(i<data.personalCardowners.length-1){
						name+= data.personalCardowners[i].personalInfo.name+",";
					}else{
						name+= data.personalCardowners[i].personalInfo.name;
					}
				}
				addForm.setValue("names",name);
				addForm.setValue("membershipCardName",data.membershipCard.name)
				addForm.setValue("operators",data.operator.name);
				addForm.setValue("operator",activeUser);
				addForm.load("personalCardowner",{
					params:{
						"pkMembershipContract":data.pkMembershipContract,
						"fetchProperties":"personalInfo.name,pkPersonalCardowner"
					},
				});
				
			}
		},
		afterInitComponent:function(params,widget){
			if(params && params.father == "checkoutroomconfirm"){
				var addForm = widget.get("addForm");
				widget.hide(".J-grid").show(".J-addForm");
				widget.get("subnav").hide(["time","flowStatus","add","bowOutShipFees","search","return"]).show([]);
				aw.ajax({
					url : "api/membershipcontract/queryCheckOutCard",					
					data : {
						s:params.card,
						searchProperties:"membershipContract.membershipCard.name,membershipContract.personalCardowners.personalInfo.name,room.number",
						fetchProperties:"bmc.flowStatus,bmc.bowOutConfrim," +
								"ms.room.number,ms.checkInDate,ms.status," +
								"pkMembershipContract,checkInType,chargeStatus," +
								"status,room.number,signDate,operator.pkUser,operator.name,memberShipFees,membershipCard.name,personalCardowners.pkPersonalInfo,personalCardowners.personalInfo.name",
					},
					dataType : "json",
					success : function(data){
						widget.compare(data[0],widget);
						var data = {
								pkMembershipContract:params.pkMe,
								ms:{
									room:{
										number:params.room
										}
									},
								membershipCard:{
									name:params.card
								}
						};
						addForm.setData("membershipContractSearch",data)
					}
				});
			}
		}
	});
	module.exports = bowoutmembershipcontractapply;
});
