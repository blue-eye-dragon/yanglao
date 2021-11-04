define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-1.0.0");
	var Grid=require("grid-1.0.0");
	//多语
	var i18ns = require("i18n");
	var MultiRowGrid=require("multirowgrid");
	 var template="<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>" +	
		"<div class='J-list hidden'></div>";
	
	var GenerationShoppingApplicationBillSummary = ELView.extend({
		attrs:{
			template:template
		},
		getTotalMny:function(){
			//重新计算金额
			var grid=this.get("grid");
			var totalMny=0;
			var data=grid.getData() || [];
			for(var i=0;i<data.length;i++){
				totalMny+=data[i].totalMoney || 0;
			}
			totalMny=Math.round(totalMny*100)/100;
			grid.setTitle("合计金额："+totalMny+"元");
		},
		initComponent:function(params,widget){		
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"代购物汇总查询",
				    buttons:[{
							id:"return",
							text:"返回",
							show:false,
							handler:function(){
								widget.show(".J-grid").hide(".J-list,.J-return");
								return false;
							}
						}],
					time:{
						ranges:{
							"上周":[moment().subtract(1,"weeks").startOf("week"), moment().subtract(1,"weeks").endOf("week")],
							"本周": [moment().startOf("week"), moment().endOf("week")],
							"本月": [moment().startOf("month"), moment().endOf("month")],
						},
						defaultTime:"本周",
						click:function(time){
							widget.get("grid").refresh(null,function(){
								widget.getTotalMny();
							});
						}
					},
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				url:"api/generationshoppingapplicationsummary/query",				
				params:function(){
					return {
						fetchProperties:"billcode,apps.money,appsCount,totalMoney,pkGenerationShoppingApplicationSummary,shoppingDate",
						"shoppingDate":widget.get("subnav").getValue("time").start,
						"shoppingDateEnd":widget.get("subnav").getValue("time").end,
						orderString:"shoppingDate:desc",
					};
				},
				parentNode:".J-grid",
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"billcode",
						name:"汇总单号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,rowData,rowEle){
								aw.ajax({
									url : "api/generationshoppingapplication/query",
									type : "POST",
									data : {
										summary:rowData.pkGenerationShoppingApplicationSummary,
										fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,shoppinglists.name,shoppinglists.quantity,shoppinglists.description"
									},
									dataType:"json",
									success : function(data){
										widget.get("list").setData(data);
										widget.get("list").setTitle("汇总单号"+rowData.billcode);
										widget.show(".J-list,.J-return").hide(".J-grid");
									}	
								});
							}
						}]
					},{
						key:"shoppingDate",
						name:"购物日期",
						format:"date",
					},{
						key:"appsCount",
						name:"代购人数",										
					},{
						key:"totalMoney",
						name:"代购金额",
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
					}]
				}
			});
			this.set("grid",grid);
			
			var list=new MultiRowGrid({
				parentNode:".J-list",
				model:{
					multiField:"shoppinglists",
					head:{
						title:""
					},
					columns:[{
						key : "member",
						name : i18ns.get("sale_ship_owner","会员"),
						col:2,
						format:function(value,row){
							return value.memberSigning.room.number + " " + value.personalInfo.name;
						}
					},{
						key:"money",
						name:"金额",
						col:1,
					},{
						key:"shoppinglists",
						multiKey:"name",
						name:"物品名称",
						col:2,
						isMulti:true
					},{
						key:"shoppinglists",
						multiKey:"quantity",
						name:"数量",
						col:2,
						isMulti:true
					},{
						key:"shoppinglists",
						multiKey:"description",
						name:"描述",
						col:3,
						isMulti:true
					},{
						key:"flowStatus",
						name:"状态",
						col:1,
						format:function(value,row){
							var status={
								Temporary:"暂存",
								Commited:"已提交",
								Printed:"已打印",
								Bought:"已买回",
								Closed:"已发放"
							};
							return status[value];
						}
					}]
				}
			});
			this.set("list",list);
		
		},
        afterInitComponent:function(params,widget){
        	widget.get("grid").refresh(null,function(data){
				if(data.length!=0){
        			widget.getTotalMny();
        		}
			});
        },
	});
	module.exports = GenerationShoppingApplicationBillSummary;
});