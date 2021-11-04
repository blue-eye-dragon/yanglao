 define(function(require,exports,module){
	 var ELView = require("elview");
	 var Subnav = require("subnav");
	 var aw = require("ajaxwrapper");
	 var Grid = require("grid");
	 require("./checkdetailedregistration.css");
	 var template="<div class='el-checkdetailedregistration'>"+
		"<div class='J-subnav'></div>"+
	 	"<div class='J-grid'></div> " +
	 	"</div>";
	 //var template=require("./checkdetailedregistration.tpl");
//	 function setTableData(model,aw,widget){
//			var building = widget.get("subnav").getValue("building");
//			var year = widget.get("subnav").getValue("year").start;
//			var yearEnd = widget.get("subnav").getValue("year").end;
//			aw.ajax({
//				url:"api/report/checkdetailedregistration",
//				type : "POST",
//				data : {
//					 pkBuilding:building,
//					 year:year,
//					 yearEnd:yearEnd,
//					 fetchProperties:"*"
//				},
//				success : function(datas) {
//					model.data=datas;
//					widget.renderPartial(".J-grid-table");
//				}
//			});
//		}
	 var checkdetailedregistration=ELView.extend({
		 attrs:{
			 template:template,
			 //model : {}
		 },
		 initComponent : function(params,widget) {
			 var model=this.get("model");
			 var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
					 title:"入住明细登记表",
					 items:[{
							id:"building",
							type:"buttongroup",
							tip:"楼号",
							keyField : "pkBuilding",   
							valueField : "name",
							showAll : true,
							showAllFirst : true,
							url : "api/building/query",
							params : function(){
								return {
									"useType":"Apartment",
									fecthProperties:"pkBuilding,name"
								};
							}, 
							handler : function(key,element) {
								widget.get("grid").refresh();
							}
					 },{
						    id : "year",
							type : "daterange",
							tip : "入住日期",
							ranges : {
								"本月": [moment().startOf("month"), moment().endOf("month")],
								"本年": [moment().startOf("year"), moment().endOf("year")],
								"去年": [moment().subtract(1,"year").startOf("year"), moment().subtract(1,"year").endOf("year")]
							},
							defaultRange : "本月",
							minDate: "1990-01-01",
							maxDate: "2050-12-31",
							handler : function(time){
								widget.get("grid").refresh();
							}
					 },{
							id:"toexcel",
	 						text:"导出",
	 						type:"button",
	 						handler:function(){
	 							var subnav=widget.get("subnav");
	 							window.open("api/checkdetailedregistration/toexcel?pkBuilding="+subnav.getValue("building")+
	 									"&year="+subnav.getValue("year").start+
	 									"&yearEnd="+subnav.getValue("year").end
	 							);
	 							return false;
	 						}
					 }]
				 }  
			 });
			 this.set("subnav",subnav);
			 var grid = new Grid({
				 parentNode:".J-grid",
				 autoRender:false,
				 model : {
					 url:"api/report/checkdetailedregistration",
					 params:function(){
						 var subnav=widget.get("subnav");
						 return {
							 pkBuilding:subnav.getValue("building"),
							 year:subnav.getValue("year").start,
							 yearEnd:subnav.getValue("year").end,
							 fetchProperties:"*",
						 };
					 },
					 columns : [{
						 name:"buildingName",
						 label:"楼号",
						 className:"buildingName",
					 },{
						 name:"roomNumber",
						 label:"房号",
						 className:"roomNumber",
					 },{
						 name:"roomType",
						 label:"户型",
						 className:"roomType",
					 },{
						 name:"cardNumber",
						 label:"卡号",
						 className:"cardNumber",
					 },{
						 name:"memberShipFees",
						 label:"卡费标准",
						 className:"memberShipFees",
					 },{
						 name:"personName",
						 label:"权益人",
						 className:"personName",
					 },{
						 name:"memName",
						 label:"会员",
						 className:"memName",
					 },{
						 name:"memStauts",
						 label:"会员状态",
						 className:"memStauts",
					 },{
						 name:"memPhone",
						 label:"联系电话",
						 className:"memPhone",
					 },{
						 name:"annualFee",
						 label:"年费标准",
						 className:"annualFee",
					 },{
						 name:"realAnnualFees",
						 label:"实际年费",
						 className:"realAnnualFees",
					 },{
						 name:"payername",
						 label:"年费支付人",
						 className:"payername",
					 },{
						 name:"beginDate",
						 label:"合同签约日/年费起算日",
						 className:"beginDate",
					 },{
						 name:"checkInDate",
						 label:"入住日期",
						 className:"checkInDate",
					 },{
						 name:"epName",
						 label:"紧急联系人",
						 className:"epName",
					 },{
						 name:"epPhone",
						 label:"联系电话",
						 className:"epPhone",
					 },{
						 name:"userName",
						 label:"招募专员",
						 className:"userName",
					 },{
						 name:"memFullname",
						 label:"籍贯",
						 className:"memFullname",
					 }]
				 }
			 });
			 this.set("grid",grid);
			 $(".J-grid").css("width","3000px");
		 },
		 afterInitComponent:function(params,widget){
			 widget.get("subnav").load("building",{
	         		callback:function(){
	         			widget.get("grid").refresh();
	         		}
	         	});
		 }
	 });
	 module.exports=checkdetailedregistration;
 })


