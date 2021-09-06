 define(function(require,exports,module){
	 var ELView = require("elview");
	 var Subnav = require("subnav");
	 var Grid = require("grid");
	 require("../../grid_css.css");
	 var template="<div class='el-houseingnotcheckin'>"+
		"<div class='J-subnav'></div>"+
	 	"<div class='J-grid'></div> " +
	 	"</div>";
	 var houseingnotcheckin=ELView.extend({
		 attrs:{
			 template:template
		 },
		 initComponent : function(params,widget) {
			 var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
					 title:"会籍未入住明细",
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
	        				id:"cardType",
	        				tip:"卡类型",
	        				type:"buttongroup",
	        				keyField:"pkMemberShipCardType",
	        				showAll:true,
	        				showAllFirst:true,
	        				valueField:"name",
	        				url:"api/cardtype/query",
	        				handler:function(key,element){
	        					   widget.get("grid").refresh();
	        				}
					 },{
							id:"toexcel",
	 						text:"导出",
	 						type:"button",
	 						handler:function(){
	 							var subnav=widget.get("subnav");
	 							window.open("api/houseingnotcheckin/toexcel?pkBuilding="+subnav.getValue("building")+
	 									"&pkmembershipcardtype="+subnav.getValue("cardType")
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
					 url:"api/report/houseingnotcheckin",
					 params:function(){
						 var subnav=widget.get("subnav");
						 return {
							 pkBuilding:subnav.getValue("building"),
							 pkmembershipcardtype:subnav.getValue("cardType"),
							 fetchProperties:"cardNumber,signDate,pName," +
							 		"pAdress,pPhone,pMobilephone,bName," +
							 		"roomNumber,rtName,checkIn,dueAnnualFees," +
							 		"realAnnualFees,sales",
						 };
					 },
					 columns : [{
						 name:"cardNumber",
						 label:"卡号",
						 className:"oneColumn",
					 },{
						 name:"signDate",
						 label:"会籍签约日期",
						 className:"oneColumn",
					 },{
						 name:"pName",
						 label:"权益人",
						 className:"oneColumn",
					 },{
						 name:"pAdress",
						 label:"居住地址",
						 className:"twoColumn",
					 },{
						 name:"pPhone",
						 label:"联系电话",
						 className:"twoColumn",
					 },{
						 name:"pMobilephone",
						 label:"手机",
						 className:"oneColumn",
					 },{
						 name:"bName",
						 label:"楼栋",
					 },{
						 name:"roomNumber",
						 label:"房间号",
					 },{
						 name:"rtName",
						 label:"户型",
					 },{
						 name:"checkIn",
						 label:"是否入住",
					 },{
						 name:"dueAnnualFees",
						 label:"年费标准",
					 },{
						 name:"realAnnualFees",
						 label:"实际年费",
					 },{
						 name:"sales",
						 label:"销售员",
						 className:"oneColumn",
					 }]
				 }
			 });
			 this.set("grid",grid);
			 
		 },
		 afterInitComponent:function(params,widget){
			 widget.get("subnav").load("building",{
         		callback:function(){
         			widget.get("grid").refresh();
         		}
         	 });
		 }
	 });
	 module.exports=houseingnotcheckin;
})


