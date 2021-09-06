define(function(require,exports,module){
	var Subnav=require("subnav-1.0.0");
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	var week=["日","一","二","三","四","五","六"];
	var store=require("store");
	var aw=require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var Summary_subnav={
		init:function(params,widget){
			return new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"代购物汇总处理",
					buttonGroup:[{
						id:"billcode",
						key:"pkGenerationShoppingApplicationSummary",
						value:"billcode",
						url:"api/generationshoppingapplicationsummary/query",
						lazy:true,
						handler:function(key,el){
							if(key){
								widget.get("grid").refresh({
									summary:key,
									fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description"
								});
								widget.get("subnav").show(["showUnSummary","secretaryArrange"]);
							}else{
								widget.get("grid").refresh(null,function(data){
									widget.set("commit_application",data);
								});
								widget.get("subnav").hide(["showUnSummary","secretaryArrange"]);
							}
						}
					}],
					buttons:[{
						id:"showUnSummary",
						text:"显示未汇总",
						show:false,
						handler:function(){
							widget.get("grid").refresh({summary:widget.get("subnav").getValue("billcode"),
								fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description"
							},function(data){
//								var cache=widget.get("commit_application");
								var billdata =data ;
								aw.ajax({
									url:"api/generationshoppingapplication/query",
									data:{
										flowStatus:"Commited",
										fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description"
												
									},
									dataType:"json",
									success:function(data){
										data=data.concat(billdata);
										widget.get("grid").setData(data);
									}
									
								})
								
							});
						}
					},{
						id:"commit",
						text:"汇总",
						handler:function(){
							var subnav=widget.get("subnav");
							var pkSummary=subnav.getValue("billcode");
							var selectDatas=widget.get("grid").getSelectedData();
							if(selectDatas.length==0){
								//新汇总时，必须要选择申请单
								Dialog.alert({
									content:"请选择要汇总的申请单"
								});
								return false;
							}
							aw.ajax({
								url:"api/generationshoppingapplicationsummary/query",
								data:{
									summaryDate:moment().startOf("days").valueOf(),
									summaryDateEnd:moment().endOf("days").valueOf(),
									flowStatusIn:"Summed,Bought",
									fetchProperties:"pkGenerationShoppingApplicationSummary"
									},
								dataType:"json",
								success:function(data){
									if(!pkSummary && data.length>0){
										Dialog.alert({
											content:"当天已存在汇总单，请补充！"
										});
										return false;
									}else{
										Dialog.showComponent({
											title:"请输入购物日期",
											setStyle:function(){},
											confirm:function(){
															var pks="";
															for(var i=0;i<selectDatas.length;i++){
																pks+= selectDatas[i].pkGenerationShoppingApplication+",";
															}
															//创建汇总单
															aw.ajax({
																url:"api/generationshoppingapplicationsummary/createsummary",
																data:{
																	pkGenerationShoppingApplicationSummary:pkSummary,
																	pks:pks.substring(0, pks.length-1),
																	shoppingDate:$("#shoppingDate .J-form-shoppingDate-date-shoppingDate").val(),
																	fetchProperties:"pkGenerationShoppingApplicationSummary,billcode,apps,shoppingDate,purchaser,principal,flowStatus"
																},
																dataType:"json",
																success:function(data){
																	//重新设置缓存
																	var cacheData=widget.get("commit_application") || [];
																	var temp={};
																	for(var k=0;k<cacheData.length;k++){
																		temp[cacheData[k].pkGenerationShoppingApplication]=cacheData[k];
																	}
																	for(var j=0;j<selectDatas.length;j++){
																		if(selectDatas[j].flowStatus == "Commited"){
																			delete temp[selectDatas[j].pkGenerationShoppingApplication];
																		}
																	}
																	cacheData=[];
																	for(var m in temp){
																		cacheData.push(temp[m]);
																	}
																	widget.set("commit_application",cacheData);
																	//回写单号，负责人，秘书到列表头
																	Dialog.alert({
																		content:"提交成功。请安排责任秘书"
																	});
																	subnav.show(["secretaryArrange","showUnSummary"]);
																	//回写subnav的汇总单下拉框
																	var billcode=subnav.getValue("billcode");
																	if(!billcode){
																		//只有当下拉框选择的是新汇总的时候，才会重新设置下拉框
																		var olds=subnav.getData("billcode")||[];
																		olds.push(data);
																		subnav.setData("billcode",olds);
																		subnav.setValue("billcode",data.pkGenerationShoppingApplicationSummary);
																	}
																	widget.get("grid").refresh({
																		summary:subnav.getValue("billcode"),
																		fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description"
																	});
																}
															});
														}
										},new Form({
											model:{
												id:"shoppingDate",
												items:[{
													name:"shoppingDate",
													label:"购物日期",
													type:"date"
												}],
												defaultButton:false
											}
										}));
									}
								}	
							})
						
						}
					},{
						id:"secretaryArrange",
						text:"责任秘书",
						show:false,
						handler:function(){
							var subnav=widget.get("subnav");
							if(subnav.getValue("billcode")){
								aw.ajax({
									url:"api/generationshoppingapplicationsummary/query",
									type : "POST",
									data:{
										pkGenerationShoppingApplicationSummary:subnav.getValue("billcode"),
										fetchProperties:"pkGenerationShoppingApplicationSummary,billcode,shoppingDate,principal.name,purchaser.name,apps.money"
									},
									dataType:"json",
									success:function(data){
										widget.get("form").reset();
										if(data.length != 0){
											widget._setCurrentPrincipal(data[0].purchaser);
											//如果这次代买药秘书已经安排过了，就直接将值赋给下拉框
											var currentData={
												"pkGenerationShoppingApplicationSummary":data[0].pkGenerationShoppingApplicationSummary,
												"purchaser":data[0].purchaser,
												"principal":data[0].principal
											};
											widget.get("form").setData(currentData);
											
											widget.show(".J-form").hide(".J-grid");
											widget.get("subnav").show(["return"]).hide(["print","secretaryArrange","billcode","commit","showUnSummary"]);
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
							var title=date.format("YYYY-MM-DD");
							title+="（星期"+week[date.days()]+"）"+i18ns.get("sale_ship_owner","会员")+"代购";
							//$(".J-name").text(store.get("user").name);
							//$(".J-printtime").text(date.format("YYYY-MM-DD HH:mm:ss"));
							var data=widget.get("grid").getData();
							var totalNum=0;
							for(var i=0;i<data.length;i++){
								var items=data[i].shoppinglists || [];
								totalNum+=items.length;
							}
							var subtitle = "共"+data.length+"位"+i18ns.get("sale_ship_owner","会员")+"，"+totalNum+"行物品";
							var subnav=widget.get("subnav");
							if(subnav.getValue("billcode")){
								var summary = subnav.getValue("billcode");
								window.open("assets/eling/elcms/life/generationshopping/summary/assets/summaryprint.html?summary="+summary+"&title="+title+"&subtitle="+subtitle);
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
							widget.hide(".J-form").show(".J-grid");
							widget.get("subnav").hide(["return"]).show(["print","secretaryArrange","billcode","commit","showUnSummary"]);
						}
					}]
				}
			});
		}
	};
	
	module.exports=Summary_subnav;
});