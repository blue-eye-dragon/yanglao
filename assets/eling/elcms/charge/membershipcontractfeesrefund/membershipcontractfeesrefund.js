/**
 * 会籍收费-->卡费退款申请
 * ELVIEW
 * subnav 
 * grid 
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var Form=require("form-2.0.0")
	var store = require("store");
	var ApprovalUI = require("approvalUI");
	var activeUser = store.get("user");
	//多语
	var i18ns = require("i18n");
	require("./membershipcontractfeesrefund.css");
	var template="<div class='el-membershipcontractfeesrefundapply'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"<div class='J-PrintForm hidden' style='border:0 none;height:290px'></div>"+
		"<div class='J-approvalUI hidden'></div>"+
		"</div>";
	
	var membershipcontractfeesrefundapply = ELView.extend({
		events : {
			"click .J-submit":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				Dialog.confirm({
					setStyle:function(){},
					content:"确认提交审批？",
					confirm:function(){
						Dialog.alert({
							title:"提示",
							showBtn:false,
							content:"正在处理，请稍后……"
						});
						aw.ajax({
							url:"api/membershipcontractfeesrefund/commit",
							data:{
								pkMembershipContractFeesRefund:data.pkMembershipContractFeesRefund,
							},
							dataType:"json",
							success:function(data){
			                	Dialog.close();
								grid.refresh();
							},
			                error: function (data){
			                	Dialog.close();
		                    }
						});
						return "NotClosed";
					}
				});
			},
			"click .J-print":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var approvalUI=this.get("approvalUI");
				var printform =this.get("printform");
				data.memberShipContractFees.memberShipContract.signDate = moment(data.memberShipContractFees.memberShipContract.signDate).format("YYYY-MM-DD");
				if(data){
					data.refundTime = moment(data.refundTime).format("YYYY-MM-DD");
				}
				var name= "";
				if(data.memberShipContractFees.memberShipContract.personalCardowners.length>0){
					for(var i =0 ;i<data.memberShipContractFees.memberShipContract.personalCardowners.length;i++){
						if(i<data.memberShipContractFees.memberShipContract.personalCardowners.length-1){
							name+= data.memberShipContractFees.memberShipContract.personalCardowners[i].personalInfo.name+"、";
						}else{
							name+= data.memberShipContractFees.memberShipContract.personalCardowners[i].personalInfo.name;
						}
					}
				}else{
					name="无";
				}
				data.names =name;
				printform.setData(data);
				approvalUI.set("param",{
					modelId:data.pkMembershipContractFeesRefund,
					serviceType:"MemberShipFeesRefund",
					hideButton:false,
					callBack:function(data){
						if(data){
							aw.ajax({
								url:"api/membershipcontractfeesrefund/query",
								data:{
									pkMembershipContractFeesRefund:data.pkMembershipContractFeesRefund,
									fetchProperties:"flowStatus"
								},
								dataType:"json",
								success:function(data){
									if(data[0]){
										if(data[0].flowStatus.key=="Approved" ){
											widget.get("form").setValue("flowStatus.value","已通过");
										}else if(data[0].flowStatus.key=="NotApproved"){
											widget.get("form").setValue("flowStatus.value","未通过");
										}
									}
									widget.get("grid").refresh();
								}
							});
						}
					}
				});
				this.hide([".J-Grid"]).show([".J-PrintForm",".J-approvalUI"]);
				this.get("subnav").hide(["search","building","cardType","flowStatus","time"]);
				var widget=this;
				approvalUI.get("appgrid").refresh(null,function(data){
					window.print();
					widget.hide([".J-PrintForm",".J-approvalUI"]).show([".J-Grid"]);
					widget.get("subnav").show(["search","building","cardType","flowStatus","time"]);
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
        			title: i18ns.get("sale_shipfees_contract","卡")+"费退款申请",
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/membershipcontractfeesrefund/search",
							data:{
								s:str,
								properties:"memberShipContractFees.memberShipContract.membershipCard.name," +
										"memberShipContractFees.memberShipContract.room.number," +
										"memberShipContractFees.memberShipContract.personalCardowners.personalInfo.name," +
										"memberShipContractFees.memberShipContract.membershipCard.cardType.name",
								fetchProperties:"*," +
										"memberShipContractFees.memberShipContract.pkMemberShipContract," +
										"memberShipContractFees.memberShipContract.personalCardowners.personalInfo.name," +
										"memberShipContractFees.memberShipContract.membershipCard.name," +
										"memberShipContractFees.memberShipContract.checkInType," +
										"memberShipContractFees.memberShipContract.membershipCard.cardType.name," +
										"memberShipContractFees.memberShipContract.memberShipFees," +
										"memberShipContractFees.memberShipContract.room.number," +
										"memberShipContractFees.memberShipContractFees.memberShipContract.signDate," +
										"pkMembershipContractFeesRefund," +
										"refundTime," +
										"refund.name," +
										"refundAmount," +
										"flowStatus,"+   
										"memberShipContractFees.feesdetails.chargeStatus",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
        			buttons:[{
						id:"return",
        				text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-Grid"]).hide([".J-Form"]);
							widget.get("subnav").hide(["return"]).show(["building","cardType","flowStatus","time"]);
							return false;
						}
					},{
						id:"print",
        				text:"打印",
						show:false,
					}],
        			
        			buttonGroup:[{
        				id:"cardType",
        				tip:i18ns.get("sale_card_type","会籍卡类型"),
        				key:"pkMemberShipCardType",
        				showAll:true,
        				showAllFirst:true,
        				value:"name",
        				url:"api/cardtype/query",
        				handler:function(key,element){
        					   widget.get("grid").refresh();
        				}
        			},{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
        			},{
	     				   id:"flowStatus",
	     				   tip:"退款状态",
	     				   showAll:true,
	     				   items:[{
	     					  key:"Initial",
	     					  value:"初始"
	     				   },{
	     					   key:"Approvaling",
	     					   value:"审评中"
	     				   },{
	     					   key:"Approved",
	     					   value:"审批通过"
	     				   },{
	     					   key:"NotApproved",
	     					   value:"审批不通过"
	     				   }],
	     				   handler:function(key,element){
								   widget.get("grid").refresh();
	     				   }
	     			   }],
        			time:{
        				tip:"退款时间",
   					 	ranges:{
   					 		"本年": [moment().startOf("year"), moment().endOf("year")],
   					 		"去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
   							"前年": [moment().subtract(2,"year").startOf("year"),moment().subtract(2,"year").endOf("year")],
   							},
   						defaultTime:"本年",
           				click:function(time){
           					widget.get("grid").refresh();
   						}
   					}
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
				url:"api/membershipcontractfeesrefund/query",
				params:function(){
					return {
						"memberShipContractFees.memberShipContract.membershipCard.cardType":widget.get("subnav").getValue("cardType"),
						"flowStatus":widget.get("subnav").getValue("flowStatus"),
						"memberShipContractFees.memberShipContract.room.building":widget.get("subnav").getValue("building"),
						"refundTime":widget.get("subnav").getValue("time").start,
						"refundTimeEnd":widget.get("subnav").getValue("time").end,
						fetchProperties:
						"memberShipContractFees.memberShipContract.pkMemberShipContract," +
						"memberShipContractFees.memberShipContract.personalCardowners.personalInfo.name," +
						"memberShipContractFees.memberShipContract.membershipCard.name," +
						"memberShipContractFees.memberShipContract.checkInType," +
						"memberShipContractFees.memberShipContract.membershipCard.cardType.name," +
						"memberShipContractFees.memberShipContract.memberShipFees," +
						"memberShipContractFees.memberShipContract.room.number," +
						"memberShipContractFees.memberShipContract.signDate," +
						"pkMembershipContractFeesRefund," +
						"refundTime," +
						"refund.name," +
						"refundAmount," +
						"flowStatus,"+   
						"memberShipContractFees.feesdetails.chargeStatus",
					};
				},
				model:{
					columns:[{
						key:"memberShipContractFees.memberShipContract.membershipCard.name",
						name:i18ns.get("sale_card_name","会籍卡号"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								var form =widget.get("form");
								data.memberShipContractFees.memberShipContract.signDate = moment(data.memberShipContractFees.memberShipContract.signDate).format("YYYY-MM-DD");
								if(data){
									data.refundTime = moment(data.refundTime).format("YYYY-MM-DD");
								}
								var name= "";
								if(data.memberShipContractFees.memberShipContract.personalCardowners.length>0){
									for(var i =0 ;i<data.memberShipContractFees.memberShipContract.personalCardowners.length;i++){
										if(i<data.memberShipContractFees.memberShipContract.personalCardowners.length-1){
											name+= data.memberShipContractFees.memberShipContract.personalCardowners[i].personalInfo.name+"、";
										}else{
											name+= data.memberShipContractFees.memberShipContract.personalCardowners[i].personalInfo.name;
										}
									}
								}else{
									name="无";
								}
								data.names =name;
								form.setDisabled(true);
								form.setData(data);
								widget.hide([".J-Grid"]).show([".J-Form"]);
								widget.get("subnav").show(["return"]).hide(["building","cardType","flowStatus","time"]);
							}
						}]
					},{
						key:"memberShipContractFees.memberShipContract.membershipCard.cardType.name",
						name:i18ns.get("sale_card_type","会籍卡类型"),
					},{
						key:"memberShipContractFees.memberShipContract.personalCardowners",
						name:"权益人",
						format:function(value,row){
							var name= "";
							if(value.length>0){
								for(var i =0 ;i<value.length;i++){
									if(i<value.length-1){
										name+= value[i].personalInfo.name+"、";
									}else{
										name+= value[i].personalInfo.name;
									}
								}
							}else{
								name="无";
							}
							return name;
						}
					},{
						key:"memberShipContractFees.memberShipContract.signDate",
						name:"签约日期",
						format:"date"
					},{
						key:"memberShipContractFees.memberShipContract.checkInType.value",
						name:"入住类型"
					},{
						key:"memberShipContractFees.memberShipContract.room.number",
						name:"房间号"
					},{
						key:"memberShipContractFees.memberShipContract.memberShipFees",
						name:i18ns.get("charge_shipfees_confees","会籍卡费"),
						className:"text-right",
						format:"thousands"
					},{
						key:"refundTime",
						name:"申请日期",
						format:"date"
					},{
						key:"refundAmount",
						name:"退款金额",
						className:"text-right",
						format:"thousands"
					},{
						key:"refund.name",
						name:"申请人",
					},{
						key:"flowStatus.value",
						name:"状态",
					},{
						key:"operate",
						name : "操作",
						format:function(value,row){
									if(row.flowStatus.key=="Initial"){
											return "<pre><a style='margin-left:5px;color:white;background:#f34541' class='J-submit btn btn-xs ' href='javascript:void(0);''>提交</a></pre>";
									}else if(row.flowStatus.key=="Approved"){
										return "<pre><a style='margin-left:5px;color:white;background:#f34541' class='J-print btn btn-xs ' href='javascript:void(0);''>打印</a></pre>";
									}else{
										return row.flowStatus.value;
									}
 						}
					}]
				}
            });
            this.set("grid",grid);
	
            var form = new Form({
         		parentNode:".J-Form",
         		model:{
         			id:"refundForm",
         			items:[{
         				name:"memberShipContractFees.memberShipContract.membershipCard.name",
         				label: i18ns.get("sale_card_name","会籍卡号"),
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
						name:"memberShipContractFees.memberShipContract.membershipCard.cardType.name",
						label: i18ns.get("sale_card_type","会籍卡类型"),
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
         				name:"memberShipContractFees.memberShipContract.signDate",
         				label:"签约时间",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"names",
         				label:"权益人",
     					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"memberShipContractFees.memberShipContract.checkInType.value",
         				label:"入住类型",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"memberShipContractFees.memberShipContract.room.number",
         				label:"房间号",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"memberShipContractFees.memberShipContract.memberShipFees",
         				label: i18ns.get("sale_shipfees_contract","卡")+"费",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"refundTime",
         				label:"申请时间",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"refundAmount",
         				label:"申请金额",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
         				}
         			},{
         				name:"refund.name",
						label:"退款申请人",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"flowStatus.value",
         				label:"退款状态",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			}]
         		}
			});
			this.set("form",form);
			
			 var printform = new Form({
	         		parentNode:".J-PrintForm",
	         		model:{
	         			id:"refundForm",
	         			defaultButton:false,
	         			items:[{
	         				name:"memberShipContractFees.memberShipContract.membershipCard.name",
	         				label: i18ns.get("sale_card_name","会籍卡号"),
	         				style:{
    							container:"width:50%;float:left;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
							name:"memberShipContractFees.memberShipContract.membershipCard.cardType.name",
							label: i18ns.get("sale_card_type","会籍卡类型"),
							style:{
    							container:"width:50%;float:right;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
						},{
	         				name:"memberShipContractFees.memberShipContract.signDate",
	         				label:"签约时间",
	         				style:{
    							container:"width:50%;float:left;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
	         				name:"names",
	         				label:"权益人",
	         				style:{
    							container:"width:50%;float:right;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
	         				name:"memberShipContractFees.memberShipContract.checkInType.value",
	         				label:"入住类型",
	         				style:{
    							container:"width:50%;float:left;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
	         				name:"memberShipContractFees.memberShipContract.room.number",
	         				label:"房间号",
	         				style:{
    							container:"width:50%;float:right;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
	         				name:"memberShipContractFees.memberShipContract.memberShipFees",
	         				label:i18ns.get("sale_shipfees_contract","卡")+"费",
	         				style:{
    							container:"width:50%;float:left;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
	         				name:"refundTime",
	         				label:"申请时间",
	         				style:{
    							container:"width:50%;float:right;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
	         				name:"refundAmount",
	         				label:"申请金额",
	         				style:{
    							container:"width:50%;float:left;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
	         				name:"refund.name",
							label:"退款申请人",
							style:{
    							container:"width:50%;float:right;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			},{
	         				name:"flowStatus.value",
	         				label:"退款状态",
	         				style:{
    							container:"width:50%;float:left;",
    							label:"width:40%;float:left;",
    							value:"width:50%;float:left;"
    						},
	         			}]
	         		}
				});
				this.set("printform",printform);
			var  approvalUI = new ApprovalUI({
				parentNode : ".J-approvalUI",
			});
			approvalUI.render();
			this.set("approvalUI",approvalUI);
            
        }
	});
	module.exports = membershipcontractfeesrefundapply;	
});

