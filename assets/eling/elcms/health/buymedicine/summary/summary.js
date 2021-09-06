define(function(require,exports,module){
	var ELView=require("elview");
	var template=require("./summary.tpl");
	
	var Subnav=require("subnav-1.0.0");
	var MainGrid=require("./summary_main_grid");
	var PrintGrid=require("./summary_print_grid");
	var TransferGrid=require("./summary_transfer_grid");
	var SecretaryForm=require("./summary_secretary_form");
	var TransactionForm=require("./summary_transaction_form");
	var RollbackForm=require("./summary_rollback_form");
	//多语
	var i18ns = require("i18n");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var week=["日","一","二","三","四","五","六"];
	var store=require("store");
	
	require("./summary.css");
	
	var Summary=ELView.extend({
		attrs:{
			template:template
		},
		events:{
			"click .J-transaction":function(e){
				var grid=this.get("transferGrid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var data_prev=grid.getSelectedData(parseInt(index)-1) || {};
				var data_next=grid.getSelectedData(parseInt(index)+1) || {};
				this.get("transactionForm").setData({
					pkBuyMedicineTransferLog:data.pkBuyMedicineTransferLog,
					pkBuyMedicineTransferLog_prev:data_prev.pkBuyMedicineTransferLog,
					pkBuyMedicineTransferLog_next:data_next.pkBuyMedicineTransferLog,
					description:data.summary.description
				});
				this.hide([".J-transferGrid"]).show([".J-transactionForm"]);
				this.set("status","transaction");
			},
			"click .J-rollback":function(e){
				var grid=this.get("transferGrid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var data_prev=grid.getSelectedData(parseInt(index)-1) || {};
				var data_next=grid.getSelectedData(parseInt(index)+1) || {};
				this.get("rollbackForm").setData({
					pkBuyMedicineTransferLog:data.pkBuyMedicineTransferLog,
					pkBuyMedicineTransferLog_prev:data_prev.pkBuyMedicineTransferLog,
					pkBuyMedicineTransferLog_next:data_next.pkBuyMedicineTransferLog,
					returnPerson:data.buyMedicineflowdefine.returnPerson.name
				});
				this.hide([".J-transferGrid"]).show([".J-rollbackForm"]);
				this.set("status","rollback");
			},
			"change .J-form-buymedicineapplicationsummary-select-purchaser":function(a){
				this._setCurrentPrincipal();
			}
		},
		_setCurrentPrincipal:function(pkParams){
			//1.获取第一个下拉框的值
			var pks=pkParams || this.get("secretaryForm").getValue(1);
			//2.循环拼接字符串，不管是否有值，都要有请选择
			var current=[];
			for(var i=0;i<pks.length;i++){
				current.push(this.get("secretaryForm").getData(1,{
					pk:pks[i].pkUser || pks[i]
				}));
			}
			//3.渲染
			this.get("secretaryForm").load(2,{
				options:current
			});
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"代配药汇总处理",
					buttonGroup:[{
						id:"billcode",
						key:"pkBuyMedicineApplicationSummary",
						value:"summaryDate",
						url:"api/buymedicineapplicationsummary/query",
						fetchProperties:"pkBuyMedicineApplicationSummary,purchaseDate",
						lazy:true,
						handler:function(key,el){
							if(key){
								widget.get("grid").refresh({
									summary:key,
									fetchProperties:"*,buyMedicinePapers.papertype.name," +
										"member.personalInfo.name," +
										"member.memberSigning.room.number," +
										"items.medicine.name,items.medicine.generalName," +
										"items.medicine.specification," +
										"items.quantity"
								});
								widget.get("subnav").show(["showUnSummary"]);
							}else{
								widget.get("grid").refresh(null,function(data){
									widget.set("commit_application",data);
								});
								widget.get("subnav").hide(["showUnSummary"]);
							}
						}
					}],
					buttons:[{
						id:"showUnSummary",
						text:"显示未汇总",
						show:false,
						handler:function(){
							widget.get("grid").refresh({summary:widget.get("subnav").getValue("billcode"),
								fetchProperties:"*,buyMedicinePapers.papertype.name," +
								"member.personalInfo.name," +
								"member.memberSigning.room.number," +
								"items.medicine.name,items.medicine.generalName," +
								"items.medicine.specification," +
								"items.quantity",
							},function(data){
								var billdata=data;
								var cache=widget.get("commit_application");
								data=cache.concat(billdata);
								widget.get("grid").setData(data);
							});
						}
					},{
						id:"commit",
						text:"汇总",
						handler:function(){
							var subnav=widget.get("subnav");
							var pkSummary=subnav.getValue("billcode");
							var selectDatas=widget.get("grid").getSelectedData();
							if(!pkSummary && selectDatas.length==0){
								//新汇总时，必须要选择申请单
								Dialog.alert({
									content:"请选择要汇总的申请单"
								});
								return false;
							}
							//查询当天有没有没有关闭的汇总单 
							aw.ajax({
								url:"api/buymedicineapplicationsummary/query",
								data:{
									summaryDate:moment().startOf("days").valueOf(),
									summaryDateEnd:moment().endOf("days").valueOf(),
									flowStatusIn:"Summed,Bought",
									fetchProperties:"pkBuyMedicineApplicationSummary"
									},
								dataType:"json",
								success:function(data){
									if(!pkSummary && data.length>0){
										Dialog.alert({
											content:"当天已存在汇总单，请补充！"
										});
										return false;
									}else{
										var pks="";
										for(var i=0;i<selectDatas.length;i++){
											pks+= selectDatas[i].pkBuyMedicineApplication+",";
										}
										aw.ajax({
											url:"api/buymedicineapplicationsummary/createsummary",
											data:{
												pkBuyMedicineApplicationSummary:pkSummary,
												pks:pks.substring(0, pks.length-1)
											},
											dataType:"json",
											success:function(data){
												//重新设置缓存
												var cacheData=widget.get("commit_application") || [];
												var temp={};
												for(var k=0;k<cacheData.length;k++){
													temp[cacheData[k].pkBuyMedicineApplication]=cacheData[k];
												}
												for(var j=0;j<selectDatas.length;j++){
													if(selectDatas[j].flowStatus.key == "Commited"){
														delete temp[selectDatas[j].pkBuyMedicineApplication];
													}
												}
												cacheData=[];
												for(var m in temp){
													cacheData.push(temp[m]);
												}
												widget.set("commit_application",cacheData);
												//回写单号，负责人，秘书到列表头
												Dialog.alert({
													content:"提交成功。请进行交接和安排责任秘书"
												});
												subnav.show(["transfer","secretaryArrange","showUnSummary"]);
												//回写subnav的汇总单下拉框
												var billcode=subnav.getValue("billcode");
												if(!billcode){
													//只有当下拉框选择的是新汇总的时候，才会重新设置下拉框
													var olds=subnav.getData("billcode")||[];
													data.summaryDate=moment(data.summaryDate).format("YYYYMMDDHHmm");
													olds.push(data);
													subnav.setData("billcode",olds);
													subnav.setValue("billcode",data.pkBuyMedicineApplicationSummary);
												}
												widget.get("grid").refresh({
													summary:data.pkBuyMedicineApplicationSummary,
													fetchProperties:"*,buyMedicinePapers.papertype.name," +
														"member.personalInfo.name," +
														"member.memberSigning.room.number," +
														"items.medicine.name,items.medicine.generalName," +
														"items.medicine.specification," +
														"items.quantity"
												});
											}
										});
									}
								}
								
							});
						}
					},{
						id:"transfer",
						text:"交接",
						handler:function(){
							var subnav=widget.get("subnav");
							if(subnav.getValue("billcode")){
								widget.set("status","transfer");
								widget.get("transferGrid").refresh();
								widget.show([".J-transferGrid"]).hide([".J-grid"]);
								subnav.show(["return"]).hide(["billcode","commit","transfer","secretaryArrange","print","showUnSummary"]);
							}else{
								Dialog.alert({
									content:"请选择一张汇总单进行交接"
								});
							}
						}
					},{
						id:"secretaryArrange",
						text:"责任秘书",
						handler:function(){
							var subnav=widget.get("subnav");
							if(subnav.getValue("billcode")){
								widget.set("status","secretaryArrange");
								aw.ajax({
									url:"api/buymedicineapplicationsummary/query",
									data:{
										pkBuyMedicineApplicationSummary:subnav.getValue("billcode"),
										fetchProperties:"purchaser.pkUser,principal.pkUser,pkBuyMedicineApplicationSummary,billcode,summaryDate,purchaseDate,flowStatus,description,purchaser.name,principal.name",
									},
									success:function(data){
										widget.get("secretaryForm").reset();
										if(data.length != 0){
											widget._setCurrentPrincipal(data[0].purchaser);
											//如果这次代买药秘书已经安排过了，就直接将值赋给下拉框
											var currentData={
												"pkBuyMedicineApplicationSummary":data[0].pkBuyMedicineApplicationSummary,
												"purchaser":data[0].purchaser,
												"principal":data[0].principal
											};
											widget.get("secretaryForm").setData(currentData);
											//更换到责任秘书的Form
											widget.show([".J-secretaryForm"]).hide([".J-grid"]);
											subnav.show(["return"]).hide(["billcode","commit","transfer","secretaryArrange","print","showUnSummary"]);
										}
									}
								});
							}else{
								Dialog.alert({
									content:"请选择一张汇总单安排责任秘书"
								});
							}
						}
					},{
						id:"print",
						text:"打印",
						handler:function(){
							var date=moment();
							var title=date.format("YYYY.MM.DD");
							title+="（星期"+week[date.days()]+"）"+i18ns.get("sale_ship_owner","会员")+"代配药";
							//$(".J-name").text(store.get("user").name);
							//$(".J-printtime").text(date.format("YYYY-MM-DD HH:mm:ss"));
							var data=widget.get("grid").getData();
							var totalNum=0;
							for(var i=0;i<data.length;i++){
								var items=data[i].items || [];
								totalNum+=items.length;
							}
							var subtitle = "共"+data.length+"位"+i18ns.get("sale_ship_owner","会员")+"，"+totalNum+"行物品";
							var subnav=widget.get("subnav");
							if(subnav.getValue("billcode")){
								var summary = subnav.getValue("billcode");
								window.open("assets/eling/elcms/health/buymedicine/summary/summaryprint.html?summary="+summary+"&title="+title+"&subtitle="+subtitle);
							}else{
								Dialog.alert({
									content:"请选择一个汇总单"
								});
							}
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							if(widget.get("status") == "transfer"){
								widget.hide([".J-transferGrid"]).show([".J-grid"]);
								widget.get("subnav").hide(["return"]).show(["billcode","commit","transfer","secretaryArrange","print"]);
								widget.set("status","");
							}else if(widget.get("status") == "transaction"){
								widget.show([".J-transferGrid"]).hide([".J-transactionForm"]);
								widget.set("status","transfer");
							}else if(widget.get("status") == "rollback"){
								widget.show([".J-transferGrid"]).hide([".J-rollbackForm"]);
								widget.set("status","transfer");
							}else if(widget.get("status") == "secretaryArrange"){
								widget.hide([".J-secretaryForm"]).show([".J-grid"]);
								widget.get("subnav").hide(["return"]).show(["billcode","commit","transfer","secretaryArrange","print"]);
								widget.set("status","");
							}
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=MainGrid.initComponent(this);
			this.set("grid",grid);
			//打印grid
			var printGrid=PrintGrid.initComponent(this);
			this.set("printGrid",printGrid);
			//交接grid
			var transferGrid=TransferGrid.initComponent(this);
			this.set("transferGrid",transferGrid);
			//责任秘书form
			var secretaryForm=SecretaryForm.initComponent(this);
			this.set("secretaryForm",secretaryForm);
			//交接里的办理操作
			var transactionForm=TransactionForm.initComponent(this);
			this.set("transactionForm",transactionForm);
			//交接里的回退操作
			var rollbackForm=RollbackForm.initComponent(this);
			this.set("rollbackForm",rollbackForm);
		},
		afterInitComponent:function(params,widget){
			var subnav=widget.get("subnav");
			subnav.load({
				id:"billcode",
				params:{
					"orderString":"purchaseDate:desc",
//					"purchaseDate":moment().valueOf(),
//					"purchaseDateEnd":moment().subtract(1,"months").valueOf(),
					flowStatusIn:"Summed,Bought",
					fetchProperties:"pkBuyMedicineApplicationSummary,purchaseDate,summaryDate",
				},
				callback:function(data){
					if(data && data.length!=0){
						for(var i=0;i<data.length;i++){
							data[i].summaryDate=moment(data[i].summaryDate).format("YYYYMMDDHHmm");
						}
					}
					data=[{pkBuyMedicineApplicationSummary:"",summaryDate:"新汇总"}].concat(data);
					subnav.setData("billcode",data);
					
					widget.get("grid").refresh(null,function(data){
						//要缓存第一次查询回来的数据，第一次是所有已提交的数据，以后每次切换billcode下拉框，都要先查询，再加上缓存的数据
						widget.set("commit_application",data);
					});
				}
			});
		}
	});
	
	module.exports=Summary;
});
