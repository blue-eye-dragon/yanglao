/**
 * 商品/服务明细
 */
define(function(require, exports, module) {
	var BaseView = require("baseview");
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");

	var waresdetail = BaseView
			.extend({ 
				events : {
					"change .J-waresClass" : function(e) {
						var card = this.get("card");
						var pk = card.getValue("waresClass");
						var dataType = this.get("card").getData("waresClass", {
							pk : pk
						});
						card.setData(dataType);
						if(pk==null||pk==""){
							card.setData(dataType);
							card.setValue("description", "");
							card.setValue("maxFees", "");
							card.setValue("minFees", "");
							card.setValue("name", "");
							card.setValue("currency", "RMB");
						}else{
							card.setData(dataType);
							card.setValue("waresClass",dataType.pkWaresClass);
//							card.setValue("description", "");
							card.setValue("code",dataType.code+"-");
//							card.setValue("maxFees", "");
//							card.setValue("minFees", "");
							card.setValue("name", "");
							card.setValue("currency", "RMB");
						}
						if(dataType.ifCharge=="true"){
							card.removeAttribute("maxFees","readonly");
							card.removeAttribute("minFees","readonly");
							card.removeAttribute("price","readonly");
						}else{
							card.setAttribute("maxFees", "readonly","readonly");
							card.setAttribute("minFees", "readonly","readonly");
							card.setAttribute("price", "readonly","readonly");
						}
						card.setValue("ifCharge", dataType.ifCharge);
					},
					"click .J-ifCharge" : function(e) {
						var card = this.get("card");
						var pk = card.getValue("ifCharge");
						if(pk[0]==true){
							card.removeAttribute("maxFees","readonly");
							card.removeAttribute("minFees","readonly");
							card.removeAttribute("price","readonly");
						}else{
							card.setAttribute("maxFees", "readonly","readonly");
							card.setAttribute("minFees", "readonly","readonly");
							card.setAttribute("price", "readonly","readonly");
						}
						
					}
				},
				initSubnav : function(widget) {
					return {
						model : {
							title : "商品/服务明细",
							search : function(str) {
								var g = widget.get("list");
								aw.ajax({
											url : "api/waresdetail/search",
											data : {
												s : str,
												properties : "code,ifCharge,price,measurements,minFees,maxFees,name,description,brand,origin,waresClass.name",
												fetchProperties : "*,waresClass.name,measurements.value"
											},
											dataType : "json",
											success : function(data) {
													g.setData(data);
											}
										});
							},
							buttons : [{
										id : "adds",
										text : "新增",
										handler : function() {
											var card=widget.get("card");
											card.reset();
											widget.list2Card(true);
											
											var pk = widget.get("subnav").getValue("waresClass");
											card.setValue("waresClass",pk);
											var dataType = card.getData("waresClass", {
												pk : pk
											});
											card.setData(dataType);
											card.setValue("currency", "RMB");
											card.setValue("name", "");
											card.setValue("waresClass", widget.get("subnav").getValue("waresClass"));
											if(pk!=""){
												card.setValue("code",dataType.code+"-");
											}
											if(dataType.ifCharge=="true"){
												card.removeAttribute("maxFees","readonly");
												card.removeAttribute("minFees","readonly");
												card.removeAttribute("price", "readonly");
												
											}else{
												card.setAttribute("maxFees", "readonly","readonly");
												card.setAttribute("minFees", "readonly","readonly");
												card.setAttribute("price", "readonly","readonly");
											}
											widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-search");
											widget.get("subnav").hide(["waresClass"]);
										}
									},{
										id : "return",
										text : "返回",
										show : false,
										handler : function() {
											widget.get("subnav").show(["search","waresClass","adds"]);
											widget.hide(".J-card,.J-return").show(".J-list");
											return false;
										}
									} ],
							buttonGroup : [ {
								id : "waresClass",
								showAllFirst:true,
								showAll:true,
								url : "api/waresclass/query",
								key : "pkWaresClass",
								value : "name",
								lazy : true,
								items : [],
								handler : function(key, element) {
									widget.get("list").refresh({
										"waresClass" : key
									});
									widget.get("card").setValue("waresClass", key);
								}
							} ],
						}
					};
				},
				initList : function(widget) {
					return {
						url : "api/waresdetail/query",
						autoRender:false,
						fetchProperties : "*,waresClass.name,measurements.value",
						params : function() {
							var subnav = widget.get("subnav");
							return {
								"waresClass" : subnav.getValue("waresClass"),
							};
						},
						model : {
							columns : [{
										key : "code",
										name : "编码"
									},{
										key : "name",
										name : "名称 "
									},{
										key : "ifCharge",
										name : "是否收费 ",
										format : function(value, row) {
											return value ? "是" : "否"
										}
									},{
										key : "price",
										name : "单价 "
									},{
										key : "measurements.value",
										name : "计量单位"
									},{
										key : "maxFees",
										name : "收费上限"
									},{
										key : "minFees",
										name : "收费下限"
									},{
										key : "waresClass.name",
										name : "分类"
									},{
										key : "brand",
										name : "品牌"
									},{
										key : "origin",
										name : "产地"
									},{
										key : "description",
										name : "备注"
									},{
										key : "operate",
										name : "操作",
										format : "button",
										// format : function(value, row) {
										// if (row.flowStatus.key == "Submit") {
										// return "button";
										// } else {
										// return "";
										// }
										// },
										formatparams : [
												{
													key : "edit",
													icon : "edit",
													handler : function(index,data, rowEle) {
														widget.edit("edit",data);
														var pk = data.ifCharge;
														if(pk=="true"){
															widget.get("card").removeAttribute("maxFees","readonly");
															widget.get("card").removeAttribute("minFees","readonly");
														}else{
															widget.get("card").setAttribute("maxFees", "readonly","readonly");
															widget.get("card").setAttribute("minFees", "readonly","readonly");
														}
														widget.get("subnav").hide(["search","waresClass","adds"]);
													}
												},
												{
													key : "delete",
													icon : "remove",
													handler : function(index,data, rowEle) {
														widget.del("api/waresdetail/"+ data.pkWares+ "/delete");
													}
												} ]

									} ]
						}
					};
				},
				initCard : function(widget) {
					return {
						compType:"form-1.0.0",
						saveaction : function() {
							var data = $("#waresdetail").serializeArray();
							var maxFees = parseInt(data[6].value);
							var minFees = parseInt(data[7].value);
							if (maxFees != null && maxFees != ""&& minFees != null && minFees != "") {
								if (maxFees < minFees) {
									Dialog.tip({
										title : "收费上限必须大于或等于收费下限！"
									});
									return false;
								}
								var price = parseInt(data[10].value);
								if (price != null && price != "") {
									if (price < minFees || price > maxFees) {
										Dialog.tip({
											title : "单价必须在上限和下限的范围内！"
										});
										return false;
									}
								}
							}
							widget.save("api/waresdetail/save", $("#waresdetail").serialize(),function(data){
								widget.get("subnav").show(["search","waresClass","adds"]);
								widget.get("list").refresh();
							});
//							widget.get("subnav").show(["search","waresClass","adds"]);
						},
						//取消按钮
		  				cancelaction:function(){
		  					widget.get("subnav").show(["search","waresClass","adds"]);
							widget.hide(".J-card,.J-return").show(".J-list");
							return false;
		  				},
						model : {
							id : "waresdetail",
							items : [ {
								name : "pkWares",
								type : "hidden"
							}, {
								name : "version",
								defaultValue : "0",
								type : "hidden"
							}, {
								name : "waresClass",
								label : "分类",
								type : "select",
								url : "api/waresclass/query",
								key : "pkWaresClass",
								value : "name",
								validate : [ "required" ]
							}, {
								name : "code",
								label : "编码",
								type : "text"
							}, {
								name : "name",
								label : "名称",
								type : "text"
							}, {
								name : "ifCharge",
								label : "是否收费",
								type : "checklist",
								list : [ {
									key : true,
									value : "收费"
								} ],
							}, {
								name : "maxFees",
								label : "收费上限",
								type : "text"
							}, {
								name : "minFees",
								label : "收费下限",
								type : "text"
							}, {
								name : "measurements",
								label : "计量单位",
								type : "select",
								options : [ {
									key : "Singleton",
									value : "个"
								}, {
									key : "Set",
									value : "套"
								}, {
									key : "Once",
									value : "次"
								}, {
									key : "Piece",
									value : "件"
								}, {
									key : "Part",
									value : "份"
								}, {
									key : "People",
									value : "人次"
								}, {
									key : "Box",
									value : "盒"
								}, {
									key : "Packet",
									value : "包"
								}, {
									key : "Kg",
									value : "公斤"
								}, {
									key : "Day",
									value : "天"
								}, {
									key : "Week",
									value : "周"
								}, {
									key : "Month",
									value : "月"
								} ],
								validate : [ "required" ]
							}, {
								name : "currency",
								label : "币种",
								type : "select",
								options : [ {
									key : "RMB",
									value : "人民币"
								}, {
									key : "USD",
									value : "美元"
								}, {
									key : "HKD",
									value : "港币"
								}, {
									key : "EUR",
									value : "欧元"
								}, {
									key : "JPY",
									value : "日元"
								}, {
									key : "TWD",
									value : "台币"
								}, {
									key : "KRW",
									value : "韩元"
								}, {
									key : "AUD",
									value : "澳元"
								}, {
									key : "CAD",
									value : "加元"
								}, {
									key : "GBP",
									value : "英镑"
								} ],
								validate : [ "required" ]
							}, {
								name : "price",
								label : "单价",
								type : "text"
							}, {
								name : "origin",
								label : "产地",
								type : "text"
							}, {
								name : "brand",
								label : "品牌",
								type : "text"
							}, {
								name : "barcode",
								label : "条码",
								type : "text"
							}, {
								name : "description",
								label : "备注",
								type : "textarea"
							} ]
						}
					};
				},
				afterInitComponent:function(params,widget){
					var subnav=widget.get("subnav");
		        	subnav.load({
						id:"waresClass",
						callback:function(data){
							widget.get("list").refresh();
						}
					});
				}
			});
	module.exports = waresdetail;
});