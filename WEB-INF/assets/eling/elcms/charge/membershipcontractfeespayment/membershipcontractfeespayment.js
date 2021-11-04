/**
 * 会籍卡付款单
 * ELVIEW
 * subnav 
 * grid 
 * form
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	var enums  = require("enums");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+ 
		"<div class='J-form hidden'></div>" +
		"<div class='J-payGrid hidden'></div>"+
		"<div class='J-payForm hidden'></div>";
	var isEdit;//表示是否为编辑操作
	var membershipcontractfeespayment = ELView.extend({
		events:{
    		"change .J-form-membershipcontractfeespaymentForm-select-memberShipContract":function(e){
    			var widget=this;
    			var form=widget.get("form");
    			var payForm=widget.get("payForm");
    			var pkMemberShipContract =  form.getValue("memberShipContract");
    			if(pkMemberShipContract){
    				aw.ajax({
    					url:"api/membershipcontract/queryNormal",
    					data:{
    						"pkMembershipContract":pkMemberShipContract,
    						fetchProperties:"pkMembershipContract," +
    								"memberShipFees," +
    								"room.number" 
    					},
    					dataType:"json",
    					success:function(data){
    						if(data[0]){
    							form.setValue("room",(data[0].room?data[0].room.number:""));
    							payForm.setData("personalCardowner",data[0].personalCardowners);
    						}
    					}
    				});
    			}else{
					form.setValue("room","");
					payForm.setData("personalCardowner",[]);
				}
    		},
			"change .J-form-membershipcontractfeesdetialsForm-select-deposit":function(e){
    			var widget=this;
    			var payForm=widget.get("payForm");
    			var payGrid=widget.get("payGrid");
    			var form=widget.get("form");
    			var all= form.getValue("memberShipContract.memberShipFees");
    			var count=0;
				var datas =  payGrid.getData();
				var falg = false;
				for(var  i in datas){
					if(!datas[i].personalCardowner){
						falg=true;
					}
					if(datas[i]){
						if(datas[i].chargeStatus.key!="UnCharge")
							count +=Number(datas[i].realFees);
					}
				}
    			var pkDeposit =  payForm.getValue("deposit");
    			var chargeData = payForm.getData("dchargeStatus");
    			if(pkDeposit){
    				aw.ajax({
    					url:"api/deposit/query",
    					data:{
    						"pkDeposit":pkDeposit,
    						fetchProperties:"pkDeposit," +
    								"realDeposit"
    					},
    					dataType:"json",
    					success:function(data){
    						if(data[0]){
    							chargeData.push({
    								key:"Receiving",
    								value:"已到账"
    							})
    							payForm.setData("dchargeStatus",chargeData);
    							payForm.setValue("dchargeStatus","Receiving");
    							payForm.setAttribute("dchargeStatus","readonly",true);
    							payForm.setValue("realDeposit",data[0].realDeposit);
    							if(Number(data[0].realDeposit)>Number(all)-Number(count)){
    								Dialog.alert({
										content:"预约金金额大于所需缴纳金额！"
						    		});
									return;
    							}
    							payForm.setValue("realFees",Number(all)-Number(count)-Number(data[0].realDeposit)?Number(all)-Number(count)-Number(data[0].realDeposit):0);
    						}
    					}
    				});
    			}else{
    				payForm.setAttribute("dchargeStatus","readonly",false);
    				payForm.setData("dchargeStatus",chargeData);
    				if(payForm.getValue("realFees")){
    					payForm.setValue("realFees",Number(form.getValue("memberShipFees")));
					};
    			}
    		},
    		"click .J-form-membershipcontractfeesdetialsForm-checklist-isDeposit":function(e){
    			var widget=this;
    			var payForm=widget.get("payForm");
    			var payGrid=widget.get("payGrid");
    			var form=widget.get("form");
    			var all= form.getValue("memberShipContract.memberShipFees");
    			var Deposit =  payForm.getValue("isDeposit");
    			var chargeData = payForm.getData("dchargeStatus");
    			var count=0;
				var datas =  payGrid.getData();
    			if(Deposit[0]){
    				payForm.setAttribute("deposit","readonly",false);
    				payForm.setValue("chargeMode","Deposit");
    			}else{
    				for(var  i in datas){
    					if(!datas[i].personalCardowner){
    						falg=true;
    					}
    					if(datas[i]){
    						if(datas[i].chargeStatus.key!="UnCharge")
    							count +=Number(datas[i].realFees);
    					}
    				}
    				payForm.setAttribute("deposit","readonly",true);
    				payForm.setValue("chargeMode",{});
    				payForm.setValue("deposit",{});
    				payForm.setValue("realDeposit","");
    				payForm.setValue("realFees",Number(all)-Number(count));
    				payForm.setAttribute("dchargeStatus","readonly",false);
    				payForm.setData("dchargeStatus",chargeData);
    			}
    		},
    		"click .J-dele":function(e){
    			var widget=this;
    			var grid=widget.get("payGrid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				aw.del("api/membershipcontractfeesdetail/"+data.pkMembershipContractFeesDetail+"/delete"
						,function(dat){
							aw.ajax({
								url:"api/deposit/save",
								data:{
									"pkDeposit":data.deposit.pkDeposit,
									"chargeStatus":"Receiving",
									"version":data.deposit.version
								},
								dataType:"json",
								success:function(da){
									
								}
			    			});
							 widget.get("payGrid").refresh(null ,function(){
								 var payGrid = widget.get("payGrid");
								 var datas =payGrid.getData();
								 payGrid.setData(datas);
								 widget.setTitle(widget.get("form").getValue("memberShipContract.memberShipFees"),datas);
								 widget.show(".J-payGrid").hide(".J-payForm");
								 var count=0;
								 for(var i in datas){
									if(datas[i]){
										if(datas[i].chargeStatus.key!="UnCharge")
											count += datas[i].realFees;
									}
								 }
								 widget.get("form").setValue("feesdetails.realFees",count);
								 widget.get("payForm").load("deposit");
							 });
				})
    		}
    	},
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"卡费收取",
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/membershipcontractfees/search",
							data:{
								s:str,
								orderString:"endDate:decs",
								properties:"memberShipContract.membershipCard.name,"+
						          "memberShipContract.room.number,"+
						          "memberShipContract.personalCardowners.personalInfo.name," +
						          "memberShipContract.membershipCard.cardType.name",
						          fetchProperties:"*," +
									"memberShipContract.pkMemberShipContract," +
									"memberShipContract.status," +
									"memberShipContract.checkInType," +
									"memberShipContract.signDate," +
									"memberShipContract.personalCardowners.personalInfo.name," +
									"memberShipContract.membershipCard.name," +
									"memberShipContract.memberShipFees," +
									"memberShipContract.room.number," +
									"feesdetails.personalCardowner.pkPersonalCardowner," +
									"feesdetails.personalCardowner.personalInfo.name," +
									"feesdetails.personalCardowner.personalInfo.phone," +
									"feesdetails.deposit.pkDeposit," +
									"memberShipContract.membershipCard.cardType.name,"+
									"feesdetails.deposit.realDeposit,feesdetails.deposit.version," +
									"feesdetails.operator.pkUser," +
									"feesdetails.operator.name," +
									"feesdetails.isDeposit," +
									"feesdetails.deposit," +
									"feesdetails.chargeMode," +
									"feesdetails.realFees," +
									"feesdetails.chargeTime," +
									"feesdetails.confirm," +
									"feesdetails.confirmTime," +
									"feesdetails.version," +
									"feesdetails.chargeStatus," +
									"feesdetails.pkMembershipContractFeesDetail",
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
							$(".J-edit").removeClass("hidden");
							$(".J-delete").removeClass("hidden");
							$(".J-grid-head-add").removeClass("hidden");
							widget.hide([".J-form",".J-payGrid",".J-payForm"]).show([".J-grid"]);
							widget.get("subnav").show(["cardType","checkInType","building","chargeStatusIn","status","time","search"]).hide(["return"]);
							widget.get("grid").refresh();
						}
        			}],
        			buttonGroup:[{
        				id:"cardType",
        				tip:"卡类型",
        				key:"pkMemberShipCardType",
        				showAll:true,
        				showAllFirst:true,
        				value:"name",
        				url:"api/cardtype/query",
        				handler:function(key,element){
        					   widget.get("grid").refresh();
        				}
        			},{
        				  id:"checkInType",
        				  tip:"入住状态",
        				  showAll:true,
        				  showAllFirst:true,
        				  items:[{
        				   key:"CheckIn",
        				   value:"入住"
        				  },{
        				   key:"NotIn",
        				   value:"买卡不选房"  
        				  },{
        				   key:"HouseingNotIn",
        				   value:"选房不住" 
        				  }],
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
         				   id:"chargeStatusIn",
         				   tip:"收费情况",
        				   items:[{
        					   key:"UnCharge,Charging",
        					   value:"未缴清"
        				   },{
        					   key:"Payup",
        					   value:"已缴清"  
        				   },{
        					   key:"UnCharge,Charging,Payup",
        					   value:"全部"
        				   }
        				   ],
        				   handler:function(key,element){
    							 widget.get("grid").refresh();
        				   }
        			   },{
         				   id:"status",
         				   tip:"签约状态",
         				   showAll:true,
        				   items:[{
        					   key:"Normal",
        					   value:"正常"
        				   },{
        					   key:"Termination",
        					   value:"终止"  
        				   }],
        				   handler:function(key,element){
    							   widget.get("grid").refresh();
        				   }
        			   }],
        			   time:{
        				   tip:"签约日期",
        				   click:function(time){
        					   widget.get("grid").refresh();
        				   },
        			   }
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-grid",
            	autoRender: false,
				url:"api/membershipcontractfees/query",
				params:function(){
					return {
					"memberShipContract.checkInType":widget.get("subnav").getValue("checkInType"),
					"memberShipContract.membershipCard.cardType":widget.get("subnav").getValue("cardType"),
					"chargeStatusIn":widget.get("subnav").getValue("chargeStatusIn"),
					"memberShipContract.status":widget.get("subnav").getValue("status"),
					"memberShipContract.room.building":widget.get("subnav").getValue("building"),
					"memberShipContract.signDate":widget.get("subnav").getValue("time").start,
					"memberShipContract.signDateEnd":widget.get("subnav").getValue("time").end,
					};
				},
				fetchProperties:"*," +
					"memberShipContract.pkMemberShipContract," +
					"memberShipContract.status," +
					"memberShipContract.checkInType," +
					"memberShipContract.signDate," +
					"memberShipContract.personalCardowners.personalInfo.name," +
					"memberShipContract.membershipCard.name," +
					"memberShipContract.memberShipFees," +
					"memberShipContract.room.number," +
					"feesdetails.personalCardowner.pkPersonalCardowner," +
					"feesdetails.personalCardowner.personalInfo.name," +
					"feesdetails.personalCardowner.personalInfo.phone," +
					"feesdetails.deposit.pkDeposit," +
					"memberShipContract.membershipCard.cardType.name," +
					"feesdetails.fundName," +
					"feesdetails.salesMan.pkUser," +
					"feesdetails.salesMan.name,"+
					"feesdetails.deposit.realDeposit,feesdetails.deposit.version," +
					"feesdetails.operator.pkUser," +
					"feesdetails.operator.name," +
					"feesdetails.isDeposit," +
					"feesdetails.deposit," +
					"feesdetails.chargeMode," +
					"feesdetails.realFees," +
					"feesdetails.chargeTime," +
					"feesdetails.confirm," +
					"feesdetails.confirmTime," +
					"feesdetails.version," +
					"feesdetails.chargeStatus," +
					"feesdetails.pkMembershipContractFeesDetail",
				model:{
					columns:[{
						key:"memberShipContract.membershipCard.name",
						name:"会籍卡号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.show([".J-form",".J-payGrid"]).hide([".J-grid",".J-payForm"]);
								widget.get("subnav").hide(["cardType","checkInType","building","chargeStatusIn","status","time","search"]).show(["return"]);
								var form = widget.get("form");
								var payGrid = widget.get("payGrid");
								var payForm = widget.get("payForm");
								var names= "";
								if(data.memberShipContract.personalCardowners.length>0){
									for(var i =0 ;i<data.memberShipContract.personalCardowners.length;i++){
										if(i<data.memberShipContract.personalCardowners.length-1){
											names+= data.memberShipContract.personalCardowners[i].personalInfo.name+"、";
										}else{
											names+= data.memberShipContract.personalCardowners[i].personalInfo.name;
										}
									}
								}else{
									names="无";
								}
								data.names = names;
								form.reset();
								form.setData(data);
								form.setValue("mversion",data.version);
								form.setValue("room",data.memberShipContract.room?data.memberShipContract.room.number:"");
								form.setValue("mchargeStatus",data.chargeStatus.value);
								var datas=data.feesdetails;
								for(var j=0;j<datas.length;j++){
									datas[j].memberShipContractFees={chargeStatus:{key:data.chargeStatus.key,value:data.chargeStatus.value}};
								}
								payGrid.setData(datas);
								widget.setTitle(data.memberShipContract.memberShipFees,datas);
								$(".J-edit").addClass("hidden");
								$(".J-delete").addClass("hidden");
								$(".J-dele").addClass("hidden");
								$(".J-grid-head-add").addClass("hidden");
								var count=0;
								var datas =data.feesdetails;
								for(var  i in datas){
									if(datas[i]){
										if(datas[i].chargeStatus.key!="UnCharge")
											count += datas[i].realFees;
									}
								}
								form.setValue("feesdetails.realFees",count);
							}
						}]
					},{
						key:"memberShipContract.membershipCard.cardType.name",
						name:"卡类型"
					},{
						key:"memberShipContract.personalCardowners",
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
						key:"memberShipContract.signDate",
						name:"签约时间",
						format:"date"
					},{
						key:"memberShipContract.checkInType.value",
						name:"入住类型"
					},{
						key:"memberShipContract.room.number",
						name:"房间号"
					},{
						key:"memberShipContract.memberShipFees",
						name:i18ns.get("charge_shipfees_confees","会员余额"),
						className:"text-right",
						format:"thousands"
					},{
						key:"feesdetails.realFees",
						name:i18ns.get("charge_shipfees_realfees","已收卡费"),
						className:"text-right",
						format:function(value,row){
							var count=0;
							var datas =row.feesdetails;
							for(var  i in datas){
								if(datas[i]){
									if(datas[i].chargeStatus.key!="UnCharge")
										count += datas[i].realFees;
								}
							}
							count=Number(count).toFixed(2)+"";
							return count.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
						}
					},{
						key:"feesstatus",
						name:"是否缴清",
						format:function(value,row){
							var name= "";
							if(row.chargeStatus.key=="Payup"){
								name = "是";
							}else{
								name = "否";
							}
							return name;
						}
					},{
						key:"memberShipContract.status.value",
						name:"签约状态",
					},{
						key:"money",
						name : "收费",
						format:function(value,row){
							if(row.chargeStatus.key=="Payup"){
								return "已缴清";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",
							text:"收费",
							handler:function(index,data,rowEle){
								if(data.memberShipContract.personalCardowners.length==0){
									Dialog.alert({
										content:"无权益人，不能进行收费"
						    		});
									return;
								}else{
									widget.show([".J-form",".J-payGrid"]).hide([".J-grid",".J-payForm"]);
									widget.get("subnav").hide(["cardType","checkInType","building","chargeStatusIn","status","time","search"]).show(["return"]);
									var form = widget.get("form");
									var payGrid = widget.get("payGrid");
									var payForm = widget.get("payForm");
									var names= "";
									if(data.memberShipContract.personalCardowners.length>0){
										for(var i =0 ;i<data.memberShipContract.personalCardowners.length;i++){
											if(i<data.memberShipContract.personalCardowners.length-1){
												names+= data.memberShipContract.personalCardowners[i].personalInfo.name+"、";
											}else{
												names+= data.memberShipContract.personalCardowners[i].personalInfo.name;
											}
										} 
									}else{
										names="无";
									}
									data.names = names;
									form.reset();
									form.setData(data);
									form.setValue("mversion",data.version);
									form.setValue("room",data.memberShipContract.room?data.memberShipContract.room.number:"");
									form.setValue("mchargeStatus",data.chargeStatus.value);
									
									var datas=data.feesdetails;
									for(var j=0;j<datas.length;j++){
										datas[j].memberShipContractFees={chargeStatus:{key:data.chargeStatus.key,value:data.chargeStatus.value}};
									}
									payGrid.setData(datas);
									widget.setTitle(data.memberShipContract.memberShipFees,datas);
									payForm.load("personalCardowner");
									var count=0;
									var datas =data.feesdetails;
									for(var  i in datas){
										if(datas[i]){
											if(datas[i].chargeStatus.key!="UnCharge")
												count += datas[i].realFees;
										}
									}
									form.setValue("feesdetails.realFees",count);
								}
							}
						}]
					},{
						key:"memberShipContract.status",
						name:"是否退费",
						format:function(value,row){
							if(row.Status===("Normal")){
								return  "是";
							}else{
								return  "否";
							}
						}
					},{
						key:"feesdetails.realFees",
						name:"退费金额",
						format:function(value,row){
							var status=row.Status;
							if(status==="Termination"){
							var count=0;
							var datas =row.feesdetails;
									for(var  i in datas){
												if(datas[i]){
														if(datas[i].chargeStatus.key!="UnCharge")
															count += datas[i].realFees;
												}
									}
							count=Number(count).toFixed(2)+"";
							return count.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
						   }
							return 0;
						}
					}]
				}
            });
            this.set("grid",grid);
        	var form=new Form({
        		parentNode:".J-form",
        		model:{
        			id:"membershipcontractfeespaymentForm",
        			defaultButton:false,
        			items:[{
        				name:"pkMembershipContractFees",
        				type:"hidden"	
        			},{
        				name:"mversion",
        				type:"hidden"
        			},{
        				name:"memberShipContract.pkMembershipContract",
        				type:"hidden"
        			},{
        				name:"memberShipContract.membershipCard.name",
        				label:"会籍卡",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				readonly:true
        			},{
        				name:"names",
        				label:"权益人",
        				className:{
							container:"col-md-6",
							label:"col-md-1",
							valueContainer:"col-md-5"
						},
						readonly:true
        			},{
        				name:"room",
        				label:"房间",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				readonly:true
        			},{
        				name:"mchargeStatus",
        				label:"状态",
        				className:{
        					container:"col-md-6",
							label:"col-md-2",
							valueContainer:"col-md-4"
						},
        				readonly:true
        			},{
        				name:"memberShipContract.memberShipFees",
        				label:"卡费",
        				className:{
        					container:"col-md-6",
        					label:"col-md-4",
						},
        				readonly:true
        			},{
        				name:"feesdetails.realFees",
        				label:"已收卡费",
        				className:{
        					container:"col-md-6",
        					label:"col-md-2",
							valueContainer:"col-md-4"
						},
        				readonly:true
        			}]
        		}
        	});
        	this.set("form",form);
        	
        	var payGrid = new Grid({
        		parentNode:".J-payGrid",
        		url:"api/membershipcontractfeesdetail/query",
        		autoRender:false,
        		params:function(){
        			return{
        				"memberShipContractFees":widget.get("form").getValue("pkMembershipContractFees"),
        				fetchProperties:"personalCardowner.personalInfo.name" +
        						",personalCardowner.pkPersonalCardowner" +
        						",isDeposit" +
        						",deposit.version,deposit.pkDeposit,deposit.realDeposit"+
        						",realFees" +
        						",fundName" +
        						",chargeMode.value"+
        						",chargeTime" +
        						",chargeStatus" +
        						",operator.pkUser" +
        						",operator.name" +
        						",salesMan.pkUser" +
        						",salesMan.name" +
        						",confirmTime" +
        						",confirm.pkUser" +
        						",confirm.name" +
        						",version" +
        						",pkMembershipContractFeesDetail,memberShipContractFees.chargeStatus" ,
        			}
        		},
        		model:{
        			head:{
						title:"", 
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								//新增操作
								isEdit = false;//isEdit为false
								var form = widget.get("form");
								var payGrid = widget.get("payGrid");
								var count=0;
								var datas =  payGrid.getData();
								var falg = false;
								for(var  i in datas){
									if(!datas[i].personalCardowner){
										falg=true;
									}
									if(datas[i]){
										if(datas[i].chargeStatus.key!="UnCharge")
											count +=Number(datas[i].realFees);
									}
								}
								if(falg){
									Dialog.alert({
		    							content:"您有一条预约金没有填写付款权益人，请您先填写付款权益人！"
		    						});
		            				return;
								}
								var all= form.getValue("memberShipContract.memberShipFees")
								if(Number(all)==Number(count)){
									Dialog.alert({
		    							content:"该收费单收费金额已经全部缴清！"
		    						});
		            				return;
								}
								widget.hide(".J-payGrid").show(".J-payForm");
								widget.get("payForm").reset();
								payForm.setValue("memberShipContractFees",form.getValue("pkMembershipContractFees"));
								payForm.setValue("realFees",Number(all)-Number(count));
								//当前用户是管理员时，让operator可用
								var userSelect=payForm.getData("operator",{});
								var flag = false;
								for(var  i =  0 ; i<userSelect.length;i++ ){
									if(userSelect[i].pkUser == activeUser.pkUser){
										flag= true;
										break;
									}
								}
								if(flag){
									payForm.setValue("operator",activeUser.pkUser);
								}
								payForm.setAttribute("deposit","readonly",true);
							}
						}]
					},
					columns:[{
						key:"personalCardowner.personalInfo.name",
						name:"付款权益人"
					},{
						key:"isDeposit",
						name:"是否预约金",
						format:function(value,row){
							if(value){
								return  "是";
							}else{
								return  "否";
							}
						}
					},{
						key:"chargeTime",
						name:"收费时间",
						format:"date"
					},{
						key:"realFees",
						name:"实收费用",
						className:"text-right",
						format:"thousands"
					},{
						key:"chargeStatus.value",
						name:"收费状态"
					},{
						key:"operator.name",
						name:"经手人"
					},{
						key:"confirmTime",
						name:"到账时间",
						format:"date"
					},{
						key:"confirm.name",
						name:"到账确认人"
					},{
						key:"operate",
						name:"操作",
						format:function(value,row){
							if(row.chargeStatus.key == "Receiving"){
								if(row.isDeposit){
									if(row.memberShipContractFees.chargeStatus.key!="Payup"){
										return "<pre>"+"<a style='margin-left:5px;color:white;background:#f34541' class='J-dele btn btn-xs ' href='javascript:void(0);''><i class='icon-remove'></i></a>";
									}else{
										return "已到账";
									}
								}else{
									return "已到账";
								}
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",	
							icon:"edit",
							handler:function(index,data,rowEle){
								//如果是编辑操作
								isEdit = true;//TODO cjf isEdit值为true，因为编辑操作和新增操作其中一个校验不一样 
								widget.hide(".J-payGrid").show(".J-payForm");
								var payForm = widget.get("payForm");
								var chargeData = payForm.getData("dchargeStatus");
								payForm.reset();
								payForm.setData(data);
								payForm.setValue("dversion",data.version);
								payForm.setValue("memberShipContractFees",widget.get("form").getValue("pkMembershipContractFees"));
								payForm.setValue("dchargeStatus",data.chargeStatus);
								if(data.isDeposit){
									$(".J-form-membershipcontractfeesdetialsForm-checklist-isDeposit").prop("checked",true);
									chargeData.push({
	    								key:"Receiving",
	    								value:"已到账"
	    							})
	    							payForm.setData("dchargeStatus",chargeData);
	    							payForm.setValue("dchargeStatus","Receiving");
	    							payForm.setAttribute("dchargeStatus","readonly",true);
	    							payForm.setValue("realDeposit",data.deposit.realDeposit);
								}else{
									payForm.setAttribute("deposit","readonly",true);
								}
								if(data.chargeStatus.key=="Charged"){
									payForm.setAttribute("dchargeStatus","readonly",true);
								}
							}
						},{
							key:"delete",	
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/membershipcontractfeesdetail/"+data.pkMembershipContractFeesDetail+"/delete"
										,function(data){
											 widget.get("payGrid").refresh(null ,function(){
												 var payGrid = widget.get("payGrid");
												 var datas =payGrid.getData();
												 payGrid.setData(datas);
												 widget.setTitle(widget.get("form").getValue("memberShipContract.memberShipFees"),datas);
												 widget.show(".J-payGrid").hide(".J-payForm");
												 var count=0;
												 for(var i in datas){
													if(datas[i]){
														if(datas[i].chargeStatus.key!="UnCharge")
															count += datas[i].realFees;
													}
												 }
												 form.setValue("feesdetails.realFees",count);
											 });
								})
							}
						}]
					}]
        		}
        	})
        	this.set("payGrid",payGrid);
        	
        	var payForm = new Form({
        		parentNode:".J-payForm",
        		saveaction:function(){
					var payGrid = widget.get("payGrid");
					var payForm = widget.get("payForm");
					var form = widget.get("form");
					var data =payForm.getData();
					data.isDeposit=data.isDeposit[0]; 
					if(data.isDeposit){
						if(data.deposit){
							data.deposit=payForm.getData("deposit",{
								pk:data.deposit
								});
						}else{
							Dialog.alert({
    							content:"请选择一条预约金！"
    						});
            				return false;
						}
					}
					
					var count=0;
					var datas =  payGrid.getData();
					for(var  i in datas){
						if(datas[i]){
							if(datas[i].chargeStatus.key!="UnCharge")
								count +=Number(datas[i].realFees);
						}
					}
					var all= form.getValue("memberShipContract.memberShipFees")
					if(Number(data.realFees)==0){
						Dialog.alert({
							content:"本次收费金额不能为0！"
						});
        				return;
					}
					if(isEdit!=true){
						//isEdit不为true，则表示新增操作，需要此校验
						if(data.realFees>(Number(all)-Number(count))){
							Dialog.alert({
								content:"本次收费金额大于所需缴纳金额！" 
							});
	        				return;
						}
					}
					var params=$("#membershipcontractfeesdetialsForm").serialize()+"&"+$("#membershipcontractfeespaymentForm").serialize()+
					"&"+"detilVersion="+data.dversion+"&"+"version="+form.getValue("mversion")+"&"+"dchargeStatus="+data.dchargeStatus;
					aw.saveOrUpdate("api/membershipcontractfeesdetail/saveInFees"
							,params
							,function(data){
								payGrid.refresh(null,function(){
									var datas =  payGrid.getData();
									payGrid.setData(datas);
									widget.setTitle(widget.get("form").getValue("memberShipContract.memberShipFees"),datas);
									widget.show(".J-payGrid").hide(".J-payForm");
									var count=0;
									for(var i in datas){
										if(datas[i]){
											if(datas[i].chargeStatus.key!="UnCharge")
												count += datas[i].realFees;
										}
									}
									form.setValue("feesdetails.realFees",count);
								});
					});
        		},
        		cancelaction:function(){
					widget.show(".J-payGrid").hide(".J-payForm");
				},
        		model:{
        			id:"membershipcontractfeesdetialsForm",
        			items:[{
        				name:"memberShipContractFees",
        				type:"hidden"
        			},{
        				name:"pkMembershipContractFeesDetail",
						type:"hidden"
					},{
						name:"dversion",
						defaultValue:"0",
						type:"hidden"
					},{
        				name:"personalCardowner",
        				label:"付款权益人",
        				key:"pkPersonalCardowner",
        				type:"select",
        				value:"personalInfo.name",
        				url:"api/personalCardowner/querybymembershipcontract",
        				lazy:true,
        				params:function(){
        					return{
        						"pkMembershipContract":widget.get("form").getValue("memberShipContract.pkMembershipContract"),
        						"fetchProperties":"personalInfo.name,pkPersonalCardowner"
        					}
        				},
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
        			},{
        				name:"chargeTime",
        				label:"收费日期",
        				type:"date",
						mode:"Y-m-d",
						defaultValue:moment().valueOf(),
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
        			},{
        				name:"chargeMode",
        				label:"收费方式",
        				type:"select",
        				options:[{
        					key:"Transfer",
        					value:"转账"
        				},{
        					key:"Cash",
            				value:"现金"
        				},{
        					key:"CreditCard",
            				value:"刷卡"
        				},{
        					key:"Deposit",
        					value:"订金"
        				}],
        				defaultValue:"CreditCard",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				validate:["required"]
        			},{
        				name:"realFees",
        				label:"本次收费金额",
        				defaultValue:0,
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				validate:["required"]
        			},{
        				name:"isDeposit",
        				label:"是否支付预约金",
        				type:"checklist",
        				list:[{
        					key:true,
        					value:"已支付"
        				}],
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"deposit",
        				label:"选择预约金条目",
        				key:"pkDeposit",
        				type:"select",
        				url:"api/deposit/querynotrefund",
        				params:function(){
        					return{
            					"chargeStatus":"Receiving",
            					fetchProperties:"pkDeposit,phoneNumber,name,realDeposit"
        					};
        				},
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				value:"phoneNumber,name"
        			},{
        				name:"realDeposit",
        				label:"预约金金额",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				readonly:true
        			},{
        				name:"dchargeStatus",
        				label:"收费状态",
        				type:"select",
        				options:[{
        					key:"UnCharge",
        					value:"未收费"
        				},{
        					key:"Charged",
            				value:"已收费"
        				}],
        				defaultValue:"Charged",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				validate:["required"]
        			},{
        				name:"operator",
        				label:"经手人",
        				key:"pkUser",
        				type:"select",
        				url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
        				value:"name",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				validate:["required"]	
        			}],
        		}
        		
        	})
        	this.set("payForm",payForm);
        },
        setTitle:function(fees,datas){
        	var payGrid=this.get("payGrid");
        	var form=this.get("form");
        	var count=0;
			for(var  i in datas){
				if(datas[i]){
					if(datas[i].chargeStatus.key!="UnCharge")
						count += Number(datas[i].realFees);
				}
			}
			fees=Number(fees);
			payGrid.setTitle("应收卡费："+fees.toFixed(2)+"/已收卡费："+count.toFixed(2));
			var status = "";
			if(count == 0){
				status= "未收费";
			}else if(count < fees){
				status= "收费中";
			}else if(count == fees){
				status= "已缴清";
			}
			form.setValue("mchargeStatus",status);
        },
		afterInitComponent:function(params,widget){
			if(!params){
				widget.get("grid").refresh();
			}
			if(params&&params.pkMembershipContractFees){
				widget.get("grid").refresh({
					pkMembershipContractFees:params.pkMembershipContractFees,
				});
			}
			if(params&&params.father=="membershipcontractfeessummary"){
				widget.get("grid").refresh({
					"memberShipContract.signDate":params.start,
					"memberShipContract.signDateEnd":params.end,
					"chargeStatusIn":"Charging,Payup",
				})
			}
		}
	})  
	module.exports = membershipcontractfeespayment;	
});