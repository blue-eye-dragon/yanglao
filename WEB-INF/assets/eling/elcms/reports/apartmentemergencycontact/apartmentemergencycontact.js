 define(function(require,exports,module){
	 var ELView = require("elview");
	 var Subnav = require("subnav");
	 var Grid = require("grid");
	 require("../../grid_css.css");
	 var MultiRowGrid=require("multirowgrid");
	 var template="<div class='el-apartmentemergencycontact'>"+
		"<div class='J-subnav'></div>"+
	 	"<div class='J-grid'></div> " +
	 	"</div>";
	 var apartmentemergencycontact=ELView.extend({
		 attrs:{
			 template:template
		 },
		 initComponent : function(params,widget) {
			 var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
					 title:"公寓紧急联系人名单",
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
							id:"toexcel",
	 						text:"导出",
	 						type:"button",
	 						handler:function(){
	 							var subnav=widget.get("subnav");
	 							window.open("api/apartmentemegencycontact/toexcel?pkBuilding="+subnav.getValue("building"));
	 							return false;
	 						}
					 }]
				 }
			 });
			 this.set("subnav",subnav);
			 var grid = new MultiRowGrid({
				 parentNode:".J-grid",
				 autoRender:false,
				 url:"api/report/apartmentemegencycontact",
				 params:function(){
					 var subnav=widget.get("subnav");
					 return {
						 pkBuilding:subnav.getValue("building"),
						 fetchProperties:"roomNumber,name," +
						 		"apartmentEmegencyContact.contactsname," +
						 		"apartmentEmegencyContact.contactsphone," +
						 		"apartmentEmegencyContact.contactsmobilephone," +
						 		"apartmentEmegencyContact.contactsaddress"
					 };
				 },
				 model : {
					 multiField:"apartmentEmegencyContact",
					 columns : [{
						 key:"roomNumber",
						 name:"房间号",
						 className:"oneColumn",
					 },{
						 key:"name",
						 name:"会员姓名",
						 className:"oneHalfColumn",
					 },{
						 key:"apartmentEmegencyContact",
						 name:"联系人姓名",
						 multiKey:"contactsname",
						 isMulti:true,
						 className:"oneHalfColumn",
					 },{
						 key:"apartmentEmegencyContact",
						 name:"联系人固定电话",
						 multiKey:"contactsphone",
						 isMulti:true,
						 className:"twoColumn",
					 },{
						 key:"apartmentEmegencyContact",
						 name:"联系人手机",
						 multiKey:"contactsmobilephone",
						 isMulti:true,
						 className:"twoColumn",
					 },{
						 key:"apartmentEmegencyContact",
						 name:"联系人地址",
						 multiKey:"contactsaddress",
						 isMulti:true,
						 className:"twoColumn",
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
	 module.exports=apartmentemergencycontact;
 })


