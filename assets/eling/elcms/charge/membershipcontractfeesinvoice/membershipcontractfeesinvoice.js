/**
 * 会籍开票单
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
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+ 
		"<div class='J-form hidden'></div>" +
		"<div class='J-payGrid hidden'></div>"+
		"<div class='J-payForm hidden'></div>";
	var membershipcontractfeespayment = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			
        			title:  i18ns.get("charge_shipfees_invoicetitle","卡费开票"),
        			
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/membershipcontractfees/search",
							data:{
								s:str,
								"chargeStatus":"Payup",
								properties:"memberShipContract.membershipCard.name,"+
						        "memberShipContract.room.number,"+
						        "memberShipContract.personalCardowners.personalInfo.name," +
						        "memberShipContract.membershipCard.cardType.name",
								fetchProperties:"*," +
								"memberShipContract.pkMemberShipContract," +
								"memberShipContract.membershipCard.cardType.name,"+
								"memberShipContract.status," +
								"memberShipContract.checkInType," +
								"memberShipContract.signDate," +
								"memberShipContract.personalCardowners.personalInfo.name," +
								"memberShipContract.membershipCard.cardType.name,"+
								"memberShipContract.membershipCard.name," +
								"memberShipContract.memberShipFees," +
								"memberShipContract.room.number," +
								"invoicedetails.pkMemberShipContractInvoiceDetail," +
								"invoicedetails.invoiceStatus," +
								"invoicedetails.version," +
								"invoicedetails.invoiceFees," +
								"invoicedetails.invoicer.pkUser," +
								"invoicedetails.invoicer.name," +
								"invoicedetails.invoiceTime" 
								,
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
							widget.get("subnav").show(["building","invoiceStatusIn","status","time"]).hide(["return"]);
						}
        			}],
        			
        			buttonGroup:[
        			{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
         				   id:"invoiceStatusIn",
         				   tip:"开票状态",
         				   items:[{
        					   key:"UnInvoiced,Invoicing",
        					   value:"未开票",
        				   },{
        					   key:"Invoiced",
        					   value:"已开票" 
        				   },{
        					   key:"UnInvoiced,Invoicing,Invoiced",
        					   value:"全部" 
        				   }],
        				   handler:function(key,element){
    							 widget.get("grid").refresh();
        				   }
        			   },{
         				   id:"status",
         				   tip:  i18ns.get("sale_ship_status","会籍状态"),
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
        				   tip:"签约时间",
        				   click:function(time){
        					   widget.get("grid").refresh();
        				   },
        			   }
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-grid",
            	autoRender:false,
				url:"api/membershipcontractfees/query",
				params:function(){
					return {
					"chargeStatus":"Payup",
					"invoiceStatusIn":widget.get("subnav").getValue("invoiceStatusIn"),
					"memberShipContract.status":widget.get("subnav").getValue("status"),
					"memberShipContract.room.building":widget.get("subnav").getValue("building"),
					"memberShipContract.signDate":widget.get("subnav").getValue("time").start,
					"memberShipContract.signDateEnd":widget.get("subnav").getValue("time").end,
					fetchProperties:"*," +
					"memberShipContract.pkMemberShipContract," +
					"memberShipContract.personalCardowners.personalInfo.name," +
					"memberShipContract.membershipCard.cardType.name,"+
					"memberShipContract.membershipCard.name," +
					"memberShipContract.memberShipFees," +
					"memberShipContract.status," +
					"memberShipContract.checkInType," +
					"memberShipContract.signDate," +
					"memberShipContract.room.number," +
					"invoicedetails.pkMemberShipContractInvoiceDetail," +
					"invoicedetails.invoiceStatus," +
					"invoicedetails.version," +
					"invoicedetails.invoiceFees," +
					"invoicedetails.invoicer.pkUser," +
					"invoicedetails.invoicer.name," +
					"invoicedetails.invoiceTime" 
					};
				},
				model:{
					columns:[{
						key:"memberShipContract.membershipCard.name",
						name:  i18ns.get("sale_card_name","会籍卡号"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.show([".J-form",".J-payGrid"]).hide([".J-grid",".J-payForm"]);
								widget.get("subnav").hide(["building","invoiceStatusIn","status","time"]).show(["return"]);
								var form = widget.get("form");
								var payGrid = widget.get("payGrid");
								var payForm = widget.get("payForm");
								var names= "";
								if(data.memberShipContract.personalCardowners.length>0){
									for(var i =0 ;i<data.memberShipContract.personalCardowners.length;i++){
//										names+=data.memberShipContract.personalCardowners[i].personalInfo.name+"、";
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
								//TODO
								form.setValue("room",data.memberShipContract.room?data.memberShipContract.room.number:"");
								var datas=data.invoicedetails;
								payGrid.setData(datas);
								widget.setTitle(data.memberShipContract.memberShipFees,datas);
								$(".J-edit").addClass("hidden");
								$(".J-delete").addClass("hidden");
								$(".J-grid-head-add").addClass("hidden");
							}
						}]
					},{
						key:"memberShipContract.membershipCard.cardType.name",
						name:   i18ns.get("sale_card_type","卡类型"),
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
						key:"memberShipContract.room.number",
						name:"房间号"
					},{
						key:"memberShipContract.memberShipFees",
						name:  i18ns.get("charge_shipfees_confees","会籍卡费"),
						className:"text-right",
						format:"thousands"
					},{
						key:"invoicedetails.invoiceFees",
						name: i18ns.get("charge_shipfees_invoicedfees","已开票卡费"),
						className:"text-right",
						format:function(value,row){
							var count=0;
							var datas =row.invoicedetails;
							for(var  i in datas){
								if(datas[i]){
									if(datas[i].invoiceStatus.key!="UnInvoiced")
										count += datas[i].invoiceFees;
								}
							}
							count=Number(count).toFixed(2)+"";
							return count.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
						}
					},{
						key:"feesstatus",
						name:"是否开完",
						format:function(value,row){
							var name= "";
							if(row.invoiceStatus.key=="Invoiced"){
								name = "是";
							}else{
								name = "否";
							}
							return name;
						}
					},{
						key:"memberShipContract.status.value",
						name:  i18ns.get("sale_ship_status","会籍卡状态"),
					},{
						key:"money",
						name : "开票",
						format:function(value,row){
							if(row.invoiceStatus.key=="Invoiced"){
								return "已开完";
							}else{
								return "button";
							}
							return name;
						},
						formatparams:[{
							key:"edit",
							text:"开票",
							handler:function(index,data,rowEle){
								widget.show([".J-form",".J-payGrid"]).hide([".J-grid",".J-payForm"]);
								widget.get("subnav").hide(["building","invoiceStatusIn","status","time","search"]).show(["return"]);
								var form = widget.get("form");
								var payGrid = widget.get("payGrid");
								var payForm = widget.get("payForm");
								var names= "";
								if(data.memberShipContract.personalCardowners.length>0){
									for(var i =0 ;i<data.memberShipContract.personalCardowners.length;i++){
										names+=data.memberShipContract.personalCardowners[i].personalInfo.name+"、";
									}
								}else{
									names="无";
								}
								data.names = names;
								form.reset();
								form.setData(data);
								form.setValue("room",data.memberShipContract.room?data.memberShipContract.room.number:"");
								var datas=data.invoicedetails;
								payGrid.setData(datas);
								widget.setTitle(data.memberShipContract.memberShipFees,datas);
							}
						}]
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
        				name:"version",
        				type:"hidden"
        			},{
        				name:"memberShipContract.memberShipFees",
        				type:"hidden"
        			},{
        				name:"memberShipContract.pkMembershipContract",
        				type:"hidden"
        			},{
        				name:"memberShipContract.membershipCard.name",
        				label:i18ns.get("sale_card_name","会籍卡"),
        				className:{
							container:"col-md-6",
							label:"col-md-4",
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
        				name:"invoiceStatus.value",
        				label:"开票状态",
        				className:{
							container:"col-md-6",
							label:"col-md-1",
							valueContainer:"col-md-5"
						},
        				readonly:true
        			}]
        		}
        	});
        	this.set("form",form);
        	
        	var payGrid = new Grid({
        		parentNode:".J-payGrid",
        		url:"api/membershipcontractinvoicedetail/query",
        		autoRender:false,
        		params:function(){
        			return{
        				"memberShipContractFees":widget.get("form").getValue("pkMembershipContractFees"),
        				fetchProperties:"pkMemberShipContractInvoiceDetail" +
        						",invoiceStatus" +
        						",invoiceFees" +
        						",invoiceTime"+
        						",invoicer.pkUser" +
        						",invoicer.name" +
        						",version" 
        						 ,
        			}
        		},
        		model:{
        			head:{
						title:"", 
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								var form = widget.get("form");
								var payGrid = widget.get("payGrid");
								var count=0;
								var datas =  payGrid.getData();
								for(var  i in datas){
									if(datas[i]){
										if(datas[i].invoiceStatus.key!="UnInvoiced")
											count += Number(datas[i].invoiceFees);
									}
								}
								var all= form.getValue("memberShipContract.memberShipFees")
								if(Number(all)==Number(count)){
									Dialog.alert({
		    							content:"该收费单开票金额已满！"
		    						});
		            				return;
								}
								widget.hide(".J-payGrid").show(".J-payForm");
								widget.get("payForm").reset();
								payForm.setValue("invoiceFees",Number(all)-Number(count));
								//当前用户是管理员时，让operator可用
								var userSelect=payForm.getData("invoicer",{});
								var flag = false;
								for(var  i =  0 ; i<userSelect.length;i++ ){
									if(userSelect[i].pkUser == activeUser.pkUser){
										flag= true;
										break;
									}
								}
								if(flag){
									payForm.setValue("invoicer",activeUser.pkUser);
									
								}
								widget.get("payForm").setAttribute("invoiceStatus","readonly","readonly");
							}
						}]
					},
					columns:[{
						key:"invoiceTime",
						name:"开票时间",
						className:"text-center",
						format:"date"
					},{
						key:"invoiceFees",
						name:"开票金额",
						className:"text-right",
						format:"thousands"
					},{
						key:"invoiceStatus.value",
						name:"开票状态",
						className:"text-center",
					},{
						key:"invoicer.name",
						name:"开票人",
						className:"text-center",
					},{
						key:"operate",
						name:"操作",
						className:"text-center",
						format:"button",
						formatparams:[{
							key:"edit",	
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.hide(".J-payGrid").show(".J-payForm");
								var payForm = widget.get("payForm");
								payForm.reset();
								payForm.setData(data);
							}
						},{
							key:"delete",	
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/membershipcontractinvoicedetail/"+data.pkMemberShipContractInvoiceDetail+"/delete"
										,function(data){
											 widget.get("payGrid").refresh(null ,function(){
												 var payGrid = widget.get("payGrid");
												 var datas =payGrid.getData();
												 payGrid.setData(datas);
												 widget.setTitle(widget.get("form").getValue("memberShipContract.memberShipFees"),datas);
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
					var data =payForm.getData() ;
					var datas =  payGrid.getData();
		        	var count=0;
					for(var  i in datas){
						if(datas[i]){
							if(datas[i].invoiceStatus.key!="UnInvoiced")
								if(i == data.gridindex){
									continue;
								}else{
									count += Number(datas[i].invoiceFees);
								}
						}
					}
					count  += Number(data.invoiceFees);
					var all= widget.get("form").get("memberShipContract.memberShipFees")
					if(count > all){
						Dialog.alert({
							content:"输入金额有误请重新输入！"
						});
        				return;
					}
					data.memberShipContractFees=widget.get("form").getValue("pkMembershipContractFees");
					aw.saveOrUpdate("api/membershipcontractinvoicedetail/saveInFees"
							,aw.customParam(data)
							,function(data){
								payGrid.refresh(null,function(){
									var datas =  payGrid.getData();
									payGrid.setData(datas);
									widget.setTitle(widget.get("form").getValue("memberShipContract.memberShipFees"),datas);
									widget.show(".J-payGrid").hide(".J-payForm");
								});
								widget.get("grid").refresh();
					});
        		},
        		cancelaction:function(){
					widget.show(".J-payGrid").hide(".J-payForm");
				},
        		model:{
        			id:"membershipcontractfeesdetialsForm",
        			items:[
        			{
        				name:"pkMemberShipContractInvoiceDetail",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"gridindex",
						type:"hidden"
                    },{
        				name:"invoiceFees",
        				label:"开票金额",
        				defaultValue:0,
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				validate:["required"]
        			},{
        				name:"invoiceStatus",
        				label:"开票状态",
        				type:"select",
        				options:[{
        					key:"UnInvoiced",
        					value:"未开票"
        				},{
        					key:"Invoiced",
            				value:"已开票"
        				}],
        				defaultValue:"Invoiced",
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
        				validate:["required"]
        			},{
        				name:"invoiceTime",
        				label:"开票日期",
        				type:"date",
						mode:"Y-m-d",
						defaultValue:moment().valueOf(),
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
        			},{
        				name:"invoicer",
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
        	var form =this.get("form");
        	var count=0;
			for(var  i in datas){
				if(datas[i]){
					if(datas[i].invoiceStatus.key!="UnInvoiced")
						count += Number(datas[i].invoiceFees);
				}
			}
			fees=Number(fees);
			payGrid.setTitle("应收"+i18ns.get("charge_shipfees_money","卡费")+"："+fees.toFixed(2)+"/已开票"+i18ns.get("charge_shipfees_money","卡费")+"："+count.toFixed(2));
			var status = "";
			if(count == 0){
				status= "未开票";
			}else if(count < fees){
				status= "开票中";
			}else if(count == fees){
				status= "已开完";
			}
			form.setValue("invoiceStatus.value",status);
        },
        afterInitComponent:function(params,widget){
        	if(params && params.father == "membershipcontractfeessummary"){
				widget.get("grid").refresh({
					"invoiceTime":params.start,
					"invoiceTimeEnd":params.end,
					"invoiceStatus":"Invoiced",
					fetchProperties:"*," +
					"memberShipContract.pkMemberShipContract," +
					"memberShipContract.personalCardowners.personalInfo.name," +
					"memberShipContract.membershipCard.cardType.name,"+
					"memberShipContract.membershipCard.name," +
					"memberShipContract.memberShipFees," +
					"memberShipContract.status," +
					"memberShipContract.checkInType," +
					"memberShipContract.signDate," +
					"memberShipContract.room.number," +
					"invoicedetails.pkMemberShipContractInvoiceDetail," +
					"invoicedetails.invoiceStatus," +
					"invoicedetails.version," +
					"invoicedetails.invoiceFees," +
					"invoicedetails.invoicer.pkUser," +
					"invoicedetails.invoicer.name," +
					"invoicedetails.invoiceTime" 
				});
			}else if(params && params.pkMembershipContractFees){
        		widget.get("grid").refresh({
        			pkMembershipContractFees : params.pkMembershipContractFees,
					fetchProperties:"*," +
					"memberShipContract.pkMemberShipContract," +
					"memberShipContract.personalCardowners.personalInfo.name," +
					"memberShipContract.membershipCard.cardType.name,"+
					"memberShipContract.membershipCard.name," +
					"memberShipContract.memberShipFees," +
					"memberShipContract.status," +
					"memberShipContract.checkInType," +
					"memberShipContract.signDate," +
					"memberShipContract.room.number," +
					"invoicedetails.pkMemberShipContractInvoiceDetail," +
					"invoicedetails.invoiceStatus," +
					"invoicedetails.version," +
					"invoicedetails.invoiceFees," +
					"invoicedetails.invoicer.pkUser," +
					"invoicedetails.invoicer.name," +
					"invoicedetails.invoiceTime" 
				});
        	}else{
        		widget.get("grid").refresh();
        	}
        	
        }
	})  
	module.exports = membershipcontractfeespayment;	
});
