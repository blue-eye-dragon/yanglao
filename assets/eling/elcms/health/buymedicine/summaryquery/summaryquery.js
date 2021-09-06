/**
 * 代配药汇总查询
 */
define(function(require,exports,module){
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var SummaryQuery=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"代配药汇总查询",
					time:{
						ranges:{
							"上周":[moment().subtract(1,"weeks").startOf("week"), moment().subtract(1,"weeks").endOf("week")],
							"本周": [moment().startOf("week"), moment().endOf("week")],
							"本月": [moment().startOf("month"), moment().endOf("month")],
						},
						defaultTime:"本周",
						click:function(time){
							widget.get("list").refresh();
						}
					},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/buymedicineapplicationsummary/query",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						purchaseDate:time.start,
						purchaseDateEnd:time.end,
						fetchProperties:"*,principal.pkUser,principal.name,purchaser.name,purchaseDate,apps.money",
						orderString:"purchaseDate:desc"
					};
				},
				model:{
					columns:[{
						key:"purchaseDate",
						name:"汇总单号",
						format:function(value,row){
							return moment(value).format("YYYYMMDDHHmm");
						}
					},{
						key:"principal.name",
						name:"负责人"
					},{
						key:"purchaser",
						name:"责任秘书",
						format:function(value,row){
							var ret="";
							if(value && value.length){
								for(var i=0;i<value.length;i++){
									ret+=value[i].name+"，";
								}
								return ret.substring(0,ret.length-1);
							}
							return "";
						}
					},{
						key:"purchaseDate",
						name:"购买日期",
						format:"date"
					},{
						key:"totalMoney",
						name:"购买金额",
						format:function(row,value){
							if(row){
								if(row==0){
									return 0;
								}else{
									return row.toFixed(2);
								}
							}else{
								return 0;
							}
						}
					},{
						key:"operate",
						name:"查看详情",
						format:"button",
						formatparams:[{
							key:"detail",
							text:"查看详情",
							handler:function(index,rowData,rowEL){
								aw.ajax({
									url:"api/buymedicineapplication/query",
									data:{
										summary:rowData.pkBuyMedicineApplicationSummary,
										fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number," +
												"items.medicine.name,items.quantity,items.itemdescription,flowStatus,summary.purchaseDate"
									},
									dataType:"json",
									success:function(data){
										if(data){
											widget.get("card").setData(data);
										}
										var title=moment(data[0].summary.purchaseDate).format("YYYYMMDD");
										if(rowData.principal){
											title+="（负责人："+rowData.principal.name+"）";
										}
										widget.get("card").setTitle(title);
										widget.list2Card(true);
									}
								});
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"multirowgrid",
				model:{
					multiField:"items",
					head:{
						title:""
					},
					columns:[{
						key : "member",
						name : i18ns.get("sale_ship_owner","会员"),
						col:2,
						format:function(value,row){
							return value.personalInfo.name + " " + value.memberSigning.room.number;
						}
					},{
						key:"items",
						multiKey:"medicine.name",
						name:"物品名称",
						col:2,
						isMulti:true
					},{
						key:"items",
						multiKey:"quantity",
						name:"数量",
						col:2,
						isMulti:true
					},{
						key:"items",
						multiKey:"itemdescription",
						name:"描述",
						col:3,
						isMulti:true
					},{
						key:"money",
						name:"金额",
						col:2,
						format:function(row,value){
							if(row){
								if(row==0){
									return 0;
								}else{
									return row.toFixed(2);
								}
							}else{
								return 0;
							}
						}
					},{
						key:"flowStatus.value",
						name:"状态",
						col:1
					}]
				}
			};
		}
	});
	
	module.exports=SummaryQuery;
});