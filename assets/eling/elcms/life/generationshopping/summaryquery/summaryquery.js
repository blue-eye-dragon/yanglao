define(function(require,exports,module){
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	var MultiRowGrid=require("multirowgrid");
	var template=require("./summaryquery.tpl");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var store = require("store");
	require("./summaryquery.css");
	//多语
	var i18ns = require("i18n");
	var GenerationShoppingSummary=ELView.extend({
		attrs:{
			template:template
		},
		getTotalMny:function(){
			//重新计算金额
			var grid=this.get("list");
			var totalMny=0;
			var data=grid.getData() || [];
			for(var i=0;i<data.length;i++){
				totalMny+=data[i].money || 0;
			}
			totalMny=Math.round(totalMny*100)/100;
			grid.setTitle("合计金额："+totalMny+"元");
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"代购物明细查询",
					buttonGroup:[{
						id:"order",
						items:[{
							key:"summary.billcode:desc",
							value:"汇总单号"
						},{
							key:"member.memberSigning.room.number",
							value:"房间号"
						},{
							key:"",
							value:"默认"
						}],	
						handler:function(key,element){
								widget.get("list").refresh({
									orderString:key||"applicationDate,member.memberSigning.room.number",
									"member.memberSigning.room.building":subnav.getValue("building"),
									member:widget.get("subnav").getValue("defaultMembers"),
									"applicationDate":subnav.getValue("time").start,
									"applicationDateEnd":subnav.getValue("time").end,
									"flowStatus":subnav.getValue("flowstatus")
								},function(){
								widget.getTotalMny();
							});
						}
					},{
						id:"flowstatus",
						showAll:true,
						items:[{
							key:"Closed",
							value:"已发放"
						},{
							key:"Temporary",
							value:"暂存"
						},{
							key:"Commited",
							value:"已提交"
						},{
							key:"Printed",
							value:"已打印"
						},{
							key:"Bought",
							value:"已买回"
						}],	
						handler:function(key,element){
							widget.get("list").refresh(null,function(){
								widget.getTotalMny();
						});
					}
					},{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,data,element){
							var subnav=widget.get("subnav");
							subnav.setValue("defaultMembers","");
							widget.get("list").refresh(null,function(){
								widget.getTotalMny();
							});
							if(key==""){
								subnav.hide("defaultMembers");
							} else{
								subnav.show("defaultMembers");
								subnav.load({
									id:"defaultMembers",
									params : {
										"memberSigning.room.building" : key,
										"statusIn":"Normal,Out,Nursing,Died,Checkout,Behospitalized,Waitting,NotLive,NursingAndBehospitalized",
										fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number",
									}
								});
							}
						}
					},{
						id:"defaultMembers",
						show:false,
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh(null,function(){
								widget.getTotalMny();
							});
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
							widget.get("list").refresh(null,function(){
								widget.getTotalMny();
							});
						}
					},
				}
			});
			this.set("subnav",subnav);
			
			var list=new MultiRowGrid({
				parentNode:".J-list",
				autoRender:false,
				url:"api/generationshoppingapplication/query",
				fetchProperties:"*,summary.purchaser.name,summary.principal.name,member.pkMember,member.personalInfo.name,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description,summary.billcode",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						orderString:"applicationDate,member.memberSigning.room.number",
						"member.memberSigning.room.building":subnav.getValue("building"),
						member:widget.get("subnav").getValue("defaultMembers"),
						"applicationDate":subnav.getValue("time").start,
						"applicationDateEnd":subnav.getValue("time").end,
						"flowStatus":subnav.getValue("flowstatus")
					};
				},
				model:{
					multiField:"shoppinglists",
					head:{
						title:""
					},
					columns:[{
						key:"summary.billcode",
						name:"汇总单号",
						className:"billcode",
//						col:1,
					},{
						key : "member",
						name : i18ns.get("sale_ship_owner","会员"),
						className:"member",
//						col:1,
						format:function(value,row){
							return value.memberSigning.room.number + " " + value.personalInfo.name;
						}
					},{
						key:"shoppinglists",
						multiKey:"name",
						name:"物品名称",
						className:"shoppinglists",
//						col:2,
						isMulti:true
					},{
						key:"shoppinglists",
						multiKey:"quantity",
						name:"数量",
						className:"quantity",
//						col:1,
						isMulti:true
					},{
						key:"money",
						name:"总金额(元)",
						className:"text-right",
						format:"thousands",
//						col:1
					},{
						key:"summary.principal.name",
						name:"负责人",
						className:"principal",
//						col:1
					},{
						key:"summary.purchaser",
						name:"责任秘书",
						className:"purchaser",
//						col:1,
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
						key:"shoppinglists",
						multiKey:"description",
						name:"描述",
						className:"description",
//						col:2,
						isMulti:true
					},{
						key:"flowStatus",
						name:"状态",
						className:"flowStatus",
//						col:1,
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
        	widget.get("list").refresh(null,function(data){
    			widget.getTotalMny();
			});
        }
	});
	
	module.exports=GenerationShoppingSummary;
});